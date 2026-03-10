<template>
  <input
    v-model="model"
    class="rounded border border-neutral-200 px-3 py-1.5 transition duration-150 file:-mx-3
      file:-my-1.5 file:me-3 file:cursor-pointer file:border-e file:border-inherit
      file:bg-neutral-50 file:px-3 file:py-1.5 focus:border-blue-300 focus:ring-4
      focus:ring-blue-600/25 focus:outline-none disabled:bg-neutral-200
      [&[type='file']]:enabled:cursor-pointer"
  />
</template>

<script setup lang="ts">
const model = defineModel<string>();
</script>
