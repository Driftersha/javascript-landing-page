const CITY_STORAGE_KEY = 'briaton-selected-city';

export function initCityDropdown() {
  const cityToggleBtn = document.querySelector('.location__city');
  const cityNameDisplay = document.querySelector('.location__city-name');
  const cityOptions = document.querySelectorAll('.location__sublink');
  const location = cityToggleBtn?.closest('.location');
  if (!cityToggleBtn || !cityNameDisplay || !location) return;

  function close() {
    cityToggleBtn.classList.remove('location__city--active');
    cityToggleBtn.setAttribute('aria-expanded', 'false');
  }

  cityToggleBtn.setAttribute('aria-expanded', 'false');
  try {
    const saved = localStorage.getItem(CITY_STORAGE_KEY);
    const allowed = [...cityOptions].find((option) => option.textContent.trim() === saved);
    if (allowed) cityNameDisplay.textContent = saved;
  } catch (error) {
    console.warn('Не удалось прочитать выбранный город:', error);
  }

  cityToggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = cityToggleBtn.classList.toggle('location__city--active');
    cityToggleBtn.setAttribute('aria-expanded', String(open));
  });

  cityOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const selectedCity = option.textContent.trim();
      cityNameDisplay.textContent = selectedCity;
      try {
        localStorage.setItem(CITY_STORAGE_KEY, selectedCity);
      } catch (error) {
        console.warn('Не удалось сохранить выбранный город:', error);
      }
      close();
    });
  });

  document.addEventListener('click', (event) => {
    if (!location.contains(event.target)) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      close();
      cityToggleBtn.focus();
    }
  });
}
