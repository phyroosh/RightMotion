import json

with open('src/clips/neuroproductivity/transcript.json', 'r', encoding='utf-8') as f:
    words = json.load(f)

print('Total words:', len(words))
print(f"Total duration: {words[-1]['endMs'] / 1000:.2f}s ({words[-1]['endMs']}ms)")

phrases = [
    "Have you ever heard",
    "Just make a schedule",
    "Just focus on one thing",
    "Just break the task into smaller steps",
    "works beautifully for someone else",
    "Here's the interesting part",
    "Sometimes the problem isn't that you lack discipline",
    "The strategy itself is fighting",
    "compare four broad frameworks",
    "neurotypical functioning, ADHD, autism, and AuDHD",
    "useful patterns",
    "Make a routine",
    "For a neurotypical person",
    "The routine reduces the number of decisions",
    "someone with ADHD might look",
    "regulating attention and motivation",
    "Make the routine visible, immediate, and rewarding",
    "Maybe the coffee happens",
    "And then we get to autism",
    "For someone who relies heavily on predictability",
    "Sensory load",
    "Maybe the hack is headphones",
    "AuDHD gets especially interesting",
    "pull in opposite directions",
    "Stable enough to feel predictable",
    "Break the task into smaller steps",
    "For a neurotypical person, smaller steps",
    "Write my report",
    "write the worst possible first sentence",
    "Autistic thinking may respond differently",
    "Clean your room",
    "Clothes first",
    "And with AuDHD",
    "Use a calendar",
    "time blindness",
    "intermediate reminders",
    "For autism, the calendar",
    "Just do the task every day",
    "miss a day",
    "reliable recovery system",
    "bigger lesson",
    "What problem is actually stopping me",
    "four people staring",
    "waking up at 5 AM",
    "Brains aren't IKEA furniture",
    "What is your brain struggling with here",
    "made the strategy fit the person"
]

def clean_word(w):
    return ''.join(c for c in w.lower() if c.isalnum())

def find_phrase(p):
    p_tokens = [clean_word(w) for w in p.split()]
    for i in range(len(words) - len(p_tokens) + 1):
        match = True
        for j, pt in enumerate(p_tokens):
            wt = clean_word(words[i+j]['word'])
            if wt != pt:
                match = False
                break
        if match:
            return words[i]['startMs'], words[i+len(p_tokens)-1]['endMs']
    return None, None

for p in phrases:
    s, e = find_phrase(p)
    if s is not None:
        print(f"{p:55} -> {s/1000:6.2f}s ({s:6d}ms) to {e/1000:6.2f}s ({e:6d}ms)")
    else:
        print(f"{p:55} -> NOT FOUND")
