# Supported Releases

This page lists the status, timeline and policies for currently supported releases.

:::info

## TL;DR

~~Each release is supported for a period of **six months**, and we create a new release **every three months**.~~

Updated in 2024-02-01:

As we currently haven't had enough maintainers to support the release cycle, we will release new versions from time to time, with a cycle of about **6 months**.

:::

## Naming Scheme

Our naming scheme mostly follows [Semantic Versioning 2.0.0](https://semver.org/) with `v` prepended to git tags and docker images:

```plain
v<major>.<minor>.<patch>
```

where `<minor>` is increased for each release, and `<patch>` counts the number of patches for the current `<minor>` release. A patch is usually a small change relative to the `<minor>` release.

## Support Status of Chaos Mesh

:::note

Support for Kubernetes `1.22` is available starting with version `2.0.4`.

:::

:::info

The `2.6` version also theoretically works fine on the `1.26`, `1.27`, and `1.28` versions of Kubernetes, but we do not sync the E2E tests for these versions.

:::

| Version | Currently Supported   | Release Date | End of Life  | Supported Kubernetes versions                        |
| :------ | :-------------------- | :----------- | :----------- | :--------------------------------------------------- |
| master  | No, development only  | -            | -            | 1.30, 1.31, 1.32                                     |
| 2.7     | `Yes`                 | Sep 20, 2024 | -            | 1.26, 1.27, 1.28                                     |
| 2.6     | `Yes`                 | May 31, 2023 | -            | 1.20, 1.21, 1.22, 1.23, 1.24, 1.25, 1.26, 1.27, 1.28 |
| 2.5     | No                    | Nov 22, 2022 | Sep 20, 2024 | 1.20, 1.21, 1.22, 1.23, 1.24, 1.25                   |
| 2.4     | No                    | Sep 23, 2022 | May 31, 2023 | 1.20, 1.21, 1.22, 1.23, 1.24, 1.25                   |
| 2.3     | No                    | Jul 29, 2022 | Nov 22, 2022 | 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22       |
| 2.2     | No                    | Apr 29, 2022 | Sep 23, 2022 | 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22       |
| 2.1     | No                    | Nov 30, 2021 | Jul 29, 2022 | 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22       |
| 2.0     | No                    | Jul 23, 2021 | Apr 29, 2022 | 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22       |
| 1.2     | No                    | Apr 23, 2021 | Nov 30, 2021 | 1.12, 1.13, 1.14, 1.15                               |
| 1.1     | No                    | Jan 08, 2021 | Jul 23, 2021 | 1.12, 1.13, 1.14, 1.15                               |
| 1.0     | No                    | Sep 25, 2020 | Apr 23, 2021 | 1.12, 1.13, 1.14, 1.15                               |

## Upcoming Releases

You could track the upcoming release on [GitHub milestones](https://github.com/chaos-mesh/chaos-mesh/milestones).

## Support Policies

Our support window is **six months** for each release branch. The support window corresponds to the **two latest releases**, given that we produce a new final release **every three months**.

For this we offer two type of supports:

- [Community technical support](#community-technical-support)
- [Security and bug fixes](#security-and-bug-fixes)

### Community technical support

You can request support from the community on CNCF Slack (in the [#project-chaos-mesh](https://cloud-native.slack.com/archives/C0193VAV272) channel), or using the [GitHub Discussions](https://github.com/chaos-mesh/chaos-mesh/discussions).

### Security and bug fixes

Security issues are fixed as soon as possible. They get back-ported to the last two releases, and a new patch release is immediately created for them.

For enhancements or bugfixes, we would make a new patch release as required.

## How we determine supported Kubernetes versions

After testing the compatibility of various versions of Kubernetes clusters through E2E testing, the Chaos Mesh team determines [Supported Status of Chaos Mesh](#support-status-of-chaos-mesh) based on its test results.

Below are Kubernetes versions covered by each version of the E2E tests:

| Version | Tested kubernetes Versions |
| :------ | :------------------------- |
| master  | 1.30.10, 1.31.6, 1.32.2    |
| 2.7     | 1.26.13, 1.27.10, 1.28.6   |
| 2.6     | 1.20.15, 1.23.4, 1.25.1    |
| 2.5     | 1.20, 1.23, 1.25           |
