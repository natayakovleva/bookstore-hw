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
    const allCards = document.querySelectorAll('.card');
    console.log(cards);



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
  // перое прорисовывание

  getProducts(displayData, firstSkip, countOfCardsOnScrean);

  } catch (err) {
    console.log(err.message);
  }
}


function getProducts(data, skip, take) {
  // проверяем, является ли переменная data пустой или неопределенной (null, undefined) 
  // console.log(data);
  if (!data || !data.length) {   
    console.error('ERROR');
    return; 
  }
  // console.log(`firstSkip -   ${firstSkip}`);
  cards.innerHTML = "";
  const firstEl = skip;
  const lastEL = skip + take;

  const addcards = data.slice(firstEl, lastEL); // отрезаем 
  createCards(addcards);
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
    getProducts(displayData, firstSkip, countOfCardsOnScrean);
    return;
  } 


  const filtersList = getFilters(); 
  const filteredData = setFilters(productsData, filtersList);

  // updateFilters();
  const filtetSkip = 0;
  const filterTake = countOfCardsOnScrean;
  displayData = JSON.parse(JSON.stringify(filteredData));
  // console.log(displayData);
  getProducts(displayData, filtetSkip, filterTake);
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
    getProducts(displayData, sortSkip, sortTake);

  });

  descBtn.addEventListener('click', () => {
    const sortData = sortProductsPriceDesc(displayData);
    // console.log(sortData);
    const sortSkip = 0;
    const sortTake = countOfCardsOnScrean;
    displayData = JSON.parse(JSON.stringify(sortData));
    getProducts(displayData, sortSkip, sortTake);

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
  // if (showTake >= displayData.length) {
  //   btnShowMoreCards.textContent = 'END';

  // }
  getProducts(displayData, showSkip, showTake);
  
});


let basket = [];


cards.addEventListener('click', handleCardClick);

function handleCardClick(event) {
  const targetButton = event.target.closest('.card__add');
  if (!targetButton) return;

  const card = targetButton.closest('.card');

  const id = parseInt(card.dataset.productId);
  const currentProduct = productsData.find(item => item.id === id);


  if (basket.includes(currentProduct)) return;
  basket.push(currentProduct);
  targetButton.classList.toggle('active');
  basketCount(basket);
  saveDataToIndexedDB(basket, 'basket');

}


