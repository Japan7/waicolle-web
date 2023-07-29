<script setup lang="ts">
import { CharaData } from "utils/anilist";

const props = defineProps<{
  chara: CharaData;
}>();

const route = useRoute();
const { data, pending } = useWaifus(route.params.clientId as string);
const tracklisters = computed(() =>
  data.value ? getTracklisters(props.chara, data.value.players) : []
);
</script>

<template>
  <div>
    <template v-if="data && tracklisters.length > 0">
      <h2 class="my-2 font-bold">In tracking list of</h2>
      <p>{{ tracklisters.join(" • ") }}</p>
    </template>
    <template v-else-if="data && tracklisters.length === 0"></template>
    <p v-else-if="pending">Loading tracklisters...</p>
    <p v-else>Error loading tracklisters.</p>
  </div>
</template>
