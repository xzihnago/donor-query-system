import { createRouter, createWebHistory } from "vue-router";
import { PageLogin, PageSearch, PageRelation, PageUpload } from "./views";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: PageLogin },
    { path: "/search", component: PageSearch },
    { path: "/relation", component: PageRelation },
    { path: "/upload", component: PageUpload },
  ],
});

export default router;
