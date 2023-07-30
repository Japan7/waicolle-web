<script setup lang="ts">
useHead({
  titleTemplate: "Daily | %s",
});

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
      <p v-else-if="pending">Loading daily...</p>
      <p v-else>Error loading daily.</p>
    </template>

    <template #side>
      <Infos v-if="selected" :chara-id="selected" />
    </template>
  </NuxtLayout>
</template>
