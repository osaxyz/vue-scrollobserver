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
import { INTERSECT_KEY } from "./plugin"
import type { IntersectHandler, IntersectOptions } from "./types"

export type UseIntersectReturn = {
    /** Whether the target is in view. Stays `false` during SSR. */
    isIntersecting: Readonly<Ref<boolean>>
    /** Stop observing. Called automatically when the scope is disposed. */
    stop: () => void
}

/**
 * Composable that tracks whether `target` is in view, and runs `handler`
 * each time it enters. Falls back to the defaults given to
 * `createIntersect()` when the plugin is installed.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useTemplateRef } from "vue"
 * import { useIntersect } from "vue-scrollobserver"
 *
 * const target = useTemplateRef("target")
 * const { isIntersecting } = useIntersect(target)
 * </script>
 *
 * <template>
 *   <section ref="target" :class="{ 'is-visible': isIntersecting }">…</section>
 * </template>
 * ```
 */
export const useIntersect = (
    target: MaybeRefOrGetter<Element | null | undefined>,
    handler?: IntersectHandler,
    options: IntersectOptions = {},
): UseIntersectReturn => {
    const app_options = hasInjectionContext()
        ? inject(INTERSECT_KEY, null)
        : null
    const resolved: IntersectOptions = { ...app_options, ...options }
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
