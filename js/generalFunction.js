

export  function basketCount(data) {
  const basketCount = document.querySelector('.basket__count');
  basketCount.textContent = data.length;
}