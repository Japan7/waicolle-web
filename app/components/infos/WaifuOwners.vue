<script setup lang="ts">
import type { CharaData } from "~/utils/anilist";
import type { WaifusData } from "~/utils/nanapi";

const props = defineProps<{
  players: WaifusData["players"];
  waifus: WaifusData["waifus"];
  chara: CharaData;
}>();

const owners = computed(() =>
  getOwners(props.chara.id, props.players, props.waifus)
);
</script>

<template>
  <div>
    <template v-if="owners.length > 0">
      <h2 class="my-2 font-bold">Owned by</h2>
      <p>{{ owners.join(" • ") }}</p>
    </template>
  </div>
</template>
