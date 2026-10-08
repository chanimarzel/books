"""Generate a soft ambient pad for the video.

Usage: python3 scripts/music.py OUT.wav TOTAL_SECONDS SWELL_AT BEREISHIT_AT
"""
import sys
import wave

import numpy as np

SR = 44100
out, total, swell_at, light_at = sys.argv[1], *map(float, sys.argv[2:5])
n = int(SR * total)
t = np.arange(n) / SR


def note(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


# D major warm progression: Dmaj9, Bm7, Gmaj7, Asus2. 8 seconds per chord.
chords = [
    [50, 57, 62, 66, 69, 76],
    [47, 54, 62, 66, 69, 74],
    [43, 55, 59, 62, 66, 71],
    [45, 52, 57, 64, 69, 71],
]
chord_len = 7.5
pad = np.zeros(n)
for ci in range(int(total / chord_len) + 1):
    start = ci * chord_len
    seg = (t >= start - 1.5) & (t < start + chord_len + 1.5)
    tt = t[seg] - start
    env = np.clip((tt + 1.5) / 3.0, 0, 1) * np.clip((chord_len + 1.5 - tt) / 3.0, 0, 1)
    env = np.sin(env * np.pi / 2) ** 2
    for m in chords[ci % len(chords)]:
        f = note(m)
        for det in (-0.12, 0.12):
            ph = 2 * np.pi * (f + det) * tt
            pad[seg] += env * (np.sin(ph) + 0.18 * np.sin(2 * ph)) / (1 + (m - 50) / 18)

pad /= np.max(np.abs(pad))


# Smooth global dynamics: soft start, swell at 350, rise at Bereishit, fade out.
def bump(center, width, height):
    return height * np.exp(-((t - center) / width) ** 2)


dyn = 0.45 + bump(swell_at + 1.5, 2.5, 0.45) + bump(light_at + 2.5, 3.5, 0.35)
dyn *= np.clip(t / 2.5, 0, 1) * np.clip((total - t) / 3.0, 0, 1)
sig = pad * dyn

# Soft twinkles: little bell tones like candles catching.
rng = np.random.default_rng(7)
bell_times = list(np.arange(1.0, total - 4, 3.7)) + list(swell_at + rng.uniform(0, 2.5, 8))
for bt in bell_times:
    seg = (t >= bt) & (t < bt + 2.5)
    tt = t[seg] - bt
    f = note(int(rng.choice([74, 76, 78, 81, 83, 86])))
    sig[seg] += 0.06 * np.exp(-tt * 2.2) * np.sin(2 * np.pi * f * tt)

# Simple low pass for warmth.
k = 9
sig = np.convolve(sig, np.ones(k) / k, mode='same')
sig = sig / np.max(np.abs(sig)) * 0.7

stereo = np.stack([sig, np.roll(sig, int(SR * 0.012))], axis=1)
data = (stereo * 32767).astype(np.int16)
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print('wrote', out)
