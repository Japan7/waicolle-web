<script setup lang="ts">
const { data, pending } = useDaily();

const selected = ref<number>();
</script>

<template>
  <NuxtLayout>
    <CollageCharas
      v-if="data"
      :charas="data"
      :selected="selected"
      @select="(id_al) => (selected = id_al === selected ? undefined : id_al)"
    />
    <p v-else-if="pending">Loading daily...</p>
    <p v-else>Error loading daily.</p>

    <template #side>
      <Infos v-if="selected" :charaId="selected" />
    </template>
  </NuxtLayout>
</template>
