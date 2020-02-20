export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      count,
      unit,
      ingredient,
    };
  }
}
