"""Clean the scraped Odoo shop data (_src/odoo/products.json) into site/data/products.json
and build web images (public/assets/img/p/). Run: python -I tools/make_products.py"""
import json, os, re
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_src", "odoo", "products.json")
OUT_IMG = os.path.join(ROOT, "public", "assets", "img", "p")
OUT_JSON = os.path.join(ROOT, "site", "data", "products.json")
os.makedirs(OUT_IMG, exist_ok=True)
os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)

CAT_PAGE = {
    "cranes-2": "/cranes/", "heavy-equipment-3": "/heavy-equipment/", "eot-crane-components-5": "/eot-crane-components/",
    "mining-spares-1": "/mining-spares/", "locomotive-spares-4": "/locomotive-spares/",
}
# Hand-fixed names where the Odoo title is a raw SKU. Capacity left out where the listing looks wrong (see CLIENT-CHECKLIST).
NAME = {
    "2026-60ton-beml-bh60": ("BEML BH60 Rigid Dump Truck", "60 tons"),
    "2026-100ton-beml-bh100": ("BEML BH100 Rigid Dump Truck", "100 tons"),
    "2026-35ton-beml-bh35-2": ("BEML BH35-2 Rigid Dump Truck", "35 tons"),
    "2026-beml-bd355": ("BEML BD355 Crawler Dozer", None),
    "2026-1000ton-beml-be1000": ("BEML BE1000 Tracked Excavator", None),
    "2026-150ton-beml-bh150e": ("BEML BE150 Hydraulic Excavator", "150 tons"),
    "all-terrain-mobile-crane": ("Liebherr LTM 1060-3.1 All Terrain Mobile Crane", "60 tons"),
    "rough-terrain-crane": ("Tadano Rough Terrain Crane", "60 tons"),
    "truck-mounted-crane": ("Tadano Truck Mounted Crane", "60 tons"),
    "pick-carry-crane": ("Tadano Pick and Carry Crane", "20 tons"),
    "lattice-boom-crawler-crane": ("Tadano Lattice Boom Crawler Crane", "100 tons"),
    "telescopic-crawler-crane": ("Tadano Telescopic Crawler Crane", "100 tons"),
    "mobile-harbour-crane": ("Mobile Harbour Crane", "120 tons"),
    "ship-to-shore-container-crane": ("Ship-to-Shore Container Crane", "50 tons under spreader"),
    "tadano-80tons-atf80g": ("Tadano ATF 80G All Terrain Crane", "80 tons"),
    "tadano-gr500ex": ("Tadano GR-500EX Rough Terrain Crane", "50 tons"),
    "tadano-gr300-ex": ("Tadano GR-300EX Rough Terrain Crane", "30 tons"),
}
TYPE = {
    "all-terrain-mobile-crane": "All terrain crane", "rough-terrain-crane": "Rough terrain crane", "truck-mounted-crane": "Truck mounted crane",
    "pick-carry-crane": "Pick and carry crane", "lattice-boom-crawler-crane": "Lattice boom crawler crane", "telescopic-crawler-crane": "Telescopic crawler crane",
    "mobile-harbour-crane": "Mobile harbour crane", "ship-to-shore-container-crane": "Ship-to-shore container crane",
    "tadano-80tons-atf80g": "All terrain crane", "tadano-gr500ex": "Rough terrain crane", "tadano-gr300-ex": "Rough terrain crane",
    "2026-60ton-beml-bh60": "Rigid dump truck", "2026-100ton-beml-bh100": "Rigid dump truck", "2026-35ton-beml-bh35-2": "Rigid dump truck",
    "2026-beml-bd355": "Crawler dozer", "2026-1000ton-beml-be1000": "Tracked excavator", "2026-150ton-beml-bh150e": "Hydraulic excavator",
}
BRAND_FIX = {"Speed O Control": "Speed-O-Control", "ELIXIR": "Elixir"}


def norm_cap(c):
    if not c:
        return None
    c = re.sub(r"(\d)\s*TONS?\b", r"\1 tons", c, flags=re.I)
    c = re.sub(r"\btons?\b", "tons", c, flags=re.I)
    return c.strip()


def clean_desc(d):
    if not d:
        return ""
    d = d.replace("\xa0", " ").replace("�", "-")
    d = re.sub(r"\s*Customers?:.*$", "", d, flags=re.S | re.I)  # no third-party customer names
    return re.sub(r"\s+", " ", d).strip()


def title_case(s):
    return s if not s.isupper() else s.title()


P = json.load(open(SRC, encoding="utf-8"))
seen, out = set(), []
for p in P:
    a = {k.replace("Decsription", "Description").replace("Condtion", "Condition"): v for k, v in p["attrs"].items()}
    slug = p["slug"]
    if slug in NAME:
        name, cap = NAME[slug]
    else:
        name = re.sub(r"\s+", " ", p["name"].replace("�", "-")).strip()
        cap = norm_cap(a.get("Capacity"))
    brand = BRAND_FIX.get(a.get("Brand", ""), a.get("Brand", ""))
    if not brand and "komatsu" in name.lower():
        brand = "Komatsu"
    if not brand and "speed-o-control" in name.lower():
        brand = "Speed-O-Control"
    model = a.get("Model", "")
    if model.strip().lower() == name.lower() or slug in NAME:
        model = ""
    desc = clean_desc(a.get("Description", ""))
    typ = TYPE.get(slug, "")
    if not typ and len(desc) < 45:
        typ, desc = title_case(desc), ""
    if " is " in typ:
        desc, typ = typ, ""
    if re.match(r"^s \d", cap or ""):
        cap = "800 W continuous, 1500 W peak"
    if brand == "Elixir":
        n = name.replace("FULE", "FUEL").replace("ELIXIR", "Elixir").replace("Elixir ", "", 1)
        n = n.title()
        for a_, b_ in (("Ac ", "AC "), ("Dc ", "DC "), ("Gfd", "GFD"), ("Epd", "EPD"), ("Asm", "Assy"), ("Scr", "SCR"), ("Gr)", "GR)"), ("Sta)", "STA)"), ("Assy ", "Assembly ")):
            n = n.replace(a_, b_)
        name = "Elixir " + n
    cond = a.get("Condition", "").title()
    partno = a.get("Part No.", "")
    if not partno and p["cat"] == "mining-spares-1":
        m = re.search(r"\b([0-9A-Z]{2,}(?:-[0-9A-Z]+){1,})\b", name)
        partno = m.group(1) if m else ""
    extra = {k: v for k, v in a.items() if k in ("Height", "Frequency")}
    uniq = slug
    if uniq in seen:
        uniq += "-" + p["id"]
    seen.add(uniq)
    im = Image.open(p["file"])
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, "white")
        bg.paste(im, mask=im.getchannel("A"))
        im = bg
    else:
        im = im.convert("RGB")
    big = im.copy(); big.thumbnail((900, 900), Image.LANCZOS)
    th = im.copy(); th.thumbnail((420, 420), Image.LANCZOS)
    big.save(os.path.join(OUT_IMG, f"{uniq}.webp"), "WEBP", quality=80, method=6)
    th.save(os.path.join(OUT_IMG, f"{uniq}-t.webp"), "WEBP", quality=76, method=6)
    out.append({
        "slug": uniq, "cat": p["cat"], "page": CAT_PAGE[p["cat"]], "name": name, "brand": brand, "model": model, "year": a.get("Year", ""),
        "capacity": cap, "condition": cond, "type": typ, "partno": partno, "desc": desc, "extra": extra,
        "w": big.width, "h": big.height, "tw": th.width, "th": th.height,
    })
json.dump(out, open(OUT_JSON, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
tot = sum(os.path.getsize(os.path.join(OUT_IMG, f)) for f in os.listdir(OUT_IMG))
print(len(out), "products,", round(tot / 1e6, 1), "MB of images")
