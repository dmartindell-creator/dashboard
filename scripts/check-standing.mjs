// Check standing.json. No dependencies.
// Fails on invalid JSON, a missing text field, a bot name, a task id, or an em dash.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BOTS = [
  'Client Ops Router',
  'Fleet Coordinator',
  'Thought Bot',
  'DEEDEE',
  'Tumii',
  'Tumi',
  'Router',
  'Testes',
  'Brandi',
  'Commie',
  'Logi',
  'Stair',
  'Nutri',
  'Manus',
  'Imp',
  'EXO'
];

const file = resolve(process.argv[2] || 'standing.json');

function fail(msg){
  console.error('standing.json: ' + msg);
  process.exit(1);
}

function escapeReg(s){
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function botRe(){
  // Hyphen stays inside a word, so a project name like Nutri-Strength is not the bot Nutri.
  return new RegExp('(?<![A-Za-z0-9_])(?:' + BOTS.map(escapeReg).join('|') + ')(?![A-Za-z0-9_-])', 'i');
}

function idRe(){
  return /\b[a-z]{2,6}-(?:m)?\d+\b/i;
}

function stringsIn(value, path, out){
  if (typeof value === 'string') out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => stringsIn(v, path + '[' + i + ']', out));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => stringsIn(v, path ? path + '.' + k : k, out));
}

function requireText(obj, path){
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) fail(path + ' is not an object');
  if (typeof obj.text !== 'string' || !obj.text.trim()) fail('missing text at ' + path);
}

const raw = readFileSync(file, 'utf8');
if (raw.includes('\u2014')) fail('em dash');

let data;
try { data = JSON.parse(raw); }
catch (e) { fail('invalid JSON'); }
if (!data || typeof data !== 'object' || Array.isArray(data)) fail('invalid JSON');

if (data.oneThing != null) requireText(data.oneThing, 'oneThing');
for (const key of ['waitingOnDarius', 'waitingOnOthers', 'doneToday']) {
  if (data[key] == null) continue;
  if (!Array.isArray(data[key])) fail(key + ' is not a list');
  data[key].forEach((item, i) => requireText(item, key + '[' + i + ']'));
}

const strings = [];
stringsIn(data, '', strings);
for (const [path, text] of strings) {
  if (text.includes('\u2014')) fail('em dash in ' + path);
  if (botRe().test(text)) fail('bot name in ' + path);
  if (idRe().test(text)) fail('task id in ' + path);
}

console.log('standing.json ok');
