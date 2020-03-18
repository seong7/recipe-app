// export const add = (a, b) => a + b;
//    named export : 해당 fn 또는 data 를 import 하려면 동일한 변수명으로 받아야함
// export const multiply = (a, b) => a * b;
// export const ID = 23;

import { elements } from "./base";
import { is_touch_device } from "./touchScreenView";

export const getInput = () => elements.searchInput.value; // 한줄짜리 arrow fn : 자동으로 처리된 값을 return 해줌

export const clearInput = () => {
  elements.searchInput.value = ""; // return 값을 만들지 않기 위해 function 한줄이지만 감싸줌
  is_touch_device();
};

// 결과 지우기
export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

// 선택된 recipe css 변경
export const highlightSelected = (id) => {
  // 모두 제거
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });

  // 선택된 요소에 클래스 추가
  if (document.querySelector(`.results__link[href*="#${id}"]`)) {
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add("results__link--active");
  }
};

// 결과 목록의 제목 길이 제한 후 '...' 추가
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    // Array.reduce( fn(Accumulator, Currunt El), Acc의 초기값);
    title.split("").reduce((acc, cur) => {
      // '' 로 split 하면 문자 (또는 공백) 하나하나 모두 쪼개어 배열로 return 함

      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length; // return 값은 다음 acc 에 assign 됨
    }, 0);

    /*
      // example)  'Pasta with tomato and spinach' -> ['Pasta', 'with', 'tomato', 'and', 'spinach']
          acc : 0 / acc + cur.length = 5 (다음 acc에 assign) / newTitle = ['Pasta']
          acc : 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
          acc : 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
          acc : 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
                                                                          // limit 보다 크므로 push 하지 않음
          acc : 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']
                                                                          // limit 보다 크므로 push 하지 않음
      */

    return `${newTitle.join("")} ...`; // join : split 과 반대로 매개변수 값을 구분자로 추가하여 배열 요소들을 하나의 string 으로 합친다.
  }
  return title;
};

// recipe 결과 출력
const renderRecipe = (recipe) => {
  // forEach 에서 current 가 자동으로 들어옴
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

// 페이지 버튼 생성
// type : 'prev' or 'next'
const createButton = (page, type /* data-goto : (html 5 문법) */) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  `
    <button class="btn-inline results__btn--${type}"
     data-goto=${type === "prev" ? page - 1 : page + 1}>
        <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === "prev" ? "left" : "right"}"></use>
        </svg>
    </button>
`;

// 페이지 버튼 출력
const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage); // 전체 페이지 수 측정
  // ceil : 올림
  let button;

  if (page === 1 && pages > 1) {
    // to next Button 만 출력
    button = createButton(page, "next");
  } else if (page < pages) {
    // 양쪽 버튼 모두 출력
    button = `
            ${createButton(page, "prev")}
            ${createButton(page, "next")}
        `;
  } else if (page === pages && pages > 1) {
    // to previous Button 만 출력
    button = createButton(page, "prev");
  }
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

// 검색 결과 출력 (pagination)
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  // console.log(recipes);
  // console.log(`${start}, ${end}` );
  recipes.slice(start, end).forEach(renderRecipe); // foreach - callback fn 간단히 사용하는 법
  // ~~.forEach(rederRecipe(current, i, array)=>{}) 의 요약버전

  // render page 버튼
  renderButtons(page, recipes.length, resPerPage);
};

// 검색 결과 창 toggle
export const toggleResults = (isVisible) => {
  const searchToggle = document.querySelector(".results__toggle");
  console.log(searchToggle);
  const bars = document.createElement("i");
  bars.classList.add("fas");
  bars.classList.add("fa-bars");
  const arrow = document.createElement("i");
  arrow.classList.add("fas");
  arrow.classList.add("fa-angle-double-left");
  searchToggle.innerHTML = "";
  searchToggle.appendChild(isVisible ? bars : arrow);

  // searchToggle.insertAdjacentHTML(
  //   "afterbegin",
  //   isVisible ? bars : arrow,
  // );
  // searchToggle.innerHTML = `<i class= ${isVisible ? "fas fa-angle-double-left" : "fas fa-bars"}></i>`;
  elements.searchRes.style.display = isVisible ? "none" : "block";
  elements.container.style.gridTemplateColumns = isVisible ? "1fr" : "0.5fr 3fr";
};

// 검색 결과 창 show
export const showResults = () => {
  // console.log(window.innerWidth);
  elements.searchRes.style.display = "block";
  elements.container.style.gridTemplateColumns = "0.5fr 3fr";
};
