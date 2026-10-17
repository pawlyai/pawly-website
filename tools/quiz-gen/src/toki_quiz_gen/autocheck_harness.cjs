// Runs a generated quiz page's <script> against a stub DOM (Node). Prints one JSON document.
// Usage: node autocheck_harness.cjs <page.html>
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const src = blocks[blocks.length - 1] || '';
const report = { compile: null, runs: {} };

try { new Function(src); report.compile = 'ok'; } catch (e) { report.compile = 'FAIL: ' + e.message; }
if (report.compile !== 'ok') { console.log(JSON.stringify(report)); process.exit(0); }

const EMOJI = /\p{Extended_Pictographic}|‍|️/u;

function makeEnv(species) {
  const els = {};
  const screens = [];
  const mk = (id) => ({
    id, innerHTML: '', textContent: '', style: {},
    classList: { add() {}, remove() {}, toggle() {} },
  });
  const document = {
    getElementById: (id) => (els[id] = els[id] || mk(id)),
    querySelectorAll: () => [],
  };
  const store = {};
  const window = {
    __PET__: { name: 'Boyka', species, sex: 'male', age: 3, breed: 'Mixed', photo: null },
    scrollTo() {}, addEventListener() {}, parent: null,
  };
  window.parent = window;
  const localStorage = { getItem: (k) => store[k] || null, setItem: (k, v) => { store[k] = String(v); } };
  return { els, document, window, localStorage, store, screens };
}

function runFlow(species, pick) {
  const env = makeEnv(species);
  // Synchronous timers: the 120ms answer delay and the 3s calculating screen collapse into one call chain.
  const setTimeout = (f) => { f(); return 0; };
  const setInterval = () => 0;
  const clearInterval = () => {};
  const alert = () => {};
  const body = src + '\nreturn {QUIZ, get QUESTIONS(){return QUESTIONS;}, get SCORE(){return SCORE;}, get PICKS(){return PICKS;}, init, startQuiz, answer, bandFor, ' +
    'get CURRENT_Q(){return CURRENT_Q;}, saveSessionLog};';
  const fn = new Function('window', 'document', 'localStorage', 'setTimeout', 'setInterval', 'clearInterval', 'alert', 'console', body);
  const api = fn(env.window, env.document, env.localStorage, setTimeout, setInterval, clearInterval, alert, { warn() {}, log() {} });
  const screensSeen = [];
  const el = (id) => env.document.getElementById(id);
  // record which screen goto() activates by watching the progress bar: s0=8 s3=50 s4=90 s5=100
  api.init();
  const welcome = el('eraH1').innerHTML;
  const questionStems = [];
  api.startQuiz();
  const total = api.QUESTIONS.length;
  for (let i = 0; i < total; i++) {
    questionStems.push(api.QUESTIONS[i].q);
    const opts = api.QUESTIONS[i].opts;
    let idx = 0;
    if (pick === 'max') idx = opts.reduce((b, o, k) => (o.s > opts[b].s ? k : b), 0);
    else if (pick === 'min') idx = opts.reduce((b, o, k) => (o.s < opts[b].s ? k : b), 0);
    else idx = i % opts.length;
    api.answer(idx);
  }
  const result = el('result').innerHTML;
  const barAtEnd = el('bar').style.width;
  const about = (result.match(/<h2>About [\s\S]*?<\/div>\s*<\/div>/) || [''])[0];
  const session = JSON.parse(env.store['pawly_quiz_last'] || 'null');
  const band = session && QUIZ_BAND(api, session.score);
  return {
    total, answered: api.PICKS.length, score: api.SCORE, band: session && session.result,
    barAtEnd, resultLength: result.length,
    hasResultArt: result.includes('result-art'),
    hasArtSrc: /class="result-art" src="data:image\/jpeg;base64,[A-Za-z0-9+/=]{100,}"/.test(result),
    hasSolar: result.includes('ic-'),
    hasEmoji: EMOJI.test(result),
    about, welcomeLength: welcome.length,
    sessionOk: !!session && session.species === species && session.picks.length === total,
    stems: questionStems,
  };
}
function QUIZ_BAND(api, score) { return api.bandFor(score).name; }

for (const species of ['dog', 'cat']) {
  report.runs[species] = {};
  for (const pick of ['min', 'max', 'mix']) {
    try { report.runs[species][pick] = runFlow(species, pick); }
    catch (e) { report.runs[species][pick] = { error: String(e && e.stack || e) }; }
  }
}
console.log(JSON.stringify(report));
