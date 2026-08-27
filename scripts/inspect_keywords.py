import json

with open('src/clips/neuroproductivity/transcript.json', 'r', encoding='utf-8') as f:
    words = json.load(f)

for idx, w in enumerate(words):
    txt = w['word'].lower()
    if any(k in txt for k in ['framework', 'adhd', 'autism', 'audhd', 'routine', 'sensory', 'calendar', 'ikea', 'furniture', 'discipline', 'streak', 'struggling', '5:00', 'am', 'five']):
        print(f"[{w['startMs']/1000:6.2f}s - {w['endMs']/1000:6.2f}s] ({idx:4d}) {w['word']}")
