import json

with open('src/clips/loneliness/transcript.json', 'r', encoding='utf-8') as f:
    words = json.load(f)

# Group words into sentences based on punctuation
sentences = []
curr = []
for w in words:
    curr.append(w)
    if any(w['word'].endswith(p) for p in ['.', '?', '!', ':"', '."']):
        sentences.append({
            'text': ' '.join([x['word'] for x in curr]),
            'startMs': curr[0]['startMs'],
            'endMs': curr[-1]['endMs']
        })
        curr = []

if curr:
    sentences.append({
        'text': ' '.join([x['word'] for x in curr]),
        'startMs': curr[0]['startMs'],
        'endMs': curr[-1]['endMs']
    })

for idx, s in enumerate(sentences):
    print(f"{idx:3d} [{s['startMs']/1000:6.2f}s - {s['endMs']/1000:6.2f}s] {s['text']}")
