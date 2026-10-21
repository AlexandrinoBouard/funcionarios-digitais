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
    this.headerStatus.innerText = "demonstração interativa";

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
        Demonstração interativa: nenhuma mensagem é enviada ao WhatsApp e não há conexão com uma agenda ou pagamento real.
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
      this.headerStatus.innerText = "demonstração interativa";
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
        this.appendBotMessage(`Entendi! Este fluxo é um exemplo de atendimento para ${this.currentNiche.name}. Selecione uma opção para continuar a demonstração:`);
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

      const pixDiv = document.createElement("div");
      pixDiv.className = "flex items-start mb-3 msg-animate w-full";
      pixDiv.innerHTML = `
        <div class="bubble-in p-3.5 max-w-[95%] md:max-w-[85%] text-[#111b21] text-[13px] border border-emerald-300 shadow-md rounded-xl">
          <div class="pb-2 mb-2 border-b border-emerald-100">
            <span class="font-bold text-emerald-900 text-sm">Demonstração de pagamento</span>
          </div>

          <div class="text-xs text-gray-600 mb-2">
            Valor ilustrativo: <strong class="text-emerald-700 text-base">R$ ${valor},00</strong>
          </div>

          <div class="bg-amber-50 p-3 rounded-lg border border-amber-200 my-2 text-xs text-amber-900">
            Esta é apenas uma simulação: não há QR Code, código Pix ou cobrança real.
          </div>

          <button id="btn-simulate-pix-${Date.now()}" class="w-full mt-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md btn-pulse-green transition active:scale-95">
            <svg class="w-4 h-4 text-emerald-200" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            <span>Simular confirmação (não realiza pagamento)</span>
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
          <span>Executando simulação...</span>
        `;
        
        setTimeout(() => {
          simulateBtn.classList.remove("btn-pulse-green", "from-emerald-600", "to-teal-600");
          simulateBtn.classList.add("bg-emerald-700", "cursor-default");
          simulateBtn.innerHTML = `✅ Simulação concluída (sem cobrança)`;

          setTimeout(() => {
            this.appendBotMessage(`Esta demonstração não realizou pagamento nem confirmou um agendamento. Em uma implantação, essas confirmações dependem das integrações configuradas.`);
            this.playPopSound();

            if (window.backofficeManager) {
              window.backofficeManager.registerNewEntry({
                niche: this.currentNiche,
                valor: valor,
                servico: this.lastSelectedMeta || "Evento demonstrativo",
                metodo: "Simulação (sem pagamento)"
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
      confirmBtn.innerHTML = `Executando simulação...`;

      setTimeout(() => {
        modal.classList.add("hidden");
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `Simular confirmação`;

        this.appendBotMessage(`Esta demonstração não realizou cobrança nem confirmou um agendamento. Em uma implantação, essas confirmações dependem das integrações configuradas.`);
        
        if (window.backofficeManager) {
          window.backofficeManager.registerNewEntry({
            niche: this.currentNiche,
            valor: valor,
            servico: this.lastSelectedMeta || "Evento demonstrativo",
            metodo: "Simulação (sem pagamento)"
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
