import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Callback from "../views/Callback.vue";
import Create from "../views/Create.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: Home
        },
        {
            path: "/callback",
            component: Callback
        },
        {
            path: "/create",
            component: Create
        }
    ],
});

export default router;
