export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchRes: document.querySelector(".results"),
  searchResList: document.querySelector(".results__list"),
  searchResPages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likesMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list"),
  likesPanel: document.querySelector(".likes__panel"),
  shoppingClear: document.querySelector(".shopping__clear"),
  shoppingCopy: document.querySelector(".shopping__copy"),
};

export const elementStrings = {
  // 최초에 render 되지 않는 컴포넌트 이름들 저장 ( elements 에 저장하려하면 error 발생)
  loader: "loader",
};

export const renderLoader = (parent) => {
  // reuseable 하게 spinning loader 생성
  const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    loader.parentElement.removeChild(loader); // dom 컴포넌트 지우려면 부모 요소 찾아서 remove child 해야함
  }
};
