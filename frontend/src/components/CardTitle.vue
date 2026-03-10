<template>
  <component :is class="bg-neutral-100 px-4 py-2 text-xl font-medium">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
const { is = "div" } = defineProps<{
  is?: keyof HTMLElementTagNameMap;
}>();
</script>
