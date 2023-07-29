<script setup lang="ts">
import { MediaData } from "utils/anilist";
import { CollageFilters } from "utils/waicolle";

const props = defineProps<{
  filters: CollageFilters;
  mediaCharas?: number[];
  div?: Element;
}>();
const emit = defineEmits<{
  setFilters: [filters: CollageFilters];
  setMediaCharas: [charas?: number[]];
}>();

const mediaId = computed({
  get() {
    return props.filters.mediaId;
  },
  set(id) {
    id = id ? id : undefined;
    emit("setFilters", {
      ...props.filters,
      mediaId: id,
    });
    if (id === undefined) {
      emit("setMediaCharas", undefined);
    }
  },
});

const chara_page = ref(1);
const { load, result, loading, error, onResult } = useLazyQuery<{
  Media: MediaData;
}>(
  MEDIA_DATA_QUERY,
  computed(() => ({
    id: props.filters.mediaId,
    chara_page: chara_page.value,
  })),
  {
    enabled: computed(() => mediaId.value !== undefined),
  }
);

watch(mediaId, () => {
  chara_page.value = 1;
  load();
});

// FIXME: type me
onResult((queryResult: any) => {
  if (
    !queryResult.data ||
    queryResult.data.Media.characters.nodes.length === 0
  ) {
    return;
  }
  emit("setMediaCharas", [
    ...(props.mediaCharas ?? []),
    ...queryResult.data.Media.characters.nodes.map((chara: any) => chara.id),
  ]);
  if (queryResult.data.Media.characters.pageInfo.hasNextPage) {
    chara_page.value++;
    load();
  }
});
</script>

<template>
  <input
    type="number"
    placeholder="AniList media ID"
    v-model="mediaId"
    class="input"
  />

  <Teleport v-if="div" :to="div">
    <span v-if="mediaId && result">
      <NuxtLink :to="result.Media.siteUrl">
        [{{ result.Media.type }}] {{ result.Media.title.romaji }}
      </NuxtLink>
    </span>
    <span v-else-if="mediaId && loading">Loading media...</span>
    <span v-else-if="mediaId && error">No media found with this ID</span>
  </Teleport>
</template>
