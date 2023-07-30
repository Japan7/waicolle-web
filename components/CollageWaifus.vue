<script setup lang="ts">
import { Chara, Waifu } from "server/utils/nanapi-client";
import { CollageFilters } from "utils/waicolle";

const props = defineProps<{
  waifus: Waifu[];
  charas: Chara[];
  filters: CollageFilters;
  mediaCharas?: number[];
  selected?: Waifu;
  scrollDiv?: HTMLDivElement;
}>();
const emit = defineEmits<{
  setSelected: [waifu: Waifu];
}>();

const charasMap = computed(() => {
  const map = new Map<number, Chara>();
  props.charas.forEach((c) => map.set(c.id_al, c));
  return map;
});

function isIncluded(waifu: Waifu) {
  if (props.mediaCharas && !props.mediaCharas.includes(waifu.character_id)) {
    return false;
  }
  if (
    !charasMap.value.get(waifu.character_id)?.image ||
    charasMap.value.get(waifu.character_id)?.image!.endsWith("default.jpg")
  ) {
    return false;
  }

  if (props.filters.blooded !== waifu.blooded) {
    return false;
  }
  if (!props.filters.players.includes(waifu.owner_discord_id)) {
    return false;
  }

  if (props.filters.ascendedOnly && waifu.level === 0) {
    return false;
  }
  if (props.filters.unlockedOnly && waifu.locked) {
    return false;
  }
  if (props.filters.lockedOnly && !waifu.locked) {
    return false;
  }
  if (props.filters.nanaedOnly && !waifu.nanaed) {
    return false;
  }

  return true;
}

const filtered = computed(() => {
  const sorted = props.waifus.sort(
    props.filters.lasts
      ? compareTimestamp
      : (a, b) =>
          compareCharaFavourites(
            charasMap.value.get(a.character_id)!,
            charasMap.value.get(b.character_id)!
          )
  );
  return sorted.filter(isIncluded);
});

const limit = useCollageInfiniteScroll(filtered, toRef(props, "scrollDiv"));
useCollageHotkeys(
  filtered,
  toRef(props, "selected"),
  (w) => emit("setSelected", w),
  toRef(props, "scrollDiv")
);
</script>

<template>
  <div class="flex flex-wrap justify-center">
    <CollageImage
      v-for="waifu in filtered.slice(0, limit)"
      :key="waifu.id"
      :chara="charasMap.get(waifu.character_id)!"
      :selected="waifu.id === selected?.id"
      @click="$emit('setSelected', waifu)"
    />
  </div>
</template>