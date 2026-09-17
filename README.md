<!-- markdownlint-disable-file MD033 -->
<!-- markdownlint-disable-file MD041 -->

<p align="center">
  <img src="logo.svg#gh-light-mode-only" width="512" alt="Chaos Mesh Logo" />
  <img src="logo-white.svg#gh-dark-mode-only" width="512" alt="Chaos Mesh Logo" />
</p>
<h1 align="center">Website</h1>
<p align="center">
  Built using <a href="https://docusaurus.io/" target="_blank">Docusaurus 3</a>, a modern static website generator.
</p>

## Table of Contents

- [How to develop](#how-to-develop)
- [Build](#build)
- [Release a new version](#release-a-new-version)
  - [Release a major or minor version](#release-a-major-or-minor-version)
    - [Update i18n](#update-i18n)
  - [Release a patch version](#release-a-patch-version)
- [How to add a new language translation](#how-to-add-a-new-language-translation)
- [How to contribute](#how-to-contribute)
- [License](#license)

## How to develop

```sh
pnpm i # install deps
pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

By default, the `start` command will only preview documents in English. If you want to preview documents in other languages, such as Chinese, then add `--locale` after the command:

```sh
pnpm start --locale zh
```

## Build

```sh
pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Release a new version

### Release a major or minor version

```sh
pnpm docusaurus docs:version x.x.x
```

The doc versions are split into two parts, one is the **latest (in `docs/`)** and the others are **versioned (in `versioned_docs/`)**. When releasing a new version, the current latest `docs/` will be copied into `versioned_docs/` (by running the command above).

After running the command, you need to do the following steps:

1. Update `src/data/versions.js`.

#### Update i18n

All translated docs won't be copied automatically. You have to handle them manually. For example, release `2.2.0`:

1. Copy `i18n/zh/docusaurus-plugin-content-docs/current.json` to the same folder and rename it to `i18n/zh/docusaurus-plugin-content-docs/version-2.2.0.json` (Newly Docusaurus versions will do this automatically).
2. The replace `Next` and `current` in `version-2.2.0.json`, e.g.:

   ```json
   "version.label": {
     "message": "Next",
     "description": "The label for version current"
   }
   ```

   to:

   ```json
    "version.label": {
      "message": "2.2.0",
      "description": "The label for version 2.2.0"
    }
   ```

Don't forget test the new version build after you've done the above steps!

### Release a patch version

For patch versions, it's only needed to move some folders and change some text. For example, `v2.1.3` to `v2.1.4`:

1. Replace `2.1.3` in **versions.json** with `2.1.4`.
2. `versioned_docs/version-2.1.3` to `versioned_docs/version-2.1.4`.
3. `versioned_sidebars/version-2.1.3-sidebars.json` to `versioned_sidebars/version-2.1.4-sidebars.json`.
4. `i18n/zh/docusaurus-plugin-content-docs/version-2.1.3` to `i18n/zh/docusaurus-plugin-content-docs/version-2.1.4`.
5. `i18n/zh/docusaurus-plugin-content-docs/version-2.1.3.json` to `i18n/zh/docusaurus-plugin-content-docs/version-2.1.4.json` and replace `2.1.3` with `2.1.4` in json.
6. Update `src/data/versions.js`.

Don't forget test the new version build after you've done the above steps!

## How to add a new language translation

Please refer to <https://docusaurus.io/docs/i18n/tutorial> for the basic steps.

Below are some specific points:

1. Use Docusaurus translation APIs for all user-facing text in React pages and components:

   - Use `<Translate>` for JSX children.
   - Use `translate()` for values that must be strings, such as page metadata, `alt`, `aria-label`, and `placeholder` props.
   - Keep default messages as hardcoded strings so that Docusaurus can extract them statically.
   - Use `<Translate values={...}>` for rich text. JSX elements such as styled text and links can be passed as placeholders, so do not branch on `i18n.currentLocale`.

   For example, a homepage heading with translated, styled text should use JSX interpolation:

   ```jsx
   <Translate
     id="home.features.title"
     values={{
       emphasis: (
         <span className={styles.heroTitle}>
           <Translate id="home.features.title.emphasis">Cloud Native + Chaos Engineering</Translate>
         </span>
       ),
     }}
   >
     {'Make {emphasis} simple and straightforward'}
   </Translate>
   ```

2. After adding or changing translatable React text, extract the translation keys:

   ```sh
   pnpm write-translations --locale zh
   ```

   Translate the generated entries in `i18n/zh/code.json`. Other locales use the same `i18n/<locale>/code.json` convention. Review the generated diff before committing because the command can also refresh translation metadata from Docusaurus plugins.

3. Preview and verify the translated site:

   ```sh
   pnpm start --locale zh
   pnpm build
   ```

   The production build must succeed for every locale configured in `docusaurus.config.js`.

## How to contribute

You usually only need to modify the content in the `docs/` directory, but if some old versions also need to be updated, please update the related content in the `versioned_docs/` directory.

## License

Distributed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).
