// Функция для создания элемента <div> с переданным классом.
export function getDivEl(classes) {
  const div = document.createElement('div');
  if (Array.isArray(classes)) {
    div.classList.add(...classes);
  } else if (typeof classes === 'string') {
    const classArray = classes.split(' ');
    div.classList.add(...classArray);
  }
  return div;
}

// Функция для создания элемента <img> с заданными аттрибутами (src, alt, класс).
export function getImgEl(src, alt = '', className = 'product-card__img') {
  const imgEl = document.createElement('img');
  imgEl.classList.add(className);
  imgEl.src = src;
  imgEl.alt = alt;
  return imgEl;
}

// Функция для создания элемента <a> с указанным href и классами.
export function getLinkEl(href, className = 'product-card__link') {
  const linkEl = document.createElement('a');
  linkEl.classList.add(...className.split(' '));
  linkEl.href = href;
  return linkEl;
}

// Функция для создания элемента <span> с текстом и классом.
export function getSpanEl(text, className) {
  const spanEl = document.createElement('span');
  if (className) {
    spanEl.classList.add(className);
  }
  spanEl.textContent = text;
  return spanEl;
}

// Функция для создания заголовка <h2> с заданным текстом и классом 'product-card__title'.
export function getH2El(text, className = 'product-card__title') {
  const h2El = document.createElement('h2');
  h2El.classList.add(className);
  h2El.textContent = text;
  return h2El;
}

// Функция для создания кнопки <button> с заданным атрибутом aria-label.
export function getBtnEl(
  ariaLabel,
  type = 'button',
  className = 'tooltip__btn',
  text = ''
) {
  const btnEl = document.createElement('button');
  if (className) {
    btnEl.classList.add(...className.split(' '));
  }
  btnEl.setAttribute('aria-label', ariaLabel);
  btnEl.setAttribute('type', type);
  if (text) {
    btnEl.textContent = text;
  }

  return btnEl;
}

// Функция для создания элемента <ul> с переданным классом.
export function getUlEl(className) {
  const ulEl = document.createElement('ul');
  if (className) {
    ulEl.classList.add(className);
  }
  return ulEl;
}

// Функция для создания элемента <li> с переданными классами.
export function getLiEl(...classNames) {
  const liEl = document.createElement('li');
  if (classNames.length) {
    liEl.classList.add(...classNames);
  }
  return liEl;
}

// Функция для создания элемента <ol> с переданным классом.
export function getOlEl(className) {
  const olEl = document.createElement('ol');
  if (className) {
    olEl.classList.add(className);
  }
  return olEl;
}

// Функция для создания иконки в формате SVG с указанным href, классом, шириной и высотой.
export function getSvgIcon(href, className = '', width = 24, height = 24) {
  const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgEl.setAttribute('width', width);
  svgEl.setAttribute('height', height);
  svgEl.setAttribute('aria-hidden', 'true');
  if (className) {
    svgEl.setAttribute('class', className);
  }
  const useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
  svgEl.appendChild(useEl);
  return svgEl;
}
