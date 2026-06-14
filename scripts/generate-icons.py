#!/usr/bin/env python3
"""
Génère les icônes PWA de Journal Santé sans aucune dépendance externe
(encodeur PNG en pur Python). Un cœur blanc sur dégradé violet.

Usage : python3 scripts/generate-icons.py
"""
import os
import struct
import zlib

OUT = os.path.join(os.path.dirname(__file__), "..", "icons")

# Couleurs du dégradé (thème violet de l'app)
C1 = (124, 106, 247)   # #7c6af7
C2 = (91, 70, 214)     # #5b46d6


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def in_round_rect(x, y, w, h, r):
    cx = min(max(x, r), w - r)
    cy = min(max(y, r), h - r)
    dx, dy = x - cx, y - cy
    return dx * dx + dy * dy <= r * r


def in_heart(x, y, size, scale, cy_factor):
    # Repère normalisé centré, y vers le haut
    cx = size / 2.0
    cy = size * cy_factor
    s = size * scale
    X = (x - cx) / s
    Y = (cy - y) / s
    v = (X * X + Y * Y - 1) ** 3 - X * X * (Y ** 3)
    return v <= 0


def render(size, rounded=True, heart_scale=0.30, heart_cy=0.42):
    ss = 3  # super-échantillonnage pour des bords lisses
    r = size * 0.225 if rounded else 0
    rows = []
    for py in range(size):
        row = bytearray()
        for px in range(size):
            R = G = B = A = 0
            for sy in range(ss):
                for sx in range(ss):
                    x = px + (sx + 0.5) / ss
                    y = py + (sy + 0.5) / ss
                    if rounded and not in_round_rect(x, y, size, size, r):
                        continue  # transparent hors du carré arrondi
                    base = lerp(C1, C2, (x + y) / (2.0 * size))
                    if in_heart(x, y, size, heart_scale, heart_cy):
                        col = (255, 255, 255)
                    else:
                        col = base
                    R += col[0]; G += col[1]; B += col[2]; A += 255
            n = ss * ss
            if A == 0:
                row += bytes((0, 0, 0, 0))
            else:
                # moyenne des sous-pixels couverts, alpha = couverture
                cov = A // n
                row += bytes((R // n, G // n, B // n, cov))
        rows.append(bytes(row))
    return encode_png(size, size, rows)


def encode_png(width, height, rows):
    raw = bytearray()
    for row in rows:
        raw.append(0)        # type de filtre 0
        raw.extend(row)
    comp = zlib.compress(bytes(raw), 9)

    def chunk(typ, data):
        out = struct.pack(">I", len(data)) + typ + data
        return out + struct.pack(">I", zlib.crc32(typ + data) & 0xffffffff)

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)  # RGBA 8 bits
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", comp) + chunk(b"IEND", b"")


def write(name, data):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name)
    with open(path, "wb") as f:
        f.write(data)
    print(f"  ✓ {name} ({len(data)} octets)")


def main():
    print("Génération des icônes…")
    write("icon-512.png", render(512, rounded=True, heart_scale=0.30, heart_cy=0.42))
    write("icon-192.png", render(192, rounded=True, heart_scale=0.30, heart_cy=0.42))
    # maskable : fond plein bord à bord, cœur plus petit (zone de sécurité)
    write("icon-maskable-512.png", render(512, rounded=False, heart_scale=0.24, heart_cy=0.44))
    # apple-touch : carré plein (iOS arrondit lui-même)
    write("apple-touch-icon.png", render(180, rounded=False, heart_scale=0.30, heart_cy=0.42))
    print("Terminé.")


if __name__ == "__main__":
    main()
