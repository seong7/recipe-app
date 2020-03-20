import { elements } from "./base";
import { limitRecipeTitle } from "./searchView"; // 특정 Fn 하나만 import 할 때는 {} 사용

export const toggleLikeBtn = (isLiked) => {
  const iconString = isLiked ? "icon-heart" : "icon-heart-outlined";
  document.querySelector(".recipe__love use").setAttribute("href", `img/icons.svg#${iconString}`);
  // icons.svg#icon-heart-outlined
};

export const toggleLikeMenu = (numLikes) => {
  elements.likesMenu.style.visibility = numLikes > 0 ? "visible" : "hidden";
};

export const renderLike = (like) => {
  const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${like.title}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
  elements.likesList.insertAdjacentHTML("beforeend", markup);
};

export const deleteLike = (id) => {
  const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
  if (el) el.parentElement.removeChild(el);
};

export const blinkLikePannel = () => {
  elements.likesPanel.style.opacity = 1;
  elements.likesPanel.style.visibility = "visible";
  setTimeout(() => {
    // 초기화
    elements.likesPanel.style.opacity = "";
    elements.likesPanel.style.visibility = "";
  }, 1000);

  //  callback: (...args: any[]) => void, ms: number, ...args: any[]
};

export const toggleLikePannel = (isOn) => {
  elements.likesPanel.style.opacity = isOn ? 0 : 1;
  elements.likesPanel.style.visibility = isOn ? "hidden" : "visible";
};

export const hideLikePannel = () => {
  elements.likesPanel.style.opacity = 0;
  elements.likesPanel.style.visibility = "hidden";
};
