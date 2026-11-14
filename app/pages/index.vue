<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
navigateTo(`/${runtimeConfig.public.defaultClientId}`);
</script>
