<template>
  <NavBar />

  <div class="flex flex-col items-center justify-center gap-5 p-5">
    <CardRwd>
      <template #title>
        <CardTitle is="label" :for="ElementId.searchInput">搜尋</CardTitle>
      </template>

      <template #content>
        <CardContent
          is="form"
          class="flex gap-4 *:grow max-[450px]:flex-col"
          @submit.prevent="search"
        >
          <InputBox
            :id="ElementId.searchInput"
            v-model.trim="searchQuery"
            type="text"
            placeholder="姓名"
            required
            oninput="setCustomValidity('')"
            oninvalid="setCustomValidity('請輸入姓名')"
          />

          <ButtonRed type="submit">搜尋</ButtonRed>
        </CardContent>
      </template>
    </CardRwd>

    <CardRwd>
      <template #title>
        <CardTitle>搜尋結果</CardTitle>
      </template>

      <template #content>
        <CardContent class="flex flex-col gap-2">
          <div class="text-lg">功德主累積：</div>
          <InputBox disabled :value="searchResult" />
        </CardContent>
      </template>
    </CardRwd>
  </div>

  <ModalConfirm ref="modal">
    <template #title>錯誤</template>
    <template #content>{{ modalContent }}</template>
  </ModalConfirm>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import router from "@/router";
import { ButtonRed, InputBox, CardRwd, CardTitle, CardContent, ModalConfirm } from "@/components";
import NavBar from "./NavBar.vue";

enum ElementId {
  searchInput = "input-search",
}

const modal = useTemplateRef("modal");
const modalContent = ref("");
const searchQuery = ref("");
const searchResult = ref("");

const search = () =>
  fetch(`/api/donors/records/${searchQuery.value}`)
    .then(async (res) => {
      switch (res.status) {
        case 200:
          searchResult.value = await res.text();
          return;

        case 401:
          alert("登入已過期，請重新登入");
          void router.push("/");
          return;

        case 404:
          modalContent.value = `「${searchQuery.value}」不在資料庫中`;
          break;

        default:
          modalContent.value = "伺服器錯誤，請稍後再試";
          break;
      }
      modal.value?.showModal();
    })
    .catch(() => {
      modalContent.value = "連線錯誤，請稍後再試";
      modal.value?.showModal();
    });
</script>
