import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { CollageFilters, DEFAULT_FILTERS, FILTERS_VERSION } from "../types";

export function useLocalStorageFilters(
  name: string
): [CollageFilters, React.Dispatch<React.SetStateAction<CollageFilters>>] {
  const [state, setState] = useState<CollageFilters>(DEFAULT_FILTERS);
  const set = useRef(false);

  useEffect(() => {
    if (set.current) return;

    const item = localStorage.getItem(name);
    if (item) {
      set.current = true;
      const parsed = JSON.parse(item);
      parsed.version === FILTERS_VERSION
        ? setState(parsed)
        : localStorage.removeItem(name);
    }
  }, [name]);

  useEffect(() => {
    localStorage.setItem(
      name,
      JSON.stringify({ ...state, version: FILTERS_VERSION })
    );
  }, [name, state]);

  return [state, setState];
}

export function useCollageHotkeys<T>(
  selected: T | undefined,
  setSelected: React.Dispatch<React.SetStateAction<T | undefined>>,
  elementId: string = "collage"
) {
  const [filtered, setFiltered] = useState<T[]>([]);

  useHotkeys(
    "up,down,left,right",
    (handler) => {
      handler.preventDefault();
      const index = filtered.indexOf(selected!);
      const div = document.getElementById(elementId)!;
      const nb_width = Math.floor(div!.offsetWidth / 64);
      switch (handler.key) {
        case "ArrowUp":
          if (index > nb_width) setSelected(filtered[index - nb_width]);
          div.scrollBy(0, -96);
          break;
        case "ArrowDown":
          if (index < filtered.length - nb_width)
            setSelected(filtered[index + nb_width]);
          div.scrollBy(0, 96);
          break;
        case "ArrowLeft":
          if (index > 0) setSelected(filtered[index - 1]);
          break;
        case "ArrowRight":
          if (index < filtered.length - 1) setSelected(filtered[index + 1]);
          break;
      }
    },
    { enabled: selected !== undefined },
    [selected, setSelected]
  );

  return [setFiltered];
}
