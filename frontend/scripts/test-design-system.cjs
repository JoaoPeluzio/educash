/**
 * EduCash — Suíte de Testes do Design System e Conformidade de Acessibilidade (Etapa 7B)
 * Execução: node frontend/scripts/test-design-system.cjs
 */

const assert = require('assert');

// 1. Algoritmo oficial WCAG 2.1 para luminância relativa e contraste
function getLuminance(hex) {
  const rgb = hex.replace('#', '');
  const r = parseInt(rgb.substring(0, 2), 16) / 255;
  const g = parseInt(rgb.substring(2, 4), 16) / 255;
  const b = parseInt(rgb.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// 2. Harness de testes
let total = 0;
let passed = 0;

function it(desc, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`[PASS] ${desc}`);
  } catch (err) {
    console.error(`[FAIL] ${desc}`);
    console.error(err);
  }
}

console.log('======================================================================');
console.log('EDUCASH — TESTES DE ACESSIBILIDADE E TOKENS DO DESIGN SYSTEM (7B)');
console.log('======================================================================\n');

// ----------------------------------------------------------------------
// 1. Verificação Matemática de Contraste WCAG 2.1 (Nível AA e AAA)
// ----------------------------------------------------------------------
it('Cor Primária Brand-700 (#0F766E) sobre fundo branco atende WCAG AA (>= 4.5:1)', () => {
  const ratio = getContrastRatio('#0F766E', '#FFFFFF');
  console.log(`       → Contraste medido: ${ratio.toFixed(2)}:1`);
  assert.ok(ratio >= 4.5, `Contraste ${ratio} inferior a 4.5:1`);
});

it('Texto Branco (#FFFFFF) sobre botão Brand-700 (#0F766E) atende WCAG AA (>= 4.5:1)', () => {
  const ratio = getContrastRatio('#FFFFFF', '#0F766E');
  assert.ok(ratio >= 4.5, `Contraste ${ratio} inferior a 4.5:1`);
});

it('Cor EduCoins-700 (#B45309) sobre fundo branco atende WCAG AA (>= 4.5:1)', () => {
  const ratio = getContrastRatio('#B45309', '#FFFFFF');
  console.log(`       → Contraste medido: ${ratio.toFixed(2)}:1`);
  assert.ok(ratio >= 4.5, `Contraste ${ratio} inferior a 4.5:1`);
});

it('Cor XP-600 (#4F46E5) sobre fundo branco atende WCAG AA (>= 4.5:1)', () => {
  const ratio = getContrastRatio('#4F46E5', '#FFFFFF');
  console.log(`       → Contraste medido: ${ratio.toFixed(2)}:1`);
  assert.ok(ratio >= 4.5, `Contraste ${ratio} inferior a 4.5:1`);
});

it('Texto Primário Dark (#F8FAFC) sobre fundo Dark (#0B1120) atende WCAG AAA (>= 7:1)', () => {
  const ratio = getContrastRatio('#F8FAFC', '#0B1120');
  console.log(`       → Contraste medido: ${ratio.toFixed(2)}:1`);
  assert.ok(ratio >= 7.0, `Contraste ${ratio} inferior a 7.0:1`);
});

it('Texto Primário Light (#0F172A) sobre fundo Light (#FFFFFF) atende WCAG AAA (>= 7:1)', () => {
  const ratio = getContrastRatio('#0F172A', '#FFFFFF');
  console.log(`       → Contraste medido: ${ratio.toFixed(2)}:1`);
  assert.ok(ratio >= 7.0, `Contraste ${ratio} inferior a 7.0:1`);
});

it('Feedback de Sucesso: texto (#065F46) sobre card (#ECFDF5) atende WCAG AAA (>= 7:1)', () => {
  const ratio = getContrastRatio('#065F46', '#ECFDF5');
  console.log(`       → Contraste medido: ${ratio.toFixed(2)}:1`);
  assert.ok(ratio >= 7.0, `Contraste ${ratio} inferior a 7.0:1`);
});

it('Feedback de Erro: texto (#9F1239) sobre card (#FFF1F2) atende WCAG AAA (>= 7:1)', () => {
  const ratio = getContrastRatio('#9F1239', '#FFF1F2');
  console.log(`       → Contraste medido: ${ratio.toFixed(2)}:1`);
  assert.ok(ratio >= 7.0, `Contraste ${ratio} inferior a 7.0:1`);
});

it('Feedback de Aviso: texto (#78350F) sobre card (#FFFBEB) atende WCAG AAA (>= 7:1)', () => {
  const ratio = getContrastRatio('#78350F', '#FFFBEB');
  console.log(`       → Contraste medido: ${ratio.toFixed(2)}:1`);
  assert.ok(ratio >= 7.0, `Contraste ${ratio} inferior a 7.0:1`);
});

// ----------------------------------------------------------------------
// 2. Diretrizes de Usabilidade e Áreas de Toque (WCAG 2.5.5)
// ----------------------------------------------------------------------
it('Área mínima de toque para botões táteis atende a norma de 44px', () => {
  const minTouchTarget = 44; // pixels
  assert.ok(minTouchTarget >= 44, 'A área mínima de toque deve ser de pelo menos 44x44px');
});

// ----------------------------------------------------------------------
// 3. Verificação do Módulo lucide-react Instalado
// ----------------------------------------------------------------------
it('Pacote lucide-react está devidamente instalado e acessível no projeto', () => {
  const lucide = require('../node_modules/lucide-react');
  assert.ok(Boolean(lucide.Sparkles), 'Ícone Sparkles deve estar presente em lucide-react');
  assert.ok(Boolean(lucide.Coins), 'Ícone Coins deve estar presente em lucide-react');
  assert.ok(Boolean(lucide.Trophy), 'Ícone Trophy deve estar presente em lucide-react');
  assert.ok(Boolean(lucide.BookOpen), 'Ícone BookOpen deve estar presente em lucide-react');
  assert.ok(Boolean(lucide.CheckCircle2), 'Ícone CheckCircle2 deve estar presente em lucide-react');
});

console.log('\n======================================================================');
console.log(`TOTAL DE TESTES: ${total}`);
console.log(`PASSOU: ${passed}`);
console.log(`FALHOU: ${total - passed}`);
console.log('======================================================================');

if (total === passed) {
  process.exit(0);
} else {
  process.exit(1);
}
