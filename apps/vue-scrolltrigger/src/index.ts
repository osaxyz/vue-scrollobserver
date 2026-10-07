/**
 * vue-scrolltrigger
 *
 * Run code when an element scrolls into view in Vue 3, with a directive,
 * a composable, or a plain function built on IntersectionObserver.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { vScrollTrigger } from "vue-scrolltrigger"
 *
 * const onEnter = (entry: IntersectionObserverEntry) => {
 *     entry.target.classList.add("is-visible")
 * }
 * </script>
 *
 * <template>
 *   <section v-scroll-trigger.once="onEnter">…</section>
 * </template>
 * ```
 */

export { type UseScrollTriggerReturn, useScrollTrigger } from "./composable"
export {
    DEFAULT_ROOT_MARGIN,
    DEFAULT_THRESHOLD,
    isScrollTriggerSupported,
    scrollTrigger,
} from "./core"
export {
    createScrollTriggerDirective,
    type ScrollTriggerDirective,
    vScrollTrigger,
} from "./directive"
export { createScrollTrigger, SCROLL_TRIGGER_KEY } from "./plugin"
export type {
    ScrollTriggerDirectiveValue,
    ScrollTriggerHandler,
    ScrollTriggerOptions,
    ScrollTriggerPluginOptions,
    ScrollTriggerRoot,
} from "./types"
