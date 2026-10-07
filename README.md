# vue-scrollobserver

Run code when an element scrolls into view in Vue 3, with a directive, a composable, or a plain function.<br>
<sub>要素が画面に入ったときに処理を実行する、Vue 3 向けのディレクティブ、composable、関数です。</sub>

<p align="center"><a href="#en">Read more in English</a> · <a href="#ja">日本語で読む</a></p>

<a id="en"></a>

## English

<p align="center">
  <a href="https://github.com/osaxyz/vue-scrollobserver"><img src="https://img.shields.io/github/stars/osaxyz/vue-scrollobserver?style=social" alt="Star vue-scrollobserver on GitHub"></a><br>
  <sub>If vue-scrollobserver helps you, a star keeps us going.</sub>
</p>

> [!IMPORTANT]
> vue-scrollobserver requires Vue 3.3 or later. It is the successor of `@osaxyz/intersect`, rewritten in TypeScript. `v-intersect` works as before, and only the package name and the plugin import change.

### Quick start

1. Install the package.

```sh
npm install vue-scrollobserver
```

2. Register the plugin.

```ts
import { createApp } from "vue"
import { createIntersect } from "vue-scrollobserver"
import App from "./App.vue"

createApp(App).use(createIntersect()).mount("#app")
```

3. Add `v-intersect` to an element.

```vue
<script setup lang="ts">
const onEnter = (entry: IntersectionObserverEntry) => {
    entry.target.classList.add("is-visible")
}
</script>

<template>
  <section v-intersect="onEnter">Runs every time it enters</section>
  <section v-intersect.once="onEnter">Runs only the first time</section>
</template>
```

4. Scroll the page. The handler runs when the element enters the viewport.

> [!TIP]
> Pass `rootMargin: "0px 0px -20% 0px"` to run the handler once the element is 20% of the screen above the bottom edge, instead of as soon as it appears.

To track whether an element is in view, use the composable. Outside components, use `intersect()`.

```ts
import { useTemplateRef } from "vue"
import { intersect, useIntersect } from "vue-scrollobserver"

const target = useTemplateRef("target")
const { isIntersecting } = useIntersect(target)

const stop = intersect(el, (entry) => console.log(entry), { once: true })
```

### Technology

<details>
<summary>Built on IntersectionObserver</summary>
<br>

vue-scrollobserver does not listen to `scroll` events or read layout on every frame. The browser reports when an element crosses the viewport, so pages with many triggers stay smooth. Each element gets its own observer, which is disconnected when the element unmounts or when `once` has run.

</details>

<details>
<summary>SSR safe</summary>
<br>

Nothing is observed on the server. `isIntersecting` from `useIntersect()` starts as `false`, so the server render and hydration agree, and the directive renders no attributes on the server. Where `IntersectionObserver` does not exist, every entry point does nothing.

</details>

<details>
<summary>Published with npm provenance</summary>
<br>

Releases are built and published from GitHub Actions with npm Trusted Publishing, so no npm token exists anywhere. Each version carries a provenance statement that links it to the commit and workflow run it was built from. The build job and the job that holds the publishing credential are separate, so a compromised dependency cannot publish a fake package. The workflow only stages each version, and it reaches users after a maintainer approves it with two-factor authentication.

</details>

### Specification

<details>
<summary>v-intersect</summary>
<br>

| Usage | Behavior |
| --- | --- |
| `v-intersect="handler"` | Runs `handler(entry, el)` each time the element enters |
| `v-intersect.once="handler"` | Runs once, then stops observing |
| `v-intersect:[selector]="handler"` | Observes against the element matching the selector instead of the viewport |
| `v-intersect="{ handler, ...options }"` | Passes options for this element |
| `v-intersect="false"` | Does nothing |

The plugin registers the directive with the options you pass. Without the plugin, import `vIntersect` in `<script setup>`. `createIntersectDirective(options)` builds a directive with its own defaults.

</details>

<details>
<summary>Functions and composable</summary>
<br>

| Export | Description |
| --- | --- |
| `intersect(el, handler, options?)` | Runs `handler` when `el` enters, and returns a function that stops observing. Can be called anywhere |
| `isIntersectSupported()` | Whether the browser has `IntersectionObserver`. `false` during SSR |
| `useIntersect(target, handler?, options?)` | Returns a readonly `isIntersecting` ref and `stop()`. `target` can be a ref, a getter or an element, and a new element is observed when it changes |
| `createIntersect(options?)` | Plugin that registers the directive and sets app-wide defaults |
| `createIntersectDirective(options?)` | Builds a directive with its own defaults |

</details>

<details>
<summary>Options</summary>
<br>

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `root` | `Element \| Document \| string \| null` | `null` | Element to observe against. A string is a selector, resolved when observing starts. `null` is the viewport |
| `rootMargin` | `string` | `"0px"` | Grows or shrinks the root, in the same shape as CSS `margin` |
| `threshold` | `number \| number[]` | `0.01` | How much of the element must be visible |
| `once` | `boolean` | `false` | Stops observing after the handler runs once |
| `disabled` | `MaybeRefOrGetter<boolean>` | `false` | Skips the handler while true. Skipped entries do not use up `once` |
| `directive` | `string \| false` | `"intersect"` | `createIntersect` only. Name of the directive. `false` skips registration |

Options given to the directive or to `useIntersect()` take precedence over the plugin options.

</details>

<details>
<summary>Nuxt</summary>
<br>

Register the plugin in a file under `plugins/`.

```ts
import { createIntersect } from "vue-scrollobserver"

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(createIntersect())
})
```

</details>

<details>
<summary>Migrating from @osaxyz/intersect</summary>
<br>

| @osaxyz/intersect | vue-scrollobserver |
| --- | --- |
| `import intersectDirective from "@osaxyz/intersect"` | `import { createIntersect } from "vue-scrollobserver"` |
| `app.use(intersectDirective)` | `app.use(createIntersect())` |

Templates need no changes. `v-intersect`, its argument, the `(entry, el)` handler and the defaults are the same.

</details>

<a id="ja"></a>

## 日本語

<p align="center">
  <a href="https://github.com/osaxyz/vue-scrollobserver"><img src="https://img.shields.io/github/stars/osaxyz/vue-scrollobserver?style=social" alt="Star vue-scrollobserver on GitHub"></a><br>
  <sub>vue-scrollobserver が役に立ったら、スターを付けてもらえると励みになります。</sub>
</p>

> [!IMPORTANT]
> vue-scrollobserver には Vue 3.3 以上が必要です。`@osaxyz/intersect` の後継として TypeScript で書き直したものです。`v-intersect` はそのまま使え、変わるのはパッケージ名とプラグインの import だけです。

### クイックスタート

1. パッケージをインストールします。

```sh
npm install vue-scrollobserver
```

2. プラグインを登録します。

```ts
import { createApp } from "vue"
import { createIntersect } from "vue-scrollobserver"
import App from "./App.vue"

createApp(App).use(createIntersect()).mount("#app")
```

3. 要素に `v-intersect` を付けます。

```vue
<script setup lang="ts">
const onEnter = (entry: IntersectionObserverEntry) => {
    entry.target.classList.add("is-visible")
}
</script>

<template>
  <section v-intersect="onEnter">画面に入るたびに実行します</section>
  <section v-intersect.once="onEnter">最初の1回だけ実行します</section>
</template>
```

4. ページをスクロールします。要素が画面に入るとハンドラが実行されます。

> [!TIP]
> `rootMargin: "0px 0px -20% 0px"` を渡すと、要素が見えた瞬間ではなく、画面の下端から 20% 上まで来たときに実行します。

要素が画面にあるかを追うときは composable を使います。コンポーネントの外では `intersect()` を使います。

```ts
import { useTemplateRef } from "vue"
import { intersect, useIntersect } from "vue-scrollobserver"

const target = useTemplateRef("target")
const { isIntersecting } = useIntersect(target)

const stop = intersect(el, (entry) => console.log(entry), { once: true })
```

### テクノロジー

<details>
<summary>IntersectionObserver の上に作っています</summary>
<br>

`scroll` イベントを監視したり、フレームごとにレイアウトを読んだりしません。要素が画面の境界を越えたときにブラウザが知らせるので、トリガーが多いページでも滑らかに動きます。監視は要素ごとに1つで、要素がアンマウントされたときと `once` で実行したあとに切断します。

</details>

<details>
<summary>SSR でも安全に使えます</summary>
<br>

サーバーでは何も監視しません。`useIntersect()` の `isIntersecting` は `false` で始まるので、サーバーの描画とハイドレーションの結果が一致します。ディレクティブはサーバーでは属性を出力しません。`IntersectionObserver` がない環境では、どの入口も何もしません。

</details>

<details>
<summary>npm の provenance 付きで公開しています</summary>
<br>

リリースは GitHub Actions から npm の Trusted Publishing でビルドして公開するので、npm のトークンはどこにも存在しません。各バージョンには、どのコミットとワークフローの実行からビルドしたかを示す provenance が付きます。ビルドするジョブと公開の証明書を持つジョブを分けているので、依存のどれかが乗っ取られても偽のパッケージは公開できません。ワークフローは各バージョンを段階公開するだけで、メンテナーが 2 要素認証を使って承認してから利用者に届きます。

</details>

### 仕様

<details>
<summary>v-intersect</summary>
<br>

| 書き方 | 動作 |
| --- | --- |
| `v-intersect="handler"` | 要素が画面に入るたびに `handler(entry, el)` を実行します |
| `v-intersect.once="handler"` | 1回だけ実行し、監視をやめます |
| `v-intersect:[selector]="handler"` | 画面の代わりに、セレクタに一致する要素を基準にします |
| `v-intersect="{ handler, ...options }"` | この要素だけのオプションを渡します |
| `v-intersect="false"` | 何もしません |

プラグインは、渡したオプションでディレクティブを登録します。プラグインを使わない場合は、`<script setup>` で `vIntersect` を import して使います。`createIntersectDirective(options)` で、独自の既定値を持つディレクティブを作れます。

</details>

<details>
<summary>関数と composable</summary>
<br>

| export | 説明 |
| --- | --- |
| `intersect(el, handler, options?)` | `el` が画面に入ったら `handler` を実行し、監視をやめる関数を返します。どこからでも呼べます |
| `isIntersectSupported()` | ブラウザに `IntersectionObserver` があるかを返します。SSR 中は `false` です |
| `useIntersect(target, handler?, options?)` | 読み取り専用の ref の `isIntersecting` と `stop()` を返します。`target` には ref、getter、要素を渡せ、変わると新しい要素を監視します |
| `createIntersect(options?)` | ディレクティブを登録し、アプリ全体の既定値を設定するプラグインです |
| `createIntersectDirective(options?)` | 独自の既定値を持つディレクティブを作ります |

</details>

<details>
<summary>オプション</summary>
<br>

| オプション | 型 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `root` | `Element \| Document \| string \| null` | `null` | 基準にする要素です。文字列はセレクタとして、監視を始めるときに探します。`null` は画面です |
| `rootMargin` | `string` | `"0px"` | 基準の範囲を広げたり狭めたりします。書き方は CSS の `margin` と同じです |
| `threshold` | `number \| number[]` | `0.01` | 要素のどれだけが見えたら実行するかです |
| `once` | `boolean` | `false` | ハンドラを1回実行したら監視をやめます |
| `disabled` | `MaybeRefOrGetter<boolean>` | `false` | true の間はハンドラを実行しません。実行しなかった回は `once` の1回に数えません |
| `directive` | `string \| false` | `"intersect"` | `createIntersect` だけで使います。ディレクティブの名前で、`false` なら登録しません |

ディレクティブや `useIntersect()` に渡したオプションは、プラグインのオプションより優先します。

</details>

<details>
<summary>Nuxt</summary>
<br>

`plugins/` の下のファイルでプラグインを登録します。

```ts
import { createIntersect } from "vue-scrollobserver"

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(createIntersect())
})
```

</details>

<details>
<summary>@osaxyz/intersect からの移行</summary>
<br>

| @osaxyz/intersect | vue-scrollobserver |
| --- | --- |
| `import intersectDirective from "@osaxyz/intersect"` | `import { createIntersect } from "vue-scrollobserver"` |
| `app.use(intersectDirective)` | `app.use(createIntersect())` |

テンプレートは書き換えなくて済みます。`v-intersect`、その引数、`(entry, el)` を受け取るハンドラ、既定値は変わりません。

</details>
