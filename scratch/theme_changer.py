import os
import re

files_to_process = [
    r'c:\Users\DELL\Downloads\DBMS police\frontend\src\App.tsx',
    r'c:\Users\DELL\Downloads\DBMS police\frontend\src\pages\AIDashboard.tsx',
    r'c:\Users\DELL\Downloads\DBMS police\frontend\src\pages\DutyAssignment.tsx',
    r'c:\Users\DELL\Downloads\DBMS police\frontend\src\pages\ForceDeployment.tsx',
    r'c:\Users\DELL\Downloads\DBMS police\frontend\src\pages\Login.tsx',
    r'c:\Users\DELL\Downloads\DBMS police\frontend\src\pages\OfficersRegistry.tsx',
    r'c:\Users\DELL\Downloads\DBMS police\frontend\src\pages\VIPEvents.tsx',
    r'c:\Users\DELL\Downloads\DBMS police\frontend\src\pages\Map.tsx',
    r'c:\Users\DELL\Downloads\DBMS police\frontend\src\pages\Incidents.tsx',
    r'c:\Users\DELL\Downloads\DBMS police\frontend\src\pages\ReportsAnalytics.tsx',
    r'c:\Users\DELL\Downloads\DBMS police\frontend\src\pages\Security.tsx',
    r'c:\Users\DELL\Downloads\DBMS police\frontend\src\pages\OfficerMobileView.tsx'
]

def replace_theme(text):
    # Colors
    text = re.sub(r'\bbg-slate-950\b', 'bg-slate-50', text)
    text = re.sub(r'\bbg-slate-900\b', 'bg-white', text)
    text = re.sub(r'\bbg-slate-800\b', 'bg-slate-50', text)
    text = re.sub(r'\bbg-slate-900/60\b', 'bg-white shadow-sm', text)
    text = re.sub(r'\bbg-slate-950/40\b', 'bg-slate-50/80', text)
    text = re.sub(r'\bbg-slate-800/60\b', 'bg-slate-50', text)
    text = re.sub(r'\bbg-slate-800/40\b', 'bg-white shadow-sm', text)
    text = re.sub(r'\bbg-slate-800/50\b', 'bg-slate-50', text)
    text = re.sub(r'\bbg-slate-900/50\b', 'bg-white', text)
    
    # Text (Avoid replacing text-white when part of button bg-color combinations, but it's hard. 
    # We will do negative lookbehinds if needed, but for now we replace global text-white that are stand-alone)
    # Actually, it's safer to leave text-white on primary buttons and only change structural text.
    # We can replace text-white with text-slate-800, and then fix buttons.
    text = re.sub(r'\btext-white(?!/)\b', 'text-slate-800', text)
    # Restore text-white for buttons or badges that need it
    text = re.sub(r'(bg-(blue|indigo|purple|emerald|red|orange|yellow)-[56]00.*?)\btext-slate-800\b', r'\1text-white', text)
    
    text = re.sub(r'\btext-slate-200\b', 'text-slate-700', text)
    text = re.sub(r'\btext-slate-300\b', 'text-slate-600', text)
    text = re.sub(r'\btext-slate-400\b', 'text-slate-500', text)
    text = re.sub(r'\btext-slate-500\b', 'text-slate-500', text) # Keep 500
    
    # Borders
    text = re.sub(r'\bborder-slate-800\b', 'border-slate-200', text)
    text = re.sub(r'\bborder-slate-700\b', 'border-slate-200', text)
    text = re.sub(r'\bborder-slate-700/50\b', 'border-slate-200', text)
    text = re.sub(r'\bborder-slate-800/50\b', 'border-slate-200', text)
    text = re.sub(r'\bborder-slate-700/30\b', 'border-slate-100', text)
    text = re.sub(r'\bborder-white/10\b', 'border-slate-200', text)
    text = re.sub(r'\bborder-white/8\b', 'border-slate-200', text)
    
    # Rings
    text = re.sub(r'\bring-slate-800\b', 'ring-slate-200', text)
    
    # Gradients
    text = re.sub(r'\bfrom-slate-900\b', 'from-white', text)
    text = re.sub(r'\bto-slate-800\b', 'to-slate-50', text)
    text = re.sub(r'\bto-slate-900\b', 'to-white', text)
    text = re.sub(r'\bfrom-slate-800\b', 'from-slate-50', text)
    text = re.sub(r'\bfrom-slate-800/60\b', 'from-white', text)
    
    return text

for fp in files_to_process:
    if os.path.exists(fp):
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = replace_theme(content)
        
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Processed {os.path.basename(fp)}")

print("Done")
