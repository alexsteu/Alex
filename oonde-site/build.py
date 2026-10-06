# Construit le site OONDE à partir du site Enseigne (base/enseigne.html).
import re, pathlib
D = pathlib.Path(__file__).parent
s = (D / 'base/enseigne.html').read_text()

def one(a, b, n=1):
    global s
    c = s.count(a)
    assert c == n, (a[:70], c)
    s = s.replace(a, b)

# 1. Retirer l'enveloppe d'artefact
s = s[s.index('<title>'):]
s = s.replace('</body></html>', '').rstrip() + '\n'

# 2. Titre, description, polices
one('<title>Enseigne</title>', '<title>OONDE</title>')
one('content="Enseigne crée les sites internet et les fiches Google des commerces de La Côte, entre Lausanne et Genève. Maquette gratuite, vous payez seulement si ça vous plaît."',
    'content="OONDE crée les sites internet et les fiches Google des commerces de La Côte, entre Lausanne et Genève. Maquette gratuite, vous payez seulement si ça vous plaît. Alexandre Steudler et Serhat Dogar."')
one('family=Unbounded:wght@500;700;800&family=Figtree:wght@400;500;600',
    'family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@500;600&family=Instrument+Sans:wght@400;500;600')

# 3. Direction artistique « Signal »
one("/* Concept : l'horizon du Léman. Bandes horizontales comme les lignes du lac et des vignes, un téléphone qui montre le résultat. */",
    "/* Concept : DA « Signal » d'OONDE. Porcelaine, encre, un seul accent bleu Klein, champ de points en onde. Un téléphone qui montre le résultat. */")
one(""" --lake:#0d3644;--lake-2:#14505f;--mist:#e8f0ee;--paper:#f7f6f1;--ink:#14211f;--muted:#55635f;--line:#d9e1dd;
 --sun:#f0915e;--sun-ink:#1c120c;--vine:#8fa64a;--card:#ffffff;
 --display:'Unbounded',system-ui,sans-serif;--body:'Figtree',system-ui,sans-serif;""",
""" --lake:#0E1116;--lake-2:#1B2333;--mist:#ECEEF8;--paper:#F5F6F3;--ink:#0E1116;--muted:#5C6470;--line:#E7EAE5;
 --sun:#2038EC;--sun-ink:#FFFFFF;--vine:#2038EC;--card:#ffffff;--nuit:#8B9BFF;
 --display:'Bricolage Grotesque','Helvetica Neue',Arial,sans-serif;--body:'Instrument Sans',system-ui,-apple-system,sans-serif;--mono:'IBM Plex Mono',ui-monospace,Menlo,monospace;""")
one('--paper:#0c1416;--ink:#e9efed;--muted:#9fb0ab;--line:#22312f;--card:#122023;--mist:#15262a;',
    '--paper:#0B0E13;--ink:#EDEFF2;--muted:#9AA3B0;--line:#232A35;--card:#141922;--mist:#161C2B;--sun:#6F82FF;--sun-ink:#0B0E13;--vine:#8B9BFF;', 2)
one('h1,h2,h3{font-family:var(--display);line-height:1.08;margin:0;text-wrap:balance;letter-spacing:-.01em}',
    'h1,h2,h3{font-family:var(--display);line-height:1.05;margin:0;text-wrap:balance;letter-spacing:-.02em}')
one('.eyebrow{font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--sun)}',
    '.eyebrow{font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--sun);display:inline-flex;align-items:center;gap:12px}\n.eyebrow::before{content:"";width:26px;height:1.5px;background:currentColor;flex:none}\n.hero .eyebrow,.hero h1 em,.steps-wrap .eyebrow,.step::before,.msg.sys{color:var(--nuit)!important}\n.promise span::before{color:var(--nuit)!important}')
one('border-radius:999px;padding:14px 22px;transition:transform .15s}', 'border-radius:12px;padding:14px 22px;transition:transform .35s cubic-bezier(.22,.61,.2,1),background .35s}')
one('.btn-sun{background:var(--sun);color:var(--sun-ink)}', '.btn-sun{background:var(--sun);color:var(--sun-ink)}\n.hero .btn-sun{background:#2038EC;color:#fff}.hero .btn-sun:hover{background:#fff;color:#0E1116}')
one('.logo i{width:26px;height:26px;border-radius:50%;background:linear-gradient(180deg,var(--sun) 0 48%,transparent 48% 56%,#7fb6c2 56% 70%,transparent 70% 78%,#7fb6c2 78%);display:block}',
    '.logo{letter-spacing:.02em}\n.logo i{width:12px;height:12px;border-radius:50%;background:#2038EC;display:block;box-shadow:0 0 0 0 rgba(139,155,255,.6);animation:ping 2.8s cubic-bezier(.22,.61,.2,1) infinite}\n@keyframes ping{70%,100%{box-shadow:0 0 0 10px rgba(139,155,255,0)}}\n@media (prefers-reduced-motion:reduce){.logo i{animation:none}}')
one('rgba(240,145,94,.55),rgba(240,145,94,0) 65%', 'rgba(32,56,236,.5),rgba(32,56,236,0) 65%')
one('.msg.bot{background:#14505f;', '.msg.bot{background:#2038EC;')
one('.call-head{display:flex;align-items:center;gap:12px;padding-bottom:12px;border-bottom:1px solid #22312f}',
    '.call-head{display:flex;align-items:center;gap:12px;padding-bottom:12px;border-bottom:1px solid #232A35}')
one('.msg.cl{background:#22312f;', '.msg.cl{background:#232A35;')

# 4. Textes : Enseigne -> OONDE
one('<a class="logo" href="#top"><i aria-hidden="true"></i>Enseigne</a>', '<a class="logo" href="#top" aria-label="OONDE, retour en haut"><i aria-hidden="true"></i>OONDE</a>')
one('<a href="#faq">Questions</a></nav>', '<a href="#nous">Qui sommes-nous</a><a href="#faq">Questions</a></nav>')
one("<span class=\"eyebrow\">L'enseigne de votre commerce, sur internet</span>", '<span class="eyebrow">Sites, fiches Google et IA · La Côte</span>')
one('<span class="tag">Pack Enseigne</span>', '<span class="tag">Pack OONDE</span>')

# 5. Fiche Google : mention des IA
one("avant même qu'il vous appelle.</p>",
    "avant même qu'il vous appelle.</p>\n   <p style=\"color:var(--muted);max-width:32em\">C'est aussi ce que lisent ChatGPT, Gemini et les autres assistants quand on leur demande « un bon coiffeur à Rolle ». Une fiche complète, c'est une réponse claire.</p>")

# 6. Contact et mentions
one('<div style="font-size:13px;opacity:.7">Ou écrivez directement à <span id="mail" style="user-select:all">alex.sbjo@gmail.com</span> · Alexandre Steudler, Préverenges</div>',
    '<div class="direct">Ou contactez-nous directement :<br><a href="mailto:oonde.signal@gmail.com" id="mail">oonde.signal@gmail.com</a> · <a href="tel:+41764882710">+41 76 488 27 10</a> · <a href="https://wa.me/41764882710" target="_blank" rel="noopener">WhatsApp</a> · <a href="https://www.instagram.com/oonde.studio" target="_blank" rel="noopener">@oonde.studio</a></div>')
one('<span>© 2026 Enseigne · Sites internet et fiches Google pour les commerces de La Côte</span>',
    '<span><b style="color:var(--ink)">● OONDE</b> · Sites internet, fiches Google et IA pour les commerces de La Côte · © 2026 Alexandre Steudler &amp; Serhat Dogar</span>')
one('<p>Enseigne est une activité indépendante de Alexandre Steudler, Chemin des Écureuils 1, 1028 Préverenges, Suisse. Contact\u00a0: alex.sbjo@gmail.com.<br>',
    '<p>OONDE est une activité d\'Alexandre Steudler et Serhat Dogar. Responsable : Alexandre Steudler, Chemin des Écureuils 1, 1028 Préverenges, Suisse. Contact : oonde.signal@gmail.com, +41 76 488 27 10.<br>')
one("done.innerHTML='L\\'envoi n\\'a pas fonctionné depuis cette page. Copiez ce message et envoyez-le à l\\'adresse ci-dessous :<br>",
    "done.innerHTML='L\\'envoi n\\'a pas fonctionné depuis cette page. Copiez ce message et envoyez-le par WhatsApp au +41 76 488 27 10 ou à oonde.signal@gmail.com :<br>")
assert 'Enseigne' not in s.replace('enseigne-essai', ''), [m.start() for m in re.finditer('Enseigne', s)]
assert 'alex.sbjo' not in s

# 7. Nouvelles sections
STUDY = (D / 'parts/etude.html').read_text()
NOUS = (D / 'parts/nous.html').read_text()
CSS = (D / 'parts/extra.css').read_text()
one('<section class="try" id="essai">', STUDY + '<section class="try" id="essai">')
one('<section id="faq" style="padding-top:0">', NOUS + '<section id="faq" style="padding-top:0">')
one('footer .legal p{margin:8px 0 0;font-size:13px}\n</style>', 'footer .legal p{margin:8px 0 0;font-size:13px}\n' + CSS + '</style>')

# 8. Champ de points « Signal » à la place du lac
a = s.index('/* --- Lac animé --- */'); b = s.index('/* --- Avant / après --- */')
s = s[:a] + (D / 'parts/field.js').read_text() + '\n' + s[b:]
reel = (D / 'parts/reel.js').read_text()
s = s.replace('</script>\n', reel + '\n</script>\n') if s.rstrip().endswith('</script>') else s
assert reel in s

(D / 'src/page.html').write_text(s)
i = s.index('<header')
(D / 'index.html').write_text('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="theme-color" content="#0E1116">\n'
    + s[:i] + '</head>\n<body>\n' + s[i:] + '</body>\n</html>\n')
print('ok', len(s))
