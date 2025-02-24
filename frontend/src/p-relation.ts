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

  const relationData = {
    superior: superiorInput.value,
    inferior: inferiorInput.value,
  };

  const submitter = ev.submitter as HTMLButtonElement;
  switch (submitter.name) {
    case "update":
      axios
        .post("/api/donorRelations", relationData)
        .then(() => drawRelationTree(superiorInput.value))
        .catch(
          apiHandler.failed({
            404: (data) =>
              `「${(data.error as CommonError).message}」不在資料庫中`,
          })
        );
      break;

    case "delete":
      axios
        .delete(`/api/donorRelations/${inferiorInput.value}`)
        .then(() => drawRelationTree(superiorInput.value))
        .catch(
          apiHandler.failed({
            404: (data) =>
              `「${(data.error as CommonError).message}」不在資料庫中`,
          })
        );
      break;
  }
});

const drawRelationTree = async (name: string) =>
  axios
    .get<APIResponseSuccess<MermainData>>(`/api/donorRelations/${name}`)
    .then(async (res) => {
      const data = res.data.data;
      const graph = [
        "graph TD",
        ...data.map((donor) =>
          donor.length === 1
            ? `${donor[0].replace(/\s/g, "")}(${donor[0]})`
            : `${donor[0].replace(/\s/g, "")}(${donor[0]}) --> ${donor[1].replace(/\s/g, "")}(${donor[1]})`
        ),
      ];

      const { svg } = await mermaid.render("graphDiv", graph.join("\n"));
      getElement("mermaid").innerHTML = svg;
    });

type MermainData = ([string] | [string, string])[];
