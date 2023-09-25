<!-- markdownlint-disable-file MD033 -->
<!-- markdownlint-disable-file MD041 -->

<p align="center">
  <img src="logo.svg#gh-light-mode-only" width="512" alt="Chaos Mesh Logo" />
  <img src="logo-white.svg#gh-dark-mode-only" width="512" alt="Chaos Mesh Logo" />
</p>
<h1 align="center">Website</h1>
<p align="center">
  Built using <a href="https://v2.docusaurus.io/" target="_blank">Docusaurus 2</a>, a modern static website generator.
</p>

<a href="https://gitpod.io/#<your-repository-url>">
  <img
    src="https://img.shields.io/badge/Contribute%20with-Gitpod-908a85?logo=gitpod"
    alt="Contribute with Gitpod"
  />
</a>

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

### Major or minor

```sh
pnpm docusaurus docs:version x.x.x
```

The versions of the all docs split into two parts, one is the **latest (in `docs/`)** and the others are **versioned (in `versioned_docs/`)**. When a version has been released, the current latest `docs/` will be copied into `versioned_docs/` (by running the command above).

#### i18n

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

### Patch

For patch versions, it's only needed to move some folders and change some text. For example, `v2.1.3` to `v2.1.4`:

1. Replace `2.1.3` in **versions.json** with `2.1.4`.
2. `versioned_docs/version-2.1.3` to `versioned_docs/version-2.1.4`.
3. `versioned_sidebars/version-2.1.3-sidebars.json` to `versioned_sidebars/version-2.1.4-sidebars.json` and replace `2.1.3` with `2.1.4` (if have) in json.
4. `i18n/zh/docusaurus-plugin-content-docs/version-2.1.3` to `i18n/zh/docusaurus-plugin-content-docs/version-2.1.4`.
5. `i18n/zh/docusaurus-plugin-content-docs/version-2.1.3.json` to `i18n/zh/docusaurus-plugin-content-docs/version-2.1.4.json` and replace `2.1.3` with `2.1.4` in json.
6. Update `src/data/versions.js`.

Don't forget test the new version build after you've done the above steps!

## How to contribute

Mostly you only need to modify the content in the `docs/`, but if you want some versions to take effect as the latest, please also update the same files in the `versioned_docs/` dir.

## License

Distributed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).
