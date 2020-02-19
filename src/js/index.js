// // import path 에는 파일의 확장자(.js)를 입력하지 않는다.

// import str from './models/Search';  // default export 로부터 imoprt : 변수 명 아무거나

// import { add as a, multiply as m, ID } from './views/searchView'; // named export 로부터 import 방법 1
//                                                                         // export 문과 동일한 변수명 사용
//             // as : 현재 파일에서 사용할 변수명으로 이름 변경
// console.log(`Using imported functions! ${a(ID, 2)} and ${m(3, 5)}. ${str}}`);

// import * as searchView from './views/searchView';   // named export 로부터 import 방법 2
//                                                             // export 문을 모두 하나의 객체에 담아 받아 사용하기
// console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3, 5)}. ${str}}`);

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";

/*
 *** Global state of the app
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes
 */
const state = {};

/********************
 *  Search Controller
 ********************/
const controlSearch = async () => {
  // async fn 선언 _ getResults() 가 Promise 이므로 (Search.js 참조)
  // 1) Get query from view
  const query = searchView.getInput();
  // const query = 'pizza';  // 테스트용

  //console.log(query);

  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query); // global state object 인 state 에 Search 객체를 저장한다.

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes
      await state.search.getResults(); // state 객체에서 사용 (await 이므로 결과가 resolve 또는 reject 될 때까지 기다림)

      // 5) Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert(error);
    }
  }
};

// // 테스트용 'load' event
// window.addEventListener('load', e=>{
//     e.preventDefault();     // default event delegation 을 막음
//     controlSearch();
// });

// 검색 버튼 submit event
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault(); // default event delegation 을 막음
  controlSearch();
});

// 검색결과 페이지 버튼 click event
// event delegation 이용해야함 (page load 후에 늦게 rendering 되는 버튼임)
// e.target.closest('selector')  : target 에서 가장 가까운 'selector' 요소를 가리킴 (부모 자식 간에만 서치함)
elements.searchRes.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  // console.log(btn);
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    // html 에서 data-goto 속성으로 정한 값 string return
    // console.log(goToPage);
    searchView.clearResults();

    searchView.renderResults(state.search.result, goToPage); // 검색 결과 페이지 이동
  }
});

/********************
 *  Recipe Controller
 ********************/
//test
// const r = new Recipe(46956);
// r.getRecipe();

const controlRecipe = async () => {
  // Get ID from url  ( hash symbol 이용하기)
  const rId = window.location.hash.replace("#", "");
  console.log(rId);

  if (rId) {
    // Prepare UI for a recipe

    // Search for the Recipe
    state.recipe = new Recipe(rId);

    try {
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // console.log(state.recipe);

      // Calculate serving and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render result on UI
      console.log(state.recipe);
    } catch (error) {
      alert("Error processing recipe !");
    }
  }
};

// 음식 클릭 -> recipe 가져오기 (click event)
// elements.searchResList.addEventListener('click', e =>{
//     const recipe = e.target.closest('.results__link');
//     // console.log(food);
//     if(recipe){
//         const recipeHref = recipe.href;
//         // console.log(rId);  //__ http://localhost:8080/#47025
//         const rId = recipeHref.substring(recipeHref.indexOf('#')+1);
//         // console.log(rId);
//         controlRecipe(rId);
//     }
// });

// window.addEventListener('hashchange', controlRecipe);    //_ url 의 hash 영역 변화 감지
// window.addEventListener('load', controlrecipe);          //_ url 에 hash 값 입력한 채로 load 한 경우 이벤트  ( load 할 때는 # 없애야하는 거 아닌지?)
// forEach 이용해 위의 두 코드 한줄로 합치기
["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);
