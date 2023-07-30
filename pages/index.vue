<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
await navigateTo(`/${runtimeConfig.public.defaultClientId}`);
</script>
