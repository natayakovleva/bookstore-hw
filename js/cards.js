
// Рендер карточки
export function createCards(data) {
    const cards = document.querySelector('.cards');
    data.forEach(card => {
    const { id, title, author, price, image } = card;
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
cards.innerHTML += cardItem;
});
}