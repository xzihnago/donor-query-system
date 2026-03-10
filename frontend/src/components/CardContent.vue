<template>
  <component :is class="p-6">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
const { is = "div" } = defineProps<{
  is?: keyof HTMLElementTagNameMap;
}>();
</script>
