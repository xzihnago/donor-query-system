<template>
  <ButtonBase
    class="border-amber-400 bg-amber-400 text-black focus:border-yellow-400 focus:bg-yellow-400
      focus:ring-yellow-500/50 enabled:hover:border-yellow-400 enabled:hover:bg-yellow-400"
  >
    <slot></slot>
  </ButtonBase>
</template>

<script setup lang="ts">
import ButtonBase from "./ButtonBase.vue";
</script>
