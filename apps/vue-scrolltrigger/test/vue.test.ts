import { mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
    defineComponent,
    effectScope,
    h,
    nextTick,
    ref,
    shallowRef,
    withDirectives,
} from "vue"
import {
    createScrollTrigger,
    type ScrollTriggerDirectiveValue,
    type ScrollTriggerOptions,
    useScrollTrigger,
    vScrollTrigger,
} from "../src"
import {
    emitIntersection,
    observersOf,
    stubIntersectionObserver,
} from "./helpers"

beforeEach(() => {
    stubIntersectionObserver()
})

afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ""
})

describe("v-scroll-trigger", () => {
    const mountSection = (
        value: () => ScrollTriggerDirectiveValue,
        arg?: () => string | undefined,
        modifiers: Partial<Record<"once", boolean>> = {},
    ) =>
        mount(
            defineComponent({
                setup: () => () =>
                    withDirectives(h("section", "Content"), [
                        [vScrollTrigger, value(), arg?.(), modifiers],
                    ]),
            }),
            { attachTo: document.body },
        )

    it("runs the handler when the element enters", () => {
        const handler = vi.fn()
        const wrapper = mountSection(() => handler)
        const el = wrapper.find("section").element

        emitIntersection(el, false)
        emitIntersection(el)

        expect(handler).toHaveBeenCalledOnce()
        expect(handler).toHaveBeenCalledWith(expect.anything(), el)
    })

    it("stops after the first entry with .once", () => {
        const handler = vi.fn()
        const wrapper = mountSection(() => handler, undefined, { once: true })
        const el = wrapper.find("section").element

        emitIntersection(el)
        emitIntersection(el)

        expect(handler).toHaveBeenCalledOnce()
    })

    it("uses the argument as a root selector", () => {
        const root = document.createElement("div")
        root.id = "scroller"
        document.body.append(root)

        const wrapper = mountSection(
            () => () => {},
            () => "#scroller",
        )

        expect(
            observersOf(wrapper.find("section").element)[0]?.options.root,
        ).toBe(root)
    })

    it("accepts a handler with options", () => {
        const handler = vi.fn()
        const wrapper = mountSection(() => ({
            handler,
            rootMargin: "0px 0px -20% 0px",
            once: true,
        }))
        const el = wrapper.find("section").element

        emitIntersection(el)
        emitIntersection(el)

        expect(observersOf(el)).toHaveLength(0)
        expect(handler).toHaveBeenCalledOnce()
    })

    it("follows a new handler without recreating the observer", async () => {
        const first = vi.fn()
        const second = vi.fn()
        const handler = shallowRef(first)
        const wrapper = mountSection(() => handler.value)
        const el = wrapper.find("section").element
        const [observer] = observersOf(el)

        handler.value = second
        await nextTick()
        emitIntersection(el)

        expect(observersOf(el)).toEqual([observer])
        expect(first).not.toHaveBeenCalled()
        expect(second).toHaveBeenCalledOnce()
    })

    it("recreates the observer when its options change", async () => {
        const margin = ref("0px")
        const wrapper = mountSection(() => ({
            handler: () => {},
            rootMargin: margin.value,
        }))
        const el = wrapper.find("section").element
        const [before] = observersOf(el)

        margin.value = "100px"
        await nextTick()

        const [after] = observersOf(el)
        expect(before?.is_disconnected).toBe(true)
        expect(after?.options.rootMargin).toBe("100px")
    })

    it("stops observing when bound to false", async () => {
        const handler = vi.fn()
        const value = shallowRef<ScrollTriggerDirectiveValue>(handler)
        const wrapper = mountSection(() => value.value)
        const el = wrapper.find("section").element

        value.value = false
        await nextTick()
        emitIntersection(el)

        expect(observersOf(el)).toHaveLength(0)
        expect(handler).not.toHaveBeenCalled()
    })

    it("disconnects on unmount", () => {
        const wrapper = mountSection(() => () => {})
        const el = wrapper.find("section").element
        const [observer] = observersOf(el)

        wrapper.unmount()

        expect(observer?.is_disconnected).toBe(true)
    })
})

describe("useScrollTrigger", () => {
    const mountWith = (
        handler?: () => void,
        options?: ScrollTriggerOptions,
        plugin_options = {},
    ) => {
        let result!: ReturnType<typeof useScrollTrigger>
        const wrapper = mount(
            defineComponent({
                setup() {
                    const target = shallowRef<HTMLElement | null>(null)
                    result = useScrollTrigger(target, handler, options)
                    return () => h("section", { ref: target }, "Content")
                },
            }),
            {
                attachTo: document.body,
                global: { plugins: [createScrollTrigger(plugin_options)] },
            },
        )
        return { wrapper, result, el: wrapper.find("section").element }
    }

    it("tracks whether the target is in view", async () => {
        const handler = vi.fn()
        const { result, el } = mountWith(handler)
        await nextTick()

        emitIntersection(el)
        expect(result.isIntersecting.value).toBe(true)

        emitIntersection(el, false)
        expect(result.isIntersecting.value).toBe(false)
        expect(handler).toHaveBeenCalledOnce()
    })

    it("falls back to the plugin defaults", async () => {
        const { el } = mountWith(undefined, undefined, {
            rootMargin: "50px",
        })
        await nextTick()

        expect(observersOf(el)[0]?.options.rootMargin).toBe("50px")
    })

    it("lets local options override the plugin", async () => {
        const { el } = mountWith(
            undefined,
            { rootMargin: "10px" },
            { rootMargin: "50px" },
        )
        await nextTick()

        expect(observersOf(el)[0]?.options.rootMargin).toBe("10px")
    })

    it("stops after the first entry with once", async () => {
        const handler = vi.fn()
        const { el } = mountWith(handler, { once: true })
        await nextTick()

        emitIntersection(el)
        emitIntersection(el)

        expect(handler).toHaveBeenCalledOnce()
        expect(observersOf(el)).toHaveLength(0)
    })

    it("disconnects when the component unmounts", async () => {
        const { wrapper, el } = mountWith()
        await nextTick()
        const [observer] = observersOf(el)

        wrapper.unmount()

        expect(observer?.is_disconnected).toBe(true)
    })

    it("observes a new target when the ref changes", async () => {
        const first = document.createElement("div")
        const second = document.createElement("div")
        const target = shallowRef<Element>(first)
        const scope = effectScope()

        scope.run(() => useScrollTrigger(target))
        await nextTick()
        target.value = second
        await nextTick()

        expect(observersOf(first)).toHaveLength(0)
        expect(observersOf(second)).toHaveLength(1)
        scope.stop()
        expect(observersOf(second)).toHaveLength(0)
    })
})

describe("createScrollTrigger", () => {
    const mountTemplate = (
        template: string,
        handler: () => void,
        plugin_options = {},
    ) =>
        mount(
            { template, setup: () => ({ handler }) },
            {
                attachTo: document.body,
                global: { plugins: [createScrollTrigger(plugin_options)] },
            },
        )

    it("registers v-scroll-trigger with the plugin defaults", () => {
        const handler = vi.fn()
        const wrapper = mountTemplate(
            '<section v-scroll-trigger="handler">Content</section>',
            handler,
            { threshold: 0.5 },
        )
        const el = wrapper.find("section").element

        emitIntersection(el)

        expect(observersOf(el)[0]?.options.threshold).toBe(0.5)
        expect(handler).toHaveBeenCalledOnce()
    })

    it("disables the directive through the plugin", () => {
        const disabled = ref(true)
        const handler = vi.fn()
        const wrapper = mountTemplate(
            '<section v-scroll-trigger="handler">Content</section>',
            handler,
            { disabled: () => disabled.value },
        )
        const el = wrapper.find("section").element

        emitIntersection(el)
        expect(handler).not.toHaveBeenCalled()

        disabled.value = false
        emitIntersection(el)
        expect(handler).toHaveBeenCalledOnce()
    })

    it("registers the directive under a custom name", () => {
        const handler = vi.fn()
        const wrapper = mountTemplate(
            '<section v-intersect="handler">Content</section>',
            handler,
            { directive: "intersect" },
        )

        emitIntersection(wrapper.find("section").element)

        expect(handler).toHaveBeenCalledOnce()
    })
})
