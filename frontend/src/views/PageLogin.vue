<template>
  <div class="flex min-h-screen flex-col items-center justify-center p-5">
    <img src="/images/banner.png" alt="banner" />

    <CardBase class="w-full max-sm:max-w-sm sm:w-sm md:w-md lg:w-lg">
      <template #title>
        <CardTitle class="text-center">捐款查詢系統</CardTitle>
      </template>

      <template #content>
        <CardContent is="form" class="text-center" @submit.prevent="login">
          <div class="mx-auto my-4 max-w-3xs">
            <label class="mb-2 inline-block" :for="ElementId.username">使用者名稱</label>
            <InputBox
              :id="ElementId.username"
              v-model.trim="data.username"
              class="w-full"
              type="text"
              required
              oninput="setCustomValidity('')"
              oninvalid="setCustomValidity('請輸入使用者名稱')"
            />
          </div>

          <div class="mx-auto my-4 max-w-3xs">
            <label class="mb-2 inline-block" :for="ElementId.password">密碼</label>
            <InputBox
              :id="ElementId.password"
              v-model="data.password"
              class="w-full"
              type="password"
              required
              oninput="setCustomValidity('')"
              oninvalid="setCustomValidity('請輸入密碼')"
            />
          </div>

          <ButtonRed class="my-2" type="submit">登入</ButtonRed>
        </CardContent>
      </template>
    </CardBase>

    <!-- page bottom margin, same as banner height -->
    <div class="h-[118px]"></div>
  </div>

  <ModalConfirm ref="modal">
    <template #title>錯誤</template>
    <template #content>{{ modalContent }}</template>
  </ModalConfirm>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import router from "@/router";
import { ButtonRed, InputBox, CardBase, CardTitle, CardContent, ModalConfirm } from "@/components";

enum ElementId {
  username = "input-username",
  password = "input-password",
}

const modal = useTemplateRef("modal");
const modalContent = ref("");
const data = ref({
  username: "",
  password: "",
});

const login = () =>
  fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data.value),
  })
    .then((res) => {
      switch (res.status) {
        case 200:
          void router.push("/search");
          return;

        case 401:
          modalContent.value = "無效的使用者名稱或密碼";
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
