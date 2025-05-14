import { getElement, showModal, apiHandler } from "utils";

document.getElementById("form-superior")?.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const superiorInput = getElement<HTMLInputElement>("input-superior");
  const inferiorInput = getElement<HTMLInputElement>("input-inferior");
  const superiorButton = getElement("button-superior");

  if (superiorInput.disabled) {
    superiorInput.disabled = false;
    inferiorInput.disabled = true;
    superiorButton.className = "btn btn-warning";
    superiorButton.innerText = "確認";
  } else {
    superiorInput.disabled = true;
    inferiorInput.disabled = false;
    superiorButton.className = "btn btn-danger";
    superiorButton.innerText = "變更";

    drawRelationTree(superiorInput.value).catch(
      apiHandler.failed({
        404: (data) => {
          superiorButton.click();
          return `「${(data.error as CommonError).message}」不在資料庫中`;
        },
      })
    );
  }
});

document.getElementById("form-inferior")?.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const superiorInput = getElement<HTMLInputElement>("input-superior");
  const inferiorInput = getElement<HTMLInputElement>("input-inferior");

  if (inferiorInput.value === superiorInput.value) {
    showModal("錯誤", "眷屬不可與功德主相同");
    return;
  }

  let superior = null;
  if ((ev.submitter as HTMLButtonElement).name === "update") {
    superior = superiorInput.value;
  }

  axios
    .put(`/api/donor-relations/${inferiorInput.value}`, {
      superior,
    })
    .then(() => drawRelationTree(superiorInput.value))
    .catch(
      apiHandler.failed({
        404: (data) => `「${(data.error as CommonError).message}」不在資料庫中`,
      })
    );
});

const drawRelationTree = async (name: string) =>
  axios
    .get<APIResponseSuccess<APIRelationData>>(`/api/donor-relations/${name}`)
    .then(async (res) => {
      // Graph
      const graph = [
        "graph TD",
        ...res.data.data.map((relations) => {
          if (relations[0]) {
            return `${relations[0].replace(/\s/g, "")}(${relations[0]}) --> ${relations[1].replace(/\s/g, "")}(${relations[1]})`;
          } else {
            return `${relations[1].replace(/\s/g, "")}(${relations[1]})`;
          }
        }),
      ];

      const { svg } = await mermaid.render("graphDiv", graph.join("\n"));
      getElement("mermaid").innerHTML = svg;

      // Table
      const data = (
        res.data.data.length > 1 ? res.data.data.slice(1) : res.data.data
      ).map((relations, i) => [
        i + 1,
        ...(relations[0] ? relations : [relations[1], ""]),
      ]);

      getElement("table").innerHTML =
        `
        <thead>
          <tr>
            <th>#</th>
            <th>功德主</th>
            <th>眷屬</th>
          </tr>
        </thead>
        ` + XLSX.utils.sheet_to_html(XLSX.utils.aoa_to_sheet(data));
    });

type APIRelationData = [string | null, string][];
