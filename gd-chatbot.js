/* ============================================================
   GDSkills Chat Assistant v1.0
   Floating help chatbot for gdskills.pk — answers course questions
   (prices, outlines, duration) and guides students to buy.
   Bilingual: Roman Urdu (default) + English. No backend, no cookies
   beyond a tiny localStorage flag. Loads via CDN <script> tag.
   ============================================================ */
(function () {
'use strict';

/* ---------- 0. Guards ---------- */
if (window.__gdcaLoaded) return;
window.__gdcaLoaded = true;
try {
  var _p = window.location.pathname || '';
  if (/\/(cart|checkout|my-account|wp-admin|wp-login)(\/|$)/i.test(_p)) return;
} catch (e) {}

/* ---------- 1. Styles (injected at runtime so LiteSpeed can't strip them) ---------- */
var CSS = [
'.gdca-hidden{display:none!important}',
'#gdca-btn{position:fixed;right:18px;bottom:110px;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;z-index:999998;background:linear-gradient(135deg,#ff9a2e,#f97316);box-shadow:0 8px 24px rgba(249,115,22,.45);display:flex;align-items:center;justify-content:center;transition:transform .18s ease,box-shadow .18s ease;font-family:inherit}',
'#gdca-btn:hover{transform:scale(1.07);box-shadow:0 10px 28px rgba(249,115,22,.6)}',
'#gdca-btn svg{width:30px;height:30px;fill:#fff}',
'#gdca-btn .gdca-dot{position:absolute;top:2px;right:2px;width:13px;height:13px;border-radius:50%;background:#22c55e;border:2.5px solid #fff}',
'#gdca-teaser{position:fixed;right:88px;bottom:126px;z-index:999998;background:#fff;color:#1f2937;font:500 13.5px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;padding:10px 14px;border-radius:14px 14px 4px 14px;box-shadow:0 6px 20px rgba(0,0,0,.16);cursor:pointer;max-width:230px;border:1px solid #f1f5f9}',
'#gdca-panel{position:fixed;right:18px;bottom:182px;width:382px;max-width:calc(100vw - 28px);height:580px;max-height:calc(100vh - 120px);z-index:999999;background:#f8fafc;border-radius:18px;box-shadow:0 18px 60px rgba(0,0,0,.28);display:flex;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;border:1px solid #e2e8f0}',
'.gdca-head{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;padding:13px 14px;display:flex;align-items:center;gap:10px;flex:none}',
'.gdca-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#ff9a2e,#f97316);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px;color:#fff;flex:none}',
'.gdca-title{flex:1;min-width:0}',
'.gdca-title b{display:block;font-size:14.5px;letter-spacing:.2px}',
'.gdca-title span{display:flex;align-items:center;gap:5px;font-size:11.5px;color:#a7f3d0}',
'.gdca-title .gdca-online{width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block}',
'.gdca-iconbtn{background:rgba(255,255,255,.12);border:none;color:#fff;border-radius:8px;font-size:11.5px;font-weight:700;padding:6px 9px;cursor:pointer;letter-spacing:.4px}',
'.gdca-iconbtn:hover{background:rgba(255,255,255,.22)}',
'.gdca-close{background:none;border:none;color:#cbd5e1;font-size:20px;cursor:pointer;line-height:1;padding:4px}',
'#gdca-msgs{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:9px;scroll-behavior:smooth}',
'.gdca-msg{max-width:86%;padding:9px 13px;border-radius:15px;font-size:13.8px;line-height:1.55;word-wrap:break-word}',
'.gdca-bot{background:#fff;color:#1f2937;border:1px solid #e8eef5;border-radius:15px 15px 15px 5px;align-self:flex-start;box-shadow:0 1px 3px rgba(0,0,0,.05)}',
'.gdca-user{background:linear-gradient(135deg,#ff9a2e,#f97316);color:#fff;border-radius:15px 15px 5px 15px;align-self:flex-end}',
'.gdca-msg b{font-weight:700}',
'.gdca-msg ul{margin:6px 0 2px;padding-left:18px}',
'.gdca-msg li{margin:2.5px 0}',
'.gdca-linkbtn{display:inline-block;margin:7px 6px 2px 0;padding:8px 15px;border-radius:20px;background:#f97316;color:#fff!important;text-decoration:none;font-size:13px;font-weight:700}',
'.gdca-linkbtn.gdca-ghost{background:#fff;color:#f97316!important;border:1.5px solid #f97316}',
'.gdca-linkbtn:hover{opacity:.92}',
'.gdca-price{font-size:16px;font-weight:800;color:#15803d}',
'.gdca-oldprice{text-decoration:line-through;color:#94a3b8;font-size:13px;margin-left:6px}',
'.gdca-typing{align-self:flex-start;background:#fff;border:1px solid #e8eef5;border-radius:15px 15px 15px 5px;padding:11px 15px;display:flex;gap:5px}',
'.gdca-typing i{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:gdca-blink 1.1s infinite}',
'.gdca-typing i:nth-child(2){animation-delay:.18s}.gdca-typing i:nth-child(3){animation-delay:.36s}',
'@keyframes gdca-blink{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}',
'#gdca-chips{flex:none;display:flex;gap:7px;overflow-x:auto;padding:9px 12px;background:#f8fafc;border-top:1px solid #eef2f7;scrollbar-width:none}',
'#gdca-chips::-webkit-scrollbar{display:none}',
'.gdca-chip{flex:none;background:#fff;border:1.5px solid #fed7aa;color:#c2410c;font-size:12.6px;font-weight:600;padding:7px 13px;border-radius:18px;cursor:pointer;white-space:nowrap}',
'.gdca-chip:hover{background:#fff7ed}',
'.gdca-inputrow{flex:none;display:flex;gap:8px;padding:10px 12px;background:#fff;border-top:1px solid #eef2f7}',
'#gdca-input{flex:1;border:1.5px solid #e2e8f0;border-radius:22px;padding:10px 15px;font-size:13.8px;outline:none;font-family:inherit}',
'#gdca-input:focus{border-color:#f97316}',
'#gdca-send{width:42px;height:42px;flex:none;border:none;border-radius:50%;background:linear-gradient(135deg,#ff9a2e,#f97316);cursor:pointer;display:flex;align-items:center;justify-content:center}',
'#gdca-send svg{width:19px;height:19px;fill:#fff}',
'@media (max-width:480px){#gdca-panel{right:0;left:0;bottom:0;width:100%;max-width:100%;height:78vh;max-height:78vh;border-radius:18px 18px 0 0}#gdca-btn{right:14px;bottom:104px}#gdca-teaser{right:84px;bottom:118px}}'
].join('\n');

function injectCSS() {
  var s = document.createElement('style');
  s.type = 'text/css';
  s.setAttribute('data-gdca', '1');
  if (s.styleSheet) { s.styleSheet.cssText = CSS; }
  else { s.appendChild(document.createTextNode(CSS)); }
  document.head.appendChild(s);
}

/* ---------- 2. Knowledge base ---------- */
var WA_NUMBER = '923084962018';
var WA_LINK = 'https://wa.me/' + WA_NUMBER + '?text=';

function waLink(text) {
  return WA_LINK + encodeURIComponent(text);
}

/* price: numeric PKR (0 = free). display built from it. */
var COURSES = [
{
  id: 'graphic-design', name: 'Graphic Designing Course',
  url: 'https://gdskills.pk/product/graphic-designing-course/',
  price: 7000, oldPrice: 10000, duration: '2 Months', instructor: '—',
  rating: '5.0 (26 reviews)', cat: 'design', stock: true,
  outline: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva', 'Product Designing', 'Freelancing',
    '7 Days Training: Social Media Designing & Brand Identity', 'Digital Calligraphy',
    'Digital Art / Illustration', 'Advance Techniques of Photoshop & Illustrator'],
  keys: ['graphic', 'designing', 'photoshop', 'illustrator', 'design'],
  blurb: {
    ur: 'Sab se popular course — Photoshop, Illustrator aur freelancing ke sath mukammal graphic designer banein.',
    en: 'Our most popular course — become a complete graphic designer with Photoshop, Illustrator and freelancing.'
  }
},
{
  id: 'mobile-creative', name: 'Mobile Creative Pro',
  url: 'https://gdskills.pk/product/mobile-creative-pro/',
  price: 4500, oldPrice: null, duration: '1 Month', instructor: '—',
  rating: '5.0 (14 reviews)', cat: 'design', stock: true,
  outline: ['Importance of Skills', 'In-Demand Skills', 'Graphic Design Beginner Guide', 'Canva Editing',
    'PixalLab Editing', 'CapCut Editing', 'Social Media Management', 'Freelancing'],
  keys: ['mobile', 'creative', 'canva', 'capcut', 'pixallab', 'video editing', 'social media management'],
  blurb: {
    ur: 'Sirf mobile se graphic designing, video editing aur freelancing seekhein — beginners ke liye best.',
    en: 'Learn graphic designing, video editing and freelancing on just your mobile — perfect for beginners.'
  }
},
{
  id: 'compass', name: 'The Digital Marketing Compass by Saim Fateh Malik',
  url: 'https://gdskills.pk/product/the-digital-marketing-compass-by-saim-fateh-malik/',
  price: 3000, oldPrice: null, duration: '2–3 Hours (Online)', instructor: 'Saim Fateh Malik',
  rating: null, cat: 'marketing', stock: true,
  outline: ['Foundations of Digital Marketing', 'Digital Channels: SEO, Content, Social Media, Email, PPC/SEM',
    'Practical Hands-on Application', 'Analytics & Performance Metrics', 'Emerging Trends', 'Marketing Plan Strategy'],
  keys: ['digital marketing', 'marketing', 'seo', 'ads', 'compass', 'saim'],
  blurb: {
    ur: 'Digital marketing ka mukammal roadmap — SEO, social media aur ads sirf 2–3 ghante mein.',
    en: 'The complete digital marketing roadmap — SEO, social media and ads in just 2–3 hours.'
  }
},
{
  id: 'shopify', name: 'Local Shopify Dropshipping Business in Pakistan',
  url: 'https://gdskills.pk/product/local-shopify-dropshipping-business-in-pakistan/',
  price: 4500, oldPrice: null, duration: '—', instructor: '—',
  rating: null, cat: 'business', stock: true, lifetime: true,
  outline: ['Introduction to Local Dropshipping', 'Market Trends & Product Research',
    'Finding & Building Relationships with Local Suppliers', 'Order Fulfillment, Logistics & Shipping',
    'Building a High-Converting Store', 'Marketing & Scaling (Local Strategies)',
    'Social Media & Influencers for Brand Growth', 'Payment & Customer Management',
    'Legal & Financial Considerations', 'Continuous Growth & Optimization'],
  keys: ['shopify', 'dropship', 'dropshipping', 'ecommerce', 'e-commerce', 'online store', 'online business', 'business', 'store'],
  blurb: {
    ur: 'Pakistan mein ghar baithe apna online store banayein aur local dropshipping business shuru karein.',
    en: 'Build your own online store and start a local dropshipping business from home in Pakistan.'
  }
},
{
  id: 'content-writing', name: 'Content Writing Course by Alisha Ali',
  url: 'https://gdskills.pk/product/content-writing-course-by-alisha-ali/',
  price: 5000, oldPrice: null, duration: '—', instructor: 'Alisha Ali',
  rating: '5.0 (2 reviews)', cat: 'writing', stock: true,
  outline: ['Content Writing', 'Basics of SEO', 'Copy Writing', 'Academic Writing',
    'Creative Writing', 'Initiate Earnings', 'New Earning Platforms'],
  keys: ['content writing', 'writing', 'copywriting', 'copy writing', 'alisha', 'blog'],
  blurb: {
    ur: 'Likhein aur kamayein — content writing, copywriting aur earning platforms ka mukammal course.',
    en: 'Write and earn — the complete course on content writing, copywriting and earning platforms.'
  }
},
{
  id: 'script-writing', name: 'Script Writing Basics: A Course by Farhat Ishtiaq',
  url: 'https://gdskills.pk/product/script-writing-basics-a-course-by-farhat-ishtiaq/',
  price: 13000, oldPrice: null, duration: '—', instructor: 'Farhat Ishtiaq',
  rating: '5.0 (1 review)', cat: 'writing', stock: true,
  outline: ['Introduction to Script Writing', 'Finding Your Script Idea', 'Your Main Character',
    "Your Script's Structure", 'Screenplay Format', 'Writing the First Draft', 'Rewriting & Polishing'],
  keys: ['script', 'screenplay', 'drama', 'farhat', 'ishtiaq', 'film'],
  blurb: {
    ur: 'Mashhoor writer Farhat Ishtiaq se drama/film script likhna seekhein — idea se final draft tak.',
    en: 'Learn drama/film script writing from renowned writer Farhat Ishtiaq — from idea to final draft.'
  }
},
{
  id: 'art-painting', name: 'Art & Painting Course',
  url: 'https://gdskills.pk/product/art-painting-course/',
  price: 6000, oldPrice: null, duration: '—', instructor: '—',
  rating: null, cat: 'art', stock: true,
  outline: ['Introduction to Art (pencil, acrylic, oil mediums)', 'Basic Drawing: shapes, shading, light & shadow',
    'Sketching: portraits, figures, texture', 'Painting: color theory, mixing, brush techniques',
    'Acrylic & Oil: layering, glazing, impasto, knife work', 'Watercolor & Mixed Media',
    'Landscape & Portrait Painting', 'Advanced Techniques: developing your style, exhibiting & marketing'],
  keys: ['art', 'painting', 'paint', 'drawing'],
  blurb: {
    ur: 'Zero se advanced artist banein — drawing, acrylic, oil, watercolor sab kuch ek course mein.',
    en: 'Go from zero to advanced artist — drawing, acrylic, oil and watercolor all in one course.'
  }
},
{
  id: 'acrylic-landscape', name: 'Mastering Acrylic Landscape by Maham',
  url: 'https://gdskills.pk/product/mastering-acrylic-landscape-by-maham/',
  price: 5000, oldPrice: null, duration: '4 Weeks (21 Lessons)', instructor: 'Maham',
  rating: null, cat: 'art', stock: true,
  outline: ['Step 1: Understand your supplies (brushes, surfaces, tools)',
    'Step 2: Master the basics (color theory, mixing, brush techniques)',
    'Step 3: Practice essentials (sketching, composition, layering, blending)',
    'Step 4: Bring it to life (light/shadow, textures, focal point)',
    'Step 5: Seal & share (varnishing, photographing, sharing)'],
  keys: ['acrylic', 'landscape', 'maham'],
  blurb: {
    ur: 'Acrylic landscape painting mein maharat — 4 hafte, 21 lessons, step-by-step.',
    en: 'Master acrylic landscape painting — 4 weeks, 21 lessons, step by step.'
  }
},
{
  id: 'sketching', name: '14 Days Short Course of Sketching & Coloring',
  url: 'https://gdskills.pk/product/14-days-short-course-of-sketching-coloring/',
  price: 4000, oldPrice: null, duration: '14 Days (Recorded Lectures)', instructor: 'Maham Khan',
  rating: null, cat: 'art', stock: true,
  outline: ['Week 1: sketching basics, line & shape practice, texture shading, 3D shapes, animal sketching, human figure, portrait sketching',
    'Week 2: colour pencils intro, colour theory, blending, fruit, flower, landscape drawing, final artwork'],
  keys: ['sketch', 'sketching', 'coloring', 'colouring', 'drawing'],
  blurb: {
    ur: 'Sirf 14 din mein sketching aur coloring — recorded lectures, apni raftaar se seekhein.',
    en: 'Sketching and coloring in just 14 days — recorded lectures, learn at your own pace.'
  }
},
{
  id: 'beads', name: 'From Beads to Beauty by Arooj',
  url: 'https://gdskills.pk/product/from-beads-to-beauty-by-arooj/',
  price: 1900, oldPrice: null, duration: 'Workshop', instructor: 'Arooj',
  rating: null, cat: 'craft', stock: true,
  outline: ['Jewelry Basics: earrings, chokers, bracelets', 'Jewelry Business Fundamentals: start & grow your brand',
    'Resin Art: resin coating, UV resin, molds'],
  keys: ['beads', 'jewelry', 'jewellery', 'resin', 'arooj'],
  blurb: {
    ur: 'Jewelry making aur resin art seekh kar apna business shuru karein — sab se sasta course!',
    en: 'Learn jewelry making and resin art and start your own business — our most affordable course!'
  }
},
{
  id: 'candle', name: 'Candle Making and Concrete Art by Saima',
  url: 'https://gdskills.pk/product/candle-making-and-concrete-art-by-saima/',
  price: 5000, oldPrice: null, duration: 'Workshop', instructor: 'Saima',
  rating: null, cat: 'craft', stock: true,
  outline: ['Candle Making: wax types, wicks, fragrances, temperatures, jar/pillar/dessert/bubble candles, coloring, labels & packaging, pricing',
    'Concrete Art: materials, mixing ratios, demolding & curing, pigments, sealing, trays/coasters/planters, styling & photography, pricing'],
  keys: ['candle', 'concrete', 'saima', 'wax'],
  blurb: {
    ur: 'Scented candles aur concrete art — banana, packaging aur pricing ke sath apna brand banayein.',
    en: 'Scented candles and concrete art — build your brand with making, packaging and pricing.'
  }
},
{
  id: 'tajweed', name: 'Tajweed Al Quran Course',
  url: 'https://gdskills.pk/courses/tajweed-al-quran/',
  price: 0, oldPrice: null, duration: '7 Weeks (7 Lessons, 36 Topics, 3 Quizzes)', instructor: 'Graphy D',
  rating: null, cat: 'islamic', stock: true, free: true, cert: true, langNote: 'Urdu',
  outline: ['Week 1: Tajweed ki ahmiyat, lahn ka bab, taawuz & tasmiya',
    'Week 2: Makharij ka taaruf (Alif–Sheen)', 'Week 3: Makharij (Haa–Noon)',
    'Week 4: Huroof-e-mufakhamah, harakat, sakin, shadd, huroof-e-maddah',
    'Week 5: Qalqalah, huroof-e-leen, noon sakinah ke ahkam',
    'Week 6: Meem ke ahkam, maddaat', 'Week 7: Waqf ka bayan aur deegar masail'],
  keys: ['tajweed', 'quran', 'quraan', 'islamic', 'deeni'],
  blurb: {
    ur: 'Muft course! Tajweed ke sath Quran parhna seekhein — certificate ke sath.',
    en: 'Free course! Learn Quran recitation with Tajweed — includes a certificate.'
  }
},
{
  id: 'tree-workshop', name: '14 Days PRO Tree Guide Workshop',
  url: 'https://gdskills.pk/product/14-days-pro-tree-guide-workshop/',
  price: 3000, oldPrice: null, duration: '14 Days', instructor: '—',
  rating: null, cat: 'art', stock: false,
  outline: ['Pine trees, basic trees, tree with sparrow, golden tree, autumn tree, cherry blossom, tree with swing, winter tree, tree on mountain, purple tree, tree tunnel, lakeside tree, tree with owl, acrylic tree painting'],
  keys: ['tree'],
  blurb: { ur: '', en: '' }
},
{
  id: 'acrylic-sceneries', name: '14 Days Acrylic Sceneries Workshop',
  url: 'https://gdskills.pk/product/14-days-acrylic-sceneries-workshop/',
  price: 3000, oldPrice: null, duration: '14 Days', instructor: '—',
  rating: null, cat: 'art', stock: false,
  outline: ['Forest Theme', 'Calm Theme', 'Dramatic Theme'],
  keys: ['sceneries', 'scenery'],
  blurb: { ur: '', en: '' }
}
];

var CATS = [
  { id: 'design', ur: 'Designing', en: 'Designing' },
  { id: 'art', ur: 'Art & Painting', en: 'Art & Painting' },
  { id: 'marketing', ur: 'Marketing', en: 'Marketing' },
  { id: 'business', ur: 'Business', en: 'Business' },
  { id: 'writing', ur: 'Writing', en: 'Writing' },
  { id: 'craft', ur: 'Crafts', en: 'Crafts' },
  { id: 'islamic', ur: 'Islami Course', en: 'Islamic Course' }
];

function fmtPrice(c) {
  if (c.price === 0) return { ur: '<b>Muft</b> (Free)', en: '<b>Free</b>' };
  return { ur: 'Rs ' + c.price.toLocaleString('en-PK'), en: 'Rs ' + c.price.toLocaleString('en-PK') };
}

/* ---------- 3. Bot engine ---------- */
var lang = 'ur';           // 'ur' = Roman Urdu, 'en' = English
var lastCourse = null;

function T(obj) { return obj[lang] || obj.en; }

function norm(s) {
  return (' ' + (s || '').toLowerCase() + ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ');
}

function has(t, words) {
  for (var i = 0; i < words.length; i++) {
    if (t.indexOf(' ' + words[i] + ' ') !== -1) return true;
  }
  return false;
}

/* --- course matching --- */
function matchCourses(text) {
  var t = norm(text), scored = [];
  for (var i = 0; i < COURSES.length; i++) {
    var c = COURSES[i], score = 0;
    for (var k = 0; k < c.keys.length; k++) {
      if (t.indexOf(c.keys[k]) !== -1) score += (c.keys[k].length > 6 ? 3 : 2);
    }
    var nm = norm(c.name);
    var words = nm.split(' ');
    for (var w = 0; w < words.length; w++) {
      if (words[w].length > 4 && t.indexOf(' ' + words[w] + ' ') !== -1) score += 2;
    }
    if (score > 0) scored.push({ c: c, s: score });
  }
  scored.sort(function (a, b) { return b.s - a.s; });
  return scored;
}

/* --- intents --- */
var INTENTS = {
  greeting: ['salam', 'assalam', 'aoa', 'hello', 'hi', 'hey', 'salaam', 'adaab'],
  courses_list: ['courses', 'course', 'konse', 'kya kya', 'saray', 'sab', 'list', 'offer', 'sikhate', 'sikhatey'],
  buy_how: ['admission', 'buy', 'khareed', 'kharid', 'enroll', 'register', 'admit', 'kaise lun', 'kaise lain', 'lena hai', 'join'],
  payment: ['payment', 'pay', 'easypaisa', 'easy paisa', 'jazzcash', 'jazz cash', 'bank', 'card', 'credit', 'debit', 'paypal', 'skrill', 'paisay bhar', 'fees jama'],
  refund: ['refund', 'wapis', 'wapas', 'return'],
  certificate: ['certificate', 'sanad', 'certification'],
  contact: ['contact', 'rabta', 'rabta', 'whatsapp', 'number', 'phone', 'email', 'call', 'help line', 'helpline'],
  free: ['free', 'muft', 'mufta'],
  discount: ['discount', 'sale', 'offer', 'sasta', 'cheap', 'promo', 'coupon'],
  duration: ['duration', 'kitne din', 'kitna time', 'kitna arsa', 'weeks', 'week', 'month', 'mahina', 'time', 'lamba'],
  outline: ['outline', 'syllabus', 'curriculum', 'modules', 'kya sikh', 'kia sikh', 'topics', 'seekhain', 'seekhein', 'seekho'],
  price_q: ['fee', 'fees', 'price', 'qeemat', 'kimat', 'kitne ka', 'kitnay ka', 'cost', 'charges'],
  thanks: ['shukriya', 'thanks', 'thank', 'mehrbani', 'jazak'],
  bye: ['allah hafiz', 'khuda hafiz', 'bye', 'alvida'],
  agent: ['human', 'insan', 'insaan', 'agent', 'team', 'staff', 'owner', 'sir se', 'mam se', 'banday se', 'kisi se']
};

function detectIntent(text) {
  var t = norm(text);
  var best = null, bestScore = 0;
  for (var name in INTENTS) {
    var words = INTENTS[name], score = 0;
    for (var i = 0; i < words.length; i++) {
      if (t.indexOf(' ' + words[i] + ' ') !== -1 || t.indexOf(words[i]) !== -1) score += words[i].length;
    }
    if (score > bestScore) { bestScore = score; best = name; }
  }
  return bestScore > 0 ? best : null;
}

/* --- message builders --- */
function courseCard(c) {
  var p = fmtPrice(c), out = '';
  out += '<b>' + esc(c.name) + '</b><br>';
  if (c.oldPrice) {
    out += '<span class="gdca-oldprice">Rs ' + c.oldPrice.toLocaleString('en-PK') + '</span>' +
           '<span class="gdca-price">Rs ' + c.price.toLocaleString('en-PK') + '</span>';
  } else {
    out += '<span class="gdca-price">' + T(p) + '</span>';
  }
  var meta = [];
  if (c.duration && c.duration !== '—') meta.push((lang === 'ur' ? 'Duration: ' : 'Duration: ') + esc(c.duration));
  if (c.instructor && c.instructor !== '—') meta.push((lang === 'ur' ? 'Instructor: ' : 'Instructor: ') + esc(c.instructor));
  if (c.rating) meta.push(c.rating);
  if (meta.length) out += '<br><span style="font-size:12.5px;color:#64748b">' + meta.join(' • ') + '</span>';
  if (c.blurb && T(c.blurb)) out += '<br><br>' + T(c.blurb);
  return out;
}

function courseActions(c) {
  var buy = (lang === 'ur' ? 'Yeh Course Lein' : 'Enroll in this Course');
  var more = (lang === 'ur' ? 'Mukammal Outline' : 'Full Outline');
  var wa = (lang === 'ur' ? 'WhatsApp par Poohein' : 'Ask on WhatsApp');
  if (!c.stock) return [];
  return [
    { label: buy, url: c.url },
    { label: more, postback: 'outline::' + c.id, ghost: true },
    { label: wa, url: waLink((lang === 'ur' ? 'Assalam-o-Alaikum! Mujhe "' + c.name + '" course ke baray mein maloomat chahiye.' : 'Hello! I want information about the "' + c.name + '" course.')), ghost: true }
  ];
}

function buySteps(c) {
  if (c && c.price === 0) {
    if (lang === 'ur') {
      return '<b>Muft course mein admission:</b><br><ul>' +
        '<li>Neeche button se course page kholein</li>' +
        '<li><b>Register</b> par click karke free mein enroll karein</li>' +
        '<li>Fori access mil jayega — koi payment nahi!</li></ul>';
    }
    return '<b>Enrolling in the free course:</b><br><ul>' +
      '<li>Open the course page from the button below</li>' +
      '<li>Click <b>Register</b> to enroll for free</li>' +
      '<li>You get instant access — no payment needed!</li></ul>';
  }
  if (lang === 'ur') {
    var s = '<b>Course lene ka tareeqa:</b><br><ul>' +
      '<li>Course page par <b>"Add to cart"</b> dabayein</li>' +
      '<li>Cart mein <b>"Proceed to checkout"</b> par click karein</li>' +
      '<li>Apni details bharein aur <b>bank transfer</b> se payment karein (Order ID reference mein zaroor likhein)</li>' +
      '<li>EasyPaisa / JazzCash / card se dena ho to WhatsApp <b>0308-4962018</b> par rabta karein</li>' +
      '<li>Payment ke <b>1 ghante</b> (ziyada se ziyada 24 ghante) mein course access mil jayega</li></ul>';
    return s;
  }
  return '<b>How to enroll:</b><br><ul>' +
    '<li>Click <b>"Add to cart"</b> on the course page</li>' +
    '<li>Click <b>"Proceed to checkout"</b> in the cart</li>' +
    '<li>Fill your details and pay via <b>bank transfer</b> (mention your Order ID as reference)</li>' +
    '<li>For EasyPaisa / JazzCash / card, contact us on WhatsApp <b>0308-4962018</b></li>' +
    '<li>You get course access within <b>1 hour</b> (max 24 hours) of payment</li></ul>';
}

function faqAnswer(intent) {
  var wa = waLink(lang === 'ur' ? 'Assalam-o-Alaikum! Mujhe GDSkills courses ke baray mein maloomat chahiye.' : 'Hello! I need information about GDSkills courses.');
  var A = {
    payment: {
      ur: '<b>Payment methods:</b><br><ul><li>Website checkout par <b>Direct Bank Transfer</b></li><li><b>EasyPaisa / JazzCash / Debit-Credit Card</b> — WhatsApp 0308-4962018 par rabta karke</li><li><b>International students:</b> PayPal / Skrill ke zariye</li></ul>',
      en: '<b>Payment methods:</b><br><ul><li><b>Direct Bank Transfer</b> on website checkout</li><li><b>EasyPaisa / JazzCash / Debit-Credit Card</b> — contact us on WhatsApp 0308-4962018</li><li><b>International students:</b> via PayPal / Skrill</li></ul>'
    },
    refund: {
      ur: '<b>Refund policy:</b> Agar aap ne course ka koi hissa <b>access nahi kiya</b> aur registration ke <b>3 working days</b> ke andar email se refund mangein to refund mil sakta hai. Course shuru karne ke baad refund nahi hota.',
      en: '<b>Refund policy:</b> A refund is possible only if you <b>never accessed</b> the course and request it by email within <b>3 working days</b> of registration. No refunds once the course is started.'
    },
    certificate: {
      ur: '<b>Certificate:</b> Filhal sirf <b>Tajweed Al Quran</b> course mein certificate ka zikr hai. Baqi courses ke certificate ke liye WhatsApp 0308-4962018 par confirm kar lein.',
      en: '<b>Certificate:</b> Currently only the <b>Tajweed Al Quran</b> course explicitly includes a certificate. Please confirm for other courses on WhatsApp 0308-4962018.'
    },
    contact: {
      ur: '<b>Rabta karein:</b><br><ul><li>WhatsApp (sirf WhatsApp): <b>0308-4962018</b></li><li>Email: <b>info@gdskills.pk</b></li><li>Instagram: @graphyy_d</li></ul>',
      en: '<b>Contact us:</b><br><ul><li>WhatsApp (WhatsApp only): <b>0308-4962018</b></li><li>Email: <b>info@gdskills.pk</b></li><li>Instagram: @graphyy_d</li></ul>'
    },
    free: {
      ur: '<b>Muft course:</b> <b>Tajweed Al Quran Course</b> bilkul free hai — 7 hafte, Urdu mein, certificate ke sath. Registration open hai!',
      en: '<b>Free course:</b> <b>Tajweed Al Quran Course</b> is completely free — 7 weeks, in Urdu, with certificate. Registration is open!'
    },
    discount: {
      ur: '<b>Discount:</b> <b>Graphic Designing Course</b> par sale lagi hai — <span class="gdca-oldprice">Rs 10,000</span> <span class="gdca-price">Rs 7,000</span>! Offer limited hai.',
      en: '<b>Discount:</b> <b>Graphic Designing Course</b> is on sale — <span class="gdca-oldprice">Rs 10,000</span> <span class="gdca-price">Rs 7,000</span>! Limited offer.'
    },
    greeting: {
      ur: 'Walaikum Assalam! Main <b>GDSkills Assistant</b> hoon. Courses, fees ya admission ke baray mein kuch bhi poochein.',
      en: 'Hello! I am the <b>GDSkills Assistant</b>. Ask me anything about courses, fees or admission.'
    },
    thanks: {
      ur: 'Khush aamdeed! Aur koi sawal ho to zaroor poochein.',
      en: 'You are welcome! Feel free to ask if you have any other question.'
    },
    bye: {
      ur: 'Allah Hafiz! Seekhte rahiye, kamate rahiye.',
      en: 'Goodbye! Keep learning, keep earning.'
    },
    agent: {
      ur: 'Zaroor! Hamari team se WhatsApp par rabta karein: <b>0308-4962018</b> — woh aap ki mukammal madad karein ge.',
      en: 'Of course! Contact our team on WhatsApp: <b>0308-4962018</b> — they will help you completely.'
    }
  };
  var a = A[intent] ? T(A[intent]) : '';
  var actions = [];
  if (intent === 'contact' || intent === 'agent') {
    actions.push({ label: lang === 'ur' ? 'WhatsApp Kholein' : 'Open WhatsApp', url: wa });
  }
  if (intent === 'free') {
    var tj = COURSES[11];
    actions.push({ label: lang === 'ur' ? 'Free Course Dekhein' : 'View Free Course', url: tj.url });
  }
  if (intent === 'discount') {
    var gd = COURSES[0];
    actions.push({ label: lang === 'ur' ? 'Sale Wala Course Dekhein' : 'View Course on Sale', url: gd.url });
  }
  return { html: a, actions: actions };
}

/* --- main responder --- */
function respond(input) {
  var text = (input || '').trim();
  var cmds = /^outline::(.+)$/.exec(text);
  if (cmds) {
    var cc = null;
    for (var i = 0; i < COURSES.length; i++) if (COURSES[i].id === cmds[1]) cc = COURSES[i];
    if (cc) { lastCourse = cc; return outlineAnswer(cc); }
  }
  var matched = matchCourses(text);
  var intent = detectIntent(text);
  var top = matched.length ? matched[0] : null;

  /* out-of-stock course asked directly */
  if (top && !top.c.stock && top.s >= 4) {
    lastCourse = top.c;
    var oos = lang === 'ur'
      ? '<b>' + esc(top.c.name) + '</b> filhal <b>out of stock</b> hai aur khareeda nahi ja sakta. Aap yeh similar courses dekh sakte hain:'
      : '<b>' + esc(top.c.name) + '</b> is currently <b>out of stock</b> and cannot be purchased. You may like these similar courses:';
    var sims = COURSES.filter(function (c) { return c.stock && c.cat === top.c.cat; }).slice(0, 3);
    return { html: oos, cards: sims, actions: [], chips: defaultChips() };
  }

  /* course + detail intent (price/duration/outline) */
  if (top && top.s >= 3 && (intent === 'price_q' || intent === 'duration' || intent === 'outline')) {
    lastCourse = top.c;
    if (intent === 'outline') return outlineAnswer(top.c);
    if (intent === 'price_q') return priceAnswer(top.c);
    return durationAnswer(top.c);
  }

  /* multiple courses matched, no clear winner -> disambiguate */
  if (matched.length > 1 && matched[0].s === matched[1].s && matched[0].s >= 3) {
    var list = matched.slice(0, 4).map(function (m) { return m.c; });
    var q = lang === 'ur' ? 'Aap in mein se kis course ke baray mein pooch rahe hain?' : 'Which of these courses are you asking about?';
    return { html: q, cards: list, actions: [], chips: defaultChips() };
  }

  /* single strong course match -> card */
  if (top && top.s >= 3) {
    lastCourse = top.c;
    var extra = intent === 'buy_how' ? '<br><br>' + buySteps(top.c) : '';
    return { html: courseCard(top.c) + extra, actions: courseActions(top.c), chips: courseChips(top.c) };
  }

  /* course context carried over ("iski price?", "duration?") */
  if (lastCourse && (intent === 'price_q' || intent === 'duration' || intent === 'outline' || intent === 'buy_how')) {
    if (intent === 'outline') return outlineAnswer(lastCourse);
    if (intent === 'price_q') return priceAnswer(lastCourse);
    if (intent === 'duration') return durationAnswer(lastCourse);
    return { html: courseCard(lastCourse) + '<br><br>' + buySteps(lastCourse), actions: courseActions(lastCourse), chips: courseChips(lastCourse) };
  }

  /* "sab se sasta course" -> cheapest directly */
  if (has(norm(text), ['sasta', 'sastay', 'cheapest'])) {
    var inS = COURSES.filter(function (c) { return c.stock; })
                     .sort(function (a, b) { return a.price - b.price; });
    var ch = inS[0];
    lastCourse = ch;
    var note = lang === 'ur' ? 'Sab se sasta course yeh hai:' : 'Our most affordable course is:';
    return { html: note + '<br><br>' + courseCard(ch), actions: courseActions(ch), chips: courseChips(ch) };
  }

  /* pure intents */
  if (intent === 'courses_list') return browseAnswer(null);
  if (intent === 'buy_how') {
    return { html: buySteps(null) + '<br>' + (lang === 'ur' ? 'Konsa course lena hai? Neeche se chunein:' : 'Which course do you want? Choose below:'),
             actions: [], chips: browseChips() };
  }
  if (intent === 'payment' || intent === 'refund' || intent === 'certificate' ||
      intent === 'contact' || intent === 'free' || intent === 'discount' ||
      intent === 'greeting' || intent === 'thanks' || intent === 'bye' || intent === 'agent') {
    var fa = faqAnswer(intent);
    return { html: fa.html, actions: fa.actions, chips: defaultChips() };
  }
  /* price list request ("sab ki fees") */
  if (intent === 'price_q') return priceListAnswer();

  /* category detection */
  var catHit = detectCategory(text);
  if (catHit) return browseAnswer(catHit);

  /* fallback */
  var fb = lang === 'ur'
    ? 'Maaf kijiye, main ye samajh nahi paya. Aap course ka <b>naam</b> likhein (masalan "graphic designing"), ya neeche options mein se chunein:'
    : 'Sorry, I did not understand that. Please type a course <b>name</b> (e.g. "graphic designing"), or choose from the options below:';
  return { html: fb, actions: [{ label: lang === 'ur' ? 'WhatsApp par Poohein' : 'Ask on WhatsApp', url: waLink(lang === 'ur' ? 'Assalam-o-Alaikum! Mujhe course ke baray mein sawal hai.' : 'Hello! I have a question about a course.'), ghost: true }],
           chips: defaultChips() };
}

function detectCategory(text) {
  var t = norm(text);
  var map = {
    design: ['design', 'designing'],
    art: ['art', 'paint', 'painting', 'draw', 'sketch'],
    marketing: ['marketing', 'seo'],
    business: ['business', 'shopify', 'ecommerce'],
    writing: ['writing', 'likhna', 'likhai'],
    craft: ['craft', 'candle', 'jewelry', 'jewellery', 'resin'],
    islamic: ['islamic', 'islami', 'deen', 'quran']
  };
  for (var c in map) { if (has(t, map[c])) return c; }
  return null;
}

function outlineAnswer(c) {
  var lis = c.outline.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('');
  var head = lang === 'ur'
    ? '<b>' + esc(c.name) + '</b> ka outline:<ul>' + lis + '</ul>'
    : 'Outline of <b>' + esc(c.name) + '</b>:<ul>' + lis + '</ul>';
  return { html: head, actions: courseActions(c), chips: courseChips(c) };
}

function priceAnswer(c) {
  var p = fmtPrice(c);
  var txt = lang === 'ur'
    ? '<b>' + esc(c.name) + '</b> ki fees <span class="gdca-price">' + T(p) + '</span> hai.' +
      (c.oldPrice ? ' (Pehle Rs ' + c.oldPrice.toLocaleString('en-PK') + ' thi — ab discount par!)' : '')
    : 'The fee for <b>' + esc(c.name) + '</b> is <span class="gdca-price">' + T(p) + '</span>.' +
      (c.oldPrice ? ' (Was Rs ' + c.oldPrice.toLocaleString('en-PK') + ' — now on discount!)' : '');
  return { html: txt + '<br><br>' + (lang === 'ur' ? 'Lena hai to:' : 'To enroll:') + '<br>' + buySteps(c),
           actions: courseActions(c), chips: courseChips(c) };
}

function durationAnswer(c) {
  var d = (c.duration && c.duration !== '—') ? c.duration
    : (lang === 'ur' ? 'site par duration mention nahi — WhatsApp par confirm kar lein' : 'duration is not mentioned on the site — please confirm on WhatsApp');
  var txt = lang === 'ur'
    ? '<b>' + esc(c.name) + '</b> ki duration: <b>' + esc(d) + '</b>'
    : 'Duration of <b>' + esc(c.name) + '</b>: <b>' + esc(d) + '</b>';
  return { html: txt, actions: courseActions(c), chips: courseChips(c) };
}

function priceListAnswer() {
  var inStock = COURSES.filter(function (c) { return c.stock; });
  inStock.sort(function (a, b) { return a.price - b.price; });
  var lis = inStock.map(function (c) {
    var pr = c.price === 0 ? (lang === 'ur' ? 'Muft' : 'Free') : 'Rs ' + c.price.toLocaleString('en-PK');
    return '<li><b>' + esc(c.name) + '</b> — ' + pr + '</li>';
  }).join('');
  var head = lang === 'ur' ? '<b>Sab courses ki fees:</b><ul>' + lis + '</ul>' : '<b>All course fees:</b><ul>' + lis + '</ul>';
  return { html: head, actions: [], chips: defaultChips() };
}

function browseAnswer(catId) {
  var list = COURSES.filter(function (c) { return c.stock && (!catId || c.cat === catId); });
  var label = '';
  if (catId) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === catId) label = T(CATS[i]);
  }
  var head = lang === 'ur'
    ? (label ? '<b>' + label + '</b> courses:' : '<b>Hamare courses:</b> Kisi course par click karein:')
    : (label ? '<b>' + label + '</b> courses:' : '<b>Our courses:</b> Click any course:');
  var actions = list.map(function (c) {
    var pr = c.price === 0 ? (lang === 'ur' ? 'Muft' : 'Free') : 'Rs ' + c.price.toLocaleString('en-PK');
    return { label: c.name + ' — ' + pr, postback: 'outline::' + c.id, ghost: true };
  });
  return { html: head, actions: actions, chips: browseChips() };
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ---------- 4. UI ---------- */
function defaultChips() {
  return lang === 'ur'
    ? [{ t: 'Courses dekhein', q: 'courses' }, { t: 'Sab ki fees', q: 'sab ki fees' },
       { t: 'Admission kaise lein?', q: 'admission kaise lein' }, { t: 'Payment methods', q: 'payment methods' }]
    : [{ t: 'View courses', q: 'courses' }, { t: 'All fees', q: 'all fees' },
       { t: 'How to enroll?', q: 'how to enroll' }, { t: 'Payment methods', q: 'payment methods' }];
}
function browseChips() {
  return CATS.map(function (c) { return { t: T(c), q: T(c) }; });
}
function courseChips(c) {
  return lang === 'ur'
    ? [{ t: 'Fees', q: c.name + ' ki fees' }, { t: 'Duration', q: c.name + ' duration' },
       { t: 'Outline', q: c.name + ' ka outline' }, { t: 'Kaise khareedun?', q: 'admission kaise lein' }]
    : [{ t: 'Fee', q: c.name + ' fee' }, { t: 'Duration', q: c.name + ' duration' },
       { t: 'Outline', q: c.name + ' outline' }, { t: 'How to buy?', q: 'how to enroll' }];
}

var panel, msgsEl, chipsEl, inputEl, opened = false;

function el(tag, cls, html) {
  var d = document.createElement(tag);
  if (cls) d.className = cls;
  if (html != null) d.innerHTML = html;
  return d;
}

function buildUI() {
  /* floating button */
  var btn = el('button');
  btn.id = 'gdca-btn';
  btn.setAttribute('aria-label', 'Chat with GDSkills Assistant');
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.14 2 11.25c0 2.92 1.56 5.54 4 7.32V22l3.5-1.94c.83.23 1.65.35 2.5.35 5.52 0 10-4.14 10-9.25S17.52 2 12 2zm-1.2 12.6l-2.7-2.85 1.15-1.2 1.55 1.65 3.9-4.2 1.15 1.2-5.05 5.4z"/></svg><span class="gdca-dot"></span>';
  document.body.appendChild(btn);

  /* teaser */
  var teaser = el('div', 'gdca-hidden');
  teaser.id = 'gdca-teaser';
  teaser.textContent = lang === 'ur' ? 'Sawal hai? Mujhse poochein!' : 'Have a question? Ask me!';
  document.body.appendChild(teaser);
  setTimeout(function () {
    if (!opened) { teaser.classList.remove('gdca-hidden'); }
  }, 9000);
  setTimeout(function () { teaser.classList.add('gdca-hidden'); }, 30000);

  /* panel */
  panel = el('div', 'gdca-hidden');
  panel.id = 'gdca-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'GDSkills Assistant chat');
  var head = el('div', 'gdca-head');
  head.innerHTML =
    '<div class="gdca-avatar">G</div>' +
    '<div class="gdca-title"><b>GDSkills Assistant</b><span><i class="gdca-online"></i>' +
    (lang === 'ur' ? 'Online — fori jawab' : 'Online — replies instantly') + '</span></div>' +
    '<button class="gdca-iconbtn" id="gdca-lang" aria-label="Switch language">EN</button>' +
    '<button class="gdca-close" id="gdca-x" aria-label="Close chat">&times;</button>';
  panel.appendChild(head);

  msgsEl = el('div'); msgsEl.id = 'gdca-msgs';
  panel.appendChild(msgsEl);

  chipsEl = el('div'); chipsEl.id = 'gdca-chips';
  panel.appendChild(chipsEl);

  var row = el('div', 'gdca-inputrow');
  inputEl = el('input'); inputEl.id = 'gdca-input';
  inputEl.setAttribute('placeholder', lang === 'ur' ? 'Apna sawal likhein…' : 'Type your question…');
  inputEl.setAttribute('aria-label', 'Type your question');
  inputEl.setAttribute('autocomplete', 'off');
  var send = el('button'); send.id = 'gdca-send';
  send.setAttribute('aria-label', 'Send');
  send.innerHTML = '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
  row.appendChild(inputEl); row.appendChild(send);
  panel.appendChild(row);
  document.body.appendChild(panel);

  function open() {
    opened = true;
    teaser.classList.add('gdca-hidden');
    panel.classList.remove('gdca-hidden');
    if (!msgsEl.children.length) {
      greet();
    }
    setTimeout(function () { inputEl.focus(); }, 80);
  }
  function close() { panel.classList.add('gdca-hidden'); }

  btn.addEventListener('click', function () {
    if (panel.classList.contains('gdca-hidden')) open(); else close();
  });
  teaser.addEventListener('click', open);
  panel.querySelector('#gdca-x').addEventListener('click', close);
  panel.querySelector('#gdca-lang').addEventListener('click', function () {
    lang = (lang === 'ur') ? 'en' : 'ur';
    this.textContent = (lang === 'ur') ? 'EN' : 'اردو';
    inputEl.setAttribute('placeholder', lang === 'ur' ? 'Apna sawal likhein…' : 'Type your question…');
    addMsg('bot', lang === 'ur'
      ? 'Theek hai, ab main <b>Roman Urdu</b> mein jawab dunga.'
      : 'OK, I will now reply in <b>English</b>.');
    renderChips(defaultChips());
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.classList.contains('gdca-hidden')) close();
  });

  function doSend(text) {
    var v = (text != null ? text : inputEl.value).trim();
    if (!v) return;
    addMsg('user', esc(v));
    inputEl.value = '';
    showTyping();
    setTimeout(function () {
      hideTyping();
      var r = respond(v);
      addMsg('bot', r.html, r.actions);
      renderChips(r.chips || defaultChips());
    }, 650);
  }
  send.addEventListener('click', function () { doSend(); });
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') doSend();
  });
  window.__gdcaSend = doSend;
  window.__gdcaRespond = respond; /* test/debug hook: respond("text") -> {html, actions, chips} */
}

function greet() {
  showTyping();
  setTimeout(function () {
    hideTyping();
    var g = lang === 'ur'
      ? 'Assalam-o-Alaikum! Main <b>GDSkills Assistant</b> hoon.<br><br>Main aap ko <b>courses</b>, <b>fees</b>, <b>duration</b> aur <b>admission</b> ke baray mein fori maloomat de sakta hoon. Kya poochna chahein ge?'
      : 'Hello! I am the <b>GDSkills Assistant</b>.<br><br>I can instantly tell you about our <b>courses</b>, <b>fees</b>, <b>duration</b> and <b>admission</b>. What would you like to know?';
    addMsg('bot', g);
    renderChips(defaultChips());
  }, 700);
}

function addMsg(who, html, actions) {
  var m = el('div', 'gdca-msg gdca-' + who, html);
  if (actions && actions.length) {
    actions.forEach(function (a) {
      var b;
      if (a.url) {
        b = el('a', 'gdca-linkbtn' + (a.ghost ? ' gdca-ghost' : ''), esc(a.label));
        b.href = a.url; b.target = '_blank'; b.rel = 'noopener';
      } else {
        b = el('a', 'gdca-linkbtn' + (a.ghost ? ' gdca-ghost' : ''), esc(a.label));
        b.href = '#';
        b.addEventListener('click', function (e) {
          e.preventDefault();
          window.__gdcaSend(a.postback);
        });
      }
      m.appendChild(b);
    });
  }
  msgsEl.appendChild(m);
  msgsEl.scrollTop = msgsEl.scrollHeight;
  return m;
}

function renderChips(chips) {
  chipsEl.innerHTML = '';
  (chips || []).forEach(function (c) {
    var b = el('button', 'gdca-chip', esc(c.t));
    b.addEventListener('click', function () { window.__gdcaSend(c.q); });
    chipsEl.appendChild(b);
  });
  chipsEl.style.display = (chips && chips.length) ? 'flex' : 'none';
}

var typingEl = null;
function showTyping() {
  typingEl = el('div', 'gdca-typing', '<i></i><i></i><i></i>');
  msgsEl.appendChild(typingEl);
  msgsEl.scrollTop = msgsEl.scrollHeight;
}
function hideTyping() {
  if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
  typingEl = null;
}

/* ---------- 5. Init ---------- */
function init() {
  if (!document.body) { setTimeout(init, 100); return; }
  injectCSS();
  buildUI();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
