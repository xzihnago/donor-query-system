<template>
  <ButtonBase
    class="border-gray-500 bg-gray-500 text-white focus:border-gray-600 focus:bg-gray-600
      focus:ring-gray-500/50 enabled:hover:border-gray-600 enabled:hover:bg-gray-600"
  >
    <slot></slot>
  </ButtonBase>
</template>

<script setup lang="ts">
import ButtonBase from "./ButtonBase.vue";
</script>
