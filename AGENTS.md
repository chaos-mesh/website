# Repository Guidelines

## Project Structure

This Docusaurus 3 site hosts the Chaos Mesh documentation and blog. Start documentation changes in `docs/`, which contains the Next version. Update `versioned_docs/version-*` when a change also applies to a published release. Match English changes in `i18n/zh/docusaurus-plugin-content-docs/` under `current/` or the corresponding version directory. Register new Next pages in `sidebars.js` and check the navigation for any release you update.

Blog posts live in `blog/`. Site pages, React components, and theme overrides live in `src/`. Local Docusaurus plugins live in `plugins/`. Store shared images in `static/img/` and documentation-specific images beside the relevant docs in `img/`.

## Build and Development

Use Node.js 24 to match CI and the pnpm version pinned in `package.json`. Reuse the configured pnpm store across checkouts.

- `pnpm install --frozen-lockfile` installs dependencies from the lockfile.
- `pnpm start` previews the English site with live reload on port `3001`. Use `pnpm start --locale zh` for Chinese.
- `pnpm build` builds all configured locales into `build/`. Use `pnpm serve` to preview that output.

## Style and Naming

Use two spaces and LF line endings. Prettier uses single quotes, omits JavaScript semicolons, and sorts imports. Husky runs `lint-staged` to format staged `.js` and `.md` files. Use kebab-case for new documentation filenames and PascalCase for reusable React components. Preserve existing document IDs and heading anchors. For new React UI strings, use Docusaurus `Translate` or `translate()` and refresh Chinese translation keys with `pnpm write-translations --locale zh`.

For admonitions, use `:::info` for general supplementary information and do not use `:::note`, whose gray styling is easy to confuse with body text. Keep `tip`, `caution`, `warning`, and `danger` for their own emphasis levels.

## Validation

Run `pnpm build` and review link warnings. Preview changed pages in the affected versions and locales, checking navigation, anchors, images, and rendered examples. CI builds pull requests targeting `master` and checks links in changed Markdown files. The project has no configured unit test suite or coverage threshold.

## Commits and Pull Requests

Sign off every commit with `git commit -s` to add a `Signed-off-by` trailer. Use concise, imperative subjects. For documentation changes limited to one language, use `docs(<locale>): <summary>`, for example `docs(zh): fix broken anchors`. For documentation changes spanning multiple languages, use `docs: <summary>`.

Target `master`. Explain the change, identify affected versions or locales, link relevant issues, and summarize validation.
