
//общая функция для Checkboxes (Собираем активные категории)
function writeFilledFilters(groupOfinputs, list, nameOfKey) {
  groupOfinputs.forEach(function(checkbox) {
    if (checkbox.checked) {
        const value = checkbox.getAttribute('id');
        list[nameOfKey] = value.charAt(0).toUpperCase() + value.slice(1);
    }
  });
}

// функция заполнения filtersList
export function getFilters() {
  let filtersList = {
    category: '',
    language: '',
    binding: ''
  };
  
  const languageCheckboxes = document.querySelectorAll('#languageGroup input[type="checkbox"]');
  const bindingCheckboxes = document.querySelectorAll('#bindingGroup input[type="checkbox"]');
  const categoryCheckboxes = document.querySelectorAll('#categoryGroup input[type="checkbox"]');

  writeFilledFilters(categoryCheckboxes, filtersList, Object.keys(filtersList)[0]);
  writeFilledFilters(languageCheckboxes, filtersList, Object.keys(filtersList)[1]);
  writeFilledFilters(bindingCheckboxes, filtersList, Object.keys(filtersList)[2]);

  return filtersList;
}


// получение отфильтрованного массива
export function setFilters(data, filters) {

  let filteredData = data.filter(card => {

    return  (!filters.category || card.category === filters.category) &&
            (!filters.language || card.language === filters.language) &&
            (!filters .binding || card.binding === filters.binding);
  });

return filteredData;
}