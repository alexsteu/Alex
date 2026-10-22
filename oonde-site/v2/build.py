# Construit le site OONDE v2 : dist/ (production, polices locales) et preview/ (aperçu Claude, Google Fonts).
import os, json, pathlib, re, shutil, urllib.parse, hashlib, base64
D = pathlib.Path(__file__).parent
FONTDIR = D.parent.parent / 'oonde-video' / 'fonts'
# v28.1 : l'icône WhatsApp est un symbole posé une fois par page (après le lien d'évitement) ; chaque bouton n'en garde qu'un renvoi
WA_SYM = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true"><symbol id="iWa" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z"/></symbol></svg>'
WA_ICON = '<svg width="20" height="20" aria-hidden="true" fill="currentColor"><use href="#iWa"/></svg>'
# v23.2 · LES PRIX, tous ici (rien d'autre à changer) : les trois paliers par mois, sans engagement, et leurs mises en ligne
# (payées seulement si le site terminé plaît). Option recommandée du 19 oct. 2026 (« sans engagement », Entrée réelle moins chère).
OFFRES = {'vit': 29, 'e3': 49, 'reel': 99, 'setup': 190, 'e3_setup': 290, 'reel_setup': 490}
def chf(n): return f"{n:,}".replace(',', '\u202f') + '.–'
# v24.1 · LE TÉLÉPHONE (assistant vocal), tout ici : trois forfaits par mois, leur mise en place, la minute au-delà du forfait.
# Source : telephone-ia/offre.md, « Texte pour le site » (proposition v2, à valider par Alexandre).
TEL_OFFRES = {'tel_ess': 149, 'tel_pro': 249, 'tel_pre': 449, 'tel_ess_setup': 290, 'tel_pro_setup': 390, 'tel_pre_setup': 490}
TEL_MIN = '0.40'   # la minute au-delà du forfait, en francs
# v27.2 · Rush (gros volume) : une ligne discrète sous les cartes, jamais une quatrième carte (Pro reste le centre).
TEL_RUSH = {'tel_rush': 590, 'tel_rush_setup': 490}
TEL_RUSH_MIN, TEL_RUSH_CALLS = '1 800', '1 200'
PX = {k + '_m': chf(OFFRES[k]) for k in ('vit', 'e3', 'reel')} | {k: chf(OFFRES[k]) for k in ('setup', 'e3_setup', 'reel_setup')} \
   | {k + '_n': str(OFFRES[k]) for k in OFFRES} | {'e3_jour': f"{round(OFFRES['e3'] * 12 / 365, 1):.2f}"} \
   | {k: chf(v) for k, v in TEL_OFFRES.items()} | {k + '_n': str(v) for k, v in TEL_OFFRES.items()} | {'tel_min': TEL_MIN} \
   | {k: chf(v) for k, v in TEL_RUSH.items()} | {'tel_rush_min': TEL_RUSH_MIN, 'tel_rush_calls': TEL_RUSH_CALLS} \
   | {'tel_pro_jour': f"moins de {-(-TEL_OFFRES['tel_pro'] * 12 // 365)}.–"}
def walink(msg): return 'https://wa.me/41779283540?text=' + urllib.parse.quote(msg)
HELLO = 'Bonjour, je viens de votre site.'   # les mêmes messages que MSG dans partials/core.js (qui les réécrit si l'on vient d'Instagram, de TikTok…)
# v24 · les messages pré-remplis (brief page-vente § 3.8) ; les mêmes textes que MSG dans partials/core.js
WA = walink(HELLO + " J’aimerais la maquette offerte de mon site La Vitrine.\nMon commerce et ma commune : ")
WA_PASSE = walink(HELLO + " J’aimerais que vous passiez me montrer une maquette.\nMon commerce, ma commune et le meilleur moment : ")
WA_IMM = walink(HELLO + " J’aimerais voir ma façade en 3D et recevoir le prix de mon site.\nMon commerce et ma commune : ")
WA_ASSIST = walink(HELLO + " J’ai essayé l’assistant. J’aimerais le même pour mon commerce.\nMon commerce et ma commune : ")
WA_TEL = walink(HELLO + " J’aimerais recevoir ma démo du téléphone, à mon nom.\nMon commerce et ma commune : ")
# v28 · « Je veux celui-ci » sur chaque forfait du téléphone : le forfait est nommé dans le message
WA_TEL_ESS = walink(HELLO + " Le téléphone m’intéresse, forfait Essentiel. J’aimerais recevoir ma démo à mon nom.\nMon commerce et ma commune : ")
WA_TEL_PRO = walink(HELLO + " Le téléphone m’intéresse, forfait Pro. J’aimerais recevoir ma démo à mon nom.\nMon commerce et ma commune : ")
WA_TEL_PRE = walink(HELLO + " Le téléphone m’intéresse, forfait Premium. J’aimerais recevoir ma démo à mon nom.\nMon commerce et ma commune : ")
WA_TEL_RUSH = walink(HELLO + " Le téléphone m’intéresse, forfait Rush. J’aimerais recevoir ma démo à mon nom.\nMon commerce et ma commune : ")
WA_FIL = walink(HELLO + " Les réseaux sociaux m’intéressent : du contenu publié chaque matin sur mon Instagram. J’aimerais un exemple pour mon commerce.\nMon commerce, ma commune et mon compte Instagram : ")
WA_DEMO = walink(HELLO + " J’ai vu la démo Les Grèves. J’aimerais une entrée en 3D pour mon lieu.\nMon commerce et ma commune : ")
WA_LIEU = walink(HELLO + " J’aimerais que vous veniez voir mon commerce pour l’Entrée réelle.\nMon commerce, ma commune et le meilleur moment : ")
WA_Q = walink(HELLO + " J’ai une question : ")
WA_COURS = walink(HELLO + " Les cours et formations m’intéressent.\nSur quel sujet : ")
WA_APL = walink(HELLO + " J’ai vu ma maquette, je la veux en ligne.")
WA_APC = walink(HELLO + " J’ai vu ma maquette, j’aimerais changer : ")
# v24 · LE FIL (v27.1 : « Réseaux sociaux » pour le visiteur ; les clés FIL restent), tout ici : la cadence et les heures (pas encore confirmées par Alexandre), et le prix.
# FIL_DES = None : « Prix par écrit sous 48 h. Sans engagement. » ; un nombre (ex. 39) : « Dès 39.– /mois. Sans engagement. » (jamais 0, jamais barré).
FIL_DES = None
FIL = {'cadence': 'chaque matin', 'Cadence': 'Chaque matin',
       'veille': 'La veille, 18 h', 'veille_c': '18:00', 'heure': '7 h 30', 'heure_c': '7:30', 'jour_c': '12:00',
       'prix': (f"Dès {chf(FIL_DES)} /mois. Sans engagement." if FIL_DES else 'Prix par écrit sous 48 h. Sans engagement.')}
def qr(url):
    """Le code QR (ordinateur seulement) : on scanne avec son téléphone, WhatsApp s'ouvre avec le message.
    v25 : un fichier SVG à part (img/qr-*.svg), chargé paresseusement et jamais sur téléphone (bloc masqué) ;
    le dessin en traits par rangée (≈ 4 fois plus léger que le chemin module par module de qrcode)."""
    import qrcode
    q = qrcode.QRCode(border=2); q.add_data(url); q.make(fit=True); m = q.get_matrix(); n = len(m)
    d = []
    for y, row in enumerate(m):
        x = 0
        while x < n:
            if row[x]:
                w = 1
                while x + w < n and row[x + w]: w += 1
                d.append(f'M{x} {y}.5h{w}'); x += w
            else: x += 1
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n} {n}" width="{n * 4}" height="{n * 4}" shape-rendering="crispEdges">'
            f'<path stroke="#111318" d="{"".join(d)}"/></svg>')
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
    """{{NAV:page}} : la navigation du haut, la même partout (v24 : La démo · Sites et prix · Réseaux sociaux · Le téléphone · Questions, et « Et aussi »).
    Sur l'accueil, Réseaux sociaux et Le téléphone mènent à leur étage ; ailleurs, à leur page.
    v27.1 : « Le Fil » s'appelle Réseaux sociaux (page /reseaux) ; La Vitrine quitte « Et aussi » (elle reste au pied de page et sur les cartes d'offre)."""
    H = '' if cur == 'index' else '{{HOME}}'
    a = lambda k: ' aria-current="page"' if k == cur else ''
    sub = cur in ('assistant', 'visite', 'vitrine')
    rs, tel = ('#reseaux', '#telephone') if cur == 'index' else ('{{RESEAUX}}', '{{TELEPHONE}}')
    return (f'<a href="{H}#choix">La démo</a><a href="{H}#prix">Sites et prix</a><a class="opt" href="{rs}"{a("reseaux")}>Réseaux sociaux</a><a class="opt" href="{tel}"{a("telephone")}>Le téléphone</a>'
            f'<span class="nav-sub opt3"><button type="button" class="nav-sb"{" data-cur" if sub else ""} aria-expanded="false" aria-controls="navS">Et aussi</button><span class="nav-sl" id="navS"><a href="{{{{ASSISTANT}}}}"{a("assistant")}>L’assistant</a><a href="{{{{VISITE}}}}"{a("visite")}>La visite complète</a></span></span>'
            f'<a class="opt2" href="{H}#questions">Questions</a>')

# v24 · Le Fil : les vidéos de démo, nommées pour la commerçante (ce qui sort sur son fil), et non par nos ateliers.
# Fichiers web 720×1280 : video/fil/ (exemples de commerces) et video/demos/ (une démo par façon de faire ; les noms restent stables).
# (clé, chemin sans extension, ce qui sort sur le fil, une ligne, étiquettes sous la vidéo, texte alternatif)
FV = {
    'plat': ('video/fil/trattoria', 'Le plat du jour, qui arrive à l’écran.', 'Vos plats, votre salle, et le bouton Réserver à la fin.', ['Démo · commerce inventé', 'voix IA'], 'Trattoria Nonna Pia, un restaurant inventé : des pâtes, une pizza au feu de bois, un tiramisu, puis le bouton Réserver.'),
    'produit': ('video/demos/demo03-produit-9x16', 'Votre produit en photo, qui se met à bouger.', 'Une photo de votre téléphone suffit.', ['Démo · images IA', 'voix IA'], 'Un croissant, un bouquet, un flacon, un café et une bougie, inventés : chaque photo se met à bouger.'),
    'saison': ('video/demos/demo01-motion-9x16', 'Un message de saison, texte et voix.', 'Une ouverture, les horaires d’été, une nouveauté : sans tournage.', ['Démo · commerce inventé', 'voix IA'], 'Cycles Ravenelle, un atelier vélo inventé : des mots qui bougent, un vélo dessiné, puis le nom du commerce.'),
    'tap': ('video/demos/demo06-pub-en-un-tap-9x16', 'Une nouveauté, en un tap.', 'Vous choisissez quelques photos, on en fait la vidéo.', ['Démo · commerce inventé', 'voix IA'], 'Une appli inventée : on choisit Salon, on coche des photos, et la vidéo du Salon Mirabelle, un salon fictif, se crée.'),
    'ardoise': ('video/fil/ardoise', 'L’ardoise du jour.', 'Pour les restaurants et les cafés : la photo de l’ardoise devient une vidéo.', ['Démo · commerce inventé', 'voix IA'], 'Café Cormoran, un café inventé : l’ardoise sous la pluie, puis le menu dans le téléphone.'),
    'angles': ('video/demos/demo04-angles-9x16', 'Un produit, sous tous les angles.', 'Une seule prise devient quatre plans.', ['Démo · images IA', 'voix IA'], 'Une tasse de café filmée une fois, puis vue de dessus, en macro, au ras de la table et de dos.'),
}
FV = {k: v for k, v in FV.items() if (D / f'{v[0]}.mp4').exists()}
SND_SVG = '<svg class="off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6m0-6-5 6"/></svg><svg class="on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>'
PLAY_SVG = '<span class="pl" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg></span>'
def avif(jpg):
    """v25 : l'affiche d'une vidéo aussi en AVIF (≈ deux fois plus légère), à côté du JPG, gardé en secours ; faite une fois, puis gardée dans les sources."""
    a = D / (jpg[:-4] + '.avif')
    if not a.exists() or a.stat().st_mtime < (D / jpg).stat().st_mtime:
        from PIL import Image
        Image.open(D / jpg).convert('RGB').save(a, 'AVIF', quality=55)
    return jpg[:-4] + '.avif'
def poster(jpg, attrs):
    return f'<picture><source type="image/avif" srcset="{avif(jpg)}"><img src="{jpg}" {attrs}></picture>'
def vbox(src, alt, m):
    return (f'<div class="v" data-v="{src}.mp4">' + poster(f'{src}.jpg', f'width="720" height="1280" alt="Démo : {alt}" loading="lazy" decoding="async"')
            + f'<button type="button" class="vp" aria-label="Lire la démo : {m}" aria-pressed="false" style="position:absolute;inset:0;background:none;border:0;cursor:pointer;width:100%">{PLAY_SVG}</button>'
            f'<button type="button" class="snd" aria-label="Son de la démo : {m}" aria-pressed="false">{SND_SVG}<span>Son</span></button></div>')
def ftile(k, line=True):
    src, t, d, tags, alt = FV[k]
    return (f'<li>{vbox(src, alt, t.rstrip("."))}<div class="cap"><p class="ft">{t}</p>' + (f'<p>{d}</p>' if line else '')
            + '<p class="vt">' + ' '.join(f'<span class="dtag{" ia" if i else ""}">{x}</span>' for i, x in enumerate(tags)) + '</p></div></li>')
FIL_HOME = '<ul class="vrail v3">' + ''.join(ftile(k, False) for k in ('plat', 'produit', 'angles') if k in FV) + '</ul>'   # l'accueil : trois au plus, même taille (v24.1 : les angles remplacent le vélo)
FIL_FORMATS = '<ul class="vrail v6">' + ''.join(ftile(k) for k in FV) + '</ul>'

def fill(s, fonts, links):
    # v25 : le CSS commun (base.css) et le script commun (core.js) dans leurs propres blocs : en production, ce sont deux fichiers
    # à empreinte partagés par toutes les pages (en cache dès la première), au lieu d'être recopiés dans le fichier de chaque page.
    s = s.replace('<style>\n{{INC:base.css}}\n', '<style>\n{{INC:base.css}}\n</style>\n<style>\n', 1).replace('<script>\n{{INC:core.js}}\n', '<script>\n{{INC:core.js}}\n</script>\n<script>\n', 1)
    s = inc(s)
    s = re.sub(r'\{\{POSTER:([^|}]+)\|([^}]*)\}\}', lambda m: poster(m.group(1), m.group(2)), s)   # v25 : une affiche de vidéo écrite à la main
    s = re.sub(r'\{\{NAV:(\w+)\}\}', lambda m: nav(m.group(1)), s)
    if '{{WA_ICON}}' in s:   # v28.1 : le symbole de l'icône WhatsApp, une fois, juste après le lien d'évitement (full() coupe <body> à ce lien)
        s, n = re.subn(r'(<a class="skip"[^>]*>.*?</a>)', lambda m: m.group(1) + WA_SYM, s, count=1)
        assert n == 1, 'pas de lien d’évitement pour poser le symbole WhatsApp'
    s = s.replace('{{FIL_HOME}}', FIL_HOME).replace('{{FIL_FORMATS}}', FIL_FORMATS)
    s = re.sub(r'\{\{FIL:(\w+)\}\}', lambda m: FIL[m.group(1)], s)
    s = re.sub(r'\{\{PX:(\w+)\}\}', lambda m: PX[m.group(1)], s)
    for k, v in MESURE.items(): s = s.replace(k, v)
    for k, v in links.items(): s = s.replace(k, v)
    for k, v in [('{{FONTS}}', fonts), ('{{WA_ICON}}', WA_ICON), ('{{WA_IMM}}', WA_IMM), ('{{WA_ASSIST}}', WA_ASSIST), ('{{WA_FIL}}', WA_FIL), ('{{WA_TEL_ESS}}', WA_TEL_ESS), ('{{WA_TEL_PRO}}', WA_TEL_PRO), ('{{WA_TEL_PRE}}', WA_TEL_PRE), ('{{WA_TEL_RUSH}}', WA_TEL_RUSH), ('{{WA_TEL}}', WA_TEL), ('{{WA_COURS}}', WA_COURS), ('{{WA_APL}}', WA_APL), ('{{WA_APC}}', WA_APC), ('{{WA_DEMO}}', WA_DEMO), ('{{WA_PASSE}}', WA_PASSE), ('{{WA_Q}}', WA_Q), ('{{WA_LIEU}}', WA_LIEU), ('{{WA}}', WA), ('{{MARK}}', MARK), ('{{LOGO}}', LOGO),
                 ('{{QR_WA}}', QR_WA), ('{{QR_IMM}}', QR_IMM), ('{{QR_021}}', QR_021), ('{{CAL}}', CAL)]:
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

# v27 : le film de l'intro est une vidéo (video/e3d/<jeu>/*.mp4, affiches img/e3d/v/<jeu>/) ; les paquets d'images (pack, wpacks, E3M, E3PRE) ont disparu.


# v28.1 : les commentaires du CSS et du JS restent dans les sources (partials/, pages) mais ne partent pas dans les fichiers construits
# (≈ 15 % du texte, 14 Ko gzip sur l'ensemble). strip_js lit chaînes, gabarits, expressions régulières et commentaires comme le
# ferait l'analyseur, pour ne rien retirer dans une chaîne ; vérifié jeton par jeton (TypeScript) sur chaque script du site. SLIM = False pour débrayer.
SLIM = True
def strip_css(s):
    out=[];i=0;n=len(s)
    while i<n:
        c=s[i]
        if c in '"\'':
            j=i+1
            while j<n and s[j]!=c:
                if s[j]=='\\': j+=1
                j+=1
            out.append(s[i:j+1]);i=j+1;continue
        if s.startswith('url(',i):
            j=s.find(')',i);j=n if j<0 else j+1;out.append(s[i:j]);i=j;continue
        if c=='/' and s.startswith('/*',i):
            j=s.find('*/',i+2);i=n if j<0 else j+2;continue
        out.append(c);i+=1
    t=''.join(out)
    t=re.sub(r'[ \t]+\n','\n',t);t=re.sub(r'\n{2,}','\n',t)
    return t.strip('\n')+'\n' if t.strip() else ''
KW={'return','typeof','instanceof','in','of','new','delete','void','throw','case','do','else','yield','await'}
def strip_js(s):
    n=len(s);out=[]
    def last_sig():
        for k in range(len(out)-1,-1,-1):
            t=out[k].rstrip()
            if t: return t
        return ''
    def regex_ok():
        t=last_sig()
        if not t: return True
        c=t[-1]
        if c in '(,=:[!&|?{};+-*%<>~^': return True
        if c=='}': return True
        m=re.search(r'([A-Za-z_$][\w$]*)$',t)
        return bool(m and m.group(1) in KW)
    def str_end(i):
        q=s[i];j=i+1
        while j<n and s[j]!=q:
            if s[j]=='\\': j+=1
            j+=1
        return j+1
    def regex_end(i):
        j=i+1;cls=False
        while j<n:
            c=s[j]
            if c=='\\': j+=2;continue
            if cls:
                if c==']': cls=False
            elif c=='[': cls=True
            elif c=='/': j+=1;break
            elif c=='\n': raise ValueError('regex sans fin ligne '+str(s.count(chr(10),0,i)+1))
            j+=1
        while j<n and (s[j].isalpha()): j+=1
        return j
    def code(i,in_tpl):
        depth=0
        while i<n:
            c=s[i]
            if c=='/' and s.startswith('/*',i):
                j=s.find('*/',i+2);j=n if j<0 else j+2
                a=s[i-1] if i>0 else ' ';b=s[j] if j<n else ' '
                if (a.isalnum() or a in '_$') and (b.isalnum() or b in '_$'): out.append(' ')
                i=j;continue
            if c=='/' and s.startswith('//',i):
                j=s.find('\n',i);i=n if j<0 else j;continue
            if c in '"\'':
                j=str_end(i);out.append(s[i:j]);i=j;continue
            if c=='`':
                out.append('`');i+=1
                while i<n and s[i]!='`':
                    if s[i]=='\\': out.append(s[i:i+2]);i+=2;continue
                    if s[i]=='$' and s.startswith('${',i): out.append('${');i=code(i+2,True);continue
                    out.append(s[i]);i+=1
                out.append('`');i+=1;continue
            if c=='/' and regex_ok():
                j=regex_end(i);out.append(s[i:j]);i=j;continue
            if in_tpl:
                if c=='{': depth+=1
                elif c=='}':
                    if depth==0: out.append('}');return i+1
                    depth-=1
            out.append(c);i+=1
        return i
    code(0,False)
    t=''.join(out)
    t=re.sub(r'[ \t]+\n','\n',t);t=re.sub(r'\n{2,}','\n',t)
    return t.strip('\n')+'\n' if t.strip() else ''
def slim(html):
    if not SLIM: return html
    html = re.sub(r'<style([^>]*)>(.*?)</style>', lambda m: f'<style{m.group(1)}>{strip_css(m.group(2))}</style>', html, flags=re.S)
    return re.sub(r'<script((?:\s[^>]*)?)>(.*?)</script>', lambda m: m.group(0) if 'type=' in m.group(1) or 'src=' in m.group(1) else f'<script{m.group(1)}>{strip_js(m.group(2))}</script>', html, flags=re.S)

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

MISSING = []
layout = (D / 'legal-layout.html').read_text()
QRS = {'img/qr-imm.svg': qr(WA_IMM), 'img/qr-wa.svg': qr(WA), 'img/qr-021.svg': qr('tel:+41215390122')}   # v28.2 : la ligne démo 021, à scanner depuis l'ordinateur   # v25 : les codes QR (bas des pages, ordinateur)
QR_IMM, QR_WA = ('<img src="img/qr-%s.svg" width="84" height="84" alt="" loading="lazy" decoding="async">' % k for k in ('imm', 'wa'))
QR_021 = '<img class="tel-qr" src="img/qr-021.svg" width="112" height="112" alt="Code QR : appeler le 021 539 01 22" loading="lazy" decoding="async">'
docs = {'index': (D / 'home.html').read_text(), 'exemples': (D / 'exemples.html').read_text(), 'vitrine': (D / 'vitrine.html').read_text(), 'visite': (D / 'visite.html').read_text(), 'apercu': (D / 'apercu.html').read_text(), 'assistant': (D / 'assistant.html').read_text(), 'reseaux': (D / 'reseaux.html').read_text(), 'telephone': (D / 'telephone.html').read_text()}
for k, (title, desc, cur) in PAGES.items():
    s = layout.replace('{{TITLE}}', title).replace('{{DESC}}', desc).replace('{{BODY}}', BODY404 if k == '404' else (D / 'legal' / f'{k}.html').read_text())
    for c in 'MCG':
        s = s.replace('{{CUR_%s}}' % c, ' aria-current="page"' if c == cur else '')
    docs[k] = s

# Netlify sert /visite depuis visite.html ; l'aperçu claude.ai a besoin du nom complet
LINKS = {'dist': {'{{VISITE}}': 'visite', '{{APERCU}}': 'apercu', '{{HOME}}': './', '{{EXEMPLES}}': './#choix', '{{VITRINE}}': 'vitrine', '{{ASSISTANT}}': 'assistant', '{{RESEAUX}}': 'reseaux', '{{TELEPHONE}}': 'telephone'},
         'preview': {'{{VISITE}}': 'visite.html', '{{APERCU}}': 'apercu.html', '{{HOME}}': 'index.html', '{{EXEMPLES}}': 'index.html#choix', '{{VITRINE}}': 'vitrine.html', '{{ASSISTANT}}': 'assistant.html', '{{RESEAUX}}': 'reseaux.html', '{{TELEPHONE}}': 'telephone.html'}}
for out, fonts, wrap in [('dist', LOCAL, True), ('preview', LOCAL, False)]:   # v22 : l'aperçu sert aussi ses polices (plus de connexion à Google Fonts sur iPhone)
    o = D / out; shutil.rmtree(o, ignore_errors=True); o.mkdir(); built = {}; whole = {}
    for k, s in docs.items():
        s = fill(s, fonts, LINKS[out])
        for k2 in ('m', 'd'):   # v22.1 : l'affiche floue (≈ 0,5 Ko), dans la page : la rue est là dès le premier affichage
            s = s.replace('{{PVB_%s}}' % k2.upper(), 'data:image/webp;base64,' + base64.b64encode((D / 'img' / 'e3d' / 'v' / k2 / 'blur.webp').read_bytes()).decode())
        if out == 'dist' and k in ('index', 'exemples', 'vitrine', 'visite', 'apercu', 'assistant', 'reseaux', 'telephone'): s = s.replace('</title>', '</title>\n' + UMAMI_JS, 1)
        assert '{{' not in s, (k, s[s.index('{{'):s.index('{{') + 20])
        s = slim(s)   # v28.1 : sans les commentaires du CSS et du JS
        built[k] = full(s, base='/' if k == '404' else '') if (wrap or k != 'index') else s   # la 404 est servie à n'importe quelle profondeur
        whole[k] = built[k]   # la page entière (avec ses scripts) : c'est elle qu'on lit pour savoir quels fichiers copier
        if wrap: built[k] = externalize(built[k], o, k)
        (o / f'{k}.html').write_text(built[k])
    (o / 'img').mkdir(exist_ok=True)
    for f, svg in QRS.items(): (o / f).write_text(svg)
    # seulement les images réellement citées (reel.*, trattoria.jpg, greves-1/2/3.jpg ne partent plus)
    html = ''.join(whole.values())
    for f in sorted(set(re.findall(r'img/[\w./-]+\.(?:jpe?g|png|webp|avif|mp4)', html))):
        if not (D / f).exists():   # v25 : une image citée mais absente des sources arrête la construction (plus bas)
            MISSING.append((out, 'source', f)); continue
        (o / f).parent.mkdir(parents=True, exist_ok=True); shutil.copy2(D / f, o / f)
        big = f.replace('.jpg', '-l.jpg')   # version 1600 px des photos de métier, demandée par l'aperçu en grand
        if f.startswith('img/t-') and (D / big).exists(): shutil.copy2(D / big, o / big)
    for f in sorted(set(re.findall(r'video/[\w./-]+\.(?:mp4|jpg|avif)', html))):   # les vidéos (video/fil/, video/demos/) et leurs affiches
        (o / f).parent.mkdir(parents=True, exist_ok=True); shutil.copy2(D / f, o / f)
    if 'img/greves/${k}/' in html or "dir:'greves'" in html:   # la visite de la démo : les deux jeux d'images, appelés par le script
        for k in ('d', 'm'): shutil.copytree(D / 'img' / 'greves' / k, o / 'img' / 'greves' / k, dirs_exist_ok=True)
    if 'img/e3d/' in html:   # v27 : l'entrée 3D de l'accueil : les clips (video/e3d/<jeu>/), leurs affiches et enseignes (img/e3d/v/), et les photos de la salle par métier (in-*, E3IN)
        for sub in ('img/e3d/v', 'video/e3d'):
            if (D / sub).is_dir(): shutil.copytree(D / sub, o / sub, dirs_exist_ok=True, ignore=shutil.ignore_patterns('*.json.tmp'))
        ph = re.search(r"E3IN=\{d:\[([\d,]+)\],m:\[([\d,]+)\]\}", html)
        for sd in [d for d in sorted((D / 'img' / 'e3d').iterdir()) if d.name.startswith('in-')]:
            for k in ('d', 'm'):
                src, dst = sd / k, o / sd.relative_to(D) / k
                phs = [f'f{int(i):03d}.webp' for i in ph.group(1 if k == 'd' else 2).split(',')] if ph else []
                for f in phs:
                    if (src / f).exists():
                        dst.mkdir(parents=True, exist_ok=True); shutil.copy2(src / f, dst / f)
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
            '\n/video/*\n  Cache-Control: public, max-age=604800, stale-while-revalidate=86400\n'
            '\n/apple-touch-icon.png\n  Cache-Control: public, max-age=604800\n')
        # Liens courts pour les bios et les cartes : oonde.ch/ig, /tt, /carte, /g (fiche Google) gardent la source dans le message WhatsApp
        (o / '_redirects').write_text('/exemples  /  301\n/ig     /?s=ig     302\n/tt     /?s=tt     302\n/carte  /?s=carte  302\n/g      /?s=gbp    302\n/pub    /reseaux  301\n/pub.html /reseaux 301\n/videos /reseaux  301\n/videos.html /reseaux 301\n/fil    /reseaux  301\n/fil.html /reseaux 301\n')
        (o / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://oonde.ch/sitemap.xml\n')
        (o / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>https://oonde.ch/{u}</loc></url>\n' for u in ('', 'vitrine', 'reseaux', 'telephone', 'assistant', 'visite')) + '</urlset>\n')
    # l'aperçu claude.ai ne sert que les fichiers publiés : chaque chemin local cité par une page doit exister
    for k, h in whole.items():
        for f in set(re.findall(r'(?:src|href|srcset|poster|data-src|data-v)="([^"#?:]+?)"', h)) | set(re.findall(r"'((?:img|video)/[\w./-]+\.(?:jpe?g|png|webp|mp4|json|txt))'", h)) | set(re.findall(r'url\(["\']?((?:img|video|fonts)/[^"\')]+)', h)):
            if '${' in f or f.startswith(('/', 'mailto', 'tel')) or f in ('./', '') or (out == 'preview' and f in ('favicon.ico', 'favicon.svg', 'apple-touch-icon.png')): continue   # l'aperçu se passe des icônes
            f = f.split(' ')[0]
            if not ((o / f).exists() or (o / (f + '.html')).exists()): MISSING.append((out, k, f))
if MISSING:   # v25 : un fichier cité mais absent (supprimé par erreur ?) : la construction échoue
    raise SystemExit('MANQUE :\n' + '\n'.join(f'  {o} {k} {f}' for o, k, f in sorted(set(MISSING))))
print('ok', sorted(p.name for p in (D / 'dist').iterdir()))
