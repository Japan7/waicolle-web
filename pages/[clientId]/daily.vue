<script setup lang="ts">
useHead({
  titleTemplate: "Daily | %s",
});

const route = useRoute();
const { data: wData, pending: wPending } = useLazyFetch("/api/waifus", {
  params: { clientId: route.params.clientId },
});
const { data: dData, pending: dPending } = useLazyFetch("/api/daily");

const selected = ref<number>();
</script>

<template>
  <div>
    <NuxtLayout>
      <template v-slot="slotProps">
        <CollageCharas
          v-if="dData"
          :charas="dData"
          :selected="selected"
          :scroll-div="slotProps.contentDiv"
          @select="
            (id) => {
              selected = id === selected ? undefined : id;
              if (selected) {
                slotProps.openDrawer();
              }
            }
          "
        />
        <p v-else-if="dPending">Loading daily...</p>
        <p v-else>Error loading daily.</p>
      </template>
      <template #side>
        <Infos
          v-if="selected"
          :waifus="wData?.waifus"
          :players="wData?.players"
          :pending="wPending"
          :chara-id="selected"
        />
      </template>
    </NuxtLayout>
  </div>
</template>
