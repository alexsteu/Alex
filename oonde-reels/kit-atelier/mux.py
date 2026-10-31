"""Kit Reels OONDE : assemble vidéo muette + son, normalisé en deux passes (−15 LUFS, crête vraie ≤ −1,5 dBTP, 48 kHz).

    python3 mux.py video.mp4 audio.wav sortie.mp4
Puis vérifie : imprime le niveau intégré et la crête vraie mesurés sur le MP4 final.
"""
import json
import re
import subprocess
import sys

v, a, out = sys.argv[1:4]
I, TP, LRA = -15, -2.0, 11
m = subprocess.run(["ffmpeg", "-hide_banner", "-i", a, "-af", f"loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json", "-f", "null", "-"],
                   capture_output=True, text=True).stderr
j = json.loads(m[m.rfind("{"):m.rfind("}") + 1])
def run(limit):
    af = (f"loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
          f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,aresample=48000,alimiter=limit={limit}:attack=1:release=50:level=false")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", v, "-i", a, "-c:v", "copy", "-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
                    "-shortest", "-movflags", "+faststart", out], check=True)
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", out, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    s = r[r.rfind("Summary:"):]
    i = re.search(r"I:\s+(-?[\d.]+) LUFS", s)
    p = re.search(r"Peak:\s+(-?[\d.]+) dBFS", s)
    return (float(i.group(1)) if i else None), (float(p.group(1)) if p else None)


for limit in (0.79, 0.7, 0.62, 0.55, 0.48):   # baisse le limiteur jusqu'à une crête vraie ≤ −1,5 dBTP après l'AAC
    li, pk = run(limit)
    if pk is not None and pk <= -1.5:
        break
print(out, "| intégré", li, "LUFS | crête vraie", pk, "dBFS | limiteur", limit, "| OK" if pk is not None and pk <= -1.5 else "| CRÊTE TROP HAUTE")
