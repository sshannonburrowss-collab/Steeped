import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "./supabase";

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
  resize:   (s=8,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  x:        (s=11,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  email:    (s=17,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  message:  (s=17,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  calendar: (s=17,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  download: (s=17,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  printer:  (s=17,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  check:    (s=52,c="#d4a843")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  arrow:    (s=16,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  copy:     (s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  user:     (s=16,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  users:    (s=16,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  share:    (s=15,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  cake:     (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20M7 8v2M12 8v2M17 8v2M7 4h.01M12 4h.01M17 4h.01"/></svg>,
  snowflake:(s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 7l-5-5-5 5M17 17l-5 5-5-5"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M7 7l-5 5 5 5M17 7l5 5-5 5"/></svg>,
  heart:    (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  flower:   (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 0 8M12 14a4 4 0 0 0 0 8M2 12a4 4 0 0 1 8 0M14 12a4 4 0 0 0 8 0"/></svg>,
  hug:      (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M5 11c-1 0-2 .8-2 2v4h4v-4c0-1.2-1-2-2-2zM19 11c1 0 2 .8 2 2v4h-4v-4c0-1.2 1-2 2-2z"/><path d="M8 21v-4M16 21v-4M9 11h6"/></svg>,
  star:     (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  leaf:     (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  mail:     (s=32,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

const TEMPLATES = {
  // Each array entry is a preset set of coverItems
  default: (theme) => [
    { id:uid(), type:"text", x:40, y:90, text:theme.name, font:"'Playfair Display',serif", size:34, color:theme.accent, bold:false, italic:false },
    { id:uid(), type:"text", x:42, y:140, text:"A card made with love", font:"'Lora',serif", size:14, color:theme.accent, bold:false, italic:true },
  ],
  centered: (theme) => [
    { id:uid(), type:"text", x:80, y:150, text:theme.name, font:"'Dancing Script',cursive", size:38, color:theme.accent, bold:false, italic:false },
    { id:uid(), type:"text", x:100, y:205, text:"with love ♥", font:"'Lora',serif", size:13, color:theme.accent, bold:false, italic:true },
  ],
  minimal: (theme) => [
    { id:uid(), type:"text", x:32, y:280, text:theme.name.toUpperCase(), font:"'Jost',sans-serif", size:18, color:theme.accent, bold:true, italic:false },
    { id:uid(), type:"text", x:32, y:308, text:"— a card from us to you", font:"'Lora',serif", size:12, color:theme.accent, bold:false, italic:true },
  ],
  bold: (theme) => [
    { id:uid(), type:"text", x:30, y:60, text:theme.name, font:"'Playfair Display',serif", size:42, color:theme.accent, bold:true, italic:false },
    { id:uid(), type:"text", x:32, y:120, text:"Made with kindness", font:"'Crimson Pro',serif", size:16, color:theme.accent, bold:false, italic:false },
  ],
  script: (theme) => [
    { id:uid(), type:"text", x:50, y:110, text:"With love,", font:"'Dancing Script',cursive", size:20, color:theme.accent, bold:false, italic:false },
    { id:uid(), type:"text", x:40, y:148, text:theme.name, font:"'Dancing Script',cursive", size:44, color:theme.accent, bold:false, italic:false },
  ],
};

const TEMPLATE_LIST = [
  { id:"default",  label:"Classic" },
  { id:"centered", label:"Elegant" },
  { id:"minimal",  label:"Minimal" },
  { id:"bold",     label:"Bold" },
  { id:"script",   label:"Script" },
];
const THEMES = [
  { id:"birthday",    name:"Happy Birthday",   icon:"cake",      accent:"#b85c38", cover:"linear-gradient(150deg,#fdf0e8,#f8dcc8,#f0c4a8)" },
  { id:"holiday",     name:"Happy Holidays",   icon:"snowflake", accent:"#3a6daa", cover:"linear-gradient(150deg,#eaf2ff,#cfe0ff,#b8d0ff)" },
  { id:"thinking",    name:"Thinking of You",  icon:"heart",     accent:"#8b3a7a", cover:"linear-gradient(150deg,#f8eeff,#ead8ff,#d8c0ff)" },
  { id:"justbecause", name:"Just Because",     icon:"flower",    accent:"#b84878", cover:"linear-gradient(150deg,#fff0f6,#ffd0e8,#ffb8d8)" },
  { id:"hugs",        name:"Sending Hugs",     icon:"hug",       accent:"#a05820", cover:"linear-gradient(150deg,#fff8ee,#ffe8c0,#ffd898)" },
  { id:"congrats",    name:"Congratulations",  icon:"star",      accent:"#2a7a50", cover:"linear-gradient(150deg,#eefff6,#c0f0d8,#a0e8c0)" },
  { id:"thankyou",    name:"Thank You",        icon:"leaf",      accent:"#8b4820", cover:"linear-gradient(150deg,#fff8f0,#ffe0b8,#ffd098)" },
  { id:"blank",       name:"Just a Card",      icon:"mail",      accent:"#5a4030", cover:"linear-gradient(150deg,#faf7f2,#f0e8dc,#e8ddd0)" },
];

const FONTS = [
  { label:"Playfair",    value:"'Playfair Display', serif" },
  { label:"Lora",        value:"'Lora', serif" },
  { label:"Handwritten", value:"'Dancing Script', cursive" },
  { label:"Literary",    value:"'Crimson Pro', serif" },
];

const EMOJIS = ["❤️","🌹","✨","🌸","💫","🌟","🌺","🌈","🦋","🌻","💝","🌙","⭐","💐","😊","🎶","🌷","☀️","🌿","💞","🪷","🌼","🌊","🐝","🍀","🌴","🦜","🍋","🌮","🎵"];

const CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;min-height:100%;background:#FAF5EE;}
#root{width:100%;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes cardIn{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes steamRise{0%{transform:translateY(0) scale(1);opacity:0}25%{opacity:.13}100%{transform:translateY(-160px) scale(2.2);opacity:0}}
@keyframes sentPop{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes pageFlip{0%{opacity:.5;transform:perspective(1200px) rotateY(-5deg)}100%{opacity:1;transform:perspective(1200px) rotateY(0)}}
@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
.app{font-family:'Lora',serif;background:#FAF5EE;color:#2A1508;min-height:100vh;}
.nav{display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:68px;border-bottom:1px solid rgba(42,21,8,.08);background:rgba(250,245,238,.97);backdrop-filter:blur(16px);position:sticky;top:0;z-index:100;}
.nav-wordmark{font-family:'Playfair Display',serif;font-size:24px;font-weight:400;letter-spacing:-.4px;color:#2A1508;line-height:1;cursor:pointer;}
.nav-wordmark em{font-style:italic;color:#d4a843;}
.nav-tagline{font-family:'Jost',sans-serif;font-weight:300;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(42,21,8,.38);display:block;margin-top:3px;}
.btn-dark{background:#2A1508;color:#FAF5EE;border:none;padding:10px 24px;font-family:'Jost',sans-serif;font-size:13px;font-weight:400;letter-spacing:.4px;border-radius:4px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
.btn-dark:hover{background:#3d2010;transform:translateY(-1px);box-shadow:0 6px 20px rgba(42,21,8,.2);}
.btn-dark:disabled{opacity:.55;cursor:default;transform:none;box-shadow:none;}
.btn-hero{background:#2A1508;color:#FAF5EE;border:none;padding:16px 44px;font-family:'Jost',sans-serif;font-size:14px;font-weight:400;letter-spacing:1px;border-radius:4px;cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;gap:12px;}
.btn-hero:hover{background:#3d2010;transform:translateY(-2px);box-shadow:0 12px 36px rgba(42,21,8,.22);}
.btn-ghost{background:transparent;border:1px solid rgba(42,21,8,.18);color:#2A1508;padding:9px 22px;font-family:'Jost',sans-serif;font-size:13px;letter-spacing:.3px;border-radius:4px;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:7px;}
.btn-ghost:hover{background:rgba(42,21,8,.04);border-color:rgba(42,21,8,.3);}
.btn-ghost-sm{background:transparent;border:1px solid rgba(42,21,8,.14);color:#8B6E4E;padding:7px 16px;font-family:'Jost',sans-serif;font-size:12px;border-radius:4px;cursor:pointer;transition:all .15s;}
.btn-ghost-sm:hover{background:rgba(42,21,8,.04);color:#2A1508;}
.btn-send{background:#2A1508;color:#FAF5EE;border:none;padding:11px 28px;font-family:'Jost',sans-serif;font-size:13px;letter-spacing:.4px;border-radius:4px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
.btn-send:hover{background:#3d2010;transform:translateY(-1px);box-shadow:0 6px 22px rgba(42,21,8,.25);}
.btn-send:disabled{opacity:.55;cursor:default;transform:none;box-shadow:none;}
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
.f-select{padding:8px 10px;border:1px solid rgba(42,21,8,.13);border-radius:5px;font-family:'Jost',sans-serif;font-size:12px;background:#FAF5EE;color:#2A1508;outline:none;cursor:pointer;max-width:100%;}
.f-color{width:38px;height:34px;border:1px solid rgba(42,21,8,.13);border-radius:5px;cursor:pointer;padding:2px;background:#FAF5EE;}
.style-row{display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;}
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
.d-signer-name{font-style:italic;opacity:.65;margin-top:4px;line-height:1.4;}
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
.card-url-box{padding:12px 14px;background:#FFF9F2;border-radius:8px;border:1px solid rgba(212,168,67,.28);margin-bottom:20px;}
.card-url-label{font-family:'Jost',sans-serif;font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:rgba(42,21,8,.38);margin-bottom:7px;}
.card-url-row{display:flex;align-items:center;gap:8px;}
.card-url-text{flex:1;font-family:'Jost',sans-serif;font-size:11.5px;color:#2A1508;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.auth-overlay{position:fixed;inset:0;background:rgba(42,21,8,.5);backdrop-filter:blur(12px);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;}
.auth-modal{background:white;border-radius:16px;width:100%;max-width:420px;padding:36px 36px 32px;box-shadow:0 44px 110px rgba(42,21,8,.28);animation:cardIn .25s ease;}
.auth-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:400;margin-bottom:6px;}
.auth-sub{font-family:'Jost',sans-serif;font-size:13px;font-weight:300;color:#8B6E4E;margin-bottom:26px;line-height:1.7;}
.auth-error{padding:10px 12px;background:#fff0ed;border-radius:5px;font-family:'Jost',sans-serif;font-size:12px;color:#b84848;margin-bottom:14px;border:1px solid rgba(184,74,48,.15);}
.auth-switch{text-align:center;margin-top:18px;font-family:'Jost',sans-serif;font-size:12.5px;color:#8B6E4E;}
.auth-switch button{background:none;border:none;color:#2A1508;cursor:pointer;font-size:12.5px;font-family:'Jost',sans-serif;text-decoration:underline;padding:0;}
.spinner{width:16px;height:16px;border:2px solid rgba(250,245,238,.3);border-top-color:#FAF5EE;border-radius:50%;animation:spin .6s linear infinite;display:inline-block;}
.nav-user-name{font-family:'Jost',sans-serif;font-size:12px;font-weight:300;color:rgba(42,21,8,.55);}
.loading-screen{display:flex;align-items:center;justify-content:center;min-height:calc(100vh - 68px);flex-direction:column;gap:16px;}
.loading-text{font-family:'Jost',sans-serif;font-size:13px;font-weight:300;color:#8B6E4E;letter-spacing:.5px;}
.viewer-wrap{display:flex;flex-direction:column;min-height:calc(100vh - 68px);background:#180d05;}
.viewer-header{text-align:center;padding:28px 20px 18px;border-bottom:1px solid rgba(212,168,67,.1);}
.viewer-title{font-family:'Playfair Display',serif;font-size:2rem;font-weight:400;color:#FAF5EE;margin-bottom:16px;}
.viewer-action-row{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;}
.viewer-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:100px;border:1.5px solid rgba(212,168,67,.35);background:rgba(212,168,67,.1);color:#d4a843;font-family:'Jost',sans-serif;font-size:13px;font-weight:400;letter-spacing:.3px;cursor:pointer;transition:all .18s;}
.viewer-btn:hover{background:rgba(212,168,67,.2);border-color:rgba(212,168,67,.65);transform:translateY(-1px);}
.viewer-stage{flex:1;display:flex;align-items:flex-start;justify-content:center;padding:22px 20px 10px;}
.viewer-slide{width:100%;max-width:520px;animation:cardIn .3s ease;}
.viewer-cover-card{border-radius:14px;overflow:hidden;box-shadow:0 28px 70px rgba(0,0,0,.5);}
.viewer-msg-slide{padding:36px 28px;min-height:200px;}
.viewer-msg-text{font-family:'Lora',serif;font-size:1.05rem;line-height:1.8;color:#FAF5EE;margin-bottom:22px;word-break:break-word;}
.viewer-msg-author{font-family:'Jost',sans-serif;font-size:0.95rem;font-weight:600;color:#FAF5EE;letter-spacing:.2px;}
.viewer-bottom{padding:16px 20px 28px;}
.viewer-view-row{display:flex;justify-content:center;gap:12px;margin-bottom:18px;}
.viewer-nav-row{display:flex;align-items:center;justify-content:center;gap:18px;}
.viewer-arrow{width:40px;height:40px;border-radius:50%;border:1.5px solid rgba(212,168,67,.3);background:rgba(212,168,67,.08);color:#d4a843;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;flex-shrink:0;}
.viewer-arrow:hover{background:rgba(212,168,67,.18);border-color:rgba(212,168,67,.6);}
.viewer-arrow:disabled{opacity:.3;cursor:default;transform:none;}
.viewer-dots{display:flex;align-items:center;gap:8px;}
.viewer-dot{width:9px;height:9px;border-radius:50%;background:rgba(212,168,67,.2);cursor:pointer;transition:all .2s;}
.viewer-dot.active{background:#d4a843;transform:scale(1.35);}
.viewer-board-header{background:linear-gradient(135deg,#4a1e08,#2e1006,#1a0804);padding:18px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid rgba(212,168,67,.12);}
.viewer-board-back{display:inline-flex;align-items:center;gap:7px;padding:8px 16px;border-radius:100px;border:1px solid rgba(212,168,67,.25);background:rgba(212,168,67,.08);color:#d4a843;font-family:'Jost',sans-serif;font-size:12px;cursor:pointer;transition:all .15s;flex-shrink:0;}
.viewer-board-back:hover{background:rgba(212,168,67,.18);}
.viewer-board-titles{text-align:center;flex:1;}
.viewer-board-name{font-family:'Playfair Display',serif;font-size:1.2rem;color:#FAF5EE;font-weight:400;}
.viewer-board-for{font-family:'Jost',sans-serif;font-size:12px;color:rgba(212,168,67,.7);margin-top:2px;letter-spacing:.4px;}
.viewer-board-body{padding:20px 16px;display:flex;flex-direction:column;gap:12px;}
.viewer-sig-card{padding:20px 22px;background:#221008;border:1px solid rgba(212,168,67,.12);border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.3);transition:border-color .2s;}
.viewer-sig-card:hover{border-color:rgba(212,168,67,.28);}
.viewer-sig-text{font-family:'Lora',serif;font-size:0.98rem;line-height:1.75;margin-bottom:10px;word-break:break-word;}
.viewer-sig-name{font-family:'Jost',sans-serif;font-size:0.88rem;font-weight:500;color:rgba(250,245,238,.55);}
.viewer-empty-board{text-align:center;padding:52px 20px;font-family:'Playfair Display',serif;font-style:italic;color:rgba(212,168,67,.4);font-size:1.1rem;}
.sign-modal{background:white;border-radius:14px;width:100%;max-width:440px;max-height:84vh;overflow-y:auto;display:flex;flex-direction:column;box-shadow:0 44px 110px rgba(42,21,8,.28);animation:cardIn .25s ease;}
.sign-modal-header{display:flex;align-items:center;justify-content:space-between;padding:22px 26px 16px;border-bottom:1px solid rgba(42,21,8,.08);}
.sign-modal-body{padding:22px 26px;}
.mobile-signers-btn{display:none;}
@media(max-width:900px){
  .editor-layout{grid-template-columns:240px 1fr;}
  .panel-right{display:none;}
  .card-wrap,.card-cover,.card-page{width:100%;max-width:480px;}
  .canvas-footer{width:100%;max-width:480px;}
}
@media(max-width:680px){
  .nav{padding:0 16px;height:56px;}
  .nav-tagline{display:none;}
  .nav-wordmark{font-size:20px;}
  .btn-ghost,.btn-send{padding:7px 12px;font-size:12px;}
  .editor-layout{grid-template-columns:1fr;grid-template-rows:1fr auto;height:auto;overflow:visible;}
  .panel-right{display:none;}
  .canvas-area{padding:14px 12px 12px;order:1;overflow-y:visible;}
  .page-tabs-wrap{flex-wrap:nowrap;overflow-x:auto;justify-content:flex-start;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:2px;margin-bottom:14px;gap:4px;}
  .page-tabs-wrap::-webkit-scrollbar{display:none;}
  .page-tab-btn{flex-shrink:0;padding:6px 12px;font-size:11px;}
  .card-wrap,.card-cover,.card-page{width:100%;max-width:100%;}
  .card-cover{min-height:260px;border-radius:10px;}
  .cover-canvas{min-height:260px;padding:16px;}
  .card-page{min-height:360px;border-radius:10px;}
  .page-canvas{min-height:360px;padding:18px 18px 24px;}
  .canvas-footer{width:100%;flex-direction:column;gap:10px;align-items:stretch;margin-top:16px;}
  .canvas-footer .btn-send{width:100%;justify-content:center;}
  .canvas-meta{text-align:center;}
  .panel-left{order:2;border-right:none;border-top:2px solid rgba(42,21,8,.08);max-height:340px;flex-shrink:0;}
  .panel-tabs{padding:6px;}
  .panel-tab{padding:8px 3px;}
  .panel-tab .tab-label{font-size:8px;}
  .panel-content{padding:14px;}
  .style-row{gap:6px;}
  .f-select{font-size:11px;padding:7px 6px;}
  .modal-overlay,.auth-overlay{align-items:flex-end;padding:0;}
  .modal,.sign-modal{border-radius:20px 20px 0 0;max-height:88vh;animation:slideUp .3s ease;}
  .auth-modal{border-radius:20px 20px 0 0;max-height:92vh;overflow-y:auto;}
  .modal-header,.sign-modal-header{padding:18px 20px 14px;}
  .modal-title{font-size:18px;}
  .modal-body,.sign-modal-body{padding:18px 20px;}
  .date-row{grid-template-columns:1fr;}
  .viewer-title{font-size:1.5rem;}
  .viewer-btn{padding:8px 16px;font-size:12px;}
  .viewer-msg-slide{padding:24px 18px;}
  .viewer-board-body{padding:14px 12px;}
  .viewer-sig-card{padding:16px;}
  .hero{padding:48px 20px 32px;}
  .fan-wrap{gap:0;}
  .fan-card{width:90px;height:72px;margin:0 -14px;}
  .themes-view{padding:28px 16px;}
  .themes-grid{grid-template-columns:repeat(2,1fr);gap:10px;}
  .theme-card{padding:24px 12px 20px;}
  .mobile-signers-btn{display:flex;align-items:center;gap:6px;position:fixed;bottom:356px;right:14px;z-index:50;background:white;border:1px solid rgba(42,21,8,.15);border-radius:100px;padding:8px 14px;font-family:'Jost',sans-serif;font-size:11px;font-weight:500;color:#2A1508;cursor:pointer;box-shadow:0 4px 18px rgba(42,21,8,.15);}
  .sig-drawer-overlay{position:fixed;inset:0;background:rgba(42,21,8,.38);z-index:150;backdrop-filter:blur(6px);}
  .sig-drawer{position:fixed;bottom:0;left:0;right:0;background:white;border-radius:20px 20px 0 0;z-index:160;padding:20px;max-height:70vh;overflow-y:auto;animation:slideUp .3s ease;}
  .sig-drawer-handle{width:36px;height:4px;background:rgba(42,21,8,.15);border-radius:2px;margin:0 auto 18px;}
}
`;

const uid = () => Date.now() + Math.random();
const makePage = (num) => ({ id: uid(), num, items: [] });

/* ─── GiphyPanel ─────────────────────────────────────────────── */
function GiphyPanel({ onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debRef = useRef(null);
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
  return (
    <div>
      <input className="f-input" placeholder="Search GIFs…" value={query}
        onChange={e => { setQuery(e.target.value); clearTimeout(debRef.current); debRef.current = setTimeout(() => search(e.target.value), 500); }}
        style={{ marginBottom:12 }}/>
      {loading && <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#8B6E4E", marginBottom:8 }}>Searching…</p>}
      <div className="media-grid">{results.map(gif => <img key={gif.id} src={gif.images.fixed_height_small.url} alt={gif.title} className="media-thumb" style={{ height:68 }} onClick={() => onAdd(gif.images.original.url)}/>)}</div>
      <p style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"rgba(42,21,8,.28)", marginTop:12, textAlign:"center", letterSpacing:"1px", textTransform:"uppercase" }}>Powered by GIPHY</p>
    </div>
  );
}

/* ─── PhotosPanel ────────────────────────────────────────────── */
function PhotosPanel({ onAdd, uploads, onUpload, fileRef }) {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const debRef = useRef(null);
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
  return (
    <div>
      <button className="btn-upload" onClick={() => fileRef.current?.click()}>{Icon.upload(15)} Upload your own photo</button>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={onUpload}/>
      {uploads.length > 0 && (<><div className="sub-label" style={{ marginBottom:8 }}>Your uploads</div><div className="media-grid" style={{ marginBottom:14 }}>{uploads.map(p => <img key={p.id} src={p.url} alt={p.label} className="media-thumb" onClick={() => onAdd(p.url)}/>)}</div></>)}
      <input className="f-input" placeholder="Search free photos…" value={query}
        onChange={e => { setQuery(e.target.value); clearTimeout(debRef.current); debRef.current = setTimeout(() => search(e.target.value), 500); }}
        style={{ marginBottom:10 }}/>
      {loading && <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#8B6E4E", marginBottom:8 }}>Searching…</p>}
      <div className="media-grid">{photos.map(p => <img key={p.id} src={p.urls.small} alt={p.alt_description||""} className="media-thumb" onClick={() => onAdd(p.urls.regular)}/>)}</div>
      <p style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"rgba(42,21,8,.28)", marginTop:12, textAlign:"center", letterSpacing:"1px", textTransform:"uppercase" }}>Photos by <a href="https://unsplash.com" target="_blank" rel="noreferrer" style={{ color:"rgba(42,21,8,.28)" }}>Unsplash</a></p>
    </div>
  );
}

/* ─── DItem ──────────────────────────────────────────────────── */
function DItem({ item, selected, onSelect, onDelete, onMove, onResize, onTextChange, containerRef }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const off = useRef({ x:0,y:0 });
  const startSize = useRef({ w:0,h:0 });
  const startMouse = useRef({ x:0,y:0 });
  const [editing, setEditing] = useState(false);
  const textRef = useRef(null);
  const gw = () => item.type==="text"?200:item.type==="emoji"?52:130;
  const gh = () => item.type==="text"?60:item.type==="emoji"?52:100;
  const w = item.width||gw(), h = item.height||gh();

  const handlePointerDown = useCallback((e) => {
    if (editing||resizing.current) return;
    e.stopPropagation(); onSelect(item.id); dragging.current=true;
    const cx=e.touches?e.touches[0].clientX:e.clientX, cy=e.touches?e.touches[0].clientY:e.clientY;
    const r=ref.current.getBoundingClientRect(); off.current={x:cx-r.left,y:cy-r.top};
    const move=(e)=>{ if(!dragging.current||!containerRef.current)return; const mx=e.touches?e.touches[0].clientX:e.clientX,my=e.touches?e.touches[0].clientY:e.clientY; const c=containerRef.current.getBoundingClientRect(); onMove(item.id,Math.max(0,mx-c.left-off.current.x),Math.max(0,my-c.top-off.current.y)); };
    const up=()=>{ dragging.current=false; window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); window.removeEventListener("touchmove",move); window.removeEventListener("touchend",up); };
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
    window.addEventListener("touchmove",move,{passive:false}); window.addEventListener("touchend",up);
  },[editing,item.id,onSelect,onMove,containerRef]);

  const handleResizeDown = useCallback((e) => {
    e.stopPropagation(); e.preventDefault(); resizing.current=true;
    const cx=e.touches?e.touches[0].clientX:e.clientX,cy=e.touches?e.touches[0].clientY:e.clientY;
    startMouse.current={x:cx,y:cy}; startSize.current={w:item.width||gw(),h:item.height||gh()};
    const move=(e)=>{ if(!resizing.current)return; const mx=e.touches?e.touches[0].clientX:e.clientX,my=e.touches?e.touches[0].clientY:e.clientY; onResize(item.id,Math.max(40,startSize.current.w+mx-startMouse.current.x),Math.max(30,startSize.current.h+my-startMouse.current.y)); };
    const up=()=>{ resizing.current=false; window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); window.removeEventListener("touchmove",move); window.removeEventListener("touchend",up); };
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
    window.addEventListener("touchmove",move,{passive:false}); window.addEventListener("touchend",up);
  },[item,onResize]);

  const startEdit=(e)=>{ e.stopPropagation(); setEditing(true); setTimeout(()=>{ if(textRef.current){ textRef.current.focus(); const r=document.createRange(); r.selectNodeContents(textRef.current); r.collapse(false); const s=window.getSelection(); s.removeAllRanges(); s.addRange(r); }},40); };
  const finishEdit=()=>{ setEditing(false); if(textRef.current) onTextChange(item.id,textRef.current.innerText); };

  return (
    <div ref={ref} className={`d-item${selected?" sel":""}`}
      style={{ left:item.x,top:item.y,width:w,height:item.type==="text"?"auto":h,zIndex:selected?50:10 }}
      onMouseDown={handlePointerDown} onTouchStart={handlePointerDown}
      onClick={e=>{ e.stopPropagation(); onSelect(item.id); }}>
      <div className="d-border"/>
      <button className="d-del" onClick={e=>{ e.stopPropagation(); onDelete(item.id); }}>{Icon.x(10,"#FAF5EE")}</button>
      {item.type==="text"&&<button className="d-edit" onClick={startEdit}>{Icon.edit(10,"#FAF5EE")}</button>}
      {item.type==="text"&&(
        <div>
          <div ref={textRef} className="d-text" contentEditable={editing} suppressContentEditableWarning
            onBlur={finishEdit} onKeyDown={e=>{ if(e.key==="Escape")finishEdit(); }}
            style={{ fontFamily:item.font,fontSize:item.size,color:item.color,fontWeight:item.bold?700:400,fontStyle:item.italic?"italic":"normal",width:"100%",minHeight:"1em" }}>
            {item.text}
          </div>
          {item.signerName&&!editing&&(
            <div className="d-signer-name" style={{ fontFamily:item.font,fontSize:Math.max(10,item.size*0.72),color:item.color }}>— {item.signerName}</div>
          )}
        </div>
      )}
      {item.type==="emoji"&&<span style={{ fontSize:Math.max(20,w*0.62),lineHeight:1,display:"block",textAlign:"center",width:w,height:h,lineHeight:h+"px" }}>{item.content}</span>}
      {(item.type==="photo"||item.type==="gif")&&<img src={item.url} alt="" style={{ width:w,height:h,objectFit:"cover",borderRadius:7,display:"block",boxShadow:"0 4px 18px rgba(42,21,8,.15)" }} onError={e=>e.target.style.opacity=".3"}/>}
      {item.type==="audio"&&<div style={{ width:w,padding:"10px 12px",background:"#FAF5EE",borderRadius:8,border:"1px solid rgba(42,21,8,.1)",display:"flex",alignItems:"center",gap:8 }}>{Icon.music(17,"#8B6E4E")}<audio controls style={{ width:"100%",height:32 }} src={item.url}/></div>}
      {selected&&<>
        <div onMouseDown={handleResizeDown} onTouchStart={handleResizeDown}
          style={{ position:"absolute",bottom:-8,right:-8,width:22,height:22,background:"#2A1508",borderRadius:"50%",cursor:"nwse-resize",zIndex:30,border:"2px solid white",boxShadow:"0 1px 5px rgba(0,0,0,.22)",display:"flex",alignItems:"center",justifyContent:"center",touchAction:"none" }}>
          {Icon.resize(8,"#FAF5EE")}
        </div>
        <div style={{ position:"absolute",bottom:-23,left:0,fontFamily:"'Jost',sans-serif",fontSize:9,color:"rgba(42,21,8,.3)",whiteSpace:"nowrap",pointerEvents:"none" }}>{Math.round(w)} × {Math.round(h)}</div>
      </>}
    </div>
  );
}

/* ─── CardViewer ─────────────────────────────────────────────── */
function CardViewer({ theme, coverItems, pages, recipientName, onSign }) {
  const [mode, setMode] = useState("slideshow");
  const msgSlides = pages.flatMap(pg => pg.items.filter(it=>it.type==="text").map(it=>({...it,pageNum:pg.num})));
  const totalSlides = 1 + msgSlides.length;
  const [slide, setSlide] = useState(0);
  const prev = () => setSlide(s=>Math.max(0,s-1));
  const next = () => setSlide(s=>Math.min(totalSlides-1,s+1));
  const ArrowL = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
  const ArrowR = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
  const GridIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
  const SlidesIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M22 10H2M22 14H2"/></svg>;
  const PenIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;

  if (mode==="board") return (
    <div className="viewer-wrap">
      <div className="viewer-board-header">
        <button className="viewer-board-back" onClick={()=>setMode("slideshow")}><ArrowL/> to Card</button>
        <div className="viewer-board-titles">
          <div className="viewer-board-name">{theme.name}</div>
          {recipientName&&<div className="viewer-board-for">For {recipientName}</div>}
        </div>
        <div style={{ width:88 }}/>
      </div>
      <div className="viewer-board-body">
        {msgSlides.length===0
          ?<div className="viewer-empty-board">No signatures yet — be the first to sign!</div>
          :msgSlides.map(s=>(
            <div key={s.id} className="viewer-sig-card">
              <div className="viewer-sig-text" style={{ color:s.color||"#FAF5EE",fontFamily:s.font }}>{s.text}</div>
              {s.signerName&&<div className="viewer-sig-name">{s.signerName}</div>}
            </div>
          ))
        }
      </div>
    </div>
  );

  const isFirstSlide = slide===0;
  const currentMsg = !isFirstSlide?msgSlides[slide-1]:null;
  return (
    <div className="viewer-wrap">
      <div className="viewer-header">
        <h1 className="viewer-title">{theme.name}</h1>
        <div className="viewer-action-row">
          <button className="viewer-btn" onClick={onSign}><PenIcon/> Sign Card</button>
          <button className="viewer-btn" onClick={()=>{ navigator.share?navigator.share({url:window.location.href}):navigator.clipboard.writeText(window.location.href); }}>{Icon.share(15,"#d4a843")} Share</button>
        </div>
      </div>
      <div className="viewer-stage">
        <div className="viewer-slide" key={slide}>
          {isFirstSlide&&(
            <div className="viewer-cover-card">
              <div style={{ background:theme.cover,minHeight:320,borderRadius:14,position:"relative",padding:24,pointerEvents:"none" }}>
                <div style={{ position:"absolute",top:20,right:22,opacity:.15 }}>{Icon[theme.icon](38,theme.accent)}</div>
                {coverItems.length===0
                  ?<div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14 }}>
                    <div style={{ color:theme.accent }}>{Icon[theme.icon](52,theme.accent)}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif",fontSize:28,color:theme.accent }}>{theme.name}</div>
                  </div>
                  :coverItems.map(item=>
                    item.type==="text"
                      ?<div key={item.id} style={{ position:"absolute",left:item.x,top:item.y,fontFamily:item.font,fontSize:item.size,color:item.color,fontWeight:item.bold?700:400,fontStyle:item.italic?"italic":"normal",whiteSpace:"pre-wrap",maxWidth:item.width||320 }}>{item.text}</div>
                      :(item.type==="photo"||item.type==="gif")
                        ?<img key={item.id} src={item.url} alt="" style={{ position:"absolute",left:item.x,top:item.y,width:item.width||130,height:item.height||100,objectFit:"cover",borderRadius:7 }}/>
                        :null
                  )
                }
              </div>
            </div>
          )}
          {!isFirstSlide&&currentMsg&&(
            <div className="viewer-msg-slide">
              <p className="viewer-msg-text" style={{ fontFamily:currentMsg.font,color:currentMsg.color||"#FAF5EE",fontWeight:currentMsg.bold?700:400,fontStyle:currentMsg.italic?"italic":"normal" }}>{currentMsg.text}</p>
              {currentMsg.signerName&&<p className="viewer-msg-author">— {currentMsg.signerName}</p>}
            </div>
          )}
          {!isFirstSlide&&!currentMsg&&(
            <div className="viewer-msg-slide"><p style={{ fontFamily:"'Playfair Display',serif",color:"rgba(212,168,67,.4)",fontStyle:"italic" }}>This page is empty.</p></div>
          )}
        </div>
      </div>
      <div className="viewer-bottom">
        <div className="viewer-view-row">
          <button className="viewer-btn" onClick={()=>setMode("slideshow")}><SlidesIcon/> Slide Show</button>
          <button className="viewer-btn" onClick={()=>setMode("board")}><GridIcon/> Board View</button>
        </div>
        <div className="viewer-nav-row">
          <button className="viewer-arrow" onClick={prev} disabled={slide===0}><ArrowL/></button>
          <div className="viewer-dots">{Array.from({length:totalSlides}).map((_,i)=><div key={i} className={`viewer-dot${i===slide?" active":""}`} onClick={()=>setSlide(i)}/>)}</div>
          <button className="viewer-arrow" onClick={next} disabled={slide===totalSlides-1}><ArrowR/></button>
        </div>
      </div>
    </div>
  );
}

/* ─── AuthModal — defined OUTSIDE Steeped to prevent remount on keystroke ── */
function AuthModal({ authMode, setAuthMode, authForm, setAuthForm, authError, doSignUp, doSignIn, setShowAuth, authLoading }) {
  return (
    <div className="auth-overlay" onClick={e=>e.target===e.currentTarget&&setShowAuth(false)}>
      <div className="auth-modal">
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6 }}>
          <h2 className="auth-title">{authMode==="signup"?"Create an account":"Welcome back"}</h2>
          <button className="close-btn" onClick={()=>setShowAuth(false)}>{Icon.x(14)}</button>
        </div>
        <p className="auth-sub">{authMode==="signup"?"Create an account so your card can be saved and shared with a link.":"Log in to save and send your card."}</p>
        {authError&&<div className="auth-error">{authError}</div>}

        {/* Google login */}
        <button onClick={()=>supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo:window.location.origin } })}
          style={{ width:"100%",padding:"10px 16px",marginBottom:16,border:"1px solid rgba(42,21,8,.18)",borderRadius:4,background:"white",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
          <div style={{ flex:1,height:1,background:"rgba(42,21,8,.1)" }}/>
          <span style={{ fontFamily:"'Jost',sans-serif",fontSize:11,color:"rgba(42,21,8,.35)" }}>or</span>
          <div style={{ flex:1,height:1,background:"rgba(42,21,8,.1)" }}/>
        </div>

        {authMode==="signup"&&<><label className="field-label">Your name</label><input className="f-input" placeholder="Jane Smith" value={authForm.name} onChange={e=>setAuthForm(p=>({...p,name:e.target.value}))} style={{ marginBottom:12 }}/></>}
        <label className="field-label">Email</label>
        <input className="f-input" type="email" placeholder="you@example.com" value={authForm.email} onChange={e=>setAuthForm(p=>({...p,email:e.target.value}))} style={{ marginBottom:12 }}/>
        <label className="field-label">Password</label>
        <input className="f-input" type="password" placeholder="••••••••" value={authForm.password}
          onChange={e=>setAuthForm(p=>({...p,password:e.target.value}))}
          onKeyDown={e=>{ if(e.key==="Enter") authMode==="signup"?doSignUp():doSignIn(); }}
          style={{ marginBottom:20 }}/>
        <button className="btn-dark" style={{ width:"100%",justifyContent:"center" }} onClick={authMode==="signup"?doSignUp:doSignIn} disabled={authLoading}>
          {authLoading?<span className="spinner"/>:authMode==="signup"?"Create account & continue":"Log in & continue"}
        </button>
        <p className="auth-switch">
          {authMode==="signup"
            ?<>Already have an account? <button onClick={()=>setAuthMode("login")}>Log in</button></>
            :<>No account? <button onClick={()=>setAuthMode("signup")}>Sign up free</button></>}
        </p>
      </div>
    </div>
  );
}
function ColorPicker({ value, onChange }) {
  const PRESETS = [
    "#2A1508","#8b4820","#b85c38","#d4a843","#a05820",
    "#2a7a50","#3a6daa","#8b3a7a","#b84878","#e53935",
    "#FAF5EE","#ffffff","#EDE6DC","#111111",
  ];
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:5, marginBottom:5 }}>
        {PRESETS.map(c=>(
          <button key={c} onClick={()=>onChange(c)} style={{
            width:26, height:26, borderRadius:4, background:c, padding:0, cursor:"pointer",
            border: value===c ? "2.5px solid #2A1508" : "1.5px solid rgba(42,21,8,.15)",
            boxShadow: value===c ? "0 0 0 1.5px #FAF5EE inset" : "none",
          }}/>
        ))}
        <div style={{ position:"relative", width:26, height:26 }}>
          <div style={{ width:26,height:26,borderRadius:4,border:"1.5px dashed rgba(42,21,8,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:"#8B6E4E",background:"#FAF5EE",cursor:"pointer" }}>+</div>
          <input type="color" value={value} onChange={e=>onChange(e.target.value)}
            style={{ position:"absolute",inset:0,opacity:0,width:"100%",height:"100%",cursor:"pointer" }}/>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function Steeped() {
  const [view, setView] = useState("home");
  const [theme, setTheme] = useState(null);
  const [activePage, setActivePage] = useState(0);
  const [pages, setPages] = useState([makePage(1)]);
  const [coverItems, setCoverItems] = useState([]);
  const [selCover, setSelCover] = useState(null);
  const [selPage, setSelPage] = useState(null);
const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [signerName, setSignerName] = useState("");
  const [msgText, setMsgText] = useState("");
  const [tColor, setTColor] = useState("#2A1508");
  const [tFont, setTFont] = useState(FONTS[0].value);
  const [tSize, setTSize] = useState(15);
  const [tBold, setTBold] = useState(false);
  const [tItalic, setTItalic] = useState(false);
  const [covText, setCovText] = useState("");
  const [covFont, setCovFont] = useState(FONTS[0].value);
  const [covColor, setCovColor] = useState("#2A1508");
  const [covSize, setCovSize] = useState(22);
  const [covBold, setCovBold] = useState(false);
  const [covItalic, setCovItalic] = useState(false);
  const [activePanel, setActivePanel] = useState("text");
  const [showSend, setShowSend] = useState(false);
  const [sendTab, setSendTab] = useState("email");
  const [sent, setSent] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [form, setForm] = useState({ name:"", to:"", note:"", date:"", time:"" });
  const [showSigDrawer, setShowSigDrawer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [authForm, setAuthForm] = useState({ email:"", password:"", name:"" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [cardId, setCardId] = useState(null);
  const [cardUrl, setCardUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingCard, setLoadingCard] = useState(false);
  const [viewCard, setViewCard] = useState(null);
  const [viewSignName, setViewSignName] = useState("");
  const [viewSignMsg, setViewSignMsg] = useState("");
  const [viewSignPage, setViewSignPage] = useState(0);
  const [viewSignFont, setViewSignFont] = useState(FONTS[0].value);
  const [viewSignColor, setViewSignColor] = useState("#2A1508");
  const [viewSigning, setViewSigning] = useState(false);
  const [viewSigned, setViewSigned] = useState(false);
  const [showViewSignForm, setShowViewSignForm] = useState(false);

  const fileRef = useRef(null);
  const coverRef = useRef(null);
  const pageRefs = useRef({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cid = params.get("card");
    if (cid) loadCard(cid);
    supabase.auth.getSession().then(({ data: { session } }) => { if (session?.user) setUser(session.user); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user||null); });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const loadCard = async (cid) => {
    setLoadingCard(true);
    try {
      const res = await fetch(`/api/get-card?id=${cid}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setViewCard(data); setCardId(cid); setView("view");
    } catch(e) { console.error("loadCard:", e); }
    setLoadingCard(false);
  };

  const saveCard = async (overrideUser) => {
    const currentUser = overrideUser||user;
    if (!currentUser) return null;
    setSaving(true);
    try {
      const res = await fetch("/api/save-card", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ theme, pages, coverItems, userId:currentUser.id, cardId:cardId||undefined }) });
      const data = await res.json();
      if (data.cardId) { setCardId(data.cardId); const url=`${window.location.origin}/?card=${data.cardId}`; setCardUrl(url); setSaving(false); return data.cardId; }
    } catch(e) { console.error("saveCard:", e); }
    setSaving(false); return null;
  };

  const doSignUp = async () => {
    setAuthLoading(true); setAuthError("");
    try {
      const { data, error } = await supabase.auth.signUp({ email:authForm.email, password:authForm.password, options:{ data:{ full_name:authForm.name } } });
      if (error) throw error;
      if (data.user) await handleAuthSuccess(data.user);
    } catch(e) { setAuthError(e.message); }
    setAuthLoading(false);
  };

  const doSignIn = async () => {
    setAuthLoading(true); setAuthError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email:authForm.email, password:authForm.password });
      if (error) throw error;
      if (data.user) await handleAuthSuccess(data.user);
    } catch(e) { setAuthError(e.message); }
    setAuthLoading(false);
  };

  const handleAuthSuccess = async (loggedInUser) => {
    setUser(loggedInUser); setShowAuth(false);
    if (pendingAction==="send") { setPendingAction(null); const cid=await saveCard(loggedInUser); if(cid) setShowSend(true); }
  };

  const doSignOut = async () => { await supabase.auth.signOut(); setUser(null); };

  const handleSendClick = async () => {
    if (!user) { setPendingAction("send"); setShowAuth(true); return; }
    const cid = await saveCard();
    if (cid) setShowSend(true);
  };

  const doSend = async () => {
    if (sendTab==="email") {
      try {
        const res = await fetch("/api/send-email", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ to:form.to, recipientName:form.name||"there", senderNote:form.note, cardUrl }) });
        const data = await res.json();
        if (res.ok) { setSent(true); setTimeout(()=>{ setSent(false); setShowSend(false); },2800); }
        else alert("Email error: "+(data.error||"Unknown error"));
      } catch(e) { alert("Network error: "+e.message); }
    } else { setSent(true); setTimeout(()=>{ setSent(false); setShowSend(false); },2800); }
  };

  const copyUrl = async (url) => { await navigator.clipboard.writeText(url||cardUrl); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const addViewSignature = async () => {
    if (!viewSignMsg.trim()) return;
    setViewSigning(true);
    const sig = { id:uid(), type:"text", text:viewSignMsg, signerName:viewSignName||"Anonymous", font:viewSignFont, size:15, color:viewSignColor, bold:false, italic:false, x:22, y:62+((viewCard.pages[viewSignPage]?.items||[]).length*82) };
    try {
      const res = await fetch("/api/add-signature", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ cardId, pageIndex:viewSignPage, signature:sig }) });
      if (res.ok) {
        setViewCard(prev=>({ ...prev, pages:prev.pages.map((pg,i)=>i===viewSignPage?{...pg,items:[...(pg.items||[]),sig]}:pg) }));
        setViewSigned(true); setViewSignMsg(""); setViewSignName("");
        setTimeout(()=>{ setShowViewSignForm(false); setViewSigned(false); },2500);
      }
    } catch(e) { console.error(e); }
    setViewSigning(false);
  };

  const fSet = (k) => (e) => setForm(p=>({...p,[k]:e.target.value}));
  const curPage = activePage>0?pages[activePage-1]:null;
  const addCovText = () => { if(!covText.trim())return; setCoverItems(p=>[...p,{id:uid(),type:"text",x:62,y:62+p.length*50,text:covText,font:covFont,size:covSize,color:covColor,bold:covBold,italic:covItalic}]); setCovText(""); };
  const addCovMedia = (item) => setCoverItems(p=>[...p,{...item,id:uid(),x:40+(p.length%3)*155,y:62+Math.floor(p.length/3)*125}]);
  const moveCovItem = useCallback((id,x,y)=>setCoverItems(p=>p.map(i=>i.id===id?{...i,x,y}:i)),[]);
  const resCovItem = useCallback((id,w,h)=>setCoverItems(p=>p.map(i=>i.id===id?{...i,width:w,height:h}:i)),[]);
  const delCovItem = (id) => setCoverItems(p=>p.filter(i=>i.id!==id));
  const editCovText = (id,text) => setCoverItems(p=>p.map(i=>i.id===id?{...i,text}:i));
  const spawnPageItem = (item) => { if(activePage===0){addCovMedia(item);return;} setPages(prev=>prev.map((pg,i)=>i===activePage-1?{...pg,items:[...pg.items,{...item,id:uid(),x:22+(pg.items.length%4)*112,y:62+Math.floor(pg.items.length/4)*132}]}:pg)); };
  const movePageItem = useCallback((pi,id,x,y)=>setPages(prev=>prev.map((pg,i)=>i===pi?{...pg,items:pg.items.map(it=>it.id===id?{...it,x,y}:it)}:pg)),[]);
  const resPageItem = useCallback((pi,id,w,h)=>setPages(prev=>prev.map((pg,i)=>i===pi?{...pg,items:pg.items.map(it=>it.id===id?{...it,width:w,height:h}:it)}:pg)),[]);
  const delPageItem = (pi,id) => setPages(prev=>prev.map((pg,i)=>i===pi?{...pg,items:pg.items.filter(it=>it.id!==id)}:pg));
  const editPageText = (pi,id,text) => setPages(prev=>prev.map((pg,i)=>i===pi?{...pg,items:pg.items.map(it=>it.id===id?{...it,text}:it)}:pg));
  const addSig = () => { if(!msgText.trim()||activePage===0)return; spawnPageItem({type:"text",text:msgText,signerName:signerName||"Anonymous",font:tFont,size:tSize,color:tColor,bold:tBold,italic:tItalic}); setMsgText(""); };
  const addPage = () => { const p=makePage(pages.length+1); setPages(prev=>[...prev,p]); setActivePage(pages.length+1); };
  const delPage = (idx) => { if(pages.length===1)return; const u=pages.filter((_,i)=>i!==idx).map((p,i)=>({...p,num:i+1})); setPages(u); if(activePage>u.length)setActivePage(u.length); };
  const desel = () => { setSelCover(null); setSelPage(null); };
  const totalItems = pages.reduce((a,p)=>a+p.items.length,0);
  const handleUpload = (e) => { Array.from(e.target.files).forEach(f=>{ const r=new FileReader(); r.onload=ev=>setUploads(p=>[...p,{id:uid(),url:ev.target.result,label:f.name}]); r.readAsDataURL(f); }); };
  const allSigs = pages.flatMap(pg=>pg.items.filter(it=>it.type==="text").map(s=>({...s,pageNum:pg.num})));
  const goEditor = (t) => {
  setTheme(t); setView("editor"); setActivePage(0);
  setPages([makePage(1)]); setCardId(null); setCardUrl("");
  setCoverItems(TEMPLATES["default"](t));
  setSelectedTemplate("default");
};

  const NavLogo = ({ onClick }) => (
    <div onClick={onClick} style={{ cursor:"pointer" }}>
      <div className="nav-wordmark">St<em>ee</em>ped</div>
      <span className="nav-tagline">Cards brewed with kindness</span>
    </div>
  );

  /* sign modal for recipients */
  const SignModal = () => (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowViewSignForm(false)}>
      <div className="sign-modal">
        <div className="sign-modal-header">
          <h2 className="modal-title">{viewSigned?"Signed!":"Sign this card"}</h2>
          <button className="close-btn" onClick={()=>{ setShowViewSignForm(false); setViewSigned(false); }}>{Icon.x(14)}</button>
        </div>
        <div className="sign-modal-body">
          {viewSigned?(
            <div style={{ textAlign:"center",padding:"20px 0" }}>
              {Icon.check(52)}
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:20,marginTop:14,marginBottom:8 }}>Your message has been added!</div>
              <p style={{ fontFamily:"'Jost',sans-serif",fontSize:13,color:"#8B6E4E",fontWeight:300,lineHeight:1.7 }}>Thank you for signing the card.</p>
            </div>
          ):(
            <>
              <label className="field-label">Your name</label>
              <input className="f-input" placeholder="Your name" value={viewSignName} onChange={e=>setViewSignName(e.target.value)}/>
              <label className="field-label">Your message</label>
              <textarea className="f-textarea" rows={4} placeholder="Write something wonderful…" value={viewSignMsg} onChange={e=>setViewSignMsg(e.target.value)}/>
              {(viewCard?.pages||[]).length>1&&<>
                <label className="field-label">Add to page</label>
                <select className="f-select" style={{ width:"100%",marginBottom:4 }} value={viewSignPage} onChange={e=>setViewSignPage(Number(e.target.value))}>
                  {(viewCard?.pages||[]).map((p,i)=><option key={p.id} value={i}>Page {p.num}</option>)}
                </select>
              </>}
              <div style={{ display:"flex",gap:8,alignItems:"flex-end",marginTop:10 }}>
                <div className="style-col" style={{ flex:1 }}><span className="sub-label">Font</span><select className="f-select" style={{ width:"100%" }} value={viewSignFont} onChange={e=>setViewSignFont(e.target.value)}>{FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
                <div className="style-col" style={{flex:1}}>
  <span className="sub-label">Color</span>
  <ColorPicker value={viewSignColor} onChange={setViewSignColor}/>
</div>
              </div>
              <button className="btn-send" style={{ width:"100%",marginTop:16,justifyContent:"center" }} onClick={addViewSignature} disabled={viewSigning||!viewSignMsg.trim()}>
                {viewSigning?<><span className="spinner"/> Signing…</>:<>{Icon.pen(14,"#FAF5EE")} Sign this card</>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  /* shared auth props */
  const authProps = { authMode, setAuthMode, authForm, setAuthForm, authError, doSignUp, doSignIn, setShowAuth, authLoading };

  if (loadingCard) return (
    <div className="app"><style>{CSS}</style>
      <div className="loading-screen">
        <div className="spinner" style={{ width:28,height:28,borderWidth:3,borderColor:"rgba(42,21,8,.15)",borderTopColor:"#d4a843" }}/>
        <p className="loading-text">Opening your card…</p>
      </div>
    </div>
  );

  if (view==="view" && viewCard) return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <NavLogo onClick={()=>{ window.location.href="/"; }}/>
        <button className="btn-dark" onClick={()=>setView("themes")}>Create your own {Icon.arrow(14,"#FAF5EE")}</button>
      </nav>
      <CardViewer theme={viewCard.theme} coverItems={viewCard.coverItems||[]} pages={viewCard.pages||[]} recipientName="" onSign={()=>setShowViewSignForm(true)}/>
      {showViewSignForm&&<SignModal/>}
    </div>
  );

  if (view==="home") return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <NavLogo onClick={()=>{}}/>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          {user
            ?<div style={{ display:"flex",alignItems:"center",gap:8 }}><span className="nav-user-name">{user.user_metadata?.full_name||user.email}</span><button className="btn-ghost-sm" onClick={doSignOut}>Sign out</button></div>
            :<button className="btn-ghost-sm" onClick={()=>{ setAuthMode("login"); setShowAuth(true); }}>{Icon.user(13)} Log in</button>
          }
          <button className="btn-dark" onClick={()=>setView("themes")}>Create a card {Icon.arrow(14,"#FAF5EE")}</button>
        </div>
      </nav>
      <div className="home">
        <div className="steam-bg">{[0,1,2,3,4].map(i=><div key={i} className="steam-bubble" style={{ width:90+i*26,height:90+i*26,left:`${10+i*18}%`,bottom:0,animationDelay:`${i*1.3}s`,animationDuration:`${8+i*1}s` }}/>)}</div>
        <div className="hero">
          <div className="hero-eyebrow">a little warmth, sent with care</div>
          <h1 className="hero-title">Cards <em>brewed</em><br/>with kindness</h1>
          <p className="hero-sub">Beautiful multi-page cards for every occasion.<br/>Sign together, add photos &amp; GIFs, share warmly.</p>
          <button className="btn-hero" onClick={()=>setView("themes")}>Brew a card {Icon.arrow(16,"#FAF5EE")}</button>
          <div className="hero-pills">{["Multiple signing pages","Custom cover design","Drag & resize anything","Photos & GIFs","Email, text or print"].map(f=><span key={f} className="pill">{f}</span>)}</div>
        </div>
        <div className="fan-wrap">{THEMES.slice(0,5).map((t,i)=>{ const rots=[-10,-4,0,5,11],ty=[5,2,0,2,5]; return <div key={t.id} className="fan-card" onClick={()=>goEditor(t)} style={{ background:t.cover,transform:`rotate(${rots[i]}deg) translateY(${ty[i]}px)`,zIndex:i===2?5:i }}><div style={{ color:t.accent }}>{Icon[t.icon](26,t.accent)}</div><div className="fan-card-name" style={{ color:t.accent }}>{t.name.split(" ")[0]}</div></div>; })}</div>
      </div>
      {showAuth&&<AuthModal {...authProps}/>}
    </div>
  );

  if (view==="themes") return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <NavLogo onClick={()=>setView("home")}/>
        <button className="btn-ghost" onClick={()=>setView("home")}>{Icon.back(13)} Back</button>
      </nav>
      <div className="themes-view">
        <div className="section-header"><h2 className="section-title">Choose your card</h2><p className="section-sub">Each card opens into multiple pages — plenty of room for everyone to sign.</p></div>
        <div className="themes-grid">{THEMES.map((t,i)=><div key={t.id} className="theme-card" style={{ background:t.cover,animationDelay:`${i*.06}s` }} onClick={()=>goEditor(t)}><div style={{ color:t.accent }}>{Icon[t.icon](34,t.accent)}</div><div className="theme-card-name" style={{ color:t.accent }}>{t.name}</div><div className="theme-card-sub" style={{ color:t.accent }}>Open card</div></div>)}</div>
      </div>
    </div>
  );

  /* EDITOR */
  return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <NavLogo onClick={()=>setView("home")}/>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          {user&&<span className="nav-user-name">{user.user_metadata?.full_name||user.email}</span>}
          <button className="btn-ghost" onClick={()=>setView("themes")}>{Icon.back(13)} Themes</button>
          <button className="btn-send" onClick={handleSendClick} disabled={saving}>
            {saving?<><span className="spinner"/> Saving…</>:<>{Icon.send(14,"#FAF5EE")} Send</>}
          </button>
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
            {activePanel==="text" && (activePage===0 ? (
              <div>
                <div className="info-box">Cover editor — add text, then drag &amp; resize it on the card.</div>
<label className="field-label">Template style</label>
<div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7, marginBottom:16 }}>
  {TEMPLATE_LIST.map(tmpl => (
    <button key={tmpl.id}
      onClick={() => {
        setSelectedTemplate(tmpl.id);
        setCoverItems(TEMPLATES[tmpl.id](theme));
      }}
      style={{
        padding:"8px 4px",
        borderRadius:6,
        border: selectedTemplate===tmpl.id ? `2px solid ${theme.accent}` : "1.5px solid rgba(42,21,8,.12)",
        background: selectedTemplate===tmpl.id ? theme.cover : "white",
        cursor:"pointer",
        fontFamily:"'Jost',sans-serif",
        fontSize:11,
        color: selectedTemplate===tmpl.id ? theme.accent : "#8B6E4E",
        fontWeight: selectedTemplate===tmpl.id ? 600 : 400,
        transition:"all .15s",
      }}>
      {tmpl.label}
    </button>
  ))}
</div>
<p style={{ fontFamily:"'Jost',sans-serif",fontSize:11,color:"rgba(42,21,8,.35)",lineHeight:1.6,marginBottom:12,marginTop:-8 }}>
  Picking a style resets your cover text.
</p>
                <label className="field-label">Add text</label>
                <input className="f-input" placeholder="e.g. Happy Birthday, Sarah!" value={covText} onChange={e=>setCovText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCovText()}/>
                <label className="field-label">Style</label>
                <div className="style-row">
                  <div className="style-col"><span className="sub-label">Font</span><select className="f-select" value={covFont} onChange={e=>setCovFont(e.target.value)}>{FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
                  <div className="style-col"><span className="sub-label">Size</span><select className="f-select" value={covSize} onChange={e=>setCovSize(Number(e.target.value))}>{[12,14,16,18,20,22,24,28,32,36,42].map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div className="style-col" style={{flex:1}}>
  <span className="sub-label">Color</span>
  <ColorPicker value={covColor} onChange={setCovColor}/>
</div>
                </div>
                <div style={{display:"flex",gap:8,marginTop:10}}><button className={`fmt-btn${covBold?" on":""}`} onClick={()=>setCovBold(b=>!b)}><strong>B</strong></button><button className={`fmt-btn${covItalic?" on":""}`} onClick={()=>setCovItalic(it=>!it)}><em>I</em></button></div>
                <button className="btn-dark" style={{width:"100%",marginTop:16,justifyContent:"center"}} onClick={addCovText}>Add to Cover</button>
              </div>
            ) : (
              <div>
                <label className="field-label">Your name</label>
                <input className="f-input" placeholder="How should we sign this?" value={signerName} onChange={e=>setSignerName(e.target.value)}/>
                <label className="field-label">Your message</label>
                <textarea className="f-textarea" rows={3} placeholder="Write something wonderful…" value={msgText} onChange={e=>setMsgText(e.target.value)}/>
                <label className="field-label">Style</label>
                <div className="style-row">
                  <div className="style-col"><span className="sub-label">Font</span><select className="f-select" value={tFont} onChange={e=>setTFont(e.target.value)}>{FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
                  <div className="style-col"><span className="sub-label">Size</span><select className="f-select" value={tSize} onChange={e=>setTSize(Number(e.target.value))}>{[12,13,14,15,16,18,20,22,24].map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div className="style-col" style={{flex:1}}>
  <span className="sub-label">Color</span>
  <ColorPicker value={tColor} onChange={setTColor}/>
</div>
                </div>
                <div style={{display:"flex",gap:8,marginTop:10}}><button className={`fmt-btn${tBold?" on":""}`} onClick={()=>setTBold(b=>!b)}><strong>B</strong></button><button className={`fmt-btn${tItalic?" on":""}`} onClick={()=>setTItalic(it=>!it)}><em>I</em></button></div>
                {msgText&&<div className="msg-preview" style={{fontFamily:tFont,fontSize:tSize,color:tColor,fontWeight:tBold?700:400,fontStyle:tItalic?"italic":"normal",marginTop:12}}>
                  <div>{msgText}</div>
                  {signerName&&<div style={{fontSize:tSize*.72,marginTop:6,opacity:.6,fontStyle:"italic"}}>— {signerName}</div>}
                </div>}
                <button className="btn-dark" style={{width:"100%",marginTop:14,justifyContent:"center"}} onClick={addSig}>Add to Page {activePage}</button>
                <p style={{fontFamily:"'Jost',sans-serif",fontSize:11,color:"rgba(42,21,8,.35)",lineHeight:1.75,marginTop:8}}>Tap to select · drag to move · corner to resize</p>
              </div>
            ))}
            {activePanel==="photos"&&<PhotosPanel onAdd={(url)=>spawnPageItem({type:"photo",url})} uploads={uploads} onUpload={handleUpload} fileRef={fileRef}/>}
            {activePanel==="gifs"&&<GiphyPanel onAdd={(url)=>spawnPageItem({type:"gif",url})}/>}
            {activePanel==="emojis"&&<div><p style={{ fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:300,color:"#8B6E4E",marginBottom:14,lineHeight:1.7 }}>Tap to place — drag to move, corner to resize.</p><div className="emoji-grid">{EMOJIS.map(e=><button key={e} className="emoji-btn" onClick={()=>spawnPageItem({type:"emoji",content:e})}>{e}</button>)}</div></div>}
            {activePanel==="audio"&&(
              <AudioPanel onAdd={(url)=>spawnPageItem({type:"audio",url})}/>
            )}
          </div>
        </div>

        <div className="canvas-area" onClick={desel}>
          <div className="page-tabs-wrap" onClick={e=>e.stopPropagation()}>
            <button className={`page-tab-btn${activePage===0?" active":""}`} onClick={()=>setActivePage(0)}>Cover</button>
            {pages.map((pg,i)=>(
              <button key={pg.id} className={`page-tab-btn${activePage===i+1?" active":""}`} onClick={()=>setActivePage(i+1)}>
                <div className="page-dot" style={{ background:activePage===i+1?theme.accent:"rgba(42,21,8,.2)" }}/>
                Page {pg.num}
                {pg.items.filter(it=>it.type==="text").length>0&&<span style={{ background:theme.accent,color:"white",borderRadius:"100px",fontSize:9,padding:"1px 7px",fontFamily:"'Jost',sans-serif" }}>{pg.items.filter(it=>it.type==="text").length}</span>}
              </button>
            ))}
            <button className="page-tab-btn" onClick={e=>{e.stopPropagation();addPage();}}>{Icon.plus(11)} Page</button>
          </div>

          {activePage===0&&(
            <div className="card-wrap" key="cover" onClick={e=>e.stopPropagation()}>
              <div className="card-cover" style={{ background:theme.cover }}>
                <div style={{ position:"absolute",top:22,right:24,opacity:.15,pointerEvents:"none" }}>{Icon[theme.icon](40,theme.accent)}</div>
                <div ref={coverRef} className="cover-canvas" onClick={desel} style={{ minHeight:390 }}>
                  {coverItems.map(item=>(
                    <DItem key={item.id} item={item} selected={selCover===item.id}
                      onSelect={id=>{setSelCover(id);setSelPage(null);}}
                      onDelete={delCovItem} onMove={moveCovItem} onResize={resCovItem} onTextChange={editCovText}
                      containerRef={coverRef}/>
                  ))}
                  {coverItems.length===0&&<div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none" }}><div style={{ color:theme.accent,marginBottom:18 }}>{Icon[theme.icon](50,theme.accent)}</div><div style={{ fontFamily:"'Playfair Display',serif",fontSize:26,color:theme.accent,fontWeight:400 }}>{theme.name}</div></div>}
                </div>
              </div>
              <div style={{ marginTop:12,padding:"10px 16px",background:"rgba(255,255,255,.68)",borderRadius:8,fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:300,color:"#8B6E4E",lineHeight:1.85,textAlign:"center" }}>
                Use the <strong style={{ fontWeight:500 }}>Sign tab</strong> to add text · drag to reposition · corner to resize
              </div>
            </div>
          )}

          {activePage>0&&curPage&&(
            <div className="card-wrap" key={curPage.id} onClick={e=>e.stopPropagation()}>
              <div className="card-page" style={{"--acc":theme.accent}}>
                <div ref={el=>pageRefs.current[activePage-1]=el} className="page-canvas" onClick={desel}>
                  <div className="page-header">
                    <div style={{ display:"flex",alignItems:"center",gap:10 }}><div style={{ color:theme.accent,opacity:.7 }}>{Icon[theme.icon](15,theme.accent)}</div><span className="page-num-label">Page {curPage.num} of {pages.length}</span></div>
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
                  {curPage.items.length>0&&<div className="drop-hint">Tap to select · drag to move · corner to resize · ✎ edit · × remove</div>}
                </div>
              </div>
              <button className="btn-page-add" onClick={e=>{e.stopPropagation();addPage();}}>{Icon.plus(13)} Add another signing page</button>
            </div>
          )}

          <div className="canvas-footer" onClick={e=>e.stopPropagation()}>
            <span className="canvas-meta">{pages.length} page{pages.length!==1?"s":""} · {coverItems.length} cover · {totalItems} page items</span>
            <button className="btn-send" onClick={handleSendClick} disabled={saving}>
              {saving?<><span className="spinner"/> Saving…</>:<>{Icon.send(14,"#FAF5EE")} Send this Card</>}
            </button>
          </div>
        </div>

        <div className="panel-right">
          <div className="sidebar-title">Pages</div>
          <div className="pages-list">
            <div className={`page-list-item${activePage===0?" active":""}`} onClick={()=>setActivePage(0)}>
              <div style={{ color:theme?.accent,opacity:.65 }}>{theme&&Icon[theme.icon](13,theme.accent)}</div>
              <span className="page-list-name" style={{ fontFamily:"'Playfair Display',serif",fontWeight:400 }}>Cover</span>
              <span className="page-list-count">{coverItems.length} items</span>
            </div>
            {pages.map((pg,i)=>(
              <div key={pg.id} className={`page-list-item${activePage===i+1?" active":""}`} onClick={()=>setActivePage(i+1)}>
                <div className="page-list-dot" style={{ background:pg.items.length>0?theme.accent:"rgba(42,21,8,.16)" }}/>
                <span className="page-list-name">Page {pg.num}</span>
                <span className="page-list-count">{pg.items.length} items</span>
              </div>
            ))}
          </div>
          <button className="btn-ghost-sm" style={{ width:"100%" }} onClick={addPage}>+ Add page</button>
          <div style={{ marginTop:24 }}>
            <div className="sidebar-title">Signatures</div>
            {allSigs.length===0
              ?<p className="empty-note">No signatures yet — be the first!</p>
              :allSigs.map(s=>(
                <div key={s.id} className="signer-row">
                  <div className="signer-dot" style={{ background:s.color }}/>
                  <div className="signer-info">
                    <div className="signer-name" style={{ color:s.color }}>{s.signerName||"—"} <span style={{ fontWeight:400,fontSize:10,color:"rgba(42,21,8,.32)" }}>· p.{s.pageNum}</span></div>
                    <div className="signer-preview">{s.text}</div>
                  </div>
                </div>
              ))
            }
          </div>
          {cardUrl&&(
            <div className="invite-box" style={{ marginTop:20 }}>
              <p className="invite-note" style={{ display:"flex",alignItems:"flex-start",gap:7 }}>{Icon.link(13,"#8B6E4E")}<span><strong style={{ fontWeight:500 }}>Card saved!</strong> Share this link.</span></p>
              <button className="btn-ghost" style={{ width:"100%",marginTop:10,fontSize:12 }} onClick={()=>copyUrl()}>{Icon.copy(12)} {copied?"Copied!":"Copy invite link"}</button>
            </div>
          )}
        </div>
      </div>

      <button className="mobile-signers-btn" onClick={()=>setShowSigDrawer(true)}>
        {Icon.users(14,"#2A1508")} {allSigs.length} signature{allSigs.length!==1?"s":""}
      </button>

      {showSigDrawer&&(
        <>
          <div className="sig-drawer-overlay" onClick={()=>setShowSigDrawer(false)}/>
          <div className="sig-drawer">
            <div className="sig-drawer-handle"/>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
              <div className="sidebar-title" style={{ margin:0 }}>Signatures</div>
              <button className="close-btn" onClick={()=>setShowSigDrawer(false)}>{Icon.x(13)}</button>
            </div>
            {allSigs.length===0?<p className="empty-note">No signatures yet.</p>:allSigs.map(s=>(
              <div key={s.id} className="signer-row"><div className="signer-dot" style={{ background:s.color }}/><div className="signer-info"><div className="signer-name" style={{ color:s.color }}>{s.signerName||"—"} <span style={{ fontWeight:400,fontSize:10,color:"rgba(42,21,8,.32)" }}>· p.{s.pageNum}</span></div><div className="signer-preview">{s.text}</div></div></div>
            ))}
          </div>
        </>
      )}

      {showAuth&&<AuthModal {...authProps}/>}

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
                {cardUrl&&(
                  <div className="card-url-box">
                    <div className="card-url-label">Your card link</div>
                    <div className="card-url-row">
                      <span className="card-url-text">{cardUrl}</span>
                      <button className="btn-ghost-sm" onClick={()=>copyUrl()}>{copied?"✓ Copied":Icon.copy(12)}</button>
                    </div>
                  </div>
                )}
                {(sendTab==="email"||sendTab==="text")&&(
                  <div>
                    <label className="field-label">Recipient's name</label>
                    <input className="f-input" placeholder="Who is this for?" value={form.name} onChange={fSet("name")}/>
                    <label className="field-label">{sendTab==="email"?"Email address":"Phone number"}</label>
                    <input className="f-input" placeholder={sendTab==="email"?"hello@example.com":"+1 (555) 000-0000"} value={form.to} onChange={fSet("to")}/>
                    <label className="field-label">Personal note</label>
                    <textarea className="f-textarea" rows={3} placeholder="Add a private note…" value={form.note} onChange={fSet("note")}/>
                    <button className="btn-send" style={{ width:"100%",marginTop:16,justifyContent:"center" }} onClick={doSend}>{Icon.send(14,"#FAF5EE")} Send with love</button>
                  </div>
                )}
                {sendTab==="schedule"&&(
                  <div>
                    <p style={{ fontFamily:"'Jost',sans-serif",fontWeight:300,color:"#8B6E4E",fontSize:14,lineHeight:1.85,marginBottom:18 }}>Schedule your card to arrive on a special day.</p>
                    <label className="field-label">Recipient's name</label>
                    <input className="f-input" placeholder="Who is this for?" value={form.name} onChange={fSet("name")}/>
                    <label className="field-label">Email or phone</label>
                    <input className="f-input" placeholder="Where should we send it?" value={form.to} onChange={fSet("to")}/>
                    <label className="field-label">Delivery date &amp; time</label>
                    <div className="date-row"><input type="date" className="f-input" value={form.date} onChange={fSet("date")}/><input type="time" className="f-input" value={form.time} onChange={fSet("time")}/></div>
                    <button className="btn-send" style={{ width:"100%",marginTop:16,justifyContent:"center" }} onClick={doSend}>{Icon.calendar(14,"#FAF5EE")} Schedule this Card</button>
                  </div>
                )}
                {sendTab==="pdf"&&<div className="modal-center">{Icon.download(52,"#d4a843")}<h3 className="modal-sec-title">Save as PDF</h3><p className="modal-sec-body">Download all {pages.length+1} pages as a beautifully formatted PDF.</p><button className="btn-send" style={{ padding:"13px 40px" }} onClick={()=>window.print()}>Download PDF</button></div>}
                {sendTab==="print"&&<div className="modal-center">{Icon.printer(52,"#d4a843")}<h3 className="modal-sec-title">Print your card</h3><p className="modal-sec-body">Print all {pages.length+1} pages and hand-deliver with love.</p><button className="btn-send" style={{ padding:"13px 40px" }} onClick={()=>window.print()}>Print Card</button></div>}
              </>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── AudioPanel — defined outside to avoid remount ─────────── */
function AudioPanel({ onAdd }) {
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const audioFileRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type:"audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecorded(url);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setRecording(true);
    } catch(e) { alert("Microphone access denied. Please allow microphone access and try again."); }
  };

  const stopRecording = () => { mediaRef.current?.stop(); setRecording(false); };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onAdd(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p style={{ fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:300,color:"#8B6E4E",lineHeight:1.85,marginBottom:18 }}>
        Add a voice message or music clip to your card.
      </p>

      {/* Upload file */}
      <button className="btn-upload" onClick={()=>audioFileRef.current?.click()}>
        {Icon.upload(15)} Upload an audio clip
      </button>
      <input ref={audioFileRef} type="file" accept="audio/*" style={{ display:"none" }} onChange={handleFileUpload}/>
      <p style={{ fontFamily:"'Jost',sans-serif",fontSize:11,color:"rgba(42,21,8,.28)",textAlign:"center",marginTop:-6,marginBottom:16,letterSpacing:".3px" }}>MP3, WAV, M4A — max 5 MB</p>

      {/* Record voice */}
      {!recording && !recorded && (
        <button className="btn-upload" onClick={startRecording}>
          {Icon.music(15)} Record a voice message
        </button>
      )}
      {recording && (
        <div style={{ textAlign:"center",padding:"16px 0" }}>
          <div style={{ width:12,height:12,borderRadius:"50%",background:"#e53935",display:"inline-block",marginRight:8,animation:"spin .8s linear infinite" }}/>
          <span style={{ fontFamily:"'Jost',sans-serif",fontSize:13,color:"#8B6E4E" }}>Recording…</span>
          <button className="btn-dark" style={{ display:"block",margin:"12px auto 0",background:"#e53935" }} onClick={stopRecording}>Stop recording</button>
        </div>
      )}
      {recorded && !recording && (
        <div style={{ padding:"14px",background:"#FAF5EE",borderRadius:8,border:"1px solid rgba(42,21,8,.1)" }}>
          <p style={{ fontFamily:"'Jost',sans-serif",fontSize:11,color:"#8B6E4E",marginBottom:8 }}>Preview your recording:</p>
          <audio controls src={recorded} style={{ width:"100%",height:32,marginBottom:12 }}/>
          <div style={{ display:"flex",gap:8 }}>
            <button className="btn-dark" style={{ flex:1,justifyContent:"center",fontSize:12 }} onClick={()=>{ onAdd(recorded); setRecorded(null); }}>Add to card</button>
            <button className="btn-ghost-sm" onClick={()=>setRecorded(null)}>Re-record</button>
          </div>
        </div>
      )}
    </div>
  );
}
