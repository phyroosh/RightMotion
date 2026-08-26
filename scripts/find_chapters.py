import json

with open("src/clips/procrastination/transcript.json", "r", encoding="utf-8") as f:
    transcript = json.load(f)

chapters = [
    ("CH 01: The 17 Sudden Priorities", ["You", "know", "that", "thing"]),
    ("CH 02: The Core Revelation", ["Because", "sometimes", "you", "don't", "actually", "hate"]),
    ("CH 03: The Anticipation Trap", ["Think", "about", "something", "you've", "been", "avoiding"]),
    ("CH 04: The Avoidance Loop", ["Imagine", "you", "have", "an", "assignment"]),
    ("CH 05: Threat to Competence", ["The", "task", "can", "change", "depending"]),
    ("CH 06: The 11:47 PM Paradox", ["11:47", "PM"]),
    ("CH 07: The Guilt & Shame Compound", ["another", "trap", "here"]),
    ("CH 08: The Diagnostic Question", ["So", "what", "actually", "helps"]),
    ("CH 09: Acting With Discomfort", ["And", "sometimes", "you", "don't", "even", "need"]),
    ("CH 10: The Kinder Understanding", ["kinder", "ways", "to", "understand"]),
    ("CH 11: The Final Shift (Outro)", ["Maybe", "you", "don't", "need", "to", "become", "harder"]),
]

found = []
for title, keywords in chapters:
    kw_str = " ".join(keywords).lower()
    for i in range(len(transcript)):
        window = " ".join([w["word"] for w in transcript[i:i+len(keywords)+2]]).lower()
        if kw_str in window:
            start_ms = transcript[i]["startMs"]
            start_s = start_ms / 1000
            frame = int(start_s * 30)
            found.append({
                "title": title,
                "startMs": start_ms,
                "startSec": round(start_s, 2),
                "frame": frame
            })
            print(f"{title:35} | {start_ms:7} ms | {start_s:6.1f}s | Frame: {frame:5}")
            break

with open("src/clips/procrastination/chapters.json", "w", encoding="utf-8") as f:
    json.dump(found, f, indent=2)
