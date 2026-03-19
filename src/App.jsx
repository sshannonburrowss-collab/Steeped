import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const THEMES = [
  { id: "birthday", name: "Happy Birthday", emoji: "🎂", bg: "linear-gradient(150deg, #FFF5F0 0%, #FFE8DE 60%, #FFDDD0 100%)", accent: "#C0503A", pattern: "🎈🎂🎊✨" },
  { id: "holiday", name: "Happy Holidays", emoji: "❄️", bg: "linear-gradient(150deg, #F0F6FF 0%, #E0EEFF 60%, #D4E6FF 100%)", accent: "#3A6DAA", pattern: "❄️⭐🌟✨" },
  { id: "thinking", name: "Thinking of You", emoji: "💜", bg: "linear-gradient(150deg, #F8F0FF 0%, #EEDDFF 60%, #E4D0FF 100%)", accent: "#7047AA", pattern: "💫💜✨🌙" },
  { id: "justbecause", name: "Just Because", emoji: "🌸", bg: "linear-gradient(150deg, #FFF0F6 0%, #FFDDEE 60%, #FFD0E8 100%)", accent: "#BF4A85", pattern: "🌸🌺🌷💕" },
  { id: "hugs", name: "Sending Hugs", emoji: "🤗", bg: "linear-gradient(150deg, #FFFCF0 0%, #FFF3D0 60%, #FFE8B8 100%)", accent: "#B87030", pattern: "🤗💛🌻✨" },
  { id: "congrats", name: "Congratulations", emoji: "🎉", bg: "linear-gradient(150deg, #F0FFF8 0%, #D8FFE8 60%, #C8FFD8 100%)", accent: "#2A845A", pattern: "🎉⭐🎊🌟" },
  { id: "thankyou", name: "Thank You", emoji: "🙏", bg: "linear-gradient(150deg, #FFFAF0 0%, #FFE8CC 60%, #FFD8B0 100%)", accent: "#A85828", pattern: "🌻💛🙏✨" },
  { id: "blank", name: "Just a Card", emoji: "✉️", bg: "linear-gradient(150deg, #FAF7F2 0%, #F0EAE0 60%, #E8DFD0 100%)", accent: "#8B6E4E", pattern: "✨💌🌿🍃" },
];

const FONTS = [
  { label: "Playfair", value: "'Playfair Display', serif" },
  { label: "Lora", value: "'Lora', serif" },
  { label: "Handwritten", value: "'Dancing Script', cursive" },
  { label: "Literary", value: "'Crimson Pro', serif" },
];

const EMOJIS = ["❤️","🌹","🎉","✨","🌸","🤗","💫","🌟","🎊","🌺","💕","🥳","🌈","🦋","🌻","💝","🎁","🌙","⭐","💐","😊","🥰","😍","🎶","🍰","🎂","🌷","💌","🫂","☀️","🍵","🌿","🫶","💞","🎈","🪷","🌼","💐","🌊","🦚"];

const STOCK_PHOTOS = [
  { id: 1, url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&fit=crop", label: "Birthday Cake" },
  { id: 2, url: "https://images.unsplash.com/photo-1490750967868-88df5691cc0c?w=300&fit=crop", label: "Spring Flowers" },
  { id: 3, url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&fit=crop", label: "Pink Hearts" },
  { id: 4, url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&fit=crop", label: "Forest Path" },
  { id: 5, url: "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=300&fit=crop", label: "Ocean Sunset" },
  { id: 6, url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&fit=crop", label: "Wildflowers" },
  { id: 7, url: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=300&fit=crop", label: "Warm Candle" },
  { id: 8, url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop", label: "Portrait Warmth" },
  { id: 9, url: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&fit=crop", label: "Golden Hour" },
];

const SAMPLE_GIFS = [
  { id: 1, url: "https://media.giphy.com/media/26AHONQ79FqaZmQLu/giphy.gif", label: "Warm Hug" },
  { id: 2, url: "https://media.giphy.com/media/l4KhQo2MESJkc6G52/giphy.gif", label: "Birthday" },
  { id: 3, url: "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif", label: "Hearts" },
  { id: 4, url: "https://media.giphy.com/media/3otPoS81loriI9sO8o/giphy.gif", label: "Sparkles" },
  { id: 5, url: "https://media.giphy.com/media/xT9IgG50Lg7russDDy/giphy.gif", label: "Celebrate" },
  { id: 6, url: "https://media.giphy.com/media/ycagynlDKKP96/giphy.gif", label: "Flowers" },
];

const LIVE_TYPERS = [
  { name: "Sarah M.", color: "#C0503A" },
  { name: "James K.", color: "#3A6DAA" },
  { name: "Emma R.", color: "#7047AA" },
  { name: "Lily Chen", color: "#2A845A" },
  { name: "Marco V.", color: "#BF4A85" },
];

// ─── CSS ─────────────────────────────────────────────────────────────────────

const INJECT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&family=Dancing+Script:wght@500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes steamRise {
    0%   { transform: translateY(0) scale(1);   opacity: 0; }
    20%  { opacity: 0.18; }
    100% { transform: translateY(-140px) scale(1.8); opacity: 0; }
  }
  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); }
    30%            { transform: translateY(-5px); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cardReveal {
    from { opacity: 0; transform: scale(0.96) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes sentPop {
    0%   { transform: scale(0.8); opacity: 0; }
    60%  { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
  }

  .steeped-app {
    font-family: 'Lora', serif;
    background: #FAF7F2;
    color: #3D2B1F;
    min-height: 100vh;
  }
  .steeped-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    height: 62px;
    border-bottom: 1px solid rgba(61,43,31,0.09);
    background: rgba(250,247,242,0.97);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: -0.4px;
    color: #3D2B1F;
    user-select: none;
  }
  .logo-dot { color: #C49A5A; }
  .logo-sub {
    font-family: 'Lora', serif;
    font-size: 11px;
    font-weight: 400;
    color: #A88060;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    display: block;
    margin-top: -2px;
  }

  /* Buttons */
  .btn-primary {
    background: #3D2B1F;
    color: #FAF7F2;
    border: none;
    padding: 10px 22px;
    font-family: 'Lora', serif;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    letter-spacing: 0.3px;
  }
  .btn-primary:hover { background: #5A3F2E; transform: translateY(-1px); }
  .btn-hero {
    background: #3D2B1F;
    color: #FAF7F2;
    border: none;
    padding: 15px 40px;
    font-family: 'Lora', serif;
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  .btn-hero:hover { background: #5A3F2E; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(61,43,31,0.25); }
  .btn-ghost {
    background: transparent;
    border: 1px solid rgba(61,43,31,0.22);
    color: #3D2B1F;
    padding: 9px 20px;
    font-family: 'Lora', serif;
    font-size: 13px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-ghost:hover { background: rgba(61,43,31,0.05); }
  .btn-send {
    background: #B84A30;
    color: white;
    border: none;
    padding: 12px 30px;
    font-family: 'Lora', serif;
    font-size: 15px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }
  .btn-send:hover { background: #D05030; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(184,74,48,0.3); }
  .btn-upload {
    width: 100%;
    padding: 12px;
    border: 1.5px dashed rgba(61,43,31,0.22);
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    font-family: 'Lora', serif;
    font-size: 13px;
    color: #8B6E4E;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 14px;
  }
  .btn-upload:hover { background: rgba(61,43,31,0.04); border-color: rgba(61,43,31,0.4); }
  .btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
    opacity: 0.4;
    transition: opacity 0.15s;
    font-size: 16px;
  }
  .btn-icon:hover { opacity: 0.9; }

  /* Home */
  .home-view {
    min-height: calc(100vh - 62px);
    overflow: hidden;
    position: relative;
  }
  .steam-bg {
    position: absolute;
    top: 30%;
    left: 0; right: 0;
    height: 200px;
    pointer-events: none;
  }
  .steam-bubble {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(196,154,90,0.22), transparent 70%);
    animation: steamRise 7s ease-in-out infinite;
  }
  .hero {
    text-align: center;
    padding: 72px 32px 48px;
    max-width: 700px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    animation: fadeSlideUp 0.7s ease both;
  }
  .hero-eyebrow {
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: 13px;
    color: #B88048;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    margin-bottom: 22px;
    opacity: 0.9;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(38px, 6.5vw, 64px);
    font-weight: 400;
    line-height: 1.18;
    color: #3D2B1F;
    margin-bottom: 22px;
  }
  .hero-title em { font-style: italic; color: #B8844A; }
  .hero-sub {
    font-size: 17px;
    color: #8B6E4E;
    line-height: 1.85;
    margin-bottom: 38px;
    font-weight: 400;
  }
  .feature-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 36px;
  }
  .pill {
    background: rgba(184,132,74,0.1);
    color: #8B6E4E;
    padding: 6px 16px;
    border-radius: 100px;
    font-size: 12.5px;
    border: 1px solid rgba(184,132,74,0.22);
    letter-spacing: 0.2px;
  }
  .sample-cards-fan {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 24px 0 0;
    gap: 0;
  }
  .fan-card {
    width: 130px;
    height: 90px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 24px rgba(61,43,31,0.13);
    margin: 0 -14px;
    transition: transform 0.2s;
    cursor: pointer;
  }
  .fan-card:hover { transform: translateY(-8px) !important; z-index: 10 !important; }

  /* Themes */
  .themes-view { padding: 40px; max-width: 960px; margin: 0 auto; }
  .section-header { text-align: center; margin-bottom: 40px; animation: fadeSlideUp 0.5s ease; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 400; margin-bottom: 10px; }
  .section-sub { color: #8B6E4E; font-size: 15.5px; line-height: 1.7; }
  .themes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 18px;
  }
  .theme-card {
    border-radius: 14px;
    padding: 30px 18px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 14px rgba(61,43,31,0.07);
    border: 2.5px solid transparent;
    animation: fadeSlideUp 0.4s ease both;
  }
  .theme-card:hover { transform: translateY(-5px); box-shadow: 0 10px 28px rgba(61,43,31,0.14); }
  .theme-card.selected { border-color: var(--accent); }

  /* Editor */
  .editor-layout {
    display: grid;
    grid-template-columns: 272px 1fr 216px;
    height: calc(100vh - 62px);
    overflow: hidden;
  }
  .editor-left {
    border-right: 1px solid rgba(61,43,31,0.09);
    background: white;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .panel-tabs {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 3px;
    padding: 8px;
    background: #FAF7F2;
    border-bottom: 1px solid rgba(61,43,31,0.07);
    flex-shrink: 0;
  }
  .panel-tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 2px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 7px;
    font-size: 17px;
    color: #8B6E4E;
    transition: all 0.15s;
    font-family: 'Lora', serif;
  }
  .panel-tab.active { background: white; color: #3D2B1F; box-shadow: 0 1px 5px rgba(61,43,31,0.1); }
  .panel-tab span.tab-label { font-size: 10.5px; }
  .panel-content { padding: 18px; flex: 1; overflow-y: auto; }

  /* Form fields */
  .field-label {
    display: block;
    font-size: 11px;
    color: #9A7A5A;
    margin-bottom: 6px;
    margin-top: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .field-label:first-child { margin-top: 0; }
  .f-input {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid rgba(61,43,31,0.18);
    border-radius: 6px;
    font-family: 'Lora', serif;
    font-size: 13.5px;
    color: #3D2B1F;
    background: #FAF7F2;
    outline: none;
    transition: border-color 0.15s;
  }
  .f-input:focus { border-color: rgba(61,43,31,0.5); }
  .f-textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid rgba(61,43,31,0.18);
    border-radius: 6px;
    font-family: 'Lora', serif;
    font-size: 13.5px;
    color: #3D2B1F;
    background: #FAF7F2;
    outline: none;
    resize: vertical;
    line-height: 1.65;
    transition: border-color 0.15s;
  }
  .f-textarea:focus { border-color: rgba(61,43,31,0.5); }
  .f-select {
    padding: 7px 10px;
    border: 1px solid rgba(61,43,31,0.18);
    border-radius: 5px;
    font-family: 'Lora', serif;
    font-size: 12.5px;
    background: #FAF7F2;
    color: #3D2B1F;
    outline: none;
    cursor: pointer;
  }
  .f-color {
    width: 38px;
    height: 34px;
    border: 1px solid rgba(61,43,31,0.18);
    border-radius: 5px;
    cursor: pointer;
    padding: 2px;
    background: #FAF7F2;
  }
  .style-row { display: flex; gap: 8px; align-items: flex-end; }
  .style-col { display: flex; flex-direction: column; }
  .sub-label { font-size: 10.5px; color: #9A7A5A; margin-bottom: 4px; letter-spacing: 0.5px; }

  .msg-preview {
    padding: 12px 14px;
    background: #FAF7F2;
    border-radius: 8px;
    margin-top: 12px;
    border: 1px solid rgba(61,43,31,0.1);
    line-height: 1.65;
    animation: fadeSlideUp 0.3s ease;
    word-break: break-word;
  }

  /* Media panels */
  .media-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 7px;
  }
  .media-thumb {
    width: 100%;
    height: 68px;
    object-fit: cover;
    border-radius: 7px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.15s;
    background: #E8DFD0;
  }
  .media-thumb:hover { border-color: rgba(61,43,31,0.4); transform: scale(1.03); }
  .emoji-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
  .emoji-btn {
    padding: 8px 4px;
    font-size: 21px;
    background: #FAF7F2;
    border: 1px solid rgba(61,43,31,0.08);
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.1s;
    display: flex; align-items: center; justify-content: center;
  }
  .emoji-btn:hover { transform: scale(1.2); background: #F0E8DC; }
  .audio-note { font-size: 11.5px; color: #9A7A5A; font-style: italic; text-align: center; margin-top: 12px; line-height: 1.6; }

  /* Canvas */
  .canvas-area {
    background: #EDE6DC;
    background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%),
                      radial-gradient(circle at 70% 70%, rgba(200,180,150,0.2), transparent 60%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 28px;
    overflow-y: auto;
    gap: 18px;
  }
  .card-canvas {
    width: 472px;
    min-height: 350px;
    border-radius: 14px;
    box-shadow: 0 28px 64px rgba(61,43,31,0.22), 0 6px 18px rgba(61,43,31,0.12);
    padding: 34px 36px;
    position: relative;
    animation: cardReveal 0.45s ease both;
    background-size: cover;
  }
  .card-canvas::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
    background: linear-gradient(to bottom right, rgba(255,255,255,0.25), transparent 60%);
    pointer-events: none;
  }
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 22px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(61,43,31,0.1);
    gap: 12px;
  }
  .card-header-emoji { font-size: 30px; line-height: 1; }
  .card-header-name {
    font-family: 'Playfair Display', serif;
    font-size: 19px;
    font-weight: 600;
    line-height: 1.2;
  }
  .card-media-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .card-media-item { position: relative; display: inline-block; }
  .remove-media-btn {
    position: absolute;
    top: -5px; right: -5px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: rgba(61,43,31,0.7);
    color: white;
    border: none;
    font-size: 11px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .card-media-item:hover .remove-media-btn { opacity: 1; }

  .card-empty {
    padding: 40px 16px;
    text-align: center;
    font-family: 'Playfair Display', serif;
    font-style: italic;
    color: rgba(61,43,31,0.32);
    font-size: 15px;
    line-height: 1.8;
  }
  .signer-messages { display: flex; flex-direction: column; gap: 14px; }
  .signer-msg {
    padding: 13px 15px;
    background: rgba(255,255,255,0.55);
    border-radius: 9px;
    position: relative;
    backdrop-filter: blur(4px);
    animation: fadeSlideUp 0.3s ease;
    word-break: break-word;
  }
  .signer-msg:hover .remove-signer-btn { opacity: 0.8; }
  .remove-signer-btn {
    position: absolute;
    top: 6px; right: 8px;
    background: none; border: none;
    font-size: 15px; cursor: pointer;
    color: rgba(61,43,31,0.35);
    line-height: 1;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .signer-attribution {
    font-size: 11.5px;
    margin-top: 6px;
    font-style: italic;
    opacity: 0.65;
  }
  .live-typer {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 18px;
    padding: 8px 14px;
    background: rgba(255,255,255,0.72);
    border-radius: 20px;
    font-size: 12px;
    color: #8B6E4E;
    width: fit-content;
    animation: fadeSlideUp 0.3s ease;
    backdrop-filter: blur(4px);
  }
  .live-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .typing-dots { display: flex; gap: 3px; align-items: center; }
  .typing-dot { width: 4px; height: 4px; border-radius: 50%; background: #9A7A5A; animation: typingBounce 1s ease infinite; }
  .canvas-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 472px;
  }
  .canvas-meta { font-size: 12.5px; color: #9A7A5A; font-style: italic; }

  /* Right Panel */
  .editor-right {
    border-left: 1px solid rgba(61,43,31,0.09);
    background: white;
    padding: 20px;
    overflow-y: auto;
  }
  .sidebar-title { font-family: 'Playfair Display', serif; font-size: 15.5px; margin-bottom: 14px; color: #3D2B1F; }
  .empty-note { font-size: 12.5px; color: #9A7A5A; line-height: 1.7; font-style: italic; }
  .signer-row {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px 10px;
    border-radius: 8px;
    background: #FAF7F2;
    margin-bottom: 7px;
    animation: fadeSlideUp 0.25s ease;
  }
  .signer-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .signer-info { flex: 1; min-width: 0; }
  .signer-name { font-size: 12.5px; font-weight: 600; }
  .signer-preview { font-size: 11.5px; color: #9A7A5A; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .invite-box {
    margin-top: 22px;
    padding: 15px;
    background: linear-gradient(135deg, #FFF8F0, #FAF4EC);
    border-radius: 10px;
    border: 1px solid rgba(184,132,74,0.2);
  }
  .invite-note { font-size: 12px; color: #8B6E4E; line-height: 1.65; }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(40,25,15,0.52);
    backdrop-filter: blur(5px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeSlideUp 0.2s ease;
  }
  .modal {
    background: white;
    border-radius: 18px;
    width: 100%;
    max-width: 476px;
    max-height: 82vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 32px 80px rgba(40,25,15,0.3);
    animation: cardReveal 0.25s ease;
  }
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(61,43,31,0.09);
  }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 400; }
  .close-btn { background: none; border: none; font-size: 22px; cursor: pointer; color: #9A7A5A; line-height: 1; padding: 2px; }
  .modal-tabs {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 3px;
    padding: 8px;
    background: #FAF7F2;
    border-bottom: 1px solid rgba(61,43,31,0.07);
  }
  .modal-tab {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    padding: 8px 2px; border: none; background: transparent; cursor: pointer;
    border-radius: 7px; font-size: 17px; color: #8B6E4E; transition: all 0.15s;
    font-family: 'Lora', serif;
  }
  .modal-tab.active { background: white; color: #3D2B1F; box-shadow: 0 1px 5px rgba(61,43,31,0.1); }
  .modal-tab-label { font-size: 10.5px; }
  .modal-body { padding: 22px 24px; overflow-y: auto; flex: 1; }
  .sent-confirm { text-align: center; padding: 24px 0; animation: sentPop 0.4s ease; }
  .sent-icon { font-size: 52px; display: block; margin-bottom: 14px; }
  .sent-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 400; margin-bottom: 8px; }
  .sent-sub { color: #8B6E4E; font-size: 15px; line-height: 1.6; }
  .modal-section-icon { font-size: 52px; text-align: center; display: block; margin-bottom: 16px; }
  .modal-section-title { font-family: 'Playfair Display', serif; font-size: 19px; text-align: center; margin-bottom: 8px; }
  .modal-section-body { color: #8B6E4E; font-size: 14px; text-align: center; line-height: 1.75; margin-bottom: 22px; }
  .date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-divider { height: 1px; background: rgba(61,43,31,0.08); margin: 18px 0; }

  /* Misc */
  .tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(196,149,90,0.12); color: #8B6E4E;
    padding: 4px 12px; border-radius: 100px;
    font-size: 12px; border: 1px solid rgba(196,149,90,0.22);
  }
`;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Steeped() {
  const [view, setView] = useState("home");
  const [theme, setTheme] = useState(null);
  const [signers, setSigners] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);

  // Text panel state
  const [currentText, setCurrentText] = useState("");
  const [signerName, setSignerName] = useState("");
  const [textColor, setTextColor] = useState("#3D2B1F");
  const [textFont, setTextFont] = useState(FONTS[0].value);
  const [textSize, setTextSize] = useState(15);

  // UI state
  const [activePanel, setActivePanel] = useState("text");
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendTab, setSendTab] = useState("email");
  const [liveTyper, setLiveTyper] = useState(null);
  const [sent, setSent] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  // Send form
  const [form, setForm] = useState({ name: "", to: "", note: "", date: "", time: "" });

  const fileInputRef = useRef(null);

  // Simulate live typing
  useEffect(() => {
    if (view !== "editor") { setLiveTyper(null); return; }
    let timeoutId;
    const scheduleNext = (delay = 8000) => {
      timeoutId = setTimeout(() => {
        const t = LIVE_TYPERS[Math.floor(Math.random() * LIVE_TYPERS.length)];
        setLiveTyper(t);
        timeoutId = setTimeout(() => {
          setLiveTyper(null);
          scheduleNext(6000 + Math.random() * 5000);
        }, 3600);
      }, delay);
    };
    scheduleNext(5000);
    return () => clearTimeout(timeoutId);
  }, [view]);

  const goToEditor = (t) => { setTheme(t); setView("editor"); };
  const addMessage = () => {
    if (!currentText.trim()) return;
    setSigners(p => [...p, { id: Date.now(), name: signerName.trim() || "Anonymous", text: currentText, color: textColor, font: textFont, size: textSize }]);
    setCurrentText("");
  };
  const removeSigner = (id) => setSigners(p => p.filter(s => s.id !== id));
  const addMedia = (item) => setMediaItems(p => [...p, { ...item, id: Date.now() }]);
  const removeMedia = (id) => setMediaItems(p => p.filter(m => m.id !== id));
  const handleUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      const r = new FileReader();
      r.onload = ev => setUploadedPhotos(p => [...p, { id: Date.now() + Math.random(), url: ev.target.result, label: file.name }]);
      r.readAsDataURL(file);
    });
  };
  const handleSend = () => { setSent(true); setTimeout(() => { setSent(false); setShowSendModal(false); }, 2800); };
  const fSet = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  // ─── HOME ─────────────────────────────────────────────────────────────────

  const HomeView = () => (
    <div className="home-view">
      <div className="steam-bg">
        {[0,1,2,3,4].map(i => (
          <div key={i} className="steam-bubble" style={{ width: 60+i*20, height: 60+i*20, left: `${12+i*17}%`, bottom: 0, animationDelay: `${i*1.1}s`, animationDuration: `${6+i*0.8}s` }} />
        ))}
      </div>
      <div className="hero">
        <div className="hero-eyebrow">a little warmth, sent with care</div>
        <h1 className="hero-title">
          Cards <em>brewing</em><br />with kindness
        </h1>
        <p className="hero-sub">
          Create beautiful, heartfelt cards for every occasion.<br />
          Sign together, share warmly, treasure always.
        </p>
        <button className="btn-hero" onClick={() => setView("themes")}>
          Brew a Card <span>→</span>
        </button>
        <div className="feature-pills" style={{ marginTop: 32 }}>
          {["✉️ Email or text", "📅 Schedule sending", "🖋️ Sign together live", "📸 Photos & GIFs", "🖨️ Print or save PDF"].map(f => (
            <span key={f} className="pill">{f}</span>
          ))}
        </div>
      </div>

      <div className="sample-cards-fan" style={{ padding: "10px 0 28px" }}>
        {THEMES.slice(0, 5).map((t, i) => {
          const rotations = [-9, -4, 0, 5, 10];
          const translateY = [4, 2, 0, 2, 4];
          return (
            <div key={t.id} className="fan-card" onClick={() => goToEditor(t)}
              style={{ background: t.bg, transform: `rotate(${rotations[i]}deg) translateY(${translateY[i]}px)`, zIndex: i === 2 ? 5 : i }}>
              <div style={{ fontSize: 26, lineHeight: 1 }}>{t.emoji}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, color: t.accent, marginTop: 7, fontWeight: 600 }}>{t.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ─── THEMES ───────────────────────────────────────────────────────────────

  const ThemesView = () => (
    <div className="themes-view">
      <div className="section-header">
        <h2 className="section-title">Choose your card</h2>
        <p className="section-sub">Every card begins as a warm blank canvas — ready for your words.</p>
      </div>
      <div className="themes-grid">
        {THEMES.map((t, i) => (
          <div key={t.id} className={`theme-card${theme?.id === t.id ? " selected" : ""}`}
            style={{ background: t.bg, "--accent": t.accent, animationDelay: `${i * 0.06}s` }}
            onClick={() => goToEditor(t)}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>{t.emoji}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15.5, fontWeight: 600, color: t.accent }}>{t.name}</div>
            <div style={{ marginTop: 10, fontSize: 15, opacity: 0.35, letterSpacing: 3 }}>
              {t.pattern.slice(0, 3)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── EDITOR ───────────────────────────────────────────────────────────────

  const EditorView = () => {
    if (!theme) return null;
    return (
      <div className="editor-layout">

        {/* ── LEFT PANEL ── */}
        <div className="editor-left">
          <div className="panel-tabs">
            {[
              { id: "text",   icon: "🖋️", label: "Sign"   },
              { id: "photos", icon: "📸", label: "Photos" },
              { id: "gifs",   icon: "✨", label: "GIFs"   },
              { id: "emojis", icon: "😊", label: "Emoji"  },
              { id: "audio",  icon: "🎵", label: "Audio"  },
            ].map(tab => (
              <button key={tab.id} className={`panel-tab${activePanel === tab.id ? " active" : ""}`}
                onClick={() => setActivePanel(tab.id)}>
                <span>{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="panel-content">

            {/* SIGN TAB */}
            {activePanel === "text" && (
              <div>
                <label className="field-label">Your name</label>
                <input className="f-input" placeholder="How should we sign this?" value={signerName} onChange={e => setSignerName(e.target.value)} />

                <label className="field-label">Your message</label>
                <textarea className="f-textarea" rows={4} placeholder="Write something wonderful..." value={currentText} onChange={e => setCurrentText(e.target.value)} />

                <label className="field-label">Text style</label>
                <div className="style-row">
                  <div className="style-col">
                    <span className="sub-label">Font</span>
                    <select className="f-select" value={textFont} onChange={e => setTextFont(e.target.value)}>
                      {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div className="style-col">
                    <span className="sub-label">Size</span>
                    <select className="f-select" value={textSize} onChange={e => setTextSize(Number(e.target.value))}>
                      {[12,13,14,15,16,18,20,22,24].map(s => <option key={s} value={s}>{s}px</option>)}
                    </select>
                  </div>
                  <div className="style-col">
                    <span className="sub-label">Color</span>
                    <input type="color" className="f-color" value={textColor} onChange={e => setTextColor(e.target.value)} />
                  </div>
                </div>

                {currentText && (
                  <div className="msg-preview" style={{ fontFamily: textFont, fontSize: textSize, color: textColor }}>
                    <div>{currentText}</div>
                    {signerName && <div style={{ fontSize: 11.5, marginTop: 7, opacity: 0.6 }}>— {signerName}</div>}
                  </div>
                )}

                <button className="btn-primary" style={{ width: "100%", marginTop: 16 }} onClick={addMessage}>
                  Add to Card
                </button>
              </div>
            )}

            {/* PHOTOS TAB */}
            {activePanel === "photos" && (
              <div>
                <button className="btn-upload" onClick={() => fileInputRef.current?.click()}>
                  <span>📤</span> Upload your own photo
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleUpload} />

                {uploadedPhotos.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, color: "#9A7A5A", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>Your uploads</div>
                    <div className="media-grid" style={{ marginBottom: 16 }}>
                      {uploadedPhotos.map(p => (
                        <img key={p.id} src={p.url} alt={p.label} className="media-thumb"
                          onClick={() => addMedia({ type: "photo", url: p.url })}
                          title={`Add: ${p.label}`} />
                      ))}
                    </div>
                  </>
                )}

                <div style={{ fontSize: 11, color: "#9A7A5A", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>Stock photos</div>
                <div className="media-grid">
                  {STOCK_PHOTOS.map(p => (
                    <img key={p.id} src={p.url} alt={p.label} className="media-thumb"
                      onClick={() => addMedia({ type: "photo", url: p.url })}
                      title={`Add: ${p.label}`} />
                  ))}
                </div>
              </div>
            )}

            {/* GIFS TAB */}
            {activePanel === "gifs" && (
              <div>
                <p style={{ fontSize: 13, color: "#9A7A5A", marginBottom: 14, lineHeight: 1.65 }}>
                  Tap a GIF to add it to your card.
                </p>
                <div className="media-grid">
                  {SAMPLE_GIFS.map(g => (
                    <img key={g.id} src={g.url} alt={g.label} className="media-thumb"
                      style={{ height: 68 }}
                      onClick={() => addMedia({ type: "gif", url: g.url, label: g.label })}
                      onError={e => { e.target.style.background = "#F0E8DC"; e.target.style.opacity = "0.5"; }}
                      title={g.label} />
                  ))}
                </div>
              </div>
            )}

            {/* EMOJIS TAB */}
            {activePanel === "emojis" && (
              <div>
                <p style={{ fontSize: 13, color: "#9A7A5A", marginBottom: 12 }}>Tap to place on the card.</p>
                <div className="emoji-grid">
                  {EMOJIS.map(e => (
                    <button key={e} className="emoji-btn" onClick={() => addMedia({ type: "emoji", content: e })}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AUDIO TAB */}
            {activePanel === "audio" && (
              <div>
                <p style={{ fontSize: 13, color: "#9A7A5A", lineHeight: 1.75, marginBottom: 18 }}>
                  Add a voice message or music clip. It plays when your recipient opens the card.
                </p>
                <button className="btn-upload">🎙️ Record a voice message</button>
                <button className="btn-upload">🎵 Upload an audio clip</button>
                <p className="audio-note">Supported: .mp3, .wav, .m4a (max 5 MB)</p>
              </div>
            )}
          </div>
        </div>

        {/* ── CARD CANVAS ── */}
        <div className="canvas-area">
          <div className="card-canvas" style={{ background: theme.bg }}>

            {/* Header */}
            <div className="card-header">
              <span className="card-header-emoji">{theme.emoji}</span>
              <div className="card-header-name" style={{ color: theme.accent }}>{theme.name}</div>
            </div>

            {/* Media items */}
            {mediaItems.length > 0 && (
              <div className="card-media-row">
                {mediaItems.map(item => (
                  <div key={item.id} className="card-media-item">
                    {item.type === "emoji" ? (
                      <span style={{ fontSize: 28, lineHeight: 1, display: "block", padding: "4px" }}>{item.content}</span>
                    ) : (
                      <img src={item.url} alt="" style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8, display: "block" }} />
                    )}
                    <button className="remove-media-btn" onClick={() => removeMedia(item.id)}>×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {signers.length === 0 && mediaItems.length === 0 && (
              <div className="card-empty">
                Your card is waiting to be filled<br />with warmth and kind words…
              </div>
            )}

            {/* Signer messages */}
            <div className="signer-messages">
              {signers.map(s => (
                <div key={s.id} className="signer-msg">
                  <div style={{ fontFamily: s.font, fontSize: s.size, color: s.color, lineHeight: 1.65 }}>{s.text}</div>
                  {s.name !== "Anonymous" && (
                    <div className="signer-attribution" style={{ fontSize: s.size * 0.75, color: s.color }}>— {s.name}</div>
                  )}
                  <button className="remove-signer-btn" onClick={() => removeSigner(s.id)}>×</button>
                </div>
              ))}
            </div>

            {/* Live typing */}
            {liveTyper && (
              <div className="live-typer">
                <div className="live-dot" style={{ background: liveTyper.color }} />
                <span style={{ color: liveTyper.color, fontWeight: 600 }}>{liveTyper.name}</span>
                <span>is signing</span>
                <div className="typing-dots">
                  {[0,1,2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                </div>
              </div>
            )}
          </div>

          <div className="canvas-actions">
            <span className="canvas-meta">
              {signers.length} signature{signers.length !== 1 ? "s" : ""} · {mediaItems.length} media item{mediaItems.length !== 1 ? "s" : ""}
            </span>
            <button className="btn-send" onClick={() => setShowSendModal(true)}>
              Send this Card →
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="editor-right">
          <h3 className="sidebar-title">Signatures</h3>
          {signers.length === 0
            ? <p className="empty-note">No signatures yet — add yours from the left panel!</p>
            : signers.map(s => (
              <div key={s.id} className="signer-row">
                <div className="signer-dot" style={{ background: s.color }} />
                <div className="signer-info">
                  <div className="signer-name" style={{ color: s.color }}>{s.name}</div>
                  <div className="signer-preview">{s.text}</div>
                </div>
                <button className="btn-icon" onClick={() => removeSigner(s.id)}>×</button>
              </div>
            ))
          }

          <div className="invite-box" style={{ marginTop: signers.length === 0 ? 20 : 18 }}>
            <p className="invite-note">
              🔗 <strong>Invite others to sign</strong> — share a link and watch signatures arrive in real time.
            </p>
            <button className="btn-ghost" style={{ width: "100%", marginTop: 10, fontSize: 12.5 }}>
              Copy invite link
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <h3 className="sidebar-title" style={{ marginBottom: 10 }}>Theme</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: theme.bg, borderRadius: 9 }}>
              <span style={{ fontSize: 20 }}>{theme.emoji}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: theme.accent, fontWeight: 600 }}>{theme.name}</span>
            </div>
            <button className="btn-ghost" style={{ width: "100%", marginTop: 10, fontSize: 12.5 }} onClick={() => setView("themes")}>
              Change theme
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── SEND MODAL ───────────────────────────────────────────────────────────

  const SendModal = () => (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowSendModal(false)}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Send your card</h2>
          <button className="close-btn" onClick={() => setShowSendModal(false)}>×</button>
        </div>

        <div className="modal-tabs">
          {[
            { id: "email",    icon: "✉️",  label: "Email"    },
            { id: "text",     icon: "💬",  label: "Text"     },
            { id: "schedule", icon: "📅",  label: "Schedule" },
            { id: "pdf",      icon: "📄",  label: "PDF"      },
            { id: "print",    icon: "🖨️", label: "Print"    },
          ].map(t => (
            <button key={t.id} className={`modal-tab${sendTab === t.id ? " active" : ""}`} onClick={() => setSendTab(t.id)}>
              <span>{t.icon}</span>
              <span className="modal-tab-label">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="modal-body">
          {sent ? (
            <div className="sent-confirm">
              <span className="sent-icon">✨</span>
              <h3 className="sent-title">Card sent with love!</h3>
              <p className="sent-sub">Your kindness is on its way.<br />May it bring a warm smile.</p>
            </div>
          ) : (
            <>
              {/* EMAIL */}
              {sendTab === "email" && (
                <div>
                  <label className="field-label">Recipient's name</label>
                  <input className="f-input" placeholder="Who is this for?" value={form.name} onChange={fSet("name")} />
                  <label className="field-label">Email address</label>
                  <input className="f-input" placeholder="hello@example.com" value={form.to} onChange={fSet("to")} />
                  <label className="field-label">Personal note (won't appear on the card)</label>
                  <textarea className="f-textarea" rows={3} placeholder="Add a private note…" value={form.note} onChange={fSet("note")} />
                  <button className="btn-send" style={{ width: "100%", marginTop: 14 }} onClick={handleSend}>
                    Send with love ✨
                  </button>
                </div>
              )}

              {/* TEXT */}
              {sendTab === "text" && (
                <div>
                  <label className="field-label">Recipient's name</label>
                  <input className="f-input" placeholder="Who is this for?" value={form.name} onChange={fSet("name")} />
                  <label className="field-label">Phone number</label>
                  <input className="f-input" placeholder="+1 (555) 000-0000" value={form.to} onChange={fSet("to")} />
                  <label className="field-label">Short text message</label>
                  <textarea className="f-textarea" rows={2} placeholder="Tap the link to open your card 💌" value={form.note} onChange={fSet("note")} />
                  <button className="btn-send" style={{ width: "100%", marginTop: 14 }} onClick={handleSend}>
                    Send via Text 💬
                  </button>
                </div>
              )}

              {/* SCHEDULE */}
              {sendTab === "schedule" && (
                <div>
                  <p style={{ color: "#8B6E4E", fontSize: 14, lineHeight: 1.75, marginBottom: 16 }}>
                    Schedule your card to arrive on a special day — we'll deliver it right on time.
                  </p>
                  <label className="field-label">Recipient's name</label>
                  <input className="f-input" placeholder="Who is this for?" value={form.name} onChange={fSet("name")} />
                  <label className="field-label">Email or phone</label>
                  <input className="f-input" placeholder="Where should we send it?" value={form.to} onChange={fSet("to")} />
                  <label className="field-label">Delivery date & time</label>
                  <div className="date-row">
                    <input type="date" className="f-input" value={form.date} onChange={fSet("date")} />
                    <input type="time" className="f-input" value={form.time} onChange={fSet("time")} />
                  </div>
                  <button className="btn-send" style={{ width: "100%", marginTop: 16 }} onClick={handleSend}>
                    Schedule this Card 📅
                  </button>
                </div>
              )}

              {/* PDF */}
              {sendTab === "pdf" && (
                <div style={{ textAlign: "center", paddingTop: 12 }}>
                  <span className="modal-section-icon">📄</span>
                  <h3 className="modal-section-title">Save as PDF</h3>
                  <p className="modal-section-body">
                    Download a beautifully formatted PDF of your card to share, email, or keep forever.
                  </p>
                  <button className="btn-send" style={{ padding: "13px 36px" }} onClick={() => window.print()}>
                    Download PDF
                  </button>
                </div>
              )}

              {/* PRINT */}
              {sendTab === "print" && (
                <div style={{ textAlign: "center", paddingTop: 12 }}>
                  <span className="modal-section-icon">🖨️</span>
                  <h3 className="modal-section-title">Print your card</h3>
                  <p className="modal-section-body">
                    Sometimes the most meaningful thing is a card held in someone's hands. Print and hand-deliver with love.
                  </p>
                  <button className="btn-send" style={{ padding: "13px 36px" }} onClick={() => window.print()}>
                    Print Card
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div className="steeped-app">
      <style>{INJECT_CSS}</style>

      {/* NAV */}
      <nav className="steeped-nav">
        <div onClick={() => setView("home")} style={{ cursor: "pointer" }}>
          <span className="logo">
            Steeped<span className="logo-dot">.</span>
          </span>
          <span className="logo-sub">cards brewing with kindness</span>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {view === "home" && (
            <button className="btn-ghost" onClick={() => setView("themes")}>Create a card</button>
          )}
          {view === "themes" && (
            <button className="btn-ghost" onClick={() => setView("home")}>← Home</button>
          )}
          {view === "editor" && (
            <>
              <button className="btn-ghost" onClick={() => setView("themes")}>← Change theme</button>
              <button className="btn-primary" onClick={() => setShowSendModal(true)}>Send Card</button>
            </>
          )}
        </div>
      </nav>

      {view === "home"   && <HomeView />}
      {view === "themes" && <ThemesView />}
      {view === "editor" && <EditorView />}
      {showSendModal     && <SendModal />}
    </div>
  );
}
