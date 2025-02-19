import type { AxiosResponse, AxiosError } from "axios";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const getElement = <T extends HTMLElement = HTMLElement>(id: string) => {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element as T;
};

export const showModal = (title: unknown, content: unknown) => {
  const modalTitle = getElement("modal-title");
  const modalContent = getElement("modal-content");

  modalTitle.innerText = title as string;
  modalContent.innerHTML = content as string;

  if (!document.getElementsByClassName("modal-backdrop fade show").length) {
    new bootstrap.Modal("#modal").show();

    setTimeout(() => {
      getElement("modal-button").focus();
    }, 200);
  }
};

export const apiHandler = {
  success: (res: AxiosResponse<APIResponseSuccess>) => {
    showModal("成功", res.data.data);
  },

  failed:
    (msgs?: APIHandlerFailedMsgs) => (err: AxiosError<APIResponseFailed>) => {
      if (
        axios.isAxiosError(err) &&
        err.response &&
        msgs?.[err.response.status]
      ) {
        const content = msgs[err.response.status];
        if (content instanceof Function) {
          showModal("錯誤", content(err.response.data));
        } else {
          showModal("錯誤", content);
        }
      } else if (err.response?.status === 401) {
        alert("登入逾時，請重新登入");
        window.location.replace("/");
      } else {
        showModal(
          "錯誤",
          "未知的錯誤，請稍後再試\n若問題持續發生，請聯絡管理員"
        );
      }
    },
};

type APIHandlerFailedMsgs = Partial<
  Record<number, string | ((data: APIResponseFailed) => string)>
>;
