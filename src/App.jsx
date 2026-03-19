import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const THEMES = [
  { id: "birthday",   name: "Happy Birthday",    emoji: "🎂", accent: "#C0503A", cover: "linear-gradient(145deg,#FFF0E8,#FFD8C0,#FFBFA8)", pattern: ["🎈","🎂","🎊","✨","🎁","🎉"] },
  { id: "holiday",    name: "Happy Holidays",    emoji: "❄️", accent: "#3A6DAA", cover: "linear-gradient(145deg,#EAF2FF,#C8DEFF,#A8C8FF)", pattern: ["❄️","⭐","🌟","✨","🎄","🕯️"] },
  { id: "thinking",   name: "Thinking of You",   emoji: "💜", accent: "#7047AA", cover: "linear-gradient(145deg,#F4EEFF,#E0CCFF,#CCB0FF)", pattern: ["💫","💜","✨","🌙","🦋","🌸"] },
  { id: "justbecause",name: "Just Because",      emoji: "🌸", accent: "#BF4A85", cover: "linear-gradient(145deg,#FFF0F8,#FFD0EC,#FFB8E0)", pattern: ["🌸","🌺","🌷","💕","🌹","🫶"] },
  { id: "hugs",       name: "Sending Hugs",      emoji: "🤗", accent: "#B87030", cover: "linear-gradient(145deg,#FFFAF0,#FFE8C0,#FFD090)", pattern: ["🤗","💛","🌻","✨","☀️","🫂"] },
  { id: "congrats",   name: "Congratulations",   emoji: "🎉", accent: "#2A845A", cover: "linear-gradient(145deg,#EEFFF8,#C0FFE0,#98FFC8)", pattern: ["🎉","⭐","🎊","🌟","🏆","✨"] },
  { id: "thankyou",   name: "Thank You",         emoji: "🙏", accent: "#A85828", cover: "linear-gradient(145deg,#FFF8EC,#FFE4C0,#FFD0A0)", pattern: ["🌻","💛","🙏","✨","🌼","💐"] },
  { id: "blank",      name: "Just a Card",       emoji: "✉️", accent: "#8B6E4E", cover: "linear-gradient(145deg,#FAF7F2,#F0EAE0,#E8DFD0)", pattern: ["✨","💌","🌿","🍃","🌾","🕊️"] },
];

const FONTS = [
  { label: "Playfair",    value: "'Playfair Display', serif" },
  { label: "Lora",        value: "'Lora', serif" },
  { label: "Handwritten", value: "'Dancing Script', cursive" },
  { label: "Literary",    value: "'Crimson Pro', serif" },
];

const EMOJIS = ["❤️","🌹","🎉","✨","🌸","🤗","💫","🌟","🎊","🌺","💕","🥳","🌈","🦋","🌻","💝","🎁","🌙","⭐","💐","😊","🥰","😍","🎶","🍰","🎂","🌷","💌","🫂","☀️","🍵","🌿","🫶","💞","🎈","🪷","🌼","💐","🌊","🦚","🐝","🍀","🌴","🦜","🌙","🍋","🫐","🍓","🌮","🎵"];

const STOCK_PHOTOS = [
  { id:1, url:"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&fit=crop", label:"Birthday Cake" },
  { id:2, url:"https://images.unsplash.com/photo-1490750967868-88df5691cc0c?w=300&fit=crop", label:"Spring Flowers" },
  { id:3, url:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&fit=crop", label:"Pink Hearts" },
  { id:4, url:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&fit=crop", label:"Forest Path" },
  { id:5, url:"https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=300&fit=crop", label:"Ocean Sunset" },
  { id:6, url:"https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&fit=crop", label:"Wildflowers" },
  { id:7, url:"https://images.unsplash.com/photo-1543362906-acfc16c67564?w=300&fit=crop", label:"Warm Candle" },
  { id:8, url:"https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&fit=crop", label:"Golden Hour" },
  { id:9, url:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&fit=crop", label:"Mountains" },
];

const SAMPLE_GIFS = [
  { id:1, url:"https://media.giphy.com/media/26AHONQ79FqaZmQLu/giphy.gif",  label:"Warm Hug" },
  { id:2, url:"https://media.giphy.com/media/l4KhQo2MESJkc6G52/giphy.gif",  label:"Birthday" },
  { id:3, url:"https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",  label:"Hearts" },
  { id:4, url:"https://media.giphy.com/media/3otPoS81loriI9sO8o/giphy.gif", label:"Sparkles" },
  { id:5, url:"https://media.giphy.com/media/xT9IgG50Lg7russDDy/giphy.gif", label:"Celebrate" },
  { id:6, url:"https://media.giphy.com/media/ycagynlDKKP96/giphy.gif",      label:"Flowers" },
];

const LIVE_TYPERS = [
  { name:"Sarah M.",  color:"#C0503A" },
  { name:"James K.",  color:"#3A6DAA" },
  { name:"Emma R.",   color:"#7047AA" },
  { name:"Lily Chen", color:"#2A845A" },
  { name:"Marco V.",  color:"#BF4A85" },
];

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&family=Dancing+Script:wght@500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}

@keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes cardIn   { from{opacity:0;transform:scale(0.95) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes steamRise{ 0%{transform:translateY(0) scale(1);opacity:0} 20%{opacity:.18} 100%{transform:translateY(-140px) scale(1.8);opacity:0} }
@keyframes bounce   { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
@keyframes sentPop  { 0%{transform:scale(.8);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
@keyframes pageFlip { 0%{transform:perspective(1200px) rotateY(-6deg);opacity:.6} 100%{transform:perspective(1200px) rotateY(0deg);opacity:1} }
@keyframes floatIn  { from{opacity:0;transform:translateY(6px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }

.app{font-family:'Lora',serif;background:#FAF7F2;color:#3D2B1F;min-height:100vh;}

.nav{display:flex;align-items:center;justify-content:space-between;padding:0 32px;height:62px;border-bottom:1px solid rgba(61,43,31,.09);background:rgba(250,247,242,.97);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;}
.logo{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;cursor:pointer;letter-spacing:-.4px;color:#3D2B1F;user-select:none;}
.logo-dot{color:#C49A5A;}
.logo-sub{font-family:'Lora',serif;font-size:11px;font-weight:400;color:#A88060;letter-spacing:1.8px;text-transform:uppercase;display:block;margin-top:-2px;}

.btn-primary{background:#3D2B1F;color:#FAF7F2;border:none;padding:10px 22px;font-family:'Lora',serif;font-size:14px;border-radius:5px;cursor:pointer;transition:background .2s,transform .15s;}
.btn-primary:hover{background:#5A3F2E;transform:translateY(-1px);}
.btn-hero{background:#3D2B1F;color:#FAF7F2;border:none;padding:15px 40px;font-family:'Lora',serif;font-size:16px;border-radius:6px;cursor:pointer;transition:all .2s;letter-spacing:.5px;display:inline-flex;align-items:center;gap:10px;}
.btn-hero:hover{background:#5A3F2E;transform:translateY(-2px);box-shadow:0 8px 24px rgba(61,43,31,.25);}
.btn-ghost{background:transparent;border:1px solid rgba(61,43,31,.22);color:#3D2B1F;padding:9px 20px;font-family:'Lora',serif;font-size:13px;border-radius:5px;cursor:pointer;transition:all .15s;}
.btn-ghost:hover{background:rgba(61,43,31,.05);}
.btn-ghost-sm{background:transparent;border:1px solid rgba(61,43,31,.18);color:#8B6E4E;padding:6px 14px;font-family:'Lora',serif;font-size:12px;border-radius:5px;cursor:pointer;transition:all .15s;}
.btn-ghost-sm:hover{background:rgba(61,43,31,.05);color:#3D2B1F;}
.btn-send{background:#B84A30;color:white;border:none;padding:12px 30px;font-family:'Lora',serif;font-size:15px;border-radius:6px;cursor:pointer;transition:all .2s;}
.btn-send:hover{background:#D05030;transform:translateY(-1px);box-shadow:0 6px 20px rgba(184,74,48,.3);}
.btn-upload{width:100%;padding:11px;border:1.5px dashed rgba(61,43,31,.22);border-radius:8px;background:transparent;cursor:pointer;font-family:'Lora',serif;font-size:13px;color:#8B6E4E;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px;}
.btn-upload:hover{background:rgba(61,43,31,.04);border-color:rgba(61,43,31,.4);}
.btn-page-add{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px;border:2px dashed rgba(61,43,31,.18);border-radius:10px;background:rgba(255,255,255,.5);cursor:pointer;font-family:'Lora',serif;font-size:13.5px;color:#9A7A5A;transition:all .2s;margin-top:12px;}
.btn-page-add:hover{border-color:rgba(61,43,31,.35);background:rgba(255,255,255,.85);color:#3D2B1F;}

.home{min-height:calc(100vh - 62px);overflow:hidden;position:relative;}
.steam-bg{position:absolute;top:30%;left:0;right:0;height:200px;pointer-events:none;}
.steam-bubble{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(196,154,90,.22),transparent 70%);animation:steamRise 7s ease-in-out infinite;}
.hero{text-align:center;padding:72px 32px 48px;max-width:700px;margin:0 auto;position:relative;z-index:1;animation:fadeUp .7s ease both;}
.hero-eyebrow{font-style:italic;font-size:13px;color:#B88048;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:22px;opacity:.9;}
.hero-title{font-family:'Playfair Display',serif;font-size:clamp(38px,6.5vw,64px);font-weight:400;line-height:1.18;margin-bottom:22px;}
.hero-title em{font-style:italic;color:#B8844A;}
.hero-sub{font-size:17px;color:#8B6E4E;line-height:1.85;margin-bottom:38px;}
.pill{background:rgba(184,132,74,.1);color:#8B6E4E;padding:6px 16px;border-radius:100px;font-size:12.5px;border:1px solid rgba(184,132,74,.22);}
.fan-wrap{display:flex;justify-content:center;align-items:flex-end;padding:24px 0 0;}
.fan-card{width:130px;height:90px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 6px 24px rgba(61,43,31,.13);margin:0 -14px;transition:transform .2s;cursor:pointer;}
.fan-card:hover{transform:translateY(-8px) !important;z-index:10 !important;}

.themes-view{padding:40px;max-width:960px;margin:0 auto;}
.section-header{text-align:center;margin-bottom:40px;animation:fadeUp .5s ease;}
.section-title{font-family:'Playfair Display',serif;font-size:30px;font-weight:400;margin-bottom:10px;}
.section-sub{color:#8B6E4E;font-size:15.5px;line-height:1.7;}
.themes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:18px;}
.theme-card{border-radius:14px;padding:30px 18px;text-align:center;cursor:pointer;transition:all .2s;box-shadow:0 2px 14px rgba(61,43,31,.07);border:2.5px solid transparent;animation:fadeUp .4s ease both;}
.theme-card:hover{transform:translateY(-5px);box-shadow:0 10px 28px rgba(61,43,31,.14);}

.editor-layout{display:grid;grid-template-columns:260px 1fr 210px;height:calc(100vh - 62px);overflow:hidden;}

.panel-left{border-right:1px solid rgba(61,43,31,.09);background:white;display:flex;flex-direction:column;overflow:hidden;}
.panel-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;padding:8px;background:#FAF7F2;border-bottom:1px solid rgba(61,43,31,.07);flex-shrink:0;}
.panel-tab{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 2px;border:none;background:transparent;cursor:pointer;border-radius:7px;font-size:17px;color:#8B6E4E;transition:all .15s;font-family:'Lora',serif;}
.panel-tab.active{background:white;color:#3D2B1F;box-shadow:0 1px 5px rgba(61,43,31,.1);}
.panel-tab .tab-label{font-size:10.5px;}
.panel-content{padding:18px;flex:1;overflow-y:auto;}

.field-label{display:block;font-size:11px;color:#9A7A5A;margin-bottom:6px;margin-top:16px;text-transform:uppercase;letter-spacing:1px;}
.field-label:first-child{margin-top:0;}
.f-input{width:100%;padding:9px 12px;border:1px solid rgba(61,43,31,.18);border-radius:6px;font-family:'Lora',serif;font-size:13.5px;color:#3D2B1F;background:#FAF7F2;outline:none;transition:border-color .15s;}
.f-input:focus{border-color:rgba(61,43,31,.5);}
.f-textarea{width:100%;padding:10px 12px;border:1px solid rgba(61,43,31,.18);border-radius:6px;font-family:'Lora',serif;font-size:13.5px;color:#3D2B1F;background:#FAF7F2;outline:none;resize:vertical;line-height:1.65;transition:border-color .15s;}
.f-textarea:focus{border-color:rgba(61,43,31,.5);}
.f-select{padding:7px 10px;border:1px solid rgba(61,43,31,.18);border-radius:5px;font-family:'Lora',serif;font-size:12.5px;background:#FAF7F2;color:#3D2B1F;outline:none;cursor:pointer;}
.f-color{width:38px;height:34px;border:1px solid rgba(61,43,31,.18);border-radius:5px;cursor:pointer;padding:2px;background:#FAF7F2;}
.style-row{display:flex;gap:8px;align-items:flex-end;}
.style-col{display:flex;flex-direction:column;}
.sub-label{font-size:10.5px;color:#9A7A5A;margin-bottom:4px;letter-spacing:.5px;}
.msg-preview{padding:12px 14px;background:#FAF7F2;border-radius:8px;margin-top:12px;border:1px solid rgba(61,43,31,.1);line-height:1.65;animation:fadeUp .3s ease;word-break:break-word;}
.media-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;}
.media-thumb{width:100%;height:68px;object-fit:cover;border-radius:7px;cursor:pointer;border:2px solid transparent;transition:all .15s;background:#E8DFD0;}
.media-thumb:hover{border-color:rgba(61,43,31,.4);transform:scale(1.03);}
.emoji-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;}
.emoji-btn{padding:8px 4px;font-size:21px;background:#FAF7F2;border:1px solid rgba(61,43,31,.08);border-radius:8px;cursor:pointer;transition:transform .1s;display:flex;align-items:center;justify-content:center;}
.emoji-btn:hover{transform:scale(1.2);background:#F0E8DC;}

.canvas-area{background:#E8E0D4;background-image:radial-gradient(circle at 25% 25%,rgba(255,255,255,.4),transparent 55%),radial-gradient(circle at 75% 75%,rgba(180,150,110,.2),transparent 55%);display:flex;flex-direction:column;align-items:center;padding:24px 20px;overflow-y:auto;gap:0;}

.page-tabs-wrap{display:flex;align-items:center;gap:8px;margin-bottom:18px;flex-wrap:wrap;justify-content:center;}
.page-tab-btn{display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:20px;border:1.5px solid rgba(61,43,31,.18);background:rgba(255,255,255,.6);cursor:pointer;font-family:'Lora',serif;font-size:12.5px;color:#8B6E4E;transition:all .15s;backdrop-filter:blur(6px);}
.page-tab-btn.active{background:white;color:#3D2B1F;border-color:rgba(61,43,31,.35);box-shadow:0 2px 10px rgba(61,43,31,.12);font-weight:500;}
.page-tab-btn:hover:not(.active){background:rgba(255,255,255,.85);}
.page-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}

.card-wrap{width:500px;animation:pageFlip .35s ease;position:relative;}

.card-cover{width:500px;min-height:340px;border-radius:16px;box-shadow:0 32px 72px rgba(61,43,31,.25),0 6px 18px rgba(61,43,31,.12);overflow:hidden;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:44px 40px;}
.card-cover::before{content:'';position:absolute;inset:0;background:linear-gradient(to bottom right,rgba(255,255,255,.3),transparent 60%);pointer-events:none;border-radius:16px;}
.cover-corner{position:absolute;font-size:22px;opacity:.35;line-height:1;}
.cover-emoji{font-size:60px;line-height:1;margin-bottom:16px;filter:drop-shadow(0 4px 12px rgba(0,0,0,.12));}
.cover-title{font-family:'Playfair Display',serif;font-size:32px;font-weight:700;line-height:1.2;margin-bottom:10px;}
.cover-sub{font-style:italic;font-size:15px;opacity:.65;line-height:1.6;}
.cover-line{width:60px;height:2px;border-radius:2px;margin:14px auto 0;opacity:.4;}
.cover-hint{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);font-size:11px;color:rgba(61,43,31,.38);font-style:italic;white-space:nowrap;}

.card-page{width:500px;min-height:420px;border-radius:16px;box-shadow:0 32px 72px rgba(61,43,31,.22),0 6px 18px rgba(61,43,31,.1);background:white;position:relative;overflow:hidden;}
.card-page::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:var(--acc,#C0503A);opacity:.7;}
.page-inner{padding:28px 30px 24px;}
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid rgba(61,43,31,.08);}
.page-num-label{font-size:11px;color:#9A7A5A;letter-spacing:1.5px;text-transform:uppercase;}
.page-del-btn{background:none;border:none;font-size:15px;cursor:pointer;color:rgba(61,43,31,.22);transition:color .15s;padding:2px;}
.page-del-btn:hover{color:rgba(184,74,48,.7);}

.page-media-row{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;}
.page-media-item{position:relative;display:inline-block;animation:floatIn .3s ease;}
.pm-photo{width:90px;height:90px;object-fit:cover;border-radius:10px;display:block;box-shadow:0 3px 10px rgba(61,43,31,.12);}
.pm-gif{width:100px;height:80px;object-fit:cover;border-radius:10px;display:block;box-shadow:0 3px 10px rgba(61,43,31,.12);}
.pm-emoji-wrap{width:56px;height:56px;display:flex;align-items:center;justify-content:center;background:#FAF7F2;border-radius:10px;box-shadow:0 2px 8px rgba(61,43,31,.1);}
.pm-emoji{font-size:32px;line-height:1;}
.rm-item-btn{position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:rgba(61,43,31,.7);color:white;border:none;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s;}
.page-media-item:hover .rm-item-btn{opacity:1;}

.sigs-list{display:flex;flex-direction:column;gap:14px;}
.sig-card{background:#FAF7F2;border-radius:10px;padding:14px 16px;position:relative;animation:floatIn .3s ease;border:1px solid rgba(61,43,31,.07);}
.sig-text{line-height:1.7;word-break:break-word;}
.sig-from{font-size:12px;margin-top:7px;font-style:italic;opacity:.6;}
.rm-sig-btn{position:absolute;top:8px;right:10px;background:none;border:none;font-size:15px;cursor:pointer;color:rgba(61,43,31,.2);transition:color .15s;opacity:0;}
.sig-card:hover .rm-sig-btn{opacity:1;}
.rm-sig-btn:hover{color:rgba(184,74,48,.7);}
.page-empty{padding:32px 16px;text-align:center;font-family:'Playfair Display',serif;font-style:italic;color:rgba(61,43,31,.28);font-size:15px;line-height:1.85;}

.live-typer{display:inline-flex;align-items:center;gap:7px;margin-top:16px;padding:7px 14px;background:rgba(250,247,242,.9);border-radius:20px;font-size:12px;color:#8B6E4E;animation:fadeUp .3s ease;border:1px solid rgba(61,43,31,.09);}
.live-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.typing-dots{display:flex;gap:3px;align-items:center;}
.typing-dot{width:4px;height:4px;border-radius:50%;background:#9A7A5A;animation:bounce 1s ease infinite;}

.canvas-footer{display:flex;align-items:center;justify-content:space-between;width:500px;margin-top:18px;}
.canvas-meta{font-size:12px;color:#9A7A5A;font-style:italic;}

.panel-right{border-left:1px solid rgba(61,43,31,.09);background:white;padding:20px;overflow-y:auto;}
.sidebar-title{font-family:'Playfair Display',serif;font-size:15px;margin-bottom:12px;color:#3D2B1F;}
.signer-row{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:8px;background:#FAF7F2;margin-bottom:7px;animation:fadeUp .25s ease;}
.signer-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.signer-info{flex:1;min-width:0;}
.signer-name{font-size:12.5px;font-weight:600;}
.signer-preview{font-size:11.5px;color:#9A7A5A;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.invite-box{margin-top:18px;padding:14px;background:linear-gradient(135deg,#FFF8F0,#FAF4EC);border-radius:10px;border:1px solid rgba(184,132,74,.2);}
.invite-note{font-size:12px;color:#8B6E4E;line-height:1.65;}
.pages-list{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
.page-list-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:#FAF7F2;cursor:pointer;border:1.5px solid transparent;transition:all .15s;}
.page-list-item.active{border-color:rgba(61,43,31,.25);background:white;}
.page-list-item:hover:not(.active){background:#F5EFE5;}
.page-list-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.page-list-name{font-size:12.5px;flex:1;}
.page-list-count{font-size:11px;color:#9A7A5A;}
.empty-note{font-size:12.5px;color:#9A7A5A;line-height:1.7;font-style:italic;}

.modal-overlay{position:fixed;inset:0;background:rgba(40,25,15,.52);backdrop-filter:blur(5px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeUp .2s ease;}
.modal{background:white;border-radius:18px;width:100%;max-width:476px;max-height:82vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 32px 80px rgba(40,25,15,.3);animation:cardIn .25s ease;}
.modal-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid rgba(61,43,31,.09);}
.modal-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:400;}
.close-btn{background:none;border:none;font-size:22px;cursor:pointer;color:#9A7A5A;line-height:1;padding:2px;}
.modal-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;padding:8px;background:#FAF7F2;border-bottom:1px solid rgba(61,43,31,.07);}
.modal-tab{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 2px;border:none;background:transparent;cursor:pointer;border-radius:7px;font-size:17px;color:#8B6E4E;transition:all .15s;font-family:'Lora',serif;}
.modal-tab.active{background:white;color:#3D2B1F;box-shadow:0 1px 5px rgba(61,43,31,.1);}
.modal-tab-label{font-size:10.5px;}
.modal-body{padding:22px 24px;overflow-y:auto;flex:1;}
.sent-confirm{text-align:center;padding:24px 0;animation:sentPop .4s ease;}
.sent-icon{font-size:52px;display:block;margin-bottom:14px;}
.sent-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:400;margin-bottom:8px;}
.sent-sub{color:#8B6E4E;font-size:15px;line-height:1.6;}
.modal-center{text-align:center;padding-top:8px;}
.modal-icon{font-size:52px;display:block;margin-bottom:16px;}
.modal-sec-title{font-family:'Playfair Display',serif;font-size:19px;margin-bottom:8px;}
.modal-sec-body{color:#8B6E4E;font-size:14px;line-height:1.75;margin-bottom:22px;}
.date-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
`;

const makePage = (num) => ({ id: Date.now() + Math.random(), num, signatures: [], mediaItems: [] });

export default function Steeped() {
  const [view, setView]           = useState("home");
  const [theme, setTheme]         = useState(null);
  const [activePage, setActivePage] = useState(0);
  const [pages, setPages]         = useState([makePage(1)]);
  const [signerName, setSignerName] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [textColor, setTextColor] = useState("#3D2B1F");
  const [textFont, setTextFont]   = useState(FONTS[0].value);
  const [textSize, setTextSize]   = useState(15);
  const [activePanel, setActivePanel] = useState("text");
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendTab, setSendTab]     = useState("email");
  const [liveTyper, setLiveTyper] = useState(null);
  const [sent, setSent]           = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [form, setForm]           = useState({ name:"", to:"", note:"", date:"", time:"" });
  const fileInputRef              = useRef(null);

  useEffect(() => {
    if (view !== "editor") { setLiveTyper(null); return; }
    let tid;
    const sched = (d=8000) => { tid = setTimeout(() => { setLiveTyper(LIVE_TYPERS[Math.floor(Math.random()*LIVE_TYPERS.length)]); tid = setTimeout(() => { setLiveTyper(null); sched(6000+Math.random()*5000); }, 3600); }, d); };
    sched(5000);
    return () => clearTimeout(tid);
  }, [view]);

  const goEditor = (t) => { setTheme(t); setView("editor"); setActivePage(0); setPages([makePage(1)]); };
  const fSet = (k) => (e) => setForm(p=>({...p,[k]:e.target.value}));
  const currentPageData = activePage === 0 ? null : pages[activePage - 1];
  const addPage = () => { const p = makePage(pages.length+1); setPages(prev=>[...prev,p]); setActivePage(pages.length+1); };
  const deletePage = (idx) => { if(pages.length===1)return; const u=pages.filter((_,i)=>i!==idx).map((p,i)=>({...p,num:i+1})); setPages(u); if(activePage>u.length)setActivePage(u.length); };
  const addSignature = () => { if(!currentText.trim()||activePage===0)return; setPages(prev=>prev.map((pg,i)=>i===activePage-1?{...pg,signatures:[...pg.signatures,{id:Date.now(),name:signerName||"Anonymous",text:currentText,color:textColor,font:textFont,size:textSize}]}:pg)); setCurrentText(""); };
  const removeSig = (pi,sid) => setPages(prev=>prev.map((pg,i)=>i===pi?{...pg,signatures:pg.signatures.filter(s=>s.id!==sid)}:pg));
  const addMedia = (item) => { if(activePage===0)return; setPages(prev=>prev.map((pg,i)=>i===activePage-1?{...pg,mediaItems:[...pg.mediaItems,{...item,id:Date.now()+Math.random()}]}:pg)); };
  const removeMedia = (pi,mid) => setPages(prev=>prev.map((pg,i)=>i===pi?{...pg,mediaItems:pg.mediaItems.filter(m=>m.id!==mid)}:pg));
  const handleUpload = (e) => { Array.from(e.target.files).forEach(f=>{ const r=new FileReader(); r.onload=ev=>setUploadedPhotos(p=>[...p,{id:Date.now()+Math.random(),url:ev.target.result,label:f.name}]); r.readAsDataURL(f); }); };
  const handleSend = () => { setSent(true); setTimeout(()=>{setSent(false);setShowSendModal(false);},2800); };
  const totalSigs  = pages.reduce((a,p)=>a+p.signatures.length,0);
  const totalMedia = pages.reduce((a,p)=>a+p.mediaItems.length,0);

  // HOME
  if (view==="home") return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <div><span className="logo">Steeped<span className="logo-dot">.</span></span><span className="logo-sub">cards brewing with kindness</span></div>
        <button className="btn-ghost" onClick={()=>setView("themes")}>Create a card</button>
      </nav>
      <div className="home">
        <div className="steam-bg">{[0,1,2,3,4].map(i=><div key={i} className="steam-bubble" style={{width:60+i*20,height:60+i*20,left:`${12+i*17}%`,bottom:0,animationDelay:`${i*1.1}s`,animationDuration:`${6+i*.8}s`}}/>)}</div>
        <div className="hero">
          <div className="hero-eyebrow">a little warmth, sent with care</div>
          <h1 className="hero-title">Cards <em>brewing</em><br/>with kindness</h1>
          <p className="hero-sub">Beautiful multi-page cards for every occasion.<br/>Sign together, add photos & GIFs, share warmly.</p>
          <button className="btn-hero" onClick={()=>setView("themes")}>Brew a Card →</button>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginTop:28}}>
            {["📖 Multiple signing pages","🖋️ Sign together live","📸 Photos & GIFs","📅 Schedule sending","✉️ Email, text or print"].map(f=><span key={f} className="pill">{f}</span>)}
          </div>
        </div>
        <div className="fan-wrap">
          {THEMES.slice(0,5).map((t,i)=>{const rots=[-9,-4,0,5,10],ty=[4,2,0,2,4];return <div key={t.id} className="fan-card" onClick={()=>goEditor(t)} style={{background:t.cover,transform:`rotate(${rots[i]}deg) translateY(${ty[i]}px)`,zIndex:i===2?5:i}}><div style={{fontSize:26}}>{t.emoji}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:11,color:t.accent,marginTop:7,fontWeight:600}}>{t.name}</div></div>;})}
        </div>
      </div>
    </div>
  );

  // THEMES
  if (view==="themes") return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <div onClick={()=>setView("home")} style={{cursor:"pointer"}}><span className="logo">Steeped<span className="logo-dot">.</span></span><span className="logo-sub">cards brewing with kindness</span></div>
        <button className="btn-ghost" onClick={()=>setView("home")}>← Home</button>
      </nav>
      <div className="themes-view">
        <div className="section-header">
          <h2 className="section-title">Choose your card</h2>
          <p className="section-sub">Each card opens into multiple pages — plenty of room for everyone to sign.</p>
        </div>
        <div className="themes-grid">
          {THEMES.map((t,i)=>(
            <div key={t.id} className="theme-card" style={{background:t.cover,animationDelay:`${i*.06}s`}} onClick={()=>goEditor(t)}>
              <div style={{fontSize:38,marginBottom:10}}>{t.emoji}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:15.5,fontWeight:600,color:t.accent}}>{t.name}</div>
              <div style={{marginTop:10,fontSize:15,opacity:.3,letterSpacing:3}}>{t.pattern.slice(0,3).join(" ")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // EDITOR
  return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <div onClick={()=>setView("home")} style={{cursor:"pointer"}}><span className="logo">Steeped<span className="logo-dot">.</span></span><span className="logo-sub">cards brewing with kindness</span></div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-ghost" onClick={()=>setView("themes")}>← Themes</button>
          <button className="btn-primary" onClick={()=>setShowSendModal(true)}>Send Card</button>
        </div>
      </nav>

      <div className="editor-layout">

        {/* LEFT PANEL */}
        <div className="panel-left">
          <div className="panel-tabs">
            {[{id:"text",icon:"🖋️",label:"Sign"},{id:"photos",icon:"📸",label:"Photos"},{id:"gifs",icon:"✨",label:"GIFs"},{id:"emojis",icon:"😊",label:"Emoji"},{id:"audio",icon:"🎵",label:"Audio"}].map(t=>(
              <button key={t.id} className={`panel-tab${activePanel===t.id?" active":""}`} onClick={()=>setActivePanel(t.id)}>
                <span>{t.icon}</span><span className="tab-label">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Cover notice */}
          {activePage===0 && activePanel==="text" && (
            <div style={{padding:18}}>
              <div style={{padding:"14px",background:"#FFF8F0",borderRadius:10,border:"1px solid rgba(184,132,74,.2)",fontSize:13,color:"#8B6E4E",lineHeight:1.8}}>
                <strong style={{color:"#3D2B1F"}}>You're on the Cover.</strong><br/>
                Switch to a signing page to add messages, photos & GIFs!
              </div>
            </div>
          )}

          <div className="panel-content" style={{display:activePage===0&&activePanel==="text"?"none":"block"}}>
            {/* SIGN */}
            {activePanel==="text" && activePage>0 && (
              <div>
                <label className="field-label">Your name</label>
                <input className="f-input" placeholder="How should we sign this?" value={signerName} onChange={e=>setSignerName(e.target.value)}/>
                <label className="field-label">Your message</label>
                <textarea className="f-textarea" rows={4} placeholder="Write something wonderful..." value={currentText} onChange={e=>setCurrentText(e.target.value)}/>
                <label className="field-label">Text style</label>
                <div className="style-row">
                  <div className="style-col"><span className="sub-label">Font</span><select className="f-select" value={textFont} onChange={e=>setTextFont(e.target.value)}>{FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
                  <div className="style-col"><span className="sub-label">Size</span><select className="f-select" value={textSize} onChange={e=>setTextSize(Number(e.target.value))}>{[12,13,14,15,16,18,20,22,24].map(s=><option key={s} value={s}>{s}px</option>)}</select></div>
                  <div className="style-col"><span className="sub-label">Color</span><input type="color" className="f-color" value={textColor} onChange={e=>setTextColor(e.target.value)}/></div>
                </div>
                {currentText && <div className="msg-preview" style={{fontFamily:textFont,fontSize:textSize,color:textColor}}><div>{currentText}</div>{signerName&&<div style={{fontSize:textSize*.75,marginTop:6,opacity:.6}}>— {signerName}</div>}</div>}
                <button className="btn-primary" style={{width:"100%",marginTop:14}} onClick={addSignature}>Add to Page {activePage}</button>
              </div>
            )}
            {/* PHOTOS */}
            {activePanel==="photos" && (
              <div>
                <button className="btn-upload" onClick={()=>fileInputRef.current?.click()}>📤 Upload your own photo</button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleUpload}/>
                {uploadedPhotos.length>0&&<><div className="sub-label" style={{marginBottom:8}}>Your uploads</div><div className="media-grid" style={{marginBottom:14}}>{uploadedPhotos.map(p=><img key={p.id} src={p.url} alt={p.label} className="media-thumb" onClick={()=>addMedia({type:"photo",url:p.url})}/>)}</div></>}
                <div className="sub-label" style={{marginBottom:8}}>Stock photos</div>
                <div className="media-grid">{STOCK_PHOTOS.map(p=><img key={p.id} src={p.url} alt={p.label} className="media-thumb" onClick={()=>addMedia({type:"photo",url:p.url})}/>)}</div>
                {activePage===0&&<div style={{marginTop:12,padding:"10px 12px",background:"#FFF8F0",borderRadius:8,fontSize:12,color:"#9A7A5A",fontStyle:"italic"}}>Switch to a signing page to add photos there.</div>}
              </div>
            )}
            {/* GIFS */}
            {activePanel==="gifs" && (
              <div>
                <p style={{fontSize:13,color:"#9A7A5A",marginBottom:14,lineHeight:1.65}}>Tap a GIF to add it to the current page.</p>
                <div className="media-grid">{SAMPLE_GIFS.map(g=><img key={g.id} src={g.url} alt={g.label} className="media-thumb" style={{height:68}} onClick={()=>addMedia({type:"gif",url:g.url})}/>)}</div>
                {activePage===0&&<div style={{marginTop:12,padding:"10px 12px",background:"#FFF8F0",borderRadius:8,fontSize:12,color:"#9A7A5A",fontStyle:"italic"}}>Switch to a signing page to add GIFs there.</div>}
              </div>
            )}
            {/* EMOJIS */}
            {activePanel==="emojis" && (
              <div>
                <p style={{fontSize:13,color:"#9A7A5A",marginBottom:12,lineHeight:1.6}}>Tap to place on current page.</p>
                <div className="emoji-grid">{EMOJIS.map(e=><button key={e} className="emoji-btn" onClick={()=>addMedia({type:"emoji",content:e})}>{e}</button>)}</div>
              </div>
            )}
            {/* AUDIO */}
            {activePanel==="audio" && (
              <div>
                <p style={{fontSize:13,color:"#9A7A5A",lineHeight:1.75,marginBottom:18}}>Add a voice message or music clip.</p>
                <button className="btn-upload">🎙️ Record a voice message</button>
                <button className="btn-upload">🎵 Upload an audio clip</button>
                <p style={{fontSize:11.5,color:"#9A7A5A",fontStyle:"italic",textAlign:"center",marginTop:8,lineHeight:1.6}}>Supported: .mp3, .wav, .m4a (max 5 MB)</p>
              </div>
            )}
          </div>
        </div>

        {/* CANVAS */}
        <div className="canvas-area">
          {/* Page tabs */}
          <div className="page-tabs-wrap">
            <button className={`page-tab-btn${activePage===0?" active":""}`} onClick={()=>setActivePage(0)}>
              <span style={{fontSize:14}}>{theme.emoji}</span> Cover
            </button>
            {pages.map((pg,i)=>(
              <button key={pg.id} className={`page-tab-btn${activePage===i+1?" active":""}`} onClick={()=>setActivePage(i+1)}>
                <div className="page-dot" style={{background:activePage===i+1?theme.accent:"rgba(61,43,31,.25)"}}/>
                Page {pg.num}
                {pg.signatures.length>0&&<span style={{background:theme.accent,color:"white",borderRadius:"100px",fontSize:10,padding:"1px 6px"}}>{pg.signatures.length}</span>}
              </button>
            ))}
            <button className="page-tab-btn" onClick={addPage}><span style={{fontSize:14}}>＋</span> Add Page</button>
          </div>

          {/* COVER */}
          {activePage===0 && (
            <div className="card-wrap" key="cover">
              <div className="card-cover" style={{background:theme.cover}}>
                <span className="cover-corner" style={{top:14,left:18}}>{theme.pattern[0]}</span>
                <span className="cover-corner" style={{top:14,right:18}}>{theme.pattern[1]}</span>
                <span className="cover-corner" style={{bottom:14,left:18}}>{theme.pattern[2]}</span>
                <span className="cover-corner" style={{bottom:14,right:18}}>{theme.pattern[3]}</span>
                <div className="cover-emoji">{theme.emoji}</div>
                <div className="cover-title" style={{color:theme.accent}}>{theme.name}</div>
                <div className="cover-sub" style={{color:theme.accent}}>A card made with love, signed by many hearts.</div>
                <div className="cover-line" style={{background:theme.accent}}/>
                <div className="cover-hint">✦ Your custom Canva design will appear here ✦</div>
              </div>
              <div style={{marginTop:14,padding:"12px 16px",background:"rgba(255,255,255,.75)",borderRadius:10,backdropFilter:"blur(6px)",fontSize:12.5,color:"#8B6E4E",lineHeight:1.8,textAlign:"center"}}>
                This is the <strong>card cover</strong>. Tap a page tab above to start signing!
              </div>
            </div>
          )}

          {/* SIGNING PAGE */}
          {activePage>0 && currentPageData && (
            <div className="card-wrap" key={currentPageData.id}>
              <div className="card-page" style={{"--acc":theme.accent}}>
                <div className="page-inner">
                  <div className="page-header">
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>{theme.emoji}</span>
                      <span className="page-num-label">Page {currentPageData.num} of {pages.length}</span>
                    </div>
                    {pages.length>1&&<button className="page-del-btn" onClick={()=>deletePage(activePage-1)} title="Remove page">🗑</button>}
                  </div>

                  {currentPageData.mediaItems.length>0&&(
                    <div className="page-media-row">
                      {currentPageData.mediaItems.map(item=>(
                        <div key={item.id} className="page-media-item">
                          {item.type==="emoji"
                            ?<div className="pm-emoji-wrap"><span className="pm-emoji">{item.content}</span></div>
                            :<img src={item.url} alt="" className={item.type==="gif"?"pm-gif":"pm-photo"} onError={e=>{e.target.style.opacity=".3";}}/>
                          }
                          <button className="rm-item-btn" onClick={()=>removeMedia(activePage-1,item.id)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentPageData.signatures.length===0&&currentPageData.mediaItems.length===0&&(
                    <div className="page-empty">This page is waiting to be filled<br/>with warm words and kind hearts…</div>
                  )}

                  <div className="sigs-list">
                    {currentPageData.signatures.map(s=>(
                      <div key={s.id} className="sig-card">
                        <div className="sig-text" style={{fontFamily:s.font,fontSize:s.size,color:s.color}}>{s.text}</div>
                        {s.name!=="Anonymous"&&<div className="sig-from" style={{color:s.color}}>— {s.name}</div>}
                        <button className="rm-sig-btn" onClick={()=>removeSig(activePage-1,s.id)}>×</button>
                      </div>
                    ))}
                  </div>

                  {liveTyper&&(
                    <div className="live-typer">
                      <div className="live-dot" style={{background:liveTyper.color}}/>
                      <span style={{color:liveTyper.color,fontWeight:600}}>{liveTyper.name}</span>
                      <span>is signing</span>
                      <div className="typing-dots">{[0,1,2].map(i=><div key={i} className="typing-dot" style={{animationDelay:`${i*.2}s`}}/>)}</div>
                    </div>
                  )}
                </div>
              </div>
              <button className="btn-page-add" onClick={addPage}><span style={{fontSize:18}}>＋</span> Add another signing page</button>
            </div>
          )}

          <div className="canvas-footer">
            <span className="canvas-meta">{pages.length} page{pages.length!==1?"s":""} · {totalSigs} signature{totalSigs!==1?"s":""} · {totalMedia} media item{totalMedia!==1?"s":""}</span>
            <button className="btn-send" onClick={()=>setShowSendModal(true)}>Send this Card →</button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel-right">
          <h3 className="sidebar-title">Pages</h3>
          <div className="pages-list">
            <div className={`page-list-item${activePage===0?" active":""}`} onClick={()=>setActivePage(0)}>
              <span style={{fontSize:14}}>{theme.emoji}</span>
              <span className="page-list-name" style={{fontFamily:"'Playfair Display',serif"}}>Cover</span>
            </div>
            {pages.map((pg,i)=>(
              <div key={pg.id} className={`page-list-item${activePage===i+1?" active":""}`} onClick={()=>setActivePage(i+1)}>
                <div className="page-list-dot" style={{background:pg.signatures.length>0?theme.accent:"rgba(61,43,31,.2)"}}/>
                <span className="page-list-name">Page {pg.num}</span>
                <span className="page-list-count">{pg.signatures.length} sig{pg.signatures.length!==1?"s":""}</span>
              </div>
            ))}
          </div>
          <button className="btn-ghost-sm" style={{width:"100%"}} onClick={addPage}>＋ Add page</button>

          <div style={{marginTop:22}}>
            <h3 className="sidebar-title">All Signatures</h3>
            {totalSigs===0
              ?<p className="empty-note">No signatures yet — be the first to sign!</p>
              :pages.map((pg,pi)=>pg.signatures.map(s=>(
                <div key={s.id} className="signer-row">
                  <div className="signer-dot" style={{background:s.color}}/>
                  <div className="signer-info">
                    <div className="signer-name" style={{color:s.color}}>{s.name} <span style={{fontWeight:400,fontSize:10.5,color:"#9A7A5A"}}>· p.{pg.num}</span></div>
                    <div className="signer-preview">{s.text}</div>
                  </div>
                </div>
              )))
            }
          </div>

          <div className="invite-box" style={{marginTop:18}}>
            <p className="invite-note">🔗 <strong>Invite others to sign</strong> — share a link and watch signatures arrive across all pages in real time.</p>
            <button className="btn-ghost" style={{width:"100%",marginTop:10,fontSize:12.5}}>Copy invite link</button>
          </div>
        </div>
      </div>

      {/* SEND MODAL */}
      {showSendModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowSendModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Send your card</h2>
              <button className="close-btn" onClick={()=>setShowSendModal(false)}>×</button>
            </div>
            <div className="modal-tabs">
              {[{id:"email",icon:"✉️",label:"Email"},{id:"text",icon:"💬",label:"Text"},{id:"schedule",icon:"📅",label:"Schedule"},{id:"pdf",icon:"📄",label:"PDF"},{id:"print",icon:"🖨️",label:"Print"}].map(t=>(
                <button key={t.id} className={`modal-tab${sendTab===t.id?" active":""}`} onClick={()=>setSendTab(t.id)}>
                  <span>{t.icon}</span><span className="modal-tab-label">{t.label}</span>
                </button>
              ))}
            </div>
            <div className="modal-body">
              {sent?(
                <div className="sent-confirm"><span className="sent-icon">✨</span><h3 className="sent-title">Card sent with love!</h3><p className="sent-sub">Your kindness is on its way.<br/>May it bring a warm smile.</p></div>
              ):<>
                {(sendTab==="email"||sendTab==="text")&&(
                  <div>
                    <label className="field-label">Recipient's name</label>
                    <input className="f-input" placeholder="Who is this for?" value={form.name} onChange={fSet("name")}/>
                    <label className="field-label">{sendTab==="email"?"Email address":"Phone number"}</label>
                    <input className="f-input" placeholder={sendTab==="email"?"hello@example.com":"+1 (555) 000-0000"} value={form.to} onChange={fSet("to")}/>
                    <label className="field-label">Personal note</label>
                    <textarea className="f-textarea" rows={3} placeholder="Add a private note…" value={form.note} onChange={fSet("note")}/>
                    <button className="btn-send" style={{width:"100%",marginTop:14}} onClick={handleSend}>Send with love ✨</button>
                  </div>
                )}
                {sendTab==="schedule"&&(
                  <div>
                    <p style={{color:"#8B6E4E",fontSize:14,lineHeight:1.75,marginBottom:16}}>Schedule your card to arrive on a special day.</p>
                    <label className="field-label">Recipient's name</label>
                    <input className="f-input" placeholder="Who is this for?" value={form.name} onChange={fSet("name")}/>
                    <label className="field-label">Email or phone</label>
                    <input className="f-input" placeholder="Where should we send it?" value={form.to} onChange={fSet("to")}/>
                    <label className="field-label">Delivery date & time</label>
                    <div className="date-row"><input type="date" className="f-input" value={form.date} onChange={fSet("date")}/><input type="time" className="f-input" value={form.time} onChange={fSet("time")}/></div>
                    <button className="btn-send" style={{width:"100%",marginTop:16}} onClick={handleSend}>Schedule this Card 📅</button>
                  </div>
                )}
                {sendTab==="pdf"&&<div className="modal-center"><span className="modal-icon">📄</span><h3 className="modal-sec-title">Save as PDF</h3><p className="modal-sec-body">Download all {pages.length+1} pages as a beautiful PDF.</p><button className="btn-send" style={{padding:"13px 36px"}} onClick={()=>window.print()}>Download PDF</button></div>}
                {sendTab==="print"&&<div className="modal-center"><span className="modal-icon">🖨️</span><h3 className="modal-sec-title">Print your card</h3><p className="modal-sec-body">Print all {pages.length+1} pages and hand-deliver with love.</p><button className="btn-send" style={{padding:"13px 36px"}} onClick={()=>window.print()}>Print Card</button></div>}
              </>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
