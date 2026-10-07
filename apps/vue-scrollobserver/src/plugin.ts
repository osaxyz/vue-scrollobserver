import type { InjectionKey, Plugin } from "vue"
import { createIntersectDirective, type IntersectDirective } from "./directive"
import type { IntersectOptions, IntersectPluginOptions } from "./types"

export const INTERSECT_KEY: InjectionKey<IntersectOptions> =
    Symbol("vue-scrollobserver")

/**
 * Plugin that registers `v-intersect` globally and sets app-wide
 * defaults for both the directive and `useIntersect()`.
 *
 * @example
 * ```ts
 * import { createApp } from "vue"
 * import { createIntersect } from "vue-scrollobserver"
 *
 * createApp(App)
 *     .use(createIntersect({ rootMargin: "0px 0px -10% 0px" }))
 *     .mount("#app")
 * ```
 */
export const createIntersect = (
    options: IntersectPluginOptions = {},
): Plugin => ({
    install(app) {
        const { directive = "intersect", ...defaults } = options

        app.provide(INTERSECT_KEY, defaults)
        if (directive !== false) {
            app.directive(directive, createIntersectDirective(defaults))
        }
    },
})

declare module "vue" {
    interface GlobalDirectives {
        vIntersect: IntersectDirective
    }
}
