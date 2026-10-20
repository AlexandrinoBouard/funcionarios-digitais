// Controlador Principal da Aplicação

document.addEventListener("DOMContentLoaded", () => {
  // Inicialização dos Gerenciadores
  window.backofficeManager = new BackofficeManager();
  window.simulator = new WhatsAppSimulator();

  // Carrega nicho padrão (Odontologia - a estrela do site)
  window.simulator.loadNiche("odontologia");

  // Configuração dos Botões de Seleção de Nicho
  setupNicheSelectors();

  // Configuração da Calculadora de ROI
  setupRoiCalculator();

  // Botão de Reiniciar Demonstração
  const btnReset = document.getElementById("btn-reset-demo");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      window.simulator.resetCurrent();
    });
  }

  // Toggle de visualização Mobile (WhatsApp vs Painel)
  setupMobileViewToggle();
});

function setupNicheSelectors() {
  const nicheButtons = document.querySelectorAll(".niche-select-btn");
  
  nicheButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const nicheId = btn.getAttribute("data-niche");
      if (!nicheId) return;

      // Atualiza estilo dos botões
      nicheButtons.forEach(b => {
        b.classList.remove("bg-emerald-600", "text-white", "shadow-lg", "scale-105");
        b.classList.add("bg-white", "text-slate-700", "hover:bg-slate-100");
      });

      btn.classList.remove("bg-white", "text-slate-700", "hover:bg-slate-100");
      btn.classList.add("bg-emerald-600", "text-white", "shadow-lg", "scale-105");

      // Atualiza banner explicativo do nicho
      updateNicheHeroInfo(nicheId);

      // Carrega o simulador
      window.simulator.loadNiche(nicheId);
    });
  });
}

function updateNicheHeroInfo(nicheId) {
  const data = window.NICHES_DATA[nicheId];
  if (!data) return;

  const titleEl = document.getElementById("active-niche-title");
  const descEl = document.getElementById("active-niche-desc");
  const ticketEl = document.getElementById("active-niche-ticket");
  const dorEl = document.getElementById("active-niche-dor");

  if (titleEl) titleEl.innerText = data.name;
  if (descEl) descEl.innerText = data.heroHeadline;
  if (ticketEl) ticketEl.innerText = data.ticketMedio;
  if (dorEl) dorEl.innerText = data.dorResolvida;
}

function setupRoiCalculator() {
  const lostLeadsInput = document.getElementById("roi-lost-leads");
  const avgTicketInput = document.getElementById("roi-avg-ticket");
  
  const lostLeadsVal = document.getElementById("roi-lost-leads-val");
  const avgTicketVal = document.getElementById("roi-avg-ticket-val");

  const monthlyLossEl = document.getElementById("roi-monthly-loss");
  const totalGainEl = document.getElementById("roi-total-gain");

  function calculate() {
    const leadsPerDay = parseInt(lostLeadsInput.value, 10) || 3;
    const ticket = parseFloat(avgTicketInput.value) || 250;

    lostLeadsVal.innerText = `${leadsPerDay} clientes/dia`;
    avgTicketVal.innerText = `R$ ${ticket.toLocaleString("pt-BR")}`;

    // Perda mensal estimada considerando 22 dias úteis
    const monthlyLostRevenue = leadsPerDay * 22 * ticket;
    // Recuperação de pelo menos 60% desses clientes com atendimento instantâneo 24h
    const recoveredRevenue = monthlyLostRevenue * 0.60;
    // Economia de recepcionista física (~R$ 3.200) menos a mensalidade da IA (R$ 597) = R$ 2.603
    const laborEconomy = 2603;

    const totalEstimatedGain = recoveredRevenue + laborEconomy;

    monthlyLossEl.innerText = `R$ ${monthlyLostRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    totalGainEl.innerText = `R$ ${totalEstimatedGain.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mês`;
  }

  if (lostLeadsInput && avgTicketInput) {
    lostLeadsInput.addEventListener("input", calculate);
    avgTicketInput.addEventListener("input", calculate);
    calculate();
  }
}

function setupMobileViewToggle() {
  const toggleBtnWa = document.getElementById("mobile-tab-wa");
  const toggleBtnBack = document.getElementById("mobile-tab-backoffice");
  const colWa = document.getElementById("col-simulator-wa");
  const colBack = document.getElementById("col-simulator-backoffice");

  if (!toggleBtnWa || !toggleBtnBack || !colWa || !colBack) return;

  toggleBtnWa.addEventListener("click", () => {
    toggleBtnWa.classList.add("bg-emerald-600", "text-white");
    toggleBtnWa.classList.remove("bg-slate-200", "text-slate-700");

    toggleBtnBack.classList.add("bg-slate-200", "text-slate-700");
    toggleBtnBack.classList.remove("bg-emerald-600", "text-white");

    colWa.classList.remove("hidden");
    colBack.classList.add("hidden");
  });

  toggleBtnBack.addEventListener("click", () => {
    toggleBtnBack.classList.add("bg-emerald-600", "text-white");
    toggleBtnBack.classList.remove("bg-slate-200", "text-slate-700");

    toggleBtnWa.classList.add("bg-slate-200", "text-slate-700");
    toggleBtnWa.classList.remove("bg-emerald-600", "text-white");

    colBack.classList.remove("hidden");
    colWa.classList.add("hidden");
  });
}
