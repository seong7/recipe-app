export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = {
      id,
      title,
      author,
      img,
    };
    this.likes.push(like);

    // Persist data in localStorage
    this.persistData();
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex((el) => el.id === id);
    this.likes.splice(index, 1);

    // Persist data in localStorage
    this.persistData();
  }

  isLiked(id) {
    return this.likes.findIndex((el) => el.id === id) !== -1; // 배열에 해당 id 없으면 -1 return 됨
  }

  getNumLikes() {
    return this.likes.length;
  }

  // local Storage 에 like list 저장
  persistData() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  // local Storage 에서 like list 불러오기
  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));
    // localStorage 가 비어 있으면 null return

    // Restoring likes from the localStorage
    if (storage) this.likes = storage;
  }
}
