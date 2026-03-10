<template>
  <NavBar />

  <div class="flex flex-col items-center justify-center gap-5 p-5">
    <CardRwd>
      <template #title>
        <CardTitle is="label" :for="ElementId.fileInput">上傳</CardTitle>
      </template>

      <template #content>
        <CardContent
          is="form"
          class="flex gap-4 *:grow max-md:flex-col"
          @change="files = $event.target.files"
          @submit.prevent="upload"
        >
          <InputBox
            :id="ElementId.fileInput"
            type="file"
            accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            multiple
            required
            oninput="setCustomValidity('')"
            oninvalid="setCustomValidity('請選擇檔案')"
          />

          <ButtonRed type="submit" :disabled="isUploading">上傳</ButtonRed>
        </CardContent>
      </template>
    </CardRwd>

    <CardRwd>
      <template #title>
        <CardTitle>資料庫</CardTitle>
      </template>

      <template #content>
        <CardContent class="flex gap-4 *:grow max-[450px]:flex-col">
          <ButtonYellow @click="exportSheet">匯出並下載</ButtonYellow>
          <ButtonRed @click="modalReset?.showModal()">重設資料庫</ButtonRed>
        </CardContent>
      </template>
    </CardRwd>
  </div>

  <ModalConfirm ref="modal">
    <template #title>{{ modalTitle }}</template>
    <template #content>{{ modalContent }}</template>
  </ModalConfirm>
  <ModalConfirmCancel ref="modal-reset" @confirm="resetDatabase">
    <template #title>重設資料庫</template>
    <template #content>
      {{
        `以下資料將會刪除：
\u3000所有捐款紀錄
\u3000未加入關聯之捐款者

以下資料將會保留：
\u3000已加入關聯之捐款者

此操作不可逆，確定重設資料庫？`
      }}
    </template>
  </ModalConfirmCancel>
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
  ModalConfirmCancel,
} from "@/components";
import NavBar from "./NavBar.vue";
import { SheetResultType, parseFile } from "./sheet";

enum ElementId {
  fileInput = "input-file",
}

const modal = useTemplateRef("modal");
const modalReset = useTemplateRef("modal-reset");
const modalTitle = ref("");
const modalContent = ref("");
const isUploading = ref(false);
const files = ref<FileList | null>(null);

const upload = async () => {
  isUploading.value = true;

  const data = await Promise.all(Array.from(files.value ?? [], parseFile));
  const body = data.flatMap((data) => (data.type === SheetResultType.PENDING ? data.data : []));

  fetch("/api/donors/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      switch (res.status) {
        case 200:
          modalTitle.value = "上傳結果";
          modalContent.value = data
            .map((data) => {
              switch (data.type) {
                case SheetResultType.PENDING:
                  return [data.file, `\u3000成功（${data.count.toFixed()} 筆紀錄）`].join("\n");

                case SheetResultType.INVALID_HEADER:
                  return [
                    data.file,
                    "\u3000失敗（缺少標頭）",
                    `\u3000\u3000「${data.error.join("、")}」`,
                  ].join("\n");

                case SheetResultType.INVALID_DATA:
                  return [
                    data.file,
                    "\u3000失敗（無效欄位）",
                    ...data.error.map(
                      (error) =>
                        `\u3000\u3000第 ${error.line.toFixed()} 列「${error.missing.join("、")}」`,
                    ),
                  ].join("\n");
              }
            })
            .join("\n\n");
          break;

        case 401:
          alert("登入已過期，請重新登入");
          void router.push("/");
          return;

        default:
          modalTitle.value = "錯誤";
          modalContent.value = "伺服器錯誤，請稍後再試";
          break;
      }
      modal.value?.showModal();
    })
    .catch(() => {
      modalTitle.value = "錯誤";
      modalContent.value = "連線錯誤，請稍後再試";
      modal.value?.showModal();
    })
    .finally(() => (isUploading.value = false));
};

const exportSheet = () => {
  fetch("/api/donors/records")
    .then(async (res) => {
      switch (res.status) {
        case 200:
          {
            const data = await res.json();
            const book = XLSX.utils.book_new();
            const sheet = XLSX.utils.aoa_to_sheet([["供養者", "金額"], ...data]);

            XLSX.utils.book_append_sheet(book, sheet, "捐款統計");
            XLSX.writeFile(book, `${Date.now().toFixed()}.xlsx`);
          }
          return;

        case 401:
          alert("登入已過期，請重新登入");
          void router.push("/");
          return;

        default:
          modalTitle.value = "錯誤";
          modalContent.value = "伺服器錯誤，請稍後再試";
          break;
      }
      modal.value?.showModal();
    })
    .catch(() => {
      modalTitle.value = "錯誤";
      modalContent.value = "連線錯誤，請稍後再試";
      modal.value?.showModal();
    });
};

const resetDatabase = () => {
  fetch("/api/donors", {
    method: "DELETE",
  })
    .then(async (res) => {
      switch (res.status) {
        case 200:
          {
            const data: { donors: number; records: number } = await res.json();
            modalTitle.value = "成功";
            modalContent.value = [
              "成功刪除資料：",
              `\u3000捐款人 ${data.donors.toFixed()} 人`,
              `\u3000捐款紀錄 ${data.records.toFixed()} 筆`,
            ].join("\n");
          }
          break;

        case 401:
          alert("登入已過期，請重新登入");
          void router.push("/");
          return;

        default:
          modalTitle.value = "錯誤";
          modalContent.value = "伺服器錯誤，請稍後再試";
          break;
      }
      modal.value?.showModal();
    })
    .catch(() => {
      modalTitle.value = "錯誤";
      modalContent.value = "連線錯誤，請稍後再試";
      modal.value?.showModal();
    });
};
</script>
