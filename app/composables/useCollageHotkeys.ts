export const useCollageHotkeys = <T>(
  items: Ref<T[]>,
  selected: Ref<T | undefined>,
  setSelected: (item: T) => void,
  scrollDiv: Ref<HTMLDivElement | undefined>,
  getKey: (item: T) => unknown = (item) => item
) => {
  onKeyStroke(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"], (event) => {
    if (selected.value == null || !scrollDiv.value) {
      return;
    }
    const selectedKey = getKey(selected.value);
    const currIndex = items.value.findIndex((item) => getKey(item) === selectedKey);
    if (currIndex === -1) {
      return;
    }
    event.preventDefault();
    const widthSize = Math.max(1, Math.floor(scrollDiv.value.offsetWidth / 64));
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
    if (newIndex !== undefined && newIndex !== currIndex && newIndex >= 0 && newIndex < items.value.length) {
      setSelected(items.value[newIndex]!);
    }
  });
};
