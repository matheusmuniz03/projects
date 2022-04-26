const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const local = localStorage.getItem('key');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 04:
const setItems = () => {
  localStorage.setItem('key', JSON
  .stringify(document.getElementsByClassName('cart__items')[0].innerHTML));
};

// Requisito 03:
function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  setItems();
}

const getItems = () => {
  const result = document.querySelector('ol');
  result.innerHTML = JSON.parse(localStorage.getItem('key'));
  result.addEventListener('click', cartItemClickListener);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Começando o Projeto
async function listarProdutos(url) {
  return fetch(url)
    .then((objeto) => objeto.json())
    .then((lista) => lista.results.forEach(({ id, title, thumbnail }) => {
      const output = {
        sku: id,
        name: title,
        image: thumbnail,
      };
      const sectionItens = document.querySelector('.items');
      const itemElement = createProductItemElement(output);
      sectionItens.append(itemElement);
    }))
    .catch(() => console.error('Endereço não foi encontrado'));
}

// Requisito 02:
async function acharIDProduto(e) {
  const itemID = getSkuFromProductItem(e);
  const idAPI = `https://api.mercadolibre.com/items/${itemID}`;

  return fetch(idAPI)
    .then((objeto) => objeto.json())
    .then(({ id, title, price }) => {
      const output = {
        sku: id,
        name: title,
        salePrice: price,
      };
      const ol = document.querySelector('.cart__items');
      ol.append(createCartItemElement(output));
      setItems();
    });
}

function addEventosParaBotao() {
  const itemsLista = document.querySelectorAll('.item');
  const loading = document.querySelector('.loading');

  itemsLista.forEach((item) => item.lastChild.addEventListener('click', (() => {
    acharIDProduto(item);
  })));
  loading.remove();
}

// Window.onload
window.onload = () => { 
  if (local) {
    getItems();
  }
  listarProdutos(api)
    .then(() => addEventosParaBotao())
    .then(() => {
      const botaoEsvaziar = document.getElementsByClassName('empty-cart')[0];
      botaoEsvaziar.addEventListener('click', () => {
        const limparOl = document.querySelector('ol');
        limparOl.innerText = '';
      });
    })
    .catch(() => console.error('Endereço não encontrado.'));
};
