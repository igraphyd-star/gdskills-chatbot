/* ============================================================
   GDSkills English Coach v1.0
   AI speaking-practice helper for the English Speaking Course
   (gdskills.pk). Visible ONLY to students enrolled in that
   course — the WPCode loader snippet enforces this server-side
   and passes window.__gdEnglishCoach = {ajaxurl, nonce}.

   Modes: Chat practice (AI tutor) | Pronunciation (TTS + mic)
          | Sentence builder (grammar fix) | Quiz (MCQs)

   Voice uses the browser's free Web Speech API — no API cost.
   AI replies go through admin-ajax.php -> OpenRouter proxy
   (key stays on the server, never in this file).
   ============================================================ */
(function () {
'use strict';

/* ---------- 0. Guards ---------- */
if (window.__gdeLoaded) return;
window.__gdeLoaded = true;
var CFG = window.__gdEnglishCoach || {};
if (!CFG.enrolled || !CFG.ajaxurl || !CFG.nonce) return;
try {
  var _p = window.location.pathname || '';
  if (/\/(cart|checkout|my-account|wp-admin|wp-login)(\/|$)/i.test(_p)) return;
} catch (e) {}

/* ---------- 1. Styles ---------- */
var CSS = [
'.gde-hidden{display:none!important}',
'#gde-btn{position:fixed;left:18px;bottom:110px;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;z-index:999998;background:linear-gradient(135deg,#6366f1,#8b5cf6);box-shadow:0 8px 24px rgba(99,102,241,.45);display:flex;align-items:center;justify-content:center;transition:transform .18s ease;font-family:inherit}',
'#gde-btn:hover{transform:scale(1.07)}',
'#gde-btn svg{width:30px;height:30px;fill:#fff}',
'#gde-btn .gde-dot{position:absolute;top:2px;right:2px;width:13px;height:13px;border-radius:50%;background:#22c55e;border:2.5px solid #fff}',
'#gde-panel{position:fixed;left:18px;bottom:182px;width:392px;max-width:calc(100vw - 28px);height:600px;max-height:calc(100vh - 110px);z-index:999999;background:#f8fafc;border-radius:18px;box-shadow:0 18px 60px rgba(0,0,0,.28);display:flex;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;border:1px solid #e2e8f0}',
'.gde-head{background:linear-gradient(135deg,#312e81,#7c3aed);color:#fff;padding:12px 13px;display:flex;align-items:center;gap:10px;flex:none}',
'.gde-avatar{width:40px;height:40px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;color:#7c3aed;flex:none}',
'.gde-title{flex:1;min-width:0}',
'.gde-title b{display:block;font-size:14.5px;letter-spacing:.2px}',
'.gde-title span{display:flex;align-items:center;gap:5px;font-size:11.5px;color:#ddd6fe}',
'.gde-title .gde-online{width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block}',
'.gde-iconbtn{background:rgba(255,255,255,.14);border:none;color:#fff;border-radius:8px;font-size:11.5px;font-weight:700;padding:6px 9px;cursor:pointer;letter-spacing:.3px}',
'.gde-iconbtn:hover{background:rgba(255,255,255,.25)}',
'.gde-iconbtn.gde-off{opacity:.45}',
'.gde-close{background:none;border:none;color:#ede9fe;font-size:20px;cursor:pointer;line-height:1;padding:4px}',
'#gde-tabs{flex:none;display:flex;background:#ede9fe;border-bottom:1px solid #ddd6fe}',
'.gde-tab{flex:1;border:none;background:none;padding:10px 2px;font-size:12px;font-weight:700;color:#6d64c9;cursor:pointer;border-bottom:3px solid transparent;font-family:inherit}',
'.gde-tab.gde-active{color:#5b21b6;border-bottom-color:#7c3aed;background:#f5f3ff}',
'#gde-msgs{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:9px;scroll-behavior:smooth}',
'.gde-msg{max-width:88%;padding:9px 13px;border-radius:15px;font-size:13.8px;line-height:1.55;word-wrap:break-word}',
'.gde-bot{background:#fff;color:#1f2937;border:1px solid #e8eef5;border-radius:15px 15px 15px 5px;align-self:flex-start;box-shadow:0 1px 3px rgba(0,0,0,.05)}',
'.gde-user{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-radius:15px 15px 5px 15px;align-self:flex-end}',
'.gde-msg b{font-weight:700}',
'.gde-msg .gde-say{display:inline-block;margin-top:6px;font-size:12px;color:#7c3aed;cursor:pointer;font-weight:700}',
'.gde-msg .gde-say:hover{text-decoration:underline}',
'.gde-typing{align-self:flex-start;background:#fff;border:1px solid #e8eef5;border-radius:15px 15px 15px 5px;padding:11px 15px;display:flex;gap:5px}',
'.gde-typing i{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:gde-blink 1.1s infinite}',
'.gde-typing i:nth-child(2){animation-delay:.18s}.gde-typing i:nth-child(3){animation-delay:.36s}',
'@keyframes gde-blink{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}',
'#gde-chips{flex:none;display:flex;gap:7px;overflow-x:auto;padding:9px 12px;background:#f8fafc;border-top:1px solid #eef2f7;scrollbar-width:none}',
'#gde-chips::-webkit-scrollbar{display:none}',
'.gde-chip{flex:none;background:#fff;border:1.5px solid #c4b5fd;color:#6d28d9;font-size:12.4px;font-weight:600;padding:7px 13px;border-radius:18px;cursor:pointer;white-space:nowrap;font-family:inherit}',
'.gde-chip:hover{background:#f5f3ff}',
'.gde-inputrow{flex:none;display:flex;gap:7px;padding:10px 12px;background:#fff;border-top:1px solid #eef2f7;align-items:center}',
'#gde-input{flex:1;border:1.5px solid #e2e8f0;border-radius:22px;padding:10px 15px;font-size:13.8px;outline:none;font-family:inherit;min-width:0}',
'#gde-input:focus{border-color:#7c3aed}',
'.gde-roundbtn{width:42px;height:42px;flex:none;border:none;border-radius:50%;background:#ede9fe;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit}',
'.gde-roundbtn svg{width:19px;height:19px;fill:#6d28d9}',
'.gde-roundbtn.gde-listening{background:#ef4444;animation:gde-blink 1s infinite}',
'.gde-roundbtn.gde-listening svg{fill:#fff}',
'#gde-send{background:linear-gradient(135deg,#6366f1,#8b5cf6)}',
'#gde-send svg{fill:#fff}',
'.gde-quizopt{display:block;width:100%;text-align:left;margin:6px 0;padding:9px 12px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;font-size:13.5px;font-family:inherit}',
'.gde-quizopt:hover{border-color:#7c3aed}',
'.gde-quizopt.gde-right{border-color:#22c55e;background:#f0fdf4}',
'.gde-quizopt.gde-wrong{border-color:#ef4444;background:#fef2f2}',
'.gde-quizopt:disabled{cursor:default;opacity:.95}',
'@media (max-width:480px){#gde-panel{left:0;right:0;bottom:0;width:100%;max-width:100%;height:80vh;max-height:80vh;border-radius:18px 18px 0 0}#gde-btn{left:14px;bottom:104px}}'
].join('\n');

function injectCSS() {
  var s = document.createElement('style');
  s.type = 'text/css';
  s.setAttribute('data-gde', '1');
  if (s.styleSheet) { s.styleSheet.cssText = CSS; }
  else { s.appendChild(document.createTextNode(CSS)); }
  document.head.appendChild(s);
}

/* ---------- 2. Voice (free Web Speech API) ---------- */
var Voice = {
  speak: function (text, slow) {
    try {
      if (!('speechSynthesis' in window)) return false;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = slow ? 0.55 : 0.95;
      u.pitch = 1;
      var vs = window.speechSynthesis.getVoices();
      for (var i = 0; i < vs.length; i++) {
        if (/en[-_]US/i.test(vs[i].lang) && /google/i.test(vs[i].name)) { u.voice = vs[i]; break; }
      }
      if (!u.voice) {
        for (var j = 0; j < vs.length; j++) {
          if (/en[-_]US/i.test(vs[j].lang)) { u.voice = vs[j]; break; }
        }
      }
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  },
  rec: null, listening: false,
  supported: function () {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
  },
  listen: function (onResult, onEnd) {
    var self = this;
    if (!this.supported()) { onEnd('Mic is browser me supported nahi hai. Chrome use karein.'); return; }
    if (this.listening) { try { this.rec.stop(); } catch (e) {} return; }
    try {
      var RC = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.rec = new RC();
      this.rec.lang = 'en-US';
      this.rec.interimResults = false;
      this.rec.maxAlternatives = 1;
      this.listening = true;
      this.rec.onresult = function (ev) {
        var t = ev.results[0][0].transcript || '';
        self.listening = false;
        onResult(t);
      };
      this.rec.onerror = function (ev) {
        self.listening = false;
        onEnd('Mic error: ' + (ev.error || 'unknown') + '. Dobara try karein.');
      };
      this.rec.onend = function () {
        if (self.listening) { self.listening = false; onEnd('Kuch sunai nahi diya. Dobara try karein.'); }
      };
      this.rec.start();
    } catch (e) {
      this.listening = false;
      onEnd('Mic start nahi ho saka.');
    }
  },
  stop: function () { try { if (this.rec) this.rec.stop(); } catch (e) {} this.listening = false; }
};
try { if ('speechSynthesis' in window) window.speechSynthesis.getVoices(); } catch (e) {}

/* ---------- 3. AI backend (via WP proxy) ---------- */
function aiCall(payload) {
  return new Promise(function (resolve) {
    var body = 'action=gd_english_coach&nonce=' + encodeURIComponent(CFG.nonce);
    for (var k in payload) {
      if (payload.hasOwnProperty(k)) body += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(payload[k]);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', CFG.ajaxurl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.timeout = 60000;
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      try {
        var r = JSON.parse(xhr.responseText || '{}');
        if (r && r.success && r.data && r.data.reply) resolve({ ok: true, reply: r.data.reply });
        else resolve({ ok: false, reply: (r && r.data && r.data.message) || 'Server se jawab nahi mila.' });
      } catch (e) { resolve({ ok: false, reply: 'Server se jawab nahi mila.' }); }
    };
    xhr.ontimeout = function () { resolve({ ok: false, reply: 'Bohat der ho gayi, dobara try karein.' }); };
    xhr.onerror = function () { resolve({ ok: false, reply: 'Internet ya server ka masla hai.' }); };
    xhr.send(body);
  });
}

/* ---------- 4. UI ---------- */
injectCSS();

var MODES = {
  chat:   { label: 'Baat Cheet', ph: 'English me kuch likhein...' },
  pron:   { label: 'Talafuz',    ph: 'Wo lafz likhein jiska talafuz sunna hai...' },
  sent:   { label: 'Jumlay Banao', ph: 'Apna English jumla likhein...' },
  quiz:   { label: 'Quiz',        ph: '' }
};
var mode = 'chat';
var history = [];          // last chat turns {role, content}
var autoSpeak = false;
var quizState = null;

var btn = document.createElement('button');
btn.id = 'gde-btn';
btn.setAttribute('aria-label', 'English Coach kholein');
btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7v3.5c0 .8.4 1.6 1 2.1V17a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2.4c.6-.5 1-1.3 1-2.1V9a7 7 0 0 0-7-7zm-3 19h6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/></svg><span class="gde-dot"></span>';
document.body.appendChild(btn);

var panel = document.createElement('div');
panel.id = 'gde-panel';
panel.className = 'gde-hidden';
panel.innerHTML =
  '<div class="gde-head">' +
    '<div class="gde-avatar">EC</div>' +
    '<div class="gde-title"><b>English Coach</b><span><span class="gde-online"></span>Practice partner — online</span></div>' +
    '<button class="gde-iconbtn" id="gde-speakbtn" title="Jawab sunana on/off">🔊</button>' +
    '<button class="gde-close" id="gde-close" aria-label="Band karein">×</button>' +
  '</div>' +
  '<div id="gde-tabs"></div>' +
  '<div id="gde-msgs"></div>' +
  '<div id="gde-chips"></div>' +
  '<div class="gde-inputrow">' +
    '<button class="gde-roundbtn" id="gde-mic" title="Bol kar likhein"><svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm7-3a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.9V22h2v-1.1A9 9 0 0 0 21 12h-2z"/></svg></button>' +
    '<input id="gde-input" type="text" autocomplete="off" maxlength="500" />' +
    '<button class="gde-roundbtn" id="gde-send" title="Bhejein"><svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg></button>' +
  '</div>';
document.body.appendChild(panel);

var msgs = panel.querySelector('#gde-msgs');
var chipsBox = panel.querySelector('#gde-chips');
var input = panel.querySelector('#gde-input');
var micBtn = panel.querySelector('#gde-mic');
var sendBtn = panel.querySelector('#gde-send');
var speakBtn = panel.querySelector('#gde-speakbtn');
var tabsBox = panel.querySelector('#gde-tabs');

btn.addEventListener('click', function () {
  panel.classList.toggle('gde-hidden');
  if (!panel.classList.contains('gde-hidden') && !msgs.children.length) greet();
});
panel.querySelector('#gde-close').addEventListener('click', function () { panel.classList.add('gde-hidden'); });

speakBtn.addEventListener('click', function () {
  autoSpeak = !autoSpeak;
  speakBtn.classList.toggle('gde-off', !autoSpeak);
  speakBtn.textContent = autoSpeak ? '🔊' : '🔇';
  if (!autoSpeak) { try { window.speechSynthesis.cancel(); } catch (e) {} }
});
speakBtn.classList.add('gde-off');
speakBtn.textContent = '🔇';

function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }

function addMsg(text, who, speakable) {
  var d = document.createElement('div');
  d.className = 'gde-msg gde-' + who;
  var safe = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  d.innerHTML = safe;
  if (who === 'bot' && speakable !== false) {
    var s = document.createElement('span');
    s.className = 'gde-say';
    s.textContent = '🔊 Sunain';
    s.addEventListener('click', function () { Voice.speak(stripTags(text), false); });
    d.appendChild(document.createElement('br'));
    d.appendChild(s);
  }
  msgs.appendChild(d);
  scrollDown();
  return d;
}
function stripTags(t) { return String(t).replace(/<[^>]*>/g, ' '); }

function typing(on) {
  var t = panel.querySelector('.gde-typing');
  if (on && !t) {
    t = document.createElement('div');
    t.className = 'gde-typing';
    t.innerHTML = '<i></i><i></i><i></i>';
    msgs.appendChild(t);
    scrollDown();
  } else if (!on && t) { t.remove(); }
}

function setChips(list) {
  chipsBox.innerHTML = '';
  (list || []).forEach(function (c) {
    var b = document.createElement('button');
    b.className = 'gde-chip';
    b.textContent = c;
    b.addEventListener('click', function () { input.value = c; doSend(); });
    chipsBox.appendChild(b);
  });
  chipsBox.style.display = list && list.length ? 'flex' : 'none';
}

/* tabs */
Object.keys(MODES).forEach(function (m) {
  var t = document.createElement('button');
  t.className = 'gde-tab' + (m === mode ? ' gde-active' : '');
  t.textContent = MODES[m].label;
  t.setAttribute('data-mode', m);
  t.addEventListener('click', function () { setMode(m); });
  tabsBox.appendChild(t);
});
function setMode(m) {
  mode = m; quizState = null;
  var ts = tabsBox.querySelectorAll('.gde-tab');
  for (var i = 0; i < ts.length; i++) ts[i].classList.toggle('gde-active', ts[i].getAttribute('data-mode') === m);
  input.placeholder = MODES[m].ph;
  document.querySelector('#gde-panel .gde-inputrow').style.display = (m === 'quiz') ? 'none' : 'flex';
  if (m === 'chat') setChips(['Hello! Mera naam ___ hai', 'Mere baare me sawal pucho', 'Job interview practice', 'Shopping par baat karo']);
  else if (m === 'pron') setChips(['pronunciation', 'comfortable', 'entrepreneur']);
  else if (m === 'sent') setChips(['I am go to school daily', 'She have two brothers']);
  else setChips(['Tenses', 'Parts of Speech', 'Vocabulary', 'Everyday English']);
  greet(true);
}

function greet(isSwitch) {
  if (mode === 'chat') {
    addMsg(isSwitch ? 'Baat Cheet mode on hai. English me mujh se baat karein — ghalti hogi to me pyaar se theek kar dunga. Shuru karein: <b>Hello! How are you today?</b>' :
      'Assalam-o-Alaikum! Me aapka <b>English Coach</b> hun. Mere sath English me baat karke practice karein. Ghalti par me foran correction dunga. <b>Hello! How are you today?</b>', 'bot', false);
  } else if (mode === 'pron') {
    addMsg('Koi English lafz ya jumla likhein, me uska <b>sahih talafuz</b> suna dunga. Phir mic dabaa kar khud bolein — me check karunga ke aap ne sahih bola ya nahi.', 'bot', false);
  } else if (mode === 'sent') {
    addMsg('Apna English jumla likhein. Me usay <b>theek karke</b> samjhaunga ke ghalti kya thi aur qaida kya hai.', 'bot', false);
  } else {
    addMsg('Quiz ke liye neechay topic chunein: <b>Tenses</b>, <b>Parts of Speech</b>, <b>Vocabulary</b> ya <b>Everyday English</b>.', 'bot', false);
  }
}

/* ---------- 5. Send handlers ---------- */
function doSend() {
  var v = input.value.trim();
  if (!v) return;
  input.value = '';
  if (mode === 'chat') sendChat(v);
  else if (mode === 'pron') sendPron(v);
  else if (mode === 'sent') sendSentence(v);
}
sendBtn.addEventListener('click', doSend);
input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSend(); });

micBtn.addEventListener('click', function () {
  if (Voice.listening) { Voice.stop(); micBtn.classList.remove('gde-listening'); return; }
  micBtn.classList.add('gde-listening');
  addMsg('Sun raha hun... bolein.', 'bot', false);
  Voice.listen(function (text) {
    micBtn.classList.remove('gde-listening');
    if (mode === 'quiz') { addMsg('Quiz me mic nahi, option dabayein.', 'bot', false); return; }
    if (mode === 'pron' && verifyTarget) {
      var t = verifyTarget; verifyTarget = null;
      verifyPron(t, text);
      return;
    }
    input.value = text;
    addMsg('Aap ne kaha: "' + text + '"', 'user');
    doSend();
  }, function (err) {
    micBtn.classList.remove('gde-listening');
    addMsg(err, 'bot', false);
  });
});

function sendChat(v) {
  addMsg(v, 'user');
  history.push({ role: 'user', content: v });
  if (history.length > 8) history = history.slice(-8);
  typing(true);
  aiCall({ mode: 'chat', history: JSON.stringify(history) }).then(function (r) {
    typing(false);
    addMsg(r.reply, 'bot');
    if (r.ok) {
      history.push({ role: 'assistant', content: r.reply });
      if (history.length > 8) history = history.slice(-8);
      if (autoSpeak) Voice.speak(stripTags(r.reply), false);
    }
  });
}

var lastPronTarget = '';
var verifyTarget = null;
function sendPron(v) {
  lastPronTarget = v;
  addMsg(v, 'user');
  var d = addMsg('Pehle meri awaz me sunain:', 'bot', false);
  var row = document.createElement('div');
  row.style.marginTop = '8px';
  row.innerHTML = '<button class="gde-chip" data-s="n">🔊 Normal</button> <button class="gde-chip" data-s="s">🐢 Slow</button> <button class="gde-chip" data-s="m">🎤 Me bolun ga, check karo</button>';
  d.appendChild(row);
  var btns = row.querySelectorAll('button');
  btns[0].addEventListener('click', function () { Voice.speak(v, false); });
  btns[1].addEventListener('click', function () { Voice.speak(v, true); });
  btns[2].addEventListener('click', function () {
    addMsg('Mic dabayein aur "' + v + '" bolein.', 'bot', false);
    verifyTarget = v;
    micBtn.click();
  });
  scrollDown();
}

function verifyPron(target, said) {
  addMsg('Aap ne kaha: "' + said + '"', 'user');
  typing(true);
  aiCall({ mode: 'pronounce', target: target, said: said }).then(function (r) {
    typing(false);
    addMsg(r.reply, 'bot');
  });
}
function sendSentence(v) {
  addMsg(v, 'user');
  typing(true);
  aiCall({ mode: 'sentence', text: v }).then(function (r) {
    typing(false);
    addMsg(r.reply, 'bot');
  });
}

/* quiz */
chipsBox.addEventListener('click', function (e) {
  var b = e.target.closest('.gde-chip');
  if (!b || mode !== 'quiz') return;
  startQuiz(b.textContent);
});
function startQuiz(topic) {
  addMsg('Quiz: ' + topic, 'user');
  setChips([]);
  typing(true);
  aiCall({ mode: 'quiz', topic: topic }).then(function (r) {
    typing(false);
    var q;
    try { q = JSON.parse(r.reply); } catch (e) { q = null; }
    if (!q || !q.questions || !q.questions.length) { addMsg('Quiz ban nahi saka. Dobara try karein.', 'bot', false); setMode('quiz'); return; }
    quizState = { qs: q.questions.slice(0, 5), i: 0, score: 0 };
    askQuiz();
  });
}
function askQuiz() {
  var q = quizState.qs[quizState.i];
  var d = addMsg('<b>Sawal ' + (quizState.i + 1) + '/' + quizState.qs.length + ':</b> ' + q.q, 'bot', false);
  q.options.forEach(function (op, idx) {
    var b = document.createElement('button');
    b.className = 'gde-quizopt';
    b.textContent = op;
    b.addEventListener('click', function () { answerQuiz(idx, b, d, q); });
    d.appendChild(b);
  });
  scrollDown();
}
function answerQuiz(idx, btn, box, q) {
  var opts = box.querySelectorAll('.gde-quizopt');
  for (var i = 0; i < opts.length; i++) opts[i].disabled = true;
  if (idx === q.answer) { quizState.score++; btn.classList.add('gde-right'); }
  else { btn.classList.add('gde-wrong'); opts[q.answer].classList.add('gde-right'); }
  var ex = document.createElement('div');
  ex.style.cssText = 'margin-top:8px;font-size:13px;color:#475569';
  ex.textContent = (idx === q.answer ? 'Sahih! ' : 'Ghalat. ') + (q.explain || '');
  box.appendChild(ex);
  scrollDown();
  setTimeout(function () {
    quizState.i++;
    if (quizState.i < quizState.qs.length) askQuiz();
    else {
      addMsg('Quiz mukammal! Score: <b>' + quizState.score + '/' + quizState.qs.length + '</b>' +
        (quizState.score === quizState.qs.length ? ' — Zabardast!' : quizState.score >= 3 ? ' — Acha hai, practice jari rakhein.' : ' — Koi baat nahi, dobara khelein aur behtar karein.'), 'bot', false);
      setChips(['Tenses', 'Parts of Speech', 'Vocabulary', 'Everyday English']);
      quizState = null;
    }
  }, 1600);
}

setMode('chat');
})();
