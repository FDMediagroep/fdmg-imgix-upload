# Contributing

How nice of you to swing by!
This must mean that you're serious about thinking to contribute to our little OSS project.
Let's get acquainted by allowing us to show you how we contribute to this project ourselves.
By following these tips and guidelines you'll find that you can contribute more easily.

## Release tagging

Tagging the repository on GitHub with a release will automatically start the GitHub Actions. It currently consists of 2 workflows:

- build
- release

After the build has completed the release will be run which does the actual packaging of the Component Library and publishes it to both NPMJS and GitHub Packages.

Versioning convention:

`v{major}.{minor}.{patch}[-canary.{patch}]`

Examples:

- v0.3.5
- v1.2.2
- v1.2.3
- v1.2.3-canary.1

Canary releases are pre-releases. So version `v1.2.3-canary.1` is considered as an older release than `v1.2.3`. Canary releases are useful if you want to test it in your own application without risking other users installing it by mistake.

With NPM a developer typically installs node modules like so:

`npm i @fdmg/imgix-upload`

or

`npm i @fdmg/imgix-upload@latest`

Let's say we haven't released `v1.2.3` yet then both these commands would automatically install `v1.2.2` and not `v1.2.3-canary.1`. Even though the latter has been packaged and released later than `v1.2.2`.

In order to install `v1.2.3-canary.1` the developer could use the following commands:

`npm i @fdmg/imgix-upload@v1.2.3-canary.1`

or

`npm i @fdmg/imgix-upload@next`
