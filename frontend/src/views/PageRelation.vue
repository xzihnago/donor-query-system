<template>
  <NavBar />

  <div class="flex flex-col items-center justify-center gap-5 p-5">
    <CardRwd>
      <template #title>
        <CardTitle is="label" :for="ElementId.superiorInput">功德主</CardTitle>
      </template>

      <template #content>
        <CardContent
          is="form"
          class="flex gap-4 *:grow max-[450px]:flex-col"
          @submit.prevent="search"
        >
          <InputBox
            :id="ElementId.superiorInput"
            v-model.trim="superiorQuery"
            type="text"
            placeholder="姓名"
            required
            oninput="setCustomValidity('')"
            oninvalid="setCustomValidity('請輸入姓名')"
            :disabled="isLocked"
          />

          <ButtonYellow v-if="!isLocked" type="submit">確認</ButtonYellow>
          <ButtonRed v-if="isLocked" type="submit">變更</ButtonRed>
        </CardContent>
      </template>
    </CardRwd>

    <CardRwd>
      <template #title>
        <CardTitle is="label" :for="ElementId.inferiorInput">眷屬</CardTitle>
      </template>

      <template #content>
        <CardContent is="form" class="flex gap-4 *:grow max-md:flex-col" @submit.prevent="update">
          <InputBox
            :id="ElementId.inferiorInput"
            v-model.trim="inferiorQuery"
            type="text"
            placeholder="姓名"
            required
            oninput="setCustomValidity('')"
            oninvalid="setCustomValidity('請輸入姓名')"
            :disabled="!isLocked"
          />

          <div class="flex gap-4 *:grow">
            <ButtonYellow type="submit" name="update" :disabled="!isLocked">加入</ButtonYellow>
            <ButtonRed type="submit" name="delete" :disabled="!isLocked">刪除</ButtonRed>
          </div>
        </CardContent>
      </template>
    </CardRwd>

    <CardRwd>
      <template #title>
        <CardTitle class="relative flex items-center"
          >預覽
          <div class="absolute right-1 flex rounded border border-neutral-300">
            <img
              class="h-9 w-9"
              src="/images/tree.svg"
              title="樹狀圖"
              :class="isGraph && 'bg-neutral-300'"
              @click="switchTab('mermaid')"
            />
            <img
              class="h-9 w-9"
              src="/images/table.svg"
              title="表格"
              :class="!isGraph && 'bg-neutral-300'"
              @click="switchTab('table')"
            />
          </div>
        </CardTitle>
      </template>

      <template #content>
        <CardContent class="flex *:w-full">
          <div v-show="isGraph" ref="graphRef" class="*:!max-w-none"></div>
          <table v-show="!isGraph" class="**:border **:border-neutral-300 **:p-2">
            <thead class="bg-neutral-100 text-left">
              <tr>
                <th>#</th>
                <th>功德主</th>
                <th>眷屬</th>
              </tr>
            </thead>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <tbody class="*:even:bg-neutral-100" v-html="tableContent"></tbody>
          </table>
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
import {
  ButtonRed,
  ButtonYellow,
  InputBox,
  CardRwd,
  CardTitle,
  CardContent,
  ModalConfirm,
} from "@/components";
import NavBar from "./NavBar.vue";

mermaid.initialize({ startOnLoad: false });

enum ElementId {
  superiorInput = "input-superior",
  inferiorInput = "input-inferior",
}

const modal = useTemplateRef("modal");
const modalContent = ref("");
const superiorQuery = ref("");
const inferiorQuery = ref("");
const graphRef = useTemplateRef("graphRef");
const tableContent = ref("");
const isLocked = ref(false);
const isGraph = ref(true);

const search = () => {
  if (isLocked.value) {
    isLocked.value = false;
  } else {
    isLocked.value = true;
    void reqDrawRelationTree();
  }
};

const update = (ev: SubmitEvent) => {
  if (inferiorQuery.value === superiorQuery.value) {
    modalContent.value = "眷屬不可與功德主相同";
    modal.value?.showModal();
    return;
  }

  const superior =
    (ev.submitter as HTMLButtonElement).name === "update" ? superiorQuery.value : null;

  fetch(`/api/donors/relations/${inferiorQuery.value}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      superior,
    }),
  })
    .then(async (res) => {
      switch (res.status) {
        case 200:
          void reqDrawRelationTree();
          return;

        case 401:
          alert("登入已過期，請重新登入");
          void router.push("/");
          return;

        case 404:
          modalContent.value = `「${(await res.json()).message as string}」不在資料庫中`;
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
};

const reqDrawRelationTree = () =>
  fetch(`/api/donors/relations/${superiorQuery.value}`)
    .then(async (res) => {
      switch (res.status) {
        case 200:
          void drawRelationTree(await res.json());
          return;

        case 401:
          alert("登入已過期，請重新登入");
          void router.push("/");
          return;

        case 404:
          modalContent.value = `「${superiorQuery.value}」不在資料庫中`;
          break;

        default:
          modalContent.value = "伺服器錯誤，請稍後再試";
          break;
      }
      modal.value?.showModal();
      isLocked.value = false;
    })
    .catch(() => {
      modalContent.value = "連線錯誤，請稍後再試";
      modal.value?.showModal();
    });

const switchTab = (tab: string) => {
  switch (tab) {
    case "mermaid":
      isGraph.value = true;
      break;

    case "table":
      isGraph.value = false;
      break;
  }
};

const drawRelationTree = async (raw: [string, string][]) => {
  // Graph
  const graph = [
    "graph TD",
    ...raw.map((relations) => {
      if (relations[0]) {
        return `${relations[0].replace(/\s/g, "")}(${relations[0]}) --> ${relations[1].replace(/\s/g, "")}(${relations[1]})`;
      } else {
        return `${relations[1].replace(/\s/g, "")}(${relations[1]})`;
      }
    }),
  ];

  const { svg, bindFunctions } = await mermaid.render("graphDiv", graph.join("\n"));
  if (graphRef.value) {
    graphRef.value.innerHTML = svg;
    bindFunctions?.(graphRef.value);
  }

  // Table
  const data = (raw.length > 1 ? raw.slice(1) : raw).map((relations, i) => [
    i + 1,
    ...(relations[0] ? relations : [relations[1], ""]),
  ]);

  tableContent.value = XLSX.utils.sheet_to_html(XLSX.utils.aoa_to_sheet(data));
};
</script>
