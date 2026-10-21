import logging
import httpx
from config import settings

logger = logging.getLogger("whatsapp_service")
logging.basicConfig(level=logging.INFO)

async def send_whatsapp_message(to_phone: str, text: str) -> bool:
    """
    Envia uma mensagem de texto de volta ao cliente via Meta WhatsApp Cloud API.
    Se as credenciais não estiverem configuradas, simula o envio no log.
    """
    if not settings.META_ACCESS_TOKEN or not settings.META_PHONE_NUMBER_ID:
        logger.info(f"[SIMULAÇÃO WHATSAPP] Para: {to_phone} | Mensagem: {text}")
        return True

    url = f"https://graph.facebook.com/v19.0/{settings.META_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {settings.META_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to_phone,
        "type": "text",
        "text": {"preview_url": False, "body": text}
    }

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=payload, headers=headers, timeout=10.0)
            if resp.status_code in (200, 201):
                logger.info(f"Mensagem enviada com sucesso para {to_phone}")
                return True
            else:
                logger.error(f"Erro ao enviar mensagem WhatsApp: {resp.status_code} - {resp.text}")
                return False
    except Exception as e:
        logger.error(f"Exceção ao comunicar com a API da Meta: {e}")
        return False
