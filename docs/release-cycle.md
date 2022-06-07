---
title: Chaos Mesh Release Cycle
---

This document is focused on Chaos Mesh developers and contributors who need to create an enhancement, issue, or pull request which targets a specific release milestone.

## Roles

### Contributors/Developers

Contributors are expected to participate in the release cycle with the following forms:

- participant discussions of new features/enhancements collection
- contribute with codes/docs for Chaos Mesh
- help to prune feature if required

As a contributor, the only 2 things you need to notice are:

- you might be asked to complete your uncompleted work, or prune them from the release branch.
- your PR might not be merged into master quickly during “Code Freeze”

### Release Manager

"Release Managers" is an umbrella term that encompasses the set of Chaos Mesh contributors responsible for maintaining release branches, tagging releases, and building/packaging Chaos Mesh.

Release Manager are expected to:

- collect “new features/enhancements” as a GitHub Issue
- create and maintain `vX.Y.0` GitHub Milestone
- schedule and hold the required meeting
- keep maintaining the tracking documentation for next coming release
- communicate with contributors asking for help to complete/prune the unfinished features/docs; Or prune them by yourself if we lost the communication with contributors.
- cut the release branch
- draft the Release Notes for the minor version
- release the alpha, beta, minor versions
- keeping enriching release-related documents

### Becoming Release Manager?

Chaos Mesh committers and maintainers would nominate new release managers at about the 1st week of the new release cycle, the nomination should be published in slack channel #chaos-mesh-maintainers. And they would be selected if there are no more than half the number of oppositions. At last, we would announce the release managers on the document website and slack channel [#project-chaos-mesh](https://cloud-native.slack.com/archives/C0193VAV272).

## Versioning Scheme and Timeline

- Chaos Mesh would release a minor version `vX.Y.0` every 8 weeks.
- Chaos Mesh would release a preview version(`vX.Y.0.alpha/beta-W`, W>=0) every at least 2 weeks.
- Chaos Mesh would release a bugfix/patch (`vX.Y.Z`, Z>0) version as required.

## Release Phases

There would be 3 phases in a cycle of release:

- Normal Dev (Week 1-5)
- Code Freeze (Week 6-7)
- Release Week (Week 8)

### Normal Dev

Things happened during “Normal Dev”:

- selecting new Release Managers
- collecting “new features/enhancements” would be carried with the next release
- create the `vX.Y.0` milestone if not existed
- coding and documenting
- releasing alpha versions every 2 weeks

### Code Freeze

Things happened during “Code Freeze”:

- blocking the merging of all unrelated PRs
- reviewing “new features/enhancements” would be carried with the next release
  - finish or prune the unfinished features
  - the documents are ready, at least have a related open issue on chaos-mesh/website
- cutting branch `release-X.Y`
- releasing beta versions
- preparing the Release Notes
- create the `vX.Y+1.0` milestone
- merging bugfix if required
- documenting about the new release

Phase “Code Freeze” would start at Week 6, and finish at branch `release-X.Y` created.

When we are in “Code Freeze”, PRs which are not related to the coming minor release would be prevented from merging into master. Only PRs related to the coming release could be merged into the master branch.

Release Managers would communicate with contributors to ask them for finishing or pruning the unfinished features. Sometimes Release Managers would prune them by themselves if we lost the communication with the contributors.

Once all the unfinished features are completed or marked as “need prune”, the release manager would cut the `release-X.Y` branch. The merging process for all PRs back to normal.

Once uncompleted features are pruned, Release Manager would release the first beta version. After that, only bug fixes would be cherry-picked into the release branch. Release Manager could release more beta versions if we have updates on the release branch.

Release Manager should start to prepare Release Notes after the beta version is released.

### Release Week

Things happened during “Release Week”:

- merging emergency bugfix or vulnerabilities fix if required
- releasing the minor version artifacts (helm charts, container images, and others)
- releasing the minor version documentation

Release Manager would release the `vX.Y.0` in this week.
