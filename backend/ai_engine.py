import re
import json
import logging
from typing import Dict, Any, Tuple
import httpx

from config import settings
from database import (
    save_message,
    get_recent_messages,
    create_appointment,
    create_handoff,
    check_slot_available
)

logger = logging.getLogger("ai_engine")

SYSTEM_PROMPT = """Você é a Sofia, secretária digital inteligente da Clínica Odonto Sorriso Mais.
Seu objetivo é atender pacientes com cordialidade, tirar dúvidas sobre serviços (avaliação, limpeza, clareamento, ortodontia) e ajudar no agendamento.
Diretrizes fundamentais para WhatsApp:
- Respostas curtas, acolhedoras e naturais (máximo 2 a 3 parágrafos curtos).
- Use pontuação amigável e emojis moderados.
- Se o paciente quiser agendar, pergunte o serviço desejado e a preferência de dia/horário.
- Nunca invente procedimentos médicos invasivos ou prometa diagnósticos.
- Horário de atendimento da clínica: Segunda a Sexta, das 08h às 18h.
- Endereço: Av. Principal, 1000 - Sala 402, Centro.
"""

def match_deterministic_rules(user_msg: str, phone: str) -> Tuple[bool, str]:
    """
    Avalia regras de custo zero (FAQ fixo, pedido de atendente humano, etc.)
    Retorna (match_encontrado, resposta)
    """
    msg_lower = user_msg.lower().strip()

    # 1. Gatilho de Transbordo Humano (Handoff)
    handoff_keywords = [
        "humano", "atendente", "falar com alguem", "falar com alguém",
        "secretaria", "secretária", "pessoa", "reclamação", "reclamacao",
        "advogado", "urgencia", "urgência", "processo"
    ]
    if any(k in msg_lower for k in handoff_keywords):
        create_handoff(phone=phone, reason=f"Solicitação do cliente: {user_msg}")
        reply = (
            "Compreendo perfeitamente! Já acionei a nossa equipe humana aqui na clínica. 👩‍💼\n\n"
            "Uma de nossas recepcionistas vai assumir esta conversa em instantes para te atender pessoalmente. "
            "Por favor, aguarde só um momento!"
        )
        return True, reply

    # 2. Perguntas frequentes de custo R$ 0 (Horários e Endereço)
    if any(k in msg_lower for k in ["horario", "horário", "abre que horas", "funciona ate", "funciona até"]):
        reply = (
            "Nosso horário de funcionamento é de **segunda a sexta-feira, das 08:00 às 18:00**, "
            "e aos sábados das 08:00 às 12:00. Gostaria de verificar um horário para sua consulta?"
        )
        return True, reply

    if any(k in msg_lower for k in ["endereco", "endereço", "onde fica", "localizacao", "localização", "como chegar"]):
        reply = (
            "A clínica fica na **Av. Principal, 1000 - Sala 402 (Edifício Plaza), Centro**. "
            "Temos estacionamento conveniado no local! Deseja agendar um horário?"
        )
        return True, reply

    # 3. Cancelamento simples
    if any(k in msg_lower for k in ["cancelar consulta", "desmarcar"]):
        create_handoff(phone=phone, reason=f"Pedido de cancelamento: {user_msg}")
        reply = (
            "Entendido. Encaminhei sua solicitação de cancelamento para nossa recepção confirmar "
            "no sistema. Logo mais te confirmamos por aqui!"
        )
        return True, reply

    return False, ""

def detect_and_execute_appointment(user_msg: str, phone: str) -> Tuple[bool, str]:
    """
    Detecta se a mensagem contém os dados de agendamento (ex: nome, data/hora)
    e efetiva a gravação no banco de dados.
    """
    msg_lower = user_msg.lower()

    # Verifica palavras de agendamento
    wants_booking = any(w in msg_lower for w in ["agendar", "marcar", "confirmar", "quero marcar"])

    # Detecção simples de dia/horário
    has_time = bool(re.search(r'\b(\d{1,2}h|\d{1,2}:\d{2}|manhã|tarde|amanhã|segunda|terça|quarta|quinta|sexta)\b', msg_lower))

    if wants_booking and has_time:
        # Detectar serviço
        service = "Avaliação Odontológica Geral"
        if "limpeza" in msg_lower:
            service = "Profilaxia / Limpeza"
        elif "clareamento" in msg_lower:
            service = "Clareamento Dental"
        elif "orto" in msg_lower or "aparelho" in msg_lower:
            service = "Consulta Ortodontia"

        # Extrair data/hora aproximada
        date_time_match = re.search(r'(amanhã|segunda|terça|quarta|quinta|sexta|\d{1,2}/\d{1,2}).*?(\d{1,2}h|\d{1,2}:\d{2})?', msg_lower)
        date_time = date_time_match.group(0) if date_time_match else "Próximo horário disponível"

        # Gravar no banco de dados
        patient_name = f"Paciente ({phone[-4:]})"
        appointment_id = create_appointment(
            patient_name=patient_name,
            phone=phone,
            service=service,
            date_time=date_time
        )

        reply = (
            f"✅ **Agendamento Pré-Confirmado!** (Código #{appointment_id})\n\n"
            f"🦷 **Serviço:** {service}\n"
            f"📅 **Data/Horário:** {date_time}\n"
            f"📍 **Local:** Av. Principal, 1000 - Sala 402\n\n"
            f"Nossa recepção já registrou o horário na agenda oficial. "
            f"Enviaremos um lembrete 24h antes por aqui. Precisa de mais alguma informação?"
        )
        return True, reply

    return False, ""

async def call_gemini_api(history: list, new_msg: str) -> str:
    """Chama a API do Google Gemini via HTTP"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"

    contents = []
    # System instruction
    contents.append({"role": "user", "parts": [{"text": f"Instrução do Sistema:\n{SYSTEM_PROMPT}"}]})
    contents.append({"role": "model", "parts": [{"text": "Entendido. Atuarei como a secretária Sofia seguindo todas as instruções."}]})

    # Histórico recente
    for m in history:
        role = "user" if m["role"] == "user" else "model"
        contents.append({"role": role, "parts": [{"text": m["content"]}]})

    contents.append({"role": "user", "parts": [{"text": new_msg}]})

    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json={"contents": contents}, timeout=15.0)
        if resp.status_code == 200:
            data = resp.json()
            return data["candidates"][0]["content"]["parts"][0]["text"].strip()
        else:
            logger.error(f"Erro Gemini API: {resp.status_code} - {resp.text}")
            raise RuntimeError(f"Gemini API error: {resp.status_code}")

async def call_ollama_api(history: list, new_msg: str) -> str:
    """Chama a API do Ollama local se disponível"""
    url = f"{settings.OLLAMA_HOST}/api/chat"
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for m in history:
        messages.append({"role": m["role"], "content": m["content"]})
    messages.append({"role": "user", "content": new_msg})

    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json={"model": settings.OLLAMA_MODEL, "messages": messages, "stream": False}, timeout=20.0)
        if resp.status_code == 200:
            data = resp.json()
            return data["message"]["content"].strip()
        else:
            raise RuntimeError(f"Ollama error: {resp.status_code}")

def fallback_conversational_response(user_msg: str) -> str:
    """
    Agente conversacional de apoio: responde com naturalidade quando nenhuma chave
    de IA externa estiver configurada, garantindo teste imediato.
    """
    msg = user_msg.lower()
    if any(g in msg for g in ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite"]):
        return (
            "Olá! Tudo bem? Aqui é a Sofia da Clínica Odonto Sorriso Mais. 🦷✨\n\n"
            "Como posso te ajudar hoje? Você gostaria de agendar uma consulta, tirar dúvidas sobre tratamentos ou saber nossa localização?"
        )
    elif any(s in msg for s in ["preco", "preço", "quanto custa", "valor"]):
        return (
            "Os valores exatos dependem da avaliação clínica inicial para verificar as particularidades do seu caso. "
            "A consulta de avaliação com diagnóstico completo custa R$ 120 (ou pode ser coberta pelo convênio). "
            "Gostaria de verificar os horários livres para avaliação esta semana?"
        )
    elif any(s in msg for s in ["clareamento", "limpeza", "aparelho", "implante"]):
        return (
            "Trabalhamos sim com esse procedimento! Realizamos com os métodos mais modernos e confortáveis. "
            "Gostaria de agendar uma avaliação inicial? Temos horários disponíveis amanhã à tarde!"
        )
    else:
        return (
            "Entendi perfeitamente! Para que eu possa te atender melhor, você gostaria de agendar uma consulta "
            "ou prefere falar sobre algum procedimento específico? Se preferir falar com uma atendente, basta me avisar!"
        )

async def process_incoming_message(phone: str, user_msg: str, client_id: str = "clinica_odonto") -> str:
    """
    Fluxo central do Funcionário Digital:
    1. Salva a mensagem recebida.
    2. Avalia regras determinísticas (Custo R$ 0 / Handoff humano).
    3. Detecta intenções de agendamento e executa no banco de dados.
    4. Roteia para Gemini Cloud / Ollama / Fallback.
    5. Salva e retorna a resposta gerada.
    """
    # 1. Salva mensagem do paciente
    save_message(phone=phone, role="user", content=user_msg, client_id=client_id)

    # 2. Regra determinística
    matched, rule_reply = match_deterministic_rules(user_msg, phone)
    if matched:
        save_message(phone=phone, role="assistant", content=rule_reply, client_id=client_id)
        return rule_reply

    # 3. Execução de Agendamento
    booked, book_reply = detect_and_execute_appointment(user_msg, phone)
    if booked:
        save_message(phone=phone, role="assistant", content=book_reply, client_id=client_id)
        return book_reply

    # 4. Roteamento de IA
    history = get_recent_messages(phone=phone, limit=6, client_id=client_id)
    reply_text = ""

    # Tenta Gemini primeiro se configurado
    if settings.GEMINI_API_KEY:
        try:
            reply_text = await call_gemini_api(history, user_msg)
        except Exception as e:
            logger.warning(f"Falha ao chamar Gemini: {e}. Tentando alternativa...")

    # Se Gemini não configurado ou falhou, tenta Ollama se disponível
    if not reply_text and settings.OLLAMA_HOST:
        try:
            reply_text = await call_ollama_api(history, user_msg)
        except Exception as e:
            logger.info(f"Ollama local indisponível ou offline ({e}). Usando motor de contingência.")

    # Contingência / Fallback conversacional
    if not reply_text:
        reply_text = fallback_conversational_response(user_msg)

    # 5. Salva resposta do assistente
    save_message(phone=phone, role="assistant", content=reply_text, client_id=client_id)
    return reply_text
