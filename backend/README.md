# 🛠️ Backend Oficial do Funcionário Digital (AtendeZap)

Este é o backend oficial em **FastAPI** e **SQLite** construído para transformar o projeto de protótipo visual em um serviço operacional real de atendimento inteligente por WhatsApp.

---

## 🌟 O que está implementado

1. **Webhook Oficial da Meta (WhatsApp Cloud API)**:
   - `GET /webhook`: Validação automática de handshake com verificação de token da Meta.
   - `POST /webhook`: Recepção e parsing de mensagens de texto de pacientes reais.
2. **Motor de Decisão & Roteamento Inteligente**:
   - **Regras de Custo R$ 0**: Dúvidas frequentes sobre horários, endereço e localização são respondidas instantaneamente sem gastar IA.
   - **Transbordo Humano (*Human Handoff*)**: Ao detectar termos como *"falar com atendente"*, *"humano"*, *"urgência"* ou *"reclamação"*, aciona alerta imediato no banco e transfere a conversa.
   - **Agendamento no Banco de Dados**: Identifica intenções de agendamento e salva o registro na tabela `appointments`.
   - **IA Conversacional**: Conexão nativa com **Gemini 1.5 Flash** (nuvem) e suporte a **Ollama** local. Possui fallback inteligente caso nenhuma chave esteja configurada, permitindo testes imediatos.
3. **Painel de Gestão e Backoffice (APIs Reais)**:
   - `GET /api/appointments`: Lista agendamentos salvos.
   - `GET /api/handoffs`: Lista alertas de transbordo humano pendentes.
   - `POST /api/handoffs/{id}/resolve`: Conclui o atendimento humano.
   - `GET /api/conversations/{phone}`: Histórico real da conversa.
4. **Endpoint de Simulação de Chat**:
   - `POST /api/chat/simulate`: Permite testar o fluxo conversacional sem precisar de chip ou aprovação da Meta.

---

## 🚀 Como Iniciar o Servidor

Na pasta `backend`, execute:

```bash
python run_server.py
```

O servidor iniciará em `http://127.0.0.1:8000`.

### 📖 Documentação Interativa (Swagger UI)
Acesse no seu navegador:
👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

---

## ⚙️ Configuração das Variáveis de Ambiente (`.env`)

Copie o arquivo `.env.example` para `.env` e preencha conforme desejar:

```ini
# Meta WhatsApp Cloud API (developers.facebook.com)
META_VERIFY_TOKEN=gere_um_token_aleatorio_e_configure_o_mesmo_na_Meta
META_ACCESS_TOKEN=seu_token_aqui
META_PHONE_NUMBER_ID=seu_id_aqui

# Provedor de IA (Google AI Studio - Gratuito)
GEMINI_API_KEY=sua_chave_gemini_aqui
GEMINI_MODEL=gemini-1.5-flash

# Ollama Local (Opcional)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b
```

---

## 🧪 Como Rodar a Suíte de Testes

Para garantir que todas as regras, banco de dados e webhooks continuam funcionando:

```bash
pytest test_backend.py -v
```
