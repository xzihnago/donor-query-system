import type { CellObject } from "xlsx";
import { getElement, showModal, apiHandler } from "utils";

document
  .getElementById("form-upload")
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  ?.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const fileInput = getElement<HTMLInputElement>("input-file");
    const uploadButton = getElement<HTMLButtonElement>("button-upload");
    uploadButton.disabled = true;

    const tasks = Array.from(fileInput.files ?? [])
      .map((file) => [file.name, file.arrayBuffer()] as const)
      .map(async ([file, buffer]) => {
        const book = XLSX.read(await buffer);
        const sheet = book.Sheets[book.SheetNames[0]];

        // Check if required headers are present
        const range = XLSX.utils.decode_range(sheet["!ref"] ?? "");
        const headers = Array.from(
          {
            length: range.e.c - range.s.c + 1,
          },
          (_, i) =>
            sheet[
              XLSX.utils.encode_cell({ r: range.s.r, c: range.s.c + i })
            ] as CellObject | undefined
        ).map((cell) => cell?.v);

        const missing = ["供養者", "金額"].filter(
          (header) => !headers.includes(header)
        );
        if (missing.length > 0) {
          return {
            type: "INVALID_HEADER",
            file,
            error: missing,
          } as const;
        }

        // Check if required fields are present
        const error: { line: number; missing: string[] }[] = [];
        const data = XLSX.utils
          .sheet_to_json<Record<string, string>>(sheet)
          .map((record) => [
            record["供養者"] ? String(record["供養者"]).trim() : "",
            record["金額"] ? Number(record["金額"]) : NaN,
          ])
          .filter((record, i) => {
            const missing = ["供養者", "金額"].filter((_, i) =>
              [
                (value: string) => value.length === 0,
                (value: number) => isNaN(value),
              ][i](record[i] as never)
            );

            if (missing.length === 1) {
              error.push({
                line: i + 2,
                missing,
              });
            }

            return missing.length === 0;
          });

        if (error.length > 0) {
          return {
            type: "INVALID_DATA",
            file,
            error,
          } as const;
        }

        return {
          type: "PENDING",
          file,
          count: data.length,
          data,
        } as const;
      });

    const data = await Promise.all(tasks);
    const body = data
      .filter((data) => data.type === "PENDING")
      .map((data) => data.data)
      .flat();

    axios
      .post("/api/donorRecords/upload", body)
      .then(() => {
        const result = data.map((data) => {
          switch (data.type) {
            case "PENDING":
              return `成功（${data.file}）\n\u3000匯入 ${data.count.toFixed()} 筆紀錄`;

            case "INVALID_HEADER":
              return `失敗（${data.file}）\n\u3000缺少標頭「${data.error.join("、")}」`;

            case "INVALID_DATA":
              return `失敗（${data.file}）\n${data.error.map((error) => `\u3000缺少欄位：第 ${error.line.toFixed()} 列「${error.missing.join("、")}」`).join("\n")}`;
          }
        });

        showModal("上傳結果", result.join("\n"));
      })
      .catch(apiHandler.failed())
      .finally(() => {
        uploadButton.disabled = false;
      });
  });

document.getElementById("button-export")?.addEventListener("click", () => {
  axios
    .get<APIResponseSuccess<[string, number][]>>("/api/donorRecords/export")
    .then((res) => {
      const book = XLSX.utils.book_new();
      const sheet = XLSX.utils.aoa_to_sheet([
        ["供養者", "金額"],
        ...res.data.data,
      ]);

      XLSX.utils.book_append_sheet(book, sheet, "捐款統計");
      XLSX.writeFile(book, `${Date.now().toFixed()}.xlsx`);
    })
    .catch(apiHandler.failed());
});

document.getElementById("button-delete")?.addEventListener("click", () => {
  axios
    .delete<APIResetDatabase>("/api/donor")
    .then((res) =>
      setTimeout(() => {
        showModal(
          "成功",
          [
            "成功刪除資料：",
            `\u3000捐款人 ${res.data.data.donors.toFixed()} 人`,
            `\u3000捐款紀錄 ${res.data.data.records.toFixed()} 筆`,
          ].join("\n")
        );
      }, 200)
    )
    .catch(apiHandler.failed());
});

type APIResetDatabase = APIResponseSuccess<{
  donors: number;
  records: number;
}>;
