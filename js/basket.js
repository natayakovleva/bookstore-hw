import { getDataFromIndexedDB } from "./dataBase.js";
import { basketCount } from './generalFunction.js';


let basket = [];
const cart = document.querySelector(".cart");

getDataFromIndexedDB("basket", function (error, data) {
  if (error) {
    console.error("Error while receiving data from IndexedDB:", error);
  } else {
    basket = data;
    getBasket(basket);
    removeProduct();
    calculateTotalPrice();
    basketCount(basket);
  }
});

function calculateTotalPrice() {
  const totalEl = document.querySelector(".price__count");
  const priceEl = document.querySelectorAll('.cart__price span');
  let total = 0;

  priceEl.forEach(priceElement => {
    const priceText = priceElement.textContent;
    const price = parseFloat(priceText.replace('$', ''));
    total += price;
  });
  totalEl.textContent = total.toFixed(2);
}

function getBasket(data) {
  if (!data || !data.length) {
    console.error("ERROR");
    return;
  }

  renderProductsBasket(data);
}

// const btnEnd = document.querySelector(".btn-send");
// btnEnd.addEventListener("click", () => {
//   // console.log('clockccc');
// });

function renderProductsBasket(arr) {
  arr.forEach((card) => {
    const { id, title, author, price, image } = card;
    const cardItem = `
      <div class="cart__product" data-product-id="${id}">
        <div class="cart__inner">
          <div class="cart__img">
              <img src="./img/${image}" alt="${title}">
          </div>
          <div class="cart__title">${title}</div>
          <div class="cart__author">${author}</div>
          <div class="cart__block-btns">
            <button class="cart__minus">-</button>
            <div class="cart__count">1</div>
            <button class="cart__plus">+</button>
          </div>
          <div class="cart__price">
              <span>${price}$</span>
          </div>
          <button class="remove-btn">X</button>
        </div>
        <div>
          <p class="cart__message"></p>
        </div>
      </div>
      `;

    // cart.insertAdjacentHTML('beforeend', cardItem);
    cart.innerHTML += cardItem;
  });
}

// Удаление
function removeProduct() {
  const btnRemove = document.querySelectorAll(".remove-btn");
  btnRemove.forEach((button) => {

    button.addEventListener("click", (event) => {
      const cartItem = event.target.closest(".cart__product");
      
      if (cartItem) {
        const id = parseInt(cartItem.dataset.productId);
        cartItem.remove();
        removeDataById(basket, id);
        calculateTotalPrice();
      }
    });
  });
}

function removeDataById(data, id) {
  const itemIndex = data.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    data.splice(itemIndex, 1);
  }
}



cart.addEventListener('click', (event) => {
    
  // const total = document.querySelector(".price__count");
  const cartItem = event.target.closest('.cart__product');
  const countElement = cartItem.querySelector('.cart__count');
  const priceEl = cartItem.querySelector('.cart__price span');
  const message = cartItem.querySelector('.cart__message');



  const id = parseInt(cartItem.dataset.productId);
  let count = parseInt(countElement.textContent, 10);
  const product = basket.find(item => item.id === id);
  const stock = product.stock;
  const currentPrice = product.price;

  if (event.target.classList.contains('cart__minus')) {
    if (count > 1) { 
    count--;
    // priceEl.textContent = `${(currentPrice * count).toFixed(2)}$`;
    } else {
      message.textContent = `Unfortunately there are only ${stock} items in stock`;
    }
  } else if (event.target.classList.contains('cart__plus')) {
      if (stock > count) {
        count++;
        // priceEl.textContent = `${(currentPrice * count).toFixed(2)}$`;
    } else {
      message.textContent = `Unfortunately there are only ${stock} items in stock`;
    }
  }
  
        priceEl.textContent = `${(currentPrice * count).toFixed(2)}$`;
        countElement.textContent = count;
        calculateTotalPrice();
    // }
});


