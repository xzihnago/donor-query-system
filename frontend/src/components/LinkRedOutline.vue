<template>
  <RouterLink v-slot="{ href, navigate }" :to custom>
    <ButtonBase
      is="a"
      class="border-red-600 bg-transparent text-red-600 focus:border-rose-600 focus:bg-rose-600
        focus:text-white focus:ring-red-500/50 enabled:hover:bg-rose-600 enabled:hover:text-white"
      :href="href"
      @click="navigate"
    >
      <slot></slot>
    </ButtonBase>
  </RouterLink>
</template>

<script setup lang="ts">
import ButtonBase from "./ButtonBase.vue";

defineProps<{
  to: string;
}>();
</script>
