<script setup lang="ts">
import type { Waifu } from "~/server/utils/nanapi-client";
import type { CharaData } from "~/utils/anilist";
import type { WaifusData } from "~/utils/nanapi";

const props = defineProps<{
  waifus?: WaifusData["waifus"];
  players?: WaifusData["players"];
  pending: boolean;
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

    <InfosWaifuProps :players="players" :chara="chara" :waifu="waifu" />

    <InfosWaifuOwners
      v-if="players !== undefined && waifus !== undefined"
      :players="players"
      :waifus="waifus"
      :chara="chara"
    />
    <p v-else-if="pending">Loading owners...</p>
    <p v-else>Error loading owners.</p>

    <InfosWaifuTracklisters
      v-if="players !== undefined"
      :players="players"
      :chara="chara"
    />
    <p v-else-if="pending">Loading tracklisters...</p>
    <p v-else>Error loading tracklisters.</p>

    <InfosCharaMedias
      :chara="chara"
      :cursor-pointer="mediaCursorPointer"
      @media-id-select="(id) => emit('mediaIdSelect', id)"
    />
  </div>
  <p v-else>Error.</p>
</template>
