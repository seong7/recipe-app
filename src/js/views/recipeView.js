import { Fraction } from "fractional";
import { elements } from "./base";

// count format 변경
const formatCount = (count) => {
  if (count) {
    let newCount = count;
    // ex) count = 2.5  --> 5/2 --> 2 1/2
    // ex) count = 0.5  --> 1/2
    const [int, dec] = newCount.toString().split(".");
    //   .map((el) => parseInt(el, 10));

    // 원래 integer 인 경우
    if (!dec) {
      return newCount;
    }

    // 소수점 아래 2 자리에서 반올림한다.
    if (dec.length > 2) {
      const newDec = dec.substr(0, 2);
      newCount = [int, newDec].join(".");
    }

    // 0.xx 경우
    if (int === "0") {
      // 외부 라이브러리 Fraction 사용 영역
      const fr = new Fraction(newCount);
      return `${fr.numerator}/${fr.denominator}`;
    }

    const fr = new Fraction(newCount - parseInt(int, 10));
    return `${int} ${fr.numerator}/${fr.denominator}`;
  }
  return "?";
};

const createIngredient = (ingredient) => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;

export const clearRecipe = () => {
  elements.recipe.innerHTML = "";
};

export const renderRecipe = (recipe, isLiked, _isTouchScreen) => {
  let isTouchScreen = _isTouchScreen;
  const markup = `
    <figure class="recipe__fig">
        <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
        <h1 class="recipe__title">
            <span>${recipe.title}</span>
        </h1>
    </figure>
    <div class="sides__btns">
        ${
          isTouchScreen
            ? "<button class='results__toggle'>  <!--<i class='fas fa-bars'></i>-->  <i class='fas fa-angle-double-left'></i>  </button> <button class='shopping__toggle'>  <i class='fas fa-cart-arrow-down'></i>  </button>"
            : ""
        }
    </div>
    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>

        </div>
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart${isLiked ? "" : "-outlined"}"></use>
            </svg>
        </button>
    </div>



    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
            ${recipe.ingredients.map((el) => createIngredient(el)).join("")}
        </ul>
        <button class="btn-small recipe__btn recipe__btn--add">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">
                ${recipe.author}
            </span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>

        </a>
    </div>
  `;
  elements.recipe.insertAdjacentHTML("afterbegin", markup);
};

// serving 과 ingredient 변화 주기
export const updateServingsIngredients = (recipe) => {
  // Update Servings
  document.querySelector(".recipe__info-data--people").textContent = recipe.servings;

  // Update Ingredients
  const countElement = Array.from(document.querySelectorAll(".recipe__count"));
  countElement.forEach((element, i) => {
    const el = element;
    el.textContent = formatCount(recipe.ingredients[i].count);
  });
};
