/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use strict";

const showModal = (title, content) => {
  const modal = new bootstrap.Modal(document.getElementById("modal"), {});
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");

  modalTitle.innerText = title;
  modalContent.innerHTML = content;

  modal.show();
};

const apiHandler = {
  success: (res) => {
    showModal("成功", res.data.data);
  },

  error: (error) => {
    console.error(error);
    if (window.location.pathname !== "/" && error.response.status === 401) {
      alert(error.response.data.error);
      window.location.replace("/");
    } else {
      showModal(
        "錯誤",
        typeof error.response.data.error === "string"
          ? error.response.data.error
          : JSON.stringify(error.response.data.error, null, 2)
      );
    }
  },
};

const drawRelationTree = (name) =>
  axios
    .get(`/api/donorRelations/${name}`)
    .then(async (res) => {
      const { svg } = await mermaid.render("graphDiv", res.data.data);
      document.getElementById("mermaid").innerHTML = svg;
    })
    .catch(apiHandler.error);

document.getElementById("form-login")?.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const username = document.getElementById("input-username").value;
  const password = document.getElementById("input-password").value;

  axios
    .post("/api/user/login", {
      username,
      password,
    })
    .then(() => {
      window.location.replace("/search");
    })
    .catch(apiHandler.error);
});

document.getElementById("button-logout")?.addEventListener("click", () => {
  axios
    .get("/api/user/logout")
    .catch()
    .then(() => {
      window.location.replace("/");
    });
});

document.getElementById("form-search")?.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const nameInput = document.getElementById("input-search");

  axios
    .get(`/api/donorRecords/search/${nameInput.value}`)
    .then((res) => {
      document.getElementById("search-result").value = res.data.data;
    })
    .catch(apiHandler.error);
});

document.getElementById("form-superior")?.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const superiorInput = document.getElementById("input-superior");
  const superiorButton = document.getElementById("button-superior");

  if (superiorInput.disabled) {
    superiorInput.disabled = false;
    superiorButton.className = "btn btn-warning";
    superiorButton.innerText = "確認";
  } else {
    superiorInput.disabled = true;
    superiorButton.className = "btn btn-danger";
    superiorButton.innerText = "變更";

    drawRelationTree(superiorInput.value);
  }
});

document.getElementById("form-inferior")?.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const superiorInput = document.getElementById("input-superior");
  const inferiorInput = document.getElementById("input-inferior");

  if (inferiorInput.value === superiorInput.value) {
    showModal("錯誤", "眷屬不可與功德主相同");
    return;
  }

  const relationData = {
    superior: superiorInput.value,
    inferior: inferiorInput.value,
  };

  switch (ev.submitter.name) {
    case "update":
      axios
        .post("/api/donorRelations", relationData)
        .then(drawRelationTree.bind(undefined, superiorInput.value))
        .catch(apiHandler.error);
      break;

    case "delete":
      axios
        .delete(`/api/donorRelations/${inferiorInput.value}`)
        .then(drawRelationTree.bind(undefined, superiorInput.value))
        .catch(apiHandler.error);
      break;
  }
});

document.getElementById("form-upload")?.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const fileInput = document.getElementById("input-file");
  const uploadButton = document.getElementById("button-upload");

  const formData = new FormData();
  for (const file of fileInput.files) {
    formData.append("records", file);
  }

  uploadButton.disabled = true;
  axios
    .post("/api/donorRecords/upload", formData)
    .then(apiHandler.success)
    .catch(apiHandler.error)
    .finally(() => {
      uploadButton.disabled = false;
    });
});

document.getElementById("button-export")?.addEventListener("click", () => {
  axios
    .get("/api/donorRecords/export", {
      responseType: "blob",
    })
    .then((res) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(res.data);
      link.download = `${Date.now()}.xlsx`;
      link.click();
    })
    .catch(apiHandler.error);
});

document.getElementById("button-delete")?.addEventListener("click", () => {
  axios.delete("/api/donor").then(apiHandler.success).catch(apiHandler.error);
});
