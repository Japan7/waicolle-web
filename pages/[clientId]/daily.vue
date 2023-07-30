<script setup lang="ts">
const { data, pending } = useDaily();

const selected = ref<number>();
</script>

<template>
  <NuxtLayout>
    <template v-slot="slotProps">
      <CollageCharas
        v-if="data"
        :charas="data"
        :selected="selected"
        :scrollDiv="slotProps.contentDiv"
        @setSelected="
          (id_al) => {
            selected = id_al === selected ? undefined : id_al;
            if (selected) {
              slotProps.openDrawer();
            }
          }
        "
      />
      <p v-else-if="pending">Loading daily...</p>
      <p v-else>Error loading daily.</p>
    </template>

    <template #side>
      <Infos v-if="selected" :charaId="selected" />
    </template>
  </NuxtLayout>
</template>
