/* ============================================================
   GDSkills Study Helper v1.0
   Private study chatbot for gdskills.pk — visible ONLY to paid/
   enrolled students (the loader snippet enforces this server-side).
   Helps with: course summaries, topic explainers, task/assignment
   guidance, and troubleshooting (video, login, access, payments).
   Bilingual: Roman Urdu (default) + English. No backend.
   ============================================================ */
(function () {
'use strict';

/* ---------- 0. Guards ---------- */
if (window.__gdsLoaded) return;
window.__gdsLoaded = true;
try {
  var _p = window.location.pathname || '';
  if (/\/(cart|checkout|my-account|wp-admin|wp-login)(\/|$)/i.test(_p)) return;
} catch (e) {}

/* Hide the public assistant so paid students see only this helper */
(function hidePublic() {
  var tries = 0;
  var iv = setInterval(function () {
    tries++;
    var b = document.getElementById('gdca-btn');
    var t = document.getElementById('gdca-teaser');
    if (b) b.style.display = 'none';
    if (t) t.style.display = 'none';
    if (tries > 30) clearInterval(iv);
  }, 400);
})();

/* ---------- 1. Styles ---------- */
var CSS = [
'.gds-hidden{display:none!important}',
'#gds-btn{position:fixed;right:18px;bottom:96px;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;z-index:999998;background:linear-gradient(135deg,#14b8a6,#0d9488);box-shadow:0 8px 24px rgba(13,148,136,.45);display:flex;align-items:center;justify-content:center;transition:transform .18s ease;font-family:inherit}',
'#gds-btn:hover{transform:scale(1.07)}',
'#gds-btn svg{width:30px;height:30px;fill:#fff}',
'#gds-btn .gds-dot{position:absolute;top:2px;right:2px;width:13px;height:13px;border-radius:50%;background:#22c55e;border:2.5px solid #fff}',
'#gds-panel{position:fixed;right:18px;bottom:168px;width:382px;max-width:calc(100vw - 28px);height:580px;max-height:calc(100vh - 120px);z-index:999999;background:#f8fafc;border-radius:18px;box-shadow:0 18px 60px rgba(0,0,0,.28);display:flex;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;border:1px solid #e2e8f0}',
'.gds-head{background:linear-gradient(135deg,#0f3b36,#0d9488);color:#fff;padding:13px 14px;display:flex;align-items:center;gap:10px;flex:none}',
'.gds-avatar{width:40px;height:40px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px;color:#0d9488;flex:none}',
'.gds-title{flex:1;min-width:0}',
'.gds-title b{display:block;font-size:14.5px;letter-spacing:.2px}',
'.gds-title span{display:flex;align-items:center;gap:5px;font-size:11.5px;color:#a7f3d0}',
'.gds-title .gds-online{width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block}',
'.gds-iconbtn{background:rgba(255,255,255,.14);border:none;color:#fff;border-radius:8px;font-size:11.5px;font-weight:700;padding:6px 9px;cursor:pointer;letter-spacing:.4px}',
'.gds-iconbtn:hover{background:rgba(255,255,255,.25)}',
'.gds-close{background:none;border:none;color:#e0f2f1;font-size:20px;cursor:pointer;line-height:1;padding:4px}',
'#gds-msgs{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:9px;scroll-behavior:smooth}',
'.gds-msg{max-width:86%;padding:9px 13px;border-radius:15px;font-size:13.8px;line-height:1.55;word-wrap:break-word}',
'.gds-bot{background:#fff;color:#1f2937;border:1px solid #e8eef5;border-radius:15px 15px 15px 5px;align-self:flex-start;box-shadow:0 1px 3px rgba(0,0,0,.05)}',
'.gds-user{background:linear-gradient(135deg,#14b8a6,#0d9488);color:#fff;border-radius:15px 15px 5px 15px;align-self:flex-end}',
'.gds-msg b{font-weight:700}',
'.gds-msg ul{margin:6px 0 2px;padding-left:18px}',
'.gds-msg li{margin:2.5px 0}',
'.gds-linkbtn{display:inline-block;margin:7px 6px 2px 0;padding:8px 15px;border-radius:20px;background:#0d9488;color:#fff!important;text-decoration:none;font-size:13px;font-weight:700}',
'.gds-linkbtn.gds-ghost{background:#fff;color:#0d9488!important;border:1.5px solid #0d9488}',
'.gds-linkbtn:hover{opacity:.92}',
'.gds-typing{align-self:flex-start;background:#fff;border:1px solid #e8eef5;border-radius:15px 15px 15px 5px;padding:11px 15px;display:flex;gap:5px}',
'.gds-typing i{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:gds-blink 1.1s infinite}',
'.gds-typing i:nth-child(2){animation-delay:.18s}.gds-typing i:nth-child(3){animation-delay:.36s}',
'@keyframes gds-blink{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}',
'#gds-chips{flex:none;display:flex;gap:7px;overflow-x:auto;padding:9px 12px;background:#f8fafc;border-top:1px solid #eef2f7;scrollbar-width:none}',
'#gds-chips::-webkit-scrollbar{display:none}',
'.gds-chip{flex:none;background:#fff;border:1.5px solid #99f6e4;color:#0f766e;font-size:12.6px;font-weight:600;padding:7px 13px;border-radius:18px;cursor:pointer;white-space:nowrap}',
'.gds-chip:hover{background:#f0fdfa}',
'.gds-inputrow{flex:none;display:flex;gap:8px;padding:10px 12px;background:#fff;border-top:1px solid #eef2f7}',
'#gds-input{flex:1;border:1.5px solid #e2e8f0;border-radius:22px;padding:10px 15px;font-size:13.8px;outline:none;font-family:inherit}',
'#gds-input:focus{border-color:#0d9488}',
'#gds-send{width:42px;height:42px;flex:none;border:none;border-radius:50%;background:linear-gradient(135deg,#14b8a6,#0d9488);cursor:pointer;display:flex;align-items:center;justify-content:center}',
'#gds-send svg{width:19px;height:19px;fill:#fff}',
'@media (max-width:480px){#gds-panel{right:0;left:0;bottom:0;width:100%;max-width:100%;height:78vh;max-height:78vh;border-radius:18px 18px 0 0}#gds-btn{right:14px;bottom:92px}}'
].join('\n');

function injectCSS() {
  var s = document.createElement('style');
  s.type = 'text/css';
  s.setAttribute('data-gds', '1');
  if (s.styleSheet) { s.styleSheet.cssText = CSS; }
  else { s.appendChild(document.createTextNode(CSS)); }
  document.head.appendChild(s);
}

/* ---------- 2. Knowledge base ---------- */
var WA_NUMBER = '923084962018';
function waLink(text) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text); }

var COURSES = [
{ id:'graphic-design', name:'Graphic Designing Course', duration:'2 Months',
  outline:['Adobe Photoshop','Adobe Illustrator','Canva','Product Designing','Freelancing','7 Days Training: Social Media Designing & Brand Identity','Digital Calligraphy','Digital Art / Illustration','Advance Techniques of Photoshop & Illustrator'],
  keys:['graphic','designing','photoshop','illustrator','design'],
  summary:{ ur:'Ye 2 mah ka mukammal course aap ko zero se professional graphic designer banata hai. Aap Photoshop aur Illustrator mein maharat hasil karein ge, Canva se fast designing, product designing, brand identity aur social media designs banana seekhein ge. Aakhir mein freelancing ka tareeqa bhi sikhaya jata hai taake aap kama saken.',
            en:'This complete 2-month course takes you from zero to professional graphic designer. You will master Photoshop and Illustrator, learn fast designing in Canva, product designing, brand identity and social media designs, and finish with freelancing so you can start earning.' } },
{ id:'mobile-creative', name:'Mobile Creative Pro', duration:'1 Month',
  outline:['Importance of Skills','In-Demand Skills','Graphic Design Beginner Guide','Canva Editing','PixalLab Editing','CapCut Editing','Social Media Management','Freelancing'],
  keys:['mobile','creative','canva','capcut','pixallab'],
  summary:{ ur:'Sirf mobile se seekhne wala 1 mah ka course: Canva aur PixalLab se designing, CapCut se video editing, social media management aur freelancing. Un ke liye best jin ke paas laptop nahi.',
            en:'A 1-month course you can do entirely on mobile: designing in Canva and PixalLab, video editing in CapCut, social media management and freelancing. Best for those without a laptop.' } },
{ id:'compass', name:'The Digital Marketing Compass', duration:'2–3 Hours (Online)', instructor:'Saim Fateh Malik',
  outline:['Foundations of Digital Marketing','Digital Channels: SEO, Content, Social Media, Email, PPC/SEM','Practical Hands-on Application','Analytics & Performance Metrics','Emerging Trends','Marketing Plan Strategy'],
  keys:['digital marketing','marketing','seo','compass','saim'],
  summary:{ ur:'Saim Fateh Malik ka 2–3 ghante ka crash course: digital marketing ki bunyad, SEO, social media, email aur paid ads (PPC/SEM), analytics aur apna marketing plan banana.',
            en:'A 2–3 hour crash course by Saim Fateh Malik: digital marketing foundations, SEO, social media, email and paid ads (PPC/SEM), analytics, and building your own marketing plan.' } },
{ id:'shopify', name:'Local Shopify Dropshipping Business in Pakistan', duration:'Self-paced',
  outline:['Introduction to Local Dropshipping','Market Trends & Product Research','Local Suppliers','Order Fulfillment & Logistics','High-Converting Store','Marketing & Scaling','Social Media & Influencers','Payment & Customer Management','Legal & Financial Considerations','Growth & Optimization'],
  keys:['shopify','dropship','dropshipping','ecommerce','store','business'],
  summary:{ ur:'Pakistan mein apna online store aur dropshipping business shuru karne ka mukammal guide: product research, local suppliers, store banana, orders poore karna, marketing aur scaling — qanooni aur maali pehluon ke sath.',
            en:'The complete guide to starting your online store and dropshipping business in Pakistan: product research, local suppliers, store setup, fulfillment, marketing and scaling — including legal and financial aspects.' } },
{ id:'content-writing', name:'Content Writing Course', duration:'Self-paced', instructor:'Alisha Ali',
  outline:['Content Writing','Basics of SEO','Copy Writing','Academic Writing','Creative Writing','Initiate Earnings','New Earning Platforms'],
  keys:['content writing','writing','copywriting','alisha','blog'],
  summary:{ ur:'Alisha Ali ka course: content writing, SEO writing, copywriting, academic aur creative writing — aur sab se aham, likh kar kamane ke platforms aur tareeqe.',
            en:'By Alisha Ali: content writing, SEO writing, copywriting, academic and creative writing — plus, most importantly, the platforms and methods to earn from your writing.' } },
{ id:'script-writing', name:'Script Writing Basics', duration:'Self-paced', instructor:'Farhat Ishtiaq',
  outline:['Introduction to Script Writing','Finding Your Script Idea','Your Main Character','Script Structure','Screenplay Format','First Draft','Rewriting & Polishing'],
  keys:['script','screenplay','drama','farhat','film'],
  summary:{ ur:'Mashhoor writer Farhat Ishtiaq se seekhein: idea talash karna, kirdaar banana, script ka structure, screenplay format, pehla draft aur polishing — drama ya film ke liye.',
            en:'Learn from renowned writer Farhat Ishtiaq: finding ideas, building characters, script structure, screenplay format, first draft and polishing — for drama or film.' } },
{ id:'art-painting', name:'Art & Painting Course', duration:'Self-paced',
  outline:['Introduction to Art','Basic Drawing','Sketching','Painting: color theory & brushes','Acrylic & Oil Painting','Watercolor & Mixed Media','Landscape & Portrait Painting','Advanced Techniques & Style'],
  keys:['art','painting','paint'],
  summary:{ ur:'Zero se advanced artist tak ka safar: drawing aur shading se shuru karke acrylic, oil aur watercolor painting, portraits, landscapes aur apna style banana — exhibiting aur marketing tak.',
            en:'The journey from zero to advanced artist: starting with drawing and shading, through acrylic, oil and watercolor painting, portraits, landscapes, developing your style — all the way to exhibiting and marketing.' } },
{ id:'acrylic-landscape', name:'Mastering Acrylic Landscape', duration:'4 Weeks (21 Lessons)', instructor:'Maham',
  outline:['Understand your supplies','Color theory, mixing, brush techniques','Sketching, composition, layering, blending','Light/shadow, textures, focal point','Varnishing, photographing, sharing'],
  keys:['acrylic','landscape','maham'],
  summary:{ ur:'Maham ka 4 hafte (21 lessons) ka step-by-step course: acrylic landscape painting — supplies se lekar color mixing, blending, roshni/saya aur varnishing tak.',
            en:'A 4-week (21 lessons) step-by-step course by Maham: acrylic landscape painting — from supplies through color mixing, blending, light/shadow to varnishing.' } },
{ id:'sketching', name:'14 Days Sketching & Coloring', duration:'14 Days (Recorded)', instructor:'Maham Khan',
  outline:['Week 1: sketching basics, lines, shading, 3D shapes, animals, human figure, portraits','Week 2: colour pencils, colour theory, blending, fruit, flowers, landscape, final artwork'],
  keys:['sketch','sketching','coloring','drawing'],
  summary:{ ur:'14 din ka recorded course: pehle hafte sketching ki bunyad (lines, shading, portraits), doosre hafte coloring (theory, blending) aur aakhir mein apna final artwork.',
            en:'A 14-day recorded course: week one covers sketching foundations (lines, shading, portraits), week two covers coloring (theory, blending), ending with your final artwork.' } },
{ id:'beads', name:'From Beads to Beauty', duration:'Workshop', instructor:'Arooj',
  outline:['Jewelry Basics: earrings, chokers, bracelets','Jewelry Business Fundamentals','Resin Art: coating, UV resin, molds'],
  keys:['beads','jewelry','jewellery','resin','arooj'],
  summary:{ ur:'Arooj ka workshop: jewelry banana (earrings, chokers, bracelets), resin art, aur apna jewelry business shuru karne ke usool.',
            en:'A workshop by Arooj: making jewelry (earrings, chokers, bracelets), resin art, and the fundamentals of starting your own jewelry business.' } },
{ id:'candle', name:'Candle Making and Concrete Art', duration:'Workshop', instructor:'Saima',
  outline:['Candle Making: wax types, wicks, fragrances, temperatures, candle types, coloring, packaging, pricing','Concrete Art: materials, mixing, demolding, pigments, sealing, trays/coasters/planters, photography, pricing'],
  keys:['candle','concrete','saima','wax'],
  summary:{ ur:'Saima ka workshop: scented candles banana (wax, wicks, fragrance, packaging) aur concrete art (trays, coasters, planters) — banana se lekar pricing aur selling tak.',
            en:'A workshop by Saima: making scented candles (wax, wicks, fragrance, packaging) and concrete art (trays, coasters, planters) — from crafting to pricing and selling.' } },
{ id:'tajweed', name:'Tajweed Al Quran Course', duration:'7 Weeks', instructor:'Graphy D', langNote:'Urdu',
  outline:['Week 1: Tajweed ki ahmiyat','Week 2–3: Makharij','Week 4: Huroof-e-maddah','Week 5: Noon sakinah ke ahkam','Week 6: Meem ke ahkam, maddaat','Week 7: Waqf ka bayan'],
  keys:['tajweed','quran','islamic'],
  summary:{ ur:'7 hafte ka muft course (Urdu mein): tajweed ke usoolon ke sath Quran ki tilawat — makharij, noon/meem ke ahkam, maddaat aur waqf. Certificate shamil hai.',
            en:'A free 7-week course (in Urdu): Quran recitation with tajweed rules — makharij, noon/meem rules, maddaat and waqf. Includes a certificate.' } }
];

/* --- topic explainers: {c: courseId, keys:[...], ur, en} --- */
var TOPICS = [
{ c:'graphic-design', keys:['layer','layers'], ur:'<b>Layers</b> Photoshop ki bunyad hain — har cheez (text, tasveer, shape) apni alag layer par hoti hai taake aap ek cheez badlein aur baqi kharab na ho. <b>F7</b> se Layers panel kholein; wahan layers ko upar-neeche, hide ya lock kar sakte hain.', en:'<b>Layers</b> are Photoshop\'s foundation — everything (text, image, shape) sits on its own layer so you can edit one thing without breaking the rest. Press <b>F7</b> for the Layers panel to reorder, hide or lock layers.' },
{ c:'graphic-design', keys:['color theory','colour theory','color','rang'], ur:'<b>Color theory:</b> color wheel par jo rang aamne-saamne hon (complementary) woh zyada bold lagte hain, paas wale (analogous) naram. Brand ke liye 2–3 rang chunein aur poori design mein wohi rakhein — zyada rang design ko bikhra dete hain.', en:'<b>Color theory:</b> colors opposite on the wheel (complementary) look bold; neighbours (analogous) look soft. Pick 2–3 brand colors and stay consistent — too many colors make a design messy.' },
{ c:'graphic-design', keys:['typography','font','fonts'], ur:'<b>Typography:</b> heading ke liye bold/display font aur body ke liye simple readable font use karein. Ek design mein 2 se zyada fonts na lagayein, aur Urdu/English mix mein alignment ka khayal rakhein.', en:'<b>Typography:</b> use a bold/display font for headings and a simple readable one for body. Never use more than 2 fonts in one design, and watch alignment in Urdu/English mixes.' },
{ c:'graphic-design', keys:['freelanc','fiverr','upwork','kama'], ur:'<b>Freelancing:</b> Fiverr/Upwork par strong gig banayein — wazeh title, 3 packages, aur portfolio ke 5–6 behtareen samples. Shuru mein chhote orders lein, 5-star reviews jama karein, phir rates barhayein.', en:'<b>Freelancing:</b> build a strong Fiverr/Upwork gig — clear title, 3 packages, 5–6 best portfolio samples. Start with small orders, collect 5-star reviews, then raise rates.' },
{ c:'mobile-creative', keys:['canva'], ur:'<b>Canva:</b> elements ko drag-drop karke design banayein. Brand kit mein apne rang/fonts save karein, aur "Magic Resize" se ek design ko post, story aur banner mein badlein.', en:'<b>Canva:</b> build designs by drag-and-drop. Save your colors/fonts in the brand kit, and use "Magic Resize" to turn one design into a post, story and banner.' },
{ c:'mobile-creative', keys:['capcut','video edit'], ur:'<b>CapCut:</b> clips ko trim karke sequence mein lagayein, transitions halki rakhein, aur captions auto-generate karke parhein — 80% log video baghair awaz dekhte hain.', en:'<b>CapCut:</b> trim clips and sequence them, keep transitions subtle, and auto-generate captions to check them — 80% of people watch video without sound.' },
{ c:'compass', keys:['seo'], ur:'<b>SEO:</b> Google mein upar aane ka fun — sahi keywords title/headings mein, tez website, aur mufeed content. Natija waqt leta hai (2–3 mah) lekin muft traffic deta hai.', en:'<b>SEO:</b> the art of ranking on Google — right keywords in titles/headings, a fast site, useful content. Takes time (2–3 months) but brings free traffic.' },
{ c:'compass', keys:['ppc','sem','paid ads','ads'], ur:'<b>PPC/SEM:</b> Google/Meta ads mein aap har click par paise dete hain. Pehle chhota budget (Rs 500–1000/day) se test karein, jo ad chale usi ko scale karein.', en:'<b>PPC/SEM:</b> with Google/Meta ads you pay per click. Test with a small budget (Rs 500–1000/day) first, then scale only the winning ad.' },
{ c:'compass', keys:['social media'], ur:'<b>Social media marketing:</b> roz ki posting se zyada ahmiyat consistency aur value ki hai. Hafte mein 3–4 mufeed posts + reels, aur comments ka jawab zaroor dein.', en:'<b>Social media marketing:</b> consistency and value beat daily posting. Aim for 3–4 useful posts + reels per week, and always reply to comments.' },
{ c:'shopify', keys:['product research','product'], ur:'<b>Product research:</b> aisi product chunein jiska masla hal ho, wazan halka ho (shipping sasti), aur Pakistan mein asaani se supplier mile. Daraz aur TikTok trends se ideas lein.', en:'<b>Product research:</b> pick a product that solves a problem, is light (cheap shipping), and has an easily available supplier in Pakistan. Get ideas from Daraz and TikTok trends.' },
{ c:'shopify', keys:['supplier'], ur:'<b>Suppliers:</b> local supplier se pehle sample mangwayein — quality check kiye baghair store par na lagayein. 2–3 suppliers rakhein taake stock khatm na ho.', en:'<b>Suppliers:</b> always order a sample from a local supplier first — never list a product you haven\'t quality-checked. Keep 2–3 suppliers so stock never runs out.' },
{ c:'content-writing', keys:['seo'], ur:'<b>SEO writing:</b> keyword ko title, pehle paragraph aur headings mein qudrati tor par likhein — bhara hua (stuffing) nuksan deta hai. 1000+ alfaz ka gehra article chhote se behtar rank karta hai.', en:'<b>SEO writing:</b> place keywords naturally in the title, first paragraph and headings — stuffing hurts. A deep 1000+ word article outranks a thin one.' },
{ c:'content-writing', keys:['copywrit'], ur:'<b>Copywriting:</b> farq yaad rakhein — content <i>maloomat</i> deta hai, copy <i>amal</i> karwati hai (kharido, sign up karo). Har copy mein ek wazeh CTA (call to action) hona chahiye.', en:'<b>Copywriting:</b> remember the difference — content <i>informs</i>, copy makes people <i>act</i> (buy, sign up). Every copy needs one clear CTA (call to action).' },
{ c:'script-writing', keys:['structure'], ur:'<b>3-Act Structure:</b> Act 1 — kirdaar aur duniya ka taaruf; Act 2 — rukawatein aur tension (sab se lamba); Act 3 — climax aur hal. Har scene ko kahani aage barhani chahiye.', en:'<b>3-Act Structure:</b> Act 1 — introduce character and world; Act 2 — obstacles and rising tension (the longest); Act 3 — climax and resolution. Every scene must move the story forward.' },
{ c:'script-writing', keys:['character','kirdaar'], ur:'<b>Character:</b> mazboot kirdaar ka ek wazeh <i>maqsad</i> aur ek <i>kamzori</i> hoti hai. Agar kirdaar kuch chahta nahi, to kahani aage nahi barhti.', en:'<b>Character:</b> a strong character has a clear <i>goal</i> and a <i>flaw</i>. If the character wants nothing, the story goes nowhere.' },
{ c:'art-painting', keys:['shading','shadow','saya'], ur:'<b>Shading:</b> roshni ka rukh tay karein, phir us ke mukhalif samt saya gehra karein. Blending ke liye ungli ki bajaye tissue ya blending stump use karein — saaf kaam milega.', en:'<b>Shading:</b> fix your light direction first, then darken shadows on the opposite side. Blend with tissue or a stump instead of fingers for cleaner work.' },
{ c:'sketching', keys:['proportion'], ur:'<b>Proportions:</b> portrait mein aankhein chehre ke bilkul darmiyan hoti hain — beginners aksar unhein upar bana dete hain. Pehle halki lines se naqsha banayein, phir gehra karein.', en:'<b>Proportions:</b> in a portrait the eyes sit exactly at the face\'s midpoint — beginners often draw them too high. Sketch lightly first, darken later.' },
{ c:'beads', keys:['pric','qeemat'], ur:'<b>Pricing:</b> qeemat = material cost + waqt (hourly rate) + packaging + 20–30% profit. Apne waqt ko muft na samjhein — yehi sab se bari ghalti hai.', en:'<b>Pricing:</b> price = material cost + time (hourly rate) + packaging + 20–30% profit. Never treat your time as free — that\'s the biggest mistake.' },
{ c:'candle', keys:['wax'], ur:'<b>Wax types:</b> soy wax beginners ke liye best (saaf jalti, fragrance achhi pakarti hai); paraffin sasti lekin dhuwaan zyada; beeswax mehngi aur qudrati. Container ke hisab se wick ka size chunein.', en:'<b>Wax types:</b> soy wax is best for beginners (clean burn, holds fragrance well); paraffin is cheap but smoky; beeswax is premium and natural. Match wick size to your container.' },
{ c:'tajweed', keys:['makhraj','makharij'], ur:'<b>Makharij:</b> har harf ke nikalne ki jagah (17 maqamat). Ghalat makhraj se harf badal jata hai aur mani bigar sakta hai — roz 10 minute sirf makharij ki mashq karein.', en:'<b>Makharij:</b> the articulation point of each letter (17 points). A wrong makhraj changes the letter and can distort meaning — practice makharij 10 minutes daily.' },
{ c:'tajweed', keys:['noon','meem','idgham','ikhfa'], ur:'<b>Noon sakinah ke ahkam:</b> izhar (saaf parhna), idgham (milana), iqlab (meem mein badalna), ikhfa (chhupana). Agla harf dekh kar faisla karein — yehi tajweed ki bunyad hai.', en:'<b>Rules of noon sakinah:</b> izhar (clear), idgham (merge), iqlab (change to meem), ikhfa (hide). Decide by looking at the next letter — this is the foundation of tajweed.' }
];

/* --- troubleshooting & study FAQs --- */
var HELP = {
video: { ur:'<b>Video nahi chal rahi?</b><br><ul><li>Internet speed check karein (kam az kam 5 Mbps)</li><li>Doosra browser (Chrome) try karein</li><li>VPN laga ho to band karke dekhein</li><li>Browser cache clear karein</li></ul>Agar phir bhi masla ho to WhatsApp <b>0308-4962018</b> par batayein — konsa course aur konsa lesson hai, ye zaroor likhein.',
         en:'<b>Video not playing?</b><br><ul><li>Check your internet speed (at least 5 Mbps)</li><li>Try another browser (Chrome)</li><li>Turn off any VPN</li><li>Clear browser cache</li></ul>If it persists, message WhatsApp <b>0308-4962018</b> — mention the course and lesson name.' },
access: { ur:'<b>Course access nahi mil raha?</b><br><ul><li>Site par <b>My Account</b> mein login karein aur "My Courses" dekhein</li><li>Payment ke baad access mein <b>1 ghanta</b> (max 24 ghante) lag sakta hai</li><li>Payment ka screenshot WhatsApp <b>0308-4962018</b> par bheja tha? Wahan se confirm karwayein</li></ul>',
          en:'<b>Course access missing?</b><br><ul><li>Log in to <b>My Account</b> on the site and check "My Courses"</li><li>Access can take <b>1 hour</b> (max 24 hours) after payment</li><li>Did you send the payment screenshot to WhatsApp <b>0308-4962018</b>? Confirm there</li></ul>' },
login: { ur:'<b>Login nahi ho raha?</b><br><ul><li>Login page par <b>"Lost your password?"</b> se naya password banayein</li><li>Email ke <b>spam/junk</b> folder mein reset link dekhein</li><li>Email aur password mein koi extra space to nahi aa rahi</li></ul>',
         en:'<b>Can\'t log in?</b><br><ul><li>Use <b>"Lost your password?"</b> on the login page to reset</li><li>Check the <b>spam/junk</b> folder for the reset email</li><li>Make sure there is no extra space in email/password</li></ul>' },
receipt: { ur:'Payment ka <b>screenshot / receipt</b> WhatsApp <b>0308-4962018</b> par bhejein aur apna <b>Order ID</b> zaroor likhein — phir access fori activate ho jayega.',
           en:'Send your payment <b>screenshot / receipt</b> to WhatsApp <b>0308-4962018</b> with your <b>Order ID</b> — access will then be activated quickly.' },
certificate: { ur:'<b>Certificate:</b> course mukammal karne ke baad WhatsApp <b>0308-4962018</b> par apna naam aur course batayein — team aap ko certificate ka tareeqa batayegi.',
               en:'<b>Certificate:</b> after completing the course, message WhatsApp <b>0308-4962018</b> with your name and course — the team will guide you.' },
quiz: { ur:'<b>Quiz / assignment tips:</b><br><ul><li>Pehle poora lesson dobara dekhein/parhein</li><li>Apne alfaz mein jawab likhne ki koshish karein — ratta na lagayein</li><li>Koi sawal samajh na aaye to mujh se poochein ya WhatsApp karein</li></ul>',
        en:'<b>Quiz / assignment tips:</b><br><ul><li>Revisit the full lesson first</li><li>Try answering in your own words — don\'t cram</li><li>If a question confuses you, ask me or WhatsApp us</li></ul>' }
};

/* ---------- 3. Engine ---------- */
var lang = 'ur';
var lastCourse = null;
var myCourses = [];   // KB course objects matched from window.__gdcaMyCourses

function T(o) { return o[lang] || o.en; }
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function norm(s) { return (' ' + (s||'').toLowerCase() + ' ').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' '); }
function has(t, words) { for (var i=0;i<words.length;i++){ if (t.indexOf(' '+words[i]+' ')!==-1) return true; } return false; }

function initMyCourses() {
  var titles = [];
  try { titles = window.__gdcaMyCourses || []; } catch (e) {}
  titles.forEach(function (title) {
    var t = norm(title);
    for (var i=0;i<COURSES.length;i++) {
      var c = COURSES[i], nm = norm(c.name);
      var hit = false;
      for (var k=0;k<c.keys.length;k++){ if (t.indexOf(c.keys[k])!==-1 && c.keys[k].length>4){ hit=true; break; } }
      if (!hit) {
        var words = nm.split(' ');
        var n=0;
        for (var w=0;w<words.length;w++){ if (words[w].length>4 && t.indexOf(' '+words[w]+' ')!==-1) n++; }
        if (n>=2) hit=true;
      }
      if (hit && myCourses.indexOf(c)===-1) myCourses.push(c);
    }
  });
  if (myCourses.length) lastCourse = myCourses[0];
}

function matchCourses(text) {
  var t = norm(text), scored = [];
  for (var i=0;i<COURSES.length;i++) {
    var c=COURSES[i], score=0;
    for (var k=0;k<c.keys.length;k++){ if (t.indexOf(c.keys[k])!==-1) score += (c.keys[k].length>6?3:2); }
    var words = norm(c.name).split(' ');
    for (var w=0;w<words.length;w++){ if (words[w].length>4 && t.indexOf(' '+words[w]+' ')!==-1) score+=2; }
    if (score>0) scored.push({c:c,s:score});
  }
  scored.sort(function(a,b){return b.s-a.s;});
  return scored;
}

var INTENTS = {
  greeting:['salam','assalam','aoa','hello','hi','hey','salaam'],
  my_courses:['mere course','meray course','my courses','kaunse course','enrolled'],
  summary:['summary','khulasa','kholasa','detail mein','tafseel','overview'],
  explain:['samjhao','samjhaen','samjha','explain','matlab','kya hai','kia hai','kaise kaam','how does'],
  task_help:['task','assignment','homework','practice','mashq','project'],
  issue_video:['video nahi','nahi chal','buffer','atak','play nahi'],
  issue_access:['access nahi','course nahi khul','open nahi','my courses nahi','lesson nahi'],
  issue_login:['login nahi','log in nahi','password','logn'],
  issue_receipt:['receipt','screenshot bheja','payment bhej','payment ki'],
  certificate:['certificate','sanad'],
  quiz:['quiz','test','exam','imtihan'],
  contact:['contact','rabta','whatsapp','number','phone','email','human','insan','team','sir se'],
  thanks:['shukriya','thanks','thank','jazak'],
  bye:['allah hafiz','khuda hafiz','bye','alvida']
};

function detectIntent(text) {
  var t = norm(text), best=null, bestScore=0;
  for (var name in INTENTS) {
    var words=INTENTS[name], score=0;
    for (var i=0;i<words.length;i++){ if (t.indexOf(words[i])!==-1) score+=words[i].length; }
    if (score>bestScore){ bestScore=score; best=name; }
  }
  return bestScore>0?best:null;
}

function summaryAnswer(c) {
  var lis = c.outline.map(function(o){return '<li>'+esc(o)+'</li>';}).join('');
  var meta = [];
  if (c.duration) meta.push(esc(c.duration));
  if (c.instructor) meta.push((lang==='ur'?'Instructor: ':'Instructor: ')+esc(c.instructor));
  var h = '<b>'+esc(c.name)+'</b>' + (meta.length?'<br><span style="font-size:12.5px;color:#64748b">'+meta.join(' • ')+'</span>':'') +
    '<br><br>'+T(c.summary)+'<br><br>'+(lang==='ur'?'<b>Is course mein:</b>':'<b>In this course:</b>')+'<ul>'+lis+'</ul>';
  return { html:h, actions:[{label:lang==='ur'?'WhatsApp par Discuss Karein':'Discuss on WhatsApp', url:waLink((lang==='ur'?'Assalam-o-Alaikum! "'+c.name+'" ke hawale se sawal hai.':'Hello! I have a question about "'+c.name+'".')), ghost:true}], chips:helperChips() };
}

function explainAnswer(topic, c) {
  var h = T(topic) + '<br><br><span style="font-size:12.5px;color:#64748b">'+(lang==='ur'?'Course: ':'Course: ')+esc(c.name)+'</span>';
  return { html:h, actions:[], chips:helperChips() };
}

function findTopic(text, course) {
  var t = norm(text);
  var pool = TOPICS.filter(function(x){ return !course || x.c===course.id; });
  var best=null, bestScore=0;
  pool.forEach(function(x){
    var s=0;
    x.keys.forEach(function(k){ if (t.indexOf(k)!==-1) s+=k.length; });
    if (s>bestScore){ bestScore=s; best=x; }
  });
  if (!best && course) {
    var all=TOPICS.filter(function(x){return true;});
    all.forEach(function(x){
      var s=0;
      x.keys.forEach(function(k){ if (t.indexOf(k)!==-1) s+=k.length; });
      if (s>bestScore){ bestScore=s; best=x; }
    });
  }
  if (!best) return null;
  var c = null;
  for (var i=0;i<COURSES.length;i++) if (COURSES[i].id===best.c) c=COURSES[i];
  return { topic:best, course:c };
}

function respond(input) {
  var text=(input||'').trim();
  var matched = matchCourses(text);
  var intent = detectIntent(text);
  var top = matched.length?matched[0]:null;

  /* named course -> set context */
  if (top && top.s>=3) lastCourse = top.c;

  var ctx = lastCourse || (myCourses.length===1?myCourses[0]:null);

  if (intent==='greeting') {
    return { html: greetText(), actions:[], chips:helperChips() };
  }
  if (intent==='my_courses') {
    if (!myCourses.length) {
      var g = lang==='ur' ? 'Aap ke enrolled courses ki list mujhe nahi mili — <b>My Account</b> mein dekhein ya WhatsApp <b>0308-4962018</b> par poochein.'
                          : 'I could not see your enrolled courses — check <b>My Account</b> or ask on WhatsApp <b>0308-4962018</b>.';
      return { html:g, actions:[], chips:helperChips() };
    }
    var lis = myCourses.map(function(c){return '<li><b>'+esc(c.name)+'</b></li>';}).join('');
    var h = (lang==='ur'?'Aap in courses mein enrolled hain:<ul>':'You are enrolled in:<ul>')+lis+'</ul>'+(lang==='ur'?'Kis mein madad chahiye?':'Which one do you need help with?');
    return { html:h, actions:[], chips:helperChips() };
  }
  if (intent==='summary') {
    var sc = top && top.s>=3 ? top.c : ctx;
    if (!sc && myCourses.length>1) {
      var q = lang==='ur'?'Kis course ki summary chahiye?':'Which course summary do you want?';
      return { html:q, actions:myCourses.map(function(c){return{label:c.name,postback:'summary::'+c.id,ghost:true};}), chips:helperChips() };
    }
    if (sc) { lastCourse=sc; return summaryAnswer(sc); }
  }
  var scmd = /^summary::(.+)$/.exec(text);
  if (scmd) {
    for (var i=0;i<COURSES.length;i++) if (COURSES[i].id===scmd[1]) { lastCourse=COURSES[i]; return summaryAnswer(COURSES[i]); }
  }
  if (intent==='explain' || intent==='task_help' || intent==='quiz') {
    var ft = findTopic(text, ctx);
    if (ft) {
      var extra = intent==='task_help'
        ? '<br><br>'+(lang==='ur'?'<b>Task tip:</b> kaam ko chhote steps mein torein, har step par ye concept lagayein, aur phans jayein to screenshot ke sath WhatsApp karein.':'<b>Task tip:</b> break the work into small steps, apply this concept at each step, and if stuck, WhatsApp us with a screenshot.')
        : intent==='quiz'
        ? '<br><br>'+(lang==='ur'?'<b>Quiz tip:</b> apne alfaz mein jawab likhein — concept samajhna ratne se behtar hai.':'<b>Quiz tip:</b> answer in your own words — understanding beats cramming.')
        : '';
      var r = explainAnswer(ft.topic, ft.course);
      r.html += extra;
      return r;
    }
    var guide = intent==='task_help'
      ? (lang==='ur' ? '<b>Task mein madad:</b> pehle batayein — <b>konsa course</b> aur <b>konsa topic/task</b> hai? Phir main step-by-step guide karunga. Masalan: "graphic designing mein layers ka task hai".'
                      : '<b>Task help:</b> first tell me — <b>which course</b> and <b>which topic/task</b>? Then I will guide you step by step. E.g. "layers task in graphic designing".')
      : intent==='quiz'
      ? T(HELP.quiz)
      : (lang==='ur' ? 'Konsa topic samjhau? <b>Course ka naam</b> aur <b>topic</b> likhein — masalan "SEO kya hai" ya "layers samjhao".'
                     : 'Which topic should I explain? Write the <b>course name</b> and <b>topic</b> — e.g. "what is SEO" or "explain layers".');
    return { html:guide, actions:[{label:lang==='ur'?'WhatsApp par Poohein':'Ask on WhatsApp', url:waLink(lang==='ur'?'Assalam-o-Alaikum! Course task mein madad chahiye.':'Hello! I need help with a course task.'), ghost:true}], chips:helperChips() };
  }
  if (intent==='issue_video') return { html:T(HELP.video), actions:waAction(), chips:helperChips() };
  if (intent==='issue_access') return { html:T(HELP.access), actions:waAction(), chips:helperChips() };
  if (intent==='issue_login') return { html:T(HELP.login), actions:waAction(), chips:helperChips() };
  if (intent==='issue_receipt') return { html:T(HELP.receipt), actions:waAction(), chips:helperChips() };
  if (intent==='certificate') return { html:T(HELP.certificate), actions:waAction(), chips:helperChips() };
  if (intent==='contact' || intent==='thanks' || intent==='bye') {
    var m = { contact: lang==='ur'?'Zaroor! WhatsApp <b>0308-4962018</b> par rabta karein — team aap ki madad karegi.':'Of course! Contact us on WhatsApp <b>0308-4962018</b> — the team will help you.',
              thanks: lang==='ur'?'Khush aamdeed! Aur koi sawal ho to hazir hoon.':'You are welcome! I am here if you have more questions.',
              bye: lang==='ur'?'Allah Hafiz! Seekhte rahiye.':'Goodbye! Keep learning.' };
    return { html:m[intent], actions:intent==='contact'?waAction():[], chips:helperChips() };
  }

  /* fallback */
  var fb = lang==='ur'
    ? 'Samajh nahi aaya. Aap ye try karein:<br><ul><li><b>"[course] ki summary"</b> — masalan "graphic designing ki summary"</li><li><b>"[topic] samjhao"</b> — masalan "SEO samjhao"</li><li><b>"video nahi chal rahi"</b> jaisa masla likhein</li></ul>'
    : 'I did not understand. Try:<br><ul><li><b>"summary of [course]"</b> — e.g. "summary of graphic designing"</li><li><b>"explain [topic]"</b> — e.g. "explain SEO"</li><li>Or describe an issue like <b>"video not playing"</b></li></ul>';
  return { html:fb, actions:[], chips:helperChips() };
}

function waAction() {
  return [{ label: lang==='ur'?'WhatsApp par Rabta Karein':'Contact on WhatsApp',
            url: waLink(lang==='ur'?'Assalam-o-Alaikum! Course mein masla hai, madad chahiye.':'Hello! I have an issue with my course, need help.') }];
}

function greetText() {
  var base = lang==='ur'
    ? 'Assalam-o-Alaikum! Main <b>GDSkills Study Helper</b> hoon — sirf students ke liye.<br><br>Main aap ki madad kar sakta hoon:<br><ul><li>Course ki <b>summary</b></li><li>Kisi <b>topic</b> ki wazahat</li><li><b>Task/assignment</b> mein guidance</li><li>Masail: <b>video, login, access</b></li></ul>'
    : 'Hello! I am the <b>GDSkills Study Helper</b> — for students only.<br><br>I can help you with:<br><ul><li>Course <b>summaries</b></li><li><b>Topic</b> explanations</li><li><b>Task/assignment</b> guidance</li><li>Issues: <b>video, login, access</b></li></ul>';
  if (myCourses.length===1) {
    base += lang==='ur' ? 'Aap <b>'+esc(myCourses[0].name)+'</b> mein enrolled hain — isi ke baray mein poochein ya koi aur sawal karein.'
                        : 'You are enrolled in <b>'+esc(myCourses[0].name)+'</b> — ask about it or anything else.';
  } else if (myCourses.length>1) {
    var names = myCourses.map(function(c){return esc(c.name);}).join(', ');
    base += lang==='ur' ? 'Aap ke courses: <b>'+names+'</b>.' : 'Your courses: <b>'+names+'</b>.';
  }
  return base;
}

function helperChips() {
  return lang==='ur'
    ? [{t:'Mere courses',q:'mere courses'},{t:'Course ki summary',q:'course ki summary'},{t:'Task mein madad',q:'task mein madad chahiye'},{t:'Video nahi chal rahi',q:'video nahi chal rahi'}]
    : [{t:'My courses',q:'my courses'},{t:'Course summary',q:'course summary'},{t:'Task help',q:'need help with task'},{t:'Video not playing',q:'video not playing'}];
}

/* ---------- 4. UI ---------- */
var panel, msgsEl, chipsEl, inputEl, opened=false;

function el(tag, cls, html) {
  var d=document.createElement(tag);
  if (cls) d.className=cls;
  if (html!=null) d.innerHTML=html;
  return d;
}

function buildUI() {
  var btn=el('button'); btn.id='gds-btn';
  btn.setAttribute('aria-label','Chat with GDSkills Study Helper');
  btn.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg><span class="gds-dot"></span>';
  document.body.appendChild(btn);

  panel=el('div','gds-hidden'); panel.id='gds-panel';
  panel.setAttribute('role','dialog'); panel.setAttribute('aria-label','GDSkills Study Helper chat');
  var head=el('div','gds-head');
  head.innerHTML='<div class="gds-avatar">S</div>'+
    '<div class="gds-title"><b>GDSkills Study Helper</b><span><i class="gds-online"></i>'+
    (lang==='ur'?'Online — students ke liye':'Online — for students')+'</span></div>'+
    '<button class="gds-iconbtn" id="gds-lang" aria-label="Switch language">EN</button>'+
    '<button class="gds-close" id="gds-x" aria-label="Close chat">&times;</button>';
  panel.appendChild(head);

  msgsEl=el('div'); msgsEl.id='gds-msgs'; panel.appendChild(msgsEl);
  chipsEl=el('div'); chipsEl.id='gds-chips'; panel.appendChild(chipsEl);

  var row=el('div','gds-inputrow');
  inputEl=el('input'); inputEl.id='gds-input';
  inputEl.setAttribute('placeholder', lang==='ur'?'Apna sawal likhein…':'Type your question…');
  inputEl.setAttribute('aria-label','Type your question'); inputEl.setAttribute('autocomplete','off');
  var send=el('button'); send.id='gds-send'; send.setAttribute('aria-label','Send');
  send.innerHTML='<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
  row.appendChild(inputEl); row.appendChild(send); panel.appendChild(row);
  document.body.appendChild(panel);

  function open(){
    opened=true; panel.classList.remove('gds-hidden');
    if(!msgsEl.children.length) greet();
    setTimeout(function(){inputEl.focus();},80);
  }
  function close(){ panel.classList.add('gds-hidden'); }
  btn.addEventListener('click', function(){ if(panel.classList.contains('gds-hidden')) open(); else close(); });
  panel.querySelector('#gds-x').addEventListener('click', close);
  panel.querySelector('#gds-lang').addEventListener('click', function(){
    lang=(lang==='ur')?'en':'ur';
    this.textContent=(lang==='ur')?'EN':'اردو';
    inputEl.setAttribute('placeholder', lang==='ur'?'Apna sawal likhein…':'Type your question…');
    addMsg('bot', lang==='ur'?'Theek hai, ab main <b>Roman Urdu</b> mein jawab dunga.':'OK, I will now reply in <b>English</b>.');
    renderChips(helperChips());
  });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && !panel.classList.contains('gds-hidden')) close(); });

  function doSend(text){
    var v=(text!=null?text:inputEl.value).trim();
    if(!v) return;
    addMsg('user', esc(v)); inputEl.value='';
    showTyping();
    setTimeout(function(){
      hideTyping();
      var r=respond(v);
      addMsg('bot', r.html, r.actions);
      renderChips(r.chips||helperChips());
    },650);
  }
  send.addEventListener('click', function(){doSend();});
  inputEl.addEventListener('keydown', function(e){ if(e.key==='Enter') doSend(); });
  window.__gdsSend=doSend;
  window.__gdsRespond=respond;
}

function greet(){
  showTyping();
  setTimeout(function(){ hideTyping(); addMsg('bot', greetText()); renderChips(helperChips()); },700);
}

function addMsg(who, html, actions){
  var m=el('div','gds-msg gds-'+who, html);
  (actions||[]).forEach(function(a){
    var b;
    if(a.url){ b=el('a','gds-linkbtn'+(a.ghost?' gds-ghost':''), esc(a.label)); b.href=a.url; b.target='_blank'; b.rel='noopener'; }
    else { b=el('a','gds-linkbtn'+(a.ghost?' gds-ghost':''), esc(a.label)); b.href='#';
      b.addEventListener('click', function(e){ e.preventDefault(); window.__gdsSend(a.postback); }); }
    m.appendChild(b);
  });
  msgsEl.appendChild(m); msgsEl.scrollTop=msgsEl.scrollHeight;
}

function renderChips(chips){
  chipsEl.innerHTML='';
  (chips||[]).forEach(function(c){
    var b=el('button','gds-chip', esc(c.t));
    b.addEventListener('click', function(){ window.__gdsSend(c.q); });
    chipsEl.appendChild(b);
  });
  chipsEl.style.display=(chips&&chips.length)?'flex':'none';
}

var typingEl=null;
function showTyping(){ typingEl=el('div','gds-typing','<i></i><i></i><i></i>'); msgsEl.appendChild(typingEl); msgsEl.scrollTop=msgsEl.scrollHeight; }
function hideTyping(){ if(typingEl&&typingEl.parentNode) typingEl.parentNode.removeChild(typingEl); typingEl=null; }

/* ---------- 5. Init ---------- */
function init(){
  if(!document.body){ setTimeout(init,100); return; }
  injectCSS();
  initMyCourses();
  buildUI();
}
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', init); }
else { init(); }

})();
