<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="top-8 left-1/2 w-full -translate-x-1/2 bg-transparent transition transition-discrete
        duration-250 not-open:translate-y-[-8vh] not-open:opacity-0 backdrop:bg-black
        backdrop:transition backdrop:duration-250 not-open:backdrop:opacity-0
        open:backdrop:opacity-50 max-sm:max-w-sm sm:w-sm md:w-md lg:w-lg xl:w-xl 2xl:w-2xl
        open:starting:translate-y-[-8vh] open:starting:opacity-0 open:backdrop:starting:opacity-0"
    >
      <div class="mx-5 divide-y divide-neutral-300 rounded bg-white">
        <div class="p-4 text-xl font-medium">
          <slot name="title"></slot>
        </div>

        <div class="max-h-[60vh] overflow-auto p-4 whitespace-pre">
          <slot name="content"></slot>
        </div>

        <div class="flex justify-end gap-2 p-4">
          <slot name="footer"></slot>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";

const dialog = useTemplateRef("dialog");

defineExpose({
  close: () => dialog.value?.close(),
  showModal: () => dialog.value?.showModal(),
});
</script>
