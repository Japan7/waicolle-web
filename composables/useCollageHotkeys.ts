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
    const index = items.value.indexOf(selected.value);
    const nb_width = Math.floor(scrollDiv.value.offsetWidth / 64);
    switch (event.key) {
      case "ArrowUp":
        if (index > nb_width) {
          setSelected(items.value[index - nb_width]);
        }
        scrollDiv.value.scrollBy(0, -96);
        break;
      case "ArrowDown":
        if (index < items.value.length - nb_width) {
          setSelected(items.value[index + nb_width]);
        }
        scrollDiv.value.scrollBy(0, 96);
        break;
      case "ArrowLeft":
        if (index > 0) {
          setSelected(items.value[index - 1]);
        }
        break;
      case "ArrowRight":
        if (index < items.value.length - 1) {
          setSelected(items.value[index + 1]);
        }
        break;
    }
  });
};
