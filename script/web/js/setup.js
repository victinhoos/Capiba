// ==========================================
// ELEMENTOS PRINCIPAIS
// ==========================================

let etapaAtual = 0;

const paginas = document.querySelectorAll(".page");
const etapas = document.querySelectorAll(".step");

const progressLine = document.getElementById("progressLine");

const botaoVoltar = document.getElementById("back");
const botaoAvancar = document.getElementById("next");

const nome = document.getElementById("nome");
const tema = document.getElementById("tema");
const fonte = document.getElementById("fonte");

const fontValue = document.getElementById("fontValue");
const previewText = document.getElementById("previewText");


// ==========================================
// VALIDAÇÃO DOS ELEMENTOS
// ==========================================

if (
    paginas.length !== 5 ||
    etapas.length !== 5 ||
    !progressLine ||
    !botaoVoltar ||
    !botaoAvancar ||
    !nome ||
    !tema ||
    !fonte
) {
    console.error("Erro: estrutura do assistente incompleta.");
    throw new Error("Não foi possível inicializar o setup.");
}


// ==========================================
// TEMA VISUAL
// ==========================================

function aplicarTema(valor) {
    document.documentElement.setAttribute("data-theme", valor);
}

tema.addEventListener("change", () => {
    aplicarTema(tema.value);
});


// ==========================================
// ACESSIBILIDADE
// ==========================================

function obterTamanhoFonte(valor) {

    if (valor === 12) {
        return "Pequeno";
    }

    if (valor === 18) {
        return "Médio";
    }

    return "Grande";
}


function atualizarFonte() {

    const tamanho = Number(fonte.value);

    fontValue.textContent = `${tamanho}px`;

    previewText.style.fontSize = `${tamanho}px`;
}

fonte.addEventListener("input", atualizarFonte);


// ==========================================
// ATUALIZAÇÃO DA REVISÃO
// ==========================================

function atualizarRevisao() {

    const nomeUsuario = nome.value.trim();
    const valorTema = tema.value;
    const tamanho = Number(fonte.value);

    document.getElementById("reviewNome").textContent =
        nomeUsuario || "Não informado";

    document.getElementById("reviewTema").textContent =
        valorTema === "light" ? "Claro" : "Escuro";

    document.getElementById("reviewFonte").textContent =
        `${obterTamanhoFonte(tamanho)} (${tamanho}px)`;
}


// ==========================================
// ATUALIZAR TELA
// ==========================================

function atualizarTela() {

    paginas.forEach((pagina, index) => {
        pagina.classList.toggle("active", index === etapaAtual);
    });

    etapas.forEach((etapa, index) => {

        etapa.classList.remove("active", "completed");

        if (index < etapaAtual) {
            etapa.classList.add("completed");
        }

        if (index === etapaAtual) {
            etapa.classList.add("active");
        }

    });

    // Barra de progresso
    const progresso =
        (etapaAtual / (paginas.length - 1)) * 100;

    progressLine.style.width = `${progresso}%`;

    // Botão voltar
    botaoVoltar.disabled = etapaAtual === 0;

    // Botão avançar
    botaoAvancar.textContent =
        etapaAtual === paginas.length - 1
            ? "Finalizar"
            : etapaAtual === 0
                ? "Vamos lá!"
                : "Próximo";

    // Atualizar revisão
    if (etapaAtual === paginas.length - 1) {
        atualizarRevisao();
    }
}


// ==========================================
// AVANÇAR
// ==========================================

function avancar() {

    // Validar nome
    if (etapaAtual === 1 && !nome.value.trim()) {

        alert("Por favor, informe seu nome.");

        nome.focus();

        return;
    }

    if (etapaAtual < paginas.length - 1) {

        etapaAtual++;

        atualizarTela();

    } else {

        salvar();

    }
}


// ==========================================
// VOLTAR
// ==========================================

function voltar() {

    if (etapaAtual > 0) {

        etapaAtual--;

        atualizarTela();

    }
}


// ==========================================
// SALVAR CONFIGURAÇÕES
// ==========================================

async function salvar() {

    const nomeUsuario = nome.value.trim();
    const valorTema = tema.value;
    const tamanhoFonte = Number(fonte.value);

    botaoAvancar.disabled = true;
    botaoAvancar.textContent = "Salvando...";

    try {

        if (!window.pywebview || !window.pywebview.api) {
            throw new Error("A comunicação com o Python não está disponível.");
        }

        const resposta = await window.pywebview.api.salvar_preferencias(
            nomeUsuario,
            valorTema,
            tamanhoFonte
        );

        if (resposta.sucesso) {

            window.location.href = "index.html";

        } else {

            alert(
                resposta.mensagem ||
                "Não foi possível salvar as configurações."
            );

        }

    } catch (erro) {

        console.error("Erro ao salvar:", erro);

        alert("Erro ao salvar as configurações: " + erro.message);

    } finally {

        botaoAvancar.disabled = false;

        if (etapaAtual === paginas.length - 1) {
            botaoAvancar.textContent = "Finalizar";
        }

    }
}


// ==========================================
// EVENTOS
// ==========================================

botaoAvancar.addEventListener("click", avancar);
botaoVoltar.addEventListener("click", voltar);


// ==========================================
// INICIALIZAÇÃO
// ==========================================

function iniciarSetup() {

    aplicarTema(tema.value);

    atualizarFonte();

    atualizarTela();

}

iniciarSetup();