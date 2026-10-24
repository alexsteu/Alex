# Génère les fichiers du logo OONDE (SVG) à partir des contours d'Instrument Sans 600.
# python3 brand/make.py  → brand/*.svg
import math, pathlib
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
D = pathlib.Path(__file__).parent
INK, LAC, PAPER = '#111318', '#2038EC', '#F7F7F4'
f = TTFont(D.parent.parent.parent / 'oonde-video' / 'fonts' / 'instrument-sans-latin-600-normal.woff2')
gs, cmap, cap = f.getGlyphSet(), f.getBestCmap(), f['OS/2'].sCapHeight
S = 100 / cap  # hauteur de capitale = 100
def glyph(ch, x):
    g = gs[cmap[ord(ch)]]; p = SVGPathPen(gs); g.draw(TransformPen(p, (S, 0, 0, -S, x, 100)))
    return p.getCommands(), g.width * S
TRACK = 8; x = 0; paths = []
for ch in 'ONDE':
    d, w = glyph(ch, x); paths.append(d); x += w + TRACK
WORD = x - TRACK
# Le premier O est le signe : un anneau (épaisseur = fût de la 600) et un point Klein au centre : la source de l'onde.
def o_sign(ink, lac, cx=50, cy=50, s=1):
    return (f'<circle cx="{cx}" cy="{cy}" r="{43.5*s}" fill="none" stroke="{ink}" stroke-width="{13*s}"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{17*s}" fill="{lac}"/>')
def logo(ink, lac):
    W = 100 + TRACK + WORD
    word = ''.join(f'<path d="{d}" fill="{ink}" transform="translate({100+TRACK},0)"/>' for d in paths)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} 100" role="img" aria-label="OONDE">{o_sign(ink, lac)}{word}</svg>'
# Le signe seul (avatar, favicon) : anneau + point, et une onde partielle qui s'éloigne en haut à droite.
def mark(ink, lac, cx=50, cy=50):
    r = 46; a0, a1 = math.radians(-150), math.radians(10)
    arc = (f'<path d="M{cx+r*math.cos(a0):.2f} {cy+r*math.sin(a0):.2f}A{r} {r} 0 0 1 {cx+r*math.cos(a1):.2f} {cy+r*math.sin(a1):.2f}" '
           f'fill="none" stroke="{ink}" stroke-width="5" stroke-linecap="round"/>')
    return o_sign(ink, lac, cx, cy, .62) + arc
def svg(body, vb='0 0 100 100'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="OONDE">{body}</svg>'
out = {
 'logo.svg': logo(INK, LAC), 'logo-white.svg': logo('#FFFFFF', LAC), 'logo-mono.svg': logo(INK, INK), 'logo-mono-white.svg': logo('#FFFFFF', '#FFFFFF'),
 'mark.svg': svg(mark(INK, LAC)), 'mark-white.svg': svg(mark('#FFFFFF', LAC)),
 # Avatars : le signe un peu réduit, pour qu'il reste entier une fois rogné en rond par Instagram ou WhatsApp.
 'avatar.svg': svg(f'<rect width="100" height="100" fill="{INK}"/><g transform="translate(50 50) scale(.82) translate(-50 -50)">' + mark('#FFFFFF', LAC) + '</g>'),
 'avatar-light.svg': svg(f'<rect width="100" height="100" fill="{PAPER}"/><g transform="translate(50 50) scale(.82) translate(-50 -50)">' + mark(INK, LAC) + '</g>'),
 'favicon.svg': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="{INK}"/><circle cx="16" cy="16" r="9" fill="none" stroke="#FFFFFF" stroke-width="2.6"/><circle cx="16" cy="16" r="3.6" fill="{LAC}"/></svg>',
}
for k, v in out.items(): (D / k).write_text(v)
print('ok', len(out), 'fichiers ; logo', f'{100+TRACK+WORD:.0f}x100')
