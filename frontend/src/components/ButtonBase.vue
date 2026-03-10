<template>
  <component
    :is
    class="cursor-pointer rounded border px-3 py-1.5 text-center transition duration-150 select-none
      focus:ring-4 focus:outline-none disabled:cursor-not-allowed"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
const { is = "button" } = defineProps<{
  is?: keyof HTMLElementTagNameMap;
}>();
</script>
