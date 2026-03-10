<template>
  <ModalBase ref="modal">
    <template #title>
      <slot name="title"></slot>
    </template>

    <template #content>
      <slot name="content"></slot>
    </template>

    <template #footer>
      <ButtonGray @click="modal?.close()">確定</ButtonGray>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";
import ButtonGray from "./ButtonGray.vue";
import ModalBase from "./ModalBase.vue";

const modal = useTemplateRef("modal");

defineExpose({
  close: () => modal.value?.close(),
  showModal: () => modal.value?.showModal(),
});
</script>
