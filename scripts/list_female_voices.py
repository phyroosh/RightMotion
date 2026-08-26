import asyncio
import edge_tts

async def main():
    voices = await edge_tts.list_voices()
    print("Available en-US Female Voices:")
    for v in voices:
        if v["Locale"] == "en-US" and v.get("Gender") == "Female":
            print(f"- {v['ShortName']}")

if __name__ == "__main__":
    asyncio.run(main())
