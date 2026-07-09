import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(join(root, 'index.html'), 'utf8');
const css = readFileSync(join(root, 'styles.css'), 'utf8');
const js = readFileSync(join(root, 'src/app.js'), 'utf8');
const assets = new Set(readdirSync(join(root, 'assets')));

const requiredAssets = [
  'chloroplast-map.png',
  'sun.png',
  'granum.png',
  'water.png',
  'oxygen.png',
  'co2.png',
  'co2-down-left-arrow.png',
  'c3.png',
  'c5.png',
  'label-plaque.png',
  'step-badge.png'
];

for (const asset of requiredAssets) {
  assert.ok(assets.has(asset), `missing asset file: ${asset}`);
}

for (const id of ['steps', 'playBtn', 'backBtn', 'nextBtn', 'resetBtn', 'stageBadge']) {
  assert.match(html, new RegExp(`id="${id}"`), `missing control id: ${id}`);
}

for (const id of ['moleculeInfoDialog', 'moleculeInfoTitle', 'moleculeInfoType', 'moleculeInfoText', 'moleculeInfoClose']) {
  assert.match(html, new RegExp(`id="${id}"`), `missing molecule info dialog id: ${id}`);
}

for (const asset of requiredAssets) {
  assert.match(html + css, new RegExp(asset.replace(/[.+?^${}()|[\]\\]/g, '\\$&')), `asset not referenced by page: ${asset}`);
}

const stepsSource = js.slice(js.indexOf('const steps = ['), js.indexOf('const moleculeInfo = {'));
const stepTitles = [...stepsSource.matchAll(/title:\s*'([^']+)'/g)].map((match) => match[1]);
assert.deepEqual(stepTitles, [
  '光反应启动',
  '水的光解',
  'ATP 的形成',
  'NADPH 的形成',
  'CO₂ 的固定',
  'C₃ 的还原',
  '物质返回光反应'
]);

for (let i = 0; i < 7; i += 1) {
  assert.match(css, new RegExp(`data-step="${i}"`), `missing CSS state for step ${i}`);
}

assert.match(html, /class="map-label light-label"/, 'missing light reaction label');
assert.match(html, /class="map-label dark-label"/, 'missing dark reaction label');
assert.match(html, /class="model-layer"/, 'model visuals should share one scaled coordinate layer');
assert.match(css, /\.model-layer \.map/, 'map should be anchored inside the model coordinate layer');
assert.match(html, /class="transport-flow"/, 'missing regular transport arrows');
assert.match(html, /class="transport-line transport-forward"/, 'missing forward transport arrow');
assert.match(html, /class="transport-line transport-return"/, 'missing return transport arrow');
assert.match(html, /class="calvin-cycle"/, 'missing dark reaction cycle arrows');
assert.match(html, /marker-end="url\(#cycleArrow\)"/, 'dark reaction cycle arrows should have arrowheads');
assert.match(html, /class="cycle-line cycle-input"/, 'CO2 should have an input arrow into the dark reaction cycle');
assert.match(html, /class="cycle-line cycle-output"/, 'CH2O should have an output arrow from the dark reaction cycle');
assert.match(html, />类囊体薄膜</, 'light reaction label should name the thylakoid membrane');
assert.match(html, />叶绿体基质</, 'dark reaction label should name the stroma');
assert.doesNotMatch(html + js, /光反应车间|暗反应车间|能量运输线/, 'page should not draw separate workshop regions or a middle transport label');
assert.doesNotMatch(html + css, /reaction-use-flow|use-line|use-atp|use-nadph/, 'ATP and NADPH should not point directly to CH2O');
assert.match(html, /class="[^"]*energy-token[^"]*atp[^"]*"/, 'ATP should be a comic text token');
assert.match(html, /class="[^"]*energy-token[^"]*nadph[^"]*"/, 'NADPH should be a comic text token');
assert.match(html, /class="[^"]*energy-token[^"]*adp-pi[^"]*"/, 'ADP+Pi should be a comic text token');
assert.match(html, /class="[^"]*energy-token[^"]*nadp[^"]*"/, 'NADP+ should be a comic text token');
assert.match(html, /class="[^"]*product-token[^"]*sugar[^"]*"/, 'CH2O should be a comic text product token');
assert.match(html, /class="asset co2-down-left-arrow"/, 'CO2 should have the supplied down-left guide arrow');
assert.doesNotMatch(html, /src="\.\/assets\/atp\.png"|src="\.\/assets\/nadph\.png"/, 'ATP and NADPH should not use image drawings');
assert.doesNotMatch(html, /src="\.\/assets\/sugar\.png"|src="\.\/assets\/adp-pi\.png"|src="\.\/assets\/nadp\.png"/, 'CH2O, ADP+Pi, and NADP+ should not use image drawings');

assert.match(css, /\.model-layer \.co2-down-left-arrow\s*\{[^}]*left:\s*74\.8%;[^}]*top:\s*29\.5%;[^}]*width:\s*5\.9%;/s, 'CO2 down-left guide arrow should be half-size with the end aligned toward the gray CO2 sphere');
assert.match(css, /\.model-layer \.sugar\s*\{[^}]*left:\s*82\.4%;[^}]*top:\s*66%;/s, 'CH2O should sit to the right of the output arrow, aligned with it');
assert.match(css, /\.model-layer \.oxygen\s*\{[^}]*left:\s*39\.6%;[^}]*top:\s*23\.2%;[^}]*width:\s*7\.2%;[^}]*\}/s, 'oxygen molecule should move up to the O2 label position without changing layer order');

for (const key of ['water', 'oxygen', 'protonElectron', 'atp', 'nadph', 'co2', 'c3', 'c5', 'sugar', 'adpPi', 'nadp']) {
  assert.match(html, new RegExp(`data-info-key="${key}"`), `missing molecule info hotspot: ${key}`);
}

assert.match(css, /\.info-hotspot\s*\{[^}]*pointer-events:\s*auto;/s, 'molecule info hotspots should be clickable');
assert.match(css, /\.energy-token\.info-hotspot,[\s\S]*?\.molecule-tag\.info-hotspot\s*\{[^}]*pointer-events:\s*auto;/s, 'molecule info hotspots should override the default non-clickable molecule layer');
assert.match(js, /const moleculeInfo = \{/, 'missing molecule info data map');
assert.match(js, /还原型辅酶II/, 'NADPH info should name reduced coenzyme II');
assert.match(js, /作为还原剂/, 'NADPH info should mention reducing agent');
assert.match(js, /提供氢、还原力和能量|提供能量/, 'NADPH info should mention energy support');
assert.match(js, /openMoleculeInfo/, 'missing molecule info open handler');
assert.match(js, /type:\s*'三碳化合物'/, 'C3 card should say 三碳化合物');
assert.match(js, /type:\s*'五碳化合物'/, 'C5 card should say 五碳化合物');
assert.doesNotMatch(js + css, /dark-step/, 'dark reaction step buttons should use the same styling as light reaction buttons');
assert.match(html, />必修1·光合作用与能量转化</, 'topbar small title should use the required module label');
assert.match(html, />一生儿·高中生物一本通</, 'topbar right badge should use the required brand label');
assert.match(html, /styles\.css\?v=topbar-badge-2/, 'stylesheet URL should be cache-busted for redesigned topbar badge styling');
assert.match(html, /src="\.\/src\/app\.js\?v=topbar-labels-1"/, 'script URL should be cache-busted for static topbar labels');
assert.match(css, /#stageBadge\s*\{[^}]*position:\s*relative;[^}]*padding:\s*10px 16px 10px 22px;[^}]*border:\s*3px solid #222b35;[^}]*border-radius:\s*5px;[^}]*linear-gradient\(90deg,\s*rgba\(67,\s*191,\s*168,\s*\.24\),\s*rgba\(255,\s*245,\s*215,\s*\.95\)\s*38%,\s*rgba\(255,\s*245,\s*215,\s*\.95\)\);[^}]*box-shadow:\s*5px 5px 0 rgba\(34,\s*43,\s*53,\s*\.18\);/s, 'topbar badge should use a paper-label comic style');
assert.match(css, /#stageBadge::before\s*\{[^}]*background:\s*#43bfa8;/s, 'topbar badge should include the teal label stripe');
assert.doesNotMatch(js, /fields\.badge\.textContent\s*=\s*`\$\{index \+ 1\} \\\/ \$\{steps\.length\}`/, 'topbar right badge should stay static instead of showing step progress');
assert.match(css, /\.explain\s*\{[^}]*width:\s*min\(620px,\s*calc\(100% - 84px\)\);[^}]*padding:\s*16px 18px;/s, 'large-screen process card should be wider and roomier');
assert.match(css, /h2\s*\{[^}]*font-size:\s*32px;/s, 'large-screen process card title should be larger');
assert.match(css, /\.explain p\s*\{[^}]*font-size:\s*18px;/s, 'large-screen process card body should be larger');
assert.match(css, /\.explain \.formula-row\s*\{[^}]*font-size:\s*20px;/s, 'large-screen process formula should be larger');
assert.match(css, /@media \(max-width: 1100px\), \(orientation: portrait\)\s*\{[\s\S]*?\.scene\s*\{[^}]*grid-template-rows:\s*auto auto auto auto minmax\(42px,\s*1fr\);[\s\S]*?\.topbar\s*\{[^}]*display:\s*flex;[^}]*grid-row:\s*1;[\s\S]*?\.topbar h1\s*\{[^}]*font-size:\s*34px;[\s\S]*?\.explain\s*\{[^}]*grid-row:\s*2;[\s\S]*?\.model-layer\s*\{[^}]*grid-row:\s*3;[\s\S]*?\.steps\s*\{[^}]*grid-row:\s*4;[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);[\s\S]*?\.controls\s*\{[^}]*grid-row:\s*5;[^}]*align-self:\s*end;/s, 'portrait layout should keep the project title large and stack content without large empty gaps');

for (const label of ['H₂O', 'O₂', 'CO₂', 'C₃', 'C₅', '(CH₂O)', 'ADP+Pi', 'NADP⁺']) {
  assert.match(html, new RegExp(label.replace(/[.+?^${}()|[\]\\]/g, '\\$&')), `missing molecule label: ${label}`);
}

assert.match(js, /short:\s*'水的光解'/, 'step button should say 水的光解');

console.log('static app checks passed');
