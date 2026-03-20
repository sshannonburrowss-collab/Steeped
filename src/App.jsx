import { useState, useRef, useCallback, useEffect } from "react";
function GiphyPanel({ onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const search = async (q) => {
    if (!q.trim()) {
      // Show trending when empty
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${import.meta.env.VITE_GIPHY_KEY}&limit=12&rating=g`
      );
      const data = await res.json();
      setResults(data.data);
      return;
    }
    setLoading(true);
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${import.meta.env.VITE_GIPHY_KEY}&q=${encodeURIComponent(q)}&limit=12&rating=g`
    );
    const data = await res.json();
    setResults(data.data);
    setLoading(false);
  };

  useEffect(() => { search(""); }, []);

  const handleInput = (e) => {
    setQuery(e.target.value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(e.target.value), 500);
  };

  return (
    <div>
      <input
        className="f-input"
        placeholder="Search GIFs…"
        value={query}
        onChange={handleInput}
        style={{ marginBottom: 12 }}
      />
      {loading && <p style={{ fontSize:12, color:"#9A7A5A", marginBottom:8 }}>Searching…</p>}
      <div className="media-grid">
        {results.map(gif => (
          <img
            key={gif.id}
            src={gif.images.fixed_height_small.url}
            alt={gif.title}
            className="media-thumb"
            style={{ height: 68 }}
            onClick={() => onAdd(gif.images.original.url)}
          />
        ))}
      </div>
      <p style={{ fontSize:10.5, color:"#C0B0A0", marginTop:10, textAlign:"center" }}>
        Powered by GIPHY
      </p>
    </div>
  );
}

const THEMES = [
  { id:"birthday",    name:"Happy Birthday",   emoji:"🎂", accent:"#C0503A", cover:"linear-gradient(145deg,#FFF0E8,#FFD8C0,#FFBFA8)", pattern:["🎈","🎂","🎊","✨"] },
  { id:"holiday",     name:"Happy Holidays",   emoji:"❄️", accent:"#3A6DAA", cover:"linear-gradient(145deg,#EAF2FF,#C8DEFF,#A8C8FF)", pattern:["❄️","⭐","🌟","✨"] },
  { id:"thinking",    name:"Thinking of You",  emoji:"💜", accent:"#7047AA", cover:"linear-gradient(145deg,#F4EEFF,#E0CCFF,#CCB0FF)", pattern:["💫","💜","✨","🌙"] },
  { id:"justbecause", name:"Just Because",     emoji:"🌸", accent:"#BF4A85", cover:"linear-gradient(145deg,#FFF0F8,#FFD0EC,#FFB8E0)", pattern:["🌸","🌺","🌷","💕"] },
  { id:"hugs",        name:"Sending Hugs",     emoji:"🤗", accent:"#B87030", cover:"linear-gradient(145deg,#FFFAF0,#FFE8C0,#FFD090)", pattern:["🤗","💛","🌻","✨"] },
  { id:"congrats",    name:"Congratulations",  emoji:"🎉", accent:"#2A845A", cover:"linear-gradient(145deg,#EEFFF8,#C0FFE0,#98FFC8)", pattern:["🎉","⭐","🎊","🌟"] },
  { id:"thankyou",    name:"Thank You",        emoji:"🙏", accent:"#A85828", cover:"linear-gradient(145deg,#FFF8EC,#FFE4C0,#FFD0A0)", pattern:["🌻","💛","🙏","✨"] },
  { id:"blank",       name:"Just a Card",      emoji:"✉️", accent:"#8B6E4E", cover:"linear-gradient(145deg,#FAF7F2,#F0EAE0,#E8DFD0)", pattern:["✨","💌","🌿","🍃"] },
];

const FONTS = [
  { label:"Playfair",    value:"'Playfair Display', serif" },
  { label:"Lora",        value:"'Lora', serif" },
  { label:"Handwritten", value:"'Dancing Script', cursive" },
  { label:"Literary",    value:"'Crimson Pro', serif" },
];

const EMOJIS = ["❤️","🌹","🎉","✨","🌸","🤗","💫","🌟","🎊","🌺","💕","🥳","🌈","🦋","🌻","💝","🎁","🌙","⭐","💐","😊","🥰","😍","🎶","🍰","🎂","🌷","💌","🫂","☀️","🍵","🌿","🫶","💞","🎈","🪷","🌼","🌊","🦚","🐝","🍀","🌴","🦜","🍋","🫐","🍓","🎵"];

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
  { id:1, url:"https://media.giphy.com/media/26AHONQ79FqaZmQLu/giphy.gif", label:"Warm Hug" },
  { id:2, url:"https://media.giphy.com/media/l4KhQo2MESJkc6G52/giphy.gif", label:"Birthday" },
  { id:3, url:"https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif", label:"Hearts" },
  { id:4, url:"https://media.giphy.com/media/3otPoS81loriI9sO8o/giphy.gif", label:"Sparkles" },
  { id:5, url:"https://media.giphy.com/media/xT9IgG50Lg7russDDy/giphy.gif", label:"Celebrate" },
  { id:6, url:"https://media.giphy.com/media/ycagynlDKKP96/giphy.gif", label:"Flowers" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&family=Dancing+Script:wght@500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes cardIn{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes steamRise{0%{transform:translateY(0) scale(1);opacity:0}20%{opacity:.18}100%{transform:translateY(-140px) scale(1.8);opacity:0}}
@keyframes sentPop{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
@keyframes pageFlip{0%{transform:perspective(1200px) rotateY(-6deg);opacity:.6}100%{transform:perspective(1200px) rotateY(0);opacity:1}}
.app{font-family:'Lora',serif;background:#FAF7F2;color:#3D2B1F;min-height:100vh;}
.nav{display:flex;align-items:center;justify-content:space-between;padding:0 32px;height:62px;border-bottom:1px solid rgba(61,43,31,.09);background:rgba(250,247,242,.97);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;}
.logo{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;cursor:pointer;letter-spacing:-.4px;color:#3D2B1F;user-select:none;}
.logo-dot{color:#C49A5A;}
.logo-sub{font-family:'Lora',serif;font-size:11px;color:#A88060;letter-spacing:1.8px;text-transform:uppercase;display:block;margin-top:-2px;}
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
.msg-preview{padding:12px 14px;background:#FAF7F2;border-radius:8px;margin-top:12px;border:1px solid rgba(61,43,31,.1);line-height:1.65;word-break:break-word;}
.media-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;}
.media-thumb{width:100%;height:68px;object-fit:cover;border-radius:7px;cursor:pointer;border:2px solid transparent;transition:all .15s;background:#E8DFD0;}
.media-thumb:hover{border-color:rgba(61,43,31,.4);transform:scale(1.03);}
.emoji-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;}
.emoji-btn{padding:8px 4px;font-size:21px;background:#FAF7F2;border:1px solid rgba(61,43,31,.08);border-radius:8px;cursor:pointer;transition:transform .1s;display:flex;align-items:center;justify-content:center;}
.emoji-btn:hover{transform:scale(1.2);background:#F0E8DC;}
.canvas-area{background:#E8E0D4;background-image:radial-gradient(circle at 25% 25%,rgba(255,255,255,.4),transparent 55%),radial-gradient(circle at 75% 75%,rgba(180,150,110,.2),transparent 55%);display:flex;flex-direction:column;align-items:center;padding:24px 20px;overflow-y:auto;}
.page-tabs-wrap{display:flex;align-items:center;gap:8px;margin-bottom:18px;flex-wrap:wrap;justify-content:center;}
.page-tab-btn{display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:20px;border:1.5px solid rgba(61,43,31,.18);background:rgba(255,255,255,.6);cursor:pointer;font-family:'Lora',serif;font-size:12.5px;color:#8B6E4E;transition:all .15s;backdrop-filter:blur(6px);}
.page-tab-btn.active{background:white;color:#3D2B1F;border-color:rgba(61,43,31,.35);box-shadow:0 2px 10px rgba(61,43,31,.12);font-weight:500;}
.page-tab-btn:hover:not(.active){background:rgba(255,255,255,.85);}
.page-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.card-wrap{width:500px;animation:pageFlip .35s ease;position:relative;}
/* cover */
.card-cover{width:500px;min-height:380px;border-radius:16px;box-shadow:0 32px 72px rgba(61,43,31,.25),0 6px 18px rgba(61,43,31,.12);overflow:hidden;position:relative;}
.card-cover::before{content:'';position:absolute;inset:0;background:linear-gradient(to bottom right,rgba(255,255,255,.28),transparent 60%);pointer-events:none;z-index:1;}
.cover-canvas{position:relative;width:100%;min-height:380px;padding:20px;user-select:none;}
.cover-corner{position:absolute;font-size:22px;opacity:.32;line-height:1;z-index:0;pointer-events:none;}
/* draggable */
.d-item{position:absolute;cursor:grab;touch-action:none;z-index:10;}
.d-item:active{cursor:grabbing;}
.d-item.sel .d-border{display:block;}
.d-border{display:none;position:absolute;inset:-4px;border:2px dashed rgba(61,43,31,.45);border-radius:6px;pointer-events:none;}
.d-del{position:absolute;top:-11px;right:-11px;width:22px;height:22px;border-radius:50%;background:#3D2B1F;color:white;border:none;font-size:13px;cursor:pointer;display:none;align-items:center;justify-content:center;z-index:20;line-height:1;}
.d-item.sel .d-del{display:flex;}
.d-edit{position:absolute;top:-11px;left:-11px;width:22px;height:22px;border-radius:50%;background:#3D2B1F;color:white;border:none;font-size:11px;cursor:pointer;display:none;align-items:center;justify-content:center;z-index:20;line-height:1;}
.d-item.sel .d-edit{display:flex;}
.d-text{white-space:pre-wrap;word-break:break-word;line-height:1.55;min-width:50px;min-height:1em;outline:none;}
/* signing page */
.card-page{width:500px;min-height:440px;border-radius:16px;box-shadow:0 32px 72px rgba(61,43,31,.22),0 6px 18px rgba(61,43,31,.1);background:white;position:relative;overflow:visible;}
.card-page::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;border-radius:16px 16px 0 0;background:var(--acc,#C0503A);opacity:.7;}
.page-canvas{position:relative;min-height:440px;padding:24px 28px 28px;}
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid rgba(61,43,31,.08);}
.page-num-label{font-size:11px;color:#9A7A5A;letter-spacing:1.5px;text-transform:uppercase;}
.page-del-btn{background:none;border:none;font-size:15px;cursor:pointer;color:rgba(61,43,31,.22);transition:color .15s;padding:2px;}
.page-del-btn:hover{color:rgba(184,74,48,.7);}
.page-empty{padding:40px 16px;text-align:center;font-family:'Playfair Display',serif;font-style:italic;color:rgba(61,43,31,.25);font-size:15px;line-height:1.85;}
.drop-hint{font-size:11px;color:rgba(61,43,31,.28);text-align:center;padding:6px 0 14px;font-style:italic;}
.canvas-footer{display:flex;align-items:center;justify-content:space-between;width:500px;margin-top:18px;}
.canvas-meta{font-size:12px;color:#9A7A5A;font-style:italic;}
.panel-right{border-left:1px solid rgba(61,43,31,.09);background:white;padding:20px;overflow-y:auto;}
.sidebar-title{font-family:'Playfair Display',serif;font-size:15px;margin-bottom:12px;color:#3D2B1F;}
.signer-row{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:8px;background:#FAF7F2;margin-bottom:7px;}
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
.modal-overlay{position:fixed;inset:0;background:rgba(40,25,15,.52);backdrop-filter:blur(5px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
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
.fmt-btn{padding:6px 14px;border-radius:5px;border:1.5px solid rgba(61,43,31,.2);background:transparent;color:#3D2B1F;cursor:pointer;font-size:14px;font-family:serif;transition:all .15s;}
.fmt-btn.on{background:#3D2B1F;color:white;border-color:#3D2B1F;}
`;

const uid = () => Date.now() + Math.random();
const makePage = (num) => ({ id: uid(), num, items: [] });

// ── Draggable Item ────────────────────────────────────────────────────────────
function DItem({ item, selected, onSelect, onDelete, onMove, onTextChange, containerRef }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const off = useRef({ x: 0, y: 0 });
  const [editing, setEditing] = useState(false);
  const textRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (editing) return;
    e.stopPropagation();
    onSelect(item.id);
    dragging.current = true;
    const r = ref.current.getBoundingClientRect();
    off.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    const move = (e) => {
      if (!dragging.current || !containerRef.current) return;
      const c = containerRef.current.getBoundingClientRect();
      onMove(item.id, Math.max(0, e.clientX - c.left - off.current.x), Math.max(0, e.clientY - c.top - off.current.y));
    };
    const up = () => { dragging.current = false; window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }, [editing, item.id, onSelect, onMove, containerRef]);

  const startEdit = (e) => {
    e.stopPropagation();
    setEditing(true);
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.focus();
        const r = document.createRange(); r.selectNodeContents(textRef.current); r.collapse(false);
        const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      }
    }, 40);
  };

  const finishEdit = () => {
    setEditing(false);
    if (textRef.current) onTextChange(item.id, textRef.current.innerText);
  };

  return (
    <div ref={ref} className={`d-item${selected?" sel":""}`}
      style={{ left: item.x, top: item.y, zIndex: selected ? 50 : 10, maxWidth: item.type === "text" ? 320 : item.type === "emoji" ? 64 : 150 }}
      onMouseDown={handleMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}>
      <div className="d-border" />
      <button className="d-del" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>×</button>
      {item.type === "text" && (
        <>
          <button className="d-edit" onClick={startEdit} title="Edit text">✎</button>
          <div ref={textRef} className="d-text"
            contentEditable={editing} suppressContentEditableWarning
            onBlur={finishEdit}
            onKeyDown={(e) => { if (e.key === "Escape") finishEdit(); }}
            style={{ fontFamily: item.font, fontSize: item.size, color: item.color, fontWeight: item.bold ? 700 : 400, fontStyle: item.italic ? "italic" : "normal" }}>
            {item.text}
          </div>
        </>
      )}
      {item.type === "emoji" && <span style={{ fontSize: 36, lineHeight: 1, display: "block" }}>{item.content}</span>}
      {(item.type === "photo" || item.type === "gif") && (
        <img src={item.url} alt="" style={{ width: 130, height: 100, objectFit: "cover", borderRadius: 9, display: "block", boxShadow: "0 3px 12px rgba(61,43,31,.18)" }} onError={(e) => { e.target.style.opacity = ".3"; }} />
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function Steeped() {
  const [view, setView]             = useState("home");
  const [theme, setTheme]           = useState(null);
  const [activePage, setActivePage] = useState(0);
  const [pages, setPages]           = useState([makePage(1)]);
  const [coverItems, setCoverItems] = useState([]);
  const [selCover, setSelCover]     = useState(null);
  const [selPage, setSelPage]       = useState(null);

  // sign form
  const [signerName, setSignerName] = useState("");
  const [msgText, setMsgText]       = useState("");
  const [tColor, setTColor]         = useState("#3D2B1F");
  const [tFont, setTFont]           = useState(FONTS[0].value);
  const [tSize, setTSize]           = useState(15);
  const [tBold, setTBold]           = useState(false);
  const [tItalic, setTItalic]       = useState(false);

  // cover form
  const [covText, setCovText]       = useState("");
  const [covFont, setCovFont]       = useState(FONTS[0].value);
  const [covColor, setCovColor]     = useState("#3D2B1F");
  const [covSize, setCovSize]       = useState(22);
  const [covBold, setCovBold]       = useState(false);
  const [covItalic, setCovItalic]   = useState(false);

  const [activePanel, setActivePanel] = useState("text");
  const [showSend, setShowSend]     = useState(false);
  const [sendTab, setSendTab]       = useState("email");
  const [sent, setSent]             = useState(false);
  const [uploads, setUploads]       = useState([]);
  const [form, setForm]             = useState({ name:"", to:"", note:"", date:"", time:"" });

  const fileRef   = useRef(null);
  const coverRef  = useRef(null);
  const pageRefs  = useRef({});

  const goEditor = (t) => {
    setTheme(t); setView("editor"); setActivePage(0); setPages([makePage(1)]);
    setCoverItems([
      { id: uid(), type:"text", x:70, y:130, text:t.name, font:"'Playfair Display',serif", size:30, color:t.accent, bold:true,  italic:false },
      { id: uid(), type:"text", x:80, y:180, text:"A card made with love ✦", font:"'Lora',serif", size:14, color:t.accent, bold:false, italic:true },
    ]);
  };

  const fSet = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const curPage = activePage > 0 ? pages[activePage - 1] : null;

  // cover helpers
  const addCovText = () => {
    if (!covText.trim()) return;
    setCoverItems(p => [...p, { id:uid(), type:"text", x:60, y:60+p.length*46, text:covText, font:covFont, size:covSize, color:covColor, bold:covBold, italic:covItalic }]);
    setCovText("");
  };
  const addCovMedia = (item) => setCoverItems(p => [...p, { ...item, id:uid(), x:40+(p.length%3)*140, y:60+Math.floor(p.length/3)*120 }]);
  const moveCovItem = useCallback((id,x,y) => setCoverItems(p => p.map(i => i.id===id?{...i,x,y}:i)),[]);
  const delCovItem  = (id) => setCoverItems(p => p.filter(i => i.id!==id));
  const editCovText = (id,text) => setCoverItems(p => p.map(i => i.id===id?{...i,text}:i));

  // page helpers
  const spawnPageItem = (item) => {
    if (activePage === 0) { addCovMedia(item); return; }
    setPages(prev => prev.map((pg,i) => i===activePage-1
      ? { ...pg, items:[...pg.items,{...item,id:uid(),x:20+(pg.items.length%4)*110,y:60+Math.floor(pg.items.length/4)*130}] }
      : pg));
  };
  const movePageItem = useCallback((pgIdx,id,x,y) => {
    setPages(prev => prev.map((pg,i) => i===pgIdx?{...pg,items:pg.items.map(it=>it.id===id?{...it,x,y}:it)}:pg));
  },[]);
  const delPageItem  = (pgIdx,id) => setPages(prev => prev.map((pg,i) => i===pgIdx?{...pg,items:pg.items.filter(it=>it.id!==id)}:pg));
  const editPageText = (pgIdx,id,text) => setPages(prev => prev.map((pg,i) => i===pgIdx?{...pg,items:pg.items.map(it=>it.id===id?{...it,text}:it)}:pg));

  const addSig = () => {
    if (!msgText.trim() || activePage===0) return;
    spawnPageItem({ type:"text", text:msgText, signerName:signerName||"Anonymous", font:tFont, size:tSize, color:tColor, bold:tBold, italic:tItalic });
    setMsgText("");
  };

  const addPage = () => { const p=makePage(pages.length+1); setPages(prev=>[...prev,p]); setActivePage(pages.length+1); };
  const delPage = (idx) => {
    if(pages.length===1)return;
    const u=pages.filter((_,i)=>i!==idx).map((p,i)=>({...p,num:i+1}));
    setPages(u); if(activePage>u.length)setActivePage(u.length);
  };

  const handleUpload = (e) => { Array.from(e.target.files).forEach(f=>{ const r=new FileReader(); r.onload=ev=>setUploads(p=>[...p,{id:uid(),url:ev.target.result,label:f.name}]); r.readAsDataURL(f); }); };
  const doSend = () => { setSent(true); setTimeout(()=>{setSent(false);setShowSend(false);},2800); };
  const desel = () => { setSelCover(null); setSelPage(null); };
  const totalItems = pages.reduce((a,p)=>a+p.items.length,0);

  // ── Media panel (shared) ──
  const MediaPanel = () => (
    <div>
      <button className="btn-upload" onClick={()=>fileRef.current?.click()}>📤 Upload your own photo</button>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleUpload}/>
      {uploads.length>0&&<><div className="sub-label" style={{marginBottom:8}}>Your uploads</div><div className="media-grid" style={{marginBottom:14}}>{uploads.map(p=><img key={p.id} src={p.url} alt={p.label} className="media-thumb" onClick={()=>spawnPageItem({type:"photo",url:p.url})}/>)}</div></>}
      <div className="sub-label" style={{marginBottom:8}}>Stock photos</div>
      <div className="media-grid">{STOCK_PHOTOS.map(p=><img key={p.id} src={p.url} alt={p.label} className="media-thumb" onClick={()=>spawnPageItem({type:"photo",url:p.url})}/>)}</div>
    </div>
  );

  // ── HOME ──
  if(view==="home") return (
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
            {["📖 Multiple signing pages","🎨 Custom cover design","🖋️ Drag & place text anywhere","📸 Photos & GIFs","✉️ Email, text or print"].map(f=><span key={f} className="pill">{f}</span>)}
          </div>
        </div>
        <div className="fan-wrap">{THEMES.slice(0,5).map((t,i)=>{const rots=[-9,-4,0,5,10],ty=[4,2,0,2,4];return <div key={t.id} className="fan-card" onClick={()=>goEditor(t)} style={{background:t.cover,transform:`rotate(${rots[i]}deg) translateY(${ty[i]}px)`,zIndex:i===2?5:i}}><div style={{fontSize:26}}>{t.emoji}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:11,color:t.accent,marginTop:7,fontWeight:600}}>{t.name}</div></div>;})}
        </div>
      </div>
    </div>
  );

  // ── THEMES ──
  if(view==="themes") return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <div onClick={()=>setView("home")} style={{cursor:"pointer"}}><span className="logo">Steeped<span className="logo-dot">.</span></span><span className="logo-sub">cards brewing with kindness</span></div>
        <button className="btn-ghost" onClick={()=>setView("home")}>← Home</button>
      </nav>
      <div className="themes-view">
        <div className="section-header"><h2 className="section-title">Choose your card</h2><p className="section-sub">Each card opens into multiple pages — plenty of room for everyone to sign.</p></div>
        <div className="themes-grid">{THEMES.map((t,i)=>(
          <div key={t.id} className="theme-card" style={{background:t.cover,animationDelay:`${i*.06}s`}} onClick={()=>goEditor(t)}>
            <div style={{fontSize:38,marginBottom:10}}>{t.emoji}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:15.5,fontWeight:600,color:t.accent}}>{t.name}</div>
            <div style={{marginTop:10,fontSize:15,opacity:.3,letterSpacing:3}}>{t.pattern.slice(0,3).join(" ")}</div>
          </div>
        ))}</div>
      </div>
    </div>
  );

  // ── EDITOR ──
  return (
    <div className="app"><style>{CSS}</style>
      <nav className="nav">
        <div onClick={()=>setView("home")} style={{cursor:"pointer"}}><span className="logo">Steeped<span className="logo-dot">.</span></span><span className="logo-sub">cards brewing with kindness</span></div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-ghost" onClick={()=>setView("themes")}>← Themes</button>
          <button className="btn-primary" onClick={()=>setShowSend(true)}>Send Card</button>
        </div>
      </nav>

      <div className="editor-layout">

        {/* LEFT */}
        <div className="panel-left">
          <div className="panel-tabs">
            {[{id:"text",icon:"🖋️",label:"Sign"},{id:"photos",icon:"📸",label:"Photos"},{id:"gifs",icon:"✨",label:"GIFs"},{id:"emojis",icon:"😊",label:"Emoji"},{id:"audio",icon:"🎵",label:"Audio"}].map(t=>(
              <button key={t.id} className={`panel-tab${activePanel===t.id?" active":""}`} onClick={()=>setActivePanel(t.id)}>
                <span>{t.icon}</span><span className="tab-label">{t.label}</span>
              </button>
            ))}
          </div>
          <div className="panel-content">

            {activePanel==="text" && (
              activePage===0 ? (
                /* COVER TEXT TOOL */
                <div>
                  <div style={{padding:"10px 12px",background:"#FFF8F0",borderRadius:8,border:"1px solid rgba(184,132,74,.2)",fontSize:12.5,color:"#8B6E4E",lineHeight:1.7,marginBottom:14}}>
                    🎨 <strong style={{color:"#3D2B1F"}}>Cover editor</strong> — type text below and add it to the cover. Then <strong>drag</strong> it anywhere. Click ✎ to edit words, × to delete.
                  </div>
                  <label className="field-label">Add text</label>
                  <input className="f-input" placeholder="e.g. Happy Birthday, Sarah!" value={covText} onChange={e=>setCovText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCovText()}/>
                  <label className="field-label">Style</label>
                  <div className="style-row">
                    <div className="style-col"><span className="sub-label">Font</span>
                      <select className="f-select" value={covFont} onChange={e=>setCovFont(e.target.value)}>{FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select>
                    </div>
                    <div className="style-col"><span className="sub-label">Size</span>
                      <select className="f-select" value={covSize} onChange={e=>setCovSize(Number(e.target.value))}>{[12,14,16,18,20,22,24,28,32,36,42].map(s=><option key={s} value={s}>{s}px</option>)}</select>
                    </div>
                    <div className="style-col"><span className="sub-label">Color</span>
                      <input type="color" className="f-color" value={covColor} onChange={e=>setCovColor(e.target.value)}/>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:10}}>
                    <button className={`fmt-btn${covBold?" on":""}`} onClick={()=>setCovBold(b=>!b)}><strong>B</strong></button>
                    <button className={`fmt-btn${covItalic?" on":""}`} onClick={()=>setCovItalic(it=>!it)}><em>I</em></button>
                  </div>
                  <button className="btn-primary" style={{width:"100%",marginTop:14}} onClick={addCovText}>Add to Cover</button>
                </div>
              ) : (
                /* SIGNING PAGE TEXT */
                <div>
                  <label className="field-label">Your name</label>
                  <input className="f-input" placeholder="How should we sign this?" value={signerName} onChange={e=>setSignerName(e.target.value)}/>
                  <label className="field-label">Your message</label>
                  <textarea className="f-textarea" rows={4} placeholder="Write something wonderful..." value={msgText} onChange={e=>setMsgText(e.target.value)}/>
                  <label className="field-label">Style</label>
                  <div className="style-row">
                    <div className="style-col"><span className="sub-label">Font</span>
                      <select className="f-select" value={tFont} onChange={e=>setTFont(e.target.value)}>{FONTS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}</select>
                    </div>
                    <div className="style-col"><span className="sub-label">Size</span>
                      <select className="f-select" value={tSize} onChange={e=>setTSize(Number(e.target.value))}>{[12,13,14,15,16,18,20,22,24].map(s=><option key={s} value={s}>{s}px</option>)}</select>
                    </div>
                    <div className="style-col"><span className="sub-label">Color</span>
                      <input type="color" className="f-color" value={tColor} onChange={e=>setTColor(e.target.value)}/>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:10}}>
                    <button className={`fmt-btn${tBold?" on":""}`} onClick={()=>setTBold(b=>!b)}><strong>B</strong></button>
                    <button className={`fmt-btn${tItalic?" on":""}`} onClick={()=>setTItalic(it=>!it)}><em>I</em></button>
                  </div>
                  {msgText&&<div className="msg-preview" style={{fontFamily:tFont,fontSize:tSize,color:tColor,fontWeight:tBold?700:400,fontStyle:tItalic?"italic":"normal",marginTop:12}}><div>{msgText}</div>{signerName&&<div style={{fontSize:tSize*.75,marginTop:6,opacity:.6}}>— {signerName}</div>}</div>}
                  <button className="btn-primary" style={{width:"100%",marginTop:14}} onClick={addSig}>Add to Page {activePage}</button>
                  <div style={{marginTop:10,fontSize:12,color:"#9A7A5A",lineHeight:1.7,fontStyle:"italic"}}>💡 Drag any item on the card to reposition it.</div>
                </div>
              )
            )}

            {activePanel==="photos"&&<MediaPanel/>}

            {activePanel === "gifs" && (
  <GiphyPanel onAdd={(url) => spawnPageItem({ type: "gif", url })} />
)}

            {activePanel==="emojis"&&(
              <div>
                <p style={{fontSize:13,color:"#9A7A5A",marginBottom:12,lineHeight:1.6}}>Tap to place — then drag anywhere!</p>
                <div className="emoji-grid">{EMOJIS.map(e=><button key={e} className="emoji-btn" onClick={()=>spawnPageItem({type:"emoji",content:e})}>{e}</button>)}</div>
              </div>
            )}

            {activePanel==="audio"&&(
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
        <div className="canvas-area" onClick={desel}>

          <div className="page-tabs-wrap" onClick={e=>e.stopPropagation()}>
            <button className={`page-tab-btn${activePage===0?" active":""}`} onClick={()=>setActivePage(0)}>
              <span style={{fontSize:14}}>{theme.emoji}</span> Cover
            </button>
            {pages.map((pg,i)=>(
              <button key={pg.id} className={`page-tab-btn${activePage===i+1?" active":""}`} onClick={()=>setActivePage(i+1)}>
                <div className="page-dot" style={{background:activePage===i+1?theme.accent:"rgba(61,43,31,.25)"}}/>
                Page {pg.num}
                {pg.items.filter(it=>it.type==="text").length>0&&<span style={{background:theme.accent,color:"white",borderRadius:"100px",fontSize:10,padding:"1px 6px"}}>{pg.items.filter(it=>it.type==="text").length}</span>}
              </button>
            ))}
            <button className="page-tab-btn" onClick={e=>{e.stopPropagation();addPage();}}><span style={{fontSize:14}}>＋</span> Add Page</button>
          </div>

          {/* COVER */}
          {activePage===0&&(
            <div className="card-wrap" key="cover" onClick={e=>e.stopPropagation()}>
              <div className="card-cover" style={{background:theme.cover}}>
                {theme.pattern.map((p,i)=><span key={i} className="cover-corner" style={{top:i<2?14:undefined,bottom:i>=2?14:undefined,left:i%2===0?18:undefined,right:i%2===1?18:undefined}}>{p}</span>)}
                <div ref={coverRef} className="cover-canvas" onClick={desel} style={{minHeight:380}}>
                  {coverItems.map(item=>(
                    <DItem key={item.id} item={item} selected={selCover===item.id}
                      onSelect={id=>{setSelCover(id);setSelPage(null);}}
                      onDelete={delCovItem} onMove={moveCovItem} onTextChange={editCovText}
                      containerRef={coverRef}/>
                  ))}
                  {coverItems.length===0&&(
                    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
                      <div style={{fontSize:60,marginBottom:14}}>{theme.emoji}</div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:theme.accent,fontWeight:700}}>{theme.name}</div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{marginTop:12,padding:"10px 14px",background:"rgba(255,255,255,.75)",borderRadius:10,fontSize:12.5,color:"#8B6E4E",lineHeight:1.75,textAlign:"center"}}>
                🎨 Use the <strong>Sign tab ←</strong> to add styled text. <strong>Drag</strong> items to reposition · <strong>✎</strong> to edit · <strong>×</strong> to remove
              </div>
            </div>
          )}

          {/* SIGNING PAGE */}
          {activePage>0&&curPage&&(
            <div className="card-wrap" key={curPage.id} onClick={e=>e.stopPropagation()}>
              <div className="card-page" style={{"--acc":theme.accent}}>
                <div ref={el=>pageRefs.current[activePage-1]=el} className="page-canvas" onClick={desel}>
                  <div className="page-header">
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>{theme.emoji}</span>
                      <span className="page-num-label">Page {curPage.num} of {pages.length}</span>
                    </div>
                    {pages.length>1&&<button className="page-del-btn" onClick={()=>delPage(activePage-1)}>🗑</button>}
                  </div>
                  {curPage.items.length===0&&<div className="page-empty">This page is waiting to be filled<br/>with warm words and kind hearts…</div>}
                  {curPage.items.map(item=>(
                    <DItem key={item.id} item={item} selected={selPage===item.id}
                      onSelect={id=>{setSelPage(id);setSelCover(null);}}
                      onDelete={id=>delPageItem(activePage-1,id)}
                      onMove={(id,x,y)=>movePageItem(activePage-1,id,x,y)}
                      onTextChange={(id,text)=>editPageText(activePage-1,id,text)}
                      containerRef={{current:pageRefs.current[activePage-1]}}/>
                  ))}
                  {curPage.items.length>0&&<div className="drop-hint">Click to select · Drag to move · ✎ edit · × remove</div>}
                </div>
              </div>
              <button className="btn-page-add" onClick={e=>{e.stopPropagation();addPage();}}>
                <span style={{fontSize:18}}>＋</span> Add another signing page
              </button>
            </div>
          )}

          <div className="canvas-footer" onClick={e=>e.stopPropagation()}>
            <span className="canvas-meta">{pages.length} page{pages.length!==1?"s":""} · {coverItems.length} cover · {totalItems} page items</span>
            <button className="btn-send" onClick={()=>setShowSend(true)}>Send this Card →</button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="panel-right">
          <h3 className="sidebar-title">Pages</h3>
          <div className="pages-list">
            <div className={`page-list-item${activePage===0?" active":""}`} onClick={()=>setActivePage(0)}>
              <span style={{fontSize:14}}>{theme.emoji}</span>
              <span className="page-list-name" style={{fontFamily:"'Playfair Display',serif"}}>Cover</span>
              <span className="page-list-count">{coverItems.length} items</span>
            </div>
            {pages.map((pg,i)=>(
              <div key={pg.id} className={`page-list-item${activePage===i+1?" active":""}`} onClick={()=>setActivePage(i+1)}>
                <div className="page-list-dot" style={{background:pg.items.length>0?theme.accent:"rgba(61,43,31,.2)"}}/>
                <span className="page-list-name">Page {pg.num}</span>
                <span className="page-list-count">{pg.items.length} items</span>
              </div>
            ))}
          </div>
          <button className="btn-ghost-sm" style={{width:"100%"}} onClick={addPage}>＋ Add page</button>

          <div style={{marginTop:22}}>
            <h3 className="sidebar-title">Signatures</h3>
            {pages.every(p=>p.items.filter(it=>it.type==="text").length===0)
              ?<p className="empty-note">No signatures yet — be the first!</p>
              :pages.map(pg=>pg.items.filter(it=>it.type==="text").map(s=>(
                <div key={s.id} className="signer-row">
                  <div className="signer-dot" style={{background:s.color}}/>
                  <div className="signer-info">
                    <div className="signer-name" style={{color:s.color}}>{s.signerName||"—"} <span style={{fontWeight:400,fontSize:10.5,color:"#9A7A5A"}}>· p.{pg.num}</span></div>
                    <div className="signer-preview">{s.text}</div>
                  </div>
                </div>
              )))
            }
          </div>

          <div className="invite-box" style={{marginTop:18}}>
            <p className="invite-note">🔗 <strong>Invite others to sign</strong> — share a link so anyone can add their message to any page.</p>
            <button className="btn-ghost" style={{width:"100%",marginTop:10,fontSize:12.5}}>Copy invite link</button>
          </div>
        </div>
      </div>

      {/* SEND MODAL */}
      {showSend&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowSend(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Send your card</h2>
              <button className="close-btn" onClick={()=>setShowSend(false)}>×</button>
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
                    <button className="btn-send" style={{width:"100%",marginTop:14}} onClick={doSend}>Send with love ✨</button>
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
                    <button className="btn-send" style={{width:"100%",marginTop:16}} onClick={doSend}>Schedule this Card 📅</button>
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
