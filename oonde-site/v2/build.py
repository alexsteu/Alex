# Construit le site OONDE v2 : dist/ (production, polices locales) et preview/ (aperçu Claude, Google Fonts).
import pathlib, re, shutil, urllib.parse, hashlib, base64
D = pathlib.Path(__file__).parent
FONTDIR = D.parent.parent / 'oonde-video' / 'fonts'
WA_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z"/></svg>'
def walink(msg): return 'https://wa.me/41764882710?text=' + urllib.parse.quote(msg)
WA = walink("Bonjour, j’aimerais bien recevoir une maquette gratuite pour mon commerce.\nNom et commune : ")
WA_IMM = walink("Bonjour, j’aimerais connaître le prix d’un site avec visite.\nMon lieu (type, commune, taille) : ")
WA_DEMO = walink("Bonjour, j’ai vu la démo Les Grèves sur votre site. J’aimerais la même chose pour mon lieu.\nMon lieu (type, commune, taille) : ")
WA_VID = walink("Bonjour, j’aimerais un devis pour des vidéos courtes (Instagram, TikTok).\nMon commerce et ma commune : ")
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

def fill(s, fonts):
    for k, v in [('{{FONTS}}', fonts), ('{{WA_ICON}}', WA_ICON), ('{{WA_IMM}}', WA_IMM), ('{{WA_VID}}', WA_VID), ('{{WA_DEMO}}', WA_DEMO), ('{{WA}}', WA), ('{{MARK}}', MARK), ('{{LOGO}}', LOGO)]:
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
docs = {'index': (D / 'home.html').read_text()}
for k, (title, desc, cur) in PAGES.items():
    s = layout.replace('{{TITLE}}', title).replace('{{DESC}}', desc).replace('{{BODY}}', BODY404 if k == '404' else (D / 'legal' / f'{k}.html').read_text())
    for c in 'MCG':
        s = s.replace('{{CUR_%s}}' % c, ' aria-current="page"' if c == cur else '')
    docs[k] = s

for out, fonts, wrap in [('dist', LOCAL, True), ('preview', GOOGLE, False)]:
    o = D / out; shutil.rmtree(o, ignore_errors=True); o.mkdir(); built = {}
    for k, s in docs.items():
        s = fill(s, fonts)
        assert '{{' not in s, (k, s[s.index('{{'):s.index('{{') + 20])
        built[k] = full(s, base='/' if k == '404' else '') if (wrap or k != 'index') else s   # la 404 est servie à n'importe quelle profondeur
        (o / f'{k}.html').write_text(built[k])
    (o / 'img').mkdir()   # seulement les images réellement citées (reel.*, trattoria.jpg, greves-1/2/3.jpg ne partent plus)
    html = ''.join(built.values())
    for f in sorted(set(re.findall(r'img/[\w./-]+\.(?:jpe?g|png|webp|avif|mp4)', html))):
        (o / f).parent.mkdir(parents=True, exist_ok=True); shutil.copy2(D / f, o / f)
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
        csp = ("default-src 'self'; script-src 'self' " + ' '.join(sorted(set().union(*(csp_hashes(h) for h in built.values()))))
               + "; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; "
               "object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'")
        (o / '_headers').write_text('/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n'
            '  Strict-Transport-Security: max-age=31536000\n  X-Frame-Options: DENY\n  Cross-Origin-Opener-Policy: same-origin\n'
            f'  Content-Security-Policy: {csp}\n'
            '\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n'
            '\n/img/*\n  Cache-Control: public, max-age=604800, stale-while-revalidate=86400\n'
            '\n/apple-touch-icon.png\n  Cache-Control: public, max-age=604800\n')
        (o / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://oonde.ch/sitemap.xml\n')
        (o / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '  <url><loc>https://oonde.ch/</loc></url>\n' + '</urlset>\n')
print('ok', sorted(p.name for p in (D / 'dist').iterdir()))
