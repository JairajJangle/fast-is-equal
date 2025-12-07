# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project.

## Development Workflow

This project is a lightweight TypeScript library with zero runtime dependencies. It uses **Yarn 1.22.22** for package management.

To get started with the project, follow these steps:

1. **Ensure Node.js is installed**: Use Node.js 22 or higher (as specified in `.nvmrc`). Install via [nvm](https://github.com/nvm-sh/nvm) if needed:

   ```sh
   nvm install 22
   nvm use 22
   ```

2. **Install dependencies**: Install dependencies using Yarn:

   ```sh
   yarn install
   ```

> **Important**: This project uses Yarn 1.22.22. While npm may work for basic operations, we recommend using Yarn for consistency with the project setup.

### Making Changes

The library source code is located in the `src/` directory. The main implementation is in `src/index.ts`.

Any changes you make to the TypeScript source code will need to be built before they can be tested:

```sh
yarn build
```

Make sure your code passes TypeScript type checking and tests. Run the following to verify:

```sh
yarn typecheck
yarn test
```

### Running Benchmarks

This project includes comprehensive benchmarks comparing performance against Lodash's `isEqual`. To run benchmarks locally:

```sh
yarn benchmark
```

Benchmark results are saved to `benchmarks/results.txt`. If you're making performance-related changes, please include updated benchmark results in your pull request.

### Commit Message Convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix incorrect comparison for typed arrays
- `feat`: new features, e.g. add support for new data type
- `refactor`: code refactor, e.g. optimize circular reference detection
- `docs`: changes into documentation, e.g. update README with new examples
- `test`: adding or updating tests, e.g. add test cases for edge cases
- `chore`: tooling changes, e.g. update CI config
- `perf`: performance improvements, e.g. optimize Map comparison

Our pre-commit hooks (via Lefthook) verify that your commit message matches this format when committing.

### Linting and Tests

We use [TypeScript](https://www.typescriptlang.org/) for type checking and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks verify that the type checker and tests pass when committing.

### Publishing to npm

We use [semantic-release](https://github.com/semantic-release/semantic-release) for automated releases. Releases are automatically published to npm when changes are merged to the main branch, based on the conventional commit messages.

Manual releases can be triggered using the GitHub Actions workflow.

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn typecheck`: Type-check files with TypeScript (note: this script needs to be added)
- `yarn test`: Run unit tests with Jest
- `yarn build`: Build the TypeScript source to JavaScript in the `dist/` directory
- `yarn benchmark`: Run performance benchmarks against Lodash's `isEqual`

### Project Structure

```
fast-is-equal/
├── src/                  # TypeScript source code
│   └── index.ts         # Main implementation
├── benchmarks/          # Performance benchmarks
├── dist/                # Built JavaScript output (generated)
├── coverage/            # Test coverage reports (generated)
├── .github/             # GitHub Actions workflows and assets
├── jest.config.js       # Jest configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Package metadata and scripts
```

### Sending a Pull Request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change
- Verify that tests are passing
- Add tests for your changes when applicable
- If making performance improvements, include benchmark results
- Review the documentation to make sure it looks good
- Follow the pull request template when opening a pull request (if available)
- For pull requests that change the API or implementation significantly, discuss with maintainers first by opening an issue

### Performance Considerations

This library is optimized for speed. When contributing:

- **Benchmark your changes**: Run `yarn benchmark` before and after your changes
- **Avoid unnecessary allocations**: Minimize object/array creation in hot paths
- **Consider edge cases**: Ensure optimizations don't break correctness
- **Profile if needed**: For significant changes, consider profiling with Node.js inspector

### Testing Guidelines

- Add test cases for new features or bug fixes
- Include edge cases in your tests
- Ensure tests are deterministic and don't rely on timing
- Test coverage should remain high (aim for >95%)

### Getting Help

- 💬 Open an issue for bugs or feature requests
- 📖 Check existing issues and pull requests before creating new ones
- 🤝 Be respectful and constructive in all interactions

---

Thank you for contributing to fast-is-equal! 🚀
