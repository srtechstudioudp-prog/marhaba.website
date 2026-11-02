# CLIENT-CHECKLIST (confirm before launch)

## Do first (Google visibility)
1. **Google Business Profile**: create or claim it with the exact name, address, phone, hours, categories and photos. Same NAP as the site.
2. Verify the domain in Google Search Console, submit `https://marhabaheavyequip.com/sitemap.xml`, then request indexing in batches (see SUBMISSION.md).
3. Ask 5 to 10 real customers for Google reviews. No fake or incentivised reviews.
4. 3 to 5 UAE directory listings with identical NAP; social profiles link back.

## Facts to confirm
| Item | Where it appears | Issue |
|---|---|---|
| Address (RESOLVED) | footer, schema, contact | Office D20, Al Nayli Building, Bin Laden Street, Industrial Area 13, Sharjah, from their live Yellow Pages listing. Still need a map pin (geo) and the Google Business Profile link for schema |
| Mobile and WhatsApp +971 50 241 6414 | all pages, WhatsApp button | Confirmed by the Yellow Pages listing |
| Services not yet given a page | home, about | Forklifts, skid steer loaders, piling rigs, scrapers, pumps, generator parts, thrusters, crane and rigging services. Confirm what "crane and rigging services" means (hire? installation?) before we write it |
| Used equipment details | /used-equipment/ and product pages | Listing says used cranes, EOT, JIB, dozers, excavators, dump trucks, mining trucks. Confirm whether any warranty is offered, and typical age and hours ranges |
| Hours Sun to Thu 8:00 to 18:00 | header, contact | From the old site. Not in schema until confirmed |
| Crane range 20 to 1,600 tons | cranes pages | From the old site. Confirm it is still accurate |
| Years in business | not used | Old "over a decade" vs Odoo "20+ years". Give the real number |
| Customer, country and product counts | not used | Odoo stats are unverified. Send evidence to use them |
| New, used or both | product pages say "stated in each offer" | Tell us the real mix so the copy can be sharper |
| Authorised dealer status | not claimed | Confirm if any brand authorises them, and the wording allowed |
| Genuine/OEM, certifications, delivery times, prices | not claimed | Provide proof before we add |
| Brand names on home and pages | brand chips, FAQs | Confirm they are happy to name these brands |
| Replies in other languages | contact FAQ says write in English | Confirm |
| Trade licence documents shared for due diligence | about FAQ | Confirm they will share |

## Images and brand
- Hero and category photos are the 4 slider images from the old site. They show Komatsu, Liebherr and Cat machines (manufacturer marketing photos). **Replace with the client's own machine photos**, or confirm the rights to use these.
- The original logo is a 430x80 PNG with a "Hello !! World" tagline. The site uses a simplified "M" mark (navy and amber) and a text wordmark. Client to supply a vector logo, then update the header and favicon.
- Colours changed from the old red and blue to navy and safety amber. Confirm the client accepts.

## Technical
- Host: canonicals and sitemap use `https://marhabaheavyequip.com` (no www). Redirect www to non-www, or change `CFG.site` in `site/build.mjs` and rebuild.
- The Odoo draft must not stay indexed as a duplicate. Old URLs redirect through `vercel.json`.
- The enquiry form opens WhatsApp or email with the message pre-filled. There is no backend and no data is stored. A form endpoint can be added later.
- Privacy policy and terms pages are not built yet.
