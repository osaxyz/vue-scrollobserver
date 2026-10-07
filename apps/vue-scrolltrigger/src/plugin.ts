import type { InjectionKey, Plugin } from "vue"
import {
    createScrollTriggerDirective,
    type ScrollTriggerDirective,
} from "./directive"
import type { ScrollTriggerOptions, ScrollTriggerPluginOptions } from "./types"

export const SCROLL_TRIGGER_KEY: InjectionKey<ScrollTriggerOptions> =
    Symbol("vue-scrolltrigger")

/**
 * Plugin that registers `v-scroll-trigger` globally and sets app-wide
 * defaults for both the directive and `useScrollTrigger()`.
 *
 * @example
 * ```ts
 * import { createApp } from "vue"
 * import { createScrollTrigger } from "vue-scrolltrigger"
 *
 * createApp(App)
 *     .use(createScrollTrigger({ rootMargin: "0px 0px -10% 0px" }))
 *     .mount("#app")
 * ```
 */
export const createScrollTrigger = (
    options: ScrollTriggerPluginOptions = {},
): Plugin => ({
    install(app) {
        const { directive = "scroll-trigger", ...defaults } = options

        app.provide(SCROLL_TRIGGER_KEY, defaults)
        if (directive !== false) {
            app.directive(directive, createScrollTriggerDirective(defaults))
        }
    },
})

declare module "vue" {
    interface GlobalDirectives {
        vScrollTrigger: ScrollTriggerDirective
    }
}
