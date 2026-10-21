import logging
from contextlib import asynccontextmanager
from typing import Optional, Dict, Any
from fastapi import FastAPI, Request, Response, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import settings
from database import (
    init_db,
    list_appointments,
    list_handoffs,
    resolve_handoff,
    get_recent_messages
)
from ai_engine import process_incoming_message
from whatsapp_service import send_whatsapp_message

# Setup Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    logger.info("Banco de dados SQLite inicializado com sucesso!")
    logger.info(f"Servidor iniciado no ambiente: {settings.ENVIRONMENT}")
    yield
    logger.info("Servidor finalizado.")

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend oficial de automação para AtendeZap 24h (Funcionários Digitais)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "features": {
            "meta_whatsapp_webhook": True,
            "sqlite_appointments": True,
            "ai_router": True,
            "human_handoff": True
        },
        "docs_url": "/docs"
    }

# ================= WHATSAPP META CLOUD API WEBHOOK =================

@app.get("/webhook")
def verify_meta_webhook(
    hub_mode: Optional[str] = Query(None, alias="hub.mode"),
    hub_challenge: Optional[str] = Query(None, alias="hub.challenge"),
    hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token")
):
    """
    Endpoint de verificação do Webhook da Meta.
    A Meta envia uma requisição GET para confirmar a posse do servidor.
    """
    logger.info(f"Recebida verificação de webhook: mode={hub_mode}")
    if hub_mode == "subscribe" and hub_verify_token == settings.META_VERIFY_TOKEN:
        logger.info("Webhook da Meta verificado com sucesso!")
        return Response(content=hub_challenge, media_type="text/plain")

    raise HTTPException(status_code=403, detail="Token de verificação inválido")

@app.post("/webhook")
async def receive_meta_webhook(request: Request):
    """
    Recebe as mensagens enviadas pelos pacientes no WhatsApp via Meta Cloud API.
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Corpo da requisição inválido")

    logger.info(f"Webhook recebido da Meta: {body}")

    entry_list = body.get("entry", [])
    for entry in entry_list:
        changes = entry.get("changes", [])
        for change in changes:
            val = change.get("value", {})
            messages = val.get("messages", [])
            for msg in messages:
                if msg.get("type") == "text":
                    from_phone = msg.get("from")
                    text_body = msg.get("text", {}).get("body", "")

                    logger.info(f"Mensagem recebida de {from_phone}: '{text_body}'")

                    # Processa via IA e regras
                    reply = await process_incoming_message(phone=from_phone, user_msg=text_body)

                    # Responde de volta no WhatsApp
                    await send_whatsapp_message(to_phone=from_phone, text=reply)

    return {"status": "success"}

# ================= API DE SIMULAÇÃO E TESTES (SEM PRECISAR DE CHIP) =================

class ChatSimulationRequest(BaseModel):
    phone: str = "5511999998888"
    message: str

@app.post("/api/chat/simulate")
async def simulate_chat(payload: ChatSimulationRequest):
    """
    Permite testar o fluxo conversacional diretamente pelo navegador ou Swagger UI,
    sem precisar configurar número de WhatsApp ou credenciais da Meta de início.
    """
    reply = await process_incoming_message(phone=payload.phone, user_msg=payload.message)
    return {
        "phone": payload.phone,
        "user_message": payload.message,
        "reply": reply
    }

# ================= API DE GESTÃO E BACKOFFICE (DADOS REAIS) =================

@app.get("/api/appointments")
def get_appointments(client_id: str = "clinica_odonto"):
    """Lista todos os agendamentos registrados no banco de dados"""
    return {"appointments": list_appointments(client_id=client_id)}

@app.get("/api/handoffs")
def get_handoffs(status: Optional[str] = None, client_id: str = "clinica_odonto"):
    """Lista os alertas de transbordo para atendimento humano"""
    return {"handoffs": list_handoffs(status=status, client_id=client_id)}

@app.post("/api/handoffs/{handoff_id}/resolve")
def mark_handoff_resolved(handoff_id: int):
    """Marca um alerta de transbordo humano como resolvido pela secretária"""
    resolve_handoff(handoff_id)
    return {"status": "resolved", "id": handoff_id}

@app.get("/api/conversations/{phone}")
def get_conversation_history(phone: str, client_id: str = "clinica_odonto"):
    """Retorna o histórico de mensagens de um paciente específico"""
    return {"history": get_recent_messages(phone=phone, limit=20, client_id=client_id)}
