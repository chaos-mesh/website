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

<a href="https://gitpod.io/#<your-repository-url>">
  <img
    src="https://img.shields.io/badge/Contribute%20with-Gitpod-908a85?logo=gitpod"
    alt="Contribute with Gitpod"
  />
</a>

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

#### Update i18n

All translated docs won't be copied automatically. You have to handle them manually. For example, release `2.2.0`:

1. Copy `i18n/zh/docusaurus-plugin-content-docs/current.json` to the same folder and rename it to `i18n/zh/docusaurus-plugin-content-docs/version-2.2.0.json`.
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

1. Some translations are not placed in the `i18n/code.json` because they are not simple strings. For example, below is the translation for the slogan in the homepage:

   ```jsx
   {
     /* Due to the below texts are not simple strings, so we can't use <Translate /> here. */
   }
   {
     i18n.currentLocale === 'en' && (
       <>
         <span>Break</span>
         <br />
         <span>Your System</span>
         <br />
         <span>Constructively</span>
       </>
     )
   }
   {
     i18n.currentLocale === 'zh' && (
       <>
         <span>破而后立</span>
         <br />
         <span className="tw-text-3xl">建设性地解构与优化你的系统</span>
       </>
     )
   }
   ```

   You can find the above code in `src/pages/index.js`. For all these cases, search for `i18n.currentLocale` in the codebase.

## How to contribute

You usually only need to modify the content in the `docs/` directory, but if some old versions also need to be updated, please update the related content in the `versioned_docs/` directory.

## License

Distributed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).
