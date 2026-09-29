import logging
import httpx
from typing import List, Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("socialmind.hindsight")

class HindsightService:
    """
    Service wrapper for Vectorize Hindsight Agent Memory System.
    Official Docs: https://hindsight.vectorize.io/
    GitHub: https://github.com/vectorize-io/hindsight
    
    Operations:
    - Retain: Store memory facts, preferences, context in a scoped bank_id
    - Recall: Retrieve relevant memories using semantic / TEMPR search
    - Reflect: Synthesize memories into reasoned dispositions
    """

    def __init__(self, base_url: Optional[str] = None, api_key: Optional[str] = None, bank_id: Optional[str] = None):
        self.base_url = (base_url or settings.HINDSIGHT_URL).rstrip('/')
        self.api_key = api_key or settings.HINDSIGHT_API_KEY
        self.bank_id = bank_id or settings.HINDSIGHT_BANK_ID
        
        # Local in-memory backup store for offline hackathon execution guarantee
        self._local_memory_bank: List[Dict[str, Any]] = []

    def retain(self, content: str, category: str = "general", metadata: Optional[Dict[str, Any]] = None, bank_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Store information in Hindsight memory bank.
        POST /v1/banks/{bank_id}/memories or /retain
        """
        target_bank = bank_id or self.bank_id
        meta = metadata or {}
        meta["category"] = category

        payload = {
            "content": content,
            "metadata": meta
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        # Save to local memory backup first
        local_entry = {
            "id": f"mem_{len(self._local_memory_bank) + 1}",
            "bank_id": target_bank,
            "category": category,
            "content": content,
            "metadata": meta,
            "hindsight_synced": False
        }
        self._local_memory_bank.append(local_entry)

        # Attempt call to Hindsight Vectorize service if server is online
        try:
            url = f"{self.base_url}/v1/banks/{target_bank}/memories"
            with httpx.Client(timeout=0.08) as client:
                res = client.post(url, json=payload, headers=headers)
                if res.status_code in [200, 201]:
                    data = res.json()
                    local_entry["hindsight_synced"] = True
                    local_entry["hindsight_id"] = data.get("id")
                    logger.info(f"[Hindsight Retain Success] Stored in bank '{target_bank}': {content[:40]}...")
                    return data
        except Exception:
            pass

        return {
            "status": "retained",
            "bank_id": target_bank,
            "content": content,
            "metadata": meta,
            "id": local_entry["id"],
            "source": "local_bank",
            "synced_to_cloud": False
        }

    def recall(self, query: str, top_k: int = 5, category: Optional[str] = None, bank_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Recall relevant memories from Hindsight.
        POST /v1/banks/{bank_id}/recall
        """
        target_bank = bank_id or self.bank_id
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "query": query,
            "top_k": top_k
        }

        # Remote call attempt
        try:
            url = f"{self.base_url}/v1/banks/{target_bank}/recall"
            with httpx.Client(timeout=5.0) as client:
                res = client.post(url, json=payload, headers=headers)
                if res.status_code == 200:
                    results = res.json().get("memories", [])
                    logger.info(f"[Hindsight Recall Success] Found {len(results)} memories for query '{query}'")
                    return results
                else:
                    url_alt = f"{self.base_url}/recall"
                    payload_alt = {"bank_id": target_bank, "query": query, "top_k": top_k}
                    res_alt = client.post(url_alt, json=payload_alt, headers=headers)
                    if res_alt.status_code == 200:
                        return res_alt.json().get("results", [])
        except Exception as e:
            logger.warning(f"[Hindsight Recall Notice] Remote server offline ({e}). Searching local memory bank.")

        # Local semantic & keyword match fallback
        query_words = set(query.lower().split())
        matched = []
        for mem in self._local_memory_bank:
            if mem.get("bank_id") != target_bank:
                continue
            if category and mem.get("category") != category:
                continue
            
            content_lower = mem.get("content", "").lower()
            score = sum(1 for word in query_words if len(word) > 2 and word in content_lower)
            if score > 0 or not query_words:
                matched.append((score, mem))

        matched.sort(key=lambda x: x[0], reverse=True)
        return [m[1] for m in matched[:top_k]]

    def reflect(self, query: str, bank_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Reflect synthesizes stored memories to form a reasoned mental model.
        POST /v1/banks/{bank_id}/reflect
        """
        target_bank = bank_id or self.bank_id
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        try:
            url = f"{self.base_url}/v1/banks/{target_bank}/reflect"
            with httpx.Client(timeout=5.0) as client:
                res = client.post(url, json={"query": query}, headers=headers)
                if res.status_code == 200:
                    return res.json()
        except Exception as e:
            logger.warning(f"[Hindsight Reflect Notice] Service fallback: {e}")

        # Local reflect summary construction
        recalled = self.recall(query, top_k=5, bank_id=target_bank)
        mem_texts = [m.get("content") for m in recalled if m.get("content")]
        synthesis = f"Based on {len(mem_texts)} recalled records: " + " | ".join(mem_texts[:3]) if mem_texts else "No prior memory stored."
        return {
            "query": query,
            "synthesis": synthesis,
            "recalled_count": len(recalled)
        }

# Global singleton instance
hindsight_service = HindsightService()
