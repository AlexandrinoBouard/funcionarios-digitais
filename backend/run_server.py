import uvicorn
from config import settings

if __name__ == "__main__":
    print("=" * 65)
    print(f"🚀 {settings.APP_NAME} - Servidor Backend Ativo!")
    print(f"👉 API Local: http://127.0.0.1:{settings.PORT}")
    print(f"👉 Documentação Interativa (Swagger): http://127.0.0.1:{settings.PORT}/docs")
    print(f"👉 Webhook WhatsApp (Meta): http://127.0.0.1:{settings.PORT}/webhook")
    print("Pressione Ctrl+C para encerrar.")
    print("=" * 65)
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
