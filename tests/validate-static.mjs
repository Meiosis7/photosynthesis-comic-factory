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

for (const asset of requiredAssets) {
  assert.match(html + css, new RegExp(asset.replace(/[.+?^${}()|[\]\\]/g, '\\$&')), `asset not referenced by page: ${asset}`);
}

const stepTitles = [...js.matchAll(/title:\s*'([^']+)'/g)].map((match) => match[1]);
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
assert.match(html, /class="energy-token atp"/, 'ATP should be a comic text token');
assert.match(html, /class="energy-token nadph"/, 'NADPH should be a comic text token');
assert.match(html, /class="energy-token adp-pi"/, 'ADP+Pi should be a comic text token');
assert.match(html, /class="energy-token nadp"/, 'NADP+ should be a comic text token');
assert.match(html, /class="product-token sugar"/, 'CH2O should be a comic text product token');
assert.match(html, /class="asset co2-down-left-arrow"/, 'CO2 should have the supplied down-left guide arrow');
assert.doesNotMatch(html, /src="\.\/assets\/atp\.png"|src="\.\/assets\/nadph\.png"/, 'ATP and NADPH should not use image drawings');
assert.doesNotMatch(html, /src="\.\/assets\/sugar\.png"|src="\.\/assets\/adp-pi\.png"|src="\.\/assets\/nadp\.png"/, 'CH2O, ADP+Pi, and NADP+ should not use image drawings');

assert.match(css, /\.model-layer \.co2-down-left-arrow\s*\{[^}]*left:\s*74\.8%;[^}]*top:\s*29\.5%;[^}]*width:\s*5\.9%;/s, 'CO2 down-left guide arrow should be half-size with the end aligned toward the gray CO2 sphere');
assert.match(css, /\.model-layer \.sugar\s*\{[^}]*left:\s*82\.4%;[^}]*top:\s*65%;/s, 'CH2O should sit to the right of the output arrow, aligned with it');

for (const label of ['H₂O', 'O₂', 'CO₂', 'C₃', 'C₅', '(CH₂O)', 'ADP+Pi', 'NADP⁺']) {
  assert.match(html, new RegExp(label.replace(/[.+?^${}()|[\]\\]/g, '\\$&')), `missing molecule label: ${label}`);
}

assert.match(js, /short:\s*'水的光解'/, 'step button should say 水的光解');

console.log('static app checks passed');
