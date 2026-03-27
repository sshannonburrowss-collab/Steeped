import React, { useState, useRef, useCallback, useEffect } from "react";
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
  bell:     (s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  lock:     (s=11,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  clock:    (s=13,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  truck:    (s=17,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  pkg:      (s=14,c="currentColor")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
};

const TEMPLATES = {
  default: (theme) => [
    { id:uid(), type:"text", x:40, y:90, text:theme.name, font:"'Playfair Display',serif", size:34, color:theme.accent, bold:false, italic:false },
  ],
  centered: (theme) => [
    { id:uid(), type:"text", x:80, y:150, text:theme.name, font:"'Dancing Script',cursive", size:38, color:theme.accent, bold:false, italic:false },
  ],
  minimal: (theme) => [
    { id:uid(), type:"text", x:32, y:280, text:theme.name.toUpperCase(), font:"'Jost',sans-serif", size:18, color:theme.accent, bold:true, italic:false },
  ],
  bold: (theme) => [
    { id:uid(), type:"text", x:30, y:60, text:theme.name, font:"'Playfair Display',serif", size:42, color:theme.accent, bold:true, italic:false },
  ],
  script: (theme) => [
    { id:uid(), type:"text", x:50, y:110, text:"With love,", font:"'Dancing Script',cursive", size:20, color:theme.accent, bold:false, italic:false },
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

const WARM_NUDGE_MESSAGES = [
  "Hey! We're putting together something special — still time to add your words 💌",
  "The card is almost ready — would love your message before we send it 🌸",
  "Just a gentle reminder — your note would mean the world to them ✨",
  "We're collecting kind words for someone special. Would you like to add yours? 🌷",
  "The card is coming together beautifully — add your warmth before the deadline 🍀",
];

// Guided prompts keyed by theme id. {name} is replaced with the recipient name.
const PROMPTS = {
  birthday: [
    "Share a favourite memory with {name}",
    "What makes {name} laugh?",
    "One word that describes {name}:",
    "Your birthday wish for {name}:",
    "Something you love about {name}:",
    "A piece of advice for the year ahead:",
    "The funniest thing {name} has ever done:",
    "What you'd miss most about {name}:",
  ],
  holiday: [
    "Your warmest wish for {name} this season:",
    "A holiday memory you share with {name}:",
    "Something you're grateful for about {name}:",
    "One hope you have for {name} in the new year:",
    "What {name} brings to every gathering:",
    "A tradition you love sharing with {name}:",
  ],
  thinking: [
    "Something you want {name} to know:",
    "A memory that makes you think of {name}:",
    "One thing that always reminds you of {name}:",
    "What you admire most about {name}:",
    "A moment you'll always remember with {name}:",
    "Words you've always wanted to say to {name}:",
  ],
  justbecause: [
    "Something that made you think of {name} today:",
    "A reason you're glad {name} is in your life:",
    "One thing {name} does that brightens your day:",
    "Your favourite thing about {name}:",
    "Something you appreciate about {name}:",
    "A small moment you love sharing with {name}:",
  ],
  hugs: [
    "Something you wish you could do for {name} right now:",
    "A time {name} was there for you:",
    "What you'd say if you were there in person:",
    "One thing that always cheers {name} up:",
    "A reminder you want {name} to hold onto:",
    "Something you love about {name}'s strength:",
  ],
  congrats: [
    "What this achievement says about {name}:",
    "A moment you knew {name} would get here:",
    "One thing that makes this so well-deserved:",
    "Your proudest memory of watching {name} grow:",
    "What you're most excited to see {name} do next:",
    "How {name} has inspired you:",
  ],
  thankyou: [
    "What {name}'s kindness meant to you:",
    "How {name} made a difference:",
    "A specific moment you'll never forget:",
    "What you'd like to do for {name} someday:",
    "Something {name} taught you:",
    "Why {name}'s support mattered so much:",
  ],
  blank: [
    "Something you'd like {name} to know:",
    "A memory you treasure with {name}:",
    "One word that describes {name}:",
    "What makes {name} special to you:",
    "Something you're grateful for about {name}:",
    "A wish you have for {name}:",
  ],
};
// Fallback if theme not matched
const DEFAULT_PROMPTS = PROMPTS.blank;

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
@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(212,168,67,.18)}50%{box-shadow:0 0 0 5px rgba(212,168,67,.0)}}
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
.btn-nudge{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:100px;border:1px solid rgba(212,168,67,.35);background:rgba(212,168,67,.08);color:#8B6E4E;font-family:'Jost',sans-serif;font-size:10.5px;cursor:pointer;transition:all .15s;white-space:nowrap;}
.btn-nudge:hover{background:rgba(212,168,67,.2);border-color:rgba(212,168,67,.6);color:#5a3a10;}
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
.editor-layout{display:grid;grid-template-columns:272px 1fr 236px;height:calc(100vh - 68px);overflow:hidden;}
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
/* ── Physical card & envelope ──────────────────────────── */
/* ══════════════════════════════════════════════════════════
   Card + Envelope — istock style
   Full colored envelope body, card rises from open mouth
   Z layers:  env-body(1) → card(2) → env-front-mask(3)
   ══════════════════════════════════════════════════════════ */
@keyframes riseFromEnv{
  0%   {transform:translateY(68%); opacity:0;}
  5%   {opacity:1;}
  60%  {transform:translateY(4%);}
  78%  {transform:translateY(-1.5%);}
  100% {transform:translateY(0%);}
}
/* Scene wrapper — controls overall width & shadow */
.card-scene{
  width:clamp(300px,56vw,500px);
  position:relative;
  padding-bottom:160px; /* space for envelope body below card */
  filter:
    drop-shadow(0 32px 56px rgba(42,21,8,.32))
    drop-shadow(0 6px 18px rgba(42,21,8,.18));
}
/* The card — pure vertical rise, no rotate, no clip-path */
.card-wrap{
  position:relative;
  z-index:2;
  animation:riseFromEnv 1.4s cubic-bezier(.22,1,.36,1) both;
  margin:0 6%;  /* narrower than envelope so sides show */
}
/* ── Full envelope body (behind card) ── */
.env-body{
  position:absolute;
  bottom:0; left:0; right:0;
  height:160px;
  border-radius:4px;
  z-index:1;
  overflow:hidden;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.2);
}
/* Back interior — tinted liner triangle pointing down from top */
.env-body-liner{
  position:absolute;
  top:0; left:0; right:0;
  height:60%;
  clip-path:polygon(0 0,100% 0,50% 100%);
  background:rgba(255,255,255,.22);
}
/* Left fold triangle */
.env-body-fl{
  position:absolute;
  inset:0;
  clip-path:polygon(0 0,50% 52%,0 100%);
  background:rgba(0,0,0,.05);
}
/* Right fold triangle */
.env-body-fr{
  position:absolute;
  inset:0;
  clip-path:polygon(100% 0,50% 52%,100% 100%);
  background:rgba(0,0,0,.04);
}
/* Bottom fold triangle */
.env-body-fb{
  position:absolute;
  inset:0;
  clip-path:polygon(0 100%,50% 48%,100% 100%);
  background:rgba(0,0,0,.04);
}
/* ── Envelope front mask (on top of card) ──
   Covers the card bottom so it looks truly inside.
   Same color as the envelope body.               ── */
.env-front-mask{
  position:absolute;
  bottom:0; left:0; right:0;
  height:160px;
  z-index:3;
  pointer-events:none;
  overflow:hidden;
}
/* Front face: side triangles + bottom — leave a gap at top (mouth) */
.env-front-face{
  position:absolute;
  inset:0;
  /* Solid shape = entire rect MINUS the open mouth at top center
     Mouth width ~70% of envelope, centered.
     The card pokes through this gap. */
  clip-path:polygon(
    0 0,          /* top-left */
    0 100%,       /* bottom-left */
    100% 100%,    /* bottom-right */
    100% 0,       /* top-right */
    65% 0,        /* mouth right edge */
    50% 38%,      /* mouth bottom point (V) */
    35% 0         /* mouth left edge */
  );
}
/* Subtle crease lines on front */
.env-front-fl{
  position:absolute; inset:0;
  clip-path:polygon(0 0,50% 52%,0 52%);
  background:rgba(0,0,0,.03);
}
.env-front-fr{
  position:absolute; inset:0;
  clip-path:polygon(100% 0,50% 52%,100% 52%);
  background:rgba(0,0,0,.025);
}
/* ── Open flap — behind card, visible above mouth ── */
.env-flap{
  position:absolute;
  /* sits at bottom of where card emerges */
  bottom:160px;
  left:6%; right:6%; /* same width as card-wrap */
  z-index:1;
  pointer-events:none;
  overflow:hidden;
  height:52px;
}
.env-flap-inner{
  position:absolute;
  bottom:0; left:0; right:0;
  height:100%;
  /* Downward pointing triangle = open flap folded back */
  clip-path:polygon(0 0,100% 0,50% 100%);
  opacity:.75;
}
/* Card face styles */
.card-cover{width:100%;min-height:clamp(260px,36vw,400px);border-radius:5px;overflow:hidden;position:relative;background:white;border:1px solid rgba(42,21,8,.07);}
.card-cover-face{position:absolute;inset:0;border-radius:5px;overflow:hidden;}
.card-page{width:100%;min-height:clamp(320px,42vw,460px);border-radius:5px;background:white;position:relative;overflow:visible;border:1px solid rgba(42,21,8,.07);}
/* Paper texture on both */
.card-cover::after,.card-page::after{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");pointer-events:none;border-radius:5px;z-index:100;}
.canvas-footer{display:flex;align-items:center;justify-content:space-between;width:clamp(300px,58vw,520px);margin-top:22px;}
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
.panel-right{border-left:1px solid rgba(42,21,8,.08);background:white;padding:20px;overflow-y:auto;}
.sidebar-title{font-family:'Jost',sans-serif;font-size:10px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:rgba(42,21,8,.38);margin-bottom:10px;}
.signer-row{display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:6px;background:#FAF5EE;margin-bottom:6px;}
.signer-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.signer-info{flex:1;min-width:0;}
.signer-name{font-family:'Jost',sans-serif;font-size:12px;font-weight:500;}
.signer-preview{font-size:11.5px;color:#8B6E4E;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:'Lora',serif;}
.invite-box{margin-top:16px;padding:14px;background:linear-gradient(135deg,#FFF9F2,#FAF5EE);border-radius:8px;border:1px solid rgba(212,168,67,.18);}
.invite-note{font-family:'Jost',sans-serif;font-size:12px;font-weight:300;color:#8B6E4E;line-height:1.8;}
.pages-list{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;}
.page-list-item{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:6px;background:#FAF5EE;cursor:pointer;border:1.5px solid transparent;transition:all .15s;}
.page-list-item.active{border-color:rgba(42,21,8,.18);background:white;}
.page-list-item:hover:not(.active){background:#F5EFE5;}
.page-list-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.page-list-name{font-family:'Jost',sans-serif;font-size:12px;letter-spacing:.2px;flex:1;}
.page-list-count{font-family:'Jost',sans-serif;font-size:10px;color:rgba(42,21,8,.32);}
.empty-note{font-family:'Jost',sans-serif;font-size:12px;font-weight:300;color:rgba(42,21,8,.38);line-height:1.85;font-style:italic;}
/* Dashboard styles */
.dashboard-section{padding:14px;background:linear-gradient(135deg,#FFF9F2,#FAF5EE);border-radius:8px;border:1px solid rgba(212,168,67,.2);margin-bottom:14px;}
.countdown-display{text-align:center;padding:10px 8px;background:white;border-radius:6px;border:1px solid rgba(212,168,67,.25);margin-bottom:12px;animation:pulseGlow 3s ease-in-out infinite;}
.countdown-number{font-family:'Playfair Display',serif;font-size:22px;color:#d4a843;font-weight:400;line-height:1;}
.countdown-label{font-family:'Jost',sans-serif;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(42,21,8,.4);margin-top:3px;}
.countdown-urgency{font-family:'Jost',sans-serif;font-size:10.5px;color:#8B6E4E;margin-top:6px;font-weight:300;}
.invitee-row{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;background:white;margin-bottom:5px;border:1px solid rgba(42,21,8,.06);}
.invitee-status-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.invitee-name{font-family:'Jost',sans-serif;font-size:11.5px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.invitee-badge{font-family:'Jost',sans-serif;font-size:9px;letter-spacing:.8px;text-transform:uppercase;padding:2px 7px;border-radius:100px;font-weight:500;}
.add-invitee-row{display:flex;gap:5px;margin-top:8px;}
.add-invitee-row .f-input{font-size:12px;padding:7px 10px;}
.anon-toggle{display:flex;align-items:center;gap:9px;padding:10px 12px;background:#FAF5EE;border-radius:6px;border:1px solid rgba(42,21,8,.09);cursor:pointer;margin-top:12px;transition:all .15s;}
.anon-toggle:hover{background:#F5EFE5;}
.anon-toggle input{accent-color:#d4a843;width:15px;height:15px;cursor:pointer;}
.anon-toggle-label{font-family:'Jost',sans-serif;font-size:12px;font-weight:300;color:#5a3a10;line-height:1.5;flex:1;}
.anon-badge{display:inline-flex;align-items:center;gap:4px;font-family:'Jost',sans-serif;font-size:10px;font-weight:500;color:#8b3a7a;background:rgba(139,58,122,.08);border:1px solid rgba(139,58,122,.2);padding:2px 8px;border-radius:100px;letter-spacing:.4px;}
.sidebar-divider{height:1px;background:rgba(42,21,8,.07);margin:14px 0;}
/* Modal styles */
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
.viewer-cover-card{border-radius:5px;overflow:hidden;box-shadow:none;}
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
.mobile-dashboard-btn{display:none;}
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
  .card-cover{min-height:220px;border-radius:5px;}
  .cover-canvas{min-height:220px;padding:14px;}
  .card-page{min-height:320px;border-radius:5px;}
  .page-canvas{min-height:320px;padding:16px 16px 22px;}
  .canvas-footer{width:100%;flex-direction:column;gap:10px;align-items:stretch;margin-top:16px;}
  .canvas-footer .btn-send{width:100%;justify-content:center;}
  .canvas-meta{text-align:center;}
  .panel-left{order:2;border-right:none;border-top:2px solid rgba(42,21,8,.08);max-height:360px;flex-shrink:0;}
  .panel-tabs{padding:6px;}
  .panel-tab{padding:8px 3px;}
  .panel-tab .tab-label{font-size:8px;}
  .panel-content{padding:14px;}
  .style-row{gap:6px;}
  .f-select{font-size:11px;padding:7px 6px;}
  /* Larger touch targets for toggles */
  .anon-toggle{padding:13px 14px;min-height:52px;}
  .anon-toggle input{width:18px;height:18px;}
  .fmt-btn{padding:10px 18px;min-height:42px;}
  /* Add invitee row stacks on mobile */
  .add-invitee-row{flex-direction:column;gap:6px;}
  .add-invitee-row .f-input{font-size:14px;padding:10px 12px;}
  .add-invitee-row .btn-dark{width:100%;justify-content:center;padding:10px;}
  /* Countdown bigger on mobile */
  .countdown-number{font-size:28px;}
  .countdown-urgency{font-size:12px;}
  /* Modals */
  .modal-overlay,.auth-overlay{align-items:flex-end;padding:0;}
  .modal,.sign-modal{border-radius:20px 20px 0 0;max-height:88vh;animation:slideUp .3s ease;}
  .auth-modal{border-radius:20px 20px 0 0;max-height:92vh;overflow-y:auto;}
  .modal-header,.sign-modal-header{padding:18px 20px 14px;}
  .modal-title{font-size:18px;}
  .modal-body,.sign-modal-body{padding:18px 20px;}
  .date-row{grid-template-columns:1fr;}
  /* Viewer */
  .viewer-title{font-size:1.5rem;}
  .viewer-btn{padding:8px 16px;font-size:12px;}
  .viewer-msg-slide{padding:24px 18px;}
  .viewer-board-body{padding:14px 12px;}
  .viewer-sig-card{padding:16px;}
  /* Hero / themes */
  .hero{padding:48px 20px 32px;}
  .fan-wrap{gap:0;}
  .fan-card{width:90px;height:72px;margin:0 -14px;}
  .themes-view{padding:28px 16px;}
  .themes-grid{grid-template-columns:repeat(2,1fr);gap:10px;}
  .theme-card{padding:24px 12px 20px;}
  /* Floating action buttons — stacked column, right edge */
  .mobile-fab-group{display:flex;flex-direction:column;gap:8px;position:fixed;bottom:372px;right:14px;z-index:50;}
  .mobile-signers-btn{display:flex;align-items:center;gap:6px;background:white;border:1px solid rgba(42,21,8,.15);border-radius:100px;padding:9px 14px;font-family:'Jost',sans-serif;font-size:11px;font-weight:500;color:#2A1508;cursor:pointer;box-shadow:0 4px 18px rgba(42,21,8,.15);white-space:nowrap;}
  .mobile-dashboard-btn{display:flex;align-items:center;gap:6px;background:linear-gradient(135deg,#FFF9F2,#fff);border:1px solid rgba(212,168,67,.35);border-radius:100px;padding:9px 14px;font-family:'Jost',sans-serif;font-size:11px;font-weight:500;color:#8B6E4E;cursor:pointer;box-shadow:0 4px 18px rgba(42,21,8,.12);white-space:nowrap;}
  /* Drawers */
  .sig-drawer-overlay{position:fixed;inset:0;background:rgba(42,21,8,.38);z-index:150;backdrop-filter:blur(6px);}
  .sig-drawer{position:fixed;bottom:0;left:0;right:0;background:white;border-radius:20px 20px 0 0;z-index:160;padding:20px;max-height:75vh;overflow-y:auto;animation:slideUp .3s ease;}
  .sig-drawer-handle{width:36px;height:4px;background:rgba(42,21,8,.15);border-radius:2px;margin:0 auto 18px;}
  /* Dashboard drawer specific */
  .dashboard-drawer .dashboard-section{border-radius:0;border:none;background:transparent;padding:0;margin:0;}
  .dashboard-drawer .f-input{font-size:14px;padding:10px 12px;}

/* ── My Cards Dashboard ─────────────────────────────────── */
.mc-page{min-height:calc(100vh - 68px);background:#FAF5EE;width:100%;text-align:left;}
.mc-wrap{max-width:960px;width:100%;margin:0 auto;padding:48px 48px 72px;box-sizing:border-box;}
.mc-topbar{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:40px;}
.mc-greeting{flex:1;min-width:0;}
.mc-eyebrow{font-family:'Jost',sans-serif;font-weight:300;font-size:11px;color:#d4a843;letter-spacing:4px;text-transform:uppercase;margin-bottom:10px;}
.mc-title{font-family:'Playfair Display',serif;font-size:34px;font-weight:400;color:#2A1508;margin:0 0 8px;line-height:1.15;}
.mc-sub{font-family:'Jost',sans-serif;font-size:14px;font-weight:300;color:#8B6E4E;line-height:1.7;margin:0;}
.mc-banner{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px 20px;background:linear-gradient(135deg,#FFF9F2,#FAF5EE);border:1px solid rgba(212,168,67,.28);border-radius:8px;margin-bottom:32px;flex-wrap:nowrap;}
.mc-banner-text{}
.mc-banner-title{font-family:'Jost',sans-serif;font-size:13px;font-weight:500;color:#5a3a10;margin-bottom:3px;}
.mc-banner-sub{font-family:'Jost',sans-serif;font-size:12px;font-weight:300;color:#8B6E4E;line-height:1.5;}
.mc-count{font-family:'Jost',sans-serif;font-size:10px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:rgba(42,21,8,.35);margin-bottom:20px;}
.mc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.mc-card{background:white;border-radius:0;overflow:visible;box-shadow:none;border:none;transition:transform .22s,filter .22s;animation:fadeUp .4s ease both;position:relative;}
.mc-card:hover{transform:translateY(-5px) rotate(-1deg);}
/* Envelope behind each dashboard card */
.mc-card::before{content:'';position:absolute;bottom:-12px;left:50%;transform:translateX(-50%);width:96%;height:55%;border-radius:2px 2px 6px 6px;z-index:-1;background:var(--mc-env,#d4a843);opacity:.8;transition:opacity .2s;}
.mc-card:hover::before{opacity:1;}
/* White card face */
.mc-cover{height:148px;position:relative;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px;border-radius:4px 4px 0 0;box-shadow:0 2px 8px rgba(42,21,8,.1);}
/* Inset border on cover */
.mc-cover::before{content:'';position:absolute;inset:8px;border:1px solid rgba(255,255,255,.3);border-radius:3px;pointer-events:none;z-index:5;}
.mc-cover-icon{opacity:.72;position:relative;z-index:2;}
.mc-cover-text{font-family:'Playfair Display',serif;font-size:13px;font-weight:400;text-align:center;line-height:1.4;max-width:85%;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;position:relative;z-index:2;text-shadow:0 1px 3px rgba(0,0,0,.08);}
.mc-cover-watermark{opacity:.12;position:absolute;bottom:8px;right:10px;pointer-events:none;z-index:1;}
.mc-cover-cta{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(42,21,8,.32);opacity:0;transition:opacity .18s;border-radius:4px 4px 0 0;z-index:10;}
.mc-cover:hover .mc-cover-cta{opacity:1;}
.mc-cover-cta-label{font-family:'Jost',sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:white;font-weight:500;}
.mc-body{padding:14px 16px 14px;text-align:left;background:white;border-radius:0 0 4px 4px;border-top:1px solid rgba(42,21,8,.05);box-shadow:0 4px 8px rgba(42,21,8,.08);}
.mc-name{font-family:'Playfair Display',serif;font-size:15px;font-weight:400;color:#2A1508;margin-bottom:6px;}
.mc-chips{display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap;}
.mc-chip{font-family:'Jost',sans-serif;font-size:11px;font-weight:300;color:#8B6E4E;display:inline-flex;align-items:center;gap:3px;}
.mc-rule{height:1px;background:rgba(42,21,8,.06);margin-bottom:11px;}
.mc-actions{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:5px;margin-bottom:8px;}
.mc-btn{padding:7px 4px;border-radius:5px;border:1px solid rgba(42,21,8,.11);background:white;font-family:'Jost',sans-serif;font-size:11px;color:#8B6E4E;cursor:pointer;transition:all .14s;display:flex;align-items:center;justify-content:center;gap:4px;}
.mc-btn:hover{background:#FAF5EE;color:#2A1508;border-color:rgba(42,21,8,.2);}
.mc-btn-send{padding:7px 4px;border-radius:5px;border:none;background:#2A1508;font-family:'Jost',sans-serif;font-size:11px;color:#FAF5EE;cursor:pointer;transition:background .14s;display:flex;align-items:center;justify-content:center;gap:4px;}
.mc-btn-send:hover{background:#3d2010;}
.mc-del{width:100%;background:none;border:none;cursor:pointer;font-family:'Jost',sans-serif;font-size:10px;color:rgba(42,21,8,.2);padding:3px;letter-spacing:.3px;transition:color .14s;text-align:center;}
.mc-del:hover{color:#b84848;}
.my-cards-empty{text-align:center;padding:72px 20px;animation:fadeUp .5s ease;}
.my-cards-empty-icon{margin-bottom:22px;opacity:.22;}
.my-cards-empty-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:400;color:#2A1508;margin-bottom:10px;}
.my-cards-empty-sub{font-family:'Jost',sans-serif;font-size:14px;font-weight:300;color:#8B6E4E;line-height:1.85;margin-bottom:28px;}
.my-cards-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;gap:14px;}
.delete-confirm-overlay{position:fixed;inset:0;background:rgba(42,21,8,.45);backdrop-filter:blur(8px);z-index:400;display:flex;align-items:center;justify-content:center;padding:20px;}
.delete-confirm-box{background:white;border-radius:12px;padding:28px 30px;max-width:380px;width:100%;box-shadow:0 24px 70px rgba(42,21,8,.22);animation:cardIn .2s ease;text-align:center;}
@media(max-width:900px){.mc-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:680px){
  .mc-wrap{padding:20px 16px 48px;}
  .mc-topbar{flex-wrap:wrap;gap:12px;margin-bottom:28px;}
  .mc-title{font-size:26px;}
  .mc-banner{flex-wrap:wrap;gap:10px;}
  .mc-grid{grid-template-columns:repeat(2,1fr);gap:12px;}
  .mc-cover{height:108px;}
  .mc-name{font-size:13px;}
  .mc-btn,.mc-btn-send{font-size:10px;padding:6px 2px;}
}
@media(max-width:400px){.mc-grid{grid-template-columns:1fr;}}

/* Ship tab */
.ship-size-btn{flex:1;min-width:72px;padding:9px 6px;border-radius:6px;border:1.5px solid rgba(42,21,8,.12);background:white;cursor:pointer;font-family:'Jost',sans-serif;font-size:11px;color:#8B6E4E;transition:all .15s;text-align:center;line-height:1.5;}
.ship-size-btn.active{border-color:#d4a843;background:rgba(212,168,67,.08);color:#5a3a10;}
.ship-price-bar{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap;}
.ship-total-row{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#FFF9F2;border-radius:6px;border:1px solid rgba(212,168,67,.2);margin-bottom:18px;}
.ship-total-label{font-family:'Jost',sans-serif;font-size:12px;font-weight:300;color:#8B6E4E;}
.ship-total-price{font-family:'Playfair Display',serif;font-size:20px;color:#2A1508;}
.ship-addr-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px;}
.ship-error{padding:9px 12px;background:#fff0ed;border-radius:5px;font-family:'Jost',sans-serif;font-size:12px;color:#b84848;margin-bottom:12px;border:1px solid rgba(184,74,48,.15);}
.ship-success{text-align:center;padding:20px 0;}
.ship-success-title{font-family:'Playfair Display',serif;font-size:19px;margin:14px 0 8px;}
.ship-success-sub{font-family:'Jost',sans-serif;font-size:12px;color:#8B6E4E;font-weight:300;line-height:1.75;}
.prodigi-badge{display:flex;align-items:center;justify-content:center;gap:5px;font-family:'Jost',sans-serif;font-size:9.5px;color:rgba(42,21,8,.32);letter-spacing:.5px;margin-top:12px;}
/* Guided prompts */
.prompt-section{margin-bottom:16px;padding:12px 14px;background:#FAF5EE;border-radius:7px;border:1px solid rgba(212,168,67,.16);}
.prompt-label{font-family:'Jost',sans-serif;font-size:9px;font-weight:500;letter-spacing:1.8px;text-transform:uppercase;color:rgba(42,21,8,.35);margin-bottom:9px;display:flex;align-items:center;justify-content:space-between;}
.prompt-shuffle{background:none;border:none;cursor:pointer;font-family:'Jost',sans-serif;font-size:10px;font-weight:400;color:#d4a843;letter-spacing:.3px;padding:2px 0;display:inline-flex;align-items:center;gap:4px;transition:color .15s;}
.prompt-shuffle:hover{color:#b8862e;}
.prompt-chips{display:flex;flex-direction:column;gap:5px;}
.prompt-chip{padding:7px 11px;border-radius:5px;border:none;background:white;font-family:'Lora',serif;font-size:12px;font-weight:400;color:#5a3a10;cursor:pointer;transition:all .14s;line-height:1.5;text-align:left;box-shadow:0 1px 3px rgba(42,21,8,.06);width:100%;}
.prompt-chip:hover{background:rgba(212,168,67,.1);color:#2A1508;box-shadow:0 2px 8px rgba(42,21,8,.1);}
.prompt-chip.used{background:rgba(212,168,67,.08);color:#8B6E4E;}
@media(max-width:680px){.ship-addr-grid{grid-template-columns:1fr;}.ship-size-btn{font-size:10px;padding:7px 3px;}}
}
`;

const uid = () => Date.now() + Math.random();
const makePage = (num) => ({ id: uid(), num, items: [] });

/* ─── Countdown Hook ─────────────────────────────────────────── */
function useCountdown(deadline) {
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (!deadline) { setTimeLeft(null); return; }
    const calc = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ expired: true }); return; }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      setTimeLeft({ days, hours, mins, expired: false });
    };
    calc();
    const id = setInterval(calc, 30000);
    return () => clearInterval(id);
  }, [deadline]);
  return timeLeft;
}

/* ─── useLocalSave hook ─────────────────────────────────────── */
function useLocalSave(key, theme, pages, coverItems, cardId) {
  const timerRef = useRef(null);
  useEffect(() => {
    if (!theme) return; // nothing to save yet
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        const id = cardId || `draft_${theme.id}`;
        const entry = { id, theme, pages, coverItems, updatedAt: new Date().toISOString() };
        const idx = existing.findIndex(c => c.id === id);
        if (idx >= 0) existing[idx] = entry;
        else existing.unshift(entry);
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
      } catch(e) {}
    }, 1200); // debounce 1.2s
    return () => clearTimeout(timerRef.current);
  }, [theme, pages, coverItems, cardId]);
}

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
            <div className="d-signer-name" style={{ fontFamily:item.font,fontSize:Math.max(10,item.size*0.72),color:item.color }}>
              {item.anonymous ? <span className="anon-badge">{Icon.lock(9,"#8b3a7a")} secret admirer</span> : `— ${item.signerName}`}
            </div>
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
              <div className="viewer-sig-name">
                {s.anonymous
                  ? <span style={{ display:"inline-flex",alignItems:"center",gap:5,fontStyle:"italic",opacity:.7 }}>{Icon.lock(10,"rgba(212,168,67,.6)")} A secret admirer ✨</span>
                  : s.signerName && `— ${s.signerName}`}
              </div>
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
            <div style={{ position:"relative",filter:"drop-shadow(0 32px 56px rgba(0,0,0,.55)) drop-shadow(0 8px 18px rgba(0,0,0,.28))" }}>
              {/* Envelope behind */}
              <div style={{ position:"absolute",bottom:-16,left:"50%",transform:"translateX(-50%) rotate(1deg)",width:"100%",height:"55%",borderRadius:"3px 3px 8px 8px",background:theme.accent,opacity:.75,zIndex:0 }}/>
              <div className="viewer-cover-card" style={{ position:"relative",zIndex:1,transform:"rotate(-1deg)" }}>
              <div style={{ background:theme.cover,minHeight:320,borderRadius:5,position:"relative",padding:24,pointerEvents:"none",border:"1px solid rgba(255,255,255,.15)" }}>
                {/* Inset border */}
                <div style={{ position:"absolute",inset:12,border:"1px solid rgba(255,255,255,.25)",borderRadius:3,pointerEvents:"none" }}/>
                <div style={{ position:"absolute",top:20,right:22,opacity:.12 }}>{Icon[theme.icon](44,theme.accent)}</div>
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
            </div>
          )}
          {!isFirstSlide&&currentMsg&&(
            <div className="viewer-msg-slide">
              <p className="viewer-msg-text" style={{ fontFamily:currentMsg.font,color:currentMsg.color||"#FAF5EE",fontWeight:currentMsg.bold?700:400,fontStyle:currentMsg.italic?"italic":"normal" }}>{currentMsg.text}</p>
              <p className="viewer-msg-author">
                {currentMsg.anonymous
                  ? <span style={{ display:"inline-flex",alignItems:"center",gap:6,fontStyle:"italic",fontWeight:400,opacity:.7 }}>{Icon.lock(12,"#d4a843")} A secret admirer ✨</span>
                  : currentMsg.signerName && `— ${currentMsg.signerName}`}
              </p>
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

/* ─── AuthModal ──────────────────────────────────────────────── */
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

/* ─── CardEnvelope ──────────────────────────────────────────── */
// Full colored envelope — matches istock reference photo.
// Card (z:2) rises from between env-body (z:1) and env-front-mask (z:3).
function CardEnvelope({ accent }) {
  // Derive a slightly darker shade for depth
  const hex = accent.replace("#","");
  const r = parseInt(hex.slice(0,2),16);
  const g = parseInt(hex.slice(2,4),16);
  const b = parseInt(hex.slice(4,6),16);
  const darken = (v, amt) => Math.max(0, Math.min(255, v - amt));
  const bodyColor = accent;
  const darkColor = `rgb(${darken(r,20)},${darken(g,20)},${darken(b,20)})`;
  const lightColor = `rgba(${Math.min(255,r+40)},${Math.min(255,g+40)},${Math.min(255,b+40)},0.9)`;
  return (
    <>
      {/* ── BODY — full colored envelope background ── */}
      <div className="env-body" style={{ background:bodyColor }}>
        <div className="env-body-liner"/>
        <div className="env-body-fl"/>
        <div className="env-body-fr"/>
        <div className="env-body-fb"/>
      </div>

      {/* ── FLAP — open flap folded back, behind the card ── */}
      <div className="env-flap">
        <div className="env-flap-inner" style={{ background:lightColor }}/>
      </div>

      {/* ── FRONT MASK — same color as body, sits over card bottom ── */}
      <div className="env-front-mask">
        <div className="env-front-face" style={{ background:bodyColor }}/>
        <div className="env-front-fl"/>
        <div className="env-front-fr"/>
      </div>
    </>
  );
}

/* ─── PromptPicker ───────────────────────────────────────────── */
function PromptPicker({ themeId, recipientName, onSelect, usedPrompts }) {
  const bank = PROMPTS[themeId] || DEFAULT_PROMPTS;
  const name = recipientName?.trim() || "them";
  const fill = (p) => p.replace(/\{name\}/g, name);

  // Show 3 random prompts at a time, reshuffled on demand
  const [offset, setOffset] = useState(0);
  const shuffle = () => setOffset(o => (o + 3) % bank.length);
  const visible = [];
  for (let i = 0; i < 3; i++) visible.push(bank[(offset + i) % bank.length]);

  return (
    <div className="prompt-section">
      <div className="prompt-label">
        <span>Need inspiration?</span>
        <button className="prompt-shuffle" onClick={shuffle} type="button">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
          Shuffle
        </button>
      </div>
      <div className="prompt-chips">
        {visible.map((p, i) => (
          <button
            key={offset + i}
            className={"prompt-chip" + (usedPrompts?.includes(fill(p)) ? " used" : "")}
            onClick={() => onSelect(fill(p))}
            type="button"
          >
            {fill(p)}
          </button>
        ))}
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
  const [showDashDrawer, setShowDashDrawer] = useState(false);
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

  // ── My Cards dashboard ───────────────────────────────────────
  const [myCards, setMyCards] = useState([]);
  const [myCardsLoading, setMyCardsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // cardId to confirm delete
  const [cardCopied, setCardCopied] = useState(null);

  // ── Print & Ship via Prodigi ─────────────────────────────────
  // SKUs from Prodigi classic greetings card range (330gsm Fedrigoni gloss, UV varnish)
  // Prices are approximate base costs — actual charged at fulfillment
  const PRODIGI_SIZES = [
    { sku:"GLOBAL-GRE-A6",  label:"A6",   dim:'4.1 × 5.8"', note:"Classic",  cardPrice:2.99, popular:false },
    { sku:"GLOBAL-GRE-A5",  label:"A5",   dim:'5.8 × 8.3"', note:"Standard", cardPrice:3.99, popular:true  },
    { sku:"GLOBAL-GRE-SQ",  label:"SQ",   dim:'5.5 × 5.5"', note:"Square",   cardPrice:3.49, popular:false },
    { sku:"GLOBAL-GRE-A4",  label:"A4",   dim:'8.3 × 11.7"',note:"Large",    cardPrice:5.49, popular:false },
  ];
  // Shipping estimates by country (economy, includes envelope & packaging)
  const SHIP_RATES = { US:4.99, GB:4.49, CA:6.99, AU:7.99, default:8.99 };
  const [shipSize, setShipSize] = useState("GLOBAL-GRE-A5");
  const [shipAddr, setShipAddr] = useState({ name:"", email:"", line1:"", line2:"", city:"", state:"", zip:"", country:"US" });
  const [shipping, setShipping] = useState(false);
  const [shipResult, setShipResult] = useState(null);
  const [captureError, setCaptureError] = useState(null);
  const sAddr = (k) => (e) => setShipAddr(p=>({...p,[k]:e.target.value}));
  const selectedSize = PRODIGI_SIZES.find(s=>s.sku===shipSize) || PRODIGI_SIZES[1];
  const shipCost = SHIP_RATES[shipAddr.country] || SHIP_RATES.default;
  const shipTotal = (selectedSize.cardPrice + shipCost).toFixed(2);

  // ── NEW: Dashboard, Anonymous mode, Deadline ─────────────────
  const [invitees, setInvitees] = useState([]);
  const [newInviteeName, setNewInviteeName] = useState("");
  const [newInviteeEmail, setNewInviteeEmail] = useState("");
  const [deadline, setDeadline] = useState("");
  const [editorSignAnonymous, setEditorSignAnonymous] = useState(false);
  const [viewSignAnonymous, setViewSignAnonymous] = useState(false);
  const [nudgeCopied, setNudgeCopied] = useState(null);

  const countdown = useCountdown(deadline);
  const LOCAL_SAVE_KEY = "steeped_local_cards";
  useLocalSave(LOCAL_SAVE_KEY, theme, pages, coverItems, cardId);

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
    setSaving(true);
    // Generate a local id if we don't have one yet
    const localId = cardId || `local_${uid()}`;
    if (!cardId) setCardId(localId);
    const cardSnapshot = { id:localId, theme, pages, coverItems, updatedAt:new Date().toISOString() };
    persistCardLocally(cardSnapshot);
    const url = `${window.location.origin}/?card=${localId}`;
    setCardUrl(url);
    if (!currentUser) { setSaving(false); return localId; }
    try {
      const res = await fetch("/api/save-card", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ theme, pages, coverItems, userId:currentUser.id, cardId:cardId||undefined }) });
      const data = await res.json();
      if (data.cardId) {
        const remoteId = data.cardId;
        const remoteUrl = `${window.location.origin}/?card=${remoteId}`;
        setCardId(remoteId); setCardUrl(remoteUrl);
        // Update local store with real remote id
        persistCardLocally({ ...cardSnapshot, id:remoteId });
        setSaving(false); return remoteId;
      }
    } catch(e) { /* API not available, local save succeeded */ }
    setSaving(false); return localId;
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
    else { openMyDashboard(loggedInUser); }
  };

  const doSignOut = async () => { await supabase.auth.signOut(); setUser(null); setView("home"); };

  // ── Local card store (localStorage) ──────────────────────────
  const LOCAL_KEY = LOCAL_SAVE_KEY;

  const readLocalCards = () => {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); }
    catch(e) { return []; }
  };

  const writeLocalCards = (cards) => {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(cards)); }
    catch(e) {}
  };

  const persistCardLocally = (cardData) => {
    const existing = readLocalCards();
    const idx = existing.findIndex(c => c.id === cardData.id);
    const entry = { ...cardData, updatedAt: new Date().toISOString() };
    if (idx >= 0) existing[idx] = entry;
    else existing.unshift(entry);
    writeLocalCards(existing.slice(0, 50)); // keep last 50
  };

  const loadMyCards = async (currentUser) => {
    setMyCardsLoading(true);
    // Always load local cards first (instant)
    const local = readLocalCards();
    setMyCards(local);
    // Then try the API to merge/update if user is logged in
    const u = currentUser || user;
    if (u) {
      try {
        const res = await fetch(`/api/my-cards?userId=${u.id}`);
        if (res.ok) {
          const data = await res.json();
          const remote = data.cards || [];
          // Merge: remote wins on conflicts by id, local-only cards appended
          const remoteIds = new Set(remote.map(c => c.id));
          const localOnly = local.filter(c => !remoteIds.has(c.id));
          setMyCards([...remote, ...localOnly]);
        }
      } catch(e) { /* API not ready yet — local cards already shown */ }
    }
    setMyCardsLoading(false);
  };

  const openMyDashboard = (u) => {
    loadMyCards(u);
    setView("my-cards");
  };

  const deleteCard = async (cid) => {
    // Remove from local store
    const updated = readLocalCards().filter(c => c.id !== cid);
    writeLocalCards(updated);
    setMyCards(prev => prev.filter(c => c.id !== cid));
    // Also attempt remote delete
    try {
      if (user) await fetch(`/api/delete-card?id=${cid}&userId=${user.id}`, { method:"DELETE" });
    } catch(e) {}
    setDeleteConfirm(null);
  };

  const loadCardIntoEditor = (card) => {
    setTheme(card.theme);
    setPages(card.pages || [makePage(1)]);
    setCoverItems(card.coverItems || []);
    setCardId(card.id);
    setCardUrl(`${window.location.origin}/?card=${card.id}`);
    setSelectedTemplate("default");
    setActivePage(0);
    setView("editor");
  };

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

  // Dynamically load html2canvas if not already loaded
  const ensureHtml2Canvas = () => new Promise((resolve, reject) => {
    if (window.html2canvas) { resolve(window.html2canvas); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = () => resolve(window.html2canvas);
    s.onerror = () => reject(new Error("Could not load html2canvas"));
    document.head.appendChild(s);
  });

  const captureElementAsJpeg = async (el, h2c) => {
    const canvas = await h2c(el, { scale:2, useCORS:true, allowTaint:true, backgroundColor:"#ffffff", logging:false });
    return canvas.toDataURL("image/jpeg", 0.92);
  };

  const doShip = async () => {
    const { name, line1, city, zip, country } = shipAddr;
    if (!name||!line1||!city||!zip||!country) {
      setShipResult({ ok:false, error:"Please fill in all required address fields (marked *)." }); return;
    }
    setShipping(true); setShipResult(null); setCaptureError(null);
    try {
      // Load html2canvas dynamically
      let h2c;
      try { h2c = await ensureHtml2Canvas(); }
      catch(e) { setCaptureError("Could not capture card image — order will use cover gradient."); }

      // Capture cover + page 1 (front/back of printed card)
      let coverBase64 = null, page1Base64 = null;
      if (h2c && coverRef.current) {
        try { coverBase64 = await captureElementAsJpeg(coverRef.current, h2c); } catch(e) {}
      }
      if (h2c && pageRefs.current[0]) {
        try { page1Base64 = await captureElementAsJpeg(pageRefs.current[0], h2c); } catch(e) {}
      }

      const res = await fetch("/api/print-ship", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          sku: shipSize,
          recipient: shipAddr,
          coverBase64,
          page1Base64,
          cardId,
          cardUrl,
          themeName: theme?.name || "Card",
        })
      });
      const data = await res.json();
      if (res.ok && data.orderId) {
        setShipResult({ ok:true, orderId:data.orderId, eta:data.eta||"3-10 business days" });
      } else {
        setShipResult({ ok:false, error:data.error||"Something went wrong. Please try again." });
      }
    } catch(e) {
      setShipResult({ ok:false, error:"Could not reach the print server. Check your connection." });
    }
    setShipping(false);
  };

  // ── Dashboard helpers ─────────────────────────────────────────
  const addInvitee = () => {
    if (!newInviteeName.trim()) return;
    setInvitees(p=>[...p,{ id:uid(), name:newInviteeName.trim(), email:newInviteeEmail.trim(), status:"pending" }]);
    setNewInviteeName(""); setNewInviteeEmail("");
  };

  const removeInvitee = (id) => setInvitees(p=>p.filter(i=>i.id!==id));

  // Auto-mark invitees as signed when a matching signature appears
  const allSigNames = pages.flatMap(pg=>pg.items.filter(it=>it.type==="text"&&!it.anonymous).map(s=>s.signerName?.toLowerCase().trim()));
  const inviteesWithStatus = invitees.map(inv => ({
    ...inv,
    status: allSigNames.includes(inv.name.toLowerCase().trim()) ? "signed" : "pending"
  }));

  const nudgeInvitee = async (inv) => {
    const msg = WARM_NUDGE_MESSAGES[Math.floor(Math.random()*WARM_NUDGE_MESSAGES.length)];
    const full = inv.email
      ? `mailto:${inv.email}?subject=A card is waiting for your message&body=${encodeURIComponent(msg+(cardUrl?`\n\nSign here: ${cardUrl}`:""))}`
      : null;
    if (full) { window.open(full); }
    else { await navigator.clipboard.writeText(msg+(cardUrl?`\n\nSign here: ${cardUrl}`:"")); setNudgeCopied(inv.id); setTimeout(()=>setNudgeCopied(null),2200); }
  };

  const addViewSignature = async () => {
    if (!viewSignMsg.trim()) return;
    setViewSigning(true);
    const sig = {
      id:uid(), type:"text", text:viewSignMsg,
      signerName: viewSignAnonymous ? "" : (viewSignName||"Anonymous"),
      anonymous: viewSignAnonymous,
      font:viewSignFont, size:15, color:viewSignColor, bold:false, italic:false,
      x:22, y:62+((viewCard.pages[viewSignPage]?.items||[]).length*82)
    };
    try {
      const res = await fetch("/api/add-signature", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ cardId, pageIndex:viewSignPage, signature:sig }) });
      if (res.ok) {
        setViewCard(prev=>({ ...prev, pages:prev.pages.map((pg,i)=>i===viewSignPage?{...pg,items:[...(pg.items||[]),sig]}:pg) }));
        setViewSigned(true); setViewSignMsg(""); setViewSignName(""); setViewSignAnonymous(false);
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
  const addSig = () => {
    if(!msgText.trim()||activePage===0)return;
    spawnPageItem({ type:"text", text:msgText, signerName:editorSignAnonymous?"":signerName||"Anonymous", anonymous:editorSignAnonymous, font:tFont, size:tSize, color:tColor, bold:tBold, italic:tItalic });
    setMsgText("");
  };
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

  // Auto-persist to local store whenever navigating away from editor
  const navAwayFromEditor = (dest) => {
    if (view === "editor" && theme) {
      const snap = { id: cardId || `local_${uid()}`, theme, pages, coverItems, updatedAt: new Date().toISOString() };
      persistCardLocally(snap);
    }
    setView(dest);
  };

  const NavLogo = ({ onClick }) => (
    <div onClick={onClick} style={{ cursor:"pointer" }}>
      <div className="nav-wordmark">St<em>ee</em>ped</div>
      <span className="nav-tagline">Cards brewed with kindness</span>
    </div>
  );

  // ── Countdown display helper ──────────────────────────────────
  const CountdownBanner = () => {
    if (!countdown) return null;
    if (countdown.expired) return (
      <div className="countdown-display" style={{ borderColor:"rgba(184,74,48,.3)",background:"rgba(184,74,48,.04)" }}>
        <div className="countdown-number" style={{ color:"#b85c38",fontSize:14 }}>Deadline passed</div>
        <div className="countdown-urgency">The card is ready to send 🌸</div>
      </div>
    );
    const { days, hours, mins } = countdown;
    const urgency = days === 0 ? "Today's the last day — gather those warm words! ✨"
      : days === 1 ? "Just one day left to collect signatures 🌷"
      : `${days} day${days!==1?"s":""} to gather everyone's warmth`;
    return (
      <div className="countdown-display">
        <div style={{ display:"flex",justifyContent:"center",gap:14 }}>
          {days>0&&<div style={{ textAlign:"center" }}><div className="countdown-number">{days}</div><div className="countdown-label">days</div></div>}
          <div style={{ textAlign:"center" }}><div className="countdown-number">{hours}</div><div className="countdown-label">hrs</div></div>
          <div style={{ textAlign:"center" }}><div className="countdown-number">{mins}</div><div className="countdown-label">min</div></div>
        </div>
        <div className="countdown-urgency">{urgency}</div>
      </div>
    );
  };

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
              {/* Anonymous toggle */}
              <label className="anon-toggle" onClick={()=>setViewSignAnonymous(v=>!v)}>
                <input type="checkbox" checked={viewSignAnonymous} onChange={()=>{}} style={{ accentColor:"#d4a843" }}/>
                <span className="anon-toggle-label">
                  <strong style={{ fontWeight:500,display:"block",marginBottom:2 }}>Stay anonymous ✨</strong>
                  Your name will appear as a secret admirer — revealed by the feeling, not the face.
                </span>
              </label>

              {!viewSignAnonymous && <>
                <label className="field-label" style={{ marginTop:14 }}>Your name</label>
                <input className="f-input" placeholder="Your name" value={viewSignName} onChange={e=>setViewSignName(e.target.value)}/>
              </>}

              <PromptPicker
                themeId={viewCard?.theme?.id}
                recipientName={viewCard?.coverItems?.find(i=>i.type==="text")?.text || ""}
                onSelect={p=>setViewSignMsg(prev=>prev?prev+"\n\n"+p:p)}
                usedPrompts={(viewCard?.pages||[]).flatMap(pg=>(pg.items||[]).filter(i=>i.type==="text").map(i=>i.text))}
              />
              <label className="field-label" style={{ marginTop:14 }}>Your message</label>
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
                {viewSigning?<><span className="spinner"/> Signing…</>:<>{Icon.pen(14,"#FAF5EE")} {viewSignAnonymous?"Sign anonymously":"Sign this card"}</>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

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
          {(()=>{ const cnt=readLocalCards().length; return (
            <button onClick={()=>openMyDashboard()} style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:4,border:cnt?"1px solid rgba(212,168,67,.4)":"1px solid rgba(42,21,8,.14)",background:cnt?"rgba(212,168,67,.1)":"transparent",color:cnt?"#8B6E4E":"#8B6E4E",fontFamily:"'Jost',sans-serif",fontSize:12,cursor:"pointer",transition:"all .15s" }}>
              {Icon.user(13)} My Cards{cnt?<span style={{ background:"#d4a843",color:"white",borderRadius:"100px",fontSize:9,padding:"1px 7px",marginLeft:2 }}>{cnt}</span>:null}
            </button>
          ); })()}
          {user
            ?<button className="btn-ghost-sm" onClick={doSignOut}>Sign out</button>
            :<button className="btn-ghost-sm" onClick={()=>{ setAuthMode("login"); setShowAuth(true); }}>Log in</button>
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
        {/* ── Recent cards shelf on home page ── */}
        {(()=>{ const recent = readLocalCards().slice(0,3); if(!recent.length) return null; return (
          <div style={{ width:"100%",maxWidth:700,margin:"32px auto 0",padding:"0 24px",position:"relative",zIndex:2,animation:"fadeUp .7s ease .2s both" }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
              <div style={{ fontFamily:"'Jost',sans-serif",fontSize:10,fontWeight:500,letterSpacing:"2px",textTransform:"uppercase",color:"rgba(42,21,8,.38)" }}>Recently edited</div>
              <button onClick={()=>openMyDashboard()} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontSize:11,color:"#d4a843",letterSpacing:".3px",display:"flex",alignItems:"center",gap:5 }}>See all {Icon.arrow(11,"#d4a843")}</button>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:`repeat(${recent.length},1fr)`,gap:10 }}>
              {recent.map(card=>{ const th=THEMES.find(t=>t.id===card.theme?.id)||card.theme||THEMES[7]; const cti=(card.coverItems||[]).find(i=>i.type==="text"); return (
                <div key={card.id} onClick={()=>loadCardIntoEditor(card)} style={{ borderRadius:10,overflow:"hidden",boxShadow:"0 4px 18px rgba(42,21,8,.13)",cursor:"pointer",transition:"transform .2s",background:th.cover }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
                  <div style={{ height:72,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,padding:"10px 8px" }}>
                    <div style={{ color:th.accent,opacity:.7 }}>{Icon[th.icon]?.(16,th.accent)}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif",fontSize:11,color:th.accent,textAlign:"center",lineHeight:1.3,overflow:"hidden",maxWidth:"90%",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{cti?cti.text:th.name}</div>
                  </div>
                  <div style={{ padding:"7px 10px",background:"rgba(255,255,255,.78)",borderTop:"1px solid rgba(42,21,8,.06)",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <span style={{ fontFamily:"'Jost',sans-serif",fontSize:9,color:"rgba(42,21,8,.38)",letterSpacing:".3px" }}>{(card.pages||[]).flatMap(p=>(p.items||[])).filter(i=>i.type==="text").length} sigs</span>
                    <span style={{ fontFamily:"'Jost',sans-serif",fontSize:9,color:"#d4a843",letterSpacing:".3px" }}>Edit →</span>
                  </div>
                </div>
              ); })}
            </div>
          </div>
        ); })()}
      </div>
      {showAuth&&<AuthModal {...authProps}/>}
    </div>
  );


  if (view==="my-cards") {
    const firstName = user?.user_metadata?.full_name?.split(" ")[0] || null;
    const h = new Date().getHours();
    const timeOfDay = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
    return (
      <div className="app"><style>{CSS}</style>
        <nav className="nav">
          <NavLogo onClick={()=>setView("home")}/>
          <div style={{ display:"flex",gap:8,alignItems:"center" }}>
            {user && <span className="nav-user-name">{user.user_metadata?.full_name||user.email}</span>}
            {user
              ? <button className="btn-ghost-sm" onClick={doSignOut}>Sign out</button>
              : <button className="btn-ghost-sm" onClick={()=>{ setAuthMode("login"); setShowAuth(true); }}>{Icon.user(13)} Log in</button>
            }
            <button className="btn-dark" onClick={()=>setView("themes")}>New card {Icon.plus(12,"#FAF5EE")}</button>
          </div>
        </nav>

        <div className="mc-page">
          <div className="mc-wrap">

            {/* ── Top bar ── */}
            <div className="mc-topbar">
              <div className="mc-greeting">
                <div className="mc-eyebrow">good {timeOfDay}</div>
                <h1 className="mc-title">{firstName ? `Welcome back, ${firstName} ✨` : "My Cards ✨"}</h1>
                <p className="mc-sub">Here are all the cards you’ve brewed with care.</p>
              </div>
              <button className="btn-dark" onClick={()=>setView("themes")} style={{ flexShrink:0,marginTop:6 }}>
                {Icon.plus(13,"#FAF5EE")} New card
              </button>
            </div>

            {/* ── Login nudge ── */}
            {!user && (
              <div className="mc-banner">
                <div className="mc-banner-text">
                  <div className="mc-banner-title">Sign in to sync your cards across devices</div>
                  <div className="mc-banner-sub">Cards are saved locally for now — log in to keep them safe.</div>
                </div>
                <button className="btn-dark" style={{ fontSize:12,padding:"9px 20px",flexShrink:0 }} onClick={()=>{ setAuthMode("login"); setShowAuth(true); }}>
                  {Icon.user(12,"#FAF5EE")} Log in
                </button>
              </div>
            )}

            {/* ── Count ── */}
            <div className="mc-count">
              {myCardsLoading ? "Loading…" : `${myCards.length} card${myCards.length!==1?"s":""}`}
            </div>

            {myCardsLoading && (
              <div className="my-cards-loading">
                <div className="spinner" style={{ width:26,height:26,borderWidth:3,borderColor:"rgba(42,21,8,.12)",borderTopColor:"#d4a843" }}/>
                <p className="loading-text">Gathering your cards…</p>
              </div>
            )}

            {!myCardsLoading && myCards.length===0 && (
              <div className="my-cards-empty">
                <div className="my-cards-empty-icon">{Icon.mail(60,"#2A1508")}</div>
                <h2 className="my-cards-empty-title">No cards yet</h2>
                <p className="my-cards-empty-sub">Every card you brew is saved here automatically,<br/>ready to pick up or send again.</p>
                <button className="btn-hero" onClick={()=>setView("themes")}>Brew your first card {Icon.arrow(16,"#FAF5EE")}</button>
              </div>
            )}

            {!myCardsLoading && myCards.length>0 && (
              <div className="mc-grid">
                {myCards.map((card,i) => {
                  const th = THEMES.find(t=>t.id===card.theme?.id) || card.theme || THEMES[7];
                  const sigCount = (card.pages||[]).flatMap(p=>p.items||[]).filter(it=>it.type==="text").length;
                  const pageCount = card.pages?.length || 1;
                  const cti = (card.coverItems||[]).find(it=>it.type==="text");
                  const cardLink = `${window.location.origin}/?card=${card.id}`;
                  const isCopied = cardCopied===card.id;
                  const dateStr = card.updatedAt ? new Date(card.updatedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : null;
                  return (
                    <div key={card.id} className="mc-card" style={{ animationDelay:`${i*.05}s`,"--mc-env":th.accent }}>
                      {/* Tappable cover */}
                      <div className="mc-cover" style={{ background:th.cover }} onClick={()=>loadCardIntoEditor(card)}>
                        <div className="mc-cover-icon">{Icon[th.icon]?.(22,th.accent)}</div>
                        <div className="mc-cover-text" style={{ color:th.accent,fontFamily:cti?.font||"'Playfair Display',serif" }}>
                          {cti?.text || th.name}
                        </div>
                        <div className="mc-cover-watermark">{Icon[th.icon]?.(26,th.accent)}</div>
                        <div className="mc-cover-cta"><span className="mc-cover-cta-label">Open card</span></div>
                      </div>
                      {/* Body */}
                      <div className="mc-body">
                        <div className="mc-name">{th.name}</div>
                        <div className="mc-chips">
                          <span className="mc-chip">{Icon.pen(10,"#8B6E4E")} {sigCount} sig{sigCount!==1?"s":""}</span>
                          <span className="mc-chip">{Icon.copy(10,"#8B6E4E")} {pageCount} pg</span>
                          {dateStr && <span className="mc-chip">{Icon.clock(10,"#8B6E4E")} {dateStr}</span>}
                        </div>
                        <div className="mc-rule"/>
                        <div className="mc-actions">
                          <button className="mc-btn" onClick={()=>loadCardIntoEditor(card)}>{Icon.edit(10,"#8B6E4E")} Edit</button>
                          <button className="mc-btn" onClick={()=>window.open(cardLink,"_blank")}>{Icon.arrow(10,"#8B6E4E")} View</button>
                          <button className="mc-btn" onClick={async()=>{ await navigator.clipboard.writeText(cardLink); setCardCopied(card.id); setTimeout(()=>setCardCopied(null),2200); }}>
                            {isCopied?<>✓</>:<>{Icon.copy(10,"#8B6E4E")} Copy</>}
                          </button>
                          <button className="mc-btn-send" onClick={()=>{ loadCardIntoEditor(card); setTimeout(()=>setShowSend(true),60); }}>
                            {Icon.send(10,"#FAF5EE")} Send
                          </button>
                        </div>
                        <button className="mc-del" onClick={()=>setDeleteConfirm(card.id)}>delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* Delete confirmation */}
        {deleteConfirm&&(
          <div className="delete-confirm-overlay" onClick={()=>setDeleteConfirm(null)}>
            <div className="delete-confirm-box" onClick={e=>e.stopPropagation()}>
              <div style={{ fontSize:32,marginBottom:14 }}>🗑</div>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:10 }}>Delete this card?</div>
              <p style={{ fontFamily:"'Jost',sans-serif",fontSize:13,color:"#8B6E4E",fontWeight:300,lineHeight:1.75,marginBottom:24 }}>This can't be undone. Anyone with the link will no longer be able to view it.</p>
              <div style={{ display:"flex",gap:10 }}>
                <button className="btn-ghost" style={{ flex:1,justifyContent:"center" }} onClick={()=>setDeleteConfirm(null)}>Keep it</button>
                <button className="btn-dark" style={{ flex:1,justifyContent:"center",background:"#b84848" }} onClick={()=>deleteCard(deleteConfirm)}>Yes, delete</button>
              </div>
            </div>
          </div>
        )}

        {showSend&&(
          <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowSend(false)}>
            <div className="modal">
              <div className="modal-header">
                <h2 className="modal-title">Send your card</h2>
                <button className="close-btn" onClick={()=>setShowSend(false)}>{Icon.x(14)}</button>
              </div>
              <div className="modal-body" style={{ paddingTop:20 }}>
                {cardUrl&&(
                  <div className="card-url-box">
                    <div className="card-url-label">Card link</div>
                    <div className="card-url-row">
                      <span className="card-url-text">{cardUrl}</span>
                      <button className="btn-ghost-sm" onClick={()=>copyUrl()}>{copied?"✓ Copied":Icon.copy(12)}</button>
                    </div>
                  </div>
                )}
                <label className="field-label">Recipient's name</label>
                <input className="f-input" placeholder="Who is this for?" value={form.name} onChange={fSet("name")}/>
                <label className="field-label">Email address</label>
                <input className="f-input" type="email" placeholder="hello@example.com" value={form.to} onChange={fSet("to")}/>
                <label className="field-label">Personal note</label>
                <textarea className="f-textarea" rows={3} placeholder="Add a private note…" value={form.note} onChange={fSet("note")}/>
                <button className="btn-send" style={{ width:"100%",marginTop:16,justifyContent:"center" }} onClick={doSend}>{Icon.send(14,"#FAF5EE")} Send with love</button>
                {sent&&<div className="sent-confirm" style={{ paddingTop:16 }}>{Icon.check(44)}<div style={{ fontFamily:"'Playfair Display',serif",fontSize:18,marginTop:10 }}>Sent with love 🌸</div></div>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

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

  /* ── EDITOR ─────────────────────────────────────────────────── */
  return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <NavLogo onClick={()=>setView("home")}/>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          {user&&<span className="nav-user-name">{user.user_metadata?.full_name||user.email}</span>}
          <button className="btn-ghost-sm" onClick={()=>openMyDashboard()}>{Icon.user(13)} My Cards</button>
          <button className="btn-ghost-sm" onClick={()=>setView("themes")}>{Icon.back(13)} Themes</button>
          <button className="btn-send" onClick={handleSendClick} disabled={saving}>
            {saving?<><span className="spinner"/> Saving…</>:<>{Icon.send(14,"#FAF5EE")} Send</>}
          </button>
        </div>
      </nav>

      <div className="editor-layout">
        {/* ── Left Panel ── */}
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
                      onClick={() => { setSelectedTemplate(tmpl.id); setCoverItems(TEMPLATES[tmpl.id](theme)); }}
                      style={{ padding:"8px 4px",borderRadius:6,border:selectedTemplate===tmpl.id?`2px solid ${theme.accent}`:"1.5px solid rgba(42,21,8,.12)",background:selectedTemplate===tmpl.id?theme.cover:"white",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontSize:11,color:selectedTemplate===tmpl.id?theme.accent:"#8B6E4E",fontWeight:selectedTemplate===tmpl.id?600:400,transition:"all .15s" }}>
                      {tmpl.label}
                    </button>
                  ))}
                </div>
                <p style={{ fontFamily:"'Jost',sans-serif",fontSize:11,color:"rgba(42,21,8,.35)",lineHeight:1.6,marginBottom:12,marginTop:-8 }}>Picking a style resets your cover text.</p>
                <label className="field-label">Add text</label>
                <input className="f-input" placeholder="e.g. Happy Birthday, Courtney!" value={covText} onChange={e=>setCovText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCovText()}/>
                <label className="field-label">Style</label>
                <div className="style-row">
                  <div className="style-col"><span className="sub-label">Font</span><select className="f-select" value={covFont} onChange={e=>setCovFont(e.target.value)}>{FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
                  <div className="style-col"><span className="sub-label">Size</span><select className="f-select" value={covSize} onChange={e=>setCovSize(Number(e.target.value))}>{[12,14,16,18,20,22,24,28,32,36,42].map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div className="style-col" style={{flex:1}}><span className="sub-label">Color</span><ColorPicker value={covColor} onChange={setCovColor}/></div>
                </div>
                <div style={{display:"flex",gap:8,marginTop:10}}><button className={`fmt-btn${covBold?" on":""}`} onClick={()=>setCovBold(b=>!b)}><strong>B</strong></button><button className={`fmt-btn${covItalic?" on":""}`} onClick={()=>setCovItalic(it=>!it)}><em>I</em></button></div>
                <button className="btn-dark" style={{width:"100%",marginTop:16,justifyContent:"center"}} onClick={addCovText}>Add to Cover</button>
              </div>
            ) : (
              <div>
                {/* Anonymous toggle */}
                <label className="anon-toggle" style={{ marginBottom:14 }} onClick={()=>setEditorSignAnonymous(v=>!v)}>
                  <input type="checkbox" checked={editorSignAnonymous} onChange={()=>{}} style={{ accentColor:"#d4a843" }}/>
                  <span className="anon-toggle-label">
                    <strong style={{ fontWeight:500,display:"block",marginBottom:2 }}>Sign anonymously ✨</strong>
                    Your name appears as a secret admirer.
                  </span>
                </label>

                {!editorSignAnonymous && <>
                  <label className="field-label">Your name</label>
                  <input className="f-input" placeholder="How should we sign this?" value={signerName} onChange={e=>setSignerName(e.target.value)}/>
                </>}

                <PromptPicker
                  themeId={theme?.id}
                  recipientName={form.name || coverItems.find(i=>i.type==="text")?.text || ""}
                  onSelect={p=>setMsgText(prev=>prev?prev+"\n\n"+p:p)}
                  usedPrompts={allSigs.map(s=>s.text)}
                />
                <label className="field-label">Your message</label>
                <textarea className="f-textarea" rows={3} placeholder="Write something wonderful…" value={msgText} onChange={e=>setMsgText(e.target.value)}/>
                <label className="field-label">Style</label>
                <div className="style-row">
                  <div className="style-col"><span className="sub-label">Font</span><select className="f-select" value={tFont} onChange={e=>setTFont(e.target.value)}>{FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
                  <div className="style-col"><span className="sub-label">Size</span><select className="f-select" value={tSize} onChange={e=>setTSize(Number(e.target.value))}>{[12,13,14,15,16,18,20,22,24].map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div className="style-col" style={{flex:1}}><span className="sub-label">Color</span><ColorPicker value={tColor} onChange={setTColor}/></div>
                </div>
                <div style={{display:"flex",gap:8,marginTop:10}}><button className={`fmt-btn${tBold?" on":""}`} onClick={()=>setTBold(b=>!b)}><strong>B</strong></button><button className={`fmt-btn${tItalic?" on":""}`} onClick={()=>setTItalic(it=>!it)}><em>I</em></button></div>
                {msgText&&<div className="msg-preview" style={{fontFamily:tFont,fontSize:tSize,color:tColor,fontWeight:tBold?700:400,fontStyle:tItalic?"italic":"normal",marginTop:12}}>
                  <div>{msgText}</div>
                  {editorSignAnonymous
                    ? <div style={{fontSize:tSize*.72,marginTop:6,opacity:.6,fontStyle:"italic"}}>— <span className="anon-badge">{Icon.lock(9,"#8b3a7a")} secret admirer</span></div>
                    : signerName&&<div style={{fontSize:tSize*.72,marginTop:6,opacity:.6,fontStyle:"italic"}}>— {signerName}</div>}
                </div>}
                <button className="btn-dark" style={{width:"100%",marginTop:14,justifyContent:"center"}} onClick={addSig}>Add to Page {activePage}</button>
                <p style={{fontFamily:"'Jost',sans-serif",fontSize:11,color:"rgba(42,21,8,.35)",lineHeight:1.75,marginTop:8}}>Tap to select · drag to move · corner to resize</p>
              </div>
            ))}
            {activePanel==="photos"&&<PhotosPanel onAdd={(url)=>spawnPageItem({type:"photo",url})} uploads={uploads} onUpload={handleUpload} fileRef={fileRef}/>}
            {activePanel==="gifs"&&<GiphyPanel onAdd={(url)=>spawnPageItem({type:"gif",url})}/>}
            {activePanel==="emojis"&&<div><p style={{ fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:300,color:"#8B6E4E",marginBottom:14,lineHeight:1.7 }}>Tap to place — drag to move, corner to resize.</p><div className="emoji-grid">{EMOJIS.map(e=><button key={e} className="emoji-btn" onClick={()=>spawnPageItem({type:"emoji",content:e})}>{e}</button>)}</div></div>}
            {activePanel==="audio"&&<AudioPanel onAdd={(url)=>spawnPageItem({type:"audio",url})}/>}
          </div>
        </div>

        {/* ── Canvas ── */}
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
            <div className="card-scene" key="cover" onClick={e=>e.stopPropagation()}>
              <CardEnvelope accent={theme.accent}/>
              <div className="card-wrap">
                <div className="card-cover">
                  <div className="card-cover-face" style={{ background:theme.cover }}>
                    <div style={{ position:"absolute",top:16,right:18,opacity:.11,pointerEvents:"none" }}>{Icon[theme.icon](52,theme.accent)}</div>
                    <div style={{ position:"absolute",inset:10,border:"1px solid rgba(255,255,255,.32)",borderRadius:3,pointerEvents:"none" }}/>
                    <div ref={coverRef} className="cover-canvas" onClick={desel} style={{ minHeight:390,position:"relative",zIndex:10 }}>
                      {coverItems.map(item=>(
                        <DItem key={item.id} item={item} selected={selCover===item.id}
                          onSelect={id=>{setSelCover(id);setSelPage(null);}}
                          onDelete={delCovItem} onMove={moveCovItem} onResize={resCovItem} onTextChange={editCovText}
                          containerRef={coverRef}/>
                      ))}
                      {coverItems.length===0&&<div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none" }}><div style={{ color:theme.accent,marginBottom:18 }}>{Icon[theme.icon](52,theme.accent)}</div><div style={{ fontFamily:"'Playfair Display',serif",fontSize:26,color:theme.accent,fontWeight:400 }}>{theme.name}</div></div>}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop:30,padding:"8px 14px",background:"rgba(255,255,255,.7)",backdropFilter:"blur(8px)",borderRadius:5,fontFamily:"'Jost',sans-serif",fontSize:11.5,fontWeight:300,color:"#8B6E4E",lineHeight:1.8,textAlign:"center",transform:"rotate(-1.5deg)" }}>
                Use the <strong style={{ fontWeight:500 }}>Sign tab</strong> to add text · drag to reposition · corner to resize
              </div>
            </div>
          )}

          {activePage>0&&curPage&&(
            <div className="card-scene" key={curPage.id} onClick={e=>e.stopPropagation()}>
              <CardEnvelope accent={theme.accent}/>
              <div className="card-wrap">
                <div className="card-page">
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:5,background:theme.cover,borderRadius:"5px 5px 0 0",opacity:.9 }}/>
                  <div ref={el=>pageRefs.current[activePage-1]=el} className="page-canvas" onClick={desel}>
                    <div className="page-header">
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <div style={{ color:theme.accent,opacity:.6 }}>{Icon[theme.icon](14,theme.accent)}</div>
                        <span className="page-num-label">Page {curPage.num} of {pages.length}</span>
                      </div>
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
              </div>
              <button className="btn-page-add" style={{ transform:"rotate(-1.5deg)",marginTop:10 }} onClick={e=>{e.stopPropagation();addPage();}}>{Icon.plus(13)} Add another signing page</button>
            </div>
          )}

          <div className="canvas-footer" onClick={e=>e.stopPropagation()}>
            <span className="canvas-meta">{pages.length} page{pages.length!==1?"s":""} · {coverItems.length} cover · {totalItems} page items</span>
            <button className="btn-send" onClick={handleSendClick} disabled={saving}>
              {saving?<><span className="spinner"/> Saving…</>:<>{Icon.send(14,"#FAF5EE")} Send this Card</>}
            </button>
          </div>
        </div>

        {/* ── Right Panel (Dashboard) ── */}
        <div className="panel-right">

          {/* ── ORGANIZER DASHBOARD ── */}
          <div className="dashboard-section">
            <div className="sidebar-title" style={{ marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
              {Icon.users(11,"rgba(42,21,8,.38)")} Organizer dashboard
            </div>

            {/* Deadline countdown */}
            <CountdownBanner/>

            {/* Deadline setter */}
            <div style={{ marginBottom:10 }}>
              <div style={{ fontFamily:"'Jost',sans-serif",fontSize:9.5,fontWeight:500,letterSpacing:"1.2px",textTransform:"uppercase",color:"rgba(42,21,8,.38)",marginBottom:5,display:"flex",alignItems:"center",gap:5 }}>
                {Icon.clock(11)} Signing deadline
              </div>
              <input type="datetime-local" className="f-input" value={deadline} onChange={e=>setDeadline(e.target.value)}
                style={{ fontSize:11.5,padding:"7px 10px" }}/>
              {deadline&&<p style={{ fontFamily:"'Jost',sans-serif",fontSize:10,color:"rgba(42,21,8,.38)",marginTop:4,lineHeight:1.5 }}>Signers will see this gentle countdown on the card.</p>}
            </div>

            {/* Invitee list */}
            <div style={{ fontFamily:"'Jost',sans-serif",fontSize:9.5,fontWeight:500,letterSpacing:"1.2px",textTransform:"uppercase",color:"rgba(42,21,8,.38)",marginBottom:6,display:"flex",alignItems:"center",gap:5 }}>
              {Icon.bell(11)} Who should sign?
            </div>

            {inviteesWithStatus.length===0 && (
              <p className="empty-note" style={{ marginBottom:8 }}>Add names to track who's signed — and nudge anyone who hasn't yet.</p>
            )}

            {inviteesWithStatus.map(inv=>(
              <div key={inv.id} className="invitee-row">
                <div className="invitee-status-dot" style={{ background: inv.status==="signed" ? "#2a7a50" : "rgba(42,21,8,.18)" }}/>
                <span className="invitee-name">{inv.name}</span>
                {inv.status==="signed"
                  ? <span className="invitee-badge" style={{ background:"rgba(42,122,80,.1)",color:"#2a7a50" }}>✓ signed</span>
                  : <button className="btn-nudge" onClick={()=>nudgeInvitee(inv)} title={inv.email?"Send a warm email nudge":"Copy a warm nudge message"}>
                      {nudgeCopied===inv.id ? "Copied! 💌" : <>{Icon.bell(9,"#8B6E4E")} nudge</>}
                    </button>
                }
                <button onClick={()=>removeInvitee(inv.id)} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(42,21,8,.2)",padding:2,display:"flex",alignItems:"center",flexShrink:0 }} title="Remove">{Icon.x(9)}</button>
              </div>
            ))}

            {/* Add invitee */}
            <div className="add-invitee-row">
              <input className="f-input" placeholder="Name" value={newInviteeName} onChange={e=>setNewInviteeName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addInvitee()} style={{ flex:1 }}/>
              <input className="f-input" placeholder="Email (optional)" value={newInviteeEmail} onChange={e=>setNewInviteeEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addInvitee()} style={{ flex:1.4 }}/>
              <button className="btn-dark" onClick={addInvitee} style={{ padding:"7px 10px",fontSize:12,flexShrink:0 }}>{Icon.plus(12,"#FAF5EE")}</button>
            </div>

            {/* Stats bar */}
            {inviteesWithStatus.length > 0 && (
              <div style={{ marginTop:10,padding:"8px 10px",background:"white",borderRadius:6,border:"1px solid rgba(42,21,8,.07)" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                  <span style={{ fontFamily:"'Jost',sans-serif",fontSize:10,color:"#2a7a50" }}>✓ {inviteesWithStatus.filter(i=>i.status==="signed").length} signed</span>
                  <span style={{ fontFamily:"'Jost',sans-serif",fontSize:10,color:"rgba(42,21,8,.4)" }}>{inviteesWithStatus.filter(i=>i.status==="pending").length} pending</span>
                </div>
                <div style={{ height:4,borderRadius:2,background:"rgba(42,21,8,.08)",overflow:"hidden" }}>
                  <div style={{ height:"100%",borderRadius:2,background:"#2a7a50",transition:"width .4s ease",width:`${inviteesWithStatus.length?Math.round(inviteesWithStatus.filter(i=>i.status==="signed").length/inviteesWithStatus.length*100):0}%` }}/>
                </div>
              </div>
            )}

            {cardUrl&&(
              <button className="btn-ghost-sm" style={{ width:"100%",marginTop:8,fontSize:11 }} onClick={()=>copyUrl()}>{Icon.copy(11)} {copied?"Copied invite link!":"Copy invite link"}</button>
            )}
          </div>

          <div className="sidebar-divider"/>

          {/* Pages list */}
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

          <div style={{ marginTop:18 }}>
            <div className="sidebar-title">Signatures ({allSigs.length})</div>
            {allSigs.length===0
              ?<p className="empty-note">No signatures yet — be the first!</p>
              :allSigs.map(s=>(
                <div key={s.id} className="signer-row">
                  <div className="signer-dot" style={{ background: s.anonymous ? "#8b3a7a" : s.color }}/>
                  <div className="signer-info">
                    {s.anonymous
                      ? <div className="signer-name"><span className="anon-badge">{Icon.lock(9,"#8b3a7a")} secret admirer</span> <span style={{ fontWeight:400,fontSize:10,color:"rgba(42,21,8,.32)" }}>· p.{s.pageNum}</span></div>
                      : <div className="signer-name" style={{ color:s.color }}>{s.signerName||"—"} <span style={{ fontWeight:400,fontSize:10,color:"rgba(42,21,8,.32)" }}>· p.{s.pageNum}</span></div>
                    }
                    <div className="signer-preview">{s.text}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* ── Mobile FAB group (hidden on desktop via CSS) ── */}
      <div className="mobile-fab-group">
        <button className="mobile-dashboard-btn" onClick={()=>setShowDashDrawer(true)}>
          {countdown && !countdown.expired
            ? <>{Icon.clock(12,"#8B6E4E")} {countdown.days>0?`${countdown.days}d `:""}  {countdown.hours}h left</>
            : <>{Icon.bell(12,"#8B6E4E")} Dashboard</>
          }
          {inviteesWithStatus.filter(i=>i.status==="pending").length>0&&
            <span style={{ background:"#d4a843",color:"white",borderRadius:"100px",fontSize:9,padding:"1px 7px",marginLeft:2 }}>
              {inviteesWithStatus.filter(i=>i.status==="pending").length}
            </span>
          }
        </button>
        <button className="mobile-signers-btn" onClick={()=>setShowSigDrawer(true)}>
          {Icon.users(14,"#2A1508")} {allSigs.length} signature{allSigs.length!==1?"s":""}
        </button>
      </div>

      {/* ── Signatures drawer ── */}
      {showSigDrawer&&(
        <>
          <div className="sig-drawer-overlay" onClick={()=>setShowSigDrawer(false)}/>
          <div className="sig-drawer">
            <div className="sig-drawer-handle"/>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
              <div className="sidebar-title" style={{ margin:0 }}>Signatures ({allSigs.length})</div>
              <button className="close-btn" onClick={()=>setShowSigDrawer(false)}>{Icon.x(13)}</button>
            </div>
            {allSigs.length===0?<p className="empty-note">No signatures yet — be the first!</p>:allSigs.map(s=>(
              <div key={s.id} className="signer-row">
                <div className="signer-dot" style={{ background:s.anonymous?"#8b3a7a":s.color }}/>
                <div className="signer-info">
                  {s.anonymous
                    ? <div className="signer-name"><span className="anon-badge">{Icon.lock(9,"#8b3a7a")} secret admirer</span></div>
                    : <div className="signer-name" style={{ color:s.color }}>{s.signerName||"—"} <span style={{ fontWeight:400,fontSize:10,color:"rgba(42,21,8,.32)" }}>· p.{s.pageNum}</span></div>
                  }
                  <div className="signer-preview">{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Dashboard drawer (mobile only) ── */}
      {showDashDrawer&&(
        <>
          <div className="sig-drawer-overlay" onClick={()=>setShowDashDrawer(false)}/>
          <div className="sig-drawer dashboard-drawer">
            <div className="sig-drawer-handle"/>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
              <div className="sidebar-title" style={{ margin:0,display:"flex",alignItems:"center",gap:6 }}>
                {Icon.users(11,"rgba(42,21,8,.38)")} Organizer Dashboard
              </div>
              <button className="close-btn" onClick={()=>setShowDashDrawer(false)}>{Icon.x(13)}</button>
            </div>
            <CountdownBanner/>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontFamily:"'Jost',sans-serif",fontSize:9.5,fontWeight:500,letterSpacing:"1.2px",textTransform:"uppercase",color:"rgba(42,21,8,.38)",marginBottom:6,display:"flex",alignItems:"center",gap:5 }}>
                {Icon.clock(11)} Signing deadline
              </div>
              <input type="datetime-local" className="f-input" value={deadline} onChange={e=>setDeadline(e.target.value)} style={{ fontSize:14 }}/>
            </div>
            <div style={{ fontFamily:"'Jost',sans-serif",fontSize:9.5,fontWeight:500,letterSpacing:"1.2px",textTransform:"uppercase",color:"rgba(42,21,8,.38)",marginBottom:8,display:"flex",alignItems:"center",gap:5 }}>
              {Icon.bell(11)} Who should sign?
            </div>
            {inviteesWithStatus.length===0&&<p className="empty-note" style={{ marginBottom:10 }}>Add names to track who signed.</p>}
            {inviteesWithStatus.map(inv=>(
              <div key={inv.id} className="invitee-row">
                <div className="invitee-status-dot" style={{ background:inv.status==="signed"?"#2a7a50":"rgba(42,21,8,.18)" }}/>
                <span className="invitee-name">{inv.name}</span>
                {inv.status==="signed"
                  ?<span className="invitee-badge" style={{ background:"rgba(42,122,80,.1)",color:"#2a7a50" }}>✓ signed</span>
                  :<button className="btn-nudge" onClick={()=>nudgeInvitee(inv)}>
                    {nudgeCopied===inv.id?"Copied! 💌":<>{Icon.bell(9,"#8B6E4E")} nudge</>}
                  </button>
                }
                <button onClick={()=>removeInvitee(inv.id)} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(42,21,8,.2)",padding:4,display:"flex",alignItems:"center",flexShrink:0 }}>{Icon.x(9)}</button>
              </div>
            ))}
            <div className="add-invitee-row" style={{ marginTop:10 }}>
              <input className="f-input" placeholder="Name" value={newInviteeName} onChange={e=>setNewInviteeName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addInvitee()}/>
              <input className="f-input" placeholder="Email (optional)" value={newInviteeEmail} onChange={e=>setNewInviteeEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addInvitee()}/>
              <button className="btn-dark" onClick={addInvitee}>{Icon.plus(12,"#FAF5EE")} Add</button>
            </div>
            {inviteesWithStatus.length>0&&(
              <div style={{ marginTop:12,padding:"10px 12px",background:"#FAF5EE",borderRadius:6,border:"1px solid rgba(42,21,8,.07)" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                  <span style={{ fontFamily:"'Jost',sans-serif",fontSize:11,color:"#2a7a50" }}>✓ {inviteesWithStatus.filter(i=>i.status==="signed").length} signed</span>
                  <span style={{ fontFamily:"'Jost',sans-serif",fontSize:11,color:"rgba(42,21,8,.4)" }}>{inviteesWithStatus.filter(i=>i.status==="pending").length} pending</span>
                </div>
                <div style={{ height:5,borderRadius:2,background:"rgba(42,21,8,.08)",overflow:"hidden" }}>
                  <div style={{ height:"100%",borderRadius:2,background:"#2a7a50",transition:"width .4s ease",width:`${inviteesWithStatus.length?Math.round(inviteesWithStatus.filter(i=>i.status==="signed").length/inviteesWithStatus.length*100):0}%` }}/>
                </div>
              </div>
            )}
            {cardUrl&&<button className="btn-ghost-sm" style={{ width:"100%",marginTop:12,fontSize:12 }} onClick={()=>copyUrl()}>{Icon.copy(11)} {copied?"Copied!":"Copy invite link"}</button>}
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
              {[{id:"email",ic:Icon.email(16),lbl:"Email"},{id:"text",ic:Icon.message(16),lbl:"Text"},{id:"schedule",ic:Icon.calendar(16),lbl:"Schedule"},{id:"pdf",ic:Icon.download(16),lbl:"PDF"},{id:"ship",ic:Icon.truck(16),lbl:"Ship it"}].map(t=>(
                <button key={t.id} className={`modal-tab${sendTab===t.id?" active":""}`} onClick={()=>{ setSendTab(t.id); if(t.id==="ship") setShipResult(null); }}>{t.ic}<span className="modal-tab-label">{t.lbl}</span></button>
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
                {sendTab==="ship"&&(
                  <div>
                  {shipResult?.ok ? (
                    <div className="ship-success">
                      {Icon.check(52)}
                      <div className="ship-success-title">Order placed! 🎉</div>
                      <p className="ship-success-sub">
                        Your card is being printed on premium gloss card stock<br/>and shipped directly to {shipAddr.name}.<br/><br/>
                        <strong>Order #{shipResult.orderId}</strong><br/>
                        Estimated arrival: {shipResult.eta}
                      </p>
                      <button className="btn-ghost-sm" style={{ marginTop:18 }} onClick={()=>{ setShipResult(null); setShipAddr({name:"",email:"",line1:"",line2:"",city:"",state:"",zip:"",country:"US"}); }}>Send another copy</button>
                    </div>
                  ) : (
                    <div>
                      {/* Provider badge */}
                      <div style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"linear-gradient(135deg,#FFF9F2,#FAF5EE)",border:"1px solid rgba(212,168,67,.2)",borderRadius:7,marginBottom:18 }}>
                        {Icon.truck(15,"#d4a843")}
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:500,color:"#5a3a10" }}>Printed &amp; shipped via Prodigi</div>
                          <div style={{ fontFamily:"'Jost',sans-serif",fontSize:10.5,fontWeight:300,color:"#8B6E4E",marginTop:1 }}>330gsm gloss card · white-label · no minimum order</div>
                        </div>
                        <a href="https://www.prodigi.com" target="_blank" rel="noreferrer" style={{ fontFamily:"'Jost',sans-serif",fontSize:9,color:"rgba(42,21,8,.3)",letterSpacing:".5px",textDecoration:"none" }}>prodigi.com</a>
                      </div>

                      {/* Size picker */}
                      <label className="field-label">Card size</label>
                      <div className="ship-price-bar">
                        {PRODIGI_SIZES.map(sz=>(
                          <button key={sz.sku} className={"ship-size-btn"+(shipSize===sz.sku?" active":"")} onClick={()=>setShipSize(sz.sku)}>
                            {sz.popular&&<div style={{ fontSize:8,letterSpacing:".5px",color:"#d4a843",textTransform:"uppercase",marginBottom:1 }}>Popular</div>}
                            <div style={{ fontWeight:600 }}>{sz.label}</div>
                            <div style={{ fontSize:9,opacity:.55,marginTop:1 }}>{sz.dim}</div>
                            <div style={{ color:"#d4a843",fontSize:11,marginTop:3,fontWeight:500 }}>${sz.cardPrice.toFixed(2)}</div>
                          </button>
                        ))}
                      </div>

                      {/* Price breakdown */}
                      <div className="ship-total-row">
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                            <span className="ship-total-label">Card ({selectedSize.label})</span>
                            <span style={{ fontFamily:"'Jost',sans-serif",fontSize:12,color:"#2A1508" }}>${selectedSize.cardPrice.toFixed(2)}</span>
                          </div>
                          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                            <span className="ship-total-label">Standard shipping</span>
                            <span style={{ fontFamily:"'Jost',sans-serif",fontSize:12,color:"#2A1508" }}>${shipCost.toFixed(2)}</span>
                          </div>
                          <div style={{ height:1,background:"rgba(42,21,8,.07)",margin:"8px 0" }}/>
                          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                            <span style={{ fontFamily:"'Jost',sans-serif",fontSize:11,color:"rgba(42,21,8,.5)" }}>Estimated total</span>
                            <span className="ship-total-price">~${shipTotal}</span>
                          </div>
                          <div style={{ fontFamily:"'Jost',sans-serif",fontSize:9.5,color:"rgba(42,21,8,.35)",marginTop:5,lineHeight:1.5 }}>
                            Prices in USD · charged by Prodigi at fulfillment · envelope &amp; packaging included
                          </div>
                        </div>
                      </div>

                      {/* Address form */}
                      <label className="field-label">Deliver to</label>
                      <input className="f-input" placeholder="Recipient full name *" value={shipAddr.name} onChange={sAddr("name")} style={{ marginBottom:6 }}/>
                      <input className="f-input" placeholder="Email (for tracking updates)" type="email" value={shipAddr.email} onChange={sAddr("email")} style={{ marginBottom:6 }}/>
                      <input className="f-input" placeholder="Address line 1 *" value={shipAddr.line1} onChange={sAddr("line1")} style={{ marginBottom:6 }}/>
                      <input className="f-input" placeholder="Apt, suite, floor (optional)" value={shipAddr.line2} onChange={sAddr("line2")} style={{ marginBottom:6 }}/>
                      <div className="ship-addr-grid">
                        <input className="f-input" placeholder="City *" value={shipAddr.city} onChange={sAddr("city")}/>
                        <input className="f-input" placeholder="State / Province" value={shipAddr.state} onChange={sAddr("state")}/>
                      </div>
                      <div className="ship-addr-grid" style={{ marginBottom:16 }}>
                        <input className="f-input" placeholder="ZIP / Postcode *" value={shipAddr.zip} onChange={sAddr("zip")}/>
                        <select className="f-select" style={{ width:"100%",height:"100%" }} value={shipAddr.country} onChange={sAddr("country")}>
                          {[["US","🇺🇸 United States"],["GB","🇬🇧 United Kingdom"],["CA","🇨🇦 Canada"],["AU","🇦🇺 Australia"],["DE","🇩🇪 Germany"],["FR","🇫🇷 France"],["NL","🇳🇱 Netherlands"],["IE","🇮🇪 Ireland"],["NZ","🇳🇿 New Zealand"],["SE","🇸🇪 Sweden"],["IT","🇮🇹 Italy"],["ES","🇪🇸 Spain"],["JP","🇯🇵 Japan"],["SG","🇸🇬 Singapore"],["IN","🇮🇳 India"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}
                        </select>
                      </div>

                      {captureError&&<div style={{ fontFamily:"'Jost',sans-serif",fontSize:11,color:"#8B6E4E",padding:"8px 10px",background:"rgba(212,168,67,.07)",borderRadius:5,marginBottom:10,lineHeight:1.5 }}>⚠️ {captureError}</div>}
                      {shipResult?.error&&<div className="ship-error">{shipResult.error}</div>}

                      <button className="btn-send" style={{ width:"100%",justifyContent:"center",marginBottom:10,padding:"13px" }} onClick={doShip} disabled={shipping}>
                        {shipping
                          ? <><span className="spinner"/> Capturing card &amp; placing order…</>
                          : <>{Icon.truck(15,"#FAF5EE")} Print &amp; Ship for ~${shipTotal}</>
                        }
                      </button>
                      <div className="prodigi-badge">{Icon.pkg(11,"rgba(42,21,8,.28)")} Fulfilled by Prodigi · No Steeped branding on packaging · Delivers in 3–10 days</div>
                    </div>
                  )}
                  </div>
                )}
              </>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── AudioPanel ─────────────────────────────────────────────── */
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
      <button className="btn-upload" onClick={()=>audioFileRef.current?.click()}>
        {Icon.upload(15)} Upload an audio clip
      </button>
      <input ref={audioFileRef} type="file" accept="audio/*" style={{ display:"none" }} onChange={handleFileUpload}/>
      <p style={{ fontFamily:"'Jost',sans-serif",fontSize:11,color:"rgba(42,21,8,.28)",textAlign:"center",marginTop:-6,marginBottom:16,letterSpacing:".3px" }}>MP3, WAV, M4A — max 5 MB</p>
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
