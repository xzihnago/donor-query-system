import { apiHandler, getElement } from "utils";

document.getElementById("form-search")?.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const nameInput = getElement<HTMLInputElement>("input-search");
  const searchResult = getElement<HTMLInputElement>("search-result");

  axios
    .get<APIResponseSuccess<number>>(`/api/donors/records/${nameInput.value}`)
    .then((res) => {
      searchResult.value = res.data.data.toFixed();
    })
    .catch(apiHandler.failed({ 404: `「${nameInput.value}」不在資料庫中` }));
});
