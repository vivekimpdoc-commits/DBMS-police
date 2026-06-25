import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

const translations = {
  en: {
    // App & Sidebar
    appName: "VDMS",
    upPolice: "UP Police Control",
    dashboard: "Dashboard",
    vipEvents: "VIP Events",
    forceDeployment: "Force Deployment",
    gisMap: "GIS Map",
    incidents: "Incidents & Comms",
    security: "Security & ASL",
    reports: "Reports",
    aiFeed: "AI & Drone Feed",
    officerApp: "Officer App View",
    analyticsHeading: "Analytics & AI",
    testingViews: "Testing Views",
    logout: "Logout",
    stateControl: "State Control",
    
    // Header
    searchPlaceholder: "Search events, officers, zones...",
    commandCenter: "Command Center",
    online: "Online",

    // Dashboard
    totalForce: "Total Force Deployed",
    fromYesterday: "from yesterday",
    activeVipEvents: "Active VIP Events",
    highThreat: "High Threat Level",
    activeSectors: "Active Sectors",
    allZonesOp: "All zones operational",
    criticalAlerts: "Critical Alerts",
    immediateAction: "Requires immediate action",
    liveDeployment: "Live Deployment Status",
    goToMap: "Go to GIS Map to view Live Tracking",
    liveAlerts: "Live Alerts",
    routeDeviation: "Route Deviation",
    routeMsg: "Escort vehicle UP32AB1234 deviated from planned route in Zone 4.",

    // Login
    selectRole: "Select Role",
    dgpRole: "DGP / ADG (State Control)",
    spRole: "SSP / SP (District Control)",
    coRole: "CO (Sector Management)",
    officerRole: "Officer / Constable (Mobile Duty)",
    passcode: "Passcode / CCTNS ID",
    authenticate: "Authenticate Identity",
    restricted: "Restricted Access. Authorized Personnel Only.",
    
    // Common
    loading: "Loading..."
  },
  hi: {
    // App & Sidebar
    appName: "वी.डी.एम.एस (VDMS)",
    upPolice: "यूपी पुलिस नियंत्रण",
    dashboard: "डैशबोर्ड",
    vipEvents: "वीआईपी कार्यक्रम",
    forceDeployment: "बल तैनाती",
    gisMap: "जीआईएस मैप",
    incidents: "घटनाएँ और संचार",
    security: "सुरक्षा एवं एएसएल (ASL)",
    reports: "रिपोर्ट्स",
    aiFeed: "एआई और ड्रोन फीड",
    officerApp: "अधिकारी मोबाइल ऐप",
    analyticsHeading: "एनालिटिक्स और एआई",
    testingViews: "परीक्षण दृश्य",
    logout: "लॉग आउट",
    stateControl: "राज्य नियंत्रण",
    
    // Header
    searchPlaceholder: "कार्यक्रम, अधिकारी, जोन खोजें...",
    commandCenter: "कमांड सेंटर",
    online: "ऑनलाइन",

    // Dashboard
    totalForce: "कुल तैनात बल",
    fromYesterday: "कल से",
    activeVipEvents: "सक्रिय वीआईपी कार्यक्रम",
    highThreat: "उच्च खतरा स्तर",
    activeSectors: "सक्रिय सेक्टर",
    allZonesOp: "सभी जोन चालू हैं",
    criticalAlerts: "गंभीर अलर्ट",
    immediateAction: "त्वरित कार्रवाई आवश्यक",
    liveDeployment: "लाइव तैनाती स्थिति",
    goToMap: "लाइव ट्रैकिंग के लिए मैप पर जाएं",
    liveAlerts: "लाइव अलर्ट",
    routeDeviation: "मार्ग विचलन",
    routeMsg: "एस्कॉर्ट वाहन UP32AB1234 जोन 4 में निर्धारित मार्ग से भटक गया है।",

    // Login
    selectRole: "भूमिका (Role) चुनें",
    dgpRole: "DGP / ADG (राज्य नियंत्रण)",
    spRole: "SSP / SP (जिला नियंत्रण)",
    coRole: "CO (सेक्टर प्रबंधन)",
    officerRole: "अधिकारी / कांस्टेबल (मोबाइल ड्यूटी)",
    passcode: "पासकोड / CCTNS आईडी",
    authenticate: "पहचान प्रमाणित करें",
    restricted: "प्रतिबंधित प्रवेश। केवल अधिकृत कर्मचारी।",
    
    // Common
    loading: "लोड हो रहा है..."
  }
};

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
