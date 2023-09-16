<script setup lang="ts">
import type { MediaData } from "~/utils/anilist";
import type { CollageFilters } from "~/utils/waicolle";

const props = defineProps<{
  filters: CollageFilters;
  mediaCharas?: number[];
  infosDiv?: HTMLDivElement;
}>();
const emit = defineEmits<{
  filtersUpdate: [filters: CollageFilters];
  mediaCharasUpdate: [charas: number[] | undefined];
}>();

const mediaId = computed({
  get() {
    return props.filters.mediaId;
  },
  set(id) {
    id ??= undefined;
    emit("filtersUpdate", {
      ...props.filters,
      mediaId: id,
    });
    if (id === undefined) {
      emit("mediaCharasUpdate", undefined);
    }
  },
});

const chara_page = ref(1);
const variables = computed(() => ({
  id: props.filters.mediaId,
  chara_page: chara_page.value,
}));
const options = computed(() => ({ enabled: mediaId.value !== undefined }));
const { load, result, loading, error, onResult } = useLazyQuery<{
  Media: MediaData;
}>(MEDIA_DATA_QUERY, variables, options);

watch(mediaId, () => {
  chara_page.value = 1;
  load();
});

onResult((queryResult) => {
  if (
    !queryResult.data ||
    queryResult.data.Media.characters.nodes.length === 0
  ) {
    return;
  }
  emit("mediaCharasUpdate", [
    ...(props.mediaCharas ?? []),
    ...queryResult.data.Media.characters.nodes.map((chara) => chara.id),
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

  <Teleport v-if="infosDiv" :to="infosDiv">
    <span v-if="mediaId && result">
      <NuxtLink :to="result.Media.siteUrl">
        [{{ result.Media.type }}] {{ result.Media.title.romaji }}
      </NuxtLink>
    </span>
    <span v-else-if="mediaId && loading">Loading media...</span>
    <span v-else-if="mediaId && error">No media found with this ID</span>
  </Teleport>
</template>
