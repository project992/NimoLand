/* Generates src/lib/icons.js from the installed @lucide/astro package, so the
   client SPA's template-literal markup uses genuine Lucide geometry instead of
   hand-copied path data.

   Run: node scripts/gen-icons.mjs  (or `npm run icons`) */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const NAMES = [
  'map-pin', 'star', 'arrow-right', 'arrow-left', 'chevron-down', 'chevron-left',
  'chevron-right', 'x', 'search', 'zoom-in', 'users', 'bed-double', 'ticket',
  'check', 'badge-check', 'calendar', 'clock', 'shield-check', 'log-in',
  'log-out', 'circle-alert', 'info', 'minus', 'plus', 'menu', 'message-circle',
  'download', 'lock', 'user', 'user-plus', 'sun', 'mountain',
  'utensils', 'camera', 'trees', 'waves-horizontal', 'sparkles', 'wifi', 'car',
  'triangle-alert', 'circle-check', 'eye', 'sunrise', 'tent', 'house',
];

const missing = NAMES.filter(n => !existsSync(`node_modules/@lucide/astro/src/icons/${n}.ts`));
if (missing.length) throw new Error(`icons not in @lucide/astro: ${missing.join(', ')}`);

const toChildren = nodes =>
  nodes.map(([tag, attrs]) =>
    `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`
  ).join('');

const entries = NAMES.map(name => {
  const src = readFileSync(`node_modules/@lucide/astro/src/icons/${name}.ts`, 'utf8');
  const m = src.match(/createLucideIcon\('[^']+',\s*(\[[\s\S]*?\])\)\s*as AstroComponent/);
  if (!m) throw new Error(`could not parse icon: ${name}`);
  return `  '${name}': '${toChildren(JSON.parse(m[1]))}',`;
}).join('\n');

writeFileSync('src/lib/icons.js', `/* AUTO-GENERATED from @lucide/astro — do not edit by hand.
   Regenerate with: npm run icons

   The client SPA builds markup with template strings and so cannot use .astro
   icon components. Server-rendered markup imports '@lucide/astro/icons/<name>'
   directly instead. Both draw from the same Lucide set. */

const PATHS = {
${entries}
};

/**
 * Inline a Lucide icon as an SVG string, for template-literal markup.
 * @param {string} name  kebab-case Lucide icon name
 * @param {string} cls   classes applied to the <svg>
 * @param {number} width stroke width
 */
export function icon(name, cls = 'w-4 h-4', width = 1.75) {
  const children = PATHS[name];
  if (!children) throw new Error('unknown icon: ' + name);
  return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
    ' stroke-width="' + width + '" stroke-linecap="round" stroke-linejoin="round"' +
    ' aria-hidden="true">' + children + '</svg>';
}

export const ICON_NAMES = Object.keys(PATHS);
`);

console.log(`wrote src/lib/icons.js (${NAMES.length} icons)`);
