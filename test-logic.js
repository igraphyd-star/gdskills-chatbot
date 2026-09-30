// Test harness for gd-chatbot.js logic (respond function)
function makeEl(tag) {
  const e = {
    tag, children: [], innerHTML: '', textContent: '', style: {}, className: '', id: '',
    appendChild(c) { this.children.push(c); return c; },
    addEventListener() {}, setAttribute() {}, removeAttribute() {},
    querySelector() { return makeEl('div'); },
    removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); },
    classList: { add() {}, remove() {}, contains() { return true; } },
    focus() {}, scrollTop: 0, scrollHeight: 0, parentNode: null
  };
  return e;
}
global.window = { location: { pathname: '/' }, addEventListener() {} };
global.document = {
  readyState: 'complete', head: makeEl('head'), body: makeEl('body'),
  createElement: makeEl, createTextNode: (t) => ({ text: t }),
  addEventListener() {}
};

require('/home/hatch/workspace/gdskills-chatbot/gd-chatbot.js');
const respond = global.window.__gdcaRespond;

const tests = [
  'salam',
  'courses konse hain',
  'graphic designing ki fees',
  'shopify course ka outline',
  'tajweed free hai?',
  'admission kaise lein',
  'payment methods kya hain',
  'refund policy',
  'certificate milta hai?',
  'whatsapp number',
  'sab se sasta course',
  'painting',
  'iski duration kya hai',
  'how to enroll',
  'discount hai koi',
  'tree workshop',
  'xyzabc123'
];

let fail = 0;
for (const q of tests) {
  try {
    const r = respond(q);
    const txt = r.html.replace(/<[^>]+>/g, '').slice(0, 110).replace(/\s+/g, ' ');
    const nActions = (r.actions || []).length;
    const nChips = (r.chips || []).length;
    console.log('Q: ' + q);
    console.log('  -> ' + txt + '... [actions:' + nActions + ' chips:' + nChips + ']');
    if (!r.html || r.html.length < 10) { console.log('  !! EMPTY/SHORT RESPONSE'); fail++; }
  } catch (e) {
    console.log('Q: ' + q + '  !! ERROR: ' + e.message);
    fail++;
  }
}
console.log(fail === 0 ? '\nALL LOGIC TESTS PASSED' : '\n' + fail + ' FAILURES');
process.exit(fail === 0 ? 0 : 1);
