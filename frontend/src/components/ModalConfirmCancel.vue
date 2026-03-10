<template>
  <ModalBase ref="modal">
    <template #title>
      <slot name="title"></slot>
    </template>

    <template #content>
      <slot name="content"></slot>
    </template>

    <template #footer>
      <ButtonGray @click="modal?.close()">取消</ButtonGray>
      <ButtonRed @click="(modal?.close(), $emit('confirm'))">確定</ButtonRed>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";
import ButtonGray from "./ButtonGray.vue";
import ButtonRed from "./ButtonRed.vue";
import ModalBase from "./ModalBase.vue";

const modal = useTemplateRef("modal");

defineEmits(["confirm"]);

defineExpose({
  close: () => modal.value?.close(),
  showModal: () => modal.value?.showModal(),
});
</script>
