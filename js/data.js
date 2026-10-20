// Configuração dos Nichos e Diálogos dos Funcionários Digitais
window.NICHES_DATA = {
  odontologia: {
    id: "odontologia",
    name: "Clínica Odontológica",
    category: "Saúde & Alto Ticket",
    featured: true,
    tag: "Mais Vendido 🏆",
    botName: "Dra. Camila - Recepção Virtual",
    businessName: "OdontoPrime Clínica Integrada",
    avatar: "https://images.unsplash.com/photo-1594824813637-295b9d36e2f1?w=150&auto=format&fit=crop&q=80",
    headerStatus: "online • responde em 2 seg",
    heroHeadline: "Triagem automática, agendamento de avaliações e cobrança de sinal no Pix.",
    ticketMedio: "R$ 800 - R$ 15.000 (Implantes/Ortodontia)",
    dorResolvida: "Reduz o no-show (faltas) de 40% para menos de 5% cobrando sinal de R$ 50.",
    backofficeType: "agenda",
    stats: {
      totalHoje: 12,
      sinaisRecebidos: "R$ 600,00",
      faltasEvitadas: "92%",
      tempoResposta: "1.8s"
    },
    initialSteps: [
      {
        sender: "bot",
        text: "Olá! Seja muito bem-vindo(a) à **OdontoPrime**! 🦷✨",
        delay: 500
      },
      {
        sender: "bot",
        text: "Sou a **Camila**, recepcionista digital da clínica. Estou aqui para agilizar seu atendimento e garantir o melhor horário com nossos especialistas.",
        delay: 1200
      },
      {
        sender: "bot",
        text: "Como posso te ajudar hoje?",
        delay: 1800,
        quickReplies: [
          { text: "🦷 Agendar Avaliação", next: "escolha_tratamento" },
          { text: "🚨 Estou com dor (Urgência)", next: "urgencia" },
          { text: "💰 Valores de Tratamentos", next: "valores" },
          { text: "📍 Localização & Horários", next: "localizacao" }
        ]
      }
    ],
    flows: {
      escolha_tratamento: {
        botMessages: [
          { text: "Excelente decisão cuidar do seu sorriso! 😁" },
          { 
            text: "Qual é o principal procedimento que você gostaria de avaliar?",
            quickReplies: [
              { text: "Implantes Dentários", next: "horario_implante", meta: "Implante" },
              { text: "Aparelho Invisível / Ortodontia", next: "horario_orto", meta: "Ortodontia" },
              { text: "Clareamento a Laser", next: "horario_clareamento", meta: "Clareamento" },
              { text: "Limpeza & Checkup Geral", next: "horario_limpeza", meta: "Checkup" }
            ]
          }
        ]
      },
      urgencia: {
        botMessages: [
          { text: "🚨 Entendido! Sentimos muito pelo desconforto. Vamos priorizar seu encaixe hoje mesmo!" },
          { 
            text: "O Dr. Marcelo tem um horário de urgência hoje às **17:15**. Deseja que eu reserve este horário para você?",
            quickReplies: [
              { text: "Sim, reservar hoje 17:15", next: "pix_sinal", meta: "Urgência - Dr. Marcelo" },
              { text: "Ver outro horário amanhã", next: "horarios_gerais", meta: "Urgência - Encaixe" }
            ]
          }
        ]
      },
      valores: {
        botMessages: [
          { text: "Nossos tratamentos são personalizados com equipamentos 3D e tecnologia alemã. Por determinação ética do CFO (Conselho de Odontologia), o valor exato depende da avaliação clínica com raio-X digital." },
          { 
            text: "Nossa consulta de avaliação completa com scanner intraoral está com condição especial nesta semana. Gostaria de agendar a sua?",
            quickReplies: [
              { text: "Quero agendar avaliação", next: "escolha_tratamento" },
              { text: "Falar com dentista no WhatsApp", next: "transferir_humano" }
            ]
          }
        ]
      },
      localizacao: {
        botMessages: [
          { text: "Estamos localizados no coração da cidade: **Av. Batel, 1500 - Edifício Medical Center, 7º andar (com estacionamento conveniado)**." },
          { 
            text: "Atendemos de Segunda a Sexta das 08h às 20h e Sábados das 08h às 13h. Vamos marcar sua visita?",
            quickReplies: [
              { text: "Sim, quero agendar agora", next: "escolha_tratamento" }
            ]
          }
        ]
      },
      horario_implante: {
        botMessages: [
          { text: "Perfeito! Para implantes, o **Dr. Henrique (Mestre em Implantodontia)** realiza uma análise óssea 3D completa no primeiro atendimento." },
          { 
            text: "Temos horários disponíveis nesta semana. Qual período é melhor para você?",
            quickReplies: [
              { text: "Quinta-feira às 15:30 (Tarde)", next: "pix_sinal", meta: "Implante - Dr. Henrique - Qui 15:30" },
              { text: "Sexta-feira às 09:30 (Manhã)", next: "pix_sinal", meta: "Implante - Dr. Henrique - Sex 09:30" },
              { text: "Sábado às 10:00 (Manhã)", next: "pix_sinal", meta: "Implante - Dr. Henrique - Sab 10:00" }
            ]
          }
        ]
      },
      horario_orto: {
        botMessages: [
          { text: "Maravilha! Com os alinhadores invisíveis você corrige os dentes sem fios metálicos. O escaneamento é feito em 15 minutos!" },
          { 
            text: "Selecione o melhor dia para o seu escaneamento 3D:",
            quickReplies: [
              { text: "Amanhã às 14:00", next: "pix_sinal", meta: "Ortodontia - Amanhã 14:00" },
              { text: "Quarta às 18:30 (Pós-expediente)", next: "pix_sinal", meta: "Ortodontia - Qua 18:30" }
            ]
          }
        ]
      },
      horario_clareamento: {
        botMessages: [
          { 
            text: "Ótima escolha! Nosso protocolo a laser deixa os dentes até 4 tons mais brancos em 2 sessões. Qual horário você prefere?",
            quickReplies: [
              { text: "Terça às 11:00", next: "pix_sinal", meta: "Clareamento - Ter 11:00" },
              { text: "Quinta às 16:30", next: "pix_sinal", meta: "Clareamento - Qui 16:30" }
            ]
          }
        ]
      },
      horario_limpeza: {
        botMessages: [
          { 
            text: "Prevenção é saúde! Nossa profilaxia com ultrassom remove tártaro e manchas sem dor.",
            quickReplies: [
              { text: "Segunda às 14:00", next: "pix_sinal", meta: "Limpeza Ultrassônica - Seg 14:00" },
              { text: "Sexta às 17:00", next: "pix_sinal", meta: "Limpeza Ultrassônica - Sex 17:00" }
            ]
          }
        ]
      },
      pix_sinal: {
        botMessages: [
          { text: "Maravilha! Já reservei o horário provisório no sistema." },
          { 
            text: "🔒 **Regra de Reserva**: Para garantir que a cadeira e o especialista fiquem 100% reservados para você sem risco de faltas, solicitamos um sinal simbólico de **R$ 50,00** via Pix.",
            delay: 1000
          },
          { 
            text: "*(Esse valor é abatido integralmente no dia da sua consulta).* Deseja que eu gere o Pix instantâneo agora?",
            quickReplies: [
              { text: "✅ Sim, gerar Chave Pix agora", next: "render_pix", isPixTrigger: true, valor: 50 },
              { text: "💳 Prefiro pagar no Cartão", next: "render_card", isCardTrigger: true, valor: 50 }
            ]
          }
        ]
      },
      transferir_humano: {
        botMessages: [
          { text: "Com certeza! Notifiquei nossa equipe humana no painel. Em instantes um especialista responderá aqui mesmo. Caso prefira agilizar, posso já agendar seu horário automaticamente!" },
          { 
            text: "Deseja ver os horários livres da semana?",
            quickReplies: [
              { text: "Sim, ver horários", next: "escolha_tratamento" }
            ]
          }
        ]
      }
    }
  },

  estetica: {
    id: "estetica",
    name: "Clínica de Estética",
    category: "Beleza & Autoestima",
    featured: true,
    tag: "Ticket Alto 💄",
    botName: "Sofia - Concierge Estética",
    businessName: "Espaço Renove Estética Avançada",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    headerStatus: "online • responde em 2 seg",
    heroHeadline: "Anamnese rápida, agendamento de sessões e avaliação de procedimentos.",
    ticketMedio: "R$ 600 - R$ 4.500 (Botox/Laser/Harmonização)",
    dorResolvida: "Captura clientes no Instagram/WhatsApp 24h e fecha avaliação com depósito prévio.",
    backofficeType: "agenda",
    stats: {
      totalHoje: 18,
      sinaisRecebidos: "R$ 1.400,00",
      faltasEvitadas: "95%",
      tempoResposta: "2.1s"
    },
    initialSteps: [
      {
        sender: "bot",
        text: "Olá, bem-vinda ao **Espaço Renove**! ✨💖",
        delay: 500
      },
      {
        sender: "bot",
        text: "Eu sou a **Sofia**, sua concierge digital. Como posso realçar sua beleza e bem-estar hoje?",
        delay: 1300,
        quickReplies: [
          { text: "💉 Toxina Botulínica (Botox)", next: "botox_info" },
          { text: "⚡ Depilação a Laser Soprano", next: "laser_info" },
          { text: "✨ Harmonização & Preenchimento", next: "harmonizacao_info" },
          { text: "💆 Limpeza de Pele Profunda", next: "limpeza_info" }
        ]
      }
    ],
    flows: {
      botox_info: {
        botMessages: [
          { text: "O Botox é incrível para suavizar linhas na testa, glabela (entre as sobrancelhas) e os 'pés de galinha', com efeito super natural! 🥰" },
          { 
            text: "Trabalhamos com as marcas originais Botox® Allergan e Dysport. Gostaria de agendar sua avaliação facial personalizada?",
            quickReplies: [
              { text: "Sim, agendar avaliação facial", next: "estetica_agendamento", meta: "Botox - Avaliação Facial" },
              { text: "Ver fotos de antes e depois", next: "fotos_botox" }
            ]
          }
        ]
      },
      laser_info: {
        botMessages: [
          { text: "Nosso laser é o **Soprano Ice Platinum**, ponteira resfriada a -5°C que proporciona uma sessão praticamente indolor e rápida! ❄️" },
          { 
            text: "Qual área você tem interesse em tratar?",
            quickReplies: [
              { text: "Corpo Inteiro / Pacote Completo", next: "estetica_agendamento", meta: "Laser Corpo Inteiro" },
              { text: "Axilas + Virilha Completa", next: "estetica_agendamento", meta: "Laser Axilas/Virilha" },
              { text: "Faixa de Barba / Rosto", next: "estetica_agendamento", meta: "Laser Facial" }
            ]
          }
        ]
      },
      harmonizacao_info: {
        botMessages: [
          { text: "Realçamos seus traços naturais com Ácido Hialurônico de alta pureza (Lábios, Mandíbula, Malar ou Mento)." },
          { 
            text: "Toda harmonização inicia com uma consulta de mapeamento facial computadorizado. Vamos agendar a sua?",
            quickReplies: [
              { text: "Sim, agendar mapeamento", next: "estetica_agendamento", meta: "Harmonização Facial" }
            ]
          }
        ]
      },
      limpeza_info: {
        botMessages: [
          { text: "Nossa limpeza profunda inclui peeling de diamante, extração suave por sucção, fototerapia LED calmante e máscara de ouro nutritiva." },
          { 
            text: "Temos horários especiais nesta quinta e sexta. Deseja garantir sua vaga?",
            quickReplies: [
              { text: "Agendar Quinta às 14:30", next: "pix_estetica", meta: "Limpeza de Pele - Qui 14:30" },
              { text: "Agendar Sexta às 16:00", next: "pix_estetica", meta: "Limpeza de Pele - Sex 16:00" }
            ]
          }
        ]
      },
      fotos_botox: {
        botMessages: [
          { text: "Enviando referências autorizadas de pacientes... 📷✨ O resultado começa a aparecer em 72h e atinge o auge em 14 dias com durabilidade de 4 a 6 meses." },
          { 
            text: "Vamos reservar seu horário de aplicação?",
            quickReplies: [
              { text: "Sim, quero agendar!", next: "estetica_agendamento" }
            ]
          }
        ]
      },
      estetica_agendamento: {
        botMessages: [
          { text: "Excelente! Nossa especialista Dra. Paula tem os seguintes horários disponíveis nesta semana:" },
          { 
            text: "Qual você prefere?",
            quickReplies: [
              { text: "Quarta-feira às 15:00", next: "pix_estetica", meta: "Avaliação Estética - Qua 15h" },
              { text: "Sexta-feira às 11:30", next: "pix_estetica", meta: "Avaliação Estética - Sex 11:30" },
              { text: "Sábado às 09:00", next: "pix_estetica", meta: "Avaliação Estética - Sab 09h" }
            ]
          }
        ]
      },
      pix_estetica: {
        botMessages: [
          { text: "Perfeito! Horário pré-reservado no calendário da Dra. Paula." },
          { 
            text: "Para confirmarmos a agenda da maca e os insumos esterilizados, solicitamos o pagamento do sinal de **R$ 60,00** (que será 100% revertido no seu procedimento).",
            quickReplies: [
              { text: "✅ Pagar Sinal de R$ 60 via Pix", next: "render_pix", isPixTrigger: true, valor: 60 },
              { text: "💳 Pagar no Cartão de Crédito", next: "render_card", isCardTrigger: true, valor: 60 }
            ]
          }
        ]
      }
    }
  },

  imobiliaria: {
    id: "imobiliaria",
    name: "Imobiliária & Corretores",
    category: "Vendas High-Ticket",
    featured: true,
    tag: "Qualificação de Leads 🏠",
    botName: "Lucas - Consultor Virtual",
    businessName: "ImóvelFácil Investimentos & Imóveis",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    headerStatus: "online • responde em 2 seg",
    heroHeadline: "Qualifica renda, bairro, tipo de imóvel e agenda visitas diretas com o corretor.",
    ticketMedio: "R$ 350.000 - R$ 2.500.000 (Comissões de R$ 15k+)",
    dorResolvida: "Filtra curiosos e entrega leads 100% prontos para o corretor fechar visita.",
    backofficeType: "crm",
    stats: {
      totalHoje: 24,
      leadsQualificados: 18,
      visitasAgendadas: 9,
      tempoResposta: "1.5s"
    },
    initialSteps: [
      {
        sender: "bot",
        text: "Olá! Seja muito bem-vindo à **ImóvelFácil**! 🏢🔑",
        delay: 500
      },
      {
        sender: "bot",
        text: "Sou o **Lucas**, consultor imobiliário digital. Ajudo você a encontrar o imóvel ideal ou rentabilizar seus investimentos sem perda de tempo.",
        delay: 1300
      },
      {
        sender: "bot",
        text: "Qual é o seu objetivo no momento?",
        delay: 2000,
        quickReplies: [
          { text: "🔑 Quero Comprar um Imóvel", next: "comprar_fluxo" },
          { text: "🏡 Alugar Apartamento / Casa", next: "alugar_fluxo" },
          { text: "📈 Quero Investir (Plantas/Locação)", next: "investir_fluxo" },
          { text: "💰 Quero Vender Meu Imóvel", next: "vender_fluxo" }
        ]
      }
    ],
    flows: {
      comprar_fluxo: {
        botMessages: [
          { text: "Excelente! Temos um catálogo exclusivo de lançamentos e usados nas melhores regiões." },
          { 
            text: "Qual faixa de valor você está planejando para este imóvel?",
            quickReplies: [
              { text: "Até R$ 400 mil (Minha Casa/Médio)", next: "bairros_lead", meta: "Faixa até 400k" },
              { text: "R$ 400 mil a R$ 800 mil", next: "bairros_lead", meta: "Faixa 400k-800k" },
              { text: "R$ 800 mil a R$ 1.5 Milhão", next: "bairros_lead", meta: "Faixa 800k-1.5M" },
              { text: "Acima de R$ 1.5 Milhão (Alto Padrão)", next: "bairros_lead", meta: "Faixa +1.5M Alto Padrão" }
            ]
          }
        ]
      },
      bairros_lead: {
        botMessages: [
          { text: "Perfeito! E qual região ou perfil de bairro você dá preferência?" },
          { 
            text: "Selecione o estilo de localização que mais combina com seu estilo de vida:",
            quickReplies: [
              { text: "Bairros Nobres / Próximo a Parques", next: "condicao_pagamento", meta: "Região Nobre" },
              { text: "Centro / Próximo ao Trabalho", next: "condicao_pagamento", meta: "Região Central" },
              { text: "Condomínio Fechado com Segurança", next: "condicao_pagamento", meta: "Condomínio Fechado" }
            ]
          }
        ]
      },
      condicao_pagamento: {
        botMessages: [
          { text: "Anotado! Temos 4 opções exatamente com essa configuração no nosso acervo." },
          { 
            text: "Como você pretende conduzir a aquisição?",
            quickReplies: [
              { text: "À Vista / Recursos Próprios", next: "agendar_visita_imovel", meta: "Pagamento: À Vista" },
              { text: "Financiamento Bancário (Tenho Entrada)", next: "agendar_visita_imovel", meta: "Pagamento: Financiamento" },
              { text: "Usar Imóvel/Carro como Permuta", next: "agendar_visita_imovel", meta: "Pagamento: Permuta" }
            ]
          }
        ]
      },
      agendar_visita_imovel: {
        botMessages: [
          { text: "🎯 **Lead Qualificado com Sucesso!** Suas preferências batem perfeitamente com o nosso catálogo." },
          { 
            text: "Nosso especialista sênior de região, **Rogério Mendes**, tem disponibilidade para uma visita presencial ou reunião VIP de apresentação. Qual data fica melhor para você?",
            quickReplies: [
              { text: "Amanhã às 10:00 (Presencial)", next: "confirmacao_lead", meta: "Visita Imóvel: Amanhã 10h" },
              { text: "Quinta às 16:30 (Presencial)", next: "confirmacao_lead", meta: "Visita Imóvel: Qui 16:30" },
              { text: "Sábado às 10:30 (Tour no Decorado)", next: "confirmacao_lead", meta: "Tour Decorado: Sáb 10:30" }
            ]
          }
        ]
      },
      confirmacao_lead: {
        botMessages: [
          { text: "✅ **Visita confirmada na agenda do Rogério!**" },
          { text: "A ficha do seu perfil imobiliário foi encaminhada para a equipe e o endereço com a rota do Waze chegará no seu WhatsApp 1 hora antes da visita. Conte conosco para realizar a melhor compra!" }
        ]
      },
      alugar_fluxo: {
        botMessages: [
          { text: "Alugamos sem fiador e sem burocracia usando aprovação de crédito digital por IA em 15 minutos!" },
          { 
            text: "Deseja ver opções de 1, 2 ou 3 dormitórios?",
            quickReplies: [
              { text: "1 Quarto / Studio Moderno", next: "bairros_lead" },
              { text: "2 ou 3 Quartos com Varanda", next: "bairros_lead" }
            ]
          }
        ]
      },
      investir_fluxo: {
        botMessages: [
          { text: "Excelente momento para investir! Temos unidades com rentabilidade de aluguel por temporada (Airbnb) superior a 0,85% ao mês líquido." },
          { 
            text: "Deseja receber a planilha de projeção de retorno?",
            quickReplies: [
              { text: "Sim, enviar projeção e agendar", next: "agendar_visita_imovel" }
            ]
          }
        ]
      },
      vender_fluxo: {
        botMessages: [
          { text: "Avaliamos seu patrimônio com base nas últimas transações reais de cartório da sua rua." },
          { 
            text: "Podemos agendar a vistoria fotográfica e avaliação de mercado com nosso perito?",
            quickReplies: [
              { text: "Sim, agendar avaliação do imóvel", next: "agendar_visita_imovel" }
            ]
          }
        ]
      }
    }
  },

  advocacia: {
    id: "advocacia",
    name: "Escritório de Advocacia",
    category: "Serviços Jurídicos",
    featured: true,
    tag: "Honorários Altos 🧑‍⚖️",
    botName: "Dra. Helena - Triagem Jurídica",
    businessName: "Menezes & Associados Advocacia",
    avatar: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=150&auto=format&fit=crop&q=80",
    headerStatus: "online • responde em 2 seg",
    heroHeadline: "Triagem da causa, coleta prévia de provas e agendamento de consulta inicial paga.",
    ticketMedio: "R$ 1.500 - R$ 30.000 (Honorários contratuais e sucumbenciais)",
    dorResolvida: "Elimina curiosos que querem 'apenas tirar uma dúvida' e cobra consulta inicial via Pix.",
    backofficeType: "crm",
    stats: {
      totalHoje: 14,
      consultasPagas: "R$ 1.250,00",
      casosAprovados: 8,
      tempoResposta: "1.6s"
    },
    initialSteps: [
      {
        sender: "bot",
        text: "Prezado(a), seja bem-vindo(a) ao escritório **Menezes & Associados Advocacia**.",
        delay: 500
      },
      {
        sender: "bot",
        text: "Sou a **Dra. Helena**, assistente jurídica digital. Realizo a triagem inicial do seu caso com total sigilo profissional (OAB/PR nº 45.890).",
        delay: 1400
      },
      {
        sender: "bot",
        text: "Qual é a área de atuação do seu interesse?",
        delay: 2000,
        quickReplies: [
          { text: "⚖️ Direito do Trabalho (Rescisão/Horas)", next: "trabalhista_triagem" },
          { text: "👨‍👩‍👧 Direito de Família & Sucessões", next: "familia_triagem" },
          { text: "📄 Direito Cível / Contratos / Cobrança", next: "civel_triagem" },
          { text: "🏛️ Direito Tributário & Empresarial", next: "tributario_triagem" }
        ]
      }
    ],
    flows: {
      trabalhista_triagem: {
        botMessages: [
          { text: "Compreendido. Nossas ações trabalhistas defendem os direitos com base na CLT e jurisprudência consolidada." },
          { 
            text: "Para agilizar a análise do advogado titular, qual é a principal situação ocorrida?",
            quickReplies: [
              { text: "Demissão sem justa causa / Verbas não pagas", next: "coleta_tempo", meta: "Trab: Verbas Rescisórias" },
              { text: "Horas extras excessivas não remuneradas", next: "coleta_tempo", meta: "Trab: Horas Extras" },
              { text: "Acidente de Trabalho / Doença Ocupacional", next: "coleta_tempo", meta: "Trab: Acidente/Doença" },
              { text: "Assédio Moral / Pedido de Rescisão Indireta", next: "coleta_tempo", meta: "Trab: Rescisão Indireta" }
            ]
          }
        ]
      },
      coleta_tempo: {
        botMessages: [
          { text: "Entendido. Importante registrar que a prescrição trabalhista é de 2 anos após o término do contrato." },
          { 
            text: "Quanto tempo aproximadamente durou seu vínculo com a empresa?",
            quickReplies: [
              { text: "Menos de 1 ano", next: "agendar_consulta_juridica", meta: "Tempo: < 1 ano" },
              { text: "Entre 1 e 5 anos", next: "agendar_consulta_juridica", meta: "Tempo: 1 a 5 anos" },
              { text: "Mais de 5 anos", next: "agendar_consulta_juridica", meta: "Tempo: > 5 anos" }
            ]
          }
        ]
      },
      familia_triagem: {
        botMessages: [
          { text: "Atuamos com discrição e respeito absoluto aos momentos familiares delicados." },
          { 
            text: "Qual é o objeto da demanda?",
            quickReplies: [
              { text: "Divórcio Consensual ou Litigioso", next: "agendar_consulta_juridica", meta: "Família: Divórcio" },
              { text: "Inventário & Partilha de Bens", next: "agendar_consulta_juridica", meta: "Família: Inventário" },
              { text: "Pensão Alimentícia / Guarda de Filhos", next: "agendar_consulta_juridica", meta: "Família: Pensão/Guarda" }
            ]
          }
        ]
      },
      civel_triagem: {
        botMessages: [
          { 
            text: "Em matéria cível e contratual, qual é o tema da causa?",
            quickReplies: [
              { text: "Quebra de Contrato & Indenização", next: "agendar_consulta_juridica", meta: "Cível: Contratos" },
              { text: "Cobrança de Dívidas / Execução de Títulos", next: "agendar_consulta_juridica", meta: "Cível: Cobrança" },
              { text: "Problemas Imobiliários / Despejo / Usucapião", next: "agendar_consulta_juridica", meta: "Cível: Imobiliário" }
            ]
          }
        ]
      },
      tributario_triagem: {
        botMessages: [
          { text: "Recuperação de créditos tributários e defesa contra execuções fiscais da União, Estado e Município." },
          { 
            text: "Deseja agendar uma reunião técnica de diagnóstico tributário?",
            quickReplies: [
              { text: "Agendar reunião com Dr. Ricardo", next: "agendar_consulta_juridica", meta: "Tributário - Empresarial" }
            ]
          }
        ]
      },
      agendar_consulta_juridica: {
        botMessages: [
          { text: "Excelente. Os dados preliminares foram condensados na ficha de caso nº **#ADV-2026-981**." },
          { 
            text: "Nosso sócio titular atende em formato presencial no escritório ou por videoconferência (Google Meet). Temos horários para esta semana:",
            quickReplies: [
              { text: "Quinta às 16:00 (Videoconferência)", next: "pix_consulta_juridica", meta: "Consulta Online - Qui 16h" },
              { text: "Sexta às 10:30 (Presencial no Escritório)", next: "pix_consulta_juridica", meta: "Consulta Presencial - Sex 10:30" }
            ]
          }
        ]
      },
      pix_consulta_juridica: {
        botMessages: [
          { text: "Horário reservado com o advogado especialista!" },
          { 
            text: "⚖️ Conforme tabela orientativa da OAB e política do escritório, a consulta de parecer jurídico inicial com análise documental tem o valor de **R$ 250,00** (abatido caso você firme o contrato de ação).",
            delay: 1000
          },
          { 
            text: "Deseja efetuar a confirmação via Pix para validar o horário na pauta?",
            quickReplies: [
              { text: "✅ Pagar Consulta R$ 250 no Pix", next: "render_pix", isPixTrigger: true, valor: 250 },
              { text: "💳 Pagar no Cartão de Crédito", next: "render_card", isCardTrigger: true, valor: 250 }
            ]
          }
        ]
      }
    }
  },

  petshop: {
    id: "petshop",
    name: "Pet Shop & Veterinária",
    category: "Pets & Saúde Animal",
    featured: true,
    tag: "Recorrência Alta 🐶",
    botName: "Mel - Assistente Pet",
    businessName: "Dr. Patas Hospital & Pet Care",
    avatar: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&auto=format&fit=crop&q=80",
    headerStatus: "online • responde em 2 seg",
    heroHeadline: "Agendamento por porte de animal, consulta veterinária e vacinação periódica.",
    ticketMedio: "R$ 90 - R$ 800 (Pacotes de banho, exames e cirurgias)",
    dorResolvida: "Organiza a fila de tosa nos fins de semana e lembra os tutores da vacina anual.",
    backofficeType: "agenda",
    stats: {
      totalHoje: 32,
      agendamentosConfirmados: 28,
      taxaTaxiDog: "14 corridas",
      tempoResposta: "1.7s"
    },
    initialSteps: [
      {
        sender: "bot",
        text: "Au au! Seja muito bem-vindo ao **Dr. Patas Pet Care**! 🐾🐶🐱",
        delay: 500
      },
      {
        sender: "bot",
        text: "Sou a **Mel**, assistente virtual apaixonada por bichinhos. Como posso cuidar do seu melhor amigo hoje?",
        delay: 1300,
        quickReplies: [
          { text: "🛁 Banho & Tosa Estética", next: "banho_porte" },
          { text: "🩺 Consulta com Médico Veterinário", next: "vet_consulta" },
          { text: "💉 Vacinação (V10, Raiva, Gripe)", next: "vacinas_info" },
          { text: "🚗 Agendar Táxi Dog (Busca e Leva)", next: "taxi_dog" }
        ]
      }
    ],
    flows: {
      banho_porte: {
        botMessages: [
          { text: "Que delícia! Nada melhor que um pet cheiroso e com pelos macios! 🛁✨" },
          { 
            text: "Qual é o porte do seu pet?",
            quickReplies: [
              { text: "Porte Pequeno (até 10kg - ex: Shih Tzu, Poodle)", next: "horario_banho", meta: "Porte Pequeno" },
              { text: "Porte Médio (10 a 25kg - ex: Cocker, Beagle)", next: "horario_banho", meta: "Porte Médio" },
              { text: "Porte Grande (acima de 25kg - ex: Golden, Labrador)", next: "horario_banho", meta: "Porte Grande" },
              { text: "Gatinho Felino (Banho seco / suave)", next: "horario_banho", meta: "Felino" }
            ]
          }
        ]
      },
      horario_banho: {
        botMessages: [
          { text: "Excelente! Nossos pacotes incluem hidratação com óleo de argan, corte de unhas e limpeza auricular sem estresse." },
          { 
            text: "Selecione o melhor dia:",
            quickReplies: [
              { text: "Sexta-feira às 10:00", next: "pix_pet", meta: "Banho & Tosa - Sex 10:00" },
              { text: "Sábado às 09:30 (Horário Nobre)", next: "pix_pet", meta: "Banho & Tosa - Sáb 09:30" },
              { text: "Sábado às 14:00", next: "pix_pet", meta: "Banho & Tosa - Sáb 14:00" }
            ]
          }
        ]
      },
      vet_consulta: {
        botMessages: [
          { text: "Nossa clínica conta com centro cirúrgico, ultrassom e exames laboratoriais na hora." },
          { 
            text: "Seu pet está apresentando algum sintoma específico (vômito, coceira, apatia) ou é consulta de rotina?",
            quickReplies: [
              { text: "Apresenta sintoma / Precisa de remédio", next: "agendar_vet", meta: "Vet: Sintoma Clínico" },
              { text: "Consulta preventiva de rotina / Checkup", next: "agendar_vet", meta: "Vet: Checkup Preventivo" }
            ]
          }
        ]
      },
      agendar_vet: {
        botMessages: [
          { 
            text: "Dra. Juliana (Clínica Geral) tem horários disponíveis hoje e amanhã:",
            quickReplies: [
              { text: "Hoje às 16:30", next: "pix_pet", meta: "Consulta Vet - Hoje 16:30" },
              { text: "Amanhã às 11:00", next: "pix_pet", meta: "Consulta Vet - Amanhã 11h" }
            ]
          }
        ]
      },
      vacinas_info: {
        botMessages: [
          { text: "Trabalhamos com vacinas importadas Vanguard e Nobivac, garantindo 100% de sorologia e imunidade." },
          { 
            text: "Podemos agendar a aplicação com carimbo na carteirinha digital?",
            quickReplies: [
              { text: "Sim, agendar vacinação", next: "agendar_vet" }
            ]
          }
        ]
      },
      taxi_dog: {
        botMessages: [
          { text: "Nosso veículo é climatizado com caixas de transporte higienizadas após cada viagem. Buscamos e entregamos na porta da sua casa com total segurança!" },
          { 
            text: "Vamos agendar o banho com Táxi Dog incluso?",
            quickReplies: [
              { text: "Sim, agendar com Táxi Dog", next: "banho_porte" }
            ]
          }
        ]
      },
      pix_pet: {
        botMessages: [
          { text: "Agendamento quase concluído! 🐾" },
          { 
            text: "O valor da sessão com produtos hipoalergênicos é de **R$ 85,00**. Deseja garantir a vaga agora via Pix ou Cartão?",
            quickReplies: [
              { text: "✅ Pagar R$ 85 no Pix", next: "render_pix", isPixTrigger: true, valor: 85 },
              { text: "💳 Pagar no Cartão de Crédito", next: "render_card", isCardTrigger: true, valor: 85 }
            ]
          }
        ]
      }
    }
  },

  mecanica: {
    id: "mecanica",
    name: "Oficina Mecânica & Auto Center",
    category: "Serviços Automotivos",
    featured: true,
    tag: "Orçamentos Ágeis 🔧",
    botName: "Beto - Técnico Digital",
    businessName: "AutoCenter Express & Manutenção",
    avatar: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=150&auto=format&fit=crop&q=80",
    headerStatus: "online • responde em 2 seg",
    heroHeadline: "Diagnóstico inicial, triagem de sintomas, envio de fotos e agendamento de box.",
    ticketMedio: "R$ 400 - R$ 3.500 (Revisões, suspensão e freios)",
    dorResolvida: "Mecânicos com as mãos sujas na oficina não perdem clientes que pedem orçamento no WhatsApp.",
    backofficeType: "agenda",
    stats: {
      totalHoje: 19,
      boxesOcupados: "6 de 8",
      faturamentoHoje: "R$ 4.890",
      tempoResposta: "1.9s"
    },
    initialSteps: [
      {
        sender: "bot",
        text: "Fala aí! Tudo bem? Bem-vindo à **AutoCenter Express**! 🚗🔧",
        delay: 500
      },
      {
        sender: "bot",
        text: "Sou o **Beto**, atendente digital da oficina. Agilizo seu diagnóstico para você não perder tempo.",
        delay: 1300
      },
      {
        sender: "bot",
        text: "Como posso te ajudar com o seu carro hoje?",
        delay: 2000,
        quickReplies: [
          { text: "🛑 Barulho no Freio / Pastilha", next: "freio_fluxo" },
          { text: "🔩 Barulho na Suspensão / Amortecedor", next: "suspensao_fluxo" },
          { text: "🛢️ Troca de Óleo & Filtros", next: "oleo_fluxo" },
          { text: "❄️ Higienização de Ar-Condicionado", next: "ar_fluxo" }
        ]
      }
    ],
    flows: {
      freio_fluxo: {
        botMessages: [
          { text: "Freio é segurança vital! Se está chiando ou com pedal baixo, pastilhas e discos precisam de medição no paquímetro com urgência." },
          { 
            text: "Qual é a marca e modelo do seu veículo?",
            quickReplies: [
              { text: "Chevrolet / Onix / Tracker", next: "agendar_box_mecanica", meta: "Carro: GM" },
              { text: "Volkswagen / Gol / Polo / T-Cross", next: "agendar_box_mecanica", meta: "Carro: VW" },
              { text: "Fiat / Strada / Argo / Toro", next: "agendar_box_mecanica", meta: "Carro: Fiat" },
              { text: "Outra Marca / Importado", next: "agendar_box_mecanica", meta: "Carro: Outro" }
            ]
          }
        ]
      },
      suspensao_fluxo: {
        botMessages: [
          { text: "Batidas secas ao passar em lombadas ou estalos ao esterçar indicam buchas, pivôs ou amortecedores desgastados." },
          { 
            text: "Temos elevador livre para teste de folga e alinhamento a laser. Vamos agendar o diagnóstico gratuito?",
            quickReplies: [
              { text: "Sim, agendar teste de suspensão", next: "agendar_box_mecanica", meta: "Diagnóstico de Suspensão" }
            ]
          }
        ]
      },
      oleo_fluxo: {
        botMessages: [
          { text: "Trabalhamos com óleos sintéticos originais homologados (Motul, Castrol, Mobil) com troca do anel de vedação e filtro de cortesia." },
          { 
            text: "A troca rápida leva cerca de 25 minutos. Deseja agendar?",
            quickReplies: [
              { text: "Sim, agendar troca de óleo rápida", next: "agendar_box_mecanica", meta: "Troca de Óleo Rápida" }
            ]
          }
        ]
      },
      ar_fluxo: {
        botMessages: [
          { text: "Nosso combo inclui troca do filtro de cabine antipólen + oxi-sanitização com gerador de ozônio que elimina 99% de fungos e bactérias." },
          { 
            text: "Valor promocional de **R$ 149,00**. Deseja reservar seu horário?",
            quickReplies: [
              { text: "Sim, agendar ar-condicionado", next: "agendar_box_mecanica", meta: "Ar-Condicionado Oxi-sanitização" }
            ]
          }
        ]
      },
      agendar_box_mecanica: {
        botMessages: [
          { text: "Ótimo! Nosso box com elevador está liberado nos seguintes horários:" },
          { 
            text: "Selecione o melhor horário para deixar o veículo:",
            quickReplies: [
              { text: "Amanhã às 08:30 (Primeira hora)", next: "pix_mecanica", meta: "Mecânica - Amanhã 08:30" },
              { text: "Amanhã às 14:00 (Período da tarde)", next: "pix_mecanica", meta: "Mecânica - Amanhã 14:00" },
              { text: "Sábado às 09:00", next: "pix_mecanica", meta: "Mecânica - Sáb 09:00" }
            ]
          }
        ]
      },
      pix_mecanica: {
        botMessages: [
          { text: "Box nº 3 pré-reservado no sistema da oficina!" },
          { 
            text: "Para garantir a reserva da vaga e separar as peças de reposição, solicitamos a confirmação da taxa de agendamento de **R$ 50,00** (abatida na mão de obra do serviço).",
            quickReplies: [
              { text: "✅ Pagar R$ 50 no Pix agora", next: "render_pix", isPixTrigger: true, valor: 50 },
              { text: "💳 Pagar no Cartão de Crédito", next: "render_card", isCardTrigger: true, valor: 50 }
            ]
          }
        ]
      }
    }
  },

  pizzaria: {
    id: "pizzaria",
    name: "Pizzaria Artesanal",
    category: "Gastronomia & Delivery",
    featured: false,
    tag: "Delivery & Mesas 🍕",
    botName: "Luigi - Pizzaiolo Virtual",
    businessName: "Bella Pizza Forno a Lenha",
    avatar: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=80",
    headerStatus: "online • responde em 2 seg",
    heroHeadline: "Montagem de pizzas meio a meio, bordas recheadas, delivery e mesas.",
    ticketMedio: "R$ 75 - R$ 160",
    dorResolvida: "Atende 200 clientes simultâneos nas noites de sábado sem deixar ninguém esperando no WhatsApp.",
    backofficeType: "kds",
    stats: {
      totalHoje: 48,
      pizzasNoForno: 6,
      faturamentoDelivery: "R$ 3.940",
      tempoResposta: "1.2s"
    },
    initialSteps: [
      {
        sender: "bot",
        text: "Buonasera! Seja muito bem-vindo à **Bella Pizza Forno a Lenha**! 🍕🔥",
        delay: 500
      },
      {
        sender: "bot",
        text: "Sou o **Luigi**, seu atendente digital. Nossa massa descansa por 48h com fermentação natural italiana!",
        delay: 1300
      },
      {
        sender: "bot",
        text: "Como gostaria do seu pedido hoje?",
        delay: 2000,
        quickReplies: [
          { text: "🛵 Pedir Delivery em Casa", next: "sabores_pizza" },
          { text: "🍽️ Reservar Mesa no Salão", next: "reserva_mesa_pizza" },
          { text: "📦 Retirar no Balcão com 10% OFF", next: "sabores_pizza" }
        ]
      }
    ],
    flows: {
      sabores_pizza: {
        botMessages: [
          { text: "Perfetto! Qual sabor ou combinação você deseja na Pizza Grande (8 fatias)?" },
          { 
            text: "Selecione a opção desejada:",
            quickReplies: [
              { text: "Meio Calabresa Especial / Meio 4 Queijos (R$ 78)", next: "borda_pizza", meta: "Pizza 1/2 Calabresa 1/2 4Queijos" },
              { text: "Inteira Frango com Catupiry Original (R$ 74)", next: "borda_pizza", meta: "Pizza Frango Catupiry" },
              { text: "Inteira Parma com Rúcula & Tomate Seco (R$ 86)", next: "borda_pizza", meta: "Pizza Parma Rúcula" }
            ]
          }
        ]
      },
      borda_pizza: {
        botMessages: [
          { 
            text: "Deseja adicionar nossa tradicional borda recheada vulcão?",
            quickReplies: [
              { text: "Sim, Borda Catupiry (+ R$ 12)", next: "bebidas_pizza", meta: "+ Borda Catupiry" },
              { text: "Sim, Borda Cheddar (+ R$ 12)", next: "bebidas_pizza", meta: "+ Borda Cheddar" },
              { text: "Borda Tradicional Crocante (Sem custo)", next: "bebidas_pizza", meta: "Borda Tradicional" }
            ]
          }
        ]
      },
      bebidas_pizza: {
        botMessages: [
          { 
            text: "Deseja acrescentar bebidas bem geladas para acompanhar?",
            quickReplies: [
              { text: "Coca-Cola 2 Litros (+ R$ 14)", next: "fechar_pedido_pizza", meta: "+ Coca 2L" },
              { text: "Guaraná Antarctica 2L (+ R$ 12)", next: "fechar_pedido_pizza", meta: "+ Guaraná 2L" },
              { text: "Sem bebida, apenas a pizza", next: "fechar_pedido_pizza", meta: "Sem bebida" }
            ]
          }
        ]
      },
      fechar_pedido_pizza: {
        botMessages: [
          { text: "Mamma mia, pedido excelente! Já enviei para a fila de preparo da cozinha." },
          { 
            text: "Total do pedido com taxa de entrega inclusa: **R$ 90,00**. Tempo estimado: 35 a 45 minutos. Como prefere pagar?",
            quickReplies: [
              { text: "✅ Pagar R$ 90 via Pix", next: "render_pix", isPixTrigger: true, valor: 90 },
              { text: "💳 Pagar no Cartão de Crédito", next: "render_card", isCardTrigger: true, valor: 90 }
            ]
          }
        ]
      },
      reserva_mesa_pizza: {
        botMessages: [
          { text: "Adoramos receber você e sua família no nosso salão com música ambiente e adega!" },
          { 
            text: "Quantas pessoas e qual horário para hoje à noite?",
            quickReplies: [
              { text: "Mesa para 2 a 4 pessoas (20:00)", next: "confirmar_mesa", meta: "Mesa 4 pessoas - 20h" },
              { text: "Mesa para 6 a 8 pessoas (20:30)", next: "confirmar_mesa", meta: "Mesa 8 pessoas - 20:30" }
            ]
          }
        ]
      },
      confirmar_mesa: {
        botMessages: [
          { text: "✅ **Mesa reservada com sucesso!** Já colocamos a plaquinha com o seu nome. Esperamos vocês a partir das 20h!" }
        ]
      }
    }
  },

  hamburgueria: {
    id: "hamburgueria",
    name: "Hamburgueria Artesanal",
    category: "Gastronomia & Delivery",
    featured: false,
    tag: "Smash Burger 🍔",
    botName: "SmashBot - Atendimento Grill",
    businessName: "Burger Smash & Grill Co.",
    avatar: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=150&auto=format&fit=crop&q=80",
    headerStatus: "online • responde em 2 seg",
    heroHeadline: "Combos, personalização de lanches, adicionais e agendamento de retirada.",
    ticketMedio: "R$ 45 - R$ 95",
    dorResolvida: "Aumenta ticket médio em 28% sugerindo bacon extra, batata trufada e milkshake na hora certa.",
    backofficeType: "kds",
    stats: {
      totalHoje: 62,
      burgersNaChapa: 8,
      ticketMedioHoje: "R$ 64,50",
      tempoResposta: "1.1s"
    },
    initialSteps: [
      {
        sender: "bot",
        text: "E aí! Beleza? Bem-vindo ao **Burger Smash & Grill Co.**! 🍔🔥",
        delay: 500
      },
      {
        sender: "bot",
        text: "Sou o **SmashBot**. Nossos burgers são prensados na chapa de ferro fundido a 300°C com crostinha crocante ultra saborosa!",
        delay: 1300
      },
      {
        sender: "bot",
        text: "O que você vai querer detonar hoje?",
        delay: 2000,
        quickReplies: [
          { text: "🔥 Combo Duplo Bacon Smash (Burger + Batata + Refri)", next: "combo_bacon" },
          { text: "🧀 Trufado Cheese Melt Burger", next: "trufado_burger" },
          { text: "🍟 Batata Crinkle com Cheddar & Bacon", next: "batata_extra" }
        ]
      }
    ],
    flows: {
      combo_bacon: {
        botMessages: [
          { text: "Nosso campeão de vendas! 2 carnes smash de 100g de angus, cheddar inglês derretido, fatias crocantes de bacon e maionese secreta da casa. 🥓🧀" },
          { 
            text: "Deseja turbinar seu combo com adicionais?",
            quickReplies: [
              { text: "+ Bacon em dobro crocante (+ R$ 6)", next: "ponto_carne", meta: "+ Bacon Dobro" },
              { text: "+ Queijo Cheddar extra (+ R$ 5)", next: "ponto_carne", meta: "+ Cheddar Extra" },
              { text: "Combo padrão sem adicionais", next: "ponto_carne", meta: "Padrão" }
            ]
          }
        ]
      },
      trufado_burger: {
        botMessages: [
          { text: "Burger artesanal com queijo brie empanado crocante e azeite trufado branco no pão brioche amanteigado! 🤤" },
          { 
            text: "Deseja adicionar Batata Frita Individual por apenas R$ 9,90?",
            quickReplies: [
              { text: "Sim, quero com batatinha crocante", next: "ponto_carne", meta: "+ Batata" },
              { text: "Apenas o burger individual", next: "ponto_carne", meta: "Apenas Burger" }
            ]
          }
        ]
      },
      batata_extra: {
        botMessages: [
          { text: "Porção generosa para compartilhar, coberta com fondue de cheddar artesanal e farofa de bacon defumado." },
          { 
            text: "Vamos acrescentar um Smash Burger simples para completar?",
            quickReplies: [
              { text: "Sim, adicionar Smash Clássico", next: "combo_bacon" }
            ]
          }
        ]
      },
      ponto_carne: {
        botMessages: [
          { 
            text: "Como você prefere a entrega do seu pedido?",
            quickReplies: [
              { text: "🛵 Delivery Express (30 a 40 min)", next: "fechar_burger", meta: "Delivery Express" },
              { text: "🏃 Retirada Agendada no Balcão (15 min)", next: "fechar_burger", meta: "Retirada Balcão" }
            ]
          }
        ]
      },
      fechar_burger: {
        botMessages: [
          { text: "Pedido fechado! O chapeiro já acendeu o fogo e está preparando seu smash." },
          { 
            text: "Valor total do pedido: **R$ 58,00**. Escolha a forma de pagamento:",
            quickReplies: [
              { text: "✅ Pagar R$ 58 no Pix agora", next: "render_pix", isPixTrigger: true, valor: 58 },
              { text: "💳 Pagar no Cartão de Crédito", next: "render_card", isCardTrigger: true, valor: 58 }
            ]
          }
        ]
      }
    }
  }
};
