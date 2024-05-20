

import { getDataFromIndexedDB } from './dataBase.js';

let basket = [];
const cart = document.querySelector('.cart');


getDataFromIndexedDB('basket', function (error, data) {
    if (error) {
        console.error('Ошибка при получении данных из IndexedDB:', error);
    } else {
        basket = data;
        getBasket(basket);
        removeProduct();
        calculateTotalPrice(basket);
    }
});

function calculateTotalPrice(data) {
    const totalPrice = data.reduce((sum, item) => {
            return sum + parseFloat(item.price);
        }, 0);
        const total = document.querySelector('.price__count');
        total.textContent = totalPrice;
}

function getBasket(data) {

    if (!data || !data.length) {
        console.error('ERROR');
        return;
    }
    console.log('getBasket');
    renderProductsBasket(data);
}

const btnEnd = document.querySelector('.btn-send');
btnEnd.addEventListener('click', () => {
// console.log('clockccc');

});


function renderProductsBasket(arr) {
    arr.forEach(card => {
        const { id, title, author, price, image } = card;
        const cardItem =
            `
      <div class="cart__product" data-product-id="${id}">
          <div class="cart__img">
              <img src="./img/${image}" alt="${title}">
          </div>
          <div class="cart__title">${title}</div>
          <div class="cart__title">${author}</div>
          <div class="cart__block-btns">
              <div class="cart__minus">-</div>
              <div class="cart__count">1</div>
              <div class="cart__plus">+</div>
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
    const btnRemove = document.querySelectorAll('.remove-btn');
    btnRemove.forEach(button => {
        console.log(button);
        button.addEventListener('click', (event) => {
            const cartItem = event.target.closest('.cart__product');
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
    const itemIndex = data.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        data.splice(itemIndex, 1);
    }
}