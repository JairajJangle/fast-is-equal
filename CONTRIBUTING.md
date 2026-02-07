# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development Workflow

To start contributing to `fast-is-equal`, follow these steps:

1. **Ensure Node.js is installed**: Use Node.js 22.12.0 or higher (as specified in `.nvmrc`). Install via [nvm](https://github.com/nvm-sh/nvm) if needed:

   ```sh
   nvm install 22.12.0
   nvm use 22.12.0
   ```

2. **Enable Corepack**: Yarn 4.9.2 is managed via Corepack, included with Node.js. Enable it to ensure the correct Yarn version:

   ```sh
   corepack enable
   corepack prepare yarn@4.9.2 --activate
   ```

3. Set up Yarn configuration: In the root directory, configure Yarn 4.9.2:

   ```sh
   yarn set version 4.9.2
   yarn config set nodeLinker node-modules
   ```

4. **Install dependencies**:

   ```sh
   yarn
   ```

Make sure your code passes TypeScript checks and tests. Run the following to verify:

```sh
yarn build
```

Remember to add tests for your change if possible. Run the unit tests by:

```sh
yarn test
```

We use [Lefthook](https://github.com/evilmartians/lefthook) to manage pre-commit hooks. When you commit, it will automatically run:
- **Unit tests** (`yarn test`)
- **Type checking** (`npx tsc --noEmit`)
- **Commit linting** (`npx commitlint`)

To run benchmarks and verify performance:

```sh
yarn benchmark
```

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix circular reference detection.
- `feat`: new features, e.g. add support for new data types.
- `refactor`: code refactor, e.g. optimize internal comparison loop.
- `docs`: changes into documentation, e.g. add usage example for a specific edge case.
- `test`: adding or updating tests, e.g. add unit tests for Map/Set comparison.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks (via [commitlint](https://commitlint.js.org/)) verify that your commit message matches this format.

### Publishing to npm

Releases are automatically managed via [semantic-release](https://github.com/semantic-release/semantic-release) in GitHub Actions whenever changes are merged into the `main` branch. It handles:
- Version bumping based on commit messages.
- Generating changelogs.
- Publishing to npm.
- Creating GitHub releases and tags.

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn build`: Compile the TypeScript source code to JavaScript (and verify types).
- `yarn test`: Run unit tests with Jest.
- `yarn benchmark`: Run performance benchmarks.

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that tests are passing locally.
- Review the documentation to make sure it looks good.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.

