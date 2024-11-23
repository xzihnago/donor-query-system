/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use strict";

const showModal = (title, content) => {
  const modal = new bootstrap.Modal(document.getElementById("modal"), {});

  const modalTitle = document.getElementById("modal-title");
  modalTitle.innerText = title;

  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = content
    .replace(/\n/g, "<br>")
    .replace(/ /g, "&nbsp;");

  modal.show();
};

const apiErrorHandler = (error) => {
  if (error.response.status === 401) {
    alert(error.response.data.error);
    window.location.replace("/");
  } else {
    showModal("錯誤", error.response.data.error);
  }
};

const login = async () => {
  const username = document.getElementById("account").value;
  const password = document.getElementById("password").value;

  await axios
    .post("/api/user/login", {
      username,
      password,
    })
    .then(() => {
      window.location.replace("/search");
    })
    .catch(() => {
      showModal("錯誤", "帳號或密碼錯誤");
    });
};

const logout = async () => {
  await axios.get("/api/user/logout").catch();
  window.location.replace("/");
};

const search = async () => {
  const name = document.getElementById("search").value;
  if (name === "") {
    showModal("錯誤", "請輸入姓名");
    return;
  }

  await axios
    .get(`/api/donorRecords/${name}`)
    .then((res) => {
      document.getElementById("search-result").value = res.data;
    })
    .catch(apiErrorHandler);
};

const relationData = {
  name: null,
  relations: [],
};

const setChief = (clear = false) => {
  if (clear) {
    relationData.name = null;
  } else {
    const chiefInput = document.getElementById("chief-input").value;
    if (chiefInput === "") {
      showModal("錯誤", "欄位不可為空");
      return;
    }

    relationData.name = chiefInput;
  }

  document.getElementById("chief-result").value = relationData.name;
};

const setMembers = (clear = false) => {
  if (clear) {
    relationData.relations = [];
  } else {
    const memberInput = document.getElementById("members-input").value;
    if (memberInput === "") {
      showModal("錯誤", "欄位不可為空");
      return;
    } else if (memberInput === relationData.name) {
      showModal("錯誤", "眷屬不可與功德主相同");
      return;
    }

    relationData.relations.push(memberInput);
  }

  document.getElementById("members-result").value =
    relationData.relations.join("、");
};

const updateRelationship = async () => {
  const missingFields = [];
  if (!relationData.name) missingFields.push("功德主");
  if (relationData.relations.length === 0) missingFields.push("眷屬");
  if (missingFields.length > 0) {
    showModal("錯誤", `缺少欄位：${missingFields.join("、")}`);
    return;
  }

  await axios
    .post("/api/donorRelationship", relationData)
    .then((res) => {
      showModal("成功", res.data);
    })
    .catch(apiErrorHandler);
};

const upload = async () => {
  const files = document.getElementById("file").files;
  if (files.length === 0) {
    showModal("錯誤", "請選擇檔案");
    return;
  }

  const formData = new FormData();
  for (const file of files) {
    formData.append("records", file);
  }

  await axios
    .post("/api/donorRecords/upload", formData)
    .then((res) => {
      showModal("成功", res.data);
    })
    .catch(apiErrorHandler);
};
