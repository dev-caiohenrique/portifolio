/* ==========================================================================
   DADOS DOS PROJETOS (DOCUMENTAÇÃO INTERNA COMPLETA)
   ========================================================================== */
const projectData = {
    "agrogestor": {
        title: "Agrogestor",
        tags: ["Java", "P.O.O.", "SQLite"],
        "visao-geral": `
            <h4 class="pane-title">Gestão Agropecuária Estruturada</h4>
            <p class="pane-text">
                O <strong>Agrogestor</strong> é um sistema desktop desenvolvido para auxiliar pequenos e médios produtores rurais a gerenciarem suas propriedades. O foco principal está na centralização de dados financeiros, controle de rebanho e insumos, com foco em simplicidade de uso e consistência das informações.
            </p>
            <p class="pane-text">
                O projeto foi estruturado utilizando conceitos avançados de Programação Orientada a Objetos para garantir que cada entidade do domínio agropecuário (como Animais, Insumos, Transações e Colaboradores) tenha responsabilidades únicas e extensíveis.
            </p>
            <h5 class="pane-title" style="font-size: 1.1rem; margin-top: 20px;">Principais Funcionalidades</h5>
            <ul class="pane-list">
                <li><strong>Controle de Fluxo de Caixa:</strong> Registro detalhado de receitas e despesas com categorização automática.</li>
                <li><strong>Persistência Segura:</strong> Armazenamento local robusto em banco de dados SQLite com transações atômicas.</li>
                <li><strong>Gestão de Ativos:</strong> Controle patrimonial de maquinários e rebanho com cálculo de depreciação.</li>
                <li><strong>Relatórios Estatísticos:</strong> Emissão de relatórios em formato texto para tomada de decisões imediatas.</li>
            </ul>
        `,
        "arquitetura": `
            <h4 class="pane-title">Arquitetura de Camadas (Layered Architecture)</h4>
            <p class="pane-text">
                O sistema adota a arquitetura em camadas clássica (MVC / Data Mapper adaptado), garantindo o desacoplamento entre a interface com o usuário, a lógica de negócios complexa e o mecanismo de acesso ao banco de dados.
            </p>
            <div class="arch-diagram">
                <pre style="color: var(--accent); font-size: 0.85rem; line-height: 1.4;">
[ Interface CLI / Swing ]
         │
         ▼
[ Camada de Controle / Controllers ]
         │
         ▼
[ Camada de Serviço (Regras de Negócio) ]
         │
         ▼
[ Acesso a Dados / Repositories (DAO) ]
         │
         ▼
[ Banco de Dados SQLite ]</pre>
            </div>
            <p class="pane-text">
                <strong>Vantagens da escolha arquitetural:</strong>
            </p>
            <ul class="pane-list">
                <li><strong>Manutenibilidade:</strong> Alterações nas regras de cálculo financeiro ocorrem apenas na camada de serviço, sem impactar a persistência ou a UI.</li>
                <li><strong>Substituibilidade do Banco:</strong> A abstração da interface do repositório permite migrar do SQLite para o PostgreSQL sem alterar o restante da aplicação.</li>
            </ul>
        `,
        "codigo": `
            <h4 class="pane-title">Implementação do Padrão Repository</h4>
            <p class="pane-text" style="margin-bottom: 12px;">Veja abaixo um trecho real da camada de persistência de dados utilizando o padrão Repository com JDBC:</p>
            <div class="code-window">
                <div class="code-header">
                    <div class="code-dots">
                        <span class="code-dot dot-red"></span>
                        <span class="code-dot dot-yellow"></span>
                        <span class="code-dot dot-green"></span>
                    </div>
                    <span class="code-filename">TransacaoRepository.java</span>
                </div>
                <div class="code-content-wrapper">
                    <pre class="code-pre"><code><span class="kwd">public class</span> <span class="cls">TransacaoRepository</span> <span class="kwd">implements</span> <span class="cls">IRepository</span>&lt;<span class="cls">Transacao</span>&gt; {
    <span class="kwd">private final</span> <span class="cls">Connection</span> connection;

    <span class="kwd">public</span> <span class="fn">TransacaoRepository</span>(<span class="cls">Connection</span> connection) {
        <span class="kwd">this</span>.connection = connection;
    }

    <span class="com">@Override</span>
    <span class="kwd">public void</span> <span class="fn">salvar</span>(<span class="cls">Transacao</span> transacao) <span class="kwd">throws</span> <span class="cls">SQLException</span> {
        <span class="cls">String</span> sql = <span class="str">"INSERT INTO transacoes (descricao, valor, tipo, data) VALUES (?, ?, ?, ?)"</span>;
        
        <span class="com">// Gerenciamento automático de recursos com try-with-resources</span>
        <span class="kwd">try</span> (<span class="cls">PreparedStatement</span> stmt = connection.prepareStatement(sql)) {
            stmt.setString(<span class="num">1</span>, transacao.getDescricao());
            stmt.setDouble(<span class="num">2</span>, transacao.getValor());
            stmt.setString(<span class="num">3</span>, transacao.getTipo().name());
            stmt.setDate(<span class="num">4</span>, <span class="cls">Date</span>.valueOf(transacao.getData()));
            
            stmt.executeUpdate();
        }
    }
}</code></pre>
                </div>
            </div>
        `,
        "desafios": `
            <h4 class="pane-title">Desafios Técnicos & Soluções Aplicadas</h4>
            <p class="pane-text">
                Durante o desenvolvimento do Agrogestor, surgiram desafios clássicos de engenharia de software que exigiram a aplicação de boas práticas de design:
            </p>
            <ul class="pane-list">
                <li>
                    <strong>Desafio 1: Concorrência e Conexões Simultâneas no SQLite</strong><br>
                    <em>Causa:</em> SQLite bloqueia o banco de dados durante operações de escrita simultâneas, resultando em exceções do tipo <code>database locked</code>.<br>
                    <strong style="color: var(--accent);">Solução:</strong> Implementação do padrão <strong>Singleton</strong> para gerenciar a instância de conexão JDBC de forma única e centralizada, garantindo acesso sequencial.
                </li>
                <li>
                    <strong>Desafio 2: Extensibilidade de Tipos de Manejo</strong><br>
                    <em>Causa:</em> Cada fazenda gerencia tipos diferentes de animais e plantações, cada qual exigindo regras fiscais e sanitárias específicas.<br>
                    <strong style="color: var(--accent);">Solução:</strong> Utilização avançada de <strong>Polimorfismo</strong> e interfaces comuns. Criamos classes base com especializações dinâmicas, permitindo adicionar novas categorias de ativos sem modificar a lógica central de balanços.
                </li>
            </ul>
        `
    },
    "nexus-api": {
        title: "Nexus API Gateway",
        tags: ["Node.js", "TypeScript", "PostgreSQL"],
        "visao-geral": `
            <h4 class="pane-title">Gateway de Pagamentos e Telemetria</h4>
            <p class="pane-text">
                A <strong>Nexus API</strong> é uma solução de gateway de pagamento fictícia desenvolvida para suportar transações financeiras assíncronas com alta performance. É ideal para sistemas integrados que necessitam de respostas em milissegundos e alto controle de concorrência.
            </p>
            <p class="pane-text">
                Construído em TypeScript para garantir a consistência das tipagens de entrada de transações e mitigar bugs lógicos antes do deploy.
            </p>
            <h5 class="pane-title" style="font-size: 1.1rem; margin-top: 20px;">Recursos</h5>
            <ul class="pane-list">
                <li>Validação estrita de contratos de entrada utilizando schemas dinâmicos.</li>
                <li>Persistência relacional otimizada com indexações complexas no PostgreSQL.</li>
                <li>Arquitetura modular dividida por domínios.</li>
            </ul>
        `,
        "arquitetura": `
            <h4 class="pane-title">Arquitetura Limpa (Clean Architecture)</h4>
            <p class="pane-text">
                O backend do projeto foi desenhado sob os preceitos da Clean Architecture, com isolamento estrito de domínios (Entities, Use Cases, Controllers e Presenters).
            </p>
            <div class="arch-diagram">
                <pre style="color: var(--accent); font-size: 0.85rem; line-height: 1.4;">
[ Clientes HTTP ] ---> [ Express Adapters ] 
                               │
                               ▼
                    [ Use Cases (Regras) ]
                               │
                               ▼
                    [ Database Repositories ]</pre>
            </div>
            <p class="pane-text">
                Isso assegura que nenhuma biblioteca externa ou framework acesse diretamente a lógica de negócios principal da transação de pagamento.
            </p>
        `,
        "codigo": `
            <h4 class="pane-title">Contrato de Negócio em TypeScript</h4>
            <p class="pane-text" style="margin-bottom: 12px;">Demonstração de encapsulamento e injeção de dependência na validação de serviço:</p>
            <div class="code-window">
                <div class="code-header">
                    <div class="code-dots">
                        <span class="code-dot dot-red"></span>
                        <span class="code-dot dot-yellow"></span>
                        <span class="code-dot dot-green"></span>
                    </div>
                    <span class="code-filename">PaymentService.ts</span>
                </div>
                <div class="code-content-wrapper">
                    <pre class="code-pre"><code><span class="kwd">import</span> { <span class="cls">IPaymentGateway</span>, <span class="cls">Transaction</span> } <span class="kwd">from</span> <span class="str">"../interfaces"</span>;

<span class="kwd">export class</span> <span class="cls">PaymentService</span> {
    <span class="kwd">constructor</span>(<span class="kwd">private</span> gateway: <span class="cls">IPaymentGateway</span>) {}

    <span class="kwd">public async</span> <span class="fn">processPayment</span>(transaction: <span class="cls">Transaction</span>): <span class="cls">Promise</span>&lt;<span class="cls">Response</span>&gt; {
        <span class="kwd">if</span> (transaction.amount &lt;= <span class="num">0</span>) {
            <span class="kwd">throw new</span> <span class="cls">Error</span>(<span class="str">"Valor de transação inválido"</span>);
        }
        
        <span class="com">// Executa gateway externo desacoplado</span>
        <span class="kwd">return await this</span>.gateway.<span class="fn">authorize</span>(transaction);
    }
}</code></pre>
                </div>
            </div>
        `,
        "desafios": `
            <h4 class="pane-title">Desafios de Escala e Integração</h4>
            <p class="pane-text">
                <strong>Consistência Eventual e Redundância de Rede:</strong>
            </p>
            <p class="pane-text">
                Durante oscilações de APIs bancárias parceiras, transações falhavam silenciosamente. Resolvemos isso implementando uma fila de retry automática com atraso exponencial (Exponential Backoff), garantindo que dados inconsistentes fossem reprocessados sem travar a thread principal da aplicação Node.js.
            </p>
        `
    },
    "smart-dashboard": {
        title: "Smart Dashboard",
        tags: ["React", "TypeScript", "Chart.js"],
        "visao-geral": `
            <h4 class="pane-title">Painel de Métricas Financeiras</h4>
            <p class="pane-text">
                O <strong>Smart Dashboard</strong> é uma interface administrativa focada na exibição simplificada e em tempo real de KPI's (Key Performance Indicators) corporativos.
            </p>
            <p class="pane-text">
                Criado para dar suporte a gestores que necessitam monitorar taxas de conversão de leads, receita recorrente mensal (MRR) e métricas de desempenho de servidores.
            </p>
            <h5 class="pane-title" style="font-size: 1.1rem; margin-top: 20px;">Destaques visuais</h5>
            <ul class="pane-list">
                <li>Interface responsiva em grid com cards redimensionáveis.</li>
                <li>Design de alto nível aplicando glassmorphism suave.</li>
                <li>Renderização reativa e sem latência perceptível no carregamento dos dados.</li>
            </ul>
        `,
        "arquitetura": `
            <h4 class="pane-title">Fluxo Unidirecional de Estado</h4>
            <p class="pane-text">
                A UI se comunica com hooks customizados que encapsulam chamadas Websocket. Quando novos dados chegam, o estado é atualizado reativamente, forçando atualizações pontuais e minimizando re-renderizações desnecessárias.
            </p>
        `,
        "codigo": `
            <h4 class="pane-title">Custom Hooks reativos para WebSocket</h4>
            <p class="pane-text" style="margin-bottom: 12px;">Hook estruturado em TypeScript para assinar atualizações de telemetria em tempo real:</p>
            <div class="code-window">
                <div class="code-header">
                    <div class="code-dots">
                        <span class="code-dot dot-red"></span>
                        <span class="code-dot dot-yellow"></span>
                        <span class="code-dot dot-green"></span>
                    </div>
                    <span class="code-filename">useLiveMetrics.ts</span>
                </div>
                <div class="code-content-wrapper">
                    <pre class="code-pre"><code><span class="kwd">import</span> { <span class="cls">useState</span>, <span class="cls">useEffect</span> } <span class="kwd">from</span> <span class="str">'react'</span>;
<span class="kwd">import</span> { <span class="cls">Socket</span> } <span class="kwd">from</span> <span class="str">'socket.io-client'</span>;

<span class="kwd">export function</span> <span class="fn">useLiveMetrics</span>(socket: <span class="cls">Socket</span>) {
    <span class="kwd">const</span> [metrics, setMetrics] = <span class="fn">useState</span>&lt;<span class="cls">Data</span>[]&gt;([]);

    <span class="fn">useEffect</span>(() =&gt; {
        socket.<span class="fn">on</span>(<span class="str">'metrics-update'</span>, (newData: <span class="cls">Data</span>) => {
            <span class="fn">setMetrics</span>(prev =&gt; [...prev.<span class="fn">slice</span>(-<span class="num">20</span>), newData]);
        });
        
        <span class="kwd">return</span> () =&gt; { socket.<span class="fn">off</span>(<span class="str">'metrics-update'</span>); };
    }, [socket]);

    <span class="kwd">return</span> metrics;
}</code></pre>
                </div>
            </div>
        `,
        "desafios": `
            <h4 class="pane-title">Desafios de Performance de Interface</h4>
            <p class="pane-text">
                Ao renderizar mais de 60 atualizações por segundo sob múltiplos gráficos circulares, o navegador sofria com quedas drásticas de FPS.
            </p>
            <p class="pane-text">
                <strong style="color: var(--accent);">Solução:</strong> Implementamos o estrangulamento (throttling) dos eventos que alteravam o estado da página e utilizamos a propriedade CSS <code>will-change</code> para acelerar a renderização gráfica via GPU de forma otimizada.
            </p>
        `
    }
};

/* ==========================================================================
   INICIALIZAÇÃO DAS INTERAÇÕES DE PÁGINA
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. MENU RESPONSIVO MOBILE ---
    const mobileToggle = document.querySelector(".mobile-nav-toggle");
    const nav = document.querySelector(".nav");
    
    mobileToggle.addEventListener("click", () => {
        const isOpen = nav.classList.contains("open");
        nav.classList.toggle("open");
        mobileToggle.setAttribute("aria-expanded", !isOpen);
    });

    // Fechar menu mobile ao clicar em um link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            mobileToggle.setAttribute("aria-expanded", "false");
        });
    });

    // --- 2. DESTAQUES ATIVOS DO MENU CONFORME SCROLL (IntersectionObserver) ---
    const sections = document.querySelectorAll("section");
    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px", // Margem ajustada para melhor transição
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // --- 3. EFEITO HOVER SPOTLIGHT (MIRA DE LUZ) NOS CARDS DE PROJETO ---
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--x", `${x}px`);
            card.style.setProperty("--y", `${y}px`);
        });
    });

    // --- 4. CONTROLE DOS MODAIS INTERNOS DE PROJETO ---
    const modal = document.getElementById("project-modal");
    const closeBtn = document.getElementById("modal-close-btn");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");
    const modalTags = document.getElementById("modal-tags");
    const modalTitle = document.getElementById("modal-title");
    
    let activeProjectId = null;
    let lastFocusedElement = null; // Para retornar o foco após fechar o modal

    // Função para renderizar conteúdo dinâmico da aba selecionada
    function renderTabContent(projectId, tabName) {
        const data = projectData[projectId];
        if (!data) return;

        const paneId = `tab-${tabName}`;
        const pane = document.getElementById(paneId);
        
        if (pane) {
            pane.innerHTML = data[tabName] || "<p class='pane-text'>Conteúdo em desenvolvimento.</p>";
        }
    }

    // Função para alternar de aba dentro do modal
    function switchTab(tabButton) {
        const targetTabName = tabButton.getAttribute("data-tab");
        
        tabButtons.forEach(btn => btn.classList.remove("active"));
        tabPanes.forEach(pane => pane.classList.remove("active"));
        
        tabButton.classList.add("active");
        
        const targetPane = document.getElementById(`tab-${targetTabName}`);
        if (targetPane) {
            targetPane.classList.add("active");
        }
        
        if (activeProjectId) {
            renderTabContent(activeProjectId, targetTabName);
        }
    }

    // Adiciona evento de clique nas abas
    tabButtons.forEach(button => {
        button.addEventListener("click", () => switchTab(button));
    });

    // Abrir modal ao clicar em um card de projeto
    projectCards.forEach(card => {
        const openModal = () => {
            const projectId = card.getAttribute("data-project");
            const data = projectData[projectId];
            
            if (!data) return;
            
            lastFocusedElement = document.activeElement;
            activeProjectId = projectId;

            // Preenche o cabeçalho do modal
            modalTitle.textContent = data.title;
            modalTags.innerHTML = data.tags.map(tag => `<span class="project-tag">${tag}</span>`).join("");

            // Ativa por padrão a aba "Visão Geral"
            const defaultTab = document.querySelector(".tab-btn[data-tab='visao-geral']");
            switchTab(defaultTab);

            // Exibe o modal com transição suave
            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
            
            // Focar no botão de fechar para acessibilidade
            closeBtn.focus();
        };

        card.addEventListener("click", openModal);
        
        // Suporte a teclado (Abrir com Enter)
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                openModal();
            }
        });
    });

    // Função para fechar o modal
    const closeModal = () => {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        activeProjectId = null;

        // Retorna o foco para o elemento que abriu o modal
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };

    closeBtn.addEventListener("click", closeModal);

    // Fechar ao clicar na área escura (overlay)
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fechar com a tecla ESC e controle de foco por teclado
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }

        // Trap Focus dentro do modal para acessibilidade
        if (e.key === "Tab" && modal.classList.contains("active")) {
            const focusableElements = modal.querySelectorAll('button, [tabindex="0"]');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { // Se Shift + Tab estiver pressionado
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Se Tab estiver pressionado
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // --- 5. COPIAR E-MAIL E ANIMAÇÃO ---
    const btnCopy = document.getElementById("btn-copy-email");
    const emailValue = document.getElementById("email-value");
    
    btnCopy.addEventListener("click", () => {
        const textToCopy = emailValue.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const btnText = btnCopy.querySelector(".btn-copy-text");
            const copyIcon = btnCopy.querySelector(".copy-icon");
            
            // Ativa classe de sucesso (verde e ícone de check)
            btnCopy.classList.add("copied");
            btnText.textContent = "Copiado!";
            
            // Altera ícone para Check
            copyIcon.outerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><polyline points="20 6 9 17 4 12"/></svg>`;

            // Retorna ao estado padrão após 2 segundos
            setTimeout(() => {
                btnCopy.classList.remove("copied");
                btnCopy.querySelector(".btn-copy-text").textContent = "Copiar";
                btnCopy.querySelector(".copy-icon").outerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
            }, 2000);
        }).catch(err => {
            console.error("Erro ao copiar e-mail: ", err);
        });
    });
});

/* ==========================================================================
   ALTERNÂNCIA DE TEMA (DARK / LIGHT MODE)
   ========================================================================== */
(function () {
    const root = document.documentElement;
    const THEME_KEY = 'portfolio-theme';

    // Aplica tema salvo imediatamente (evita flash)
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light') {
        root.classList.add('light-theme');
    }

    document.addEventListener('DOMContentLoaded', () => {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            const isLight = root.classList.toggle('light-theme');

            // Persiste a preferência
            localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');

            // Atualiza aria-label para acessibilidade
            toggleBtn.setAttribute(
                'aria-label',
                isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro'
            );
        });

        // Sincroniza aria-label com o estado inicial
        const isLightOnLoad = root.classList.contains('light-theme');
        toggleBtn.setAttribute(
            'aria-label',
            isLightOnLoad ? 'Mudar para tema escuro' : 'Mudar para tema claro'
        );
    });
})();
