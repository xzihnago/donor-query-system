<template>
  <div class="flex flex-col items-center">
    <div class="flex items-center p-2">
      <img src="/images/banner.png" alt="banner" />
      <ButtonRed class="absolute right-9" @click="logout">登出</ButtonRed>
    </div>

    <div
      class="flex w-full items-stretch justify-center gap-2 bg-neutral-50 px-5 py-2
        max-[400px]:flex-col"
    >
      <LinkRedOutline v-if="permissions.search" to="/search">查詢積點</LinkRedOutline>
      <LinkRedOutline v-if="permissions.relation" to="/relation">加入積點關聯</LinkRedOutline>
      <LinkRedOutline v-if="permissions.upload" to="/upload">捐款資料匯入</LinkRedOutline>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { ButtonRed, LinkRedOutline } from "@/components";
import { permissions, fetchPermissions } from "./user";

fetchPermissions()
  .then(() => {
    switch (router.currentRoute.value.path) {
      case "/search":
        if (permissions.search) return;
        break;

      case "/relation":
        if (permissions.relation) return;
        break;

      case "/upload":
        if (permissions.upload) return;
        break;
    }
    alert("權限不足");
    router.back();
  })
  .catch(() => {
    alert("登入已過期，請重新登入");
    void router.push("/");
  });

const logout = () => fetch("/api/users/logout").finally(() => router.push("/"));
</script>
