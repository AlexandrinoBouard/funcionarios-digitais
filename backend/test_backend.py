import os
import pytest
from fastapi.testclient import TestClient

TEST_DB = os.path.join(os.path.dirname(__file__), "test_atendezap.db")
os.environ["ENVIRONMENT"] = "test"
os.environ["DB_PATH"] = TEST_DB
os.environ["META_VERIFY_TOKEN"] = "test-only-meta-verify-token"

from main import app
from database import init_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    # Remove teste anterior se existir
    if os.path.exists(TEST_DB):
        os.remove(TEST_DB)
    init_db()
    yield
    # Limpeza após testes
    if os.path.exists(TEST_DB):
        try:
            os.remove(TEST_DB)
        except Exception:
            pass

client = TestClient(app)

def test_root_health_check():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["features"]["meta_whatsapp_webhook"] is True

def test_meta_webhook_verification_success():
    params = {
        "hub.mode": "subscribe",
        "hub.verify_token": "test-only-meta-verify-token",
        "hub.challenge": "1158201244"
    }
    response = client.get("/webhook", params=params)
    assert response.status_code == 200
    assert response.text == "1158201244"

def test_meta_webhook_verification_failure():
    params = {
        "hub.mode": "subscribe",
        "hub.verify_token": "wrong_token",
        "hub.challenge": "1158201244"
    }
    response = client.get("/webhook", params=params)
    assert response.status_code == 403

def test_faq_rule_zero_cost():
    # Pergunta de horário deve responder via regra sem gastar IA
    payload = {"phone": "5511999990001", "message": "Qual o horário de funcionamento de vocês?"}
    response = client.post("/api/chat/simulate", json=payload)
    assert response.status_code == 200
    reply = response.json()["reply"]
    assert "08:00 às 18:00" in reply

def test_human_handoff_trigger():
    # Pedido de atendente humano deve gerar alerta e transferir
    payload = {"phone": "5511999990002", "message": "Preciso falar urgente com uma atendente humana"}
    response = client.post("/api/chat/simulate", json=payload)
    assert response.status_code == 200
    reply = response.json()["reply"]
    assert "equipe humana" in reply

    # Verifica se apareceu no backoffice de handoffs
    handoffs_resp = client.get("/api/handoffs?status=open")
    assert handoffs_resp.status_code == 200
    items = handoffs_resp.json()["handoffs"]
    assert len(items) >= 1
    target = next((h for h in items if h["phone"] == "5511999990002"), None)
    assert target is not None
    assert target["status"] == "open"

    # Testa resolução do handoff pela secretária
    resolve_resp = client.post(f"/api/handoffs/{target['id']}/resolve")
    assert resolve_resp.status_code == 200

def test_appointment_booking():
    # Mensagem de agendamento deve gravar no banco
    payload = {"phone": "5511999990003", "message": "Quero agendar uma limpeza para amanhã às 14h"}
    response = client.post("/api/chat/simulate", json=payload)
    assert response.status_code == 200
    reply = response.json()["reply"]
    assert "Agendamento Pré-Confirmado" in reply
    assert "Limpeza" in reply

    # Verifica se gravou na tabela de agendamentos
    appt_resp = client.get("/api/appointments")
    assert appt_resp.status_code == 200
    appointments = appt_resp.json()["appointments"]
    assert len(appointments) >= 1
    found = next((a for a in appointments if a["phone"] == "5511999990003"), None)
    assert found is not None
    assert "Limpeza" in found["service"]

def test_meta_webhook_post_ingestion():
    # Simula payload padrão que a Meta envia quando um usuário manda mensagem no WhatsApp
    meta_payload = {
        "object": "whatsapp_business_account",
        "entry": [
            {
                "id": "100654321098765",
                "changes": [
                    {
                        "value": {
                            "messaging_product": "whatsapp",
                            "metadata": {
                                "display_phone_number": "5511999998888",
                                "phone_number_id": "10987654321"
                            },
                            "messages": [
                                {
                                    "from": "5511988887777",
                                    "id": "wamid.HBgLM...",
                                    "timestamp": "1729512345",
                                    "text": {
                                        "body": "Onde fica o consultório de vocês?"
                                    },
                                    "type": "text"
                                }
                            ]
                        },
                        "field": "messages"
                    }
                ]
            }
        ]
    }
    response = client.post("/webhook", json=meta_payload)
    assert response.status_code == 200
    assert response.json() == {"status": "success"}

    # Verifica se a mensagem foi registrada no histórico
    history_resp = client.get("/api/conversations/5511988887777")
    assert history_resp.status_code == 200
    messages = history_resp.json()["history"]
    assert len(messages) >= 2 # Mensagem do usuário + resposta da IA
