// Simulador Interativo do WhatsApp

class WhatsAppSimulator {
  constructor() {
    this.currentNiche = null;
    this.messages = [];
    this.isTyping = false;
    this.pendingTimeouts = [];
    this.lastSelectedMeta = "";
    
    // Elementos DOM
    this.chatBody = document.getElementById("chat-messages-container");
    this.quickRepliesContainer = document.getElementById("quick-replies-container");
    this.headerAvatar = document.getElementById("chat-header-avatar");
    this.headerName = document.getElementById("chat-header-name");
    this.headerStatus = document.getElementById("chat-header-status");
    this.headerBadge = document.getElementById("chat-header-badge");
    this.inputField = document.getElementById("chat-text-input");
    this.sendBtn = document.getElementById("chat-send-btn");

    this.initAudioContext();
    this.bindEvents();
  }

  // Gera sons realistas sintetizados sem depender de arquivos externos de áudio
  initAudioContext() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      this.audioCtx = null;
    }
  }

  playPopSound() {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch(e) {}
  }

  playCashSound() {
    if (!this.audioCtx) return;
    try {
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc1.frequency.setValueAtTime(587, this.audioCtx.currentTime); // D5
      osc1.frequency.setValueAtTime(880, this.audioCtx.currentTime + 0.1); // A5
      osc2.frequency.setValueAtTime(1174, this.audioCtx.currentTime + 0.15); // D6

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.audioCtx.currentTime + 0.35);
      osc2.stop(this.audioCtx.currentTime + 0.35);
    } catch(e) {}
  }

  bindEvents() {
    if (this.sendBtn && this.inputField) {
      this.sendBtn.addEventListener("click", () => this.handleUserTextSubmit());
      this.inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.handleUserTextSubmit();
      });
    }

    // Modal de Cartão de Crédito
    const closeCardModal = document.getElementById("close-card-modal");
    if (closeCardModal) {
      closeCardModal.addEventListener("click", () => {
        document.getElementById("card-modal-backdrop").classList.add("hidden");
      });
    }
  }

  loadNiche(nicheKey) {
    const data = window.NICHES_DATA[nicheKey];
    if (!data) return;

    this.clearTimeouts();
    this.currentNiche = data;
    this.messages = [];
    this.lastSelectedMeta = "";

    // Atualiza cabeçalho do WhatsApp
    this.headerAvatar.src = data.avatar;
    this.headerName.innerText = data.botName;
    this.headerStatus.innerText = data.headerStatus;

    // Limpa a tela
    this.chatBody.innerHTML = "";
    this.quickRepliesContainer.innerHTML = "";

    // Exibe mensagem de criptografia padrão do WhatsApp
    this.renderEncryptionNotice();

    // Roda os passos iniciais programados com delay natural
    let cumulativeDelay = 300;
    data.initialSteps.forEach((step, idx) => {
      const t = setTimeout(() => {
        if (step.sender === "bot") {
          this.showTypingIndicator();
          const typingTime = Math.min(step.text.length * 20, 1000);
          
          const t2 = setTimeout(() => {
            this.hideTypingIndicator();
            this.appendBotMessage(step.text);
            this.playPopSound();

            if (step.quickReplies && idx === data.initialSteps.length - 1) {
              this.renderQuickReplies(step.quickReplies);
            }
          }, typingTime);
          this.pendingTimeouts.push(t2);
        }
      }, cumulativeDelay);

      cumulativeDelay += (step.delay || 1000) + 700;
      this.pendingTimeouts.push(t);
    });

    // Notifica o painel administrativo para sincronizar
    if (window.backofficeManager) {
      window.backofficeManager.syncNiche(data);
    }
  }

  clearTimeouts() {
    this.pendingTimeouts.forEach(t => clearTimeout(t));
    this.pendingTimeouts = [];
    this.hideTypingIndicator();
  }

  renderEncryptionNotice() {
    const div = document.createElement("div");
    div.className = "flex justify-center my-3";
    div.innerHTML = `
      <div class="bg-[#ffeecd] text-[#54656f] text-[11px] font-medium py-1.5 px-3 rounded-lg shadow-sm max-w-[90%] text-center leading-relaxed">
        🔒 As mensagens e chamadas são protegidas com a criptografia de ponta a ponta. Atendimento automatizado por Funcionário Digital 24h.
      </div>
    `;
    this.chatBody.appendChild(div);
  }

  showTypingIndicator() {
    if (document.getElementById("typing-bubble")) return;
    this.headerStatus.innerText = "digitando...";
    this.headerStatus.classList.add("text-[#00a884]", "font-semibold");

    const typingDiv = document.createElement("div");
    typingDiv.id = "typing-bubble";
    typingDiv.className = "flex items-start mb-2.5 msg-animate";
    typingDiv.innerHTML = `
      <div class="bubble-in py-2.5 px-4 flex items-center">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    this.chatBody.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const el = document.getElementById("typing-bubble");
    if (el) el.remove();
    if (this.currentNiche) {
      this.headerStatus.innerText = this.currentNiche.headerStatus;
      this.headerStatus.classList.remove("text-[#00a884]", "font-semibold");
    }
  }

  appendBotMessage(text) {
    const time = this.getCurrentTime();
    const formattedText = this.formatMarkdown(text);

    const msgDiv = document.createElement("div");
    msgDiv.className = "flex items-start mb-2.5 msg-animate";
    msgDiv.innerHTML = `
      <div class="bubble-in py-2 px-3 max-w-[85%] md:max-w-[75%] text-[#111b21] text-[13.5px] leading-relaxed break-words">
        <div>${formattedText}</div>
        <div class="text-[10px] text-[#667781] text-right mt-1 font-medium">${time}</div>
      </div>
    `;
    this.chatBody.appendChild(msgDiv);
    this.scrollToBottom();
  }

  appendUserMessage(text) {
    const time = this.getCurrentTime();

    const msgDiv = document.createElement("div");
    msgDiv.className = "flex justify-end mb-2.5 msg-animate";
    msgDiv.innerHTML = `
      <div class="bubble-out py-2 px-3 max-w-[85%] md:max-w-[75%] text-[#111b21] text-[13.5px] leading-relaxed break-words">
        <div>${text}</div>
        <div class="flex items-center justify-end gap-1 text-[10px] text-[#667781] mt-1 font-medium">
          <span>${time}</span>
          <svg class="w-3.5 h-3.5 text-[#53bdeb]" viewBox="0 0 16 11" fill="currentColor">
            <path d="M15.01 3.316l-7.391 7.392a.855.855 0 01-1.21 0l-3.696-3.696a.855.855 0 111.21-1.21l3.091 3.091 6.786-6.787a.855.855 0 111.21 1.21z"/>
            <path d="M10.8 3.316l-7.39 7.392a.855.855 0 01-1.21 0L.4 8.908a.855.855 0 111.21-1.21l1.19 1.19 6.79-6.782a.855.855 0 111.21 1.21z"/>
          </svg>
        </div>
      </div>
    `;
    this.chatBody.appendChild(msgDiv);
    this.scrollToBottom();
  }

  renderQuickReplies(replies) {
    this.quickRepliesContainer.innerHTML = "";
    if (!replies || replies.length === 0) return;

    replies.forEach(reply => {
      const btn = document.createElement("button");
      btn.className = "text-left text-xs bg-white hover:bg-emerald-50 text-emerald-950 font-medium py-2 px-3 rounded-xl border border-emerald-200/80 shadow-sm transition-all duration-150 active:scale-95 flex items-center justify-between gap-2";
      btn.innerHTML = `
        <span>${reply.text}</span>
        <svg class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      `;
      btn.addEventListener("click", () => {
        this.handleReplySelection(reply);
      });
      this.quickRepliesContainer.appendChild(btn);
    });
  }

  handleReplySelection(reply) {
    this.appendUserMessage(reply.text);
    this.quickRepliesContainer.innerHTML = "";
    this.playPopSound();

    if (reply.meta) {
      this.lastSelectedMeta = reply.meta;
    }

    if (reply.isPixTrigger) {
      this.triggerPixFlow(reply.valor || 50);
      return;
    }

    if (reply.isCardTrigger) {
      this.triggerCardModal(reply.valor || 50);
      return;
    }

    const flow = this.currentNiche.flows[reply.next];
    if (flow) {
      this.executeFlow(flow);
    } else {
      this.fallbackResponse(reply.text);
    }
  }

  executeFlow(flow) {
    this.showTypingIndicator();
    let delayAccumulator = 600;

    flow.botMessages.forEach((msg, idx) => {
      const t = setTimeout(() => {
        this.showTypingIndicator();
        const typingDuration = Math.min(msg.text.length * 18, 900);

        const t2 = setTimeout(() => {
          this.hideTypingIndicator();
          this.appendBotMessage(msg.text);
          this.playPopSound();

          if (msg.quickReplies && idx === flow.botMessages.length - 1) {
            this.renderQuickReplies(msg.quickReplies);
          }
        }, typingDuration);

        this.pendingTimeouts.push(t2);
      }, delayAccumulator);

      delayAccumulator += (msg.delay || 800) + 600;
      this.pendingTimeouts.push(t);
    });
  }

  handleUserTextSubmit() {
    const text = this.inputField.value.trim();
    if (!text) return;

    this.inputField.value = "";
    this.appendUserMessage(text);
    this.quickRepliesContainer.innerHTML = "";
    this.playPopSound();

    // Lógica contextual de resposta a texto livre
    const lower = text.toLowerCase();
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();

      if (lower.includes("pix") || lower.includes("pagar") || lower.includes("pagamento")) {
        this.triggerPixFlow(50);
      } else if (lower.includes("cartão") || lower.includes("cartao") || lower.includes("crédito")) {
        this.triggerCardModal(50);
      } else if (lower.includes("horário") || lower.includes("agendar") || lower.includes("marcar")) {
        const flowKey = Object.keys(this.currentNiche.flows)[0];
        this.executeFlow(this.currentNiche.flows[flowKey]);
      } else if (lower.includes("endereço") || lower.includes("local") || lower.includes("onde")) {
        this.appendBotMessage(`Estamos localizados na área central! Nosso sistema enviará a rota completa do Google Maps e Waze para você assim que o agendamento for concluído.`);
        this.renderQuickReplies([
          { text: "📅 Quero agendar agora", next: Object.keys(this.currentNiche.flows)[0] }
        ]);
      } else {
        this.appendBotMessage(`Entendi perfeitamente! Como nosso atendimento é 100% integrado ao sistema da ${this.currentNiche.name}, posso agilizar isso para você agora mesmo. Selecione a melhor opção abaixo:`);
        const firstFlow = Object.keys(this.currentNiche.flows)[0];
        if (firstFlow && this.currentNiche.flows[firstFlow].botMessages[0].quickReplies) {
          this.renderQuickReplies(this.currentNiche.flows[firstFlow].botMessages[0].quickReplies);
        } else {
          this.renderQuickReplies([
            { text: "✅ Continuar atendimento", next: firstFlow }
          ]);
        }
      }
      this.playPopSound();
    }, 900);
  }

  triggerPixFlow(valor) {
    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();

      const chaveFake = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 15)}520400005303986540${valor}.005802BR5925${encodeURIComponent(this.currentNiche.businessName.substring(0, 15))}6009CURITIBA62070503***6304`;

      const pixDiv = document.createElement("div");
      pixDiv.className = "flex items-start mb-3 msg-animate w-full";
      pixDiv.innerHTML = `
        <div class="bubble-in p-3.5 max-w-[95%] md:max-w-[85%] text-[#111b21] text-[13px] border border-emerald-300 shadow-md rounded-xl">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100">
            <div class="flex items-center gap-2">
              <span class="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>
              </span>
              <span class="font-bold text-emerald-900 text-sm">Cobrança Pix Dinâmica</span>
            </div>
            <span class="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Expira em 15min</span>
          </div>

          <div class="text-xs text-gray-600 mb-2">
            Favorecido: <strong class="text-gray-900">${this.currentNiche.businessName}</strong><br>
            Valor a Pagar: <strong class="text-emerald-700 text-base">R$ ${valor},00</strong>
          </div>

          <!-- QR Code Simulado SVG -->
          <div class="bg-white p-3 rounded-lg border border-gray-200 flex flex-col items-center justify-center my-2 shadow-inner">
            <svg class="w-36 h-36" viewBox="0 0 100 100" fill="black">
              <!-- Padrão gráfico fiel de QR Code -->
              <rect width="100" height="100" fill="white"/>
              <path d="M10 10h24v24h-24z M14 14h16v16h-16z M18 18h8v8h-8z M66 10h24v24h-24z M70 14h16v16h-16z M74 18h8v8h-8z M10 66h24v24h-24z M14 70h16v16h-16z M18 74h8v8h-8z"/>
              <rect x="42" y="10" width="8" height="16" fill="black"/>
              <rect x="54" y="18" width="6" height="8" fill="black"/>
              <rect x="42" y="42" width="16" height="16" fill="#00a884"/>
              <rect x="10" y="42" width="12" height="6" fill="black"/>
              <rect x="28" y="48" width="6" height="12" fill="black"/>
              <rect x="66" y="42" width="12" height="10" fill="black"/>
              <rect x="84" y="56" width="6" height="12" fill="black"/>
              <rect x="42" y="66" width="10" height="8" fill="black"/>
              <rect x="58" y="70" width="12" height="12" fill="black"/>
              <rect x="76" y="76" width="14" height="14" fill="black"/>
            </svg>
            <span class="text-[10px] text-gray-500 mt-1 font-mono">Aponte a câmera do seu banco</span>
          </div>

          <!-- Campo Copia e Cola -->
          <div class="flex items-center gap-1.5 my-2">
            <input type="text" readonly value="${chaveFake}" class="bg-gray-100 text-[11px] text-gray-700 px-2.5 py-1.5 rounded border border-gray-300 w-full font-mono overflow-hidden text-ellipsis select-all">
            <button onclick="navigator.clipboard.writeText('${chaveFake}'); alert('Código Pix Copia e Cola copiado com sucesso!');" class="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-2.5 py-1.5 rounded font-semibold whitespace-nowrap active:scale-95 transition">
              Copiar
            </button>
          </div>

          <!-- Botão Simular Pagamento -->
          <button id="btn-simulate-pix-${Date.now()}" class="w-full mt-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md btn-pulse-green transition active:scale-95">
            <svg class="w-4 h-4 text-emerald-200" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            <span>👉 Simular Pagamento no Celular (R$ ${valor},00)</span>
          </button>
        </div>
      `;

      this.chatBody.appendChild(pixDiv);
      this.scrollToBottom();
      this.playPopSound();

      // Atrela ação de simulação de pagamento
      const simulateBtn = pixDiv.querySelector("button[id^='btn-simulate-pix']");
      simulateBtn.addEventListener("click", () => {
        simulateBtn.disabled = true;
        simulateBtn.innerHTML = `
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
          <span>Confirmando com o Banco Central...</span>
        `;
        
        setTimeout(() => {
          simulateBtn.classList.remove("btn-pulse-green", "from-emerald-600", "to-teal-600");
          simulateBtn.classList.add("bg-emerald-700", "cursor-default");
          simulateBtn.innerHTML = `✅ Pagamento Liquidado com Sucesso!`;

          this.playCashSound();

          // Bot envia confirmação formal
          setTimeout(() => {
            this.appendBotMessage(`🎉 **PAGAMENTO CONFIRMADO!**\n\nRecebemos a confirmação de **R$ ${valor},00** via Pix instantâneo.\n\n📅 **Agendamento Confirmado**: Seu horário está 100% garantido no sistema.\n📍 **Endereço**: Notificação e comprovante foram despachados para o seu WhatsApp.`);
            this.playPopSound();

            // Atualiza o Backoffice em tempo real!
            if (window.backofficeManager) {
              window.backofficeManager.registerNewEntry({
                niche: this.currentNiche,
                valor: valor,
                servico: this.lastSelectedMeta || "Agendamento Confirmado",
                metodo: "Pix Instantâneo"
              });
            }
          }, 800);
        }, 1400);
      });
    }, 700);
  }

  triggerCardModal(valor) {
    const modal = document.getElementById("card-modal-backdrop");
    const valorEl = document.getElementById("card-modal-valor");
    const confirmBtn = document.getElementById("btn-confirm-card-pay");

    if (!modal) return;
    valorEl.innerText = `R$ ${valor},00`;
    modal.classList.remove("hidden");

    confirmBtn.onclick = () => {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `Processando com Adquirente...`;

      setTimeout(() => {
        modal.classList.add("hidden");
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `Pagar com Cartão de Crédito`;

        this.playCashSound();
        this.appendBotMessage(`💳 **TRANSAÇÃO APROVADA NO CARTÃO!**\n\nCobrança de **R$ ${valor},00** autorizada pela operadora.\n\n✅ Horário e reserva validados com sucesso no sistema da ${this.currentNiche.businessName}!`);
        
        if (window.backofficeManager) {
          window.backofficeManager.registerNewEntry({
            niche: this.currentNiche,
            valor: valor,
            servico: this.lastSelectedMeta || "Agendamento Confirmado",
            metodo: "Cartão de Crédito (Autorizado)"
          });
        }
      }, 1200);
    };
  }

  scrollToBottom() {
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

  getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatMarkdown(text) {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  resetCurrent() {
    if (this.currentNiche) {
      this.loadNiche(this.currentNiche.id);
    }
  }
}

window.WhatsAppSimulator = WhatsAppSimulator;
