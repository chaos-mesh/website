# AGENTS.md

This file provides guidance to LLM agents when working with code in this repository.

## Project Overview

This is the documentation website for **Chaos Mesh**, a Kubernetes chaos engineering platform. The site is built with **Docusaurus 3** and supports multiple versions and locales (English and Chinese).

## Development Commands

### Setup and Development

```bash
pnpm i                # Install dependencies (requires Node.js >=22.0.0)
pnpm start            # Start dev server (English only by default)
pnpm start --locale zh  # Start dev server with Chinese locale
```

### Building and Deployment

```bash
pnpm build            # Build static site to build/ directory
pnpm serve            # Serve built site locally
pnpm clear            # Clear build artifacts and cache
```

### Versioning

```bash
# Release a new major/minor version
pnpm docusaurus docs:version x.x.x

# After versioning, manually update:
# 1. src/data/versions.js
# 2. i18n translations (see README.md for details)
```

### Utilities

```bash
pnpm docusaurus write-translations  # Extract i18n strings
pnpm docusaurus write-heading-ids   # Add heading IDs to markdown
```

### Code Quality

Prettier runs automatically on commit via husky + lint-staged for `*.js` and `*.md` files.

## Architecture

### Directory Structure

- **`docs/`**: Latest version documentation (unversioned)
- **`versioned_docs/`**: Archived versioned documentation
- **`versioned_sidebars/`**: Sidebar configs per version
- **`blog/`**: Blog posts
- **`i18n/zh/`**: Chinese translations (mirrors structure)
- **`src/`**:
  - **`components/`**: React components (Features, Mesh animation, PickVersion, etc.)
  - **`data/`**: Data files (`versions.js`, `whoIsUsing.js`)
  - **`pages/`**: Custom pages (homepage, contact, versions)
  - **`theme/`**: Docusaurus theme customizations
  - **`styles/`**: Global CSS
- **`static/`**: Static assets (images, icons)
- **`docusaurus-tailwind-v3/`**: Custom Docusaurus plugin for Tailwind CSS integration

### Key Configuration Files

- **`docusaurus.config.js`**: Main Docusaurus configuration
  - Site metadata and URLs
  - i18n settings (en/zh locales)
  - Theme config (navbar, footer, algolia search, prism)
  - Custom plugins (Tailwind, Microsoft Clarity)
- **`sidebars.js`**: Documentation sidebar structure
- **`versions.json`**: Active documentation versions
- **`tailwind.config.js`**: Tailwind with `tw-` prefix and DaisyUI
- **`.prettierrc`**: Prettier config with import sorting

### Versioning System

The site maintains multiple documentation versions:

- **Current (`docs/`)**: Latest development version
- **Stable versions** (defined in `versions.json` and `src/data/versions.js`): Released versions
- When releasing a version, `docs/` is frozen into `versioned_docs/version-x.x.x/`

### i18n Architecture

- **Default locale**: English (`en`)
- **Supported locales**: English (`en`), Chinese (`zh`)
- **Translation structure**:
  - `i18n/zh/code.json`: General UI translations
  - `i18n/zh/docusaurus-plugin-content-docs/`: Docs translations
  - `i18n/zh/docusaurus-plugin-content-blog/`: Blog translations
  - `i18n/zh/docusaurus-plugin-content-pages/`: Custom pages translations
- **Important**: Some homepage text (multi-line slogans) is not translatable via `<Translate />` and must be handled with `i18n.currentLocale === 'zh'` conditionals (see `src/pages/index.js`)

### Styling System

- **Tailwind CSS**: Integrated via custom plugin with `tw-` prefix to avoid conflicts
- **DaisyUI**: Component library with custom theme colors (`primary: #10a6fa`)
- **Dark mode**: Controlled by Docusaurus theme (`[data-theme="dark"]`)
- **GSAP**: Used for scroll animations on homepage

### Custom Components

- **`Mesh.jsx`**: WebGL/Canvas animated mesh background for homepage
- **`Features.jsx`**: Feature grid for homepage
- **`PickVersion.jsx`**: Version-aware code snippet component
- **`PickHelmVersion.jsx`**: Helm version selector
- **`CodeGrid.jsx`**: Code examples grid
- **`CalComInlineEmbed.jsx` / `CalComPopupEmbed.jsx`**: Cal.com integration

## Workflow Patterns

### Adding New Documentation

1. Edit files in `docs/` for the latest version
2. If older versions need updates, modify files in `versioned_docs/version-x.x.x/`
3. For i18n, update corresponding files in `i18n/zh/`

### Releasing a New Version

Follow the detailed steps in `README.md`:

1. Run `pnpm docusaurus docs:version x.x.x`
2. Update `src/data/versions.js`
3. Copy and update i18n files (version-specific JSON and translated docs)
4. Test build thoroughly

### Adding Chinese Translations

- For simple strings: Use `<Translate id="..." />` component
- For complex JSX: Use `i18n.currentLocale === 'zh'` conditionals
- Search codebase for `i18n.currentLocale` to find all hardcoded locale checks

### Styling Changes

- Use `tw-` prefix for all Tailwind classes
- Respect dark mode with Docusaurus theme data attributes
- Check both light/dark modes when making visual changes

## Important Notes

### Package Manager

This project uses **pnpm** (version 10.18.1 specified in `package.json`). Always use `pnpm` instead of `npm` or `yarn`.

### Node Version

Requires Node.js **>=22.0.0** (specified in `package.json` engines field). Check `.nvmrc` for exact version.

### Build Warnings

The build script uses `DOCUSAURUS_IGNORE_SSG_WARNINGS=true` to suppress SSG warnings during production builds.

### Pre-commit Hooks

Husky runs `lint-staged` on commit, which auto-formats JS and MD files with Prettier. Ensure code passes formatting before committing.

### Search

The site uses Algolia DocSearch. The search index is managed externally (appId: `3BY0S3HQX6`).

### Analytics

- Google Analytics (gtag): `G-T31S4LR9LL`
- Microsoft Clarity: `lggqck9srz`

### External Links

- Main project repo: https://github.com/chaos-mesh/chaos-mesh
- Edit links point to: https://github.com/chaos-mesh/website/edit/master/
- Production URL: https://chaos-mesh.org

### License

Documentation is distributed under CC-BY-4.0 license.
