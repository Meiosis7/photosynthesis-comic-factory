const steps = [
  {
    title: '光反应启动',
    short: '启动',
    place: '类囊体薄膜',
    location: '类囊体薄膜',
    matter: '光合色素吸收光能',
    energy: '光能开始转化',
    dest: '启动水的光解和能量转化',
    formula: '',
    text: '光合色素吸收光能，启动光反应。'
  },
  {
    title: '水的光解',
    short: '水的光解',
    place: '类囊体薄膜',
    location: '类囊体薄膜',
    matter: 'H₂O 分解，产生 O₂、H⁺ 和 e⁻',
    energy: '光能驱动水分解',
    dest: 'O₂ 释放，H⁺ 和 e⁻ 继续参与 NADPH 的形成',
    formula: '2H<sub>2</sub>O → O<sub>2</sub> + 4H<sup>+</sup> + 4e<sup>-</sup>',
    text: 'H<sub>2</sub>O 在光反应中被分解，产生 O<sub>2</sub>、H<sup>+</sup> 和 e<sup>-</sup>。'
  },
  {
    title: 'NADPH 的形成',
    short: 'NADPH合成',
    place: '类囊体薄膜',
    location: '类囊体薄膜',
    matter: 'NADP⁺ 接收 H⁺ 和 e⁻，形成 NADPH',
    energy: 'NADPH 携带还原力',
    dest: 'NADPH 用于 C₃ 的还原',
    formula: 'NADP<sup>+</sup> + H<sup>+</sup> + e<sup>-</sup> → NADPH',
    text: 'NADP<sup>+</sup> 接收 H<sup>+</sup> 和 e<sup>-</sup>，形成 NADPH。'
  },
  {
    title: 'ATP 的形成',
    short: 'ATP合成',
    place: '类囊体薄膜',
    location: '类囊体薄膜',
    matter: 'ADP 和 Pi 合成 ATP',
    energy: '能量储存在 ATP 中',
    dest: 'ATP 为暗反应提供能量',
    formula: 'ADP + Pi + 能量 → ATP',
    text: '光反应把能量用于 ADP 和 Pi 合成 ATP。'
  },
  {
    title: 'CO₂ 的固定',
    short: 'CO<sub>2</sub>固定',
    place: '叶绿体基质',
    location: '叶绿体基质',
    matter: 'CO₂ 与 C₅ 结合生成 2C₃',
    energy: '碳进入卡尔文循环',
    dest: '进入 C₃ 的还原阶段',
    formula: 'CO<sub>2</sub> + C<sub>5</sub> → 2C<sub>3</sub>',
    text: '暗反应在叶绿体基质中进行，CO<sub>2</sub> 与 C<sub>5</sub> 结合生成 2C<sub>3</sub>。'
  },
  {
    title: 'C₃ 的还原',
    short: 'C<sub>3</sub>还原',
    place: '叶绿体基质',
    location: '叶绿体基质',
    matter: 'C₃ 利用 ATP 和 NADPH 被还原',
    energy: 'ATP 供能，NADPH 供氢和还原力',
    dest: '生成糖类并再生 C₅',
    formula: '2C<sub>3</sub> <span class="condition-arrow"><span>ATP、NADPH</span><i></i></span> (CH<sub>2</sub>O) + C<sub>5</sub>',
    text: 'C<sub>3</sub> 利用 ATP 和 NADPH 被还原，形成糖类，同时再生 C<sub>5</sub>。'
  },
  {
    title: '物质返回光反应',
    short: '返回',
    place: '回收通道',
    location: '叶绿体基质 → 类囊体薄膜',
    matter: 'ADP、Pi 和 NADP⁺ 返回光反应',
    energy: '等待下一轮光能转换',
    dest: '重新参与 ATP 和 NADPH 的形成',
    formula: '',
    text: '暗反应消耗 ATP 和 NADPH 后，产生 ADP、Pi 和 NADP<sup>+</sup>，它们返回光反应继续循环。'
  }
];

const moleculeInfo = {
  water: {
    title: 'H₂O 水',
    type: '光反应原料',
    text: '水在类囊体薄膜上被光解，产生 O₂、H⁺ 和 e⁻。H⁺ 和 e⁻ 会继续参与 NADPH 的形成。'
  },
  oxygen: {
    title: 'O₂ 氧气',
    type: '光反应产物',
    text: '氧气来自水的光解，是光反应释放出的产物，会从叶绿体中扩散出去。'
  },
  protonElectron: {
    title: 'H⁺ + e⁻',
    type: '还原力来源',
    text: 'H⁺ 和 e⁻ 来自水的光解，会被 NADP⁺ 接收，用来形成 NADPH。'
  },
  atp: {
    title: 'ATP',
    type: '能量载体',
    text: 'ATP 是光反应形成的直接能源物质，会进入暗反应，为 C₃ 的还原提供能量。'
  },
  nadph: {
    title: 'NADPH',
    type: '还原型辅酶II',
    text: 'NADPH 是还原型辅酶II，作为还原剂，在暗反应中为 C₃ 的还原提供氢、还原力和能量。'
  },
  co2: {
    title: 'CO₂ 二氧化碳',
    type: '暗反应原料',
    text: 'CO₂ 进入叶绿体基质，与 C₅ 结合并被固定，形成 2C₃。'
  },
  c3: {
    title: '2C₃',
    type: '三碳化合物',
    text: 'C₃ 是三碳化合物，是 CO₂ 固定后的产物，会利用 ATP 和 NADPH 被还原，形成糖类并促进 C₅ 再生。'
  },
  c5: {
    title: 'C₅',
    type: '五碳化合物',
    text: 'C₅ 是五碳化合物，可以接受 CO₂，参与 CO₂ 的固定。暗反应过程中 C₅ 会不断再生，维持循环。'
  },
  sugar: {
    title: '(CH₂O)',
    type: '糖类产物',
    text: '(CH₂O) 表示光合作用形成的糖类，是暗反应把 CO₂ 还原后生成的有机物。'
  },
  adpPi: {
    title: 'ADP + Pi',
    type: '返回光反应',
    text: '暗反应消耗 ATP 后产生 ADP 和 Pi，它们返回类囊体薄膜，等待下一轮合成 ATP。'
  },
  nadp: {
    title: 'NADP⁺',
    type: '返回光反应',
    text: 'NADP⁺ 是 NADPH 被消耗后的形式，会回到光反应，重新接收 H⁺ 和 e⁻。'
  }
};

const scene = document.querySelector('.scene');
const stepsEl = document.querySelector('#steps');
const playBtn = document.querySelector('#playBtn');
const backBtn = document.querySelector('#backBtn');
const nextBtn = document.querySelector('#nextBtn');
const resetBtn = document.querySelector('#resetBtn');
const nodes = Array.from(document.querySelectorAll('.step-marker'));
const fields = {
  badge: document.querySelector('#stageBadge'),
  index: document.querySelector('#stepIndex'),
  title: document.querySelector('#stepTitle'),
  text: document.querySelector('#stepText'),
  formula: document.querySelector('#stepFormula'),
  place: document.querySelector('#stepPlace'),
  location: document.querySelector('#stepLocation'),
  matter: document.querySelector('#stepMatter'),
  energy: document.querySelector('#stepEnergy'),
  dest: document.querySelector('#stepDest')
};
const infoDialog = document.querySelector('#moleculeInfoDialog');
const infoBackdrop = document.querySelector('#moleculeInfoBackdrop');
const infoClose = document.querySelector('#moleculeInfoClose');
const infoTitle = document.querySelector('#moleculeInfoTitle');
const infoType = document.querySelector('#moleculeInfoType');
const infoText = document.querySelector('#moleculeInfoText');

let index = 0;
let demoTimer = 0;
let lastInfoTrigger = null;

steps.forEach((step, stepIndex) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.innerHTML = step.short;
  button.addEventListener('click', () => setStep(stepIndex));
  stepsEl.append(button);
});

playBtn.addEventListener('click', () => {
  if (demoTimer) {
    stopDemo();
  } else {
    startDemo();
  }
  render();
});

backBtn.addEventListener('click', () => setStep(index - 1));
nextBtn.addEventListener('click', () => setStep(index + 1));
resetBtn.addEventListener('click', () => {
  stopDemo();
  setStep(0);
});

document.querySelectorAll('[data-info-key]').forEach((element) => {
  element.addEventListener('click', () => openMoleculeInfo(element.dataset.infoKey, element));
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMoleculeInfo(element.dataset.infoKey, element);
    }
  });
});

infoClose.addEventListener('click', closeMoleculeInfo);
infoBackdrop.addEventListener('click', closeMoleculeInfo);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !infoDialog.hidden) {
    closeMoleculeInfo();
    return;
  }
  if (event.key === 'ArrowRight') setStep(index + 1);
  if (event.key === 'ArrowLeft') setStep(index - 1);
  if (event.key === ' ') {
    event.preventDefault();
    playBtn.click();
  }
});

function setStep(next) {
  index = (next + steps.length) % steps.length;
  render();
}

function render() {
  const step = steps[index];
  scene.dataset.step = String(index);
  fields.index.textContent = `第 ${index + 1} 步 / ${steps.length}`;
  fields.title.textContent = step.title;
  fields.text.innerHTML = step.text;
  fields.formula.innerHTML = step.formula;
  fields.formula.classList.toggle('is-empty', !step.formula);
  fields.place.textContent = step.place;
  fields.location.textContent = step.location;
  fields.matter.textContent = step.matter;
  fields.energy.textContent = step.energy;
  fields.dest.textContent = step.dest;
  playBtn.textContent = demoTimer ? '停止' : '演示';
  nextBtn.disabled = false;
  nextBtn.setAttribute('aria-disabled', 'false');

  document.querySelectorAll('.steps button').forEach((button, i) => {
    button.classList.toggle('active', i === index);
    button.classList.toggle('complete', i < index);
    button.setAttribute('aria-current', i === index ? 'step' : 'false');
  });

  nodes.forEach((node) => {
    const nodeIndex = Number(node.dataset.hotspot);
    node.classList.toggle('is-current', nodeIndex === index);
    node.classList.toggle('is-complete', nodeIndex < index);
    node.classList.toggle('is-locked', false);
    node.setAttribute('aria-current', nodeIndex === index ? 'step' : 'false');
  });
}

function openMoleculeInfo(key, trigger) {
  const info = moleculeInfo[key];
  if (!info) return;

  lastInfoTrigger = trigger;
  infoTitle.textContent = info.title;
  infoType.textContent = info.type;
  infoText.textContent = info.text;
  infoDialog.hidden = false;
  infoBackdrop.hidden = false;
  infoClose.focus();
}

function closeMoleculeInfo() {
  infoDialog.hidden = true;
  infoBackdrop.hidden = true;
  if (lastInfoTrigger) {
    lastInfoTrigger.focus();
    lastInfoTrigger = null;
  }
}

function startDemo() {
  demoTimer = window.setInterval(() => setStep(index + 1), 1800);
}

function stopDemo() {
  if (demoTimer) {
    window.clearInterval(demoTimer);
    demoTimer = 0;
  }
}

render();
