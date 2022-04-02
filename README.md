<!-- markdownlint-disable-file MD033 -->
<!-- markdownlint-disable-file MD041 -->

<p align="center">
  <img src="logo.svg" width="512" alt="Chaos Mesh Logo" />
</p>
<h1 align="center">Website</h1>
<p align="center">
  Built using <a href="https://v2.docusaurus.io/" target="_blank">Docusaurus 2</a>, a modern static website generator.
</p>

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/chaos-mesh/website)

## How to develop

```sh
yarn # install deps
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

By default, the `start` command will only preview documents in English. If you want to preview documents in other languages, such as Chinese, then add `--locale` after the command:

```sh
yarn start --locale zh
```

## Build

```sh
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Release a new version

### Major or minor

```sh
yarn docusaurus docs:version x.x.x
```

The versions of the all docs split into two parts, one is the **latest (in `docs/`)** and the others are **versioned (in `versioned_docs/`)**. When a version has been released, the current latest `docs/` will be copied into `versioned_docs/` (by running the command above).

### Patch

For patch versions, it's only needed to move some folders and change some text. For example, `v2.1.3` to `v2.1.4`:

1. Replace `2.1.3` in **versions.json** with `2.1.4`.
2. `versioned_docs/version-2.1.3` to `version_docs/version-2.1.4`.
3. `versioned_sidebars/version-2.1.3-sidebars.json` to `versioned_sidebars/version-2.1.4-sidebars.json` and replace `2.1.3` with `2.1.4` in json.
4. `i18n/zh/docusaurus-plugin-content-docs/version-2.1.3` to `i18n/zh/docusaurus-plugin-content-docs/version-2.1.4`.
5. `i18n/zh/docusaurus-plugin-content-docs/version-2.1.3.json` to `i18n/zh/docusaurus-plugin-content-docs/version-2.1.4.json` and replace `2.1.3` with `2.1.4` in json.

Don't forget test the new version build after you've done the above steps!

## How to contribute

Mostly you only need to modify the content in the `docs/`, but if you want some versions to take effect as the latest, please also update the same files in the `versioned_docs/` dir.

## License

Same as [Chaos Mesh](https://github.com/chaos-mesh/chaos-mesh).
