// Static site generator for marhabaheavyequip.com
// Content: site/content/*.mjs (each exports default array of page objects). Output: public/
// Usage: node site/build.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { icon } from './icons.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public');
const CHECK = process.argv.includes('--check');

export const CFG = {
  site: 'https://marhabaheavyequip.com',
  brand: 'Marhaba Heavy Equipment',
  legal: 'Marhaba Heavy Equipment Trading LLC',
  alt: ['Marhaba Heavy Equip', 'marhabaheavyequip.com'],
  phone: '+971 6 535 0026', tel: '+97165350026',
  mobile: '+971 50 241 6414', wa: '971502416414',
  email: 'marhaba@marhabaheavyequip.com',
  hours: 'Sunday to Thursday, 8:00 to 18:00',
  addr: 'Office D20, Al Nayli Building, Bin Laden Street, Industrial Area 13, Sharjah, United Arab Emirates',
  street: 'Office D20, Al Nayli Building, Bin Laden Street, Industrial Area 13', city: 'Sharjah', country: 'AE',
  social: [
    'https://www.facebook.com/share/17Uqh8qtCC/',
    'https://www.linkedin.com/company/marhaba-heavy-equip-tr-llc/',
    'https://www.instagram.com/marhabaheavyequip',
  ],
  date: '2026-11-02',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// inline markup: [text](/path/) and **bold**; text is escaped first
const md = (s) => esc(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

// ---------- load content ----------
const pages = [];
for (const f of fs.readdirSync(path.join(ROOT, 'site/content')).filter((f) => f.endsWith('.mjs')).sort()) {
  const mod = await import(pathToFileURL(path.join(ROOT, 'site/content', f)).href);
  pages.push(...mod.default);
}
const byPath = Object.fromEntries(pages.map((p) => [p.path, p]));
const kids = (parent) => pages.filter((p) => p.parent === parent);

// ---------- assets ----------
const hashOf = (f) => crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, 'site/assets', f))).digest('hex').slice(0, 8);
const V = { css: hashOf('css/main.css'), js: hashOf('js/main.js') };
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

// ---------- shared pieces ----------
const url = (p) => CFG.site + p;
const IMG = (k, w = 1366) => `/assets/img/${k}-${w}.webp`;
const picture = (k, alt, { eager = false, sizes = '100vw' } = {}) =>
  `<picture><source type="image/webp" srcset="${IMG(k, 800)} 800w, ${IMG(k)} 1366w" sizes="${sizes}"><img src="/assets/img/${k}-800.jpg" width="1366" height="650" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}></picture>`;

const CATS = [
  { path: '/cranes/', name: 'Cranes' },
  { path: '/heavy-equipment/', name: 'Heavy Equipment' },
  { path: '/spare-parts/', name: 'Spare Parts' },
];

function breadcrumbs(p) {
  const trail = [{ name: 'Home', path: '/' }];
  if (p.parent && byPath[p.parent]) {
    const par = byPath[p.parent];
    if (par.parent && byPath[par.parent]) trail.push({ name: byPath[par.parent].crumb || byPath[par.parent].h1, path: par.parent });
    trail.push({ name: par.crumb || par.h1, path: par.path });
  }
  if (p.path !== '/') trail.push({ name: p.crumb || p.h1, path: p.path });
  return trail;
}
const crumbsHtml = (trail) =>
  `<nav class="crumbs" aria-label="Breadcrumb"><ol>${trail.map((t, i) => (i === trail.length - 1 ? `<li><span aria-current="page">${esc(t.name)}</span></li>` : `<li><a href="${t.path}">${esc(t.name)}</a></li>`)).join('')}</ol></nav>`;

function header(cur) {
  const col = (c) => {
    const hub = byPath[c.path];
    if (!hub) return '';
    return `<div><h4>${c.name}</h4>${kids(c.path).map((k) => `<a href="${k.path}">${esc(k.crumb || k.h1)}</a>`).join('')}<a href="${c.path}"><strong>View all ${c.name.toLowerCase()}</strong></a></div>`;
  };
  const link = (p, label) => (byPath[p] ? `<a href="${p}"${cur === p ? ' aria-current="page"' : ''}>${label}</a>` : '');
  return `<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap"><div class="tb-l"><span class="i">${icon('pin')}${esc(CFG.addr)}</span></div><div class="tb-r"><a class="i" href="tel:${CFG.tel}">${icon('phone')}${CFG.phone}</a><a class="i" href="mailto:${CFG.email}">${icon('mail')}${CFG.email}</a></div></div></div>
<header class="hdr"><div class="wrap">
<a class="brand" href="/" aria-label="${CFG.brand} home"><img src="/assets/img/logo.png" width="290" height="52" alt="Marhaba Heavy Equipment logo"></a>
<button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="nav">${icon('menu')}</button>
<nav class="nav" id="nav" aria-label="Main">
${link('/', 'Home')}
<div class="dd"><button aria-expanded="false" aria-haspopup="true">Products ${icon('chev', 'ch')}</button><div class="dd-menu">${CATS.map(col).join('')}</div></div>
${link('/export/', 'Export')}${link('/industries/', 'Industries')}${link('/guides/', 'Guides')}${link('/about/', 'About')}${link('/contact/', 'Contact')}
<a class="btn btn-primary" href="/contact/">Request a quote</a>
</nav></div></header>`;
}

function footer() {
  const list = (c) => `<div><h4>${c.name}</h4>${kids(c.path).slice(0, 9).map((k) => `<a href="${k.path}">${esc(k.crumb || k.h1)}</a>`).join('')}</div>`;
  const comp = ['/about/', '/export/', '/industries/', '/guides/', '/contact/'].filter((p) => byPath[p]).map((p) => `<a href="${p}">${esc(byPath[p].crumb || byPath[p].h1)}</a>`).join('');
  return `<footer class="ftr"><div class="wrap"><div class="top">
<div><a class="brand" href="/"><img src="/assets/img/logo.png" width="290" height="52" alt="Marhaba Heavy Equipment logo"></a>
<p>${esc(CFG.legal)}. Cranes, heavy equipment and spare parts supplied from Sharjah, UAE.</p>
<a href="tel:${CFG.tel}">${CFG.phone}</a><a href="tel:+${CFG.wa}">${CFG.mobile}</a><a href="mailto:${CFG.email}">${CFG.email}</a><p style="margin-top:10px">${esc(CFG.addr)}<br>${esc(CFG.hours)}</p></div>
${CATS.map(list).join('')}
<div><h4>Company</h4>${comp}${CFG.social.map((s) => `<a href="${s}" rel="noopener" target="_blank">${s.includes('facebook') ? 'Facebook' : s.includes('linkedin') ? 'LinkedIn' : 'Instagram'}</a>`).join('')}</div>
</div><div class="bot"><span>&copy; ${new Date().getFullYear()} ${esc(CFG.legal)}. All rights reserved.</span><span>Brand names are used for reference only and belong to their owners.</span></div></div></footer>
<a class="wafab" href="https://wa.me/${CFG.wa}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon('wa')}</a>`;
}

const SELECT = ['Cranes', 'Excavators', 'Bulldozers / dozers', 'Wheel loaders', 'Other heavy equipment', 'Spare parts / components', 'Other'];
function enquiry(preset = '', title = 'Request a quote', sub = 'Tell us what you need. We reply with an offer, pictures and inspection details where available.') {
  return `<form class="enq formcard" data-preset="${esc(preset)}" novalidate><h3>${esc(title)}</h3><p>${esc(sub)}</p>
<div class="row2"><div class="fld"><label for="f-name">Your name *</label><input id="f-name" name="name" autocomplete="name" required></div><div class="fld"><label for="f-phone">Phone / WhatsApp</label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div></div>
<div class="row2"><div class="fld"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization"></div><div class="fld"><label for="f-cat">Looking for</label><select id="f-cat" name="category">${SELECT.map((o) => `<option>${o}</option>`).join('')}</select></div></div>
<div class="row2"><div class="fld"><label for="f-model">Brand, model or part number</label><input id="f-model" name="model"></div><div class="fld"><label for="f-country">Delivery country / port</label><input id="f-country" name="country"></div></div>
<div class="fld"><label for="f-msg">Details *</label><textarea id="f-msg" name="message" rows="4" placeholder="Capacity, quantity, working hours, year range, application..." required></textarea></div>
<div class="fbtns"><button type="button" class="btn btn-wa" data-send="wa">${icon('wa')} Send on WhatsApp</button><button type="button" class="btn btn-dark" data-send="mail">${icon('mail')} Send by email</button></div>
<p class="fnote">Pressing a button opens WhatsApp or your email app with your message ready to send. Nothing is stored on this website.</p></form>`;
}

function ctaBand(preset, h = 'Tell us what you need') {
  return `<section class="cband on-dark" id="quote"><div class="wrap"><div><span class="eyebrow">Get an offer</span><h2>${esc(h)}</h2>
<p>Send the machine type, capacity or part number and your delivery port. We reply with an offer, pictures and inspection details where available.</p>
<ul><li>${icon('check')}Offer for stock on hand or machines at other locations</li><li>${icon('check')}Pictures and inspection reports reviewed before you order</li><li>${icon('check')}Sea or air freight arranged to your destination port</li></ul>
<p>Prefer to talk? Call <a href="tel:${CFG.tel}" style="color:var(--amber)">${CFG.phone}</a> or WhatsApp <a href="https://wa.me/${CFG.wa}" style="color:var(--amber)">${CFG.mobile}</a>.</p></div>${enquiry(preset)}</div></section>`;
}

const faqHtml = (faq, h = 'Frequently asked questions') =>
  `<section id="faq" class="faq"><h2>${esc(h)}</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div class="a"><p>${md(a)}</p></div></details>`).join('')}</section>`;

function sectionHtml(s) {
  let h = '';
  if (s.h) h += `<h2 id="${s.id}">${esc(s.h)}</h2>`;
  for (const p of s.p || []) h += `<p>${md(p)}</p>`;
  if (s.ul) h += `<ul>${s.ul.map((i) => `<li>${md(i)}</li>`).join('')}</ul>`;
  if (s.ol) h += `<ol>${s.ol.map((i) => `<li>${md(i)}</li>`).join('')}</ol>`;
  if (s.table) {
    const t = s.table;
    h += `<div class="tbl" tabindex="0" role="region" aria-label="${esc(t.label || s.h)}"><table><thead><tr>${t.head.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${md(c)}</th>` : `<td>${md(c)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (t.note) h += `<p class="cap">${md(t.note)}</p>`;
  }
  for (const sub of s.sub || []) {
    h += `<h3>${esc(sub.h)}</h3>`;
    for (const p of sub.p || []) h += `<p>${md(p)}</p>`;
    if (sub.ul) h += `<ul>${sub.ul.map((i) => `<li>${md(i)}</li>`).join('')}</ul>`;
  }
  return h;
}
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- JSON-LD ----------
const ORG_ID = url('/#organization'), SITE_ID = url('/#website');
function orgNode() {
  return {
    '@type': 'LocalBusiness', '@id': ORG_ID, name: CFG.brand, legalName: CFG.legal, alternateName: CFG.alt,
    url: url('/'), logo: { '@type': 'ImageObject', url: url('/assets/img/favicon-512.png'), width: 512, height: 512 },
    image: url(IMG('mining-fleet')), description: 'Supplier of cranes, heavy construction and mining equipment and spare parts from Sharjah, UAE, shipping to customers worldwide.',
    telephone: [CFG.tel, '+' + CFG.wa], email: CFG.email,
    address: { '@type': 'PostalAddress', streetAddress: CFG.street, addressLocality: CFG.city, addressCountry: CFG.country },
    areaServed: ['AE', 'SA', 'OM', 'QA', 'IN', 'Africa', 'Asia', 'Europe'].map((n) => (n.length === 2 ? { '@type': 'Country', name: n } : { '@type': 'Place', name: n })),
    knowsAbout: ['Cranes', 'Heavy construction equipment', 'Mining equipment', 'Equipment spare parts'],
    sameAs: CFG.social,
  };
}
function schema(p, trail) {
  const g = [orgNode()];
  if (p.path === '/') g.push({ '@type': 'WebSite', '@id': SITE_ID, url: url('/'), name: CFG.brand, alternateName: CFG.alt, inLanguage: 'en', publisher: { '@id': ORG_ID } });
  const pageId = url(p.path) + '#webpage';
  const wpType = { home: 'WebPage', about: 'AboutPage', contact: 'ContactPage', hub: 'CollectionPage' }[p.type] || 'WebPage';
  const wp = { '@type': wpType, '@id': pageId, url: url(p.path), name: p.title, description: p.meta, inLanguage: 'en', isPartOf: { '@id': SITE_ID }, about: { '@id': ORG_ID }, breadcrumb: { '@id': url(p.path) + '#breadcrumb' } };
  if (p.img) {
    wp.primaryImageOfPage = { '@id': url(p.path) + '#image' };
    g.push({ '@type': 'ImageObject', '@id': url(p.path) + '#image', contentUrl: url(IMG(p.img)), url: url(IMG(p.img)), width: 1366, height: 650, name: p.imgAlt, caption: p.imgAlt });
  }
  g.push(wp);
  g.push({ '@type': 'BreadcrumbList', '@id': url(p.path) + '#breadcrumb', itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: url(t.path) })) });
  if (p.type === 'hub') {
    const ks = kids(p.path);
    if (ks.length) wp.mainEntity = { '@type': 'ItemList', itemListElement: ks.map((k, i) => ({ '@type': 'ListItem', position: i + 1, url: url(k.path), name: k.h1 })) };
  }
  if (p.type === 'item') {
    g.push({ '@type': 'Service', '@id': url(p.path) + '#service', name: p.h1, serviceType: p.serviceType || p.h1, description: p.meta, provider: { '@id': ORG_ID }, areaServed: [{ '@type': 'Country', name: 'AE' }, { '@type': 'Place', name: 'Worldwide' }], url: url(p.path) });
  }
  if (p.type === 'guide') {
    g.push({ '@type': 'Article', '@id': url(p.path) + '#article', headline: p.h1, description: p.meta, datePublished: p.date || CFG.date, dateModified: p.date || CFG.date, author: { '@id': ORG_ID }, publisher: { '@id': ORG_ID }, mainEntityOfPage: { '@id': pageId }, ...(p.img ? { image: url(IMG(p.img)) } : {}) });
  }
  if (p.faq && p.faq.length) g.push({ '@type': 'FAQPage', '@id': url(p.path) + '#faq', mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: strip(md(a)) } })) });
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': g })}</script>`;
}

// ---------- document shell ----------
function doc(p, bodyInner, trail) {
  const img = p.img ? url(IMG(p.img)) : url('/assets/img/favicon-512.png');
  const ogType = p.type === 'guide' ? 'article' : 'website';
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.meta)}">
<link rel="canonical" href="${url(p.path)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#0a1b33">
<meta property="og:site_name" content="${CFG.brand}"><meta property="og:type" content="${ogType}"><meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.meta)}"><meta property="og:url" content="${url(p.path)}"><meta property="og:image" content="${img}"><meta property="og:locale" content="en_AE">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(p.title)}"><meta name="twitter:description" content="${esc(p.meta)}"><meta name="twitter:image" content="${img}">
<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" type="image/png" sizes="96x96" href="/assets/img/favicon-96.png"><link rel="icon" type="image/png" sizes="192x192" href="/assets/img/favicon-192.png"><link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/main.css?v=${V.css}">
${schema(p, trail)}
</head><body>
${header(p.path)}
<main id="main">
${bodyInner}
</main>
${footer()}
<script src="/assets/js/main.js?v=${V.js}" defer></script>
</body></html>`;
}

// ---------- page renderers ----------
function hero(p, trail, { home = false } = {}) {
  const bg = p.img ? picture(p.img, p.imgAlt || '', { eager: true }) : '';
  const ic = !p.img && p.icon ? `<div class="heroicon">${icon(p.icon)}</div>` : '';
  return `<section class="hero${home ? ' home' : ''}">${bg}${ic}<div class="wrap">${home ? '' : `<div class="crumbs">${crumbsHtml(trail)}</div>`}
${p.eyebrow ? `<span class="eyebrow">${esc(p.eyebrow)}</span>` : ''}<h1>${esc(p.h1)}</h1><p class="lead">${md(p.answer)}</p>
<div class="cta"><a class="btn btn-primary" href="${p.ctaHref || '#quote'}">${esc(p.cta || 'Request a quote')} ${icon('arrow')}</a><a class="btn btn-ghost" href="tel:${CFG.tel}">${icon('phone')} ${CFG.phone}</a></div></div></section>`;
}

function renderStandard(p) {
  const trail = breadcrumbs(p);
  const secs = (p.sections || []).map((s) => ({ ...s, id: s.id || slug(s.h || '') }));
  const toc = [...secs.filter((s) => s.h).map((s) => [s.id, s.h]), ...(p.faq ? [['faq', 'FAQs']] : [])];
  let body = '';
  if (p.features) body += `<ul class="feat">${p.features.map((f) => `<li>${icon('check')}<span>${md(f)}</span></li>`).join('')}</ul>`;
  if (p.story) body += `<p class="story">${md(p.story)}</p>`;
  const children = p.type === 'hub' ? kids(p.path) : [];
  if (children.length) {
    body += `<h2 id="types">${esc(p.childrenH || 'Types we supply')}</h2><div class="grid g2" style="margin-bottom:2em">${children.map((k) => `<a class="card" href="${k.path}"><div class="ico">${icon(k.icon || 'tool')}</div><h3>${esc(k.h1.replace(/ in the UAE.*| UAE$/i, ''))}</h3><p>${esc(k.card || k.meta)}</p><span class="go">Explore ${icon('arrow')}</span></a>`).join('')}</div>`;
    toc.unshift(['types', p.childrenH || 'Types we supply']);
  }
  for (const s of secs) body += sectionHtml(s);
  if (p.faq) body += faqHtml(p.faq);
  // related
  const rel = [...new Set([...(p.related || []), ...(p.parent ? [p.parent] : []), ...kids(p.parent || '#none').map((k) => k.path).filter((x) => x !== p.path)])].filter((x) => byPath[x] && x !== p.path).slice(0, 8);
  const relHtml = rel.length ? `<div class="box"><h4>Related pages</h4><ul class="relist">${rel.map((r) => `<li><a href="${r}">${esc(byPath[r].crumb || byPath[r].h1)}</a></li>`).join('')}</ul></div>` : '';
  const side = `<aside class="side"><div class="box quote"><h4>Get an offer</h4><p><b>${esc(p.sideH || 'Need this equipment?')}</b></p><p>Send the model, capacity or part number and your delivery port.</p><a class="btn btn-primary" href="#quote">Request a quote</a><a class="btn btn-ghost" href="https://wa.me/${CFG.wa}" target="_blank" rel="noopener">${icon('wa')} WhatsApp</a></div>
<div class="box toc"><h4>On this page</h4><ol>${toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join('')}</ol></div>${relHtml}</aside>`;
  const inner = `${hero(p, trail)}<section class="sec"><div class="wrap layout"><article class="prose">${body}</article>${side}</div></section>${ctaBand(p.preset || '', p.ctaH)}`;
  return doc(p, inner, trail);
}

function renderContact(p) {
  const trail = breadcrumbs(p);
  const body = `<div class="cinfo"><div class="c">${icon('pin')}<div><b>Address</b>${esc(CFG.addr)}</div></div>
<div class="c">${icon('phone')}<div><b>Phone</b><a href="tel:${CFG.tel}">${CFG.phone}</a><br><a href="tel:+${CFG.wa}">${CFG.mobile}</a> (also on WhatsApp)</div></div>
<div class="c">${icon('mail')}<div><b>Email</b><a href="mailto:${CFG.email}">${CFG.email}</a></div></div>
<div class="c">${icon('clock')}<div><b>Working hours</b>${esc(CFG.hours)}</div></div></div>`;
  const secs = (p.sections || []).map((s) => ({ ...s, id: s.id || slug(s.h || '') }));
  const inner = `${hero(p, trail)}<section class="sec"><div class="wrap grid g2" style="align-items:start"><div>${body}<div class="prose" style="margin-top:36px">${secs.map(sectionHtml).join('')}</div></div>${enquiry('', 'Send an enquiry')}</div></section>
<section class="sec alt"><div class="wrap prose" style="max-width:900px">${faqHtml(p.faq)}</div></section>`;
  return doc(p, inner, trail);
}

function renderHome(p) {
  const trail = [{ name: 'Home', path: '/' }];
  const H = p.home;
  const catCards = H.cats.map((c, i) => `<a class="cat" href="${c.href}"><img src="/assets/img/${c.img}-800.jpg" width="800" height="380" loading="lazy" decoding="async" alt="${esc(c.alt)}"><span class="num">0${i + 1}</span><div class="in"><h3>${esc(c.name)}</h3><p>${esc(c.text)}</p><span class="more">${esc(c.more)} &rarr;</span></div></a>`).join('');
  const types = H.types.filter((t) => byPath[t.href]).map((t) => `<a class="card" href="${t.href}"><div class="ico">${icon(t.icon)}</div><h3>${esc(t.name)}</h3><p>${esc(t.text)}</p></a>`).join('');
  const inner = `${hero(p, trail, { home: true })}
<div class="facts"><div class="wrap">${H.facts.map((f) => `<div class="f">${icon(f.icon)}<div><b>${esc(f.b)}</b><span>${esc(f.s)}</span></div></div>`).join('')}</div></div>
<section class="sec"><div class="wrap"><div class="sec-h c"><span class="eyebrow">What we supply</span><h2>${esc(H.catsH)}</h2><p>${md(H.catsP)}</p></div><div class="grid g3">${catCards}</div></div></section>
<section class="sec alt"><div class="wrap"><div class="sec-h c"><span class="eyebrow">Equipment range</span><h2>${esc(H.typesH)}</h2><p>${md(H.typesP)}</p></div><div class="grid g4">${types}</div></div></section>
<section class="sec dark on-dark"><div class="wrap"><div class="sec-h c"><span class="eyebrow">How an order works</span><h2>${esc(H.stepsH)}</h2><p>${md(H.stepsP)}</p></div><div class="steps">${H.steps.map((s) => `<div class="step"><h3>${esc(s[0])}</h3><p>${md(s[1])}</p></div>`).join('')}</div></div></section>
<section class="sec"><div class="wrap layout"><article class="prose">${(p.sections || []).map((s) => sectionHtml({ ...s, id: slug(s.h || '') })).join('')}
<h2 id="brands">Brands we handle enquiries for</h2><p>${md(H.brandsP)}</p><div class="chips">${H.brands.map((b) => `<span class="chip">${esc(b)}</span>`).join('')}</div><p class="note">${esc(H.brandsNote)}</p></article>
<aside class="side"><div class="box quote"><h4>Talk to the team</h4><p><b>${CFG.phone}</b></p><p>${esc(CFG.hours)}</p><a class="btn btn-primary" href="#quote">Request a quote</a><a class="btn btn-ghost" href="https://wa.me/${CFG.wa}" target="_blank" rel="noopener">${icon('wa')} WhatsApp</a></div></aside></div></section>
<section class="sec alt"><div class="wrap prose" style="max-width:900px">${faqHtml(p.faq)}</div></section>${ctaBand('', 'Start with an enquiry')}`;
  return doc(p, inner, trail);
}

// ---------- write ----------
function write(file, data) {
  const f = path.join(OUT, file);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
}
fs.rmSync(path.join(OUT, 'assets/css'), { recursive: true, force: true });
fs.rmSync(path.join(OUT, 'assets/js'), { recursive: true, force: true });
copyDir(path.join(ROOT, 'site/assets/css'), path.join(OUT, 'assets/css'));
copyDir(path.join(ROOT, 'site/assets/js'), path.join(OUT, 'assets/js'));

const report = [];
const allHrefs = new Map();
for (const p of pages) {
  const html = p.type === 'home' ? renderHome(p) : p.type === 'contact' ? renderContact(p) : renderStandard(p);
  write(p.path === '/' ? 'index.html' : path.join(p.path, 'index.html'), html);
  const main = html.split('<main id="main">')[1].split('</main>')[0];
  const words = strip(main).split(' ').length;
  const links = [...main.matchAll(/href="(\/[^"#]*)[^"]*"/g)].map((m) => m[1]).filter((h) => !h.startsWith('/assets'));
  allHrefs.set(p.path, links);
  const warn = [];
  if (p.title.length > 60) warn.push(`title ${p.title.length}>60`);
  if (p.meta.length < 120 || p.meta.length > 160) warn.push(`meta ${p.meta.length}`);
  if (!p.faq || p.faq.length < 10) warn.push(`faq ${p.faq ? p.faq.length : 0}<10`);
  const wc = (main.match(/<h1/g) || []).length;
  if (wc !== 1) warn.push(`h1 x${wc}`);
  const internal = new Set(links.filter((l) => l !== p.path)).size;
  if (internal < 5) warn.push(`links ${internal}<5`);
  const ans = p.answer ? p.answer.split(/\s+/).length : 0;
  if (ans < 35 || ans > 65) warn.push(`answer ${ans}w`);
  const tables = (main.match(/<table/g) || []).length;
  if (p.type === 'item' && tables < 2) warn.push(`tables ${tables}<2`);
  report.push({ path: p.path, words, faq: p.faq ? p.faq.length : 0, internal, tables, warn });
}
// broken internal links
const broken = [];
for (const [from, links] of allHrefs) for (const l of links) if (!byPath[l] && !['/favicon.ico'].includes(l)) broken.push(`${from} -> ${l}`);

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `<url><loc>${url(p.path)}</loc><lastmod>${p.date || CFG.date}</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${url('/sitemap.xml')}\n`);
write('404.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | ${CFG.brand}</title><meta name="robots" content="noindex"><link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="stylesheet" href="/assets/css/main.css?v=${V.css}"></head><body>${header('')}<main id="main"><section class="sec"><div class="wrap" style="text-align:center;max-width:680px"><span class="eyebrow">Error 404</span><h1>Page not found</h1><p>The page you asked for has moved or does not exist. Browse our equipment or contact the team.</p><p><a class="btn btn-primary" href="/">Go to home page</a> <a class="btn btn-line" href="/contact/">Contact us</a></p></div></section></main>${footer()}<script src="/assets/js/main.js?v=${V.js}" defer></script></body></html>`);

console.log('\nPAGE'.padEnd(34), 'words faq links tbl  warnings');
for (const r of report) console.log(r.path.padEnd(33), String(r.words).padStart(5), String(r.faq).padStart(3), String(r.internal).padStart(5), String(r.tables).padStart(3), ' ', r.warn.join('; '));
console.log(`\n${pages.length} pages built.`);
if (broken.length) { console.log('\nBROKEN INTERNAL LINKS:\n' + broken.join('\n')); process.exitCode = 1; }
