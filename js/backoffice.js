// Painel Backoffice em Tempo Real (Visão do Dono do Negócio)

class BackofficeManager {
  constructor() {
    this.container = document.getElementById("backoffice-content");
    this.statsCards = document.getElementById("backoffice-stats-grid");
    this.badgeTitle = document.getElementById("backoffice-business-title");
    this.badgeSubtitle = document.getElementById("backoffice-business-subtitle");
    this.toastContainer = document.getElementById("live-toast-container");

    this.currentNiche = null;
    this.mockEntries = [];
  }

  syncNiche(niche) {
    this.currentNiche = niche;
    if (this.badgeTitle) this.badgeTitle.innerText = niche.businessName;
    if (this.badgeSubtitle) this.badgeSubtitle.innerText = `Painel de Gestão e Caixa Integrado • ${niche.category}`;

    this.renderStats(niche.stats);
    this.generateMockEntries(niche);
    this.renderEntries();
  }

  renderStats(stats) {
    if (!this.statsCards) return;
    this.statsCards.innerHTML = "";

    const statConfig = [
      { label: "Atendimentos Hoje", value: stats.totalHoje, icon: "📊", color: "from-blue-500 to-indigo-600" },
      { label: "Receita em Sinais/Vendas", value: stats.sinaisRecebidos || stats.faturamentoDelivery || stats.faturamentoHoje || "R$ 850,00", icon: "💰", color: "from-emerald-500 to-teal-600" },
      { label: "Faltas Evitadas / Conversão", value: stats.faltasEvitadas || stats.taxaTaxiDog || "94%", icon: "🛡️", color: "from-purple-500 to-pink-600" },
      { label: "Tempo Médio Resposta", value: stats.tempoResposta || "1.8s", icon: "⚡", color: "from-amber-500 to-orange-600" }
    ];

    statConfig.forEach(s => {
      const card = document.createElement("div");
      card.className = "bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between";
      card.innerHTML = `
        <div>
          <div class="text-[11px] font-medium text-gray-500 uppercase tracking-wider">${s.label}</div>
          <div class="text-xl font-extrabold text-gray-900 mt-0.5">${s.value}</div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center text-lg shadow-sm">
          ${s.icon}
        </div>
      `;
      this.statsCards.appendChild(card);
    });
  }

  generateMockEntries(niche) {
    const clients = [
      { nome: "Mariana Alencar", phone: "(41) 99823-****" },
      { nome: "Rodrigo Silveira", phone: "(41) 98711-****" },
      { nome: "Beatriz Nogueira", phone: "(41) 99145-****" },
      { nome: "Felipe Campelo", phone: "(41) 99201-****" }
    ];

    this.mockEntries = [
      {
        id: "BK-108",
        cliente: clients[0].nome,
        contato: clients[0].phone,
        detalhe: niche.id === "odontologia" ? "Avaliação de Implante - Horário 14h" :
                 niche.id === "imobiliaria" ? "Apto 3 Quartos (R$ 650k) - Visita Confirmada" :
                 niche.id === "advocacia" ? "Consulta Inicial Trabalhista (Horas Extras)" :
                 niche.id === "pizzaria" ? "Pizza 1/2 Parma 1/2 4Queijos + Borda" : "Atendimento Confirmado",
        valor: niche.id === "advocacia" ? "R$ 250,00" : "R$ 50,00",
        status: "Confirmado via Pix",
        hora: "Há 12 min"
      },
      {
        id: "BK-107",
        cliente: clients[1].nome,
        contato: clients[1].phone,
        detalhe: niche.id === "odontologia" ? "Clareamento a Laser - Dr. Henrique" :
                 niche.id === "estetica" ? "Sessão Botox Facial - Dra. Paula" :
                 niche.id === "mecanica" ? "Troca de Óleo Sintético + Filtros" : "Serviço Agendado",
        valor: "R$ 60,00",
        status: "Sinal Pago",
        hora: "Há 34 min"
      },
      {
        id: "BK-106",
        cliente: clients[2].nome,
        contato: clients[2].phone,
        detalhe: niche.id === "petshop" ? "Banho & Tosa Porte Médio + Táxi Dog" :
                 niche.id === "hamburgueria" ? "Combo Smash Bacon Duplo + Batata" : "Agendamento Efetuado",
        valor: "R$ 85,00",
        status: "Liquidado",
        hora: "Há 1h"
      }
    ];
  }

  renderEntries() {
    if (!this.container) return;
    this.container.innerHTML = "";

    const table = document.createElement("div");
    table.className = "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm";
    
    let rowsHtml = this.mockEntries.map(e => `
      <tr class="border-b border-gray-100 hover:bg-slate-50/80 transition duration-150">
        <td class="py-3 px-3 text-xs font-mono font-bold text-gray-500">${e.id}</td>
        <td class="py-3 px-3">
          <div class="font-bold text-xs text-gray-900">${e.cliente}</div>
          <div class="text-[10px] text-gray-400 font-mono">${e.contato}</div>
        </td>
        <td class="py-3 px-3">
          <div class="text-xs text-gray-700 font-medium">${e.detalhe}</div>
          <div class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            ${e.status}
          </div>
        </td>
        <td class="py-3 px-3 text-right">
          <span class="inline-block px-2 py-0.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
            ${e.valor}
          </span>
          <div class="text-[10px] text-gray-400 mt-0.5">${e.hora}</div>
        </td>
      </tr>
    `).join("");

    table.innerHTML = `
      <div class="px-4 py-3 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span class="font-bold text-xs text-slate-800 uppercase tracking-wider">Feed ao Vivo de Operações</span>
        </div>
        <span class="text-[11px] text-slate-500 font-medium">Sincronizado com WhatsApp 24h</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-100/70 text-[10px] font-bold text-slate-600 uppercase border-b border-gray-200">
              <th class="py-2 px-3">Protocolo</th>
              <th class="py-2 px-3">Cliente</th>
              <th class="py-2 px-3">Serviço / Detalhe</th>
              <th class="py-2 px-3 text-right">Valor / Status</th>
            </tr>
          </thead>
          <tbody id="backoffice-table-body">
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;

    this.container.appendChild(table);
  }

  registerNewEntry(data) {
    const newEntry = {
      id: `BK-${Math.floor(110 + Math.random() * 890)}`,
      cliente: "Você (Teste em Tempo Real)",
      contato: "(Seu Navegador)",
      detalhe: data.servico,
      valor: `R$ ${data.valor},00`,
      status: `Confirmado (${data.metodo})`,
      hora: "Agora mesmo"
    };

    this.mockEntries.unshift(newEntry);
    this.renderEntries();

    // Destaque visual na primeira linha
    const tbody = document.getElementById("backoffice-table-body");
    if (tbody && tbody.firstElementChild) {
      tbody.firstElementChild.classList.add("notify-flash", "bg-emerald-50/70");
    }

    // Exibe Toast de Notificação
    this.showToastNotification(data);
  }

  showToastNotification(data) {
    if (!this.toastContainer) return;

    const toast = document.createElement("div");
    toast.className = "msg-animate bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl border border-emerald-500/40 flex items-start gap-3 max-w-sm";
    toast.innerHTML = `
      <div class="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
        ✓
      </div>
      <div class="flex-1">
        <div class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Novo Agendamento Confirmado!</div>
        <div class="text-xs text-slate-200 mt-0.5">
          <strong>${data.niche.botName}</strong> acabou de validar o sinal de <strong>R$ ${data.valor},00</strong> via ${data.metodo}.
        </div>
      </div>
    `;

    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.4s ease";
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }
}

window.BackofficeManager = BackofficeManager;
