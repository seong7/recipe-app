import { elements, elementStrings } from './base';

export const renderItem = (item) => {
  const markup = `
    <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `;
  elements.shoping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = (id) => {
  //   const lists = document.querySelectorAll('.shopping__item').map((el) => el);
  //   const item = lists.find((el) => el.dataset.itemid === id);
  //   elements.shoping.removeChild(item);

  const item = document.querySelector(`[data-itemid="${id}"]`);
  item.parentElement.removeChild(item);
};
