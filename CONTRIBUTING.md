# Contributing to vue-scrollobserver

How to open issues, set up the project, and send pull requests.<br>
<sub>Issue、開発環境、PR の進め方をまとめています。</sub>

<p align="center"><a href="#en">Read more in English</a> · <a href="#ja">日本語で読む</a></p>

<a id="en"></a>

## English

> [!IMPORTANT]
> We accept pull requests only for work a maintainer has agreed to in an [issue](https://github.com/osaxyz/vue-scrollobserver/issues). Pull requests without a prior agreement may be closed. We want to agree on the API and behavior before reviewing code.

### Workflow

1. Check for an existing issue, and open one if there is none.
2. Wait for a maintainer to agree on the issue and the approach.
3. Create a branch named `<type>/<issue-number>-<summary>`, such as `fix/12-once-rerun`, and implement the change.
4. Open a pull request that references the issue.
5. Once review and CI pass, a maintainer merges it with a merge commit.

<details>
<summary>Development</summary>
<br>

This is a Turborepo monorepo managed with pnpm.

| Path | Contents |
| --- | --- |
| `apps/vue-scrollobserver` | The library published to npm |
| `apps/demo` | A Vite app for trying the directive and composable while scrolling |
| `packages/tsconfig` | Shared TypeScript settings |

| Command | What it does |
| --- | --- |
| `pnpm install` | Installs dependencies |
| `pnpm test` | Runs the Vitest suite with happy-dom |
| `pnpm lint` | Checks everything with Biome, and the demo's `.vue` files with ESLint |
| `pnpm typecheck` | Type checks every package |
| `pnpm build` | Builds the library and the demo |
| `pnpm dev` | Watches the library and serves the demo |
| `pnpm exec turbo run deploy` | Builds and deploys the demo to Cloudflare Workers |
| `pnpm exec turbo run deploy` | Builds and deploys the demo to Cloudflare Workers |

npm shows `apps/vue-scrollobserver/README.md`, not the root README. When you change the README, update both. npm does not support GitHub alerts or relative paths, so the package README writes alerts as `> **Important:** …` and uses absolute URLs for images.

</details>

<details>
<summary>Deploying the demo</summary>
<br>

The demo is served from Cloudflare Workers Static Assets at <https://vue-scrollobserver-demo.original-sin-architecture.workers.dev>, on the Original SIN Architecture account. `apps/demo/wrangler.jsonc` has no Worker script and serves the Vite build in `dist`.

```sh
pnpm exec turbo run deploy
```

Turborepo builds the library and the demo first. Wrangler needs to be logged in with access to the account. `pnpm deploy` is a built-in pnpm command, so run the task through Turborepo.

</details>

<details>
<summary>Deploying the demo</summary>
<br>

The demo is served from Cloudflare Workers Static Assets on workers.dev, on the Original SIN Architecture account. `apps/demo/wrangler.jsonc` has no Worker script and serves the Vite build in `dist`.

```sh
pnpm exec turbo run deploy
```

Turborepo builds the library and the demo first. Wrangler needs to be logged in with access to the account. `pnpm deploy` is a built-in pnpm command, so run the task through Turborepo.

</details>

<details>
<summary>Commit messages</summary>
<br>

Write `type(scope): description`. The scope is the top-level directory that changed, the package name for changes under `apps/` or `packages/`, or `repo` for changes across the repository. The description is a short Japanese sentence that ends with an action.

```text
OK  fix(vue-scrollobserver): once で2回実行される不具合を修正
OK  docs(repo): README のクイックスタートを更新
NG  fix: bug
NG  feat(vue-scrollobserver): ディレクティブ
```

| type | Use for |
| --- | --- |
| `feat` | New features |
| `fix` | Bug fixes |
| `perf` | Performance |
| `refactor` | Changes without behavior changes |
| `docs` | Documentation |
| `test` | Tests |
| `build`, `ci`, `chore` | Build settings, CI, and everything else |

</details>

<details>
<summary>Releases</summary>
<br>

Releases are staged by `.github/workflows/publish.yml` with npm Trusted Publishing and provenance, and a maintainer approves them with two-factor authentication. Nobody publishes from a local machine.

1. Update `version` in `apps/vue-scrollobserver/package.json` and `VERSION`.
2. Merge the change into `main`.
3. Run the workflow.

```sh
gh workflow run publish.yml --ref main
```

4. Approve the staged version with two-factor authentication, on the package page on npmjs.com or from the command line. Users cannot install it until it is approved.

```sh
npm stage list vue-scrollobserver
npm stage approve <stage-id>
```

The workflow refuses to run from any branch other than `main`, and only the `npm` environment can publish.

</details>

<a id="ja"></a>

## 日本語

> [!IMPORTANT]
> PR は、メンテナーが [Issue](https://github.com/osaxyz/vue-scrollobserver/issues) で合意した作業に限って受け付けます。事前の合意がない PR は閉じることがあります。コードをレビューする前に、API と振る舞いを合意しておきたいためです。

### 進め方

1. 既存の Issue を探し、なければ起票します。
2. メンテナーが Issue と進め方に合意するのを待ちます。
3. `fix/12-once-rerun` のように `<type>/<Issue 番号>-<要約>` の名前でブランチを作り、実装します。
4. Issue を参照する PR を作ります。
5. レビューと CI が通ったら、メンテナーが merge commit でマージします。

<details>
<summary>開発</summary>
<br>

pnpm で管理する Turborepo のモノレポです。

| パス | 中身 |
| --- | --- |
| `apps/vue-scrollobserver` | npm に公開するライブラリ |
| `apps/demo` | スクロールでの動作を試す Vite のアプリ |
| `packages/tsconfig` | 共有の TypeScript 設定 |

| コマンド | 内容 |
| --- | --- |
| `pnpm install` | 依存をインストールします |
| `pnpm test` | happy-dom の上で Vitest を実行します |
| `pnpm lint` | 全体を Biome で、デモの `.vue` ファイルを ESLint で検査します |
| `pnpm typecheck` | すべてのパッケージの型を検査します |
| `pnpm build` | ライブラリとデモをビルドします |
| `pnpm dev` | ライブラリを監視しながら、デモを配信します |
| `pnpm exec turbo run deploy` | デモをビルドして Cloudflare Workers にデプロイします |
| `pnpm exec turbo run deploy` | デモをビルドして Cloudflare Workers にデプロイします |

npm に表示されるのはルートの README ではなく `apps/vue-scrollobserver/README.md` です。README を変えたら両方を更新します。npm は GitHub のアラートと相対パスに対応していないので、パッケージの README ではアラートを `> **重要**：…` の形で書き、画像は絶対 URL にします。

</details>

<details>
<summary>デモのデプロイ</summary>
<br>

デモは Cloudflare の Original SIN Architecture のアカウントで、Workers Static Assets から <https://vue-scrollobserver-demo.original-sin-architecture.workers.dev> に配信しています。`apps/demo/wrangler.jsonc` は Worker のスクリプトを持たず、Vite がビルドした `dist` を配信します。

```sh
pnpm exec turbo run deploy
```

Turborepo がライブラリとデモを先にビルドします。Wrangler は、このアカウントにアクセスできる状態でログインしている必要があります。`pnpm deploy` は pnpm の組み込みのコマンドなので、タスクは Turborepo から実行します。

</details>

<details>
<summary>デモのデプロイ</summary>
<br>

デモは Cloudflare の Original SIN Architecture のアカウントで、Workers Static Assets から workers.dev に配信しています。`apps/demo/wrangler.jsonc` は Worker のスクリプトを持たず、Vite がビルドした `dist` を配信します。

```sh
pnpm exec turbo run deploy
```

Turborepo がライブラリとデモを先にビルドします。Wrangler は、このアカウントにアクセスできる状態でログインしている必要があります。`pnpm deploy` は pnpm の組み込みのコマンドなので、タスクは Turborepo から実行します。

</details>

<details>
<summary>コミットメッセージ</summary>
<br>

`type(scope): 説明` の形で書きます。scope は変更したトップレベルのディレクトリ名で、`apps/` と `packages/` の下を変えたときはパッケージ名にし、リポジトリ全体に関わる変更は `repo` にします。説明は動作で終わる短い日本語の文にします。履歴を検索しやすくし、人とエージェントのどちらが書いても同じ見た目にするためです。

```text
OK  fix(vue-scrollobserver): once で2回実行される不具合を修正
OK  docs(repo): README のクイックスタートを更新
NG  fix: bug
NG  feat(vue-scrollobserver): ディレクティブ
```

| type | 使う場面 |
| --- | --- |
| `feat` | 新機能 |
| `fix` | 不具合の修正 |
| `perf` | 性能の改善 |
| `refactor` | 振る舞いを変えない改善 |
| `docs` | ドキュメント |
| `test` | テスト |
| `build`、`ci`、`chore` | ビルド設定、CI、その他 |

</details>

<details>
<summary>リリース</summary>
<br>

リリースは `.github/workflows/publish.yml` が npm の Trusted Publishing と provenance 付きで段階公開し、メンテナーが 2 要素認証を使って承認します。手元のマシンからは公開しません。

1. `apps/vue-scrollobserver/package.json` と `VERSION` の `version` を更新します。
2. 変更を `main` にマージします。
3. ワークフローを実行します。

```sh
gh workflow run publish.yml --ref main
```

4. 段階公開された版を、npmjs.com のパッケージのページかコマンドラインで、2 要素認証を使って承認します。承認するまで利用者はインストールできません。

```sh
npm stage list vue-scrollobserver
npm stage approve <stage-id>
```

ワークフローは `main` 以外のブランチからは動かず、公開できるのは `npm` environment だけです。

</details>
