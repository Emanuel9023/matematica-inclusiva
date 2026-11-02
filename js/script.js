
"use strict";

/* ==========================================
   MATEMÁTICA INCLUSIVA
   
========================================== */


/* ==========================================
   1. ELEMENTOS DO HTML
========================================== */

const formulario = document.getElementById("formCadastro");
const fotoCrianca = document.getElementById("fotoCrianca");
const avatarImagem = document.getElementById("avatarImagem");
const avatarTexto = document.getElementById("avatarTexto");
const mensagemErro = document.getElementById("mensagemErro");

const telaExercicios = document.getElementById("telaExercicios");
const tituloExercicios = document.getElementById("tituloExercicios");
const perguntaMatematica = document.getElementById("perguntaMatematica");
const campoResposta = document.getElementById("resposta");
const botaoResponder = document.getElementById("btnResponder");
const botaoParar = document.getElementById("btnParar");
const feedback = document.getElementById("feedback");
const nivelAtualTexto = document.getElementById("nivelAtualTexto");

const botaoDica = document.getElementById("btnDica");
const painelDica = document.getElementById("painelDica");
const textoDica = document.getElementById("textoDica");
const visualDica = document.getElementById("visualDica");
const informacaoDicas = document.getElementById("informacaoDicas");

const telaRelatorio = document.getElementById("telaRelatorio");
const botaoNovaAtividade = document.getElementById("btnNovaAtividade");

const moedasAtuais = document.getElementById("moedasAtuais");
const trofeusAtuais = document.getElementById("trofeusAtuais");
const avatarJogo = document.getElementById("avatarJogo");
const saldoLoja = document.getElementById("saldoLoja");
const listaAvatares = document.getElementById("listaAvatares");
const listaTrofeus = document.getElementById("listaTrofeus");


/* ==========================================
   2. CONFIGURAÇÕES
========================================== */

const TODAS_OPERACOES = [
    "adicao",
    "subtracao",
    "multiplicacao",
    "divisao"
];

const NOMES_OPERACOES = {
    adicao: "Adição",
    subtracao: "Subtração",
    multiplicacao: "Multiplicação",
    divisao: "Divisão"
};

const SIMBOLOS = {
    adicao: "+",
    subtracao: "−",
    multiplicacao: "×",
    divisao: "÷"
};

const CORES_OPERACOES = {
    adicao: "#22c55e",
    subtracao: "#3b82f6",
    multiplicacao: "#f59e0b",
    divisao: "#a855f7"
};

const EMOJIS_OPERACOES = {
    adicao: "➕",
    subtracao: "➖",
    multiplicacao: "✖️",
    divisao: "➗"
};

const NOMES_NIVEIS = {
    1: "🟢 Fácil",
    2: "🔵 Médio",
    3: "🟣 Difícil"
};

const CORES_NIVEIS = {
    1: "#22c55e",
    2: "#3b82f6",
    3: "#a855f7"
};

const TEMPO_FEEDBACK = 1300;
const MINIMO_AMOSTRAS = 3;

const LIMITE_DICAS_GRATUITAS = 3;
const PRECO_DICA_EXTRA = 5;
const MOEDAS_POR_ACERTO = 10;

const CHAVE_RECOMPENSAS =
    "matematicaInclusivaRecompensasV1";

// A chave antiga permanece intacta para permitir recuperação manual.
const CHAVE_PERFIS = "matematicaInclusivaPerfisV3";
const TELAS_APP = [
    "telaPerfis", "formCadastro", "telaPainelCrianca",
    "telaExercicios", "telaRelatorio", "telaColecao",
    "telaAcessoResponsavel", "telaResponsavel"
];


/* ==========================================
   3. CATÁLOGO DE AVATARES
========================================== */

const CATALOGO_AVATARES = [
    {
        id: "astronauta",
        nome: "Astronauta",
        emoji: "🧑‍🚀",
        preco: 0
    },
    {
        id: "robo",
        nome: "Robô",
        emoji: "🤖",
        preco: 30
    },
    {
        id: "raposa",
        nome: "Raposa",
        emoji: "🦊",
        preco: 50
    },
    {
        id: "unicornio",
        nome: "Unicórnio",
        emoji: "🦄",
        preco: 70
    },
    {
        id: "dragao",
        nome: "Dragão",
        emoji: "🐉",
        preco: 100
    },
    {
        id: "leao",
        nome: "Leão",
        emoji: "🦁",
        preco: 120
    }
];


/* ==========================================
   4. CATÁLOGO DE TROFÉUS
========================================== */

const CATALOGO_TROFEUS = [
    {
        id: "primeiro_acerto",
        nome: "🌟 Primeira estrela",
        descricao: "Acertar sua primeira questão.",
        meta: 1,
        tipo: "acertos"
    },
    {
        id: "cinco_acertos",
        nome: "🥉 Explorador matemático",
        descricao: "Acertar 5 questões.",
        meta: 5,
        tipo: "acertos"
    },
    {
        id: "dez_acertos",
        nome: "🥈 Pequeno campeão",
        descricao: "Acertar 10 questões.",
        meta: 10,
        tipo: "acertos"
    },
    {
        id: "vinte_acertos",
        nome: "🥇 Mestre dos números",
        descricao: "Acertar 20 questões.",
        meta: 20,
        tipo: "acertos"
    },
    {
        id: "dez_questoes",
        nome: "💪 Nunca desisto",
        descricao: "Responder 10 questões, acertando ou errando.",
        meta: 10,
        tipo: "questoes"
    }
];


/* ==========================================
   5. ESTADO DO APLICATIVO
========================================== */

let urlFoto = null;
let perfilAtual = null;
let questaoAtual = null;

let historico = [];
let aguardandoProxima = false;
let temporizador = null;

let nivelAtual = 1;
let sequenciaAcertos = 0;
let sequenciaErros = 0;

let dicasGratuitasUsadas = 0;
let filaOperacoes = [];

// Estado adicional da Etapa 4.
let dadosPerfis = carregarBancoPerfis();
let idPerfilAtivo = null;
let idPerfilEmEdicao = null;
let fotoPersistida = null;
let acessoResponsavelLiberado = false;
let relatorioJaSalvo = false;
let nivelNoInicioDaAtividade = 1;


/* ==========================================
   6. SALVAR E CARREGAR RECOMPENSAS
========================================== */

function criarEstadoInicialRecompensas() {
    return {
        moedas: 0,
        totalAcertos: 0,
        totalQuestoes: 0,
        avatarSelecionado: "astronauta",
        avataresDesbloqueados: ["astronauta"],
        trofeus: []
    };
}

function carregarRecompensas() {
    const padrao = criarEstadoInicialRecompensas();

    try {
        const salvo = idPerfilAtivo
            ? JSON.stringify(obterPerfilAtivo()?.recompensas || padrao)
            : null;

        if (!salvo) {
            return padrao;
        }

        const dados = JSON.parse(salvo);

        if (!dados || typeof dados !== "object") {
            return padrao;
        }

        const idsValidos = CATALOGO_AVATARES.map(
            avatar => avatar.id
        );

        const desbloqueados = Array.isArray(
            dados.avataresDesbloqueados
        ) ? dados.avataresDesbloqueados : [];

        const avataresValidos = [
            ...new Set(["astronauta", ...desbloqueados])
        ].filter(id => idsValidos.includes(id));

        const avatarSelecionado =
            avataresValidos.includes(dados.avatarSelecionado)
                ? dados.avatarSelecionado
                : "astronauta";

        const trofeusValidos = Array.isArray(dados.trofeus)
            ? [...new Set(dados.trofeus)].filter(id =>
                CATALOGO_TROFEUS.some(
                    trofeu => trofeu.id === id
                )
            )
            : [];

        return {
            moedas: Number.isSafeInteger(dados.moedas)
                ? Math.max(0, dados.moedas)
                : 0,

            totalAcertos: Number.isSafeInteger(dados.totalAcertos)
                ? Math.max(0, dados.totalAcertos)
                : 0,

            totalQuestoes: Number.isSafeInteger(dados.totalQuestoes)
                ? Math.max(0, dados.totalQuestoes)
                : 0,

            avatarSelecionado,

            avataresDesbloqueados: avataresValidos,

            trofeus: trofeusValidos
        };

    } catch (erro) {
        console.warn(
            "Não foi possível carregar as recompensas.",
            erro
        );

        return padrao;
    }
}

let recompensas = carregarRecompensas();

function salvarRecompensas() {
    try {
        const perfil = obterPerfilAtivo();
        if (perfil) {
            perfil.recompensas = recompensas;
            salvarBancoPerfis();
        }
    } catch (erro) {
        console.warn(
            "Não foi possível salvar as recompensas.",
            erro
        );
    }
}


/* ==========================================
   7. FOTO DA CRIANÇA
========================================== */

fotoCrianca.addEventListener("change", function () {
    const arquivo = fotoCrianca.files[0];

    if (!arquivo) {
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        mensagemErro.textContent =
            "Escolha um arquivo de imagem válido.";

        fotoCrianca.value = "";
        return;
    }

    mensagemErro.textContent = "";

    if (urlFoto) {
        URL.revokeObjectURL(urlFoto);
    }

    urlFoto = URL.createObjectURL(arquivo);

    avatarImagem.src = urlFoto;
    avatarImagem.hidden = false;
    avatarTexto.hidden = true;
});


/* ==========================================
   8. CADASTRO DA CRIANÇA
========================================== */

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();

    const idade = Number(
        document.getElementById("idade").value
    );

    const nivelInicial = Number(
        document.getElementById("nivelInicial").value
    );

    const dificuldades = Array.from(
        document.querySelectorAll(
            'input[name="operacao"]:checked'
        )
    ).map(campo => campo.value);

    if (!nome) {
        mensagemErro.textContent =
            "Por favor, informe o nome da criança.";
        return;
    }

    if (!Number.isInteger(idade) || idade < 1 || idade > 17) {
        mensagemErro.textContent =
            "Informe uma idade entre 1 e 17 anos.";
        return;
    }

    if (![1, 2, 3].includes(nivelInicial)) {
        mensagemErro.textContent =
            "Selecione um nível inicial válido.";
        return;
    }

    mensagemErro.textContent = "";

    if (idPerfilEmEdicao) {
        const perfil = dadosPerfis.perfis.find(
            item => item.id === idPerfilEmEdicao
        );
        if (!perfil) return;

        perfil.nome = nome;
        perfil.idade = idade;
        perfil.dificuldades = dificuldades;
        perfil.nivel = nivelInicial;
        perfil.foto = fotoPersistida;

        idPerfilEmEdicao = null;
        salvarBancoPerfis();
        preencherAreaResponsavel();
        mostrarTela("telaResponsavel");
    } else {
        const perfil = {
            id: criarIdentificador(),
            nome,
            idade,
            dificuldades,
            nivel: nivelInicial,
            foto: fotoPersistida,
            recompensas: criarEstadoInicialRecompensas(),
            atividades: []
        };

        dadosPerfis.perfis.push(perfil);
        if (!salvarBancoPerfis()) {
            dadosPerfis.perfis.pop();
            return;
        }
        selecionarPerfil(perfil.id);
    }
});


/* ==========================================
   9. FUNÇÕES MATEMÁTICAS
========================================== */

function sortearNumero(minimo, maximo) {
    return Math.floor(
        Math.random() * (maximo - minimo + 1)
    ) + minimo;
}

function embaralharOperacoes() {
    const operacoes = [...TODAS_OPERACOES];

    for (let i = operacoes.length - 1; i > 0; i--) {
        const j = sortearNumero(0, i);

        [operacoes[i], operacoes[j]] =
            [operacoes[j], operacoes[i]];
    }

    return operacoes;
}

function obterProximaOperacao() {
    if (filaOperacoes.length === 0) {
        filaOperacoes = embaralharOperacoes();
    }

    return filaOperacoes.shift();
}

function nomeOperacao(operacao) {
    return NOMES_OPERACOES[operacao] || operacao;
}

function faixaNumero(numero) {
    const valor = Math.abs(numero);

    if (valor <= 5) return "1 a 5";
    if (valor <= 10) return "6 a 10";
    if (valor <= 20) return "11 a 20";
    if (valor <= 50) return "21 a 50";

    return "Acima de 50";
}

function calcularResumo(registros) {
    const total = registros.length;

    const acertos = registros.filter(
        registro => registro.acertou
    ).length;

    const erros = total - acertos;

    const percentual = total > 0
        ? Math.round((acertos / total) * 100)
        : 0;

    const taxaErros = total > 0
        ? (erros / total) * 100
        : 0;

    return {
        total,
        acertos,
        erros,
        percentual,
        taxaErros
    };
}


/* ==========================================
   10. INICIAR ATIVIDADE
========================================== */

function iniciarAtividade(perfil) {
    if (temporizador !== null) {
        clearTimeout(temporizador);
        temporizador = null;
    }

    perfilAtual = perfil;
    questaoAtual = null;

    historico = [];
    aguardandoProxima = false;

    nivelAtual = perfil.nivelInicial;
    nivelNoInicioDaAtividade = nivelAtual;
    relatorioJaSalvo = false;

    sequenciaAcertos = 0;
    sequenciaErros = 0;

    dicasGratuitasUsadas = 0;
    filaOperacoes = [];

    mostrarTela("telaExercicios");

    tituloExercicios.textContent =
        `Vamos praticar, ${perfil.nome}! 🌟`;

    document.getElementById("acertos").textContent = "0";
    document.getElementById("erros").textContent = "0";

    atualizarNivelNaTela();
    atualizarRecompensasNaTela();
    atualizarInformacaoDicas();

    gerarPergunta();
}

/* ==========================================
   11. GERAR PERGUNTA MATEMÁTICA
========================================== */

function gerarPergunta() {
    if (!perfilAtual) {
        return;
    }

    aguardandoProxima = false;

    botaoResponder.disabled = false;
    botaoDica.disabled = false;
    campoResposta.disabled = false;

    campoResposta.value = "";
    feedback.textContent = "";

    painelDica.hidden = true;
    textoDica.textContent = "";
    visualDica.replaceChildren();

    atualizarInformacaoDicas();

    const operacao = obterProximaOperacao();

    const limiteSoma = {
        1: 5,
        2: 20,
        3: 50
    }[nivelAtual];

    const limiteMultiplicacao = {
        1: 5,
        2: 10,
        3: 15
    }[nivelAtual];

    let a;
    let b;
    let respostaCorreta;

    switch (operacao) {
        case "adicao":
            a = sortearNumero(1, limiteSoma);
            b = sortearNumero(1, limiteSoma);
            respostaCorreta = a + b;
            break;

        case "subtracao":
            a = sortearNumero(1, limiteSoma);
            b = sortearNumero(1, limiteSoma);

            if (b > a) {
                [a, b] = [b, a];
            }

            respostaCorreta = a - b;
            break;

        case "multiplicacao":
            a = sortearNumero(1, limiteMultiplicacao);
            b = sortearNumero(1, limiteMultiplicacao);
            respostaCorreta = a * b;
            break;

        case "divisao":
            b = sortearNumero(1, limiteMultiplicacao);

            const quociente = sortearNumero(
                1,
                limiteMultiplicacao
            );

            a = b * quociente;
            respostaCorreta = quociente;
            break;
    }

    questaoAtual = {
        operacao,
        a,
        b,
        respostaCorreta,
        nivel: nivelAtual,
        usouDica: false,
        tipoDica: null
    };

    perguntaMatematica.textContent =
        `${a} ${SIMBOLOS[operacao]} ${b} = ?`;

    campoResposta.focus();
}


/* ==========================================
   12. ADAPTAÇÃO AUTOMÁTICA DE NÍVEL
========================================== */

function atualizarNivelNaTela() {
    nivelAtualTexto.textContent =
        NOMES_NIVEIS[nivelAtual];
}

function adaptarDificuldade(acertou) {
    if (acertou) {
        sequenciaAcertos++;
        sequenciaErros = 0;

        if (sequenciaAcertos >= 5) {
            if (nivelAtual < 3) {
                nivelAtual++;
            }

            sequenciaAcertos = 0;
        }

    } else {
        sequenciaErros++;
        sequenciaAcertos = 0;

        if (sequenciaErros >= 3) {
            if (nivelAtual > 1) {
                nivelAtual--;
            }

            sequenciaErros = 0;
        }
    }

    atualizarNivelNaTela();

    const perfilSalvo = obterPerfilAtivo();

    if (perfilSalvo) {
        perfilSalvo.nivel = nivelAtual;
        salvarBancoPerfis();
    }
}


/* ==========================================
   13. RECOMPENSAS POR RESPOSTA
========================================== */

function verificarTrofeus() {
    const novosTrofeus = [];

    for (const trofeu of CATALOGO_TROFEUS) {
        const progresso = trofeu.tipo === "acertos"
            ? recompensas.totalAcertos
            : recompensas.totalQuestoes;

        if (
            progresso >= trofeu.meta &&
            !recompensas.trofeus.includes(trofeu.id)
        ) {
            recompensas.trofeus.push(trofeu.id);
            novosTrofeus.push(trofeu.nome);
        }
    }

    return novosTrofeus;
}

function registrarRecompensa(acertou) {
    recompensas.totalQuestoes++;

    if (acertou) {
        recompensas.totalAcertos++;
        recompensas.moedas += MOEDAS_POR_ACERTO;
    }

    const novosTrofeus = verificarTrofeus();

    salvarRecompensas();
    atualizarRecompensasNaTela();

    return novosTrofeus;
}

function atualizarRecompensasNaTela() {
    moedasAtuais.textContent = recompensas.moedas;

    trofeusAtuais.textContent =
        recompensas.trofeus.length;

    saldoLoja.textContent = recompensas.moedas;

    const avatar = CATALOGO_AVATARES.find(
        item => item.id === recompensas.avatarSelecionado
    );

    avatarJogo.textContent = avatar
        ? avatar.emoji
        : "🧑‍🚀";
}


/* ==========================================
   14. RESPONDER À QUESTÃO
========================================== */

function responder() {
    if (
        !perfilAtual ||
        !questaoAtual ||
        aguardandoProxima
    ) {
        return;
    }

    const valorDigitado = campoResposta.value.trim();

    if (valorDigitado === "") {
        feedback.textContent =
            "Digite uma resposta antes de confirmar. 😊";

        feedback.style.color = "#b45309";
        return;
    }

    const resposta = Number(valorDigitado);

    if (!Number.isFinite(resposta)) {
        feedback.textContent =
            "Digite um número válido.";

        feedback.style.color = "#b91c1c";
        return;
    }

    const acertou =
        resposta === questaoAtual.respostaCorreta;

    historico.push({
        ...questaoAtual,
        resposta,
        acertou
    });

    const novosTrofeus = registrarRecompensa(acertou);

    adaptarDificuldade(acertou);

    const resumo = calcularResumo(historico);

    document.getElementById("acertos").textContent =
        resumo.acertos;

    document.getElementById("erros").textContent =
        resumo.erros;

    if (acertou) {
        feedback.textContent =
            `Muito bem! Você acertou! 🌟 ` +
            `🪙 +${MOEDAS_POR_ACERTO} moedas!`;

        feedback.style.color = "#15803d";

    } else {
        feedback.textContent =
            `Boa tentativa! A resposta era ` +
            `${questaoAtual.respostaCorreta}. ` +
            `Vamos continuar aprendendo! 💙`;

        feedback.style.color = "#b45309";
    }

    if (novosTrofeus.length > 0) {
        feedback.textContent += " 🏆 Nova conquista!";
    }

    aguardandoProxima = true;

    botaoResponder.disabled = true;
    botaoDica.disabled = true;
    campoResposta.disabled = true;

    temporizador = setTimeout(() => {
        temporizador = null;

        if (perfilAtual && !telaExercicios.hidden) {
            gerarPergunta();
        }
    }, TEMPO_FEEDBACK);
}

botaoResponder.addEventListener("click", responder);

campoResposta.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
        evento.preventDefault();
        responder();
    }
});


/* ==========================================
   15. CONTADOR DE DICAS
========================================== */

function atualizarInformacaoDicas() {
    informacaoDicas.classList.remove("sem-moedas");

    const restantes =
        LIMITE_DICAS_GRATUITAS - dicasGratuitasUsadas;

    if (restantes > 0) {
        informacaoDicas.textContent =
            `🎁 Dicas gratuitas restantes: ${restantes}`;
    } else {
        informacaoDicas.textContent =
            `🪙 As dicas gratuitas acabaram. ` +
            `Cada nova dica custa ${PRECO_DICA_EXTRA} moedas.`;
    }
}


/* ==========================================
   16. ELEMENTOS VISUAIS DAS DICAS
========================================== */

function criarGrupoVisual(titulo, quantidade, emoji) {
    const grupo = document.createElement("div");
    grupo.className = "grupo-dica";

    const legenda = document.createElement("div");
    legenda.className = "legenda-dica";
    legenda.textContent = titulo;

    const elementos = document.createElement("div");

    if (quantidade <= 30) {
        elementos.textContent =
            Array(quantidade).fill(emoji).join(" ");
    } else {
        elementos.textContent =
            `${emoji} × ${quantidade}`;
    }

    grupo.append(legenda, elementos);
    visualDica.appendChild(grupo);
}

function criarMensagemDica(mensagem) {
    const elemento = document.createElement("p");

    elemento.className = "mensagem-dica";
    elemento.textContent = mensagem;

    visualDica.appendChild(elemento);
}


/* ==========================================
   17. DICAS VISUAIS COM COBRANÇA
========================================== */

function mostrarDica() {
    if (
        !perfilAtual ||
        !questaoAtual ||
        aguardandoProxima
    ) {
        return;
    }

    // Uma mesma questão nunca cobra a dica duas vezes.
    if (questaoAtual.usouDica) {
        painelDica.hidden = false;
        return;
    }

    const temDicaGratis =
        dicasGratuitasUsadas < LIMITE_DICAS_GRATUITAS;

    if (temDicaGratis) {
        dicasGratuitasUsadas++;
        questaoAtual.tipoDica = "gratuita";

    } else {
        if (recompensas.moedas < PRECO_DICA_EXTRA) {
            informacaoDicas.textContent =
                `🪙 Você precisa de ${PRECO_DICA_EXTRA} ` +
                `moedas para usar outra dica. ` +
                `Continue praticando!`;

            informacaoDicas.classList.add("sem-moedas");
            return;
        }

        recompensas.moedas -= PRECO_DICA_EXTRA;

        questaoAtual.tipoDica = "paga";

        salvarRecompensas();
        atualizarRecompensasNaTela();
    }

    questaoAtual.usouDica = true;

    atualizarInformacaoDicas();

    painelDica.hidden = false;
    visualDica.replaceChildren();

    const { operacao, a, b } = questaoAtual;

    switch (operacao) {
        case "adicao":
            textoDica.textContent =
                "Somar é juntar quantidades. " +
                "Observe os dois grupos e conte tudo!";

            criarGrupoVisual(
                "Primeiro grupo",
                a,
                "🔵"
            );

            criarGrupoVisual(
                "Segundo grupo",
                b,
                "🟢"
            );

            criarMensagemDica(
                "Quantos elementos temos ao juntar os grupos?"
            );
            break;

        case "subtracao":
            textoDica.textContent =
                "Subtrair é retirar uma quantidade. " +
                "Comece com o primeiro número e retire " +
                "a quantidade indicada pelo segundo.";

            criarGrupoVisual(
                `Começamos com ${a} elementos`,
                a,
                "⭐"
            );

            criarGrupoVisual(
                `Retire ${b} elementos`,
                b,
                "❌"
            );

            criarMensagemDica(
                "Quantos elementos sobraram?"
            );
            break;

        case "multiplicacao":
            textoDica.textContent =
                `Multiplicar ${a} por ${b} significa ` +
                `formar ${a} grupos com ${b} elementos ` +
                "em cada grupo.";

            for (let i = 1; i <= a; i++) {
                criarGrupoVisual(
                    `Grupo ${i}`,
                    b,
                    "⭐"
                );
            }

            criarMensagemDica(
                "Conte os elementos de todos os grupos!"
            );
            break;

        case "divisao":
            textoDica.textContent =
                `Dividir ${a} por ${b} é repartir ` +
                `${a} elementos igualmente entre ` +
                `${b} grupos.`;

            const quantidadePorGrupo = a / b;

            for (let i = 1; i <= b; i++) {
                criarGrupoVisual(
                    `Grupo ${i}`,
                    quantidadePorGrupo,
                    "🟣"
                );
            }

            criarMensagemDica(
                "Quantos elementos ficam em cada grupo?"
            );
            break;
    }
}

botaoDica.addEventListener("click", mostrarDica);

/* ==========================================
   18. ANÁLISE DE DESEMPENHO POR OPERAÇÃO
========================================== */

function analisarDesempenho() {
    const resultado = {};

    for (const operacao of TODAS_OPERACOES) {
        const registros = historico.filter(
            item => item.operacao === operacao
        );

        resultado[operacao] = calcularResumo(registros);
    }

    return resultado;
}


/* ==========================================
   19. ANÁLISE DE DESEMPENHO POR NÍVEL
========================================== */

function analisarNiveis() {
    const resultado = {};

    for (const nivel of [1, 2, 3]) {
        const registros = historico.filter(
            item => item.nivel === nivel
        );

        resultado[nivel] = calcularResumo(registros);
    }

    return resultado;
}


/* ==========================================
   20. ANÁLISE POR NÚMEROS ESPECÍFICOS
========================================== */

function analisarNumerosEspecificos() {
    const contagem = new Map();

    for (const registro of historico) {
        const numeros = new Set([
            registro.a,
            registro.b
        ]);

        for (const numero of numeros) {
            if (!contagem.has(numero)) {
                contagem.set(numero, {
                    numero,
                    total: 0,
                    erros: 0
                });
            }

            const dados = contagem.get(numero);

            dados.total++;

            if (!registro.acertou) {
                dados.erros++;
            }
        }
    }

    return [...contagem.values()]
        .filter(item =>
            item.total >= MINIMO_AMOSTRAS &&
            item.erros > 0
        )
        .map(item => ({
            ...item,
            taxaErros: (item.erros / item.total) * 100
        }))
        .sort((a, b) =>
            b.taxaErros - a.taxaErros ||
            b.erros - a.erros
        );
}


/* ==========================================
   21. ANÁLISE POR FAIXA NUMÉRICA
========================================== */

function analisarNumeros() {
    const faixas = [
        "1 a 5",
        "6 a 10",
        "11 a 20",
        "21 a 50",
        "Acima de 50"
    ];

    const resultado = {};

    for (const faixa of faixas) {
        const registros = historico.filter(
            item => faixaNumero(item.b) === faixa
        );

        resultado[faixa] = calcularResumo(registros);
    }

    return resultado;
}


/* ==========================================
   22. IDENTIFICAR PONTOS PARA PRATICAR
========================================== */

function identificarDificuldades() {
    const porOperacao = analisarDesempenho();
    const porFaixa = analisarNumeros();

    const operacoesComAmostra = Object.entries(
        porOperacao
    )
        .filter(([, dados]) =>
            dados.total >= MINIMO_AMOSTRAS &&
            dados.erros > 0
        )
        .sort((a, b) =>
            b[1].taxaErros - a[1].taxaErros
        );

    const faixasComAmostra = Object.entries(
        porFaixa
    )
        .filter(([, dados]) =>
            dados.total >= MINIMO_AMOSTRAS &&
            dados.erros > 0
        )
        .sort((a, b) =>
            b[1].taxaErros - a[1].taxaErros
        );

    return {
        operacao: operacoesComAmostra.length > 0
            ? operacoesComAmostra[0][0]
            : null,

        faixa: faixasComAmostra.length > 0
            ? faixasComAmostra[0][0]
            : null,

        numeros: analisarNumerosEspecificos()
    };
}


/* ==========================================
   23. GRÁFICO DE OPERAÇÕES
========================================== */

function criarBarraDesempenho(
    destino,
    titulo,
    dados,
    cor
) {
    const bloco = document.createElement("div");
    bloco.className = "bloco-operacao";

    const linha = document.createElement("div");
    linha.className = "linha-operacao";

    const nome = document.createElement("span");
    nome.textContent = titulo;

    const percentual = document.createElement("span");
    percentual.textContent =
        dados.total > 0
            ? `${dados.percentual}%`
            : "Sem questões";

    linha.append(nome, percentual);

    const trilho = document.createElement("div");
    trilho.className = "trilho-barra";

    const barra = document.createElement("div");
    barra.className = "barra-progresso";

    barra.style.width = `${dados.percentual}%`;
    barra.style.backgroundColor = cor;

    trilho.appendChild(barra);

    const detalhes = document.createElement("p");
    detalhes.className = "detalhes-operacao";

    detalhes.textContent =
        `${dados.acertos} acerto(s) de ` +
        `${dados.total} questão(ões).`;

    bloco.append(linha, trilho, detalhes);
    destino.appendChild(bloco);
}

function montarGraficoOperacoes() {
    const destino = document.getElementById(
        "graficoOperacoes"
    );

    destino.replaceChildren();

    const desempenho = analisarDesempenho();

    for (const operacao of TODAS_OPERACOES) {
        criarBarraDesempenho(
            destino,
            `${EMOJIS_OPERACOES[operacao]} ` +
            nomeOperacao(operacao),
            desempenho[operacao],
            CORES_OPERACOES[operacao]
        );
    }
}


/* ==========================================
   24. PAINÉIS ADICIONAIS DO RELATÓRIO
========================================== */

function obterPainelExtra(id, titulo) {
    let painel = document.getElementById(id);

    if (!painel) {
        painel = document.createElement("div");
        painel.id = id;
        painel.className = "painel-operacoes";

        const referencia = document.querySelector(
            ".painel-dificuldades"
        );

        referencia.parentNode.insertBefore(
            painel,
            referencia
        );
    }

    painel.replaceChildren();

    const cabecalho = document.createElement("h3");
    cabecalho.textContent = titulo;

    painel.appendChild(cabecalho);

    return painel;
}


/* ==========================================
   25. GRÁFICO POR NÍVEL
========================================== */

function montarGraficoNiveis() {
    const painel = obterPainelExtra(
        "painelNiveis",
        "⭐ Meu desempenho por nível"
    );

    const desempenho = analisarNiveis();

    for (const nivel of [1, 2, 3]) {
        criarBarraDesempenho(
            painel,
            NOMES_NIVEIS[nivel],
            desempenho[nivel],
            CORES_NIVEIS[nivel]
        );
    }
}


/* ==========================================
   26. ANÁLISE DOS NÚMEROS
========================================== */

function mostrarAnaliseNumerica(dificuldades) {
    const painel = obterPainelExtra(
        "painelNumeros",
        "🔢 Análise dos números"
    );

    const texto = document.createElement("p");

    if (dificuldades.numeros.length === 0) {
        texto.textContent =
            "Ainda não há respostas suficientes " +
            "para identificar números que mereçam " +
            "mais prática.";
    } else {
        const principais = dificuldades.numeros.slice(0, 3);

        const descricao = principais.map(item =>
            `${item.numero} ` +
            `(${item.erros} erro(s) em ` +
            `${item.total} questão(ões))`
        );

        texto.textContent =
            "Os números que apareceram com maior " +
            "frequência nas respostas incorretas, " +
            "considerando a proporção de erros, " +
            `foram: ${descricao.join(", ")}.`;
    }

    const observacao = document.createElement("p");

    observacao.textContent =
        "Esta análise mostra padrões das respostas " +
        "e não representa um diagnóstico de " +
        "dificuldade de aprendizagem.";

    painel.append(texto, observacao);
}


/* ==========================================
   27. LOJA DE AVATARES
========================================== */

function montarLojaAvatares() {
    listaAvatares.replaceChildren();

    for (const avatar of CATALOGO_AVATARES) {
        const desbloqueado =
            recompensas.avataresDesbloqueados.includes(
                avatar.id
            );

        const selecionado =
            recompensas.avatarSelecionado === avatar.id;

        const cartao = document.createElement("div");
        cartao.className = "cartao-avatar";

        if (selecionado) {
            cartao.classList.add("selecionado");
        }

        const emoji = document.createElement("span");
        emoji.className = "emoji-avatar";
        emoji.textContent = avatar.emoji;

        const nome = document.createElement("span");
        nome.className = "nome-avatar";
        nome.textContent = avatar.nome;

        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "botao-avatar";

        if (selecionado) {
            botao.textContent = "✅ Selecionado";
            botao.disabled = true;

        } else if (desbloqueado) {
            botao.textContent = "Usar avatar";

            botao.addEventListener("click", () => {
                recompensas.avatarSelecionado = avatar.id;

                salvarRecompensas();
                atualizarRecompensasNaTela();
                montarLojaAvatares();
            });

        } else {
            botao.textContent =
                `🪙 Desbloquear: ${avatar.preco}`;

            botao.disabled =
                recompensas.moedas < avatar.preco;

            botao.addEventListener("click", () => {
                if (recompensas.moedas < avatar.preco) {
                    return;
                }

                if (
                    recompensas.avataresDesbloqueados.includes(
                        avatar.id
                    )
                ) {
                    return;
                }

                recompensas.moedas -= avatar.preco;

                recompensas.avataresDesbloqueados.push(
                    avatar.id
                );

                recompensas.avatarSelecionado = avatar.id;

                salvarRecompensas();
                atualizarRecompensasNaTela();
                montarLojaAvatares();
            });
        }

        cartao.append(emoji, nome, botao);
        listaAvatares.appendChild(cartao);
    }
}


/* ==========================================
   28. TROFÉUS E CONQUISTAS
========================================== */

function montarTrofeus() {
    listaTrofeus.replaceChildren();

    for (const trofeu of CATALOGO_TROFEUS) {
        const conquistado =
            recompensas.trofeus.includes(trofeu.id);

        const cartao = document.createElement("div");

        cartao.className = conquistado
            ? "cartao-trofeu conquistado"
            : "cartao-trofeu bloqueado";

        const titulo = document.createElement("strong");

        titulo.textContent = conquistado
            ? trofeu.nome
            : `🔒 ${trofeu.nome}`;

        const descricao = document.createElement("p");
        descricao.textContent = trofeu.descricao;

        cartao.append(titulo, descricao);
        listaTrofeus.appendChild(cartao);
    }
}

function atualizarPainelFinalRecompensas() {
    atualizarRecompensasNaTela();
    montarLojaAvatares();
    montarTrofeus();
}


/* ==========================================
   29. MOSTRAR RELATÓRIO FINAL
========================================== */

function mostrarRelatorio() {
    if (!perfilAtual) {
        return;
    }

    if (temporizador !== null) {
        clearTimeout(temporizador);
        temporizador = null;
    }

    aguardandoProxima = false;

    const resumo = calcularResumo(historico);
    const dificuldades = identificarDificuldades();

    // Salva a atividade apenas uma vez por sessão.
    if (!relatorioJaSalvo) {
        const perfilSalvo = obterPerfilAtivo();

        if (perfilSalvo && historico.length > 0) {
            perfilSalvo.atividades.push({
                id: criarIdentificador(),
                data: new Date().toISOString(),
                respostas: historico.map(
                    resposta => ({ ...resposta })
                ),
                nivelInicial: nivelNoInicioDaAtividade,
                nivelFinal: nivelAtual
            });

            perfilSalvo.nivel = nivelAtual;
            salvarBancoPerfis();
        }

        relatorioJaSalvo = true;
    }

    telaExercicios.hidden = true;
    telaRelatorio.hidden = false;

    document.getElementById("relTotal").textContent =
        resumo.total;

    document.getElementById("relAcertos").textContent =
        resumo.acertos;

    document.getElementById("relErros").textContent =
        resumo.erros;

    document.getElementById("relPercentual").textContent =
        `${resumo.percentual}%`;

    const graficoCircular = document.getElementById(
        "graficoCircular"
    );

    graficoCircular.style.setProperty(
        "--percentual",
        `${resumo.percentual}%`
    );

    const mensagem = document.getElementById(
        "mensagemRelatorio"
    );

    if (resumo.total === 0) {
        mensagem.textContent =
            `${perfilAtual.nome}, você pode começar ` +
            "uma nova atividade quando quiser! 💙";

    } else if (resumo.percentual >= 80) {
        mensagem.textContent =
            `Parabéns, ${perfilAtual.nome}! ` +
            "Você se dedicou muito! 🌟";

    } else if (resumo.percentual >= 50) {
        mensagem.textContent =
            `Muito bem, ${perfilAtual.nome}! ` +
            "Continue praticando e aprendendo! 💙";

    } else {
        mensagem.textContent =
            `${perfilAtual.nome}, cada tentativa ` +
            "é uma oportunidade de aprender! 🌈";
    }

    const explicacao = document.getElementById(
        "explicacaoAproveitamento"
    );

    if (resumo.total === 0) {
        explicacao.textContent =
            "Nenhuma questão foi respondida nesta atividade.";
    } else {
        explicacao.textContent =
            `Você acertou ${resumo.acertos} de ` +
            `${resumo.total} questões.`;
    }

    montarGraficoOperacoes();
    montarGraficoNiveis();
    mostrarAnaliseNumerica(dificuldades);

    const dificuldadeOperacao = document.getElementById(
        "dificuldadeOperacao"
    );

    if (dificuldades.operacao) {
        dificuldadeOperacao.textContent =
            `Vale praticar mais: ` +
            `${nomeOperacao(dificuldades.operacao)}.`;
    } else {
        dificuldadeOperacao.textContent =
            "Ainda não há respostas suficientes " +
            "para apontar uma operação que precise " +
            "de mais prática.";
    }

    const dificuldadeNumeros = document.getElementById(
        "dificuldadeNumeros"
    );

    if (dificuldades.faixa) {
        dificuldadeNumeros.textContent =
            `Faixa numérica para praticar: ` +
            `${dificuldades.faixa}.`;
    } else {
        dificuldadeNumeros.textContent =
            "Nenhuma faixa numérica específica " +
            "foi identificada até agora.";
    }

    const dificuldadesInformadas = document.getElementById(
        "dificuldadesInformadas"
    );

    if (perfilAtual.dificuldades.length > 0) {
        const nomes = perfilAtual.dificuldades.map(
            nomeOperacao
        );

        dificuldadesInformadas.textContent =
            `Dificuldades informadas no cadastro: ` +
            `${nomes.join(", ")}.`;
    } else {
        dificuldadesInformadas.textContent =
            "Nenhuma dificuldade específica foi " +
            "informada no cadastro.";
    }

    atualizarPainelFinalRecompensas();
}

/* ==========================================
   30. PARAR ATIVIDADE
========================================== */

botaoParar.addEventListener("click", mostrarRelatorio);


/* ==========================================
   31. COMEÇAR NOVA ATIVIDADE
========================================== */

botaoNovaAtividade.addEventListener("click", function () {
    const perfil = obterPerfilAtivo();

    if (perfil) {
        iniciarAtividade({
            nome: perfil.nome,
            idade: perfil.idade,
            dificuldades: perfil.dificuldades,
            nivelInicial: perfil.nivel
        });
    }
});


/* ==========================================
   32. INICIALIZAÇÃO DAS RECOMPENSAS
========================================== */

atualizarRecompensasNaTela();
atualizarInformacaoDicas();


/* ============================================================
   ETAPA 4 — PERFIS INDIVIDUAIS E ÁREA DO RESPONSÁVEL
============================================================ */


/* ==========================================
   33. BANCO DE PERFIS LOCAL
========================================== */

function carregarBancoPerfis() {
    try {
        const texto = localStorage.getItem(CHAVE_PERFIS);

        if (!texto) {
            return {
                perfis: [],
                responsavel: null
            };
        }

        const banco = JSON.parse(texto);

        if (!banco || !Array.isArray(banco.perfis)) {
            return {
                perfis: [],
                responsavel: null
            };
        }

        return {
            perfis: banco.perfis.map(validarPerfilSalvo),
            responsavel: banco.responsavel || null
        };

    } catch (erro) {
        console.warn(
            "Não foi possível ler os perfis:",
            erro
        );

        return {
            perfis: [],
            responsavel: null
        };
    }
}

function validarPerfilSalvo(perfil) {
    const nivel = Number(perfil.nivel);
    const recompensasSalvas = perfil.recompensas || {};
    const iniciais = criarEstadoInicialRecompensas();

    const validos = CATALOGO_AVATARES.map(
        item => item.id
    );

    const desbloqueados = Array.isArray(
        recompensasSalvas.avataresDesbloqueados
    )
        ? recompensasSalvas.avataresDesbloqueados
        : [];

    const avatares = [
        ...new Set(["astronauta", ...desbloqueados])
    ].filter(id => validos.includes(id));

    const avatarSelecionado = avatares.includes(
        recompensasSalvas.avatarSelecionado
    )
        ? recompensasSalvas.avatarSelecionado
        : "astronauta";

    const trofeus = Array.isArray(recompensasSalvas.trofeus)
        ? recompensasSalvas.trofeus.filter(
            id => CATALOGO_TROFEUS.some(
                trofeu => trofeu.id === id
            )
        )
        : [];

    const numeroSeguro = valor =>
        Number.isSafeInteger(valor)
            ? Math.max(0, valor)
            : 0;

    return {
        id: String(perfil.id),

        nome: String(perfil.nome || "Criança"),

        idade: Number(perfil.idade) || 1,

        nivel: [1, 2, 3].includes(nivel)
            ? nivel
            : 1,

        dificuldades: Array.isArray(perfil.dificuldades)
            ? perfil.dificuldades.filter(
                operacao => TODAS_OPERACOES.includes(operacao)
            )
            : [],

        foto: typeof perfil.foto === "string"
            ? perfil.foto
            : null,

        recompensas: {
            ...iniciais,

            moedas: numeroSeguro(
                recompensasSalvas.moedas
            ),

            totalAcertos: numeroSeguro(
                recompensasSalvas.totalAcertos
            ),

            totalQuestoes: numeroSeguro(
                recompensasSalvas.totalQuestoes
            ),

            avatarSelecionado,

            avataresDesbloqueados: avatares,

            trofeus: [...new Set(trofeus)]
        },

        atividades: Array.isArray(perfil.atividades)
            ? perfil.atividades
            : []
    };
}

function salvarBancoPerfis() {
    try {
        localStorage.setItem(
            CHAVE_PERFIS,
            JSON.stringify(dadosPerfis)
        );

        return true;

    } catch (erro) {
        console.error(
            "Erro ao salvar perfis:",
            erro
        );

        alert(
            "Não foi possível salvar os dados. " +
            "Verifique o armazenamento do navegador."
        );

        return false;
    }
}

function criarIdentificador() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return (
        `${Date.now()}-` +
        Math.random().toString(36).slice(2)
    );
}

function obterPerfilAtivo() {
    return dadosPerfis.perfis.find(
        perfil => perfil.id === idPerfilAtivo
    ) || null;
}

function mostrarTela(id) {
    for (const nome of TELAS_APP) {
        const tela = document.getElementById(nome);

        if (tela) {
            tela.hidden = nome !== id;
        }
    }

    const subtitulo = document.getElementById(
        "subtituloApp"
    );

    if (subtitulo) {
        subtitulo.hidden = id === "telaExercicios";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function criarTexto(tag, texto, classe = "") {
    const elemento = document.createElement(tag);

    elemento.textContent = texto;

    if (classe) {
        elemento.className = classe;
    }

    return elemento;
}

function mostrarFotoOuAvatar(destino, perfil) {
    destino.replaceChildren();

    if (perfil.foto) {
        const imagem = document.createElement("img");

        imagem.src = perfil.foto;

        imagem.alt = `Foto do perfil de ${perfil.nome}`;

        destino.appendChild(imagem);

    } else {
        const avatar = CATALOGO_AVATARES.find(
            item =>
                item.id === perfil.recompensas.avatarSelecionado
        );

        destino.textContent = avatar
            ? avatar.emoji
            : "🧑‍🚀";
    }
}


/* ==========================================
   34. SELEÇÃO DE PERFIS
========================================== */

function listarPerfis() {
    const destino = document.getElementById(
        "listaPerfis"
    );

    destino.replaceChildren();

    document.getElementById(
        "mensagemSemPerfis"
    ).hidden = dadosPerfis.perfis.length > 0;

    for (const perfil of dadosPerfis.perfis) {
        const cartao = criarTexto(
            "div",
            "",
            "cartao-perfil"
        );

        const imagem = criarTexto(
            "div",
            "",
            "emoji-perfil"
        );

        mostrarFotoOuAvatar(imagem, perfil);

        const nome = criarTexto(
            "strong",
            perfil.nome,
            "nome-perfil"
        );

        const detalhe = criarTexto(
            "p",
            `${perfil.idade} ano(s) · ` +
            `${NOMES_NIVEIS[perfil.nivel]}`,
            "informacao-perfil"
        );

        const entrar = criarTexto(
            "button",
            "🚀 Entrar",
            "botao-entrar-perfil"
        );

        entrar.type = "button";

        entrar.addEventListener("click", () => {
            selecionarPerfil(perfil.id);
        });

        cartao.append(
            imagem,
            nome,
            detalhe,
            entrar
        );

        destino.appendChild(cartao);
    }
}

function selecionarPerfil(id) {
    const perfil = dadosPerfis.perfis.find(
        item => item.id === id
    );

    if (!perfil) {
        return;
    }

    idPerfilAtivo = perfil.id;
    perfilAtual = null;

    recompensas = perfil.recompensas;

    atualizarPainelCrianca();
    mostrarTela("telaPainelCrianca");
}

function atualizarPainelCrianca() {
    const perfil = obterPerfilAtivo();

    if (!perfil) {
        return;
    }

    document.getElementById(
        "boasVindasCrianca"
    ).textContent = `Olá, ${perfil.nome}! 🌟`;

    document.getElementById(
        "nomePerfilAtivo"
    ).textContent = perfil.nome;

    document.getElementById(
        "nivelPerfilAtivo"
    ).textContent = NOMES_NIVEIS[perfil.nivel];

    mostrarFotoOuAvatar(
        document.getElementById("fotoPerfilAtivo"),
        perfil
    );

    document.getElementById(
        "moedasPainelCrianca"
    ).textContent = perfil.recompensas.moedas;

    document.getElementById(
        "trofeusPainelCrianca"
    ).textContent = perfil.recompensas.trofeus.length;

    document.getElementById(
        "totalQuestoesPerfil"
    ).textContent = perfil.recompensas.totalQuestoes;

    document.getElementById(
        "totalAcertosPerfil"
    ).textContent = perfil.recompensas.totalAcertos;

    document.getElementById(
        "totalAtividadesPerfil"
    ).textContent = perfil.atividades.length;
}


/* ==========================================
   35. CADASTRO E EDIÇÃO
========================================== */

function abrirCadastro(perfil = null) {
    idPerfilEmEdicao = perfil ? perfil.id : null;

    fotoPersistida = perfil
        ? perfil.foto
        : null;

    formulario.reset();
    mensagemErro.textContent = "";

    document.getElementById("nome").value =
        perfil ? perfil.nome : "";

    document.getElementById("idade").value =
        perfil ? perfil.idade : "";

    document.getElementById("nivelInicial").value =
        perfil ? String(perfil.nivel) : "1";

    document.querySelectorAll(
        'input[name="operacao"]'
    ).forEach(campo => {
        campo.checked = !!perfil &&
            perfil.dificuldades.includes(campo.value);
    });

    avatarImagem.hidden = !fotoPersistida;
    avatarTexto.hidden = !!fotoPersistida;

    if (fotoPersistida) {
        avatarImagem.src = fotoPersistida;
    } else {
        avatarImagem.removeAttribute("src");
    }

    fotoCrianca.value = "";

    document.getElementById(
        "btnSalvarPerfil"
    ).textContent = perfil
        ? "💾 Salvar alterações"
        : "💾 Salvar perfil e começar";

    mostrarTela("formCadastro");
}

// Armazena uma versão reduzida da foto.
fotoCrianca.addEventListener(
    "change",
    async function () {
        const arquivo = fotoCrianca.files[0];

        if (
            !arquivo ||
            !arquivo.type.startsWith("image/")
        ) {
            return;
        }

        if (arquivo.size > 2 * 1024 * 1024) {
            mensagemErro.textContent =
                "A foto deve ter até 2 MB.";

            fotoCrianca.value = "";
            return;
        }

        try {
            fotoPersistida = await reduzirFoto(arquivo);

        } catch (erro) {
            console.warn(
                "Foto não pôde ser preparada:",
                erro
            );

            fotoPersistida = null;

            mensagemErro.textContent =
                "Não foi possível processar a foto. " +
                "Use um avatar.";
        }
    }
);

async function reduzirFoto(arquivo) {
    const imagem = await createImageBitmap(arquivo);

    try {
        const tamanho = 160;

        const escala = Math.min(
            tamanho / imagem.width,
            tamanho / imagem.height,
            1
        );

        const largura = Math.max(
            1,
            Math.round(imagem.width * escala)
        );

        const altura = Math.max(
            1,
            Math.round(imagem.height * escala)
        );

        const canvas = document.createElement("canvas");

        canvas.width = largura;
        canvas.height = altura;

        canvas.getContext("2d").drawImage(
            imagem,
            0,
            0,
            largura,
            altura
        );

        return canvas.toDataURL("image/jpeg", 0.65);

    } finally {
        imagem.close();
    }
}


/* ==========================================
   36. ATIVIDADE E HISTÓRICO POR PERFIL
========================================== */

function comecarAtividadeDoPerfil() {
    const perfil = obterPerfilAtivo();

    if (!perfil) {
        return;
    }

    recompensas = perfil.recompensas;

    iniciarAtividade({
        nome: perfil.nome,
        idade: perfil.idade,
        dificuldades: perfil.dificuldades,
        nivelInicial: perfil.nivel
    });
}

function registrarAtividadeNoPerfil() {
    if (relatorioJaSalvo) {
        return;
    }

    const perfil = obterPerfilAtivo();

    if (!perfil) {
        return;
    }

    relatorioJaSalvo = true;
    perfil.nivel = nivelAtual;

    if (historico.length > 0) {
        perfil.atividades.push({
            id: criarIdentificador(),

            data: new Date().toISOString(),

            nivelInicial: nivelNoInicioDaAtividade,

            nivelFinal: nivelAtual,

            respostas: historico.map(
                registro => ({ ...registro })
            )
        });
    }

    salvarBancoPerfis();
}


/* ==========================================
   37. COLEÇÃO INDIVIDUAL
========================================== */

function atualizarColecao() {
    const perfil = obterPerfilAtivo();

    if (!perfil) {
        return;
    }

    document.getElementById(
        "saldoColecao"
    ).textContent = recompensas.moedas;

    const destinoAvatares = document.getElementById(
        "listaAvataresColecao"
    );

    const destinoTrofeus = document.getElementById(
        "listaTrofeusColecao"
    );

    montarLojaAvatares();
    montarTrofeus();

    destinoAvatares.replaceChildren();

    destinoTrofeus.replaceChildren(
        ...Array.from(listaTrofeus.children).map(
            no => no.cloneNode(true)
        )
    );

    for (const avatar of CATALOGO_AVATARES) {
        const desbloqueado =
            recompensas.avataresDesbloqueados.includes(
                avatar.id
            );

        const selecionado =
            recompensas.avatarSelecionado === avatar.id;

        const cartao = criarTexto(
            "div",
            "",
            "cartao-avatar" +
            (selecionado ? " selecionado" : "")
        );

        const botao = criarTexto(
            "button",
            selecionado
                ? "✅ Selecionado"
                : desbloqueado
                    ? "Usar avatar"
                    : `🪙 Desbloquear: ${avatar.preco}`,
            "botao-avatar"
        );

        botao.type = "button";

        botao.disabled =
            selecionado ||
            (!desbloqueado &&
                recompensas.moedas < avatar.preco);

        botao.addEventListener("click", () => {
            if (!desbloqueado) {
                if (recompensas.moedas < avatar.preco) {
                    return;
                }

                recompensas.moedas -= avatar.preco;

                recompensas.avataresDesbloqueados.push(
                    avatar.id
                );
            }

            recompensas.avatarSelecionado = avatar.id;

            salvarRecompensas();
            atualizarRecompensasNaTela();
            atualizarPainelCrianca();
            atualizarColecao();
        });

        cartao.append(
            criarTexto(
                "span",
                avatar.emoji,
                "emoji-avatar"
            ),

            criarTexto(
                "span",
                avatar.nome,
                "nome-avatar"
            ),

            botao
        );

        destinoAvatares.appendChild(cartao);
    }
}


/* ==========================================
   38. ACESSO LOCAL DO RESPONSÁVEL
========================================== */

// A senha protege apenas a interface.
// Para segurança real, seria necessário
// um servidor com autenticação.

async function calcularHashSenha(valor) {
    if (
        !globalThis.crypto ||
        !crypto.subtle
    ) {
        throw new Error(
            "Abra o projeto pelo Live Server " +
            "(localhost) ou HTTPS."
        );
    }

    const bytes = new TextEncoder().encode(valor);

    const resultado = await crypto.subtle.digest(
        "SHA-256",
        bytes
    );

    return Array.from(
        new Uint8Array(resultado)
    )
        .map(
            byte => byte.toString(16).padStart(2, "0")
        )
        .join("");
}

function abrirAcessoResponsavel() {
    acessoResponsavelLiberado = false;

    document.getElementById(
        "senhaResponsavel"
    ).value = "";

    document.getElementById(
        "mensagemAcessoResponsavel"
    ).textContent = dadosPerfis.responsavel
        ? "Digite a senha do responsável."
        : "Primeiro acesso: crie uma senha " +
          "com pelo menos 8 caracteres.";

    mostrarTela("telaAcessoResponsavel");
}

async function autenticarResponsavel(evento) {
    evento.preventDefault();

    const senha = document.getElementById(
        "senhaResponsavel"
    ).value;

    const mensagem = document.getElementById(
        "mensagemAcessoResponsavel"
    );

    if (senha.length < 8) {
        mensagem.textContent =
            "A senha deve ter pelo menos 8 caracteres.";

        return;
    }

    try {
        if (!dadosPerfis.responsavel) {
            const sal = criarIdentificador();

            const hash = await calcularHashSenha(
                `${sal}:${senha}`
            );

            dadosPerfis.responsavel = {
                sal,
                hash
            };

            if (!salvarBancoPerfis()) {
                dadosPerfis.responsavel = null;
                return;
            }

        } else {
            const { sal, hash } =
                dadosPerfis.responsavel;

            const calculado = await calcularHashSenha(
                `${sal}:${senha}`
            );

            if (calculado !== hash) {
                mensagem.textContent =
                    "Senha incorreta.";

                return;
            }
        }

        acessoResponsavelLiberado = true;

        document.getElementById(
            "senhaResponsavel"
        ).value = "";

        preencherAreaResponsavel();
        mostrarTela("telaResponsavel");

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}


/* ==========================================
   39. ANÁLISE DO HISTÓRICO COMPLETO
========================================== */

function reunirRespostas(perfil) {
    return perfil.atividades.flatMap(
        atividade =>
            Array.isArray(atividade.respostas)
                ? atividade.respostas
                : []
    );
}

function calcularDesempenhoOperacoes(registros) {
    const resultado = {};

    for (const operacao of TODAS_OPERACOES) {
        resultado[operacao] = calcularResumo(
            registros.filter(
                item => item.operacao === operacao
            )
        );
    }

    return resultado;
}

function preencherAreaResponsavel() {
    if (!acessoResponsavelLiberado) {
        return;
    }

    const seletor = document.getElementById(
        "selecionarCriancaRelatorio"
    );

    const idAnterior = seletor.value;

    seletor.replaceChildren(
        new Option("Selecione um perfil", "")
    );

    for (const perfil of dadosPerfis.perfis) {
        seletor.add(
            new Option(perfil.nome, perfil.id)
        );
    }

    seletor.value = dadosPerfis.perfis.some(
        perfil => perfil.id === idAnterior
    )
        ? idAnterior
        : (dadosPerfis.perfis[0]?.id || "");

    atualizarRelatorioResponsavel();
}

function atualizarRelatorioResponsavel() {
    if (!acessoResponsavelLiberado) {
        return;
    }

    const id = document.getElementById(
        "selecionarCriancaRelatorio"
    ).value;

    const perfil = dadosPerfis.perfis.find(
        item => item.id === id
    );

    const informacoes = document.getElementById(
        "informacoesCriancaResponsavel"
    );

    const evolucao = document.getElementById(
        "graficoEvolucao"
    );

    const historicoDestino = document.getElementById(
        "historicoAtividades"
    );

    const recomendacoes = document.getElementById(
        "recomendacoesResponsavel"
    );

    const barras = document.getElementById(
        "graficoOperacoesResponsavel"
    );

    for (const destino of [
        informacoes,
        evolucao,
        historicoDestino,
        recomendacoes,
        barras
    ]) {
        destino.replaceChildren();
    }

    const registros = perfil
        ? reunirRespostas(perfil)
        : [];

    const resumo = calcularResumo(registros);

    document.getElementById(
        "respTotalAtividades"
    ).textContent = perfil
        ? perfil.atividades.length
        : 0;

    document.getElementById(
        "respTotalAcertos"
    ).textContent = resumo.acertos;

    document.getElementById(
        "respTotalErros"
    ).textContent = resumo.erros;

    document.getElementById(
        "respPercentual"
    ).textContent = `${resumo.percentual}%`;

    document.getElementById(
        "graficoCircularResponsavel"
    ).style.setProperty(
        "--percentual",
        `${resumo.percentual}%`
    );

    document.getElementById(
        "textoAproveitamentoResponsavel"
    ).textContent =
        `Aproveitamento acumulado: ` +
        `${resumo.acertos} acertos em ` +
        `${resumo.total} questões.`;

    document.getElementById(
        "btnEditarPerfil"
    ).disabled = !perfil;

    document.getElementById(
        "btnExcluirPerfil"
    ).disabled = !perfil;

    if (!perfil) {
        informacoes.appendChild(
            criarTexto(
                "p",
                "Selecione uma criança para visualizar os dados."
            )
        );

        return;
    }

    informacoes.append(
        criarTexto(
            "p",
            `Nome: ${perfil.nome}`
        ),

        criarTexto(
            "p",
            `Idade: ${perfil.idade} ano(s)`
        ),

        criarTexto(
            "p",
            `Nível atual: ${NOMES_NIVEIS[perfil.nivel]}`
        ),

        criarTexto(
            "p",
            "Dificuldades informadas: " +
            (
                perfil.dificuldades
                    .map(nomeOperacao)
                    .join(", ") || "Nenhuma"
            )
        )
    );

    const desempenho = calcularDesempenhoOperacoes(
        registros
    );

    for (const operacao of TODAS_OPERACOES) {
        criarBarraDesempenho(
            barras,
            `${EMOJIS_OPERACOES[operacao]} ` +
            nomeOperacao(operacao),
            desempenho[operacao],
            CORES_OPERACOES[operacao]
        );
    }

    if (!perfil.atividades.length) {
        evolucao.appendChild(
            criarTexto(
                "p",
                "Nenhuma atividade registrada ainda.",
                "mensagem-vazia"
            )
        );

        historicoDestino.appendChild(
            criarTexto(
                "p",
                "O histórico aparecerá após concluir uma atividade.",
                "mensagem-vazia"
            )
        );

    } else {
        perfil.atividades.forEach(
            (atividade, indice) => {
                const resultado = calcularResumo(
                    atividade.respostas || []
                );

                const item = criarTexto(
                    "div",
                    "",
                    "item-evolucao"
                );

                item.appendChild(
                    criarTexto(
                        "strong",
                        `Atividade ${indice + 1}`
                    )
                );

                const trilho = criarTexto(
                    "div",
                    "",
                    "trilho-barra"
                );

                const barra = criarTexto(
                    "div",
                    "",
                    "barra-progresso"
                );

                barra.style.width =
                    `${resultado.percentual}%`;

                barra.style.backgroundColor =
                    "#22c55e";

                trilho.appendChild(barra);

                item.append(
                    trilho,

                    criarTexto(
                        "p",
                        `${resultado.percentual}% de acertos ` +
                        `(${resultado.acertos}/${resultado.total})`
                    )
                );

                evolucao.appendChild(item);
            }
        );

        [...perfil.atividades]
            .reverse()
            .forEach((atividade, indice) => {
                const resultado = calcularResumo(
                    atividade.respostas || []
                );

                const dataAtividade = new Date(
                    atividade.data
                );

                const dataFormatada =
                    Number.isNaN(dataAtividade.getTime())
                        ? "Data indisponível"
                        : dataAtividade.toLocaleString("pt-BR");

                const cartao = criarTexto(
                    "div",
                    "",
                    "cartao-historico"
                );

                cartao.append(
                    criarTexto(
                        "strong",
                        `Atividade ${
                            perfil.atividades.length - indice
                        }`
                    ),

                    criarTexto(
                        "p",
                        dataFormatada
                    ),

                    criarTexto(
                        "p",
                        `${resultado.total} questões · ` +
                        `${resultado.acertos} acertos · ` +
                        `${resultado.erros} erros · ` +
                        `${resultado.percentual}%`
                    ),

                    criarTexto(
                        "p",
                        `Nível: ` +
                        `${
                            NOMES_NIVEIS[
                                atividade.nivelInicial
                            ] || "—"
                        } → ` +
                        `${
                            NOMES_NIVEIS[
                                atividade.nivelFinal
                            ] || "—"
                        }`
                    )
                );

                historicoDestino.appendChild(cartao);
            });
    }

    const dificuldades = Object.entries(
        desempenho
    )
        .filter(([, dados]) =>
            dados.total >= MINIMO_AMOSTRAS &&
            dados.erros > 0
        )
        .sort((a, b) =>
            b[1].taxaErros - a[1].taxaErros
        );

    recomendacoes.appendChild(
        criarTexto(
            "p",
            dificuldades.length
                ? `Vale praticar mais: ${
                    nomeOperacao(dificuldades[0][0])
                }.`
                : "Ainda não há amostras suficientes " +
                  "para identificar uma operação prioritária."
        )
    );

    recomendacoes.appendChild(
        criarTexto(
            "p",
            "Estas análises indicam padrões de respostas " +
            "e não representam diagnóstico."
        )
    );
}


/* ==========================================
   40. GERENCIAMENTO DE PERFIS
========================================== */

function editarPerfilSelecionado() {
    if (!acessoResponsavelLiberado) {
        return;
    }

    const id = document.getElementById(
        "selecionarCriancaRelatorio"
    ).value;

    const perfil = dadosPerfis.perfis.find(
        item => item.id === id
    );

    if (perfil) {
        abrirCadastro(perfil);
    }
}

function excluirPerfilSelecionado() {
    if (!acessoResponsavelLiberado) {
        return;
    }

    const id = document.getElementById(
        "selecionarCriancaRelatorio"
    ).value;

    const perfil = dadosPerfis.perfis.find(
        item => item.id === id
    );

    if (!perfil) {
        return;
    }

    if (!confirm(
        `Excluir permanentemente ${perfil.nome} ` +
        "e todas as atividades deste navegador?"
    )) {
        return;
    }

    const copia = [...dadosPerfis.perfis];

    dadosPerfis.perfis = dadosPerfis.perfis.filter(
        item => item.id !== id
    );

    if (!salvarBancoPerfis()) {
        dadosPerfis.perfis = copia;
        return;
    }

    if (idPerfilAtivo === id) {
        idPerfilAtivo = null;
        perfilAtual = null;

        recompensas =
            criarEstadoInicialRecompensas();
    }

    preencherAreaResponsavel();
}


/* ==========================================
   41. EVENTOS DAS NOVAS TELAS
========================================== */

document.getElementById(
    "btnCriarPerfil"
).addEventListener("click", () => {
    abrirCadastro();
});

document.getElementById(
    "btnCancelarCadastro"
).addEventListener("click", () => {
    idPerfilEmEdicao = null;

    if (acessoResponsavelLiberado) {
        preencherAreaResponsavel();
        mostrarTela("telaResponsavel");

    } else {
        listarPerfis();
        mostrarTela("telaPerfis");
    }
});

document.getElementById(
    "btnVoltarPerfis"
).addEventListener("click", () => {
    idPerfilAtivo = null;
    perfilAtual = null;

    listarPerfis();
    mostrarTela("telaPerfis");
});

document.getElementById(
    "btnIniciarAtividade"
).addEventListener(
    "click",
    comecarAtividadeDoPerfil
);

document.getElementById(
    "btnVoltarPainelCrianca"
).addEventListener("click", () => {
    atualizarPainelCrianca();
    mostrarTela("telaPainelCrianca");
});

document.getElementById(
    "btnColecaoCrianca"
).addEventListener("click", () => {
    atualizarColecao();
    mostrarTela("telaColecao");
});

document.getElementById(
    "btnSairColecao"
).addEventListener("click", () => {
    atualizarPainelCrianca();
    mostrarTela("telaPainelCrianca");
});

document.getElementById(
    "btnAreaResponsavel"
).addEventListener(
    "click",
    abrirAcessoResponsavel
);

document.getElementById(
    "formAcessoResponsavel"
).addEventListener(
    "submit",
    autenticarResponsavel
);

document.getElementById(
    "btnVoltarAcesso"
).addEventListener("click", () => {
    listarPerfis();
    mostrarTela("telaPerfis");
});

document.getElementById(
    "selecionarCriancaRelatorio"
).addEventListener(
    "change",
    atualizarRelatorioResponsavel
);

document.getElementById(
    "btnEditarPerfil"
).addEventListener(
    "click",
    editarPerfilSelecionado
);

document.getElementById(
    "btnExcluirPerfil"
).addEventListener(
    "click",
    excluirPerfilSelecionado
);

document.getElementById(
    "btnSairResponsavel"
).addEventListener("click", () => {
    acessoResponsavelLiberado = false;
    idPerfilAtivo = null;
    perfilAtual = null;

    listarPerfis();
    mostrarTela("telaPerfis");
});


/* ==========================================
   42. INICIALIZAÇÃO FINAL DA ETAPA 4
========================================== */

listarPerfis();
mostrarTela("telaPerfis");
