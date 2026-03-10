<template>
  <ButtonBase
    class="border-rose-600 bg-rose-600 text-white focus:border-rose-700 focus:bg-rose-700
      focus:ring-red-500/50 enabled:hover:border-rose-700 enabled:hover:bg-rose-700"
  >
    <slot></slot>
  </ButtonBase>
</template>

<script setup lang="ts">
import ButtonBase from "./ButtonBase.vue";
</script>
