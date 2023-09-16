<script setup lang="ts">
import type { CharaData } from "~/utils/anilist";

const props = defineProps<{
  chara: CharaData;
}>();

const route = useRoute();
const { data, pending } = useLazyFetch("/api/waifus", {
  params: { clientId: route.params.clientId },
});
const owners = computed(() =>
  data.value
    ? getOwners(props.chara.id, data.value.players, data.value.waifus)
    : []
);
</script>

<template>
  <div>
    <template v-if="data && owners.length > 0">
      <h2 class="my-2 font-bold">Owned by</h2>
      <p>{{ owners.join(" • ") }}</p>
    </template>
    <template v-else-if="data && owners.length === 0"></template>
    <p v-else-if="pending">Loading owners...</p>
    <p v-else>Error loading owners.</p>
  </div>
</template>
