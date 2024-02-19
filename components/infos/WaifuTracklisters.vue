<script setup lang="ts">
import type { CharaData } from "~/utils/anilist";
import type { WaifusData } from "~/utils/nanapi";

const props = defineProps<{
  players: WaifusData["players"];
  chara: CharaData;
}>();

const tracklisters = computed(() =>
  getTracklisters(props.chara, props.players)
);
</script>

<template>
  <div>
    <template v-if="tracklisters.length > 0">
      <h2 class="my-2 font-bold">In tracking list of</h2>
      <p>{{ tracklisters.join(" • ") }}</p>
    </template>
  </div>
</template>
