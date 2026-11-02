// Simple line icons on a 64x64 grid. Rendered with currentColor, so CSS sets the colour.
const P = {
  crane: '<rect x="5" y="40" width="40" height="9" rx="2"/><path d="M10 40v-9h15v9M25 34L57 10M57 10v18M57 28v4"/><circle cx="15" cy="53" r="4"/><circle cx="35" cy="53" r="4"/>',
  crawler: '<rect x="6" y="48" width="34" height="8" rx="4"/><path d="M10 48v-9h24v9M30 39L53 8M24 39L47 8M53 8H47M53 8v14M53 22v6"/>',
  truckcrane: '<path d="M4 46V34h14v12M18 34l6-6h8v18M4 46h40"/><path d="M26 28L56 9M56 9v16"/><circle cx="12" cy="50" r="4"/><circle cx="32" cy="50" r="4"/><circle cx="44" cy="50" r="4"/>',
  tower: '<path d="M30 60V16M25 60h10M10 16h46M30 8l-14 8M30 8l18 8M48 16v12M16 16v8"/><path d="M26 24h8M26 32h8M26 40h8M26 48h8"/><rect x="42" y="28" width="12" height="8"/>',
  excavator: '<rect x="5" y="46" width="32" height="9" rx="4.5"/><path d="M10 46v-9h17l5 9M18 37v-8h8"/><path d="M26 33l14-18 12 6M52 21l6 14-9 3"/>',
  dozer: '<rect x="14" y="46" width="34" height="9" rx="4.5"/><path d="M20 46V32h16l6 14M24 32v-7h9"/><path d="M8 24v28M8 40h8"/>',
  loader: '<circle cx="18" cy="48" r="7"/><circle cx="42" cy="48" r="7"/><path d="M8 41V30h26l6 11M24 30v-8h9"/><path d="M42 36l10-14h8l-4 16z"/>',
  grader: '<circle cx="12" cy="48" r="6"/><circle cx="34" cy="48" r="6"/><circle cx="48" cy="48" r="6"/><path d="M4 42V32h12v10M16 32l4-6h8v16M28 40h30M40 42v6"/>',
  dumper: '<path d="M4 46V32h14l6 8M24 40h4"/><path d="M26 18h28l-4 24H26z"/><circle cx="14" cy="50" r="5"/><circle cx="42" cy="50" r="5"/>',
  backhoe: '<circle cx="16" cy="49" r="6"/><circle cx="38" cy="49" r="6"/><path d="M8 43V32h18l4 11M16 32v-8h8M38 32l12-16 8 6M58 22l-6 12h-8"/><path d="M4 46h6"/>',
  pipelayer: '<rect x="14" y="48" width="30" height="8" rx="4"/><path d="M20 48V36h14l5 12M24 36v-7h8"/><path d="M8 12v36M8 16h20M14 12h-12"/><circle cx="8" cy="52" r="3"/>',
  drill: '<path d="M32 6v36M26 14h12M26 22h12M26 30h12"/><path d="M32 42l-6 10M32 42l6 10M32 42v14"/><path d="M12 58h40M18 58V38h8M46 58V38h-8"/>',
  engine: '<path d="M8 22h8l4-6h20l4 6h8v22h-8l-4 6H20l-4-6H8z"/><path d="M26 30h12M26 38h12M4 28v10M60 28v10"/>',
  hydraulic: '<rect x="14" y="22" width="30" height="20" rx="3"/><path d="M44 28h16M44 36h10M8 32h6M6 28v8M20 22v-6h8v6M30 42v6h8v-6"/>',
  gearbox: '<circle cx="24" cy="32" r="12"/><circle cx="24" cy="32" r="4"/><circle cx="46" cy="20" r="7"/><path d="M24 14v-4M24 54v-4M6 32h-4M46 32h-4M11 19l-3-3M11 45l-3 3M37 19l3-3M37 45l3 3M46 10v-3M46 33v-3M56 20h3M33 20h-3"/>',
  track: '<rect x="4" y="22" width="56" height="20" rx="10"/><circle cx="14" cy="32" r="4"/><circle cx="32" cy="32" r="4"/><circle cx="50" cy="32" r="4"/><path d="M12 18h6M26 18h6M40 18h6M12 46h6M26 46h6M40 46h6"/>',
  mining: '<path d="M4 54l16-26 10 14 8-10 22 22z"/><path d="M40 18L52 6M44 6h8v8"/>',
  train: '<rect x="12" y="10" width="40" height="36" rx="8"/><path d="M12 28h40M22 18h20M22 38h2M40 38h2M20 56l6-10M44 56l-6-10"/>',
  hoist: '<path d="M4 12h56M4 20h56M14 12v8M50 12v8"/><rect x="24" y="20" width="16" height="10" rx="2"/><path d="M32 30v14M26 44h12l-2 10a4 4 0 01-8 0z"/>',
  ship: '<path d="M6 40h52l-8 14H14zM18 40V26h24v14M26 26v-8h10v8M32 18V8"/>',
  globe: '<circle cx="32" cy="32" r="24"/><path d="M8 32h48M32 8c-9 8-9 40 0 48M32 8c9 8 9 40 0 48"/>',
  shield: '<path d="M32 6l20 8v16c0 14-9 24-20 28C21 54 12 44 12 30V14z"/><path d="M23 32l7 7 12-14"/>',
  tool: '<path d="M44 8a12 12 0 00-12 16L8 48l8 8 24-24a12 12 0 0016-12l-8 8-8-2-2-8z"/>',
  search: '<circle cx="28" cy="28" r="18"/><path d="M42 42l16 16M20 28l6 6 10-12"/>',
  doc: '<path d="M14 6h26l12 12v40H14z"/><path d="M40 6v12h12M22 30h22M22 38h22M22 46h14"/>',
  fast: '<path d="M4 44V28h28v16M32 34h12l8 8v2H32M4 44h6M26 44h12"/><circle cx="16" cy="48" r="4"/><circle cx="44" cy="48" r="4"/><path d="M6 20h14M10 14h14"/>',
  people: '<circle cx="22" cy="20" r="8"/><circle cx="44" cy="24" r="6"/><path d="M6 54c0-12 8-18 16-18s16 6 16 18M40 38c10-2 18 4 18 16"/>',
};
const SMALL = {
  facebook: '<path fill="currentColor" d="M14 8.500V6.800c0-.8.200-1.300 1.400-1.300H17V2.600C16.700 2.500 15.800 2.400 14.700 2.400 12.300 2.400 10.700 3.800 10.700 6.500v2H8v3.200h2.700V21.600H14v-9.900h2.700l.4-3.200H14z"/>',
  linkedin: '<path fill="currentColor" d="M4.500 3.500a2 2 0 100 4 2 2 0 000-4zM3 9h3v12H3zM9 9h2.900v1.700h.1c.5-.9 1.700-1.900 3.500-1.900 3.700 0 4.500 2.400 4.500 5.600V21h-3v-5.900c0-1.400 0-3.200-2-3.200s-2.300 1.500-2.300 3.100V21H9z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.200" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.300" cy="6.700" r="1.200" fill="currentColor"/>',
  check: '<path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 7l9 7 9-7" fill="none" stroke="currentColor" stroke-width="2"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.800 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="9.500" r="2.500" fill="none" stroke="currentColor" stroke-width="2"/>',
  clock: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.400" stroke-linecap="round"/>',
  wa: '<path fill="currentColor" d="M12 2a10 10 0 00-8.600 15.100L2 22l5-1.300A10 10 0 1012 2zm0 18.200a8.200 8.200 0 01-4.200-1.200l-.3-.2-3 .8.8-2.900-.2-.3A8.200 8.200 0 1112 20.200zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.100l-.8 1c-.1.200-.3.200-.5.100a6.700 6.700 0 01-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.300 3 3 0 00-.9 2.200 5.200 5.200 0 001.100 2.800 11.900 11.900 0 004.600 4c1.700.7 2.400.8 3.200.7a2.700 2.700 0 001.800-1.300 2.200 2.200 0 00.2-1.300c0-.1-.2-.2-.4-.3z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/>',
  chev: '<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.400" stroke-linecap="round" stroke-linejoin="round"/>',
};
export const icon = (name, cls = '') =>
  P[name]
    ? `<svg class="${cls}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[name]}</svg>`
    : `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${SMALL[name] || ''}</svg>`;
