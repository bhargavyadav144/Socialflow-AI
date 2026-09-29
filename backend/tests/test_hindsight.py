from app.services.hindsight_service import hindsight_service

def test_hindsight_retain_recall_reflect():
    bank = "test_bank_pytest"
    
    # 1. Retain
    ret_res = hindsight_service.retain(
        content="Test Fact: Python beginner videos earn 5x engagement",
        category="performance",
        bank_id=bank
    )
    assert ret_res["status"] == "retained" or "id" in ret_res

    # 2. Recall
    recalled = hindsight_service.recall("Python engagement", bank_id=bank)
    assert isinstance(recalled, list)
    assert len(recalled) > 0
    assert any("Python" in m.get("content", "") for m in recalled)

    # 3. Reflect
    refl = hindsight_service.reflect("Python engagement", bank_id=bank)
    assert "query" in refl
