import { createApp } from "vue"
import { createIntersect } from "vue-scrollobserver"
import App from "./App.vue"
import { settings } from "./settings"
import "./style.css"

createApp(App)
    .use(createIntersect({ disabled: () => !settings.enabled }))
    .mount("#app")
