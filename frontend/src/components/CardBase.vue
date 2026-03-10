<template>
  <div
    class="flex flex-col divide-y divide-neutral-300 rounded border border-neutral-300 shadow-md
      *:first:rounded-t *:last:rounded-b"
  >
    <slot name="title"></slot>
    <slot name="content"></slot>
  </div>
</template>
