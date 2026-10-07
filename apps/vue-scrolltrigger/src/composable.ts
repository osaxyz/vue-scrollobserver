import {
    hasInjectionContext,
    inject,
    type MaybeRefOrGetter,
    onScopeDispose,
    type Ref,
    readonly,
    shallowRef,
    toValue,
    watch,
} from "vue"
import { observeIntersection } from "./core"
import { SCROLL_TRIGGER_KEY } from "./plugin"
import type { ScrollTriggerHandler, ScrollTriggerOptions } from "./types"

export type UseScrollTriggerReturn = {
    /** Whether the target is in view. Stays `false` during SSR. */
    isIntersecting: Readonly<Ref<boolean>>
    /** Stop observing. Called automatically when the scope is disposed. */
    stop: () => void
}

/**
 * Composable that tracks whether `target` is in view, and runs `handler`
 * each time it enters. Falls back to the defaults given to
 * `createScrollTrigger()` when the plugin is installed.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useTemplateRef } from "vue"
 * import { useScrollTrigger } from "vue-scrolltrigger"
 *
 * const target = useTemplateRef("target")
 * const { isIntersecting } = useScrollTrigger(target)
 * </script>
 *
 * <template>
 *   <section ref="target" :class="{ 'is-visible': isIntersecting }">…</section>
 * </template>
 * ```
 */
export const useScrollTrigger = (
    target: MaybeRefOrGetter<Element | null | undefined>,
    handler?: ScrollTriggerHandler,
    options: ScrollTriggerOptions = {},
): UseScrollTriggerReturn => {
    const app_options = hasInjectionContext()
        ? inject(SCROLL_TRIGGER_KEY, null)
        : null
    const resolved: ScrollTriggerOptions = { ...app_options, ...options }
    const is_intersecting = shallowRef(false)
    let disconnect = () => {}
    let is_done = false

    const stopObserver = () => {
        disconnect()
        disconnect = () => {}
    }

    const stop_watch = watch(
        () => toValue(target),
        (el) => {
            stopObserver()
            if (!el || is_done) {
                return
            }
            disconnect = observeIntersection(el, resolved, (entry) => {
                is_intersecting.value = entry.isIntersecting
                if (!entry.isIntersecting || toValue(resolved.disabled)) {
                    return
                }
                if (resolved.once) {
                    is_done = true
                    stopObserver()
                }
                handler?.(entry, el)
            })
        },
        { immediate: true, flush: "post" },
    )

    const stop = () => {
        stop_watch()
        stopObserver()
    }
    onScopeDispose(stop, true)

    return { isIntersecting: readonly(is_intersecting), stop }
}
