import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ====================== Dashboard Stats ======================
app.get('/api/stats', async (_req, res) => {
  try {
    const [totalOfficers, availableOfficers, deployedOfficers, totalEvents, highThreatEvents, activeEvents, totalDuties, aiDuties] = await Promise.all([
      prisma.officer.count(),
      prisma.officer.count({ where: { availability: 'Available' } }),
      prisma.officer.count({ where: { availability: 'Deployed' } }),
      prisma.vIPEvent.count(),
      prisma.vIPEvent.count({ where: { threat: 'High' } }),
      prisma.vIPEvent.count({ where: { status: { not: 'Completed' } } }),
      prisma.dutyAssignment.count(),
      prisma.dutyAssignment.count({ where: { aiGenerated: true } }),
    ]);
    res.json({ totalOfficers, availableOfficers, deployedOfficers, totalEvents, highThreatEvents, activeEvents, totalDuties, aiDuties });
  } catch { res.status(500).json({ error: 'Failed to fetch stats' }); }
});

// ====================== VIP Events ======================
app.get('/api/events', async (_req, res) => {
  try {
    const events = await prisma.vIPEvent.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(events);
  } catch { res.status(500).json({ error: 'Failed to fetch events' }); }
});

app.post('/api/events', async (req, res) => {
  try {
    const { eventId, name, date, venue, threat, status } = req.body;
    const event = await prisma.vIPEvent.create({ data: { eventId, name, date, venue, threat, status } });
    res.status(201).json(event);
  } catch { res.status(500).json({ error: 'Failed to create event' }); }
});

app.patch('/api/events/:id', async (req, res) => {
  try {
    const event = await prisma.vIPEvent.update({ where: { id: req.params.id }, data: req.body });
    res.json(event);
  } catch { res.status(500).json({ error: 'Failed to update event' }); }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await prisma.dutyAssignment.deleteMany({ where: { eventId: req.params.id } });
    await prisma.vIPEvent.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to delete event' }); }
});

// ====================== Officers ======================
app.get('/api/officers', async (_req, res) => {
  try {
    const officers = await prisma.officer.findMany({ orderBy: { createdAt: 'asc' } });
    res.json(officers);
  } catch { res.status(500).json({ error: 'Failed to fetch officers' }); }
});

app.post('/api/officers', async (req, res) => {
  try {
    const officer = await prisma.officer.create({ data: req.body });
    res.status(201).json(officer);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/officers/:id', async (req, res) => {
  try {
    const officer = await prisma.officer.update({ where: { id: req.params.id }, data: req.body });
    res.json(officer);
  } catch { res.status(500).json({ error: 'Failed to update officer' }); }
});

app.delete('/api/officers/:id', async (req, res) => {
  try {
    await prisma.officer.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to delete officer' }); }
});

// ====================== Duty Assignments ======================
app.get('/api/duties', async (req, res) => {
  try {
    const { eventId } = req.query;
    const duties = await prisma.dutyAssignment.findMany({
      where: eventId ? { eventId: String(eventId) } : {},
      include: { officer: true, event: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(duties);
  } catch { res.status(500).json({ error: 'Failed to fetch duties' }); }
});

app.post('/api/duties', async (req, res) => {
  try {
    const assignId = `DA-${Date.now().toString().slice(-6)}`;
    const duty = await prisma.dutyAssignment.create({
      data: { assignId, ...req.body },
      include: { officer: true, event: true }
    });
    await prisma.officer.update({ where: { id: req.body.officerId }, data: { availability: 'Deployed' } });
    res.status(201).json(duty);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/duties/:id', async (req, res) => {
  try {
    const duty = await prisma.dutyAssignment.update({
      where: { id: req.params.id }, data: req.body,
      include: { officer: true, event: true }
    });
    res.json(duty);
  } catch { res.status(500).json({ error: 'Failed to update duty' }); }
});

app.delete('/api/duties/:id', async (req, res) => {
  try {
    const duty = await prisma.dutyAssignment.findUnique({ where: { id: req.params.id } });
    if (duty) await prisma.officer.update({ where: { id: duty.officerId }, data: { availability: 'Available' } });
    await prisma.dutyAssignment.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to delete duty' }); }
});

// ====================== AI Duty Assignment Engine ======================
// Rank hierarchy: lower index = senior
const RANK_ORDER = ['DGP','ADG','IG','DIG','SSP','SP','ASP','DSP','Inspector','Sub-Inspector','Head Constable','Constable'];

// Role requirements per threat level — each entry specifies required rank ceiling
const THREAT_PLANS: Record<string, { zone: string; role: string; minRankIdx: number; maxRankIdx: number; count: number }[]> = {
  High: [
    { zone: 'Zone 1 – Inner Cordon', role: 'Sector Incharge',  minRankIdx: 6,  maxRankIdx: 9,  count: 2 },
    { zone: 'Zone 1 – Inner Cordon', role: 'Close Protection', minRankIdx: 8,  maxRankIdx: 10, count: 3 },
    { zone: 'Zone 2 – Outer Cordon', role: 'Route Mobile',     minRankIdx: 7,  maxRankIdx: 10, count: 2 },
    { zone: 'Zone 2 – Outer Cordon', role: 'Checkpost',        minRankIdx: 10, maxRankIdx: 11, count: 4 },
    { zone: 'Zone 3 – Route A',      role: 'Traffic Control',  minRankIdx: 9,  maxRankIdx: 11, count: 3 },
    { zone: 'Zone 4 – Reserve',      role: 'Quick Response Team', minRankIdx: 7, maxRankIdx: 10, count: 2 },
  ],
  Medium: [
    { zone: 'Zone 1 – Inner Cordon', role: 'Sector Incharge',  minRankIdx: 8,  maxRankIdx: 9,  count: 1 },
    { zone: 'Zone 1 – Inner Cordon', role: 'Beat Officer',     minRankIdx: 9,  maxRankIdx: 11, count: 3 },
    { zone: 'Zone 2 – Outer Cordon', role: 'Route Mobile',     minRankIdx: 8,  maxRankIdx: 10, count: 2 },
    { zone: 'Zone 3 – Route A',      role: 'Traffic Control',  minRankIdx: 10, maxRankIdx: 11, count: 2 },
  ],
  Low: [
    { zone: 'Zone 1 – Inner Cordon', role: 'Sector Incharge',  minRankIdx: 9,  maxRankIdx: 10, count: 1 },
    { zone: 'Zone 1 – Inner Cordon', role: 'Beat Officer',     minRankIdx: 10, maxRankIdx: 11, count: 3 },
    { zone: 'Zone 3 – Route A',      role: 'Traffic Control',  minRankIdx: 10, maxRankIdx: 11, count: 2 },
  ]
};
const SHIFTS = ['Morning (6AM–2PM)', 'Afternoon (2PM–10PM)', 'Night (10PM–6AM)'];

app.post('/api/duties/ai-assign', async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await prisma.vIPEvent.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const plan = THREAT_PLANS[event.threat] || THREAT_PLANS['Medium'];
    const allOfficers = await prisma.officer.findMany({ where: { availability: 'Available' } });
    if (allOfficers.length === 0) return res.status(400).json({ error: 'No available officers. Please mark officers as Available first.' });

    const usedIds = new Set<string>();
    const assignments = [];
    let sectorNo = 1;

    for (const slot of plan) {
      const candidates = allOfficers.filter(o => {
        if (usedIds.has(o.id)) return false;
        const idx = RANK_ORDER.indexOf(o.rank);
        return idx >= slot.minRankIdx && idx <= slot.maxRankIdx;
      });

      // If exact rank not found, relax constraint and pick nearest available
      const fallback = candidates.length === 0
        ? allOfficers.filter(o => !usedIds.has(o.id)).slice(0, slot.count)
        : candidates;

      const toAssign = fallback.slice(0, slot.count);

      for (let i = 0; i < toAssign.length; i++) {
        const officer = toAssign[i];
        const assignId = `AI-${Date.now().toString().slice(-5)}-${sectorNo}`;
        const duty = await prisma.dutyAssignment.create({
          data: {
            assignId,
            officerId: officer.id,
            eventId,
            zone: slot.zone,
            sector: `Sector ${sectorNo}`,
            role: slot.role,
            shift: SHIFTS[i % SHIFTS.length],
            reportingAt: event.venue,
            reportingTo: 'Event Commander',
            status: 'Assigned',
            aiGenerated: true,
          },
          include: { officer: true, event: true }
        });
        await prisma.officer.update({ where: { id: officer.id }, data: { availability: 'Deployed' } });
        usedIds.add(officer.id);
        assignments.push(duty);
        sectorNo++;
      }
    }

    res.json({
      message: `AI ने "${event.name}" के लिए ${assignments.length} अधिकारियों की ड्यूटी लगाई।`,
      count: assignments.length,
      assignments
    });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Reset all duties for event (useful for re-running AI)
app.delete('/api/duties/event/:eventId', async (req, res) => {
  try {
    const duties = await prisma.dutyAssignment.findMany({ where: { eventId: req.params.eventId } });
    for (const d of duties) {
      await prisma.officer.update({ where: { id: d.officerId }, data: { availability: 'Available' } });
    }
    await prisma.dutyAssignment.deleteMany({ where: { eventId: req.params.eventId } });
    res.json({ success: true, cleared: duties.length });
  } catch { res.status(500).json({ error: 'Failed to reset duties' }); }
});

// ====================== Seed ======================
async function seedDatabase() {
  const officerCount = await prisma.officer.count();
  if (officerCount === 0) {
    await prisma.officer.createMany({
      data: [
        { badgeNo: 'UPP-001', name: 'DSP Arvind Tiwari',    rank: 'DSP',            unit: 'SOG',            district: 'Lucknow',   phone: '9876543210', speciality: 'IB' },
        { badgeNo: 'UPP-002', name: 'Insp. Rajesh Kumar',   rank: 'Inspector',      unit: '18th Bn PAC',    district: 'Lucknow',   phone: '9876543211', speciality: 'General' },
        { badgeNo: 'UPP-003', name: 'Insp. Sunita Devi',    rank: 'Inspector',      unit: 'Women Police',   district: 'Kanpur',    phone: '9876543212', speciality: 'General' },
        { badgeNo: 'UPP-004', name: 'SI Amit Singh',        rank: 'Sub-Inspector',  unit: 'District Police', district: 'Lucknow', phone: '9876543213', speciality: 'Traffic' },
        { badgeNo: 'UPP-005', name: 'SI Deepak Verma',      rank: 'Sub-Inspector',  unit: 'QRT',            district: 'Agra',      phone: '9876543214', speciality: 'QRT' },
        { badgeNo: 'UPP-006', name: 'HC Ramesh Yadav',      rank: 'Head Constable', unit: 'District Police', district: 'Varanasi', phone: '9876543215', speciality: 'General' },
        { badgeNo: 'UPP-007', name: 'HC Mohan Lal',         rank: 'Head Constable', unit: 'Traffic',        district: 'Agra',      phone: '9876543216', speciality: 'Traffic' },
        { badgeNo: 'UPP-008', name: 'Const. Suresh Kumar',  rank: 'Constable',      unit: 'District Police', district: 'Varanasi', phone: '9876543217', speciality: 'General' },
        { badgeNo: 'UPP-009', name: 'Const. Priya Sharma',  rank: 'Constable',      unit: 'Women Police',   district: 'Lucknow',   phone: '9876543218', speciality: 'General' },
        { badgeNo: 'UPP-010', name: 'Const. Vikram Singh',  rank: 'Constable',      unit: 'District Police', district: 'Kanpur',  phone: '9876543219', speciality: 'General' },
        { badgeNo: 'UPP-011', name: 'Const. Raju Patel',    rank: 'Constable',      unit: 'District Police', district: 'Varanasi', phone: '9876543220', speciality: 'General' },
        { badgeNo: 'UPP-012', name: 'Const. Shyam Lal',     rank: 'Constable',      unit: 'PAC',            district: 'Allahabad', phone: '9876543221', speciality: 'General' },
        { badgeNo: 'UPP-013', name: 'ASP Meera Singh',      rank: 'ASP',            unit: 'Crime Branch',   district: 'Lucknow',   phone: '9876543222', speciality: 'IB' },
        { badgeNo: 'UPP-014', name: 'SI Rahul Gupta',       rank: 'Sub-Inspector',  unit: 'District Police', district: 'Agra',    phone: '9876543223', speciality: 'General' },
        { badgeNo: 'UPP-015', name: 'HC Geeta Kumari',      rank: 'Head Constable', unit: 'Women Police',   district: 'Varanasi',  phone: '9876543224', speciality: 'General' },
      ]
    });
    console.log('✅ 15 Officers seeded.');
  }

  const eventCount = await prisma.vIPEvent.count();
  if (eventCount === 0) {
    await prisma.vIPEvent.createMany({
      data: [
        { eventId: 'EV-2026-081', name: 'Hon. PM Visit to Varanasi', date: '2026-07-15', venue: 'Kashi Vishwanath Temple, Varanasi', threat: 'High',   status: 'Planning' },
        { eventId: 'EV-2026-082', name: 'CM Rally – Lucknow',        date: '2026-06-28', venue: 'Ramabai Ambedkar Ground, Lucknow', threat: 'Medium', status: 'Deployed' },
        { eventId: 'EV-2026-083', name: 'Foreign Delegation – Agra', date: '2026-07-02', venue: 'Taj Mahal Complex, Agra',          threat: 'High',   status: 'ASL Pending' },
      ]
    });
    console.log('✅ 3 VIP Events seeded.');
  }
}

app.listen(port, async () => {
  console.log(`🚀 VDMS Backend running on http://localhost:${port}`);
  await seedDatabase();
});
