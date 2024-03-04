<script setup lang="ts">
import type { Chara, Player, Waifu } from "~/server/utils/nanapi-client";
import type { TrackedFilters } from "~/utils/waicolle";

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

// TODO: Maybe just a regular map?
const charasMap = computed(() => {
  const map = new Map<number, Chara>();
  props.charas.forEach((c) => map.set(c.id_al, c));
  return map;
});
const ownersMap = computed(() => {
  const map = new Map<string, string>();
  props.players.forEach((p) => map.set(p.discord_id, p.discord_username));
  return map
});

// TODO : This is not clean
(DEFAULT_TRACKED_ORDERS[0] as typeof FavoritesOrder).charasMap = charasMap.value;
(DEFAULT_TRACKED_ORDERS[2] as typeof OwnerOrder).ownersMap = ownersMap.value;

const trackedIds = computed(
  () =>
    props.players.find((p) => p.discord_id === props.filters.player)!.tracked
);

const unlockedWaifus = computed(() =>
  props.waifus.filter((w) => !w.blooded && !w.locked)
);
const playerLockedWaifus = computed(() =>
  props.waifus.filter(
    (w) => w.owner_discord_id === props.filters.player && w.locked
  )
);
const playerDuplicatedIds = computed(() => {
  const map = new Map<number, number>();
  playerLockedWaifus.value.forEach((w) => {
    const count = map.get(w.character_id) ?? 0;
    map.set(w.character_id, count + 1);
  });
  return Array.from(map.entries())
    .filter(([, count]) => count > 1)
    .map(([id]) => id);
});

function isIncluded(waifu: Waifu) {
  if (
    !charasMap.value.get(waifu.character_id)?.image ||
    charasMap.value.get(waifu.character_id)?.image!.endsWith("default.jpg")
  ) {
    return false;
  }

  if (
    !(
      trackedIds.value.includes(waifu.character_id) ||
      playerDuplicatedIds.value.includes(waifu.character_id)
    )
  ) {
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
  const sorted = unlockedWaifus.value.toSorted(
    props.filters.groupBy?.compare
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
