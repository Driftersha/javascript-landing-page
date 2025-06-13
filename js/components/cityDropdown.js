// Открытие и закрытие выпадающего меню для выбора города с возможностью смены варианта по клику на соответствующий пункт
export function initCityDropdown() {
  const cityToggleBtn = document.querySelector('.location__city');
  const cityNameDisplay = document.querySelector('.location__city-name');
  const cityOptions = document.querySelectorAll('.location__sublink');

  // Переключение открытия/закрытия меню
  cityToggleBtn.addEventListener('click', () => {
    cityToggleBtn.classList.toggle('location__city--active');
  });

  // Выбор города из списка
  cityOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const selectedCity = option.textContent;
      cityNameDisplay.textContent = selectedCity;
      cityToggleBtn.classList.remove('location__city--active');
    });
  });
}
