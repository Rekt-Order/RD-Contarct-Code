const ACTIVE_CLASS = "block--active";
const TRANSITION_CLASS = "block--transition";

const getTransforms = (a, b) => {
  const scaleY = a.height / b.height;
  const scaleX = a.width / b.width;

  // dividing by 2 centers the transform since the origin
  // is centered not top left
  const translateX = a.left + a.width / 2 - (b.left + b.width / 2);
  const translateY = a.top + a.height / 2 - (b.top + b.height / 2);

  // nothing particularly clever here, just using the
  // translate amount to estimate a rotation direction/amount.
  // ends up feeling pretty natural to me.
  const rotate = translateX;

  return [
    `translateX(${translateX}px)`,
    `translateY(${translateY}px)`,
    `rotate(${rotate}deg)`,
    `scaleY(${scaleY})`,
    `scaleX(${scaleX})`
  ].join(" ");
};

const animate = (block, transforms, oldTransforms) => {
  block.style.transform = transforms;
  block.getBoundingClientRect(); // force redraw
  block.classList.add(TRANSITION_CLASS);
  block.style.transform = oldTransforms;
  block.addEventListener(
    "transitionend",
    () => {
      block.removeAttribute("style");
    },
    { once: true }
  );
};

[...document.querySelectorAll(".block")].forEach(block => {
  const buttonForBlock = block.querySelector(".block-content__button");
  block.addEventListener("click", event => {
    if (
      block.classList.contains(ACTIVE_CLASS) &&
      event.target !== buttonForBlock
    ) {
      return;
    }

    block.classList.remove(TRANSITION_CLASS);
    const inactiveRect = block.getBoundingClientRect();
    const oldTransforms = block.style.transform;

    block.classList.toggle(ACTIVE_CLASS);
    const activeRect = block.getBoundingClientRect();
    const transforms = getTransforms(inactiveRect, activeRect);

    animate(block, transforms, oldTransforms);
  });
});