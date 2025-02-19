import { getElement, showModal, apiHandler } from "utils";

document.getElementById("form-upload")?.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const fileInput = getElement<HTMLInputElement>("input-file");
  const uploadButton = getElement<HTMLButtonElement>("button-upload");

  const formData = new FormData();
  for (const file of fileInput.files ?? []) {
    formData.append("files", file);
  }

  uploadButton.disabled = true;

  axios
    .post<APIUploadSheet>("/api/donorRecords/upload", formData)
    .then((res) => {
      const data = res.data.data.map((data) => {
        switch (data.type) {
          case "SUCCESS":
            return `成功（${data.file}）\n\u3000匯入 ${data.count.toFixed()} 筆紀錄`;

          case "MISSING_HEADER":
            return `失敗（${data.file}）\n\u3000缺少標頭「${data.error.join("、")}」`;

          case "INVALID_DATA":
            return `失敗（${data.file}）\n${data.error.map((error) => `\u3000缺少欄位：第 ${error.line.toFixed()} 列「${error.missing.join("、")}」`).join("\n")}`;
        }
      });

      showModal("上傳結果", data.join("\n"));
    })
    .catch(apiHandler.failed())
    .finally(() => {
      uploadButton.disabled = false;
    });
});

document.getElementById("button-export")?.addEventListener("click", () => {
  axios
    .get<Blob>("/api/donorRecords/export", {
      responseType: "blob",
    })
    .then((res) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(res.data);
      link.download = `${Date.now().toFixed()}.xlsx`;
      link.click();
    })
    .catch(apiHandler.failed());
});

document.getElementById("button-delete")?.addEventListener("click", () => {
  axios
    .delete<APIResetDatabase>("/api/donor")
    .then((res) => {
      showModal(
        "成功",
        [
          "成功刪除資料：",
          `\u3000捐款人 ${res.data.data.donors.toFixed()} 人`,
          `\u3000捐款紀錄 ${res.data.data.records.toFixed()} 筆`,
        ].join("\n")
      );
    })
    .catch(apiHandler.failed());
});

type APIUploadSheet = APIResponseSuccess<
  (
    | {
        type: "SUCCESS";
        file: string;
        count: number;
      }
    | {
        type: "MISSING_HEADER";
        file: string;
        error: string[];
      }
    | {
        type: "INVALID_DATA";
        file: string;
        error: {
          line: number;
          missing: string[];
        }[];
      }
  )[]
>;

type APIResetDatabase = APIResponseSuccess<{
  donors: number;
  records: number;
}>;
