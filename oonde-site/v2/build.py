# Construit le site OONDE v2 : dist/ (production, polices locales) et preview/ (aperçu Claude, Google Fonts).
import pathlib, re, shutil, urllib.parse
D = pathlib.Path(__file__).parent
FONTDIR = D.parent.parent / 'oonde-video' / 'fonts'
WA_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z"/></svg>'
def walink(msg): return 'https://wa.me/41764882710?text=' + urllib.parse.quote(msg)
WA = walink("Bonjour OONDE, je voudrais ma maquette gratuite.\nMon commerce ou mon lieu : \nMa commune : ")
WA_IMM = walink("Bonjour OONDE, je voudrais un devis pour un site immersif.\nLieu : (restaurant, logement, salle…)\nCommune : \nTaille : (nombre de pièces ou de salles)\nLe lieu est prêt à être filmé : oui / non\nJ’ai déjà des photos ou des vidéos : oui / non")
WA_VID = walink("Bonjour OONDE, je voudrais des vidéos courtes pour les réseaux.\nMon commerce : \nMa commune : \nNombre de vidéos souhaité : ")
# Le logo inline vient du fichier de marque : encre → currentColor ; la version « clip » révèle les lettres derrière le O.
_logo = (D / 'brand' / 'logo.svg').read_text()
_vb = re.search(r'viewBox="([^"]+)"', _logo).group(1)
_inner = _logo[_logo.index('>') + 1:_logo.rindex('</svg>')].replace('#111318', 'currentColor')
LOGO = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{_vb}" aria-hidden="true" focusable="false">{_inner}</svg>'
_i = _inner.index('<path')
LOGO_CLIP = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{_vb}" aria-hidden="true" focusable="false"><defs><clipPath id="wc"><rect id="wr" x="100" y="-10" width="0" height="120"/></clipPath></defs>'
             f'{_inner[:_i]}<g clip-path="url(#wc)">{_inner[_i:]}</g></svg>')
GOOGLE = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Instrument+Sans:wght@400;500;600&display=swap">'
FACES = [('Instrument Sans', 'instrument-sans-latin-%s-normal.woff2', ['400', '500', '600']),
         ('IBM Plex Mono', 'ibm-plex-mono-latin-%s-normal.woff2', ['500', '600'])]
LOCAL = '<style>' + ''.join(f'@font-face{{font-family:"{f}";src:url(fonts/{p % w}) format("woff2");font-weight:{w};font-display:swap}}' for f, p, ws in FACES for w in ws) + '</style>'
PAGES = {'mentions-legales': ('Mentions légales', "Éditeur, hébergement et sources légales du site OONDE.", 'M'),
         'confidentialite': ('Confidentialité', "Comment OONDE traite vos données personnelles, selon la LPD.", 'C'),
         'conditions': ('Conditions générales', "Conditions générales des prestations OONDE : site internet, fiche Google et suivi.", 'G')}

def fill(s, fonts):
    for k, v in [('{{FONTS}}', fonts), ('{{WA_ICON}}', WA_ICON), ('{{WA_IMM}}', WA_IMM), ('{{WA_VID}}', WA_VID), ('{{WA}}', WA), ('{{LOGO_CLIP}}', LOGO_CLIP), ('{{LOGO}}', LOGO)]:
        s = s.replace(k, v.replace('&', '&amp;') if k.startswith('{{WA') and k != '{{WA_ICON}}' else v)
    return typo(s)

def typo(s):
    """Typographie française hors <script>/<style> : apostrophe ’, espace fine insécable avant ? ! ; : et dans les « guillemets »."""
    parts = re.split(r'(<script\b.*?</script>|<style\b.*?</style>)', s, flags=re.S)
    for i, p in enumerate(parts):
        if i % 2: continue
        p = re.sub(r"(?<=\w)'(?=\w)", '\u2019', p)
        p = re.sub(r'(?<=[\w»)\.\u2013\u2019]) ([?!;:])', '\u202f\\1', p)
        p = re.sub(r'« ', '«\u202f', p)
        p = re.sub(r' »', '\u202f»', p)
        parts[i] = p
    return ''.join(parts)

def full(s, theme='#111318'):
    i = s.index('<header')
    return ('<!doctype html>\n<html lang="fr-CH">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            f'<meta name="theme-color" content="{theme}">\n<link rel="icon" href="favicon.svg" type="image/svg+xml">\n' + s[:i] + '</head>\n<body>\n' + s[i:] + '</body>\n</html>\n')

layout = (D / 'legal-layout.html').read_text()
docs = {'index': (D / 'home.html').read_text()}
for k, (title, desc, cur) in PAGES.items():
    s = layout.replace('{{TITLE}}', title).replace('{{DESC}}', desc).replace('{{BODY}}', (D / 'legal' / f'{k}.html').read_text())
    for c in 'MCG':
        s = s.replace('{{CUR_%s}}' % c, ' aria-current="page"' if c == cur else '')
    docs[k] = s

for out, fonts, wrap in [('dist', LOCAL, True), ('preview', GOOGLE, False)]:
    o = D / out; shutil.rmtree(o, ignore_errors=True); o.mkdir()
    for k, s in docs.items():
        s = fill(s, fonts)
        assert '{{' not in s, (k, s[s.index('{{'):s.index('{{') + 20])
        (o / f'{k}.html').write_text(full(s) if (wrap or k != 'index') else s)
    shutil.copytree(D / 'img', o / 'img')
    if wrap:
        (o / 'fonts').mkdir()
        for f, p, ws in FACES:
            for w in ws: shutil.copy(FONTDIR / (p % w), o / 'fonts')
        for n in ('Instrument-Sans', 'IBM-Plex-Mono'): shutil.copy(FONTDIR / f'OFL-{n}.txt', o / 'fonts')
        shutil.copy(D / 'brand' / 'favicon.svg', o / 'favicon.svg')
        (o / '_headers').write_text('/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Strict-Transport-Security: max-age=31536000\n')
        (o / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://oonde.ch/sitemap.xml\n')
        (o / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>https://oonde.ch/{"" if k == "index" else k + ".html"}</loc></url>\n' for k in docs) + '</urlset>\n')
print('ok', sorted(p.name for p in (D / 'dist').iterdir()))
