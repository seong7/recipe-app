// // import path 에는 파일의 확장자(.js)를 입력하지 않는다.

// import str from './models/Search';  // default export 로부터 imoprt : 변수 명 아무거나

// import { add as a, multiply as m, ID } from './views/searchView'; // named export 로부터 import 방법 1
//                                                                         // export 문과 동일한 변수명 사용
//             // as : 현재 파일에서 사용할 변수명으로 이름 변경
// console.log(`Using imported functions! ${a(ID, 2)} and ${m(3, 5)}. ${str}}`);

// import * as searchView from './views/searchView';   // named export 로부터 import 방법 2
//                                                             // export 문을 모두 하나의 객체에 담아 받아 사용하기
// console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and
//              ${searchView.multiply(3, 5)}. ${str}}`);

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/*
 *** Global state of the app
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes
 */
const state = {};
window.state = state; // test 목적으로 global scope 에 공개

/* *******************
 *  Search Controller
 ******************* */
const controlSearch = async () => {
  // async fn 선언 _ getResults() 가 Promise 이므로 (Search.js 참조)
  // 1) Get query from view
  const query = searchView.getInput();
  // const query = 'pizza';  // 테스트용

  // console.log(query);

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
      // alert(error);
    }
  }
};

// // 테스트용 'load' event
// window.addEventListener('load', e=>{
//     e.preventDefault();     // default event delegation 을 막음
//     controlSearch();
// });

// 검색 버튼 submit event
elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); // default event delegation 을 막음
  controlSearch();
});

// 검색결과 pagination 버튼 click event
// event delegation 이용해야함 (page load 후에 늦게 rendering 되는 버튼임)
elements.searchRes.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  // e.target.closest('selector')  : target 에서 가장 가까운 'selector' 요소를 가리킴 (부모 자식 간에만 서치함)

  // console.log(btn);

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    // html 에서 data-goto 속성으로 정한 값 string return
    // console.log(goToPage);
    searchView.clearResults();

    searchView.renderResults(state.search.result, goToPage); // 검색 결과 페이지 이동
  }
});

/* *******************
 *  Recipe Controller
 ******************* */
// test
// const r = new Recipe(46956);
// r.getRecipe();

const controlRecipe = async () => {
  const rId = window.location.hash.replace("#", "");
  // Get ID from url  ( hash symbol 이용하기)

  if (rId) {
    // Prepare UI for a recipe
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // (search 결과 리스트가 있을 때) 선택된 recipe Highlight
    if (state.search) searchView.highlightSelected(rId);

    // Search for the Recipe
    state.recipe = new Recipe(rId);

    try {
      await state.recipe.getRecipe();
      // console.log(state.recipe);
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render result on UI
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(rId));
    } catch (error) {
      // console.log(error);
      alert("문제가 발생했습니다. 다시 시도해주세요.");
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
// window.addEventListener('load', controlrecipe);          //_ url 에 hash 값 입력한 채로 load 한 경우 이벤트
//                                                            ( load 할 때는 # 없애야하는 거 아닌지?)
// forEach 이용해 위의 두 코드 한줄로 합치기
// ["hashchange", "load"].forEach((event) => window.addEventListener(event, controlRecipe));
["hashchange"].forEach((event) => window.addEventListener(event, controlRecipe));

/* *******************
 *  LIST Controller
 ******************* */

const controlList = () => {
  // Create a new list IF there in none yet
  if (!state.list) state.list = new List();

  
  // Add each ingredient to the lsit
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);   // return 새 item
    listView.renderItem(item);
  });

  listView.toggleShopBtn(state.list.items.length);
};

// Handle delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle the delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);

    // Handle the count update
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
    // state.list.
  }

  listView.toggleShopBtn(state.list.items.length);
});

/* *******************
 *  LIKE Controller
 ******************* */

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img,
    );
    // Toggle the like button
    likesView.toggleLikeBtn(true);

    //Add like to UI list
    likesView.renderLike(newLike);
    // console.log(state.likes);

    // User 가 이미 좋아요 누른 상태
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentID);

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
    likesView.deleteLike(currentID);
    // console.log(state.likes);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// on Page Load - Restore Liked Recipes
window.addEventListener("load", () => {
  // likes 생성
  state.likes = new Likes();

  // Restore Likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));

  ///////////////////////////////
  
  // list 생성
  state.list = new List();
  
  // Restore List
  state.list.readStorage();

  // Render the existing List
  state.list.items.forEach((item) => {
    listView.renderItem(item);
  });
  listView.toggleShopBtn(state.list.items.length);
});

// Recipe 의 + - 버튼 event
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    /* " .btn-decrease * " : 해당 요소의 모든 자식 요소를 가리킴 !!!!!! */

    // Decrease Btn
    if (state.recipe.servings > 1) {
      /* 1보다 작으면 줄일 수 없어야함 */
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Increase Btn
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // call Like controller
    controlLike();
  }
});

// shopping list clear 버튼 event
elements.shoppingClear.addEventListener("click", (e) => {
  state.list.clearItem();

  // listView.renderItem(state.list);
  listView.clearItem();

  listView.toggleShopBtn(state.list.items.length);
})

// const l = newList();
// window.l = new List();
