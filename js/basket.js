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
    calculateTotalPrice(basket);
    basketCount(basket);
  }
});

function calculateTotalPrice(data) {
  const totalPrice = data.reduce((sum, item) => {
    return sum + parseFloat(item.price);
  }, 0);
  const total = document.querySelector(".price__count");
  total.textContent = totalPrice;
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
          <div class="cart__img">
              <img src="./img/${image}" alt="${title}">
          </div>
          <div class="cart__title">${title}</div>
          <div class="cart__title">${author}</div>
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
      console.log(cartItem);
      if (cartItem) {
        const id = parseInt(cartItem.dataset.productId);
        cartItem.remove();
        removeDataById(basket, id);
        calculateTotalPrice(basket);
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
    // if (event.target.classList.contains('cart__minus') || event.target.classList.contains('cart__plus')) {
        const cartItem = event.target.closest('.cart__product');
        const countElement = cartItem.querySelector('.cart__count');
        let count = parseInt(countElement.textContent, 10);
        const id = parseInt(cartItem.dataset.productId);
        const priceEl = cartItem.querySelector('.cart__price');
        const stock = basket[id-1].stock;
        
        const price = parseFloat(priceEl.textContent.replace(/[^\d.-]/g, ''));

        if (event.target.classList.contains('cart__minus')) {
            if (count > 1) { // Assuming the minimum quantity is 1
                count--;
                // priceEl.textContent = `${(basket[id-1].price * count).toFixed(2)}$`;
                priceEl.textContent = `${(price * count).toFixed(2)}$`;
            }
        } else if (event.target.classList.contains('cart__plus')) {
            if (stock > count) {
                
                count++;
                // priceEl.textContent = `${(basket[id-1].price * count).toFixed(2)}$`;
                priceEl.textContent = `${(price * count).toFixed(2)}$`;
            }
        }
        
        countElement.textContent = count;
    // }
});
