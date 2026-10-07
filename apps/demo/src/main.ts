import { createApp } from "vue"
import { createScrollTrigger } from "vue-scrolltrigger"
import App from "./App.vue"
import { settings } from "./settings"
import "./style.css"

createApp(App)
    .use(createScrollTrigger({ disabled: () => !settings.enabled }))
    .mount("#app")
