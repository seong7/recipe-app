// // import path 에는 파일의 확장자(.js)를 입력하지 않는다.

// import str from './models/Search';  // default export 로부터 imoprt : 변수 명 아무거나

// import { add as a, multiply as m, ID } from './views/searchView'; // named export 로부터 import 방법 1
//                                                                         // export 문과 동일한 변수명 사용
//             // as : 현재 파일에서 사용할 변수명으로 이름 변경
// console.log(`Using imported functions! ${a(ID, 2)} and ${m(3, 5)}. ${str}}`);

// import * as searchView from './views/searchView';   // named export 로부터 import 방법 2
//                                                             // export 문을 모두 하나의 객체에 담아 받아 사용하기
// console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3, 5)}. ${str}}`);


import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

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
const controlSearch = async () =>{      // async fn 선언 _ getResults() 가 Promise 이므로 (Search.js 참조)
    // 1) Get query from view
    const query = searchView.getInput() // TODO
    //console.log(query);

    if(query){
        // 2) New search object and add to state
        state.search = new Search(query);   // global state object 인 state 에 Search 객체를 저장한다.

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        // 4) Search for recipes
        await state.search.getResults();  // state 객체에서 사용 (await 이므로 결과가 resolve 또는 reject 될 때까지 기다림)
        
        // 5) Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

// 검색 버튼 submit event
elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();     // default event delegation 을 막음
    controlSearch();
});

// 검색결과 페이지 버튼 click event
        // event delegation 이용해야함 (늦게 rendering 되는 버튼임)
        // e.target.closest('.class')  : target 에서 가장 가까운 '.class' 가진 요소를 가리킴 
elements.searchRes.addEventListener('click', e =>{ 
    const btn = e.target.closest('.btn-inline');
    // console.log(btn);
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);  
        // html 에서 data-goto 속성으로 정한 값 string return
        // console.log(goToPage);
        searchView.clearResults();
        
        searchView.renderResults(state.search.result, goToPage);    // 검색 결과 페이지 이동
    }
});


/********************
 *  Recipe Controller 
 ********************/
//test
// const r = new Recipe(46956);
// r.getRecipe();

const controlRecipe = async (query) =>{
    if(query){
        state.recipe = new Recipe(query);

        // Prepare UI for a recipe

        // Search for the Recipe
        await state.recipe.getRecipe();


        // Render result on UI
    }
}

// 음식 클릭 -> recipe 가져오기 (click event)
elements.searchResList.addEventListener('click', e =>{
    const recipe = e.target.closest('.results__link');
    // console.log(food);
    if(recipe){
        const rId = recipe.href;
        console.log(rId);
    }
});