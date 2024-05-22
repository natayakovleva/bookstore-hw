'use strict'
import { createCards } from './cards.js';
import { getFilters } from './filter.js';
import { setFilters } from './filter.js';
import { selectFilter } from './filter.js';
import { saveDataToIndexedDB } from './dataBase.js';
import { getDataFromIndexedDB } from "./dataBase.js";
import { basketCount } from './generalFunction.js';


let displayData = [];
let productsData = [];
let countOfCardsOnScrean = 5;
let firstSkip = 0;
const cards = document.querySelector('.cards');
const btnShowMoreCards = document.querySelector('.show-cards');


getDataFromIndexedDB("basket", function (error, data) {
  if (error) {
    console.error("Basket was empty", error);
  } else {
    basket = data;
    basketCount(basket);
    activeCards(basket);
  }
});

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
      displayData = JSON.parse(JSON.stringify(productsData));
    }
  // первое прорисовывание

  getProducts(basket, displayData, firstSkip, countOfCardsOnScrean);

  } catch (err) {
    console.log(err.message);
  }
}


function getProducts(basketData, data, skip, take) {
  // проверяем, является ли переменная data пустой или неопределенной (null, undefined) 
  if (!data || !data.length) {   
    console.error('ERROR');
    cards.innerHTML = '';
    return; 
  }
  // console.log(`firstSkip -   ${firstSkip}`);
  
  cards.innerHTML = "";
  const firstEl = skip;
  const lastEL = skip + take;

  const addcards = data.slice(firstEl, lastEL); // отрезаем 
  createCards(addcards);
  activeCards(basketData);
}



selectFilter('categoryGroup');
selectFilter('languageGroup');
selectFilter('bindingGroup');


// получение отфильтрованого масива
document.querySelector('.apply').addEventListener('click', () => {
  const categoryGroup = document.querySelectorAll('#categoryGroup input[type="checkbox"]');
  const languageGroup = document.querySelectorAll('#languageGroup input[type="checkbox"]');
  const bindingGroup = document.querySelectorAll('#bindingGroup input[type="checkbox"]');
  const allGroups = [...categoryGroup, ...languageGroup, ...bindingGroup];
  const allUnchecked = allGroups.every(checkbox => !checkbox.checked);
  
  if (allUnchecked) {
    displayData = JSON.parse(JSON.stringify(productsData));
    firstSkip = 0;
    getProducts(basket, displayData, firstSkip, countOfCardsOnScrean);
    return;
  } 


  const filtersList = getFilters(); 
  const filteredData = setFilters(productsData, filtersList);

  // updateFilters();
  const filtetSkip = 0;
  const filterTake = countOfCardsOnScrean;
  displayData = JSON.parse(JSON.stringify(filteredData));
  // console.log(displayData);
  getProducts(basket, displayData, filtetSkip, filterTake);
});


// Сортировка

  const ascBtn = document.querySelector('.sort__price-asc');
  const descBtn = document.querySelector('.sort__price-desc');

  ascBtn.addEventListener('click', () => {
    const sortData = sortProductsPriceAsc(displayData);
    // console.log(sortData);
    const sortSkip = 0;
    const sortTake = countOfCardsOnScrean;
    displayData = JSON.parse(JSON.stringify(sortData));
    getProducts(basket, displayData, sortSkip, sortTake);

  });

  descBtn.addEventListener('click', () => {
    const sortData = sortProductsPriceDesc(displayData);
    // console.log(sortData);
    const sortSkip = 0;
    const sortTake = countOfCardsOnScrean;
    displayData = JSON.parse(JSON.stringify(sortData));
    getProducts(basket, displayData, sortSkip, sortTake);

  });

function sortProductsPriceAsc(data) {
  return data.slice().sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
}


function sortProductsPriceDesc(data) {
  return data.slice().sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
}


let showTake = countOfCardsOnScrean;
btnShowMoreCards.addEventListener('click', () => {
  const showSkip = 0;
  showTake += countOfCardsOnScrean;
  
  getProducts(basket, displayData, showSkip, showTake);
  console.log(showTake);
  console.log(displayData.length);
  if (showTake >= displayData.length) {
    btnShowMoreCards.disabled = true;
  }
});



let basket = [];


cards.addEventListener('click', handleCardClick);

function handleCardClick(event) {
  const targetButton = event.target.closest('.card__add');
  if (!targetButton) return;

  const card = targetButton.closest('.card');

  const id = parseInt(card.dataset.productId);
  const currentProduct = productsData.find(item => item.id === id);

  targetButton.classList.toggle('active');

  if (basket.includes(currentProduct)) return;
  basket.push(currentProduct);
  basketCount(basket);
  saveDataToIndexedDB(basket, 'basket');
}

// функция для доб стиля кнопке
function activeCards(data) {
  // const currentProduct = data.find(item => item.id === id);
  const ids = data.map(item => item.id);
  ids.forEach(productId => {
    const btn = findBtnById(productId);

    if (btn) {
        btn.classList.add('active');
    }
});
}


function findBtnById(id) {
  // Знаходимо картку з певним productId
  const card = cards.querySelector(`.card[data-product-id="${id}"]`);
  
  // Якщо картка знайдена, знаходимо кнопку всередині цієї картки
  if (card) {
    const btn = card.querySelector('.card__add');
    return btn;
  } else {
    return null;
  }
}