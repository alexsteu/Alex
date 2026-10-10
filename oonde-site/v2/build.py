# Construit le site OONDE v2 : dist/ (production, polices locales) et preview/ (aperçu Claude, Google Fonts).
import pathlib, re, shutil, urllib.parse, hashlib, base64
D = pathlib.Path(__file__).parent
FONTDIR = D.parent.parent / 'oonde-video' / 'fonts'
WA_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z"/></svg>'
def walink(msg): return 'https://wa.me/41764882710?text=' + urllib.parse.quote(msg)
HELLO = 'Bonjour, je viens de votre site.'   # les mêmes messages que MSG dans partials/core.js (qui les réécrit si l'on vient d'Instagram, de TikTok…)
WA = walink(HELLO + " J’aimerais recevoir ma maquette offerte.\nMon commerce et ma commune : ")
WA_PASSE = walink(HELLO + " J’aimerais que vous passiez me montrer une maquette.\nMon commerce, ma commune et le meilleur moment : ")
WA_IMM = walink(HELLO + " J’aimerais connaître le prix d’un site avec une entrée en 3D.\nMon commerce et ma commune : ")
WA_DEMO = walink(HELLO + " J’ai vu la démo Les Grèves. J’aimerais une entrée en 3D pour mon lieu.\nMon commerce et ma commune : ")
WA_LIEU = walink(HELLO + " J’aimerais que vous veniez voir mon lieu.\nType de lieu, commune et le meilleur moment : ")
WA_Q = walink(HELLO + " J’ai une question : ")
WA_VID = walink(HELLO + " J’aimerais un devis pour des vidéos courtes (Instagram, TikTok).\nMon commerce et ma commune : ")
def qr(url):
    """Le code QR en SVG inline (ordinateur seulement) : on scanne avec son téléphone, WhatsApp s'ouvre avec le message."""
    import qrcode, qrcode.image.svg
    im = qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage, box_size=10, border=2)
    svg = im.to_string(encoding='unicode')
    svg = re.sub(r'<\?xml[^>]*>', '', svg).replace('<svg ', '<svg width="96" height="96" aria-hidden="true" focusable="false" ', 1)
    return svg.replace('fill="#000000"', 'fill="#111318"')
import datetime
# Mesure d'audience : Umami Cloud (gratuit, sans cookie). Collez l'identifiant du site (Website ID) dans umami.txt et relancez :
# sans ce fichier, le site ne charge aucun outil de mesure et la page de confidentialité le dit.
UMAMI = (D / 'umami.txt').read_text().strip() if (D / 'umami.txt').exists() else ''
UMAMI_JS = f'<script defer src="https://cloud.umami.is/script.js" data-website-id="{UMAMI}" data-do-not-track="true"></script>' if UMAMI else ''
MESURE = ({'{{MESURE_LEAD}}': " et ne garde aucune donnée qui vous identifie : on compte seulement les visites, de façon anonyme",
           '{{MESURE_LI}}': " <li><b>Pas de cookie, pas de publicité.</b></li>\n <li><b>Mesure d'audience anonyme</b> : nous comptons les visites et les clics sur les boutons WhatsApp avec Umami, sans cookie et sans enregistrer votre adresse IP. Ces chiffres nous disent seulement combien de personnes viennent et d'où (Instagram, Google…).</li>",
           '{{MESURE_WHO}}': " <li><b>Umami</b> (Umami Cloud) compte les visites, de façon anonyme et sans cookie.</li>\n"} if UMAMI else
          {'{{MESURE_LEAD}}': " et ne mesure pas votre visite", '{{MESURE_LI}}': " <li><b>Pas de cookie, pas d'outil de mesure d'audience, pas de publicité.</b></li>", '{{MESURE_WHO}}': ''})
_d0 = datetime.date(2026, 11, 1).weekday()   # le calendrier de la démo : novembre 2026, nuits prises en gris
CAL = '<i></i>' * _d0 + ''.join(f'<span{" class=x" if d in {3,4,5,10,11,12,13,17,18,24,25,26} else ""}>{d}</span>' for d in range(1, 31))
# Le logo inline vient du fichier de marque : encre → currentColor ; MARK = l'anneau et le point seuls.
_logo = (D / 'brand' / 'logo.svg').read_text()
_vb = re.search(r'viewBox="([^"]+)"', _logo).group(1)
_inner = _logo[_logo.index('>') + 1:_logo.rindex('</svg>')].replace('#111318', 'currentColor')
LOGO = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{_vb}" aria-hidden="true" focusable="false">{_inner}</svg>'
_i = _inner.index('<path')
MARK = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">{_inner[:_i]}</svg>'   # la marque seule (anneau + point), qui vole jusqu'à la barre
GOOGLE = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital@0;1&family=IBM+Plex+Mono:wght@500&family=Instrument+Sans:wght@400;500;600&display=swap">'
FACES = [('Instrument Sans', 'instrument-sans-latin-%s-normal.woff2', ['400', '500', '600']),
         ('IBM Plex Mono', 'ibm-plex-mono-latin-%s-normal.woff2', ['500'])]   # la 600 n'est utilisée nulle part
SERIF = [('normal', 'cormorant-garamond-latin-400-normal.woff2'), ('italic', 'cormorant-garamond-latin-400-italic.woff2')]   # le site Les Grèves de la démo (sous-ensemble latin, fonts/ du site)
PRELOAD = ''.join(f'<link rel="preload" href="fonts/{f}.woff2" as="font" type="font/woff2" crossorigin>' for f in ('instrument-sans-latin-600-normal', 'instrument-sans-latin-400-normal', 'ibm-plex-mono-latin-500-normal'))   # ce que montre le premier écran
LOCAL = (PRELOAD + '<style>' + ''.join(f'@font-face{{font-family:"{f}";src:url(fonts/{p % w}) format("woff2");font-weight:{w};font-display:swap}}' for f, p, ws in FACES for w in ws)
         + ''.join(f'@font-face{{font-family:"Cormorant Garamond";src:url(fonts/{f}) format("woff2");font-weight:400;font-style:{st};font-display:swap}}' for st, f in SERIF) + '</style>')
PAGES = {'mentions-legales': ('Mentions légales', "Éditeur, hébergement et sources légales du site OONDE.", 'M'),
         'confidentialite': ('Confidentialité', "Comment OONDE traite vos données personnelles, selon la LPD.", 'C'),
         'conditions': ('Conditions générales', "Conditions générales des prestations OONDE : site internet, fiche Google et suivi.", 'G'),
         '404': ('Page introuvable', "Cette page n’existe pas ou a été déplacée.", '')}
BODY404 = ('<span class="eyebrow">Erreur 404</span>\n<h1>Cette page n’existe pas.</h1>\n<p class="lead">Le lien est peut-être incomplet, ou la page a été déplacée.</p>\n'
           '<p><a href="./">Revenir à l’accueil</a> · <a href="./#prix">Voir les prix</a> · <a href="{{WA}}" target="_blank" rel="noopener">Nous écrire sur WhatsApp</a></p>\n')

def inc(s):
    """{{INC:base.css}} : les morceaux communs aux pages (partials/)."""
    return re.sub(r'\{\{INC:([\w.-]+)\}\}', lambda m: (D / 'partials' / m.group(1)).read_text().rstrip('\n'), s)

def fill(s, fonts, links):
    s = inc(s)
    for k, v in MESURE.items(): s = s.replace(k, v)
    for k, v in links.items(): s = s.replace(k, v)
    for k, v in [('{{FONTS}}', fonts), ('{{WA_ICON}}', WA_ICON), ('{{WA_IMM}}', WA_IMM), ('{{WA_VID}}', WA_VID), ('{{WA_DEMO}}', WA_DEMO), ('{{WA_PASSE}}', WA_PASSE), ('{{WA_Q}}', WA_Q), ('{{WA_LIEU}}', WA_LIEU), ('{{WA}}', WA), ('{{MARK}}', MARK), ('{{LOGO}}', LOGO),
                 ('{{QR_WA}}', QR_WA), ('{{QR_IMM}}', QR_IMM), ('{{CAL}}', CAL)]:
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
        p = re.sub(r'(?<=\d\.\u2013) (?=\w)', '\u00a0', p)   # 490.– une fois, 20.– par mois
        p = re.sub(r'(?<=\d) (?=(?:heures|jours|h\b|×))', '\u00a0', p)   # 48 heures, 5 jours
        p = re.sub(r'\bsur (?=7\b)', 'sur\u00a0', p)   # 7 jours sur 7
        parts[i] = p
    return ''.join(parts)

def full(s, theme='#F7F7F4', base=''):
    i = re.search(r'<(?:a class="skip"|header\b)', s).start()   # le lien d'évitement va dans <body>, pas dans <head>
    return ('<!doctype html>\n<html lang="fr-CH">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            + (f'<base href="{base}">\n' if base else '')
            + f'<meta name="theme-color" content="{theme}">\n<link rel="icon" href="favicon.ico" sizes="32x32">\n<link rel="icon" href="favicon.svg" type="image/svg+xml">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n'
            + s[:i] + '</head>\n<body>\n' + s[i:] + '</body>\n</html>\n')

def csp_hashes(html):
    return {"'sha256-" + base64.b64encode(hashlib.sha256(m.encode()).digest()).decode() + "'"
            for m in re.findall(r'<script(?![^>]*application/ld\+json)[^>]*>(.*?)</script>', html, flags=re.S)}

layout = (D / 'legal-layout.html').read_text()
QR_WA, QR_IMM = qr(WA), qr(WA_IMM)
docs = {'index': (D / 'home.html').read_text(), 'visite': (D / 'visite.html').read_text(), 'apercu': (D / 'apercu.html').read_text()}
for k, (title, desc, cur) in PAGES.items():
    s = layout.replace('{{TITLE}}', title).replace('{{DESC}}', desc).replace('{{BODY}}', BODY404 if k == '404' else (D / 'legal' / f'{k}.html').read_text())
    for c in 'MCG':
        s = s.replace('{{CUR_%s}}' % c, ' aria-current="page"' if c == cur else '')
    docs[k] = s

# Netlify sert /visite depuis visite.html ; l'aperçu claude.ai a besoin du nom complet
LINKS = {'dist': {'{{VISITE}}': 'visite', '{{APERCU}}': 'apercu', '{{HOME}}': './'},
         'preview': {'{{VISITE}}': 'visite.html', '{{APERCU}}': 'apercu.html', '{{HOME}}': 'index.html'}}
for out, fonts, wrap in [('dist', LOCAL, True), ('preview', GOOGLE, False)]:
    o = D / out; shutil.rmtree(o, ignore_errors=True); o.mkdir(); built = {}
    for k, s in docs.items():
        s = fill(s, fonts, LINKS[out])
        if out == 'dist' and k in ('index', 'visite', 'apercu'): s = s.replace('</title>', '</title>\n' + UMAMI_JS, 1)
        assert '{{' not in s, (k, s[s.index('{{'):s.index('{{') + 20])
        built[k] = full(s, base='/' if k == '404' else '') if (wrap or k != 'index') else s   # la 404 est servie à n'importe quelle profondeur
        (o / f'{k}.html').write_text(built[k])
    (o / 'img').mkdir()   # seulement les images réellement citées (reel.*, trattoria.jpg, greves-1/2/3.jpg ne partent plus)
    html = ''.join(built.values())
    for f in sorted(set(re.findall(r'img/[\w./-]+\.(?:jpe?g|png|webp|avif|mp4)', html))):
        (o / f).parent.mkdir(parents=True, exist_ok=True); shutil.copy2(D / f, o / f)
        big = f.replace('.jpg', '-l.jpg')   # version 1600 px des photos de métier, demandée par l'aperçu en grand
        if f.startswith('img/t-') and (D / big).exists(): shutil.copy2(D / big, o / big)
    if 'img/greves/${k}/' in html:   # la visite de la démo : les deux jeux d'images, appelés par le script
        for k in ('d', 'm'): shutil.copytree(D / 'img' / 'greves' / k, o / 'img' / 'greves' / k, dirs_exist_ok=True)
    if wrap:
        (o / 'fonts').mkdir()
        for f, p, ws in FACES:
            for w in ws: shutil.copy(FONTDIR / (p % w), o / 'fonts')
        for n in ('Instrument-Sans', 'IBM-Plex-Mono'): shutil.copy(FONTDIR / f'OFL-{n}.txt', o / 'fonts')
        for st, f in SERIF: shutil.copy(D / 'fonts' / f, o / 'fonts')
        shutil.copy(D / 'fonts' / 'OFL-Cormorant-Garamond.txt', o / 'fonts')
        for f in ('favicon.svg', 'favicon.ico', 'apple-touch-icon.png'): shutil.copy(D / 'brand' / f, o / f)
        U = ' https://cloud.umami.is' if UMAMI else ''
        csp = ("default-src 'self'; script-src 'self'" + U + ' ' + ' '.join(sorted(set().union(*(csp_hashes(h) for h in built.values()))))
               + "; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'" + (U + ' https://api-gateway.umami.dev' if UMAMI else '') + "; "
               "object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'")
        (o / '_headers').write_text('/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n'
            '  Strict-Transport-Security: max-age=31536000\n  X-Frame-Options: DENY\n  Cross-Origin-Opener-Policy: same-origin\n'
            f'  Content-Security-Policy: {csp}\n'
            '\n/apercu\n  X-Robots-Tag: noindex\n/apercu.html\n  X-Robots-Tag: noindex\n'
            '\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n'
            '\n/img/*\n  Cache-Control: public, max-age=604800, stale-while-revalidate=86400\n'
            '\n/apple-touch-icon.png\n  Cache-Control: public, max-age=604800\n')
        # Liens courts pour les bios et les cartes : oonde.ch/ig, /tt, /carte, /g (fiche Google) gardent la source dans le message WhatsApp
        (o / '_redirects').write_text('/ig     /?s=ig     302\n/tt     /?s=tt     302\n/carte  /?s=carte  302\n/g      /?s=gbp    302\n')
        (o / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://oonde.ch/sitemap.xml\n')
        (o / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '  <url><loc>https://oonde.ch/</loc></url>\n  <url><loc>https://oonde.ch/visite</loc></url>\n' + '</urlset>\n')
print('ok', sorted(p.name for p in (D / 'dist').iterdir()))
