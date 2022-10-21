---
title: Supported Releases
---

This page lists the status, timeline and policy for currently supported releases.

Each release is supported for a period of six months, and we create a new release every three months.

Our naming scheme mostly follows [Semantic Versioning 2.0.0](https://semver.org/) with `v` prepended to git tags and docker images:

```plain
v<major>.<minor>.<patch>
```

where `<minor>` is increased for each release, and `<patch>` counts the number of patches for the current `<minor>` release. A patch is usually a small change relative to the `<minor>` release.

## Support status of Chaos Mesh

| Version | Currently Supported  | Release Date | End of Life  | Supported Kubernetes versions                  |
| :------ | :------------------- | :----------- | :----------- | :--------------------------------------------- |
| master  | No, development only | -            | -            | 1.20, 1.21, 1.22, 1.23, 1.24, 1.25             |
| 2.4     | Yes                  | Sep 23, 2022 | -            | 1.20, 1.21, 1.22, 1.23, 1.24, 1.25             |
| 2.3     | Yes                  | Jul 29, 2022 | -            | 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22 |
| 2.2     | Yes                  | Apr 29, 2022 | -            | 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22 |
| 2.1     | No                   | Nov 30, 2021 | Jul 29, 2022 | 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22 |
| 2.0     | No                   | Jul 23, 2021 | Apr 29, 2022 | 1.15, 1.16, 1.17, 1.18, 1.19, 1.20, 1.21, 1.22 |
| 1.2     | No                   | Apr 23, 2021 | Nov 30, 2021 | 1.12, 1.13, 1.14, 1.15                         |
| 1.1     | No                   | Jan 08, 2021 | Jul 23, 2021 | 1.12, 1.13, 1.14, 1.15                         |
| 1.0     | No                   | Sep 25, 2020 | Apr 23, 2021 | 1.12, 1.13, 1.14, 1.15                         |

:::note

Note that dates in the future are uncertain and might change.

:::

:::note

The support of kubernetes 1.22 is available with release 2.0.4.

:::

## Upcoming releases

You could track our upcoming release on [Github Milestones](https://github.com/chaos-mesh/chaos-mesh/milestones).

## Support Policy

Our support window is six months for each release branch. The support window corresponds to the two latest releases, given that we produce a new final release every three months.

We offer two type of supports:

- Community technical support
- Security and bug fixes

### Community technical support

You can request support from the community on CNCF Slack (in the [#project-chaos-mesh](https://cloud-native.slack.com/archives/C0193VAV272) channel), or using [GitHub Discussion](https://github.com/chaos-mesh/chaos-mesh/discussions) .

### Security and bug fixes

Security issues are fixed as soon as possible. They get back-ported to the last two releases, and a new patch release is immediately created for them.

For enhancements or bugfixes, we would make a new patch release as required.

## How we determine supported Kubernetes versions

The list of supported Kubernetes versions displayed in the [Supported status of Chaos Mesh](#support-status-of-chaos-mesh) section depends on what the Chaos Mesh maintainers think is reasonable to support and to test.

We use e2e test for testing compatibility on each version of kubernetes cluster, our testing coverage is:

| Version | Tested kubernetes Versions |
| :------ | :------------------------- |
| master  | 1.20, 1.23, 1.25           |
| 2.4     | 1.20, 1.23, 1.25           |
| 2.3     | 1.15, 1.20, 1.23           |
| 2.2     | 1.15, 1.20, 1.23           |
