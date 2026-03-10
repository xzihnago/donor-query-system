import { reactive } from "vue";

export const permissions = reactive({
  search: false,
  relation: false,
  upload: false,
});

export const fetchPermissions = () =>
  fetch("/api/users/@me").then(async (res) => {
    switch (res.status) {
      case 200:
        {
          const user = await res.json();
          permissions.search = (user.permissions & 1) === 1;
          permissions.relation = (user.permissions & 2) === 2;
          permissions.upload = (user.permissions & 4) === 4;
        }
        break;

      default:
        throw new Error();
    }
  });
