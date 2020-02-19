import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      // return Promise
      // console.log(res);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients; // array
    } catch (error) {
      // alert(error);
      alert('Something went wrong :(');
    }
  }

  // 요리시간
  calcTime() {
    // Assuming that we need 15 min for each 3 ingredients
    const numIngredient = this.ingredients.length;
    const periods = Math.ceil(numIngredient / 3);
    this.time = periods * 15;
  }

  // 몇인분? _ 4로 통합(알고리즘 생략)
  calcServings() {
    this.serving = 4;
  }

  //
  parseIngredients() {
    // const getNameIng = (arry, startJoin)=>{
    //     let i = 0;
    //     let nameIng = arry.reduce((result, cur)=>{  // 요소를 건너뛰기에는 reduce 가 제일 적절함
    //                                              // 0번 요소(수) 건너뛰기 _ arrIng.map 으로 실행하면 건너뛸 수 없음
    //         if(i>=startJoin){
    //             result.push(cur);
    //         }
    //         i++;
    //         return result;

    //     }, []).join(' ');
    //     return nameIng;
    // } ===> array.slice(startIndex, endIndex(생략가능))  으로 쉽게 구현가능....

    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds',
    ];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'cup', 'pound']; // 위의 단위들의 요약 버전

    const newIngredients = this.ingredients.map((el, index) => {
      // 1) Uniform units (단위 통합)
      let ingredient = el.toLowerCase(); // 소문자 변환

      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // 2) Remove parenthesized words
      ingredient = ingredient.replace(/\s*\([^)]*\)\s*/g, ''); // ~~~ (@@) -> ~~~
      ingredient = ingredient.replace(/,/g, ''); // ~~,~~ -> ~~~~

      // 3) Parse ingredients into an Object {count, unit and ingredient}
      const arrIng = ingredient.split(' ');

      // unit 포함되어 있는지 여부 확인
      const unitIndex = arrIng.findIndex((el2) => unitsShort.includes(el2));
      // findIndex(fn) ES6 : callback fn 이 참인 첫번째 요소의 index return
      // 참인 요소가 없으면(unit 이 없으면) -1 return
      let objIng;
      const numPattern = new RegExp(
        /^[0-9]+((\.[0-9]+)|([0-9]\/[0-9]))?(-[0-9]+((\.[0-9]+)|([0-9]\/[0-9]))?)?/,
      ); // 1-1.5 , 1.5-2, 1.5-2.5, 1-1/2, 1/3-1/2
      if (unitIndex > -1) {
        // There is a unit

        // const nameIng = getNameIng(arrIng, 2);

        const arrCount = arrIng.slice(0, unitIndex); // unit 이 탐색된 최초의 index exclude 로 배열 추출
        // ex) 4 cups
        // ex) 4 1/2 cups  --> eval(4+1/2)
        // ex) 4-1/2 cups --> eval(4+1/2)
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+')); // 해당 data에서 - 는 실제로 + 를 의미하므로
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+')); // eval('4+1/2') --> 4.5
        }

        objIng = {
          // count : parseInt(arrIng[0]),
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIng[0], 10) || numPattern.test(arrIng[0])) {
        /* 10진수 integer 로 변환
                        string 이면 -> NaN return -> coerce to false
                    */

        // There is NO unit, but 1st element is a number

        // let test = arrIng.map((cur, index)=>{
        //     if(index > 0){
        //         console.log(`${index} : ${cur}`);
        //         return cur;
        //     }else{
        //         continue;
        //     }
        // }).join(' ');

        // let i = 0;
        // let nameIng = arrIng.reduce((result, cur)=>{  // 요소를 건너뛰기에는 reduce 가 제일 적절함
        //                                             // 0번 요소(수) 건너뛰기
        //                                                : arrIng.map 으로 실행하면 건너뛸 수 없음
        //     if(i>0){
        //         result.push(cur);
        //     }
        //     i++;
        //     return result;

        // }, []).join(' ');
        // const nameIng = getNameIng(arrIng, 1);

        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        // There is NO unit and 1st element is NOT a number

        objIng = {
          count: 1,
          unit: '',
          ingredient,
          // --> ingredient : ingredient 와 같음  (ES6 문법)
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }
}
