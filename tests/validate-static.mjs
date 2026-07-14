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
  'NADPH 的形成',
  'ATP 的形成',
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
assert.match(html, />H⁺\+e⁻</, 'proton/electron tag should not include leading 2 coefficients');
assert.doesNotMatch(html, />2H⁺\+2e⁻</, 'proton/electron tag should remove both 2 coefficients');
assert.doesNotMatch(js + css, /dark-step/, 'dark reaction step buttons should use the same styling as light reaction buttons');
assert.match(html, />必修1·光合作用与能量转化</, 'topbar small title should use the required module label');
assert.match(html, />《一生儿·高中生物一本通》</, 'topbar right book title should use book-title brackets');
assert.match(html, /class="topbar-line"[\s\S]*?必修1·光合作用与能量转化[\s\S]*?id="stageBadge"/, 'book title should sit on the same row as the module label');
assert.match(html, /styles\.css\?v=topbar-bookmark-2/, 'stylesheet URL should be cache-busted for inline book-title styling');
assert.match(html, /src="\.\/src\/app\.js\?v=subscript-buttons-1"/, 'script URL should be cache-busted for subscript step buttons');
assert.match(css, /\.topbar-line\s*\{[^}]*display:\s*flex;[^}]*align-items:\s*flex-start;[^}]*justify-content:\s*space-between;/s, 'module label and book title should share one top row');
assert.match(css, /#stageBadge\s*\{[^}]*color:\s*#188198;[^}]*font-size:\s*15px;[^}]*white-space:\s*nowrap;/s, 'book title should be plain inline text without a card frame');
assert.doesNotMatch(css, /#stageBadge\s*\{[^}]*border:/s, 'book title should not have a border');
assert.doesNotMatch(css, /#stageBadge::before/, 'book title should not have the old label stripe');
assert.doesNotMatch(js, /fields\.badge\.textContent\s*=\s*`\$\{index \+ 1\} \\\/ \$\{steps\.length\}`/, 'topbar right badge should stay static instead of showing step progress');
assert.match(css, /@media \(max-width: 1100px\), \(orientation: portrait\)\s*\{[\s\S]*?#stageBadge\s*\{[^}]*font-size:\s*14px;[^}]*white-space:\s*nowrap;/s, 'portrait book title should shrink without becoming a framed card');
assert.match(css, /@media \(max-width: 760px\) and \(orientation: portrait\)\s*\{[\s\S]*?#stageBadge\s*\{[^}]*font-size:\s*10px;[^}]*white-space:\s*nowrap;/s, 'small portrait book title should stay compact in the top row');
assert.match(js, /short:\s*'CO<sub>2<\/sub>固定'/, 'CO2 step button should use subscript markup');
assert.match(js, /short:\s*'C<sub>3<\/sub>还原'/, 'C3 step button should use subscript markup');
assert.match(js, /button\.innerHTML\s*=\s*step\.short;/, 'step buttons should render subscript markup');
assert.match(css, /\.info-dialog\s*\{[^}]*width:\s*min\(220px,\s*calc\(100% - 40px\)\);[^}]*padding:\s*10px 12px 12px;[^}]*border:\s*3px solid #222b35;/s, 'molecule info dialog should be at least 50% more compact');
assert.match(css, /#moleculeInfoText\s*\{[^}]*font-size:\s*12px;[^}]*line-height:\s*1\.42;/s, 'molecule info body text should shrink with the compact card');
assert.match(css, /\.scene\[data-step\] \.model-layer :is\([\s\S]*?\.water-split-arrow[\s\S]*?\.co2-down-left-arrow[\s\S]*?\.nadp[\s\S]*?\)\s*\{[^}]*opacity:\s*\.28;/s, 'step focus should dim unrelated molecules and curves');
assert.match(css, /\.scene\[data-step="1"\] \.model-layer :is\([\s\S]*?\.water-split-arrow[\s\S]*?\.water[\s\S]*?\.oxygen[\s\S]*?\)\s*\{[^}]*opacity:\s*1;/s, 'water photolysis step should highlight only related items');
assert.match(css, /\.scene\[data-step="5"\] \.model-layer :is\([\s\S]*?\.c3[\s\S]*?\.sugar[\s\S]*?\.calvin-blue-curve[\s\S]*?\)\s*\{[^}]*opacity:\s*1;/s, 'C3 reduction step should highlight sugar production and Calvin curve');

const focusItemsFor = (step) => {
  const startToken = `.scene[data-step="${step}"] .model-layer :is(\n`;
  const start = css.indexOf(startToken);
  assert.notEqual(start, -1, `missing focus selector for step ${step}`);
  const bodyStart = start + startToken.length;
  const end = css.indexOf(step === 6 ? '\n) {' : '\n),', bodyStart);
  assert.notEqual(end, -1, `missing focus selector end for step ${step}`);
  return css.slice(bodyStart, end);
};

const nadphFocus = focusItemsFor(2);
assert.match(nadphFocus, /\.nadph/, 'NADPH synthesis should be step 3 in the button order');
assert.match(nadphFocus, /\.nadph-nadp-loop-arrow/, 'NADPH synthesis should highlight the left synthesis arrow');
assert.doesNotMatch(nadphFocus, /right/, 'NADPH synthesis should leave the right return arrow dim');

const atpFocus = focusItemsFor(3);
assert.match(atpFocus, /\.atp/, 'ATP synthesis should come after NADPH synthesis');
assert.match(atpFocus, /\.atp-adp-loop-arrow/, 'ATP synthesis should highlight the left synthesis arrow');
assert.doesNotMatch(atpFocus, /right/, 'ATP synthesis should leave the right return arrow dim');

const c3Focus = focusItemsFor(5);
assert.match(c3Focus, /\.nadp/, 'C3 reduction should show NADP+');
assert.match(c3Focus, /\.adp-pi/, 'C3 reduction should show ADP+Pi');
assert.match(c3Focus, /\.nadph-nadp-loop-arrow-right/, 'C3 reduction should show the NADP+ return arrow');
assert.match(c3Focus, /\.atp-adp-loop-arrow-right/, 'C3 reduction should show the ADP+Pi return arrow');
assert.doesNotMatch(c3Focus, /\.c5-c3-arc-arrow/, 'C3 reduction should not highlight the C5 to C3 arrow');

const returnFocus = focusItemsFor(6);
assert.match(returnFocus, /\.nadp/, 'return step should keep NADP+ visible');
assert.match(returnFocus, /\.adp-pi/, 'return step should keep ADP+Pi visible');
assert.doesNotMatch(returnFocus, /arrow/, 'return step should not highlight any curve or arrow');

const globalAnimation = [...css.matchAll(/([^{}]+)\{\s*animation:\s*stepFocusFlash 1\.5s ease-in-out infinite;\s*\}/g)]
  .find((match) => match[1].includes('.scene[data-step] .model-layer :is('));
assert.ok(globalAnimation, 'missing global focused-curve animation selector');
assert.doesNotMatch(globalAnimation[1], /right/, 'return arrows should not be part of the global focused-curve animation');
assert.match(css, /\.explain\s*\{[^}]*width:\s*min\(620px,\s*calc\(100% - 84px\)\);[^}]*padding:\s*16px 18px;/s, 'large-screen process card should be wider and roomier');
assert.match(css, /h2\s*\{[^}]*font-size:\s*32px;/s, 'large-screen process card title should be larger');
assert.match(css, /\.explain p\s*\{[^}]*font-size:\s*18px;/s, 'large-screen process card body should be larger');
assert.match(css, /\.explain \.formula-row\s*\{[^}]*font-size:\s*20px;/s, 'large-screen process formula should be larger');
assert.match(css, /@media \(max-width: 1100px\), \(orientation: portrait\)\s*\{[\s\S]*?\.scene\s*\{[^}]*grid-template-rows:\s*auto auto auto auto minmax\(42px,\s*1fr\);[\s\S]*?\.topbar\s*\{[^}]*display:\s*flex;[^}]*grid-row:\s*1;[\s\S]*?\.topbar h1\s*\{[^}]*font-size:\s*34px;[\s\S]*?\.explain\s*\{[^}]*grid-row:\s*2;[\s\S]*?\.model-layer\s*\{[^}]*grid-row:\s*3;[\s\S]*?\.steps\s*\{[^}]*grid-row:\s*4;[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);[\s\S]*?\.controls\s*\{[^}]*grid-row:\s*5;[^}]*align-self:\s*end;/s, 'portrait layout should keep the project title large and stack content without large empty gaps');
assert.match(css, /@media \(max-width: 760px\) and \(orientation: portrait\)\s*\{[\s\S]*?\.model-layer\s*\{[^}]*width:\s*min\(112vw,\s*max\(104vw,\s*calc\(\(100dvh - 390px\) \* 1\.7779\)\),\s*900px\);[^}]*max-width:\s*none;/s, 'small portrait screens should scale the main model slightly beyond the viewport without clipping CH2O');

for (const label of ['H₂O', 'O₂', 'CO₂', 'C₃', 'C₅', '(CH₂O)', 'ADP+Pi', 'NADP⁺']) {
  assert.match(html, new RegExp(label.replace(/[.+?^${}()|[\]\\]/g, '\\$&')), `missing molecule label: ${label}`);
}

assert.match(js, /short:\s*'水的光解'/, 'step button should say 水的光解');

console.log('static app checks passed');
