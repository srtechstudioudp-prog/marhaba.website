"""Build web images and favicons from _src (client's old-site images) into public/assets/img."""
import io, os, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_src", "images", "main-slider")
OUT = os.path.join(ROOT, "public", "assets", "img")
os.makedirs(OUT, exist_ok=True)

HEROES = {
    "mining-fleet": "image-1.jpg",
    "all-terrain-crane": "image-2.jpg",
    "crawler-dozer": "image-3.jpg",
    "wheel-loader": "image-4.jpg",
}
for name, f in HEROES.items():
    im = Image.open(os.path.join(SRC, f)).convert("RGB")
    im.save(os.path.join(OUT, f"{name}-1366.webp"), "WEBP", quality=72, method=6)
    sm = im.resize((800, round(800 * im.height / im.width)), Image.LANCZOS)
    sm.save(os.path.join(OUT, f"{name}-800.webp"), "WEBP", quality=72, method=6)
    sm.save(os.path.join(OUT, f"{name}-800.jpg"), "JPEG", quality=76, optimize=True, progressive=True)
    print(name, im.size)

# Favicon: bold amber "M" on navy rounded square (simplified for 16px legibility)
NAVY, AMBER = (10, 27, 51, 255), (245, 166, 35, 255)
def mark(px):
    s = px * 4
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, s - 1, s - 1), radius=int(s * 0.22), fill=NAVY)
    m = s * 0.2
    t = s * 0.15  # stroke
    x0, x1, y0, y1 = m, s - m, s * 0.22, s * 0.78
    d.polygon([(x0, y1), (x0, y0), (x0 + t, y0), (s / 2, s * 0.56), (x1 - t, y0), (x1, y0), (x1, y1), (x1 - t, y1), (x1 - t, y0 + t * 1.6), (s / 2, s * 0.7), (x0 + t, y0 + t * 1.6), (x0 + t, y1)], fill=AMBER)
    return im.resize((px, px), Image.LANCZOS)

for px in (48, 96, 144, 192, 512):
    mark(px).save(os.path.join(OUT, f"favicon-{px}.png"))
mark(180).save(os.path.join(OUT, "apple-touch-icon.png"))
mark(256).save(os.path.join(ROOT, "public", "favicon.ico"), sizes=[(48, 48), (96, 96), (256, 256)])
print("favicons done")
