# Construit le site OONDE v2 : dist/ (production, polices locales) et preview/ (aperçu Claude, Google Fonts).
import os, json, pathlib, re, shutil, urllib.parse, hashlib, base64
D = pathlib.Path(__file__).parent
FONTDIR = D.parent.parent / 'oonde-video' / 'fonts'
WA_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z"/></svg>'
def walink(msg): return 'https://wa.me/41764882710?text=' + urllib.parse.quote(msg)
HELLO = 'Bonjour, je viens de votre site.'   # les mêmes messages que MSG dans partials/core.js (qui les réécrit si l'on vient d'Instagram, de TikTok…)
WA = walink(HELLO + " J’aimerais recevoir ma maquette offerte.\nMon commerce et ma commune : ")
WA_PASSE = walink(HELLO + " J’aimerais que vous passiez me montrer une maquette.\nMon commerce, ma commune et le meilleur moment : ")
WA_IMM = walink(HELLO + " J’aimerais recevoir une première image 3D de ma façade et le prix d’un site avec une entrée en 3D.\nMon commerce et ma commune : ")
WA_ASSIST = walink(HELLO + " L’assistant m’intéresse.\nMon commerce et ma commune : ")
WA_VIDS = walink(HELLO + " J’aimerais une pub pour mon commerce.\nMon commerce et ma commune : ")
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

def nav(cur):
    """{{NAV:page}} : la navigation du haut, la même partout (v20 : La Pub au premier niveau, à côté de La Vitrine)."""
    H = '' if cur == 'index' else '{{HOME}}'
    a = lambda k: ' aria-current="page"' if k == cur else ''
    sub = cur in ('assistant', 'visite')
    return (f'<a href="{H}#choix">La démo</a><a href="{H}#prix">Prix</a><a class="opt" href="{{{{VITRINE}}}}"{a("vitrine")}>La Vitrine</a><a class="opt" href="{{{{PUB}}}}"{a("pub")}>La Pub</a>'
            f'<span class="nav-sub opt"><button type="button" class="nav-sb"{" data-cur" if sub else ""} aria-expanded="false" aria-controls="navS">Autres services</button><span class="nav-sl" id="navS"><a href="{{{{ASSISTANT}}}}"{a("assistant")}>L’assistant</a><a href="{{{{VISITE}}}}"{a("visite")}>La visite complète</a></span></span>'
            f'<a class="opt2" href="{H}#questions">Questions</a>')

# La Pub : les exemples (v20, jury r1 § 4). Fichiers web 720×1280 dans video/pub/ (la partie pub seule, sans l'appel Instagram de fin).
REELS = [('trattoria', 'Restaurant', 'Une vraie pub de restaurant : vos plats, votre ambiance, et le bouton Réserver à la fin.', 'Trattoria Nonna Pia : des pâtes, une pizza au feu de bois, un tiramisu, puis le bouton Réserver.'),
         ('salon', 'Coiffure', 'La même chose pour un salon : la coupe, le brushing, le rendez-vous.', 'Salon Mirabelle : une coupe, un brushing, puis le bouton Réserver.'),
         ('ardoise', 'Café', 'Votre ardoise du jour devient une vidéo qu’on voit dans sa poche.', 'Café Cormoran : l’ardoise sous la pluie, puis le menu dans le téléphone.'),
         ('rideau', 'Atelier vélo', 'Fermé à 18 h 30, et vos clients ont quand même leurs réponses.', 'Rayon et Pignon : le rideau baissé, les questions du soir, et le site qui répond.'),
         ('swipe', 'Restaurants', 'L’humour d’une appli de rencontre pour montrer pourquoi on choisit un resto plutôt qu’un autre.', 'Des fiches de restaurants qu’on écarte à gauche, jusqu’au match.'),
         ('soin', 'Institut de beauté', 'Pour un institut : l’envie d’un soin arrive le soir, la pub y répond.', 'Institut Lunelle : 23 h, un site qui dit « Appelez-nous », puis un bouton WhatsApp.'),
         ('age', 'Boulangerie', 'Un compteur qui recule jusqu’en 2006 : la pub qui fait rire, et qui fait réfléchir.', 'Boulangerie Pivoine : un vieux site qui recule jusqu’en 2006.'),
         ('voyant', 'Garage', 'Pour un garage : le voyant orange, la photo envoyée, la réponse.', 'Garage des Tilleuls : un voyant moteur orange, puis la photo envoyée sur WhatsApp.'),
         ('fuite', 'Plombier', 'Pour un artisan : la fuite du soir, et un site qui prend la photo au lieu d’un formulaire.', 'Un plombier : une fuite à 23 h, un formulaire qu’on abandonne, puis un bouton WhatsApp.')]
SND = '<svg class="off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6m0-6-5 6"/></svg><svg class="on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>'
PLAY = '<span class="pl" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg></span>'
REELS_HTML = '\n  '.join(f'<li><div class="v" data-v="video/pub/{k}.mp4"><img src="video/pub/{k}.jpg" width="720" height="1280" alt="Démo : {alt}" loading="lazy" decoding="async"><button type="button" class="vp" aria-label="Lire la pub : {m}" aria-pressed="false" style="position:absolute;inset:0;background:none;border:0;cursor:pointer;width:100%">{PLAY}</button><button type="button" class="snd" aria-label="Son de la pub : {m}" aria-pressed="false">{SND}</button></div><div class="cap"><span class="mono">{m}</span><p>{c}</p></div></li>' for k, m, c, alt in REELS)

def fill(s, fonts, links):
    s = inc(s)
    s = re.sub(r'\{\{NAV:(\w+)\}\}', lambda m: nav(m.group(1)), s)
    s = s.replace('{{REELS}}', REELS_HTML)
    for k, v in MESURE.items(): s = s.replace(k, v)
    for k, v in links.items(): s = s.replace(k, v)
    for k, v in [('{{FONTS}}', fonts), ('{{WA_ICON}}', WA_ICON), ('{{WA_IMM}}', WA_IMM), ('{{WA_ASSIST}}', WA_ASSIST), ('{{WA_VIDS}}', WA_VIDS), ('{{WA_VID}}', WA_VID), ('{{WA_DEMO}}', WA_DEMO), ('{{WA_PASSE}}', WA_PASSE), ('{{WA_Q}}', WA_Q), ('{{WA_LIEU}}', WA_LIEU), ('{{WA}}', WA), ('{{MARK}}', MARK), ('{{LOGO}}', LOGO),
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

def pack(src, dst, start=0, fr=None, p0x=()):
    """Les images d'une entrée en 4 fichiers, dans l'ordre où le lecteur les veut : p0 = la première, la dernière et une sur 8,
    p1 = les 4 + 8k, p2 = les 2 + 4k, p3 = les impaires. Rend (numéro, octets) : voir blob() pour le format ; v22 : écrits par put()
    (dist : .bin à empreinte ; preview : base64 dans un .txt, l'aperçu claude.ai ne servant pas les .bin)."""
    fr = fr or sorted(src.glob('f*.webp')); n = len(fr)
    # v20.1 : start = la première image que le lecteur montre (S0 dans rue.js) ; celles d'avant ne partent plus (un tiers du poids en moins)
    J = lambda i: i - start
    k1 = -1
    if start and (src / 'pins.json').exists():   # v20.1 : l'image de l'arrêt part dans le premier paquet (réseau lent : on ne reste pas sur l'affiche du début à l'arrêt)
        k1 = next((i for i, x in enumerate(json.loads((src / 'pins.json').read_text())) if x['p'] >= .88), -1)
    # v21.2 : la rue, dense au départ : les 16 premières images montrées sont toutes dans p0/p1 (avant tout geste) ; le premier défilement n'attend plus p2
    dense = set(range(start, start + 16)) if start else set()
    g0 = [i for i in range(start, n) if J(i) % 8 == 0 or i == n - 1 or i == k1 or i in p0x]   # p0x : v21.2, toutes les façades du glissement dans p0
    groups = [g0, [i for i in range(start, n) if (J(i) % 8 == 4 or i in dense) and i != k1 and i not in g0], [i for i in range(start, n) if J(i) % 4 == 2 and i != k1 and i not in dense], [i for i in range(start, n) if J(i) % 2 == 1 and i != n - 1 and i != k1 and i not in dense]]
    for g, idx in enumerate(groups):
        head, body, off = [], b'', 0
        for i in idx:
            d = fr[i].read_bytes(); head.append([int(fr[i].stem[1:]), off, len(d)]); body += d; off += len(d)
        h = json.dumps(head, separators=(',', ':')).encode()
        yield g, len(h).to_bytes(4, 'little') + h + body

def blob(fr):
    """Un paquet : 4 octets (longueur de l'en-tête), l'en-tête JSON [[image, début, longueur], …], puis les images bout à bout."""
    head, body, off = [], b'', 0
    for i, f in fr:
        d = f.read_bytes(); head.append([i, off, len(d)]); body += d; off += len(d)
    h = json.dumps(head, separators=(',', ':')).encode()
    return len(h).to_bytes(4, 'little') + h + body

WA_N = {'d': 45, 'm': 55}   # v22 : le film de l'intro (img/e3d/w/<jeu>) : A images d'approche, puis les 73 du glissement (va)
def wpacks(k):
    """v22 : les 8 paquets du film, dans l'ordre de rue.js (PK) : L* en basse définition (360×640 au téléphone, 640×400 à l'ordinateur), H* nets.
    L0 = les 6 premières images de l'approche (demandé dès la tête du HTML : le premier mouvement) ; L1 = le reste de l'approche ; L2/L3 = la marche, paires/impaires ;
    H0 = l'affiche et l'arrêt nets ; H1 l'approche, H2 et H3 les deux moitiés de la marche, nettes."""
    src = D / 'img' / 'e3d' / 'w' / k; A = WA_N[k]; n = len(list(src.glob('h*.webp')))
    if os.environ.get('E3TEST') and n != A + 73: print('incomplet', k, n); return
    assert n == A + 73, (k, n)
    j = lambda i: i if i < A else i - A
    h0 = [0, A + 60]   # l'affiche et l'arrêt, nets, tout de suite après L0 : à l'arrivée, l'arrêt est net même en réseau lent
    G = {'L0': ('l', list(range(6))), 'L1': ('l', list(range(6, A))),
         'L2': ('l', [i for i in range(A, n) if j(i) % 2 == 0]), 'L3': ('l', [i for i in range(A, n) if j(i) % 2 == 1]),
         'H0': ('h', h0), 'H1': ('h', [i for i in range(1, A)]),   # v22.1 : les nettes par tronçon : H1 l'approche, H2 la première moitié de la marche, H3 la seconde (rue.js les demande en chemin)
         'H2': ('h', [i for i in range(A, A + 37) if i not in h0]), 'H3': ('h', [i for i in range(A + 37, n) if i not in h0])}
    for nm, (t, idx) in G.items():
        yield nm, {x: blob([(i, src / f'{t}{i:03d}.{e}') for i in idx]) for x, e in (('a', 'avif'), ('w', 'webp'))}

def externalize(html, o, name):
    crit = name == 'index'   # v22.1 : l'accueil garde son CSS dans la page (un aller-retour de moins avant l'affiche) ; son script part en tête, différé
    """dist : les gros blocs <style> et <script> en ligne partent dans assets/<empreinte>.css|js, en cache long (le HTML,
    lui, est revalidé à chaque visite). Les petits restent en ligne (le script de tête qui pose .js, les polices, le JSON-LD).
    Même position, même ordre d'exécution (script classique, sans defer). L'aperçu claude.ai garde tout en ligne."""
    (o / 'assets').mkdir(exist_ok=True)
    def out(body, ext):
        h = hashlib.sha256(body.encode()).hexdigest()[:12]; f = f'assets/{h}.{ext}'   # même contenu, même fichier (les pages légales le partagent)
        (o / f).write_text(body); return f
    def css(m):
        body = m.group(1)
        if len(body) < 2048 or crit: return m.group(0)
        body = re.sub(r'url\((["\']?)(?!data:|https?:|/|#)', r'url(\1../', body)   # les chemins relatifs partent de assets/
        return f'<link rel="stylesheet" href="{out(body, "css")}">'
    def js(m):
        attrs, body = m.group(1), m.group(2)
        if attrs.strip() or len(body) < 2048: return m.group(0)
        f = out(body, "js")
        if crit: pre.append(f'<link rel="preload" href="{f}" as="script">'); return f'<script src="{f}" defer></script>'
        return f'<script src="{f}"></script>'
    pre = []
    html = re.sub(r'<style>(.*?)</style>', css, html, flags=re.S)
    html = re.sub(r'<script((?:\s[^>]*)?)>(.*?)</script>', js, html, flags=re.S)
    return html.replace('</head>', ''.join(pre) + '\n</head>', 1) if pre else html

def csp_hashes(html):
    return {"'sha256-" + base64.b64encode(hashlib.sha256(m.encode()).digest()).decode() + "'"
            for m in re.findall(r'<script(?![^>]*application/ld\+json)[^>]*>(.*?)</script>', html, flags=re.S)}

layout = (D / 'legal-layout.html').read_text()
QR_WA, QR_IMM = qr(WA), qr(WA_IMM)
docs = {'index': (D / 'home.html').read_text(), 'exemples': (D / 'exemples.html').read_text(), 'vitrine': (D / 'vitrine.html').read_text(), 'visite': (D / 'visite.html').read_text(), 'apercu': (D / 'apercu.html').read_text(), 'assistant': (D / 'assistant.html').read_text(), 'pub': (D / 'pub.html').read_text()}
for k, (title, desc, cur) in PAGES.items():
    s = layout.replace('{{TITLE}}', title).replace('{{DESC}}', desc).replace('{{BODY}}', BODY404 if k == '404' else (D / 'legal' / f'{k}.html').read_text())
    for c in 'MCG':
        s = s.replace('{{CUR_%s}}' % c, ' aria-current="page"' if c == cur else '')
    docs[k] = s

# Netlify sert /visite depuis visite.html ; l'aperçu claude.ai a besoin du nom complet
LINKS = {'dist': {'{{VISITE}}': 'visite', '{{APERCU}}': 'apercu', '{{HOME}}': './', '{{EXEMPLES}}': './#choix', '{{VITRINE}}': 'vitrine', '{{ASSISTANT}}': 'assistant', '{{PUB}}': 'pub'},
         'preview': {'{{VISITE}}': 'visite.html', '{{APERCU}}': 'apercu.html', '{{HOME}}': 'index.html', '{{EXEMPLES}}': 'index.html#choix', '{{VITRINE}}': 'vitrine.html', '{{ASSISTANT}}': 'assistant.html', '{{PUB}}': 'pub.html'}}
for out, fonts, wrap in [('dist', LOCAL, True), ('preview', LOCAL, False)]:   # v22 : l'aperçu sert aussi ses polices (plus de connexion à Google Fonts sur iPhone)
    o = D / out; shutil.rmtree(o, ignore_errors=True); o.mkdir(); built = {}; whole = {}
    # v22 : les paquets d'images de l'accueil, avant les pages : E3M (nom logique → fichiers) est écrit dans la page.
    # dist : des .bin binaires, nommés par empreinte (img/e3d/h/), en cache immuable ; AVIF + WebP en secours pour le film de l'intro.
    # preview : des .txt en base64 (l'aperçu claude.ai refuse les .bin), au chemin lisible.
    E3M = {}
    def put(key, x, data, path):
        if out == 'dist':
            f = f'img/e3d/h/{hashlib.sha256(data).hexdigest()[:12]}.bin'; (o / f).parent.mkdir(parents=True, exist_ok=True); (o / f).write_bytes(data)
        else:
            f = path; (o / f).parent.mkdir(parents=True, exist_ok=True); (o / f).write_bytes(base64.b64encode(data))
        E3M.setdefault(key, {})[x] = f
    for k in ('d', 'm'):
        for nm, by in wpacks(k):
            for x, data in by.items(): put(f'w/{k}/{nm}', x, data, f'img/e3d/w/{k}/{nm}.{x}.txt')
    for sd in [d for d in sorted((D / 'img' / 'e3d').iterdir()) if d.name.startswith('in-')]:
        for k in ('da', 'ma', 'd', 'm'):
            if not (sd / k).is_dir(): continue
            if k in ('da', 'ma'):   # v21 : la suite derrière la façade du métier : ses images de la porte (da/, ma/), puis celles de la salle, communes (d/, m/)
                own = sorted((sd / k).glob('f*.webp')); fr = own + sorted((sd / k[0]).glob('f*.webp'))[len(own):]
            else: fr = None
            for g, data in pack(sd / k, None, 0, fr): put(f'{sd.name}/{k}/p{g}', 'w', data, f'img/e3d/{sd.name}/{k}/p{g}.txt')
    E3MJ = json.dumps(E3M, separators=(',', ':'))
    # le premier paquet du film (L0, AVIF) part dès la tête de la page, avant le reste du HTML ; e3get le reprend (window.E3P).
    # (un <link rel=preload as=fetch> n'est pas repris par WebKit : le paquet partait deux fois)
    E3PRE = ''
    if 'w/m/L0' in E3M and 'w/d/L0' in E3M:   # v22 : dès la tête : L0 (AVIF) et les enseignes (v22.1 : H0 après le script, pour ne pas le retarder) du jeu de l'écran ; e3get et rue.js les reprennent (window.E3P)
        U = {k: [E3M[f'w/{k}/L0']['a'], f'img/e3d/w/{k}/pins.json'] for k in ('m', 'd')}
        E3PRE = ("<script>window.E3P={};(function(){var L=innerWidth<innerHeight*.95?%s:%s;"
                 "try{L.forEach(function(u,i){var p=fetch(u,{priority:i?'low':'high'}).then(function(r){if(!r.ok)throw r.status;return r});p.catch(function(){});E3P[u]=p})}catch(e){}})()</script>"
                 % (json.dumps(U['m']), json.dumps(U['d'])))
    for k, s in docs.items():
        s = fill(s, fonts, LINKS[out]).replace('{{E3M}}', E3MJ).replace('{{E3PRE}}', E3PRE)
        for k2 in ('m', 'd'):   # v22.1 : l'affiche floue (≈ 0,5 Ko), dans la page : la rue est là dès le premier affichage
            s = s.replace('{{PVB_%s}}' % k2.upper(), 'data:image/webp;base64,' + base64.b64encode((D / 'img' / 'e3d' / 'w' / k2 / 'blur.webp').read_bytes()).decode())
        if out == 'dist' and k in ('index', 'exemples', 'vitrine', 'visite', 'apercu', 'assistant', 'pub'): s = s.replace('</title>', '</title>\n' + UMAMI_JS, 1)
        assert '{{' not in s, (k, s[s.index('{{'):s.index('{{') + 20])
        built[k] = full(s, base='/' if k == '404' else '') if (wrap or k != 'index') else s   # la 404 est servie à n'importe quelle profondeur
        whole[k] = built[k]   # la page entière (avec ses scripts) : c'est elle qu'on lit pour savoir quels fichiers copier
        if wrap: built[k] = externalize(built[k], o, k)
        (o / f'{k}.html').write_text(built[k])
    (o / 'img').mkdir(exist_ok=True)   # seulement les images réellement citées (reel.*, trattoria.jpg, greves-1/2/3.jpg ne partent plus)
    html = ''.join(whole.values())
    for f in sorted(set(re.findall(r'img/[\w./-]+\.(?:jpe?g|png|webp|avif|mp4)', html))):
        if os.environ.get('E3TEST') and not (D / f).exists(): print('manque', f); continue   # rendu 3D en cours
        (o / f).parent.mkdir(parents=True, exist_ok=True); shutil.copy2(D / f, o / f)
        big = f.replace('.jpg', '-l.jpg')   # version 1600 px des photos de métier, demandée par l'aperçu en grand
        if f.startswith('img/t-') and (D / big).exists(): shutil.copy2(D / big, o / big)
    for f in sorted(set(re.findall(r'video/[\w./-]+\.(?:mp4|jpg)', html))):   # les vidéos de La Pub (video/pub/) et leurs affiches
        (o / f).parent.mkdir(parents=True, exist_ok=True); shutil.copy2(D / f, o / f)
    if 'img/greves/${k}/' in html or "dir:'greves'" in html:   # la visite de la démo : les deux jeux d'images, appelés par le script
        for k in ('d', 'm'): shutil.copytree(D / 'img' / 'greves' / k, o / 'img' / 'greves' / k, dirs_exist_ok=True)
    if 'img/e3d/' in html:   # l'entrée 3D de l'accueil : le film de l'intro (w) et, par métier, la porte et la salle (in-*), en paquets (E3M)
        for k in ('d', 'm'):
            src, dst = D / 'img' / 'e3d' / 'w' / k, o / 'img' / 'e3d' / 'w' / k; dst.mkdir(parents=True, exist_ok=True)
            for f in ('pins.json', 'stop.jpg', 'poster.jpg', 'poster.avif'):
                if (src / f).exists(): shutil.copy2(src / f, dst / f)
        for sd in [d for d in sorted((D / 'img' / 'e3d').iterdir()) if d.name.startswith('in-')]:
            for k in ('d', 'm'):
                src, dst = sd / k, o / sd.relative_to(D) / k; dst.mkdir(parents=True, exist_ok=True)
                lastf = [x.name for x in sorted(src.glob('f*.webp'))[-1:]]   # la dernière image : l'affiche en mouvement réduit (univers)
                ph = re.search(r"E3IN=\{d:\[([\d,]+)\],m:\[([\d,]+)\]\}", html)   # les photos du site (e3d.js, E3IN) : trois images de la salle
                phs = [f'f{int(i):03d}.webp' for i in ph.group(1 if k == 'd' else 2).split(',')] if ph else []
                for f in ['f000.webp', 'pins.json', 'poster.jpg', 'open.jpg', 'stop.jpg'] + lastf + phs:
                    if (src / f).exists() and not (dst / f).exists(): shutil.copy2(src / f, dst / f)
            for k in ('da', 'ma'):
                if (sd / k).is_dir():
                    (o / sd.relative_to(D) / k).mkdir(parents=True, exist_ok=True); shutil.copy2(sd / k / 'pins.json', o / sd.relative_to(D) / k / 'pins.json')
    (o / 'fonts').mkdir()
    for f, p, ws in FACES:
        for w in ws: shutil.copy(FONTDIR / (p % w), o / 'fonts')
    for n in ('Instrument-Sans', 'IBM-Plex-Mono'): shutil.copy(FONTDIR / f'OFL-{n}.txt', o / 'fonts')
    for st, f in SERIF: shutil.copy(D / 'fonts' / f, o / 'fonts')
    shutil.copy(D / 'fonts' / 'OFL-Cormorant-Garamond.txt', o / 'fonts')
    if wrap:
        for f in ('favicon.svg', 'favicon.ico', 'apple-touch-icon.png'): shutil.copy(D / 'brand' / f, o / f)
        U = ' https://cloud.umami.is' if UMAMI else ''
        csp = ("default-src 'self'; script-src 'self'" + U + ' ' + ' '.join(sorted(set().union(*(csp_hashes(h) for h in built.values()))))
               + "; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self'; font-src 'self'; connect-src 'self' data:" + (U + ' https://api-gateway.umami.dev' if UMAMI else '') + "; "
               "object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'")
        (o / '_headers').write_text('/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n'
            '  Strict-Transport-Security: max-age=31536000\n  X-Frame-Options: DENY\n  Cross-Origin-Opener-Policy: same-origin\n'
            f'  Content-Security-Policy: {csp}\n'
            '\n/apercu\n  X-Robots-Tag: noindex\n/apercu.html\n  X-Robots-Tag: noindex\n'
            '\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n'
            '\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n'
            '\n/img/*\n  Cache-Control: public, max-age=604800, stale-while-revalidate=86400\n'
            '\n/img/e3d/h/*\n  Cache-Control: public, max-age=31536000, immutable\n'
            '\n/apple-touch-icon.png\n  Cache-Control: public, max-age=604800\n')
        # Liens courts pour les bios et les cartes : oonde.ch/ig, /tt, /carte, /g (fiche Google) gardent la source dans le message WhatsApp
        (o / '_redirects').write_text('/exemples  /  301\n/ig     /?s=ig     302\n/tt     /?s=tt     302\n/carte  /?s=carte  302\n/g      /?s=gbp    302\n/videos /pub 301\n/videos.html /pub 301\n')
        (o / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://oonde.ch/sitemap.xml\n')
        (o / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>https://oonde.ch/{u}</loc></url>\n' for u in ('', 'vitrine', 'visite', 'assistant', 'pub')) + '</urlset>\n')
    # l'aperçu claude.ai ne sert que les fichiers publiés : chaque chemin local cité par une page doit exister
    for k, h in whole.items():
        for f in set(re.findall(r'(?:src|href|srcset|poster|data-src)="([^"#?:]+?)"', h)) | set(re.findall(r"'((?:img|video)/[\w./-]+\.(?:jpe?g|png|webp|mp4|json|txt))'", h)):
            if '${' in f or f.startswith(('/', 'mailto', 'tel')) or f in ('./', '') or (out == 'preview' and f in ('favicon.ico', 'favicon.svg', 'apple-touch-icon.png')): continue   # l'aperçu se passe des icônes
            f = f.split(' ')[0]
            if not ((o / f).exists() or (o / (f + '.html')).exists()): print('MANQUE', out, k, f)
print('ok', sorted(p.name for p in (D / 'dist').iterdir()))
