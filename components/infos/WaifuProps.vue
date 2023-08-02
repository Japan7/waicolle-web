<script setup lang="ts">
import type { Player, Waifu } from "server/utils/nanapi-client";
import type { CharaData } from "utils/anilist";

const props = defineProps<{
  chara: CharaData;
  waifu?: Waifu;
}>();

let players = ref<Player[]>();
watchEffect(() => {
  if (props.waifu) {
    const route = useRoute();
    const { data, pending } = useLazyFetch("/api/waifus", {
      params: { clientId: route.params.clientId },
    });
    watchEffect(() => {
      players.value = data.value?.players;
    });
  }
});
</script>

<template>
  <div class="grid grid-cols-2">
    <h2>ID</h2>
    <p>{{ chara.id }}</p>
    <h2>Favourites</h2>
    <p>
      {{ chara.favourites }} [<b> {{ getRank(chara) }}</b
      >]
    </p>

    <template v-if="waifu">
      <template v-if="players">
        <h2>Owner</h2>
        <p>
          {{
            players.find((p) => p.discord_id === waifu!.owner_discord_id)!
              .discord_username
          }}
        </p>
        <h2>Original owner</h2>
        <p>
          {{
            players.find(
              (p) => p.discord_id === waifu!.original_owner_discord_id
            )!.discord_username
          }}
        </p>
      </template>
      <p v-else>Loading players...</p>

      <h2>Timestamp</h2>
      <p>{{ waifu.timestamp.slice(0, 16) }}</p>
    </template>
  </div>

  <div v-if="waifu" class="flex text-3xl my-2">
    <p v-if="waifu.locked" class="mx-auto">🔒</p>
    <p v-if="waifu.level === 1" class="mx-auto">⭐</p>
    <p v-if="waifu.level > 1" class="mx-auto">🌟</p>
    <p v-if="waifu.nanaed" class="mx-auto">🌈</p>
    <p v-if="waifu.blooded" class="mx-auto">🩸</p>
  </div>
</template>
