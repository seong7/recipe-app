import { v4 as uuidv4 } from 'uuid';

// 하나의 recipe 에 대한 ingredient list
export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uuidv4(), // uniq 한 id 를 부여해준다. (라이브러리)
      count,
      unit,
      ingredient,
    };
    this.items.push(item);
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex((el) => el.id === id); // callback fn 이 true return 되는 첫 idx
    /*
      splice 와 slice 비교 :
      [2, 4, 8].splice(1, 2) -> returns [4, 8],  original array is [2]  // original array 변함
               .slice(1, 2) -> returns 4,  original array is [2, 4, 8]  // original array 변화 없음
    */
    this.items.splice(index, 1); // findIndex 로 찾은 idx 의 요소 하나만 삭제
  }

  updateCount(id, newCount) {
    this.items.find((el) => el.id === id).count = newCount; // callback fn 이 true ruturn 하는 첫 elemt
  }
}
