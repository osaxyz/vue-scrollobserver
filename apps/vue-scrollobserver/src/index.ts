/**
 * vue-scrollobserver
 *
 * Run code when an element scrolls into view in Vue 3, with a directive,
 * a composable, or a plain function built on IntersectionObserver.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { vIntersect } from "vue-scrollobserver"
 *
 * const onEnter = (entry: IntersectionObserverEntry) => {
 *     entry.target.classList.add("is-visible")
 * }
 * </script>
 *
 * <template>
 *   <section v-intersect.once="onEnter">…</section>
 * </template>
 * ```
 */

export { type UseIntersectReturn, useIntersect } from "./composable"
export {
    DEFAULT_ROOT_MARGIN,
    DEFAULT_THRESHOLD,
    intersect,
    isIntersectSupported,
} from "./core"
export {
    createIntersectDirective,
    type IntersectDirective,
    vIntersect,
} from "./directive"
export { createIntersect, INTERSECT_KEY } from "./plugin"
export type {
    IntersectDirectiveValue,
    IntersectHandler,
    IntersectOptions,
    IntersectPluginOptions,
    IntersectRoot,
} from "./types"
