<script setup lang="ts">
import type { Chara, Waifu } from "~/server/utils/nanapi-client";
import type { CollageFilters } from "~/utils/waicolle";
import { TimestampOrder } from '../utils/waicolle';

const props = defineProps<{
  waifus: Waifu[];
  charas: Chara[];
  players: Player[];
  filters: CollageFilters;
  mediaCharas?: number[];
  selected?: Waifu;
  scrollDiv?: HTMLDivElement;
}>();
const emit = defineEmits<{
  select: [waifu: Waifu];
}>();

const charasMap = computed(() => {
  const map = new Map<number, Chara>();
  props.charas.forEach((c) => map.set(c.id_al, c));
  return map;
});
const ownersMap = computed(() => {
  const map = new Map<string, string>();
  props.players.forEach((p) => map.set(p.discord_id, p.discord_username));
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
  const sorted = props.waifus.toSorted(
    props.filters.lasts
      ? TimestampOrder.compare.bind(undefined, {
        charasMap: charasMap.value,
        ownersMap: ownersMap.value,
      })
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
  (w) => emit("select", w),
  toRef(props, "scrollDiv")
);
</script>

<template>
  <div class="flex flex-wrap justify-center">
    <CollageImage
      v-for="i in Math.min(limit, filtered.length)"
      :key="filtered[i - 1].id"
      :chara="charasMap.get(filtered[i - 1].character_id)!"
      :selected="filtered[i - 1].id === selected?.id"
      @click="emit('select', filtered[i - 1])"
    />
  </div>
</template>
