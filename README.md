# Dashboard de Cotações

Esse projeto eu fiz porque queria entender como um site puxa dados de fora e mostra na tela sem ficar recarregando, tipo aqueles painéis de cotação que a gente vê por aí. No fim virou um dashboard que mostra Dólar, Euro e Bitcoin em real, pegando os valores de uma API pública.

Fiz tudo em HTML, CSS e JavaScript puro, sem framework nenhum. Era isso que eu queria mesmo: mexer no JavaScript no osso pra entender o que tá acontecendo.

## O que ele faz

- Mostra 3 cards com Dólar, Euro e Bitcoin em real
- Pega os valores na hora, direto da AwesomeAPI
- Atualiza os números sem recarregar a página
- Tem um botão de atualizar e também atualiza sozinho a cada 60 segundos
- Mostra a variação do dia (verde se subiu, vermelho se caiu)
- Se a internet cair ou a API falhar, ele avisa em vez de travar

## O que usei

- HTML com CSS Grid e Flexbox no layout
- CSS com dark mode, variáveis de cor e uns efeitos leves nos cards
- JavaScript puro com `async/await` e `fetch`
- API: `https://economia.awesomeapi.com.br`

## Como rodar

É a parte mais fácil dos três, não precisa de servidor nem banco:

1. Dar dois cliques no `index.html` pra abrir no navegador. Ou
2. Abrir a pasta no VS Code e usar a extensão Live Server (botão "Go Live"), que é como eu prefiro porque recarrega sozinho quando eu mudo algo.

Precisa estar com internet, porque os valores vêm de uma API online.

## Arquivos

- `index.html` - a estrutura e os 3 cards
- `style.css` - o visual (dark mode, grid, hover)
- `script.js` - a parte que busca os dados e preenche os cards

## Desafios Técnicos e Soluções

### Entender a parte assíncrona do JavaScript

Esse foi o conceito que o projeto me fez entender de verdade. Buscar dado na internet demora, e o JavaScript não fica parado esperando (senão a página inteira travava). Ele dispara o pedido, continua o resto, e quando a resposta chega ele avisa.

No começo eu fiz `const dados = fetch(url)` e não deu certo, porque o que voltava era uma Promise (uma promessa de que o dado vai chegar) e não o dado. A solução foi o `async/await`: marco a função como `async` e ponho `await` antes do `fetch`. O `await` faz parecer que o código espera a resposta, mas pausa só aquela função, sem travar o resto. Ficou bem mais limpo do que ficar encadeando `.then()`.

Um detalhe que eu achei importante: o `fetch` entrega a resposta em duas etapas, então uso `await` duas vezes, uma pra esperar a resposta (`await fetch(...)`) e outra pra transformar em JSON (`await resposta.json()`).

### Tratar os erros

Depender de um serviço de fora quer dizer que uma hora ele vai falhar: cai a net, a API sai do ar, vem um dado estranho. Se eu não tratasse, o usuário ia ficar olhando "Carregando..." pra sempre.

Coloquei tudo num `try / catch / finally`. No `try` fica o caminho certo, no `catch` eu pego o erro e mostro um aviso (e pinto os cards de vermelho), e no `finally` eu reabilito o botão de qualquer jeito. Também aprendi a checar o `resposta.ok`, porque o `fetch` não considera erro 404 ou 500 como falha sozinho, eu mesmo tenho que olhar o status.

### Ler o JSON e jogar na tela

A API devolve as chaves meio coladas (`USDBRL`, `EURBRL`, `BTCBRL`) e o que eu quero é o campo `bid` (o valor de compra), que vem como texto. Então converto pra número com `parseFloat` antes de mostrar.

Pra mostrar como dinheiro (R$ 1.234,56) usei o `Intl.NumberFormat`, que já põe a vírgula, o ponto de milhar e o R$ sozinho. E pra colocar o valor no card certo sem recarregar, eu pego o elemento com `querySelector` e mudo o `textContent`. É isso que dá a sensação de tempo real.
