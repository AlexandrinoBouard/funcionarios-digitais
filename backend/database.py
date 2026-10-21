import sqlite3
from typing import List, Dict, Any, Optional
from datetime import datetime
from config import settings

def get_connection():
    conn = sqlite3.connect(settings.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Tabela de agendamentos reais
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id TEXT DEFAULT 'clinica_odonto',
        patient_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        service TEXT NOT NULL,
        date_time TEXT NOT NULL,
        status TEXT DEFAULT 'confirmed', -- confirmed, cancelled, completed
        created_at TEXT NOT NULL
    )
    """)

    # Tabela de histórico de conversas
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id TEXT DEFAULT 'clinica_odonto',
        phone TEXT NOT NULL,
        role TEXT NOT NULL, -- user, assistant, system
        content TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # Tabela de transbordo para atendimento humano (Handoff)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS handoffs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id TEXT DEFAULT 'clinica_odonto',
        phone TEXT NOT NULL,
        reason TEXT NOT NULL,
        status TEXT DEFAULT 'open', -- open, resolved
        created_at TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()

# Métodos de Acesso a Dados (DAO)

def save_message(phone: str, role: str, content: str, client_id: str = "clinica_odonto"):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO messages (client_id, phone, role, content, created_at) VALUES (?, ?, ?, ?, ?)",
        (client_id, phone, role, content, datetime.now().isoformat())
    )
    conn.commit()
    conn.close()

def get_recent_messages(phone: str, limit: int = 10, client_id: str = "clinica_odonto") -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT role, content, created_at FROM messages WHERE client_id = ? AND phone = ? ORDER BY id DESC LIMIT ?",
        (client_id, phone, limit)
    )
    rows = cursor.fetchall()
    conn.close()
    return [{"role": r["role"], "content": r["content"], "created_at": r["created_at"]} for r in reversed(rows)]

def create_appointment(patient_name: str, phone: str, service: str, date_time: str, client_id: str = "clinica_odonto") -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO appointments (client_id, patient_name, phone, service, date_time, status, created_at) VALUES (?, ?, ?, ?, ?, 'confirmed', ?)",
        (client_id, patient_name, phone, service, date_time, datetime.now().isoformat())
    )
    appointment_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return appointment_id

def list_appointments(client_id: str = "clinica_odonto") -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, patient_name, phone, service, date_time, status, created_at FROM appointments WHERE client_id = ? ORDER BY id DESC",
        (client_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def check_slot_available(date_time: str, client_id: str = "clinica_odonto") -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT COUNT(*) FROM appointments WHERE client_id = ? AND date_time = ? AND status != 'cancelled'",
        (client_id, date_time)
    )
    count = cursor.fetchone()[0]
    conn.close()
    return count == 0

def create_handoff(phone: str, reason: str, client_id: str = "clinica_odonto") -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO handoffs (client_id, phone, reason, status, created_at) VALUES (?, ?, ?, 'open', ?)",
        (client_id, phone, reason, datetime.now().isoformat())
    )
    handoff_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return handoff_id

def list_handoffs(status: Optional[str] = None, client_id: str = "clinica_odonto") -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    if status:
        cursor.execute("SELECT * FROM handoffs WHERE client_id = ? AND status = ? ORDER BY id DESC", (client_id, status))
    else:
        cursor.execute("SELECT * FROM handoffs WHERE client_id = ? ORDER BY id DESC", (client_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def resolve_handoff(handoff_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE handoffs SET status = 'resolved' WHERE id = ?", (handoff_id,))
    conn.commit()
    conn.close()
