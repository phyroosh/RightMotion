#!/usr/bin/env python3
"""
RightMotion Notification Dispatcher CLI
Allows AI agents, rendering pipelines, and terminal scripts to emit notifications directly to RightMotion Studio.
"""

import argparse
import json
import os
import sys
import urllib.request
import urllib.error

STUDIO_URL = os.environ.get("STUDIO_URL", "http://localhost:4000")


def dispatch_notification(event_type: str, title: str, body: str, clip: str = None, tab: str = "studio", category: str = None):
    payload = {
        "type": event_type,
        "title": title,
        "body": body,
        "clip": clip,
        "tab": tab,
        "category": category,
    }

    url = f"{STUDIO_URL}/api/notifications/emit"
    data_bytes = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data_bytes,
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req, timeout=3) as res:
            if res.status in (200, 201):
                resp_json = json.loads(res.read().decode("utf-8"))
                print(f"🔔 [Notification Sent] {title}: {body}")
                return True
    except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
        # If studio server is not running on 4000, write directly to notifications.json
        print(f"ℹ️ Studio server offline on {STUDIO_URL}; persisting directly to notifications data...")
        try:
            root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            notif_file = os.path.join(root_dir, "studio", "notifications", "data", "notifications.json")
            os.makedirs(os.path.dirname(notif_file), exist_ok=True)

            existing = []
            if os.path.exists(notif_file):
                with open(notif_file, "r", encoding="utf-8") as f:
                    existing = json.load(f)

            import time
            new_item = {
                "id": f"notif_cli_{int(time.time() * 1000)}",
                "type": event_type,
                "category": category or "system",
                "title": title,
                "body": body,
                "clip": clip,
                "tab": tab,
                "url": f"/?clip={clip}&tab={tab}" if clip else f"/?tab={tab}",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "read": False
            }
            existing.insert(0, new_item)
            with open(notif_file, "w", encoding="utf-8") as f:
                json.dump(existing[:150], f, indent=2)
            print(f"✅ Persisted notification offline: {title}")
            return True
        except Exception as file_err:
            print(f"⚠️ Failed to persist notification offline: {file_err}", file=sys.stderr)
            return False


def main():
    parser = argparse.ArgumentParser(description="Emit an event-driven notification to RightMotion Studio.")
    parser.add_argument("--event", default="SYSTEM_ALERT", help="Event type (e.g. RENDER_COMPLETED, PROJECT_CREATED)")
    parser.add_argument("--title", required=True, help="Notification title")
    parser.add_argument("--body", default=None, help="Notification body / description")
    parser.add_argument("--message", default=None, help="Alias for --body")
    parser.add_argument("--clip", default=None, help="Associated clip filename (e.g. dopamine_reality_video.mp4)")
    parser.add_argument("--tab", default="studio", choices=["projects", "studio", "ai", "activity", "more"], help="Target deep-link tab")
    parser.add_argument("--category", default=None, choices=["render", "project", "release", "security", "system"], help="Category bucket")

    args = parser.parse_args()
    body_text = args.body or args.message
    if not body_text:
        parser.error("Either --body or --message is required.")

    dispatch_notification(
        event_type=args.event,
        title=args.title,
        body=body_text,
        clip=args.clip,
        tab=args.tab,
        category=args.category
    )


if __name__ == "__main__":
    main()
