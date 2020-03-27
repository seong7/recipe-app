import { elements } from "./base";

// touch screen 여부 판단 test
// eslint-disable-next-line camelcase
export const is_touch_device = () => {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};

export const test = () => {
  alert("touch screen 확인 완료");
};

// export const
