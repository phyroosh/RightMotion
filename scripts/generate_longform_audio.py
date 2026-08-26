import sys
import os
import site

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Register all nvidia cuda/cudnn/cublas DLL directories on Windows
for site_pkg in site.getsitepackages():
    nvidia_dir = os.path.join(site_pkg, "nvidia")
    if os.path.isdir(nvidia_dir):
        for sub in os.listdir(nvidia_dir):
            bin_dir = os.path.join(nvidia_dir, sub, "bin")
            if os.path.isdir(bin_dir):
                try:
                    os.add_dll_directory(bin_dir)
                    os.environ["PATH"] = bin_dir + os.pathsep + os.environ.get("PATH", "")
                except Exception:
                    pass

import asyncio
import edge_tts
import json
from faster_whisper import WhisperModel

SCRIPT_TEXT = """You know that thing where you have something you genuinely need to do...

And somehow, the moment you sit down to do it, your brain suddenly discovers seventeen other priorities?

Your room looks like it desperately needs cleaning.

Your phone feels unusually interesting.

You remember that one video you wanted to watch.

You suddenly become very curious about reorganizing your folders.

And then you tell yourself, "Okay, I'll start in ten minutes."

Ten minutes becomes thirty.

Thirty becomes two hours.

And now you're not only behind on the thing you needed to do...

You're also annoyed with yourself for not doing it.

And that's usually the moment where we reach the conclusion:

"I'm just lazy."

"I'm terrible at discipline."

"Why can't I just make myself do normal things?"

But there's something interesting here.

Because sometimes... you don't actually hate the task.

You hate how the task makes you feel.

And that difference changes the whole way you look at procrastination.

Think about something you've been avoiding lately.

Maybe it's studying.

Maybe it's answering an important email.

Starting a project.

Going to the gym.

Applying for something.

Having an uncomfortable conversation.

Whatever it is, imagine yourself sitting down and finally starting.

Notice what shows up before you've even done anything.

Maybe it's boredom.

Maybe it's anxiety.

Maybe it's that tiny feeling of, "What if I'm not good enough at this?"

Maybe the task feels so big that your brain doesn't even know where to begin.

Or maybe you already know you'll have to struggle for an hour before you see any progress.

So your brain notices something much simpler.

There are two options.

Stay with this uncomfortable feeling...

Or do something that makes the feeling disappear.

Check your phone.

Watch something.

Get a snack.

Open another tab.

Tell yourself you'll do it later.

And the important part is...

the second you walk away from the task, you feel a little better.

Not dramatically better.

Just... relieved.

And that relief is the part people often miss.

Because procrastination isn't always about choosing something fun over something important.

Sometimes it's about escaping something unpleasant.

And once you see that, procrastination starts making a weird amount of sense.

Imagine you have an assignment due tomorrow.

You open the document.

You read the first question.

And suddenly you feel that little wave of pressure.

"Ugh. I don't know how to do this."

So you close it.

You open YouTube instead.

And immediately...

the pressure drops.

Your brain basically learns:

Task = uncomfortable feeling.

Avoid task = relief.

And because the avoidance produced relief, your brain has just received a tiny reward for avoiding.

That's an avoidance-learning loop.

You don't even have to consciously think, "I'm going to avoid this because it makes me anxious."

Your brain can learn the pattern without asking permission.

And this is why telling yourself to "just have more discipline" can sometimes miss the actual problem.

Because discipline is being asked to fight an emotional reaction that hasn't even been addressed.

And here's where it gets even more interesting.

The task can change depending on how you feel about yourself.

Suppose you're studying for an exam.

On a good day, studying might just feel like studying.

But on a day when you're already questioning yourself...

the exact same chapter can feel completely different.

Now it's not just:

"I need to learn this."

It becomes:

"What if I can't understand it?"

"What if I'm behind?"

"What if everyone else is doing better than me?"

"What if I try seriously and still fail?"

Now the task isn't just demanding your time.

It's brushing up against your sense of competence.

And suddenly avoiding the chapter gives you something valuable.

For a few minutes, you don't have to feel like you're behind.

You don't have to confront the possibility that something might be difficult.

You don't have to feel inadequate.

You can just scroll.

And when you're scrolling, you're not failing at anything.

There's nothing to judge.

That's why sometimes the task you've been avoiding isn't even that hard.

It's emotionally expensive.

And this explains something that can feel really confusing.

You procrastinate all day...

and then, at 11:47 PM, when the deadline is terrifyingly close, you suddenly become incredibly productive.

What happened?

Did you magically become disciplined?

Probably not.

The emotional situation changed.

Before the deadline, you had uncertainty.

You could always do it later.

You could avoid the discomfort.

But now the consequence of not doing it is more uncomfortable than the task itself.

So finally, starting becomes the easier option.

That doesn't mean procrastination is good.

It just shows us that behavior often follows emotion more closely than we realize.

And there's another trap here.

After procrastinating, people often feel guilty.

So now you have the original discomfort...

plus shame about avoiding it.

Which makes the task feel even worse.

Which makes you want to avoid it even more.

So the loop becomes:

Task.

Discomfort.

Avoidance.

Relief.

Guilt.

More discomfort.

More avoidance.

And now you're not fighting one problem.

You're fighting the task and everything you feel about the task.

That's exhausting.

So what actually helps?

Not yelling at yourself.

Not calling yourself lazy.

And honestly, not always making a gigantic productivity system.

A better starting point is asking a slightly different question.

Instead of:

"Why can't I make myself do this?"

Ask:

"What feeling am I trying not to experience right now?"

That question can get surprisingly specific.

"Am I bored?"

"Am I overwhelmed?"

"Am I scared I'll do it badly?"

"Does starting make me feel behind?"

"Do I feel like this is going to take forever?"

Because once you identify the feeling, the solution can change.

If you're overwhelmed, maybe the problem isn't motivation.

Maybe the first step is simply too large.

If you're afraid of doing it badly, maybe you need permission to make an ugly first draft.

If you're bored, maybe you need a different environment or a shorter work period.

And sometimes...

you don't even need to make the feeling disappear.

That's the really important part.

You can feel uncomfortable and still begin.

You don't have to wait until studying feels interesting.

You don't have to wait until you're confident.

You don't have to suddenly become the kind of person who loves difficult things.

You can sit there and think,

"Yeah... I really don't want to do this."

And then do five minutes anyway.

That's a very different relationship with discomfort.

You're no longer saying,

"I need to feel better before I can start."

You're saying,

"I can feel this and still take one step."

And ironically, that can make the task feel less threatening over time.

Because your brain gets a new experience.

You felt anxiety...

and nothing terrible happened.

You felt boredom...

and you stayed.

You felt uncertain...

and you started anyway.

That matters.

Because eventually the association can begin to change.

Task doesn't always have to mean danger.

Task doesn't always have to mean judgment.

Task doesn't always have to mean proving something about yourself.

Sometimes it's just...

a thing you're doing.

And I think that's one of the kinder ways to understand procrastination.

Not as proof that you're lazy.

Not as proof that you're broken.

But as a pattern your brain learned because, at some point, avoiding discomfort worked.

It gave you relief.

The problem is that relief is very short-term.

The deadline doesn't disappear.

The assignment doesn't disappear.

The conversation doesn't disappear.

The anxiety usually comes back...

often with interest.

So the goal isn't to become someone who never procrastinates.

It's to become a little better at noticing what happens in that moment right before you escape.

That tiny moment where you open the task...

feel something uncomfortable...

and reach for your phone.

Pause there.

Not to judge yourself.

Just to notice.

"What am I feeling right now?"

Because sometimes the thing standing between you and the task isn't a lack of discipline.

It's a feeling you're trying not to feel.

And once you understand that...

you can finally work on the problem underneath the procrastination, instead of spending your whole life blaming yourself for the symptom.

Maybe you don't need to become harder on yourself.

Maybe you just need to become a little more honest about what you're feeling...

and a little more willing to begin while that feeling is still there."""

async def generate_voiceover(output_path):
    print("🎙️ Generating Fast-Paced Female Neural Voiceover (en-US-JennyNeural, +8% rate)...")
    voice = "en-US-JennyNeural"
    # Fast-paced, punchy, conversational delivery (+8% rate)
    communicate = edge_tts.Communicate(SCRIPT_TEXT, voice, rate="+8%", pitch="+0Hz")
    await communicate.save(output_path)
    print(f"✅ Fast-paced Female Voiceover saved to: {output_path}")

def transcribe_audio(audio_path, output_json_path):
    print("🚀 Running Faster-Whisper on NVIDIA CUDA GPU (float16)...")
    try:
        model = WhisperModel("base.en", device="cuda", compute_type="float16")
        print("Using NVIDIA CUDA GPU (float16)")
        segments, info = model.transcribe(audio_path, word_timestamps=True)
        segments = list(segments)
    except Exception as e:
        print(f"CUDA note: {e}, falling back to CPU (int8)")
        model = WhisperModel("base.en", device="cpu", compute_type="int8")
        segments, info = model.transcribe(audio_path, word_timestamps=True)
        segments = list(segments)
    
    word_list = []
    for segment in segments:
        for word in segment.words:
            word_list.append({
                "word": word.word.strip(),
                "startMs": int(word.start * 1000),
                "endMs": int(word.end * 1000)
            })
            
    print(f"✅ Transcribed {len(word_list)} words. Duration: {info.duration:.2f}s ({info.duration/60:.2f} mins)")
    
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(word_list, f, indent=2)
    print(f"✅ Timestamps saved to: {output_json_path}")
    return info.duration

async def main():
    os.makedirs("public/procrastination", exist_ok=True)
    os.makedirs("src/clips/procrastination", exist_ok=True)
    
    audio_path = "public/procrastination/voiceover.mp3"
    json_path = "src/clips/procrastination/transcript.json"
    
    if os.path.exists(audio_path):
        os.remove(audio_path)
        
    await generate_voiceover(audio_path)
    duration = transcribe_audio(audio_path, json_path)
    fps = 30
    total_frames = int(duration * fps) + 30
    print("\n📊 Fast-Paced Long-Form Remotion Config:")
    print(f"Duration: {duration:.2f}s ({duration/60:.2f} mins)")
    print(f"Total Frames @ 30fps: {total_frames} frames\n")

if __name__ == "__main__":
    asyncio.run(main())
