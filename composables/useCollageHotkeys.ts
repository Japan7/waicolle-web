export const useCollageHotkeys = <T>(
  items: Ref<T[]>,
  selected: Ref<T | undefined>,
  setSelected: (item: T) => void,
  scrollDiv: Ref<HTMLDivElement | undefined>
) => {
  onKeyStroke(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"], (event) => {
    if (!selected.value || !scrollDiv.value) {
      return;
    }
    event.preventDefault();
    const currIndex = items.value.indexOf(selected.value);
    const widthSize = Math.floor(scrollDiv.value.offsetWidth / 64);
    let newIndex;
    switch (event.key) {
      case "ArrowUp":
        newIndex = Math.max(0, currIndex - widthSize);
        break;
      case "ArrowDown":
        newIndex = Math.min(currIndex + widthSize, items.value.length - 1);
        break;
      case "ArrowLeft":
        newIndex = Math.max(0, currIndex - 1);
        break;
      case "ArrowRight":
        newIndex = Math.min(currIndex + 1, items.value.length - 1);
        break;
    }
    if (newIndex !== undefined) {
      setSelected(items.value[newIndex]);
    }
  });
};
