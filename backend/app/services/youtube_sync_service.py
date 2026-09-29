import logging
import urllib.request
import urllib.parse
import json
import re
from datetime import datetime
from app.config import settings

logger = logging.getLogger("socialflow.youtube")

class YouTubeDataSyncService:
    """
    Fetches genuine, live YouTube creator channel telemetry,
    subscriber counts, and live Shorts/Video metrics using YouTube Data API v3.
    """

    def __init__(self):
        self.api_key = getattr(settings, "YOUTUBE_API_KEY", "AIzaSyDitsCRF_0qx56AA2vCXzAj5FLZ3x_dIWk")

    def fetch_channel_telemetry(self, handle_or_name: str = "bhargavtalks"):
        """
        Fetches subscriber count, total views, avatar, uploads playlist ID, and total video count.
        """
        clean_handle = handle_or_name.replace("@", "").split("?")[0].split("/")[-1].strip()
        url = f"https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&forHandle={clean_handle}&key={self.api_key}"
        
        try:
            req = urllib.request.Request(url)
            res = urllib.request.urlopen(req, timeout=10)
            data = json.loads(res.read().decode("utf-8"))
            items = data.get("items", [])
            if not items:
                return None
            
            channel = items[0]
            snip = channel.get("snippet", {})
            stats = channel.get("statistics", {})
            content_details = channel.get("contentDetails", {})
            uploads_id = content_details.get("relatedPlaylists", {}).get("uploads")
            if not uploads_id and channel.get("id"):
                ch_id = channel.get("id")
                if ch_id.startswith("UC"):
                    uploads_id = "UU" + ch_id[2:]

            return {
                "channel_id": channel.get("id"),
                "uploads_id": uploads_id,
                "title": snip.get("title"),
                "description": snip.get("description"),
                "custom_url": snip.get("customUrl"),
                "avatar_url": snip.get("thumbnails", {}).get("high", {}).get("url") or snip.get("thumbnails", {}).get("default", {}).get("url"),
                "subscribers": int(stats.get("subscriberCount", 0)),
                "total_views": int(stats.get("viewCount", 0)),
                "total_videos": int(stats.get("videoCount", 0))
            }
        except Exception as e:
            logger.warning(f"YouTube Channel Fetch Notice: {e}")
            return None

    def fetch_all_videos(self, channel_id: str = None, uploads_id: str = None, max_videos: int = 350):
        """
        Fetches genuine published Videos and Shorts from the channel's uploads playlist.
        Supports paginating up to hundreds of real channel videos with full metrics.
        """
        if not uploads_id:
            if channel_id and channel_id.startswith("UC"):
                uploads_id = "UU" + channel_id[2:]
            else:
                uploads_id = "UU3FrcAvoqYe30Hn6A73KDqw"

        all_video_ids = []
        next_page = None
        pages_needed = (max_videos + 49) // 50

        try:
            for _ in range(pages_needed):
                pl_url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId={uploads_id}&maxResults=50&key={self.api_key}"
                if next_page:
                    pl_url += f"&pageToken={next_page}"
                
                req = urllib.request.Request(pl_url)
                res = urllib.request.urlopen(req, timeout=10)
                data = json.loads(res.read().decode("utf-8"))
                
                items = data.get("items", [])
                if not items:
                    break
                
                for it in items:
                    v_id = it.get("contentDetails", {}).get("videoId")
                    if v_id and v_id not in all_video_ids:
                        all_video_ids.append(v_id)
                        if len(all_video_ids) >= max_videos:
                            break
                
                if len(all_video_ids) >= max_videos:
                    break
                next_page = data.get("nextPageToken")
                if not next_page:
                    break
        except Exception as e:
            logger.warning(f"YouTube Playlist Pagination Warning: {e}")

        if not all_video_ids:
            return self.fetch_recent_videos(channel_id or "UC3FrcAvoqYe30Hn6A73KDqw", max_results=8)

        # Batch fetch video details in chunks of 50
        results = []
        try:
            for i in range(0, len(all_video_ids), 50):
                chunk = all_video_ids[i:i+50]
                stats_url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id={','.join(chunk)}&key={self.api_key}"
                req = urllib.request.Request(stats_url)
                res = urllib.request.urlopen(req, timeout=10)
                stats_data = json.loads(res.read().decode("utf-8"))

                for v in stats_data.get("items", []):
                    v_id = v.get("id")
                    snip = v.get("snippet", {})
                    stats = v.get("statistics", {})
                    content_details = v.get("contentDetails", {})
                    title = snip.get("title", "")
                    
                    # Duration check (e.g. PT45S -> Shorts)
                    duration_str = content_details.get("duration", "")
                    is_short_duration = "PT" in duration_str and "M" not in duration_str and "H" not in duration_str
                    is_short = is_short_duration or "#shorts" in title.lower() or "#short" in title.lower() or "short" in snip.get("description", "").lower()
                    
                    # Robust high-res thumbnail URL
                    thumb = (
                        snip.get("thumbnails", {}).get("maxres", {}).get("url")
                        or snip.get("thumbnails", {}).get("standard", {}).get("url")
                        or snip.get("thumbnails", {}).get("high", {}).get("url")
                        or f"https://i.ytimg.com/vi/{v_id}/hqdefault.jpg"
                    )

                    results.append({
                        "video_id": v_id,
                        "title": title,
                        "content_type": "Shorts" if is_short else "Video",
                        "caption": snip.get("description", "")[:500],
                        "published_at": snip.get("publishedAt"),
                        "thumbnail_url": thumb,
                        "views": int(stats.get("viewCount", 0)),
                        "likes": int(stats.get("likeCount", 0)),
                        "comments": int(stats.get("commentCount", 0)),
                        "post_url": f"https://youtube.com/watch?v={v_id}"
                    })
        except Exception as e:
            logger.warning(f"YouTube Batch Stats Error: {e}")

        return results

    def fetch_recent_videos(self, channel_id: str, max_results: int = 12):
        """
        Fallback search method for recent published videos.
        """
        try:
            search_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&channelId={channel_id}&maxResults={max_results}&order=date&type=video&key={self.api_key}"
            req = urllib.request.Request(search_url)
            res = urllib.request.urlopen(req, timeout=10)
            search_data = json.loads(res.read().decode("utf-8"))
            
            video_ids = [item["id"]["videoId"] for item in search_data.get("items", []) if "id" in item and "videoId" in item["id"]]
            if not video_ids:
                return []

            stats_url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id={','.join(video_ids)}&key={self.api_key}"
            req2 = urllib.request.Request(stats_url)
            res2 = urllib.request.urlopen(req2, timeout=10)
            stats_data = json.loads(res2.read().decode("utf-8"))

            results = []
            for v in stats_data.get("items", []):
                snip = v.get("snippet", {})
                stats = v.get("statistics", {})
                title = snip.get("title", "")
                v_id = v.get("id")
                
                is_short = "#shorts" in title.lower() or "#short" in title.lower() or "short" in snip.get("description", "").lower()
                
                results.append({
                    "video_id": v_id,
                    "title": title,
                    "content_type": "Shorts" if is_short else "Video",
                    "caption": snip.get("description", "")[:300],
                    "published_at": snip.get("publishedAt"),
                    "thumbnail_url": snip.get("thumbnails", {}).get("high", {}).get("url") or f"https://i.ytimg.com/vi/{v_id}/hqdefault.jpg",
                    "views": int(stats.get("viewCount", 0)),
                    "likes": int(stats.get("likeCount", 0)),
                    "comments": int(stats.get("commentCount", 0)),
                    "post_url": f"https://youtube.com/watch?v={v_id}"
                })
            return results
        except Exception as e:
            logger.warning(f"YouTube Recent Videos Fetch Notice: {e}")
            return []

youtube_sync_service = YouTubeDataSyncService()
