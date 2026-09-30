// Test harness for gd-study-helper.js
function makeEl(tag) {
  const e = {
    tag, children: [], innerHTML: '', textContent: '', style: {}, className: '', id: '',
    appendChild(c) { this.children.push(c); return c; },
    addEventListener() {}, setAttribute() {},
    querySelector() { return makeEl('div'); },
    removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); },
    classList: { add() {}, remove() {}, contains() { return true; } },
    focus() {}, scrollTop: 0, scrollHeight: 0, parentNode: null
  };
  return e;
}
// simulate a paid student enrolled in 2 courses
global.window = { location: { pathname: '/' }, addEventListener() {},
  __gdcaMyCourses: ['Graphic Designing Course', 'The Digital Marketing Compass by Saim Fateh Malik'] };
global.document = {
  readyState: 'complete', head: makeEl('head'), body: makeEl('body'),
  createElement: makeEl, createTextNode: (t) => ({ text: t }),
  addEventListener() {}, getElementById: () => null
};

require('/home/hatch/workspace/gdskills-chatbot/gd-study-helper.js');
const respond = global.window.__gdsRespond;

const tests = [
  'salam',
  'mere courses',
  'graphic designing ki summary',
  'SEO samjhao',
  'layers samjhao',
  'task mein madad chahiye',
  'video nahi chal rahi',
  'access nahi mil raha',
  'password bhool gaya',
  'certificate chahiye',
  'quiz ki tayari',
  'blablabla'
];

let fail = 0;
for (const q of tests) {
  try {
    const r = respond(q);
    const txt = r.html.replace(/<[^>]+>/g, '').slice(0, 120).replace(/\s+/g, ' ');
    console.log('Q: ' + q + '\n  -> ' + txt + '... [actions:' + (r.actions||[]).length + ' chips:' + (r.chips||[]).length + ']');
    if (!r.html || r.html.length < 10) { console.log('  !! EMPTY RESPONSE'); fail++; }
  } catch (e) { console.log('Q: ' + q + '  !! ERROR: ' + e.message); fail++; }
}
console.log(fail === 0 ? '\nALL STUDY HELPER TESTS PASSED' : '\n' + fail + ' FAILURES');
process.exit(fail ? 1 : 0);
