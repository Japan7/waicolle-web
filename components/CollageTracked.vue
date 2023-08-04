<script setup lang="ts">
import type { Chara, Player, Waifu } from "server/utils/nanapi-client";
import type { TrackedFilters } from "utils/waicolle";

const props = defineProps<{
  waifus: Waifu[];
  charas: Chara[];
  players: Player[];
  filters: TrackedFilters;
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

const trackedIds = computed(
  () =>
    props.players.find((p) => p.discord_id === props.filters.player)!.tracked
);

const playerLockedWaifus = computed(() =>
  props.waifus.filter(
    (w) => w.owner_discord_id === props.filters.player && w.locked
  )
);

function isIncluded(waifu: Waifu) {
  if (
    !charasMap.value.get(waifu.character_id)?.image ||
    charasMap.value.get(waifu.character_id)?.image!.endsWith("default.jpg")
  ) {
    return false;
  }

  if (waifu.locked || waifu.blooded) {
    return false;
  }

  if (!trackedIds.value.includes(waifu.character_id)) {
    return false;
  }

  if (props.filters.hideSingles) {
    const owned = playerLockedWaifus.value.filter(
      (w) => w.character_id === waifu.character_id
    );
    if (owned.length === 1) {
      return false;
    }
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
