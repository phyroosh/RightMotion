import json
import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Complete Hinglish Lyrics with Hindi counterparts and precise musical timestamps for the 130.86s song
LYRICS_DATA = [
  # ---- STANZA 1: Night scene (13.0s - 18.88s) ----
  {
    "id": 1,
    "hinglish": "Raat dheemi thi... shehar soya tha...",
    "hindi": "रात धीमी थी, शहर सोया था...",
    "startMs": 13000,
    "endMs": 15700,
    "scene": "phone_mockup",
    "words": [
      {"word": "Raat", "startMs": 13000, "endMs": 13600},
      {"word": "dheemi", "startMs": 13600, "endMs": 14400},
      {"word": "thi,", "startMs": 14400, "endMs": 14800},
      {"word": "shehar", "startMs": 14800, "endMs": 15200},
      {"word": "soya", "startMs": 15200, "endMs": 15500},
      {"word": "tha.", "startMs": 15500, "endMs": 15700}
    ]
  },
  {
    "id": 2,
    "hinglish": "Phone ki roshni par bas uska naam tha.",
    "hindi": "फ़ोन की रोशनी पर बस उसका नाम था।",
    "startMs": 15700,
    "endMs": 18880,
    "scene": "phone_mockup",
    "words": [
      {"word": "Phone", "startMs": 15700, "endMs": 16200},
      {"word": "ki", "startMs": 16200, "endMs": 16500},
      {"word": "roshni", "startMs": 16500, "endMs": 17200},
      {"word": "par,", "startMs": 17200, "endMs": 17500},
      {"word": "bas", "startMs": 17500, "endMs": 17800},
      {"word": "uska", "startMs": 17800, "endMs": 18200},
      {"word": "naam", "startMs": 18200, "endMs": 18550},
      {"word": "tha.", "startMs": 18550, "endMs": 18880}
    ]
  },
  # ---- STANZA 2: She didn't write (18.88s - 26.4s) ----
  {
    "id": 3,
    "hinglish": "Kuch nahi likha usne, phir bhi na jaane kyon...",
    "hindi": "कुछ नहीं लिखा उसने, फिर भी न जाने क्यों,",
    "startMs": 18880,
    "endMs": 22200,
    "scene": "phone_mockup",
    "words": [
      {"word": "Kuch", "startMs": 18880, "endMs": 19300},
      {"word": "nahi", "startMs": 19300, "endMs": 19700},
      {"word": "likha", "startMs": 19700, "endMs": 20300},
      {"word": "usne,", "startMs": 20300, "endMs": 20800},
      {"word": "phir", "startMs": 20800, "endMs": 21100},
      {"word": "bhi", "startMs": 21100, "endMs": 21400},
      {"word": "na", "startMs": 21400, "endMs": 21650},
      {"word": "jaane", "startMs": 21650, "endMs": 21900},
      {"word": "kyon,", "startMs": 21900, "endMs": 22200}
    ]
  },
  {
    "id": 4,
    "hinglish": "Aaj phir der tak uski baatein sunta raha main.",
    "hindi": "आज फिर देर तक उसकी बातें सुनता रहा मैं।",
    "startMs": 22200,
    "endMs": 26400,
    "scene": "phone_mockup",
    "words": [
      {"word": "Aaj", "startMs": 22200, "endMs": 22700},
      {"word": "phir", "startMs": 22700, "endMs": 23100},
      {"word": "der", "startMs": 23100, "endMs": 23600},
      {"word": "tak", "startMs": 23600, "endMs": 24000},
      {"word": "uski", "startMs": 24000, "endMs": 24500},
      {"word": "baatein", "startMs": 24500, "endMs": 25100},
      {"word": "sunta", "startMs": 25100, "endMs": 25600},
      {"word": "raha", "startMs": 25600, "endMs": 26000},
      {"word": "main.", "startMs": 26000, "endMs": 26400}
    ]
  },
  # ---- STANZA 3: Woh poochhe (29.6s - 38.8s) ----
  {
    "id": 5,
    "hinglish": "Woh poochhe, 'Kya haal hai?' Main keh doon, 'Sab achha hai...'",
    "hindi": "वह पूछे, “क्या हाल है?” मैं कह दूँ, “सब अच्छा है...”",
    "startMs": 29640,
    "endMs": 33500,
    "scene": "phone_mockup",
    "words": [
      {"word": "Woh", "startMs": 29640, "endMs": 30100},
      {"word": "poochhe,", "startMs": 30100, "endMs": 30600},
      {"word": "'Kya", "startMs": 30600, "endMs": 30950},
      {"word": "haal", "startMs": 30950, "endMs": 31300},
      {"word": "hai?'", "startMs": 31300, "endMs": 31600},
      {"word": "Main", "startMs": 31600, "endMs": 31900},
      {"word": "keh", "startMs": 31900, "endMs": 32150},
      {"word": "doon,", "startMs": 32150, "endMs": 32400},
      {"word": "'Sab", "startMs": 32400, "endMs": 32700},
      {"word": "achha", "startMs": 32700, "endMs": 33100},
      {"word": "hai...'", "startMs": 33100, "endMs": 33500}
    ]
  },
  {
    "id": 6,
    "hinglish": "Par meri aankhon ka mausam usse chhipaya kab jaata hai?",
    "hindi": "पर मेरी आँखों का मौसम उससे छिपाया कब जाता है?",
    "startMs": 33500,
    "endMs": 38850,
    "scene": "phone_mockup",
    "words": [
      {"word": "Par", "startMs": 33500, "endMs": 34000},
      {"word": "meri", "startMs": 34000, "endMs": 34600},
      {"word": "aankhon", "startMs": 34600, "endMs": 35400},
      {"word": "ka", "startMs": 35400, "endMs": 35800},
      {"word": "mausam,", "startMs": 35800, "endMs": 36600},
      {"word": "usse", "startMs": 36600, "endMs": 37300},
      {"word": "chhipaya", "startMs": 37300, "endMs": 38000},
      {"word": "kab", "startMs": 38000, "endMs": 38350},
      {"word": "jaata", "startMs": 38350, "endMs": 38650},
      {"word": "hai?", "startMs": 38650, "endMs": 38850}
    ]
  },
  # ---- STANZA 4: Uski har chhoti-si (38.8s - 50.8s) ----
  {
    "id": 7,
    "hinglish": "Uski har chhoti-si baat dil mein kahin thehar jaati hai,",
    "hindi": "उसकी हर छोटी-सी बात दिल में कहीं ठहर जाती है,",
    "startMs": 38820,
    "endMs": 44350,
    "scene": "phone_mockup",
    "words": [
      {"word": "Uski", "startMs": 38820, "endMs": 39400},
      {"word": "har", "startMs": 39400, "endMs": 39900},
      {"word": "chhoti-si", "startMs": 39900, "endMs": 40800},
      {"word": "baat", "startMs": 40800, "endMs": 41500},
      {"word": "dil", "startMs": 41500, "endMs": 42100},
      {"word": "mein", "startMs": 42100, "endMs": 42600},
      {"word": "kahin", "startMs": 42600, "endMs": 43200},
      {"word": "thehar", "startMs": 43200, "endMs": 43800},
      {"word": "jaati", "startMs": 43800, "endMs": 44150},
      {"word": "hai,", "startMs": 44150, "endMs": 44350}
    ]
  },
  {
    "id": 8,
    "hinglish": "Woh bas baat karke chali jaati hai, aur meri raat ban jaati hai.",
    "hindi": "वह बस बात करके चली जाती है, और मेरी रात बन जाती है।",
    "startMs": 44400,
    "endMs": 50800,
    "scene": "phone_mockup",
    "words": [
      {"word": "Woh", "startMs": 44400, "endMs": 44900},
      {"word": "bas", "startMs": 44900, "endMs": 45350},
      {"word": "baat", "startMs": 45350, "endMs": 45900},
      {"word": "karke", "startMs": 45900, "endMs": 46500},
      {"word": "chali", "startMs": 46500, "endMs": 47100},
      {"word": "jaati", "startMs": 47100, "endMs": 47600},
      {"word": "hai,", "startMs": 47600, "endMs": 48000},
      {"word": "aur", "startMs": 48000, "endMs": 48400},
      {"word": "meri", "startMs": 48400, "endMs": 49000},
      {"word": "raat", "startMs": 49000, "endMs": 49600},
      {"word": "ban", "startMs": 49600, "endMs": 50100},
      {"word": "jaati", "startMs": 50100, "endMs": 50550},
      {"word": "hai.", "startMs": 50550, "endMs": 50800}
    ]
  },
  # ---- CHORUS: Uski baatein (50.7s - 72.8s) ----
  {
    "id": 9,
    "hinglish": "Uski baatein, uski baatein, jaise bheegi shaam ki barsaat hain,",
    "hindi": "उसकी बातें, उसकी बातें, जैसे भीगी शाम की बरसात हैं,",
    "startMs": 50740,
    "endMs": 57100,
    "scene": "phone_mockup",
    "words": [
      {"word": "Uski", "startMs": 50740, "endMs": 51300},
      {"word": "baatein,", "startMs": 51300, "endMs": 52100},
      {"word": "uski", "startMs": 52100, "endMs": 52700},
      {"word": "baatein,", "startMs": 52700, "endMs": 53600},
      {"word": "jaise", "startMs": 53600, "endMs": 54200},
      {"word": "bheegi", "startMs": 54200, "endMs": 54900},
      {"word": "shaam", "startMs": 54900, "endMs": 55600},
      {"word": "ki", "startMs": 55600, "endMs": 56000},
      {"word": "barsaat", "startMs": 56000, "endMs": 56700},
      {"word": "hain,", "startMs": 56700, "endMs": 57100}
    ]
  },
  {
    "id": 10,
    "hinglish": "Thodi hansi, thodi khamoshi, thodi adhoori mulaqaat hain.",
    "hindi": "थोड़ी हँसी, थोड़ी ख़ामोशी, थोड़ी अधूरी मुलाक़ात हैं।",
    "startMs": 57100,
    "endMs": 72800,
    "scene": "phone_mockup",
    "words": [
      {"word": "Thodi", "startMs": 57100, "endMs": 57900},
      {"word": "hansi,", "startMs": 57900, "endMs": 59000},
      {"word": "thodi", "startMs": 59000, "endMs": 60100},
      {"word": "khamoshi,", "startMs": 60100, "endMs": 62500},
      {"word": "thodi", "startMs": 62500, "endMs": 64500},
      {"word": "adhoori", "startMs": 64500, "endMs": 68000},
      {"word": "mulaqaat", "startMs": 68000, "endMs": 71500},
      {"word": "hain.", "startMs": 71500, "endMs": 72800}
    ]
  },
  # ---- BRIDGE (75.37s - 82.3s) ----
  {
    "id": 11,
    "hinglish": "Woh kehti hai, 'Main bahut bolti hoon...' Main hanskar kehta hoon, 'Haan...'",
    "hindi": "वह कहती है, “मैं बहुत बोलती हूँ...” मैं हँसकर कहता हूँ, “हाँ...”",
    "startMs": 75370,
    "endMs": 79250,
    "scene": "phone_mockup",
    "words": [
      {"word": "Woh", "startMs": 75370, "endMs": 75750},
      {"word": "kehti", "startMs": 75750, "endMs": 76200},
      {"word": "hai,", "startMs": 76200, "endMs": 76550},
      {"word": "'Main", "startMs": 76550, "endMs": 76900},
      {"word": "bahut", "startMs": 76900, "endMs": 77350},
      {"word": "bolti", "startMs": 77350, "endMs": 77800},
      {"word": "hoon...'", "startMs": 77800, "endMs": 78150},
      {"word": "Main", "startMs": 78150, "endMs": 78450},
      {"word": "hanskar", "startMs": 78450, "endMs": 78750},
      {"word": "kehta", "startMs": 78750, "endMs": 78900},
      {"word": "hoon,", "startMs": 78900, "endMs": 79050},
      {"word": "'Haan...'", "startMs": 79050, "endMs": 79250}
    ]
  },
  {
    "id": 12,
    "hinglish": "Par dil ke kisi kone mein bas ek baat rehti hai—",
    "hindi": "पर दिल के किसी कोने में बस एक बात रहती है—",
    "startMs": 79250,
    "endMs": 82300,
    "scene": "phone_mockup",
    "words": [
      {"word": "Par", "startMs": 79250, "endMs": 79650},
      {"word": "dil", "startMs": 79650, "endMs": 80050},
      {"word": "ke", "startMs": 80050, "endMs": 80350},
      {"word": "kisi", "startMs": 80350, "endMs": 80750},
      {"word": "kone", "startMs": 80750, "endMs": 81200},
      {"word": "mein,", "startMs": 81200, "endMs": 81550},
      {"word": "bas", "startMs": 81550, "endMs": 81750},
      {"word": "ek", "startMs": 81750, "endMs": 81900},
      {"word": "baat", "startMs": 81900, "endMs": 82050},
      {"word": "rehti", "startMs": 82050, "endMs": 82150},
      {"word": "hai—", "startMs": 82150, "endMs": 82300}
    ]
  },
  # ---- CONFESSION (82.6s - 87.9s) ----
  {
    "id": 13,
    "hinglish": "Tum bolti rehna, kyunki tumhari aawaaz ke bina...",
    "hindi": "तुम बोलती रहना, क्योंकि तुम्हारी आवाज़ के बिना",
    "startMs": 82630,
    "endMs": 85400,
    "scene": "phone_mockup",
    "words": [
      {"word": "Tum", "startMs": 82630, "endMs": 83000},
      {"word": "bolti", "startMs": 83000, "endMs": 83500},
      {"word": "rehna,", "startMs": 83500, "endMs": 83950},
      {"word": "kyunki", "startMs": 83950, "endMs": 84350},
      {"word": "tumhari", "startMs": 84350, "endMs": 84800},
      {"word": "aawaaz", "startMs": 84800, "endMs": 85100},
      {"word": "ke", "startMs": 85100, "endMs": 85250},
      {"word": "bina...", "startMs": 85250, "endMs": 85400}
    ]
  },
  {
    "id": 14,
    "hinglish": "Yeh dil thoda kam dil lagta hai.",
    "hindi": "यह दिल थोड़ा कम दिल लगता है।",
    "startMs": 85400,
    "endMs": 87900,
    "scene": "phone_mockup",
    "words": [
      {"word": "Yeh", "startMs": 85400, "endMs": 85750},
      {"word": "dil", "startMs": 85750, "endMs": 86200},
      {"word": "thoda", "startMs": 86200, "endMs": 86700},
      {"word": "kam", "startMs": 86700, "endMs": 87100},
      {"word": "dil", "startMs": 87100, "endMs": 87450},
      {"word": "lagta", "startMs": 87450, "endMs": 87700},
      {"word": "hai.", "startMs": 87700, "endMs": 87900}
    ]
  },
  # ---- PHILOSOPHY OF LOVE (87.9s - 105.8s) ----
  {
    "id": 15,
    "hinglish": "Shayad prem kisi ek pal ka naam nahi, shayad prem toh woh sab hai...",
    "hindi": "शायद प्रेम किसी एक पल का नाम नहीं, शायद प्रेम तो वह सब है",
    "startMs": 87900,
    "endMs": 92000,
    "scene": "phone_mockup",
    "words": [
      {"word": "Shayad", "startMs": 87900, "endMs": 88400},
      {"word": "prem", "startMs": 88400, "endMs": 88900},
      {"word": "kisi", "startMs": 88900, "endMs": 89300},
      {"word": "ek", "startMs": 89300, "endMs": 89600},
      {"word": "pal", "startMs": 89600, "endMs": 89950},
      {"word": "ka", "startMs": 89950, "endMs": 90250},
      {"word": "naam", "startMs": 90250, "endMs": 90600},
      {"word": "nahi,", "startMs": 90600, "endMs": 90950},
      {"word": "shayad", "startMs": 90950, "endMs": 91250},
      {"word": "prem", "startMs": 91250, "endMs": 91500},
      {"word": "toh", "startMs": 91500, "endMs": 91650},
      {"word": "woh", "startMs": 91650, "endMs": 91750},
      {"word": "sab", "startMs": 91750, "endMs": 91850},
      {"word": "hai...", "startMs": 91850, "endMs": 92000}
    ]
  },
  {
    "id": 16,
    "hinglish": "Jo hum chhoti-chhoti baaton mein bina naam diye jeete hain.",
    "hindi": "जो हम छोटी-छोटी बातों में बिना नाम दिए जीते हैं।",
    "startMs": 92000,
    "endMs": 96950,
    "scene": "phone_mockup",
    "words": [
      {"word": "Jo", "startMs": 92000, "endMs": 92400},
      {"word": "hum", "startMs": 92400, "endMs": 92900},
      {"word": "chhoti-chhoti", "startMs": 92900, "endMs": 93800},
      {"word": "baaton", "startMs": 93800, "endMs": 94500},
      {"word": "mein", "startMs": 94500, "endMs": 95000},
      {"word": "bina", "startMs": 95000, "endMs": 95500},
      {"word": "naam", "startMs": 95500, "endMs": 95950},
      {"word": "diye", "startMs": 95950, "endMs": 96350},
      {"word": "jeete", "startMs": 96350, "endMs": 96650},
      {"word": "hain.", "startMs": 96650, "endMs": 96950}
    ]
  },
  {
    "id": 17,
    "hinglish": "Aur mujhe prem usse nahi, uski baaton se hua tha.",
    "hindi": "और मुझे प्रेम उससे नहीं, उसकी बातों से हुआ था।",
    "startMs": 97070,
    "endMs": 105800,
    "scene": "phone_mockup",
    "words": [
      {"word": "Aur", "startMs": 97070, "endMs": 97700},
      {"word": "mujhe", "startMs": 97700, "endMs": 98400},
      {"word": "prem", "startMs": 98400, "endMs": 99300},
      {"word": "usse", "startMs": 99300, "endMs": 100200},
      {"word": "nahi,", "startMs": 100200, "endMs": 101100},
      {"word": "uski", "startMs": 101100, "endMs": 102200},
      {"word": "baaton", "startMs": 102200, "endMs": 103500},
      {"word": "se", "startMs": 103500, "endMs": 104300},
      {"word": "hua", "startMs": 104300, "endMs": 105100},
      {"word": "tha.", "startMs": 105100, "endMs": 105800}
    ]
  },
  # ---- OUTRO (105.8s - 118.4s) ----
  {
    "id": 18,
    "hinglish": "Ab woh door hai, par uski baatein aaj bhi mere paas hain...",
    "hindi": "अब वह दूर है, पर उसकी बातें आज भी मेरे पास हैं...",
    "startMs": 105830,
    "endMs": 111750,
    "scene": "phone_mockup",
    "words": [
      {"word": "Ab", "startMs": 105830, "endMs": 106400},
      {"word": "woh", "startMs": 106400, "endMs": 107000},
      {"word": "door", "startMs": 107000, "endMs": 107800},
      {"word": "hai,", "startMs": 107800, "endMs": 108500},
      {"word": "par", "startMs": 108500, "endMs": 109100},
      {"word": "uski", "startMs": 109100, "endMs": 109700},
      {"word": "baatein", "startMs": 109700, "endMs": 110400},
      {"word": "aaj", "startMs": 110400, "endMs": 110800},
      {"word": "bhi", "startMs": 110800, "endMs": 111100},
      {"word": "mere", "startMs": 111100, "endMs": 111350},
      {"word": "paas", "startMs": 111350, "endMs": 111550},
      {"word": "hain...", "startMs": 111550, "endMs": 111750}
    ]
  },
  {
    "id": 19,
    "hinglish": "Jaise woh kabhi gayi hi nahi.",
    "hindi": "जैसे वह कभी गई ही नहीं।",
    "startMs": 111750,
    "endMs": 118400,
    "scene": "phone_mockup",
    "words": [
      {"word": "Jaise", "startMs": 111750, "endMs": 112600},
      {"word": "woh", "startMs": 112600, "endMs": 113500},
      {"word": "kabhi", "startMs": 113500, "endMs": 114600},
      {"word": "gayi", "startMs": 114600, "endMs": 115700},
      {"word": "hi", "startMs": 115700, "endMs": 116800},
      {"word": "nahi.", "startMs": 116800, "endMs": 118400}
    ]
  }
]

# Flatten all words for word-level timestamps
all_words = []
for l in LYRICS_DATA:
    for w in l["words"]:
        all_words.append(w)

output_json = r"C:\Toptier Products\RightClips\src\clips\lofi_song\transcript.json"
with open(output_json, "w", encoding="utf-8") as f:
    json.dump(all_words, f, indent=2, ensure_ascii=False)

lyrics_json = r"C:\Toptier Products\RightClips\src\clips\lofi_song\lyrics.json"
with open(lyrics_json, "w", encoding="utf-8") as f:
    json.dump(LYRICS_DATA, f, indent=2, ensure_ascii=False)

print(f"✅ Generated aligned timestamps: {len(all_words)} words across {len(LYRICS_DATA)} poetic lines.")
