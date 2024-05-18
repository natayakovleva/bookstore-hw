'use strict'
import { createCards } from './cards.js';
import { getFilters } from './filter.js';
import { setFilters } from './filter.js';

let productsData = [];
let countOfCardsOnScrean = 5;
let firstSkip = 0;
const cards = document.querySelector('.cards');
let isFiltred = false;


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
  // перое прорисовывание
  getProducts(productsData, firstSkip, countOfCardsOnScrean);

  } catch (err) {
    console.log(err.message);
  }
}


function getProducts(data, skip, take, getFilter, getSort) {
  // проверяем, является ли переменная data пустой или неопределенной (null, undefined) 
  
  if (!data || !data.length) {   
    console.error('ERROR');
    return; 
  }
  cards.innerHTML = "";
  const firstEl = skip;
  const lastEL = skip + take;
  const addcards = data.slice(firstEl, lastEL); // отрезаем 
  firstSkip = lastEL;
  
  createCards(addcards);


}


// Сортировка
function sortProducts(data, parameter) {
  const sortData = data.slice().sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  return sortData;
}

const ascCheckbox = document.getElementById('asc');
const descCheckbox = document.getElementById('desc');

// Добавляем обработчик события изменения состояния для каждого чекбокса
ascCheckbox.addEventListener('change', function() {
  console.log('change');
  if (!isFiltred) {
    console.log(!isFiltred);
    const sortData= sortProducts(productsData, 'price');
    console.log(sortData);
    getProducts(sortData, firstSkip, countOfCardsOnScrean);
  }
  



});





// получение отфильтрованого масива
document.querySelector('.apply').addEventListener('click', () => {
  const filtersList = getFilters(); 
  // console.log(filtersList);
  const filteredData = setFilters(productsData, filtersList);
  console.log(filteredData);


});

