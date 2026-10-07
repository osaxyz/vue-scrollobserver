import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ref } from "vue"
import { isScrollTriggerSupported, scrollTrigger } from "../src"
import {
    emitIntersection,
    observersOf,
    stubIntersectionObserver,
} from "./helpers"

let el: HTMLElement

beforeEach(() => {
    stubIntersectionObserver()
    el = document.createElement("div")
    document.body.append(el)
})

afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ""
})

describe("scrollTrigger", () => {
    it("runs the handler each time the element enters", () => {
        const handler = vi.fn()
        scrollTrigger(el, handler)

        emitIntersection(el)
        emitIntersection(el, false)
        emitIntersection(el)

        expect(handler).toHaveBeenCalledTimes(2)
        expect(handler).toHaveBeenCalledWith(
            expect.objectContaining({ target: el, isIntersecting: true }),
            el,
        )
    })

    it("uses the defaults of v-intersect", () => {
        scrollTrigger(el, () => {})

        expect(observersOf(el)[0]?.options).toEqual({
            root: null,
            rootMargin: "0px",
            threshold: 0.01,
        })
    })

    it("resolves a root selector when observing starts", () => {
        const root = document.createElement("div")
        root.id = "scroller"
        document.body.append(root)

        scrollTrigger(el, () => {}, { root: "#scroller", threshold: [0, 1] })

        expect(observersOf(el)[0]?.options).toMatchObject({
            root,
            threshold: [0, 1],
        })
    })

    it("stops after the first entry with once", () => {
        const handler = vi.fn()
        scrollTrigger(el, handler, { once: true })

        emitIntersection(el)
        emitIntersection(el)

        expect(handler).toHaveBeenCalledTimes(1)
        expect(observersOf(el)).toHaveLength(0)
    })

    it("skips the handler while disabled, without using up once", () => {
        const disabled = ref(true)
        const handler = vi.fn()
        scrollTrigger(el, handler, { once: true, disabled })

        emitIntersection(el)
        expect(handler).not.toHaveBeenCalled()

        disabled.value = false
        emitIntersection(el)
        expect(handler).toHaveBeenCalledTimes(1)
    })

    it("returns a function that stops observing", () => {
        const handler = vi.fn()
        const stop = scrollTrigger(el, handler)

        stop()
        emitIntersection(el)

        expect(handler).not.toHaveBeenCalled()
    })

    it("does nothing without IntersectionObserver", () => {
        vi.stubGlobal("IntersectionObserver", undefined)

        expect(isScrollTriggerSupported()).toBe(false)
        expect(() => scrollTrigger(el, () => {})()).not.toThrow()
    })
})
