import { useState, useRef, useCallback, useEffect } from "react";

const BRAND = { dark:"#2A1508", cream:"#FAF5EE", gold:"#d4a843" };

const Icon = {
  pen:      (s=18,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  photo:    (s=18,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  gif:      (s=18,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M10 12h-2v-1.5a1.5 1.5 0 0 1 3 0v3"/><line x1="14" y1="9" x2="14" y2="15"/><path d="M18 9h-2v6h2M18 12h-1.5"/></svg>,
  smile:    (s=18,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  music:    (s=18,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  send:     (s=16,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  plus:     (s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash:    (s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  link:     (s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  back:     (s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  upload:   (s=16,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  edit:     (s=10,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  resize:   (s=8, c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  x:        (s=11,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  email:    (s=17,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  message:  (s=17,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  calendar: (s=17,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  download: (s=17,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  printer:  (s=17,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  check:    (s=52,c="#d4a843") =><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  arrow:    (s=16,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  // theme symbols
  cake:     (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20M7 8v2M12 8v2M17 8v2M7 4h.01M12 4h.01M17 4h.01"/></svg>,
  snowflake:(s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 7l-5-5-5 5M17 17l-5 5-5-5"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M7 7l-5 5 5 5M17 7l5 5-5 5"/></svg>,
  heart:    (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  flower:   (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 0 8M12 14a4 4 0 0 0 0 8M2 12a4 4 0 0 1 8 0M14 12a4 4 0 0 0 8 0"/></svg>,
  hug:      (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M5 11c-1 0-2 .8-2 2v4h4v-4c0-1.2-1-2-2-2zM19 11c1 0 2 .8 2 2v4h-4v-4c0-1.2 1-2 2-2z"/><path d="M8 21v-4M16 21v-4M9 11h6"/></svg>,
  star:     (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  leaf:     (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  mail:     (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

const THEMES = [
  { id:"birthday",    name:"Happy Birthday",   icon:"cake",      accent:"#b85c38", accentLight:"#fdf0e8", cover:"linear-gradient(150deg,#fdf0e8,#f8dcc8,#f0c4a8)" },
  { id:"holiday",     name:"Happy Holidays",   icon:"snowflake", accent:"#3a6daa", accentLight:"#eaf2ff", cover:"linear-gradient(150deg,#eaf2ff,#cfe0ff,#b8d0ff)" },
  { id:"thinking",    name:"Thinking of You",  icon:"heart",     accent:"#8b3a7a", accentLight:"#f8eeff", cover:"linear-gradient(150deg,#f8eeff,#ead8ff,#d8c0ff)" },
  { id:"justbecause", name:"Just Because",     icon:"flower",    accent:"#b84878", accentLight:"#fff0f6", cover:"linear-gradient(150deg,#fff0f6,#ffd0e8,#ffb8d8)" },
  { id:"hugs",        name:"Sending Hugs",     icon:"hug",       accent:"#a05820", accentLight:"#fff8ee", cover:"linear-gradient(150deg,#fff8ee,#ffe8c0,#ffd898)" },
  { id:"congrats",    name:"Congratulations",  icon:"star",      accent:"#2a7a50", accentLight:"#eefff6", cover:"linear-gradient(150deg,#eefff6,#c0f0d8,#a0e8c0)" },
  { id:"thankyou",    name:"Thank You",        icon:"leaf",      accent:"#8b4820", accentLight:"#fff8f0", cover:"linear-gradient(150deg,#fff8f0,#ffe0b8,#ffd098)" },
  { id:"blank",       name:"Just a Card",      icon:"mail",      accent:"#5a4030", accentLight:"#faf7f2", cover:"linear-gradient(150deg,#faf7f2,#f0e8dc,#e8ddd0)" },
];

const FONTS = [
  { label:"Playfair",    value:"'Playfair Display', serif" },
  { label:"Lora",        value:"'Lora', serif" },
  { label:"Handwritten", value:"'Dancing Script', cursive" },
  { label:"Literary",    value:"'Crimson Pro', serif" },
];

const EMOJIS = ["❤️","🌹","✨","🌸","💫","🌟","🌺","🌈","🦋","🌻","💝","🌙","⭐","💐","😊","🎶","🌷","☀️","🌿","💞","🪷","🌼","🌊","🐝","🍀","🌴","🦜","🍋","🌮","🎵"];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&family=Dancing+Script:wght@500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes cardIn{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes steamRise{0%{transform:translateY(0) scale(1);opacity:0}25%{opacity:.13}100%{transform:translateY(-160px) scale(2.2);opacity:0}}
@keyframes sentPop{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes pageFlip{0%{opacity:.5;transform:perspective(1200px) rotateY(-5deg)}100%{opacity:1;transform:perspective(1200px) rotateY(0)}}
.app{font-family:'Lora',serif;background:#FAF5EE;color:#2A1508;min-height:100vh;}
.nav{display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:68px;border-bottom:1px solid rgba(42,21,8,.08);background:rgba(250,245,238,.97);backdrop-filter:blur(16px);position:sticky;top:0;z-index:100;}
.nav-wordmark{font-family:'Playfair Display',serif;font-size:24px;font-weight:400;letter-spacing:-.4px;color:#2A1508;line-height:1;cursor:pointer;}
.nav-wordmark em{font-style:italic;color:#d4a843;}
.nav-tagline{font-family:'Jost',sans-serif;font-weight:300;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(42,21,8,.38);display:block;margin-top:3px;}
.btn-dark{background:#2A1508;color:#FAF5EE;border:none;padding:10px 24px;font-family:'Jost',sans-serif;font-size:13px;font-weight:400;letter-spacing:.4px;border-radius:4px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
.btn-dark:hover{background:#3d2010;transform:translateY(-1px);box-shadow:0 6px 20px rgba(42,21,8,.2);}
.btn-hero{background:#2A1508;color:#FAF5EE;border:none;padding:16px 44px;font-family:'Jost',sans-serif;font-size:14px;font-weight:400;letter-spacing:1px;border-radius:4px;cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;gap:12px;}
.btn-hero:hover{background:#3d2010;transform:translateY(-2px);box-shadow:0 12px 36px rgba(42,21,8,.22);}
.btn-ghost{background:transparent;border:1px solid rgba(42,21,8,.18);color:#2A1508;padding:9px 22px;font-family:'Jost',sans-serif;font-size:13px;letter-spacing:.3px;border-radius:4px;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:7px;}
.btn-ghost:hover{background:rgba(42,21,8,.04);border-color:rgba(42,21,8,.3);}
.btn-ghost-sm{background:transparent;border:1px solid rgba(42,21,8,.14);color:#8B6E4E;padding:7px 16px;font-family:'Jost',sans-serif;font-size:12px;border-radius:4px;cursor:pointer;transition:all .15s;}
.btn-ghost-sm:hover{background:rgba(42,21,8,.04);color:#2A1508;}
.btn-send{background:#2A1508;color:#FAF5EE;border:none;padding:11px 28px;font-family:'Jost',sans-serif;font-size:13px;letter-spacing:.4px;border-radius:4px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
.btn-send:hover{background:#3d2010;transform:translateY(-1px);box-shadow:0 6px 22px rgba(42,21,8,.25);}
.btn-upload{width:100%;padding:12px;border:1px dashed rgba(42,21,8,.2);border-radius:6px;background:transparent;cursor:pointer;font-family:'Jost',sans-serif;font-size:12.5px;letter-spacing:.3px;color:#8B6E4E;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:9px;margin-bottom:12px;}
.btn-upload:hover{background:rgba(42,21,8,.03);border-color:rgba(42,21,8,.35);}
.btn-page-add{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;border:1px dashed rgba(42,21,8,.16);border-radius:8px;background:rgba(255,255,255,.5);cursor:pointer;font-family:'Jost',sans-serif;font-size:13px;letter-spacing:.3px;color:#8B6E4E;transition:all .2s;margin-top:12px;}
.btn-page-add:hover{border-color:rgba(42,21,8,.3);background:rgba(255,255,255,.85);color:#2A1508;}
.home{min-height:calc(100vh - 68px);overflow:hidden;position:relative;background:#FAF5EE;}
.steam-bg{position:absolute;top:38%;left:0;right:0;height:200px;pointer-events:none;}
.steam-bubble{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(212,168,67,.12),transparent 70%);animation:steamRise 9s ease-in-out infinite;}
.hero{text-align:center;padding:84px 32px 52px;max-width:660px;margin:0 auto;position:relative;z-index:1;animation:fadeUp .8s ease both;}
.hero-eyebrow{font-family:'Jost',sans-serif;font-weight:300;font-size:11px;color:#d4a843;letter-spacing:4px;text-transform:uppercase;margin-bottom:28px;}
.hero-title{font-family:'Playfair Display',serif;font-size:clamp(44px,6vw,70px);font-weight:400;line-height:1.13;margin-bottom:22px;color:#2A1508;}
.hero-title em{font-style:italic;color:#d4a843;}
.hero-sub{font-size:17px;color:#8B6E4E;line-height:1.92;margin-bottom:44px;font-weight:400;}
.hero-pills{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:32px;}
.pill{font-family:'Jost',sans-serif;font-size:11.5px;font-weight:300;letter-spacing:.5px;background:rgba(212,168,67,.1);color:#8B6E4E;padding:7px 18px;border-radius:2px;border:1px solid rgba(212,168,67,.22);}
.fan-wrap{display:flex;justify-content:center;align-items:flex-end;padding:30px 0 0;}
.fan-card{width:138px;height:100px;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;box-shadow:0 8px 32px rgba(42,21,8,.13);margin:0 -18px;transition:transform .25s;cursor:pointer;}
.fan-card:hover{transform:translateY(-10px) !important;z-index:10 !important;}
.fan-card-name{font-family:'Jost',sans-serif;font-size:10px;font-weight:300;letter-spacing:.8px;text-transform:uppercase;}
.themes-view{padding:52px 44px;max-width:1000px;margin:0 auto;}
.section-header{text-align:center;margin-bottom:52px;animation:fadeUp .5s ease;}
.section-title{font-family:'Playfair Display',serif;font-size:34px;font-weight:400;margin-bottom:12px;}
.section-sub{font-family:'Jost',sans-serif;font-weight:300;color:#8B6E4E;font-size:15px;line-height:1.85;letter-spacing:.2px;}
.themes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(222px,1fr));gap:16px;}
.theme-card{border-radius:10px;padding:38px 20px 30px;text-align:center;cursor:pointer;transition:all .22s;box-shadow:0 2px 18px rgba(42,21,8,.06);border:1.5px solid transparent;animation:fadeUp .4s ease both;}
.theme-card:hover{transform:translateY(-4px);box-shadow:0 14px 36px rgba(42,21,8,.13);}
.theme-card-name{font-family:'Playfair Display',serif;font-size:15px;font-weight:400;margin-top:17px;}
.theme-card-sub{font-family:'Jost',sans-serif;font-size:10.5px;font-weight:300;letter-spacing:.8px;margin-top:7px;opacity:.45;text-transform:uppercase;}
.editor-layout{display:grid;grid-template-columns:272px 1fr 220px;height:calc(100vh - 68px);overflow:hidden;}
.panel-left{border-right:1px solid rgba(42,21,8,.08);background:white;display:flex;flex-direction:column;overflow:hidden;}
.panel-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;padding:8px;background:#FAF5EE;border-bottom:1px solid rgba(42,21,8,.07);flex-shrink:0;}
.panel-tab{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px;border:none;background:transparent;cursor:pointer;border-radius:5px;color:rgba(42,21,8,.3);transition:all .15s;font-family:'Jost',sans-serif;}
.panel-tab.active{background:white;color:#2A1508;box-shadow:0 1px 6px rgba(42,21,8,.1);}
.panel-tab .tab-label{font-size:9px;font-weight:400;letter-spacing:.6px;text-transform:uppercase;}
.panel-content{padding:20px;flex:1;overflow-y:auto;}
.field-label{display:block;font-family:'Jost',sans-serif;font-size:10px;font-weight:500;color:rgba(42,21,8,.38);margin-bottom:6px;margin-top:18px;text-transform:uppercase;letter-spacing:1.5px;}
.field-label:first-child{margin-top:0;}
.f-input{width:100%;padding:9px 12px;border:1px solid rgba(42,21,8,.13);border-radius:5px;font-family:'Lora',serif;font-size:13.5px;color:#2A1508;background:#FAF5EE;outline:none;transition:border-color .15s;}
.f-input:focus{border-color:rgba(212,168,67,.5);background:white;}
.f-textarea{width:100%;padding:10px 12px;border:1px solid rgba(42,21,8,.13);border-radius:5px;font-family:'Lora',serif;font-size:13.5px;color:#2A1508;background:#FAF5EE;outline:none;resize:vertical;line-height:1.65;transition:border-color .15s;}
.f-textarea:focus{border-color:rgba(212,168,67,.5);background:white;}
.f-select{padding:8px 10px;border:1px solid rgba(42,21,8,.13);border-radius:5px;font-family:'Jost',sans-serif;font-size:12px;background:#FAF5EE;color:#2A1508;outline:none;cursor:pointer;}
.f-color{width:38px;height:34px;border:1px solid rgba(42,21,8,.13);border-radius:5px;cursor:pointer;padding:2px;background:#FAF5EE;}
.style-row{display:flex;gap:8px;align-items:flex-end;}
.style-col{display:flex;flex-direction:column;}
.sub-label{font-family:'Jost',sans-serif;font-size:9.5px;color:rgba(42,21,8,.38);margin-bottom:4px;letter-spacing:.5px;text-transform:uppercase;}
.msg-preview{padding:13px 15px;background:#FAF5EE;border-radius:6px;margin-top:12px;border:1px solid rgba(42,21,8,.1);line-height:1.65;word-break:break-word;}
.media-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;}
.media-thumb{width:100%;height:68px;object-fit:cover;border-radius:5px;cursor:pointer;border:1.5px solid transparent;transition:all .15s;background:#EDE6DC;}
.media-thumb:hover{border-color:rgba(42,21,8,.28);transform:scale(1.03);}
.emoji-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;}
.emoji-btn{padding:8px 4px;font-size:20px;background:#FAF5EE;border:1px solid rgba(42,21,8,.07);border-radius:6px;cursor:pointer;transition:transform .1s;display:flex;align-items:center;justify-content:center;}
.emoji-btn:hover{transform:scale(1.2);background:#EDE6DC;}
.fmt-btn{padding:7px 16px;border-radius:4px;border:1px solid rgba(42,21,8,.15);background:transparent;color:#2A1508;cursor:pointer;font-size:13px;font-family:serif;transition:all .15s;}
.fmt-btn.on{background:#2A1508;color:#FAF5EE;border-color:#2A1508;}
.info-box{padding:12px 14px;background:#FAF5EE;border-radius:6px;border:1px solid rgba(212,168,67,.18);font-family:'Jost',sans-serif;font-size:12px;font-weight:300;color:#8B6E4E;line-height:1.75;margin-bottom:16px;letter-spacing:.2px;}
.canvas-area{background:#EAE2D8;background-image:radial-gradient(ellipse at 18% 18%,rgba(255,255,255,.55) 0%,transparent 58%),radial-gradient(ellipse at 82% 82%,rgba(195,168,130,.22) 0%,transparent 58%);display:flex;flex-direction:column;align-items:center;padding:30px 24px;overflow-y:auto;gap:0;}
.page-tabs-wrap{display:flex;align-items:center;gap:6px;margin-bottom:22px;flex-wrap:wrap;justify-content:center;}
.page-tab-btn{display:flex;align-items:center;gap:6px;padding:7px 18px;border-radius:30px;border:1px solid rgba(42,21,8,.15);background:rgba(255,255,255,.52);cursor:pointer;font-family:'Jost',sans-serif;font-size:12px;letter-spacing:.3px;color:#8B6E4E;transition:all .15s;backdrop-filter:blur(10px);}
.page-tab-btn.active{background:white;color:#2A1508;border-color:rgba(42,21,8,.25);box-shadow:0 2px 14px rgba(42,21,8,.1);}
.page-tab-btn:hover:not(.active){background:rgba(255,255,255,.8);}
.page-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.card-wrap{width:512px;animation:pageFlip .35s ease;position:relative;}
.card-cover{width:512px;min-height:390px;border-radius:14px;box-shadow:0 40px 90px rgba(42,21,8,.22),0 8px 26px rgba(42,21,8,.1);overflow:hidden;position:relative;}
.card-cover::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.28) 0%,transparent 55%);pointer-events:none;z-index:1;}
.cover-canvas{position:relative;width:100%;min-height:390px;padding:24px;user-select:none;}
.card-page{width:512px;min-height:460px;border-radius:14px;box-shadow:0 40px 90px rgba(42,21,8,.18),0 8px 26px rgba(42,21,8,.1);background:white;position:relative;overflow:visible;}
.card-page::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0;background:var(--acc,#b85c38);opacity:.55;}
.page-canvas{position:relative;min-height:460px;padding:28px 32px 32px;}
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid rgba(42,21,8,.07);}
.page-num-label{font-family:'Jost',sans-serif;font-size:10px;font-weight:400;color:rgba(42,21,8,.35);letter-spacing:2px;text-transform:uppercase;}
.page-del-btn{background:none;border:none;cursor:pointer;color:rgba(42,21,8,.2);transition:color .15s;padding:2px;display:flex;align-items:center;}
.page-del-btn:hover{color:rgba(184,74,48,.65);}
.page-empty{padding:48px 16px;text-align:center;font-family:'Playfair Display',serif;font-style:italic;color:rgba(42,21,8,.2);font-size:16px;line-height:1.95;}
.drop-hint{font-family:'Jost',sans-serif;font-size:10px;font-weight:300;letter-spacing:.5px;color:rgba(42,21,8,.22);text-align:center;padding:8px 0 14px;}
.canvas-footer{display:flex;align-items:center;justify-content:space-between;width:512px;margin-top:22px;}
.canvas-meta{font-family:'Jost',sans-serif;font-size:11px;font-weight:300;color:rgba(42,21,8,.38);letter-spacing:.3px;}
.d-item{position:absolute;cursor:grab;touch-action:none;z-index:10;}
.d-item:active{cursor:grabbing;}
.d-item.sel .d-border{display:block;}
.d-border{display:none;position:absolute;inset:-5px;border:1.5px dashed rgba(42,21,8,.28);border-radius:5px;pointer-events:none;}
.d-del{position:absolute;top:-12px;right:-12px;width:23px;height:23px;border-radius:50%;background:#2A1508;color:#FAF5EE;border:none;cursor:pointer;display:none;align-items:center;justify-content:center;z-index:20;}
.d-item.sel .d-del{display:flex;}
.d-edit{position:absolute;top:-12px;left:-12px;width:23px;height:23px;border-radius:50%;background:#2A1508;color:#FAF5EE;border:none;cursor:pointer;display:none;align-items:center;justify-content:center;z-index:20;}
.d-item.sel .d-edit{display:flex;}
.d-text{white-space:pre-wrap;word-break:break-word;line-height:1.6;min-width:50px;min-height:1em;outline:none;}
.panel-right{border-left:1px solid rgba(42,21,8,.08);background:white;padding:24px;overflow-y:auto;}
.sidebar-title{font-family:'Jost',sans-serif;font-size:10px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:rgba(42,21,8,.38);margin-bottom:14px;}
.signer-row{display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:6px;background:#FAF5EE;margin-bottom:6px;}
.signer-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.signer-info{flex:1;min-width:0;}
.signer-name{font-family:'Jost',sans-serif;font-size:12px;font-weight:500;}
.signer-preview{font-size:11.5px;color:#8B6E4E;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:'Lora',serif;}
.invite-box{margin-top:20px;padding:16px;background:linear-gradient(135deg,#FFF9F2,#FAF5EE);border-radius:8px;border:1px solid rgba(212,168,67,.18);}
.invite-note{font-family:'Jost',sans-serif;font-size:12px;font-weight:300;color:#8B6E4E;line-height:1.8;}
.pages-list{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;}
.page-list-item{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:6px;background:#FAF5EE;cursor:pointer;border:1.5px solid transparent;transition:all .15s;}
.page-list-item.active{border-color:rgba(42,21,8,.18);background:white;}
.page-list-item:hover:not(.active){background:#F5EFE5;}
.page-list-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.page-list-name{font-family:'Jost',sans-serif;font-size:12px;letter-spacing:.2px;flex:1;}
.page-list-count{font-family:'Jost',sans-serif;font-size:10px;color:rgba(42,21,8,.32);}
.empty-note{font-family:'Jost',sans-serif;font-size:12px;font-weight:300;color:rgba(42,21,8,.38);line-height:1.85;font-style:italic;}
.modal-overlay{position:fixed;inset:0;background:rgba(42,21,8,.46);backdrop-filter:blur(10px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:white;border-radius:14px;width:100%;max-width:484px;max-height:84vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 44px 110px rgba(42,21,8,.28);animation:cardIn .25s ease;}
.modal-header{display:flex;align-items:center;justify-content:space-between;padding:24px 28px 18px;border-bottom:1px solid rgba(42,21,8,.08);}
.modal-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:400;}
.close-btn{background:none;border:none;cursor:pointer;color:rgba(42,21,8,.32);padding:2px;display:flex;align-items:center;transition:color .15s;}
.close-btn:hover{color:#2A1508;}
.modal-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;padding:8px;background:#FAF5EE;border-bottom:1px solid rgba(42,21,8,.07);}
.modal-tab{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px;border:none;background:transparent;cursor:pointer;border-radius:5px;color:rgba(42,21,8,.3);transition:all .15s;font-family:'Jost',sans-serif;}
.modal-tab.active{background:white;color:#2A1508;box-shadow:0 1px 6px rgba(42,21,8,.1);}
.modal-tab-label{font-size:9px;letter-spacing:.6px;text-transform:uppercase;}
.modal-body{padding:26px 28px;overflow-y:auto;flex:1;}
.sent-confirm{text-align:center;padding:30px 0;animation:sentPop .4s ease;}
.sent-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:400;margin-top:18px;margin-bottom:10px;}
.sent-sub{font-family:'Jost',sans-serif;font-weight:300;color:#8B6E4E;font-size:15px;line-height:1.8;letter-spacing:.2px;}
.modal-center{text-align:center;padding-top:8px;display:flex;flex-direction:column;align-items:center;}
.modal-sec-title{font-family:'Playfair Display',serif;font-size:20px;margin:18px 0 10px;}
.modal-sec-body{font-family:'Jost',sans-serif;font-weight:300;color:#8B6E4E;font-size:14px;line-height:1.85;margin-bottom:24px;letter-spacing:.2px;}
.date-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
`;

const uid = () => Date.now() + Math.random();
const makePage = (num) => ({ id: uid(), num, items: [] });

function GiphyPanel({ onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const search = async (q) => {
    try {
      const url = q.trim()
        ? `https://api.giphy.com/v1/gifs/search?api_key=${import.meta.env.VITE_GIPHY_KEY}&q=${encodeURIComponent(q)}&limit=12&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${import.meta.env.VITE_GIPHY_KEY}&limit=12&rating=g`;
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.data || []);
    } catch(e) {}
    setLoading(false);
  };
  useEffect(() => { search(""); }, []);
  const handleInput = (e) => { setQuery(e.target.value); clearTimeout(debounceRef.current); debounceRef.current = setTimeout(() => search(e.target.value), 500); };
  return (
    <div>
      <input className="f-input" placeholder="Search GIFs…" value={query} onChange={handleInput} style={{ marginBottom:12 }}/>
      {loading && <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#8B6E4E", marginBottom:8 }}>Searching…</p>}
      <div className="media-grid">{results.map(gif => <img key={gif.id} src={gif.images.fixed_height_small.url} alt={gif.title} className="media-thumb" style={{ height:68 }} onClick={() => onAdd(gif.images.original.url)}/>)}</div>
      <p style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"rgba(42,21,8,.28)", marginTop:12, textAlign:"center", letterSpacing:"1px", textTransform:"uppercase" }}>Powered by GIPHY</p>
    </div>
  );
}

function PhotosPanel({ onAdd, uploads, onUpload, fileRef }) {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const search = async (q) => {
    try {
      const endpoint = q.trim()
        ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=12&orientation=landscape`
        : `https://api.unsplash.com/photos?per_page=12&order_by=popular`;
      setLoading(true);
      const res = await fetch(endpoint, { headers: { Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_KEY}` } });
      const data = await res.json();
      setPhotos(q.trim() ? (data.results||[]) : (data||[]));
    } catch(e) {}
    setLoading(false);
  };
  useEffect(() => { search(""); }, []);
  const handleInput = (e) => { setQuery(e.target.value); clearTimeout(debounceRef.current); debounceRef.current = setTimeout(() => search(e.target.value), 500); };
  return (
    <div>
      <button className="btn-upload" onClick={() => fileRef.current?.click()}>{Icon.upload(15)} Upload your own photo</button>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={onUpload}/>
      {uploads.length > 0 && (<><div className="sub-label" style={{ marginBottom:8 }}>Your uploads</div><div className="media-grid" style={{ marginBottom:14 }}>{uploads.map(p => <img key={p.id} src={p.url} alt={p.label} className="media-thumb" onClick={() => onAdd(p.url)}/>)}</div></>)}
      <input className="f-input" placeholder="Search free photos…" value={query} onChange={handleInput} style={{ marginBottom:10 }}/>
      {loading && <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#8B6E4E", marginBottom:8 }}>Searching…</p>}
      <div className="media-grid">{photos.map(photo => <img key={photo.id} src={photo.urls.small} alt={photo.alt_description||"photo"} className="media-thumb" onClick={() => onAdd(photo.urls.regular)}/>)}</div>
      <p style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"rgba(42,21,8,.28)", marginTop:12, textAlign:"center", letterSpacing:"1px", textTransform:"uppercase" }}>Photos by <a href="https://unsplash.com" target="_blank" rel="noreferrer" style={{ color:"rgba(42,21,8,.28)" }}>Unsplash</a></p>
    </div>
  );
}

function DItem({ item, selected, onSelect, onDelete, onMove, onResize, onTextChange, containerRef }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const off = useRef({ x:0,y:0 });
  const startSize = useRef({ w:0,h:0 });
  const startMouse = useRef({ x:0,y:0 });
  const [editing, setEditing] = useState(false);
  const textRef = useRef(null);
  const getDefaultW = () => item.type==="text"?200:item.type==="emoji"?52:130;
  const getDefaultH = () => item.type==="text"?60:item.type==="emoji"?52:100;
  const w = item.width||getDefaultW();
  const h = item.height||getDefaultH();
  const handleMouseDown = useCallback((e) => {
    if (editing||resizing.current) return;
    e.stopPropagation(); onSelect(item.id); dragging.current=true;
    const r=ref.current.getBoundingClientRect(); off.current={x:e.clientX-r.left,y:e.clientY-r.top};
    const move=(e)=>{ if(!dragging.current||!containerRef.current)return; const c=containerRef.current.getBoundingClientRect(); onMove(item.id,Math.max(0,e.clientX-c.left-off.current.x),Math.max(0,e.clientY-c.top-off.current.y)); };
    const up=()=>{ dragging.current=false; window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); };
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
  },[editing,item.id,onSelect,onMove,containerRef]);
  const handleResizeDown = useCallback((e) => {
    e.stopPropagation(); e.preventDefault(); resizing.current=true;
    startMouse.current={x:e.clientX,y:e.clientY}; startSize.current={w:item.width||getDefaultW(),h:item.height||getDefaultH()};
    const move=(e)=>{ if(!resizing.current)return; onResize(item.id,Math.max(40,startSize.current.w+e.clientX-startMouse.current.x),Math.max(30,startSize.current.h+e.clientY-startMouse.current.y)); };
    const up=()=>{ resizing.current=false; window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); };
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
  },[item,onResize]);
  const startEdit=(e)=>{ e.stopPropagation(); setEditing(true); setTimeout(()=>{ if(textRef.current){ textRef.current.focus(); const r=document.createRange(); r.selectNodeContents(textRef.current); r.collapse(false); const s=window.getSelection(); s.removeAllRanges(); s.addRange(r); }},40); };
  const finishEdit=()=>{ setEditing(false); if(textRef.current) onTextChange(item.id,textRef.current.innerText); };
  return (
    <div ref={ref} className={`d-item${selected?" sel":""}`}
      style={{ left:item.x,top:item.y,width:w,height:item.type==="text"?"auto":h,zIndex:selected?50:10 }}
      onMouseDown={handleMouseDown} onClick={(e)=>{ e.stopPropagation(); onSelect(item.id); }}>
      <div className="d-border"/>
      <button className="d-del" onClick={(e)=>{ e.stopPropagation(); onDelete(item.id); }}>{Icon.x(10,"#FAF5EE")}</button>
      {item.type==="text"&&<button className="d-edit" onClick={startEdit}>{Icon.edit(10,"#FAF5EE")}</button>}
      {item.type==="text"&&<div ref={textRef} className="d-text" contentEditable={editing} suppressContentEditableWarning onBlur={finishEdit} onKeyDown={(e)=>{ if(e.key==="Escape")finishEdit(); }} style={{ fontFamily:item.font,fontSize:item.size,color:item.color,fontWeight:item.bold?700:400,fontStyle:item.italic?"italic":"normal",width:"100%",minHeight:"1em" }}>{item.text}</div>}
      {item.type==="emoji"&&<span style={{ fontSize:Math.max(20,w*0.62),lineHeight:1,display:"block",textAlign:"center",width:w,height:h,lineHeight:h+"px" }}>{item.content}</span>}
      {(item.type==="photo"||item.type==="gif")&&<img src={item.url} alt="" style={{ width:w,height:h,objectFit:"cover",borderRadius:7,display:"block",boxShadow:"0 4px 18px rgba(42,21,8,.15)" }} onError={(e)=>{ e.target.style.opacity=".3"; }}/>}
      {item.type==="audio"&&<div style={{ width:w,padding:"10px 12px",background:"#FAF5EE",borderRadius:8,border:"1px solid rgba(42,21,8,.1)",display:"flex",alignItems:"center",gap:8 }}>{Icon.music(17,"#8B6E4E")}<audio controls style={{ width:"100%",height:32 }} src={item.url}/></div>}
      {selected&&<>
        <div onMouseDown={handleResizeDown} style={{ position:"absolute",bottom:-8,right:-8,width:20,height:20,background:"#2A1508",borderRadius:"50%",cursor:"nwse-resize",zIndex:30,border:"2px solid white",boxShadow:"0 1px 5px rgba(0,0,0,.22)",display:"flex",alignItems:"center",justifyContent:"center" }}>{Icon.resize(8,"#FAF5EE")}</div>
        <div style={{ position:"absolute",bottom:-23,left:0,fontFamily:"'Jost',sans-serif",fontSize:9,letterSpacing:".3px",color:"rgba(42,21,8,.3)",whiteSpace:"nowrap",pointerEvents:"none" }}>{Math.round(w)} × {Math.round(h)}</div>
      </>}
    </div>
  );
}

export default function Steeped() {
  const [view,setView]=useState("home");
  const [theme,setTheme]=useState(null);
  const [activePage,setActivePage]=useState(0);
  const [pages,setPages]=useState([makePage(1)]);
  const [coverItems,setCoverItems]=useState([]);
  const [selCover,setSelCover]=useState(null);
  const [selPage,setSelPage]=useState(null);
  const [signerName,setSignerName]=useState("");
  const [msgText,setMsgText]=useState("");
  const [tColor,setTColor]=useState("#2A1508");
  const [tFont,setTFont]=useState(FONTS[0].value);
  const [tSize,setTSize]=useState(15);
  const [tBold,setTBold]=useState(false);
  const [tItalic,setTItalic]=useState(false);
  const [covText,setCovText]=useState("");
  const [covFont,setCovFont]=useState(FONTS[0].value);
  const [covColor,setCovColor]=useState("#2A1508");
  const [covSize,setCovSize]=useState(22);
  const [covBold,setCovBold]=useState(false);
  const [covItalic,setCovItalic]=useState(false);
  const [activePanel,setActivePanel]=useState("text");
  const [showSend,setShowSend]=useState(false);
  const [sendTab,setSendTab]=useState("email");
  const [sent,setSent]=useState(false);
  const [uploads,setUploads]=useState([]);
  const [form,setForm]=useState({name:"",to:"",note:"",date:"",time:""});
  const fileRef=useRef(null);
  const coverRef=useRef(null);
  const pageRefs=useRef({});

  const goEditor=(t)=>{ setTheme(t);setView("editor");setActivePage(0);setPages([makePage(1)]); setCoverItems([{id:uid(),type:"text",x:62,y:128,text:t.name,font:"'Playfair Display',serif",size:32,color:t.accent,bold:false,italic:false},{id:uid(),type:"text",x:64,y:178,text:"A card made with love",font:"'Lora',serif",size:14,color:t.accent,bold:false,italic:true}]); };
  const fSet=(k)=>(e)=>setForm(p=>({...p,[k]:e.target.value}));
  const curPage=activePage>0?pages[activePage-1]:null;
  const addCovText=()=>{ if(!covText.trim())return; setCoverItems(p=>[...p,{id:uid(),type:"text",x:62,y:62+p.length*50,text:covText,font:covFont,size:covSize,color:covColor,bold:covBold,italic:covItalic}]); setCovText(""); };
  const addCovMedia=(item)=>setCoverItems(p=>[...p,{...item,id:uid(),x:40+(p.length%3)*155,y:62+Math.floor(p.length/3)*125}]);
  const moveCovItem=useCallback((id,x,y)=>setCoverItems(p=>p.map(i=>i.id===id?{...i,x,y}:i)),[]);
  const resCovItem=useCallback((id,w,h)=>setCoverItems(p=>p.map(i=>i.id===id?{...i,width:w,height:h}:i)),[]);
  const delCovItem=(id)=>setCoverItems(p=>p.filter(i=>i.id!==id));
  const editCovText=(id,text)=>setCoverItems(p=>p.map(i=>i.id===id?{...i,text}:i));
  const spawnPageItem=(item)=>{ if(activePage===0){addCovMedia(item);return;} setPages(prev=>prev.map((pg,i)=>i===activePage-1?{...pg,items:[...pg.items,{...item,id:uid(),x:22+(pg.items.length%4)*112,y:62+Math.floor(pg.items.length/4)*132}]}:pg)); };
  const movePageItem=useCallback((pi,id,x,y)=>setPages(prev=>prev.map((pg,i)=>i===pi?{...pg,items:pg.items.map(it=>it.id===id?{...it,x,y}:it)}:pg)),[]);
  const resPageItem=useCallback((pi,id,w,h)=>setPages(prev=>prev.map((pg,i)=>i===pi?{...pg,items:pg.items.map(it=>it.id===id?{...it,width:w,height:h}:it)}:pg)),[]);
  const delPageItem=(pi,id)=>setPages(prev=>prev.map((pg,i)=>i===pi?{...pg,items:pg.items.filter(it=>it.id!==id)}:pg));
  const editPageText=(pi,id,text)=>setPages(prev=>prev.map((pg,i)=>i===pi?{...pg,items:pg.items.map(it=>it.id===id?{...it,text}:it)}:pg));
  const addSig=()=>{ if(!msgText.trim()||activePage===0)return; spawnPageItem({type:"text",text:msgText,signerName:signerName||"Anonymous",font:tFont,size:tSize,color:tColor,bold:tBold,italic:tItalic}); setMsgText(""); };
  const addPage=()=>{ const p=makePage(pages.length+1); setPages(prev=>[...prev,p]); setActivePage(pages.length+1); };
  const delPage=(idx)=>{ if(pages.length===1)return; const u=pages.filter((_,i)=>i!==idx).map((p,i)=>({...p,num:i+1})); setPages(u); if(activePage>u.length)setActivePage(u.length); };
  const handleUpload=(e)=>{ Array.from(e.target.files).forEach(f=>{ const r=new FileReader(); r.onload=ev=>setUploads(p=>[...p,{id:uid(),url:ev.target.result,label:f.name}]); r.readAsDataURL(f); }); };
  const doSend=()=>{ setSent(true); setTimeout(()=>{setSent(false);setShowSend(false);},2800); };
  const desel=()=>{ setSelCover(null); setSelPage(null); };
  const totalItems=pages.reduce((a,p)=>a+p.items.length,0);

  const NavLogo=({onClick})=>(
    <div onClick={onClick} style={{ cursor:"pointer" }}>
      <div className="nav-wordmark">St<em>ee</em>ped</div>
      <span className="nav-tagline">Cards brewed with kindness</span>
    </div>
  );

  if(view==="home") return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <NavLogo onClick={()=>{}}/>
        <button className="btn-dark" onClick={()=>setView("themes")}>Create a card {Icon.arrow(14,"#FAF5EE")}</button>
      </nav>
      <div className="home">
        <div className="steam-bg">{[0,1,2,3,4].map(i=><div key={i} className="steam-bubble" style={{width:90+i*26,height:90+i*26,left:`${10+i*18}%`,bottom:0,animationDelay:`${i*1.3}s`,animationDuration:`${8+i*1}s`}}/>)}</div>
        <div className="hero">
          <div className="hero-eyebrow">a little warmth, sent with care</div>
          <h1 className="hero-title">Cards <em>brewed</em><br/>with kindness</h1>
          <p className="hero-sub">Beautiful multi-page cards for every occasion.<br/>Sign together, add photos & GIFs, share warmly.</p>
          <button className="btn-hero" onClick={()=>setView("themes")}>Brew a card {Icon.arrow(16,"#FAF5EE")}</button>
          <div className="hero-pills">{["Multiple signing pages","Custom cover design","Drag & resize anything","Photos & GIFs","Email, text or print"].map(f=><span key={f} className="pill">{f}</span>)}</div>
        </div>
        <div className="fan-wrap">{THEMES.slice(0,5).map((t,i)=>{ const rots=[-10,-4,0,5,11],ty=[5,2,0,2,5]; return <div key={t.id} className="fan-card" onClick={()=>goEditor(t)} style={{background:t.cover,transform:`rotate(${rots[i]}deg) translateY(${ty[i]}px)`,zIndex:i===2?5:i}}><div style={{color:t.accent}}>{Icon[t.icon](26,t.accent)}</div><div className="fan-card-name" style={{color:t.accent}}>{t.name.split(" ")[0]}</div></div>; })}</div>
      </div>
    </div>
  );

  if(view==="themes") return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <NavLogo onClick={()=>setView("home")}/>
        <button className="btn-ghost" onClick={()=>setView("home")}>{Icon.back(13)} Back</button>
      </nav>
      <div className="themes-view">
        <div className="section-header"><h2 className="section-title">Choose your card</h2><p className="section-sub">Each card opens into multiple pages — plenty of room for everyone to sign.</p></div>
        <div className="themes-grid">{THEMES.map((t,i)=><div key={t.id} className="theme-card" style={{background:t.cover,animationDelay:`${i*.06}s`}} onClick={()=>goEditor(t)}><div style={{color:t.accent}}>{Icon[t.icon](34,t.accent)}</div><div className="theme-card-name" style={{color:t.accent}}>{t.name}</div><div className="theme-card-sub" style={{color:t.accent}}>Open card</div></div>)}</div>
      </div>
    </div>
  );

  return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <NavLogo onClick={()=>setView("home")}/>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-ghost" onClick={()=>setView("themes")}>{Icon.back(13)} Themes</button>
          <button className="btn-send" onClick={()=>setShowSend(true)}>{Icon.send(14,"#FAF5EE")} Send Card</button>
        </div>
      </nav>

      <div className="editor-layout">
        <div className="panel-left">
          <div className="panel-tabs">
            {[{id:"text",ic:Icon.pen(16),lbl:"Sign"},{id:"photos",ic:Icon.photo(16),lbl:"Photos"},{id:"gifs",ic:Icon.gif(16),lbl:"GIFs"},{id:"emojis",ic:Icon.smile(16),lbl:"Emoji"},{id:"audio",ic:Icon.music(16),lbl:"Audio"}].map(t=>(
              <button key={t.id} className={`panel-tab${activePanel===t.id?" active":""}`} onClick={()=>setActivePanel(t.id)}>{t.ic}<span className="tab-label">{t.lbl}</span></button>
            ))}
          </div>
          <div className="panel-content">
            {activePanel==="text"&&(activePage===0?(
              <div>
                <div className="info-box">Cover editor — add text, then drag &amp; resize it on the card.</div>
                <label className="field-label">Add text</label>
                <input className="f-input" placeholder="e.g. Happy Birthday, Sarah!" value={covText} onChange={e=>setCovText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCovText()}/>
                <label className="field-label">Style</label>
                <div className="style-row">
                  <div className="style-col"><span className="sub-label">Font</span><select className="f-select" value={covFont} onChange={e=>setCovFont(e.target.value)}>{FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
                  <div className="style-col"><span className="sub-label">Size</span><select className="f-select" value={covSize} onChange={e=>setCovSize(Number(e.target.value))}>{[12,14,16,18,20,22,24,28,32,36,42].map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div className="style-col"><span className="sub-label">Color</span><input type="color" className="f-color" value={covColor} onChange={e=>setCovColor(e.target.value)}/></div>
                </div>
                <div style={{display:"flex",gap:8,marginTop:10}}><button className={`fmt-btn${covBold?" on":""}`} onClick={()=>setCovBold(b=>!b)}><strong>B</strong></button><button className={`fmt-btn${covItalic?" on":""}`} onClick={()=>setCovItalic(it=>!it)}><em>I</em></button></div>
                <button className="btn-dark" style={{width:"100%",marginTop:16,justifyContent:"center"}} onClick={addCovText}>Add to Cover</button>
              </div>
            ):(
              <div>
                <label className="field-label">Your name</label>
                <input className="f-input" placeholder="How should we sign this?" value={signerName} onChange={e=>setSignerName(e.target.value)}/>
                <label className="field-label">Your message</label>
                <textarea className="f-textarea" rows={4} placeholder="Write something wonderful…" value={msgText} onChange={e=>setMsgText(e.target.value)}/>
                <label className="field-label">Style</label>
                <div className="style-row">
                  <div className="style-col"><span className="sub-label">Font</span><select className="f-select" value={tFont} onChange={e=>setTFont(e.target.value)}>{FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
                  <div className="style-col"><span className="sub-label">Size</span><select className="f-select" value={tSize} onChange={e=>setTSize(Number(e.target.value))}>{[12,13,14,15,16,18,20,22,24].map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div className="style-col"><span className="sub-label">Color</span><input type="color" className="f-color" value={tColor} onChange={e=>setTColor(e.target.value)}/></div>
                </div>
                <div style={{display:"flex",gap:8,marginTop:10}}><button className={`fmt-btn${tBold?" on":""}`} onClick={()=>setTBold(b=>!b)}><strong>B</strong></button><button className={`fmt-btn${tItalic?" on":""}`} onClick={()=>setTItalic(it=>!it)}><em>I</em></button></div>
                {msgText&&<div className="msg-preview" style={{fontFamily:tFont,fontSize:tSize,color:tColor,fontWeight:tBold?700:400,fontStyle:tItalic?"italic":"normal",marginTop:12}}><div>{msgText}</div>{signerName&&<div style={{fontSize:tSize*.72,marginTop:6,opacity:.6}}>— {signerName}</div>}</div>}
                <button className="btn-dark" style={{width:"100%",marginTop:16,justifyContent:"center"}} onClick={addSig}>Add to Page {activePage}</button>
                <p style={{fontFamily:"'Jost',sans-serif",fontSize:11,color:"rgba(42,21,8,.35)",lineHeight:1.75,marginTop:10,letterSpacing:".2px"}}>Click to select · drag to move · corner to resize</p>
              </div>
            ))}
            {activePanel==="photos"&&<PhotosPanel onAdd={(url)=>spawnPageItem({type:"photo",url})} uploads={uploads} onUpload={handleUpload} fileRef={fileRef}/>}
            {activePanel==="gifs"&&<GiphyPanel onAdd={(url)=>spawnPageItem({type:"gif",url})}/>}
            {activePanel==="emojis"&&<div><p style={{fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:300,color:"#8B6E4E",marginBottom:14,lineHeight:1.7}}>Tap to place — drag to move, corner to resize.</p><div className="emoji-grid">{EMOJIS.map(e=><button key={e} className="emoji-btn" onClick={()=>spawnPageItem({type:"emoji",content:e})}>{e}</button>)}</div></div>}
            {activePanel==="audio"&&<div><p style={{fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:300,color:"#8B6E4E",lineHeight:1.85,marginBottom:18}}>Add a voice message or music clip to your card.</p><button className="btn-upload">{Icon.music(15)} Record a voice message</button><button className="btn-upload">{Icon.upload(15)} Upload an audio clip</button><p style={{fontFamily:"'Jost',sans-serif",fontSize:11,color:"rgba(42,21,8,.28)",textAlign:"center",marginTop:8,letterSpacing:".3px"}}>MP3, WAV, M4A — max 5 MB</p></div>}
          </div>
        </div>

        <div className="canvas-area" onClick={desel}>
          <div className="page-tabs-wrap" onClick={e=>e.stopPropagation()}>
            <button className={`page-tab-btn${activePage===0?" active":""}`} onClick={()=>setActivePage(0)}>Cover</button>
            {pages.map((pg,i)=>(
              <button key={pg.id} className={`page-tab-btn${activePage===i+1?" active":""}`} onClick={()=>setActivePage(i+1)}>
                <div className="page-dot" style={{background:activePage===i+1?theme.accent:"rgba(42,21,8,.2)"}}/>
                Page {pg.num}
                {pg.items.filter(it=>it.type==="text").length>0&&<span style={{background:theme.accent,color:"white",borderRadius:"100px",fontSize:9,padding:"1px 7px",fontFamily:"'Jost',sans-serif"}}>{pg.items.filter(it=>it.type==="text").length}</span>}
              </button>
            ))}
            <button className="page-tab-btn" onClick={e=>{e.stopPropagation();addPage();}}>{Icon.plus(11)} Page</button>
          </div>

          {activePage===0&&(
            <div className="card-wrap" key="cover" onClick={e=>e.stopPropagation()}>
              <div className="card-cover" style={{background:theme.cover}}>
                <div style={{position:"absolute",top:22,right:24,opacity:.15,pointerEvents:"none"}}>{Icon[theme.icon](40,theme.accent)}</div>
                <div ref={coverRef} className="cover-canvas" onClick={desel} style={{minHeight:390}}>
                  {coverItems.map(item=>(
                    <DItem key={item.id} item={item} selected={selCover===item.id}
                      onSelect={id=>{setSelCover(id);setSelPage(null);}}
                      onDelete={delCovItem} onMove={moveCovItem} onResize={resCovItem} onTextChange={editCovText}
                      containerRef={coverRef}/>
                  ))}
                  {coverItems.length===0&&<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><div style={{color:theme.accent,marginBottom:18}}>{Icon[theme.icon](50,theme.accent)}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:theme.accent,fontWeight:400}}>{theme.name}</div></div>}
                </div>
              </div>
              <div style={{marginTop:12,padding:"10px 16px",background:"rgba(255,255,255,.68)",borderRadius:8,fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:300,color:"#8B6E4E",lineHeight:1.85,textAlign:"center",letterSpacing:".2px"}}>
                Use the <strong style={{fontWeight:500}}>Sign tab</strong> to add text · drag to reposition · corner to resize · ✎ edit inline
              </div>
            </div>
          )}

          {activePage>0&&curPage&&(
            <div className="card-wrap" key={curPage.id} onClick={e=>e.stopPropagation()}>
              <div className="card-page" style={{"--acc":theme.accent}}>
                <div ref={el=>pageRefs.current[activePage-1]=el} className="page-canvas" onClick={desel}>
                  <div className="page-header">
                    <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{color:theme.accent,opacity:.7}}>{Icon[theme.icon](15,theme.accent)}</div><span className="page-num-label">Page {curPage.num} of {pages.length}</span></div>
                    {pages.length>1&&<button className="page-del-btn" onClick={()=>delPage(activePage-1)}>{Icon.trash(14,"rgba(42,21,8,.28)")}</button>}
                  </div>
                  {curPage.items.length===0&&<div className="page-empty">This page is waiting to be filled<br/>with warm words and kind hearts…</div>}
                  {curPage.items.map(item=>(
                    <DItem key={item.id} item={item} selected={selPage===item.id}
                      onSelect={id=>{setSelPage(id);setSelCover(null);}}
                      onDelete={id=>delPageItem(activePage-1,id)}
                      onMove={(id,x,y)=>movePageItem(activePage-1,id,x,y)}
                      onResize={(id,w,h)=>resPageItem(activePage-1,id,w,h)}
                      onTextChange={(id,text)=>editPageText(activePage-1,id,text)}
                      containerRef={{current:pageRefs.current[activePage-1]}}/>
                  ))}
                  {curPage.items.length>0&&<div className="drop-hint">Click to select · drag to move · corner to resize · ✎ edit · × remove</div>}
                </div>
              </div>
              <button className="btn-page-add" onClick={e=>{e.stopPropagation();addPage();}}>{Icon.plus(13)} Add another signing page</button>
            </div>
          )}

          <div className="canvas-footer" onClick={e=>e.stopPropagation()}>
            <span className="canvas-meta">{pages.length} page{pages.length!==1?"s":""} · {coverItems.length} cover · {totalItems} page items</span>
            <button className="btn-send" onClick={()=>setShowSend(true)}>{Icon.send(14,"#FAF5EE")} Send this Card</button>
          </div>
        </div>

        <div className="panel-right">
          <div className="sidebar-title">Pages</div>
          <div className="pages-list">
            <div className={`page-list-item${activePage===0?" active":""}`} onClick={()=>setActivePage(0)}>
              <div style={{color:theme?.accent,opacity:.65}}>{theme&&Icon[theme.icon](13,theme.accent)}</div>
              <span className="page-list-name" style={{fontFamily:"'Playfair Display',serif",fontWeight:400}}>Cover</span>
              <span className="page-list-count">{coverItems.length} items</span>
            </div>
            {pages.map((pg,i)=>(
              <div key={pg.id} className={`page-list-item${activePage===i+1?" active":""}`} onClick={()=>setActivePage(i+1)}>
                <div className="page-list-dot" style={{background:pg.items.length>0?theme.accent:"rgba(42,21,8,.16)"}}/>
                <span className="page-list-name">Page {pg.num}</span>
                <span className="page-list-count">{pg.items.length} items</span>
              </div>
            ))}
          </div>
          <button className="btn-ghost-sm" style={{width:"100%"}} onClick={addPage}>+ Add page</button>
          <div style={{marginTop:24}}>
            <div className="sidebar-title">Signatures</div>
            {pages.every(p=>p.items.filter(it=>it.type==="text").length===0)?<p className="empty-note">No signatures yet — be the first!</p>:pages.map(pg=>pg.items.filter(it=>it.type==="text").map(s=>(
              <div key={s.id} className="signer-row"><div className="signer-dot" style={{background:s.color}}/><div className="signer-info"><div className="signer-name" style={{color:s.color}}>{s.signerName||"—"} <span style={{fontWeight:400,fontSize:10,color:"rgba(42,21,8,.32)"}}>· p.{pg.num}</span></div><div className="signer-preview">{s.text}</div></div></div>
            )))}
          </div>
          <div className="invite-box" style={{marginTop:20}}>
            <p className="invite-note" style={{display:"flex",alignItems:"flex-start",gap:7}}>{Icon.link(13,"#8B6E4E")}<span><strong style={{fontWeight:500}}>Invite others to sign</strong> — share a link so anyone can add their message.</span></p>
            <button className="btn-ghost" style={{width:"100%",marginTop:10,fontSize:12}}>Copy invite link</button>
          </div>
        </div>
      </div>

      {showSend&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowSend(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Send your card</h2>
              <button className="close-btn" onClick={()=>setShowSend(false)}>{Icon.x(14)}</button>
            </div>
            <div className="modal-tabs">
              {[{id:"email",ic:Icon.email(16),lbl:"Email"},{id:"text",ic:Icon.message(16),lbl:"Text"},{id:"schedule",ic:Icon.calendar(16),lbl:"Schedule"},{id:"pdf",ic:Icon.download(16),lbl:"PDF"},{id:"print",ic:Icon.printer(16),lbl:"Print"}].map(t=>(
                <button key={t.id} className={`modal-tab${sendTab===t.id?" active":""}`} onClick={()=>setSendTab(t.id)}>{t.ic}<span className="modal-tab-label">{t.lbl}</span></button>
              ))}
            </div>
            <div className="modal-body">
              {sent?(
                <div className="sent-confirm">{Icon.check(54)}<h3 className="sent-title">Card sent with love</h3><p className="sent-sub">Your kindness is on its way.<br/>May it bring a warm smile.</p></div>
              ):<>
                {(sendTab==="email"||sendTab==="text")&&(
                  <div>
                    <label className="field-label">Recipient's name</label>
                    <input className="f-input" placeholder="Who is this for?" value={form.name} onChange={fSet("name")}/>
                    <label className="field-label">{sendTab==="email"?"Email address":"Phone number"}</label>
                    <input className="f-input" placeholder={sendTab==="email"?"hello@example.com":"+1 (555) 000-0000"} value={form.to} onChange={fSet("to")}/>
                    <label className="field-label">Personal note</label>
                    <textarea className="f-textarea" rows={3} placeholder="Add a private note…" value={form.note} onChange={fSet("note")}/>
                    <button className="btn-send" style={{width:"100%",marginTop:16,justifyContent:"center"}} onClick={doSend}>{Icon.send(14,"#FAF5EE")} Send with love</button>
                  </div>
                )}
                {sendTab==="schedule"&&(
                  <div>
                    <p style={{fontFamily:"'Jost',sans-serif",fontWeight:300,color:"#8B6E4E",fontSize:14,lineHeight:1.85,marginBottom:18}}>Schedule your card to arrive on a special day.</p>
                    <label className="field-label">Recipient's name</label>
                    <input className="f-input" placeholder="Who is this for?" value={form.name} onChange={fSet("name")}/>
                    <label className="field-label">Email or phone</label>
                    <input className="f-input" placeholder="Where should we send it?" value={form.to} onChange={fSet("to")}/>
                    <label className="field-label">Delivery date & time</label>
                    <div className="date-row"><input type="date" className="f-input" value={form.date} onChange={fSet("date")}/><input type="time" className="f-input" value={form.time} onChange={fSet("time")}/></div>
                    <button className="btn-send" style={{width:"100%",marginTop:16,justifyContent:"center"}} onClick={doSend}>{Icon.calendar(14,"#FAF5EE")} Schedule this Card</button>
                  </div>
                )}
                {sendTab==="pdf"&&<div className="modal-center">{Icon.download(52,"#d4a843")}<h3 className="modal-sec-title">Save as PDF</h3><p className="modal-sec-body">Download all {pages.length+1} pages as a beautifully formatted PDF.</p><button className="btn-send" style={{padding:"13px 40px"}} onClick={()=>window.print()}>Download PDF</button></div>}
                {sendTab==="print"&&<div className="modal-center">{Icon.printer(52,"#d4a843")}<h3 className="modal-sec-title">Print your card</h3><p className="modal-sec-body">Print all {pages.length+1} pages and hand-deliver with love.</p><button className="btn-send" style={{padding:"13px 40px"}} onClick={()=>window.print()}>Print Card</button></div>}
              </>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
