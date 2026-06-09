// Dashboard de cotacoes - JS puro.
// Pega Dolar, Euro e Bitcoin na AwesomeAPI com async/await + fetch.

const URL_API =
    "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL";
// TODO: quem sabe depois deixar escolher mais moedas

// a API devolve as chaves coladas (USDBRL, etc). meus cards usam
// data-moeda="USD", entao eu so somo "BRL" pra achar a chave certa.
function chaveDaApi(moeda) {
    return moeda + "BRL";
}

// formata numero como dinheiro brasileiro (R$ 1.234,56)
const formatadorBRL = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

// funcao principal: busca os dados e atualiza a tela.
// async porque precisa esperar a internet sem travar a pagina.
async function carregarCotacoes() {
    const btn = document.getElementById("btnAtualizar");
    const status = document.getElementById("ultimaAtualizacao");

    btn.disabled = true;
    status.textContent = "Atualizando...";

    try {
        // dispara o pedido e espera a resposta
        const resposta = await fetch(URL_API);

        // o fetch nao trata 404/500 como erro sozinho, entao checo aqui
        if (!resposta.ok) {
            throw new Error("A API respondeu com status " + resposta.status);
        }

        // transforma o JSON em objeto
        const dados = await resposta.json();
        // console.log(dados); // deixei pra ver o que a API devolve

        // preenche cada card
        atualizarCard("USD", dados[chaveDaApi("USD")]);
        atualizarCard("EUR", dados[chaveDaApi("EUR")]);
        atualizarCard("BTC", dados[chaveDaApi("BTC")]);

        const agora = new Date().toLocaleTimeString("pt-BR");
        status.textContent = "Atualizado às " + agora;

    } catch (erro) {
        // cai aqui se faltar internet, a API cair, o JSON vier quebrado...
        console.error("Falha ao carregar cotações:", erro);
        status.textContent = "Erro ao carregar dados. Tente novamente.";
        marcarTodosComoErro();
    } finally {
        // reabilita o botao de qualquer jeito
        btn.disabled = false;
    }
}

// joga os dados de uma moeda no card dela
function atualizarCard(moeda, info) {
    const card = document.querySelector('.card[data-moeda="' + moeda + '"]');
    if (!card || !info) {
        return;
    }

    card.classList.remove("erro");

    const elValor = card.querySelector("[data-valor]");
    const elVariacao = card.querySelector("[data-variacao]");

    // bid eh o valor de compra (vem como texto, converto pra numero)
    const valorCompra = parseFloat(info.bid);
    elValor.textContent = formatadorBRL.format(valorCompra);

    // pctChange eh a variacao do dia
    const variacao = parseFloat(info.pctChange);
    const sinal = variacao >= 0 ? "▲" : "▼";
    elVariacao.textContent = sinal + " " + Math.abs(variacao).toFixed(2) + "% hoje";

    // verde se subiu, vermelho se caiu
    elVariacao.classList.remove("subiu", "caiu");
    elVariacao.classList.add(variacao >= 0 ? "subiu" : "caiu");
}

// se der erro de rede, marca todos os cards
function marcarTodosComoErro() {
    document.querySelectorAll(".card").forEach(function (card) {
        card.classList.add("erro");
        card.querySelector("[data-valor]").textContent = "Indisponível";
        card.querySelector("[data-variacao]").textContent = "";
    });
}

// botao de atualizar
document.getElementById("btnAtualizar")
        .addEventListener("click", carregarCotacoes);

// carrega assim que abre
carregarCotacoes();

// e atualiza sozinho a cada 60 segundos
setInterval(carregarCotacoes, 60000);
