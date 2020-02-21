import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient,
    };
    this.items.push(item);
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
}
