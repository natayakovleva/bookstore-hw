'use strict'

let productsData = [];
let countOfCardsOnScrean = 5;
let firstSkip = 0;
const cards = document.querySelector('.cards');



getData();




// Получение товаров (JSON)
async function getData() {
  try {
    if (!productsData.length) {     // если массив не пустой
      const res = await fetch('../data/products.json');
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      productsData = await res.json();
      
    }
  // console.log(productsData);
  getProducts(productsData, firstSkip, countOfCardsOnScrean);

  } catch (err) {
    console.log(err.message);
  }
}


function getProducts(data, skip, take) {
  // проверяем, является ли переменная data пустой или неопределенной (null, undefined) 

  if (!data || !data.length) {   
    console.error('ERROR');
    return; 
  }

  const firstEl = skip;
  const lastEL = skip + take;
  const addcards = data.slice(firstEl, lastEL); // отрезаем 
  firstSkip = lastEL;

  createCards(addcards);
}



// Рендер карточки
function createCards(data) {
  // console.log(data);
  data.forEach(card => {
    //  console.log(card);
      const { id, title, author, price, image } = card;
      //  console.log(id, title, author, price, image);

  const cardItem = 
    `
              <div class="card" data-product-id="${id}">
                  <div class="card__top">
                      <a href="#" class="card__link-img">
                          <img class="card__image"
                              src="./img/${image}"
                              alt="${title}"
                          />
                      </a>
                  </div>
                  <div class="card__bottom">
                      <div class="card__inform">
                          <div class="card__title">${title}</div>
                          <div class card__author">by ${author}</div>
                          <div class card__price">$${price}</div>
                      </div>
                      <button class="card__add">В корзину -  ${id}</button>
                  </div>
              </div>
          `;
      cards.insertAdjacentHTML('beforeend', cardItem);

});
}
