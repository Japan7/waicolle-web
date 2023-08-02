<script setup lang="ts">
import type { Waifu } from "server/utils/nanapi-client";
import type { CharaData } from "utils/anilist";

const props = defineProps<{
  waifu?: Waifu;
  charaId?: number;
  mediaCursorPointer?: boolean;
}>();
const emit = defineEmits<{
  mediaIdSelect: [id: number];
}>();

const variables = computed(() => ({
  id: props.waifu?.character_id ?? props.charaId,
}));
const { result, loading } = useQuery<{ Character: CharaData }>(
  CHARA_DATA_QUERY,
  variables
);
const chara = computed<CharaData | undefined>(() => result.value?.Character);
</script>

<template>
  <p v-if="loading">Loading character...</p>
  <div v-else-if="chara" class="flex flex-col">
    <InfosCharaNames :chara="chara" />
    <InfosCharaImage :chara="chara" />
    <InfosWaifuProps :chara="chara" :waifu="waifu" />
    <InfosWaifuOwners :chara="chara" />
    <InfosWaifuTracklisters :chara="chara" />
    <InfosCharaMedias
      :chara="chara"
      :cursor-pointer="mediaCursorPointer"
      @media-id-select="(id) => emit('mediaIdSelect', id)"
    />
  </div>
  <p v-else>Error.</p>
</template>
