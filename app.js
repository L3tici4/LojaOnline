const API_URL = 'http://localhost:3000/produtos';

const listaProdutosEl = document.getElementById('lista-produtos');
const itensCarrinhoEl = document.getElementById('itens-carrinho');
const totalCarrinhoEl = document.getElementById('total-carrinho');
const btnFinalizarCompra = document.getElementById('finalizar-compra');

let produtos = [];
let carrinho = {};

function formatarPreco(preco) {
  return preco.toFixed(2).replace('.', ',');
}

async function carregarProdutos() {
  const res = await fetch(API_URL);
  produtos = await res.json();
  exibirProdutos();
}

btnFinalizarCompra.addEventListener('click', () => {
  if (Object.keys(carrinho).length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  alert('Compra finalizada com sucesso!');
  carrinho = {};
  atualizarCarrinho();
});

function exibirProdutos() {
  listaProdutosEl.innerHTML = '';
  produtos.forEach(produto => {
    const div = document.createElement('div');
    div.className = 'produto';
    div.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" />
      <div class="produto-details">
        <h3>${produto.nome}</h3>
        <p>R$ ${formatarPreco(produto.preco)}</p>
        <button data-id="${produto.id}"> Adicionar ao Carrinho </button>
      </div>
    `;
    listaProdutosEl.appendChild(div);

    div.querySelector('button').addEventListener('click', () => adicionarAoCarrinho(produto.id));
  });
}

function adicionarAoCarrinho(id) {
  if (!carrinho[id]) {
    carrinho[id] = 1;
  } else {
    carrinho[id]++;
  }
  atualizarCarrinho();
  
}

function removerDoCarrinho(id) {
  if (carrinho[id]) {
    carrinho[id]--;
    if (carrinho[id] <= 0) {
      delete carrinho[id];
    }
    atualizarCarrinho();
  }
}

function atualizarCarrinho() {
  itensCarrinhoEl.innerHTML = '';
  let total = 0;

  Object.keys(carrinho).forEach(id => {
    const quantidade = carrinho[id];
    const produto = produtos.find(p => p.id === parseInt(id));
    if (!produto) return;

    const li = document.createElement('li');
    li.textContent = `${produto.nome} x ${quantidade} = R$ ${formatarPreco(produto.preco * quantidade)}`;

    const btnRemover = document.createElement('span');
    btnRemover.textContent = '[Remover]';
    btnRemover.className = 'btn-remove';
    btnRemover.onclick = () => removerDoCarrinho(produto.id);

    li.appendChild(btnRemover);
    itensCarrinhoEl.appendChild(li);

    total += produto.preco * quantidade;
  });

  totalCarrinhoEl.textContent = formatarPreco(total);
}

carregarProdutos();
