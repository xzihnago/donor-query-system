<template>
  <CardBase class="w-full max-sm:max-w-sm sm:w-sm md:w-md lg:w-lg xl:w-xl 2xl:w-2xl">
    <template #title>
      <slot name="title"></slot>
    </template>

    <template #content>
      <slot name="content"></slot>
    </template>
  </CardBase>
</template>

<script setup lang="ts">
import CardBase from "./CardBase.vue";
</script>
