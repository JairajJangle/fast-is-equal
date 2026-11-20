## [1.4.0](https://github.com/JairajJangle/fast-is-equal/compare/v1.3.3...v1.4.0) (2026-11-20)

### Bug Fixes

* compare boxed primitives, errors, subclasses and nested functions ([2948b5e](https://github.com/JairajJangle/fast-is-equal/commit/2948b5e3d77533970e033477aa6536ce22dce172)), closes [#37](https://github.com/JairajJangle/fast-is-equal/issues/37)
* compare invalid dates and NaN typed array elements by value ([308878b](https://github.com/JairajJangle/fast-is-equal/commit/308878ba3f37d5d2ba31900869210edd077de4b4))
* ignore non-enumerable symbol keys ([8328d2e](https://github.com/JairajJangle/fast-is-equal/commit/8328d2e47bf397299df78bd45b4f714a513675a5))
* track cycles with an in-progress stack so shared references compare equal ([913f656](https://github.com/JairajJangle/fast-is-equal/commit/913f656c44118eba5734880b22173a54e2bf0c9f))

### Performance Improvements

* reuse the last proven-equal pair for shared references ([2d91aec](https://github.com/JairajJangle/fast-is-equal/commit/2d91aeca9f2d956c7440735dc0ea65894dcf9c6a))

### Documentation

* **readme:** document equality semantics and refresh benchmarks ([6ac73b3](https://github.com/JairajJangle/fast-is-equal/commit/6ac73b3a80b2144c17442a538116cf3a9b5fd3f0))

### Miscellaneous Chores

* **benchmark:** add before/after harness and report ties against lodash ([ffc4bd2](https://github.com/JairajJangle/fast-is-equal/commit/ffc4bd2dca90b74ffdff727bccd8e7b10c51459d))
* **deps:** patch dependabot security alerts via lockfile refresh ([792ff74](https://github.com/JairajJangle/fast-is-equal/commit/792ff747dd82da95895348b0b365e4e56daf7076))
* **deps:** patch fast-uri, body-parser and launch-editor advisories ([70fe24b](https://github.com/JairajJangle/fast-is-equal/commit/70fe24bcaf9a258682f8b0e05cc6631d4bfc9db6))

### Continuous Integration

* **release:** list every commit type in release notes ([92d18e0](https://github.com/JairajJangle/fast-is-equal/commit/92d18e0dc6ebefeff786ad3889f62d96ddb3dd3c))

### Tests

* add randomized differential tests ([9dd9cc3](https://github.com/JairajJangle/fast-is-equal/commit/9dd9cc3c7d798e5fd8844c71ba4092585ebdc402))

## [1.3.3](https://github.com/JairajJangle/fast-is-equal/compare/v1.3.2...v1.3.3) (2026-09-06)


### Bug Fixes

* **deps:** bump fast-uri to 3.1.7 and regenerate lockfile ([4126104](https://github.com/JairajJangle/fast-is-equal/commit/41261046aafbd4dc7c8964ce0c1b5ff3eaaaa740))

## [1.3.2](https://github.com/JairajJangle/fast-is-equal/compare/v1.3.1...v1.3.2) (2026-08-18)


### Bug Fixes

* **deps:** resolve dependabot security alerts ([5c25135](https://github.com/JairajJangle/fast-is-equal/commit/5c2513501420228cf06d6cd2addd71a0f77f3f0f))

## [1.3.1](https://github.com/JairajJangle/fast-is-equal/compare/v1.3.0...v1.3.1) (2026-07-05)

# [1.3.0](https://github.com/JairajJangle/fast-is-equal/compare/v1.2.7...v1.3.0) (2026-07-05)


### Performance Improvements

* cut allocations and checks in hot paths ([15eaaa0](https://github.com/JairajJangle/fast-is-equal/commit/15eaaa01c11ec810f2b8dec05ac1ebf3997f5467))

## [1.2.7](https://github.com/JairajJangle/fast-is-equal/compare/v1.2.6...v1.2.7) (2026-04-04)


### Bug Fixes

* **deps:** housekeeping - upgraded dev deps ([1b1da51](https://github.com/JairajJangle/fast-is-equal/commit/1b1da51becac9848407065c5a23a93fec9eaa18f))

## [1.2.6](https://github.com/JairajJangle/fast-is-equal/compare/v1.2.5...v1.2.6) (2026-02-09)


### Bug Fixes

* **ci:** missing prepublish script resulting in no dist folder in published files [#8](https://github.com/JairajJangle/fast-is-equal/issues/8) ([a0a5b2c](https://github.com/JairajJangle/fast-is-equal/commit/a0a5b2c510ad0a7f98fcba79b1e37520d5a02926))

## [1.2.5](https://github.com/JairajJangle/fast-is-equal/compare/v1.2.4...v1.2.5) (2026-02-07)


### Bug Fixes

* maintenance - upgraded dev deps and migrated to yarn berry ([9dedf42](https://github.com/JairajJangle/fast-is-equal/commit/9dedf42da21e3277ace451a2431410db80f631ac))

## [1.2.4](https://github.com/JairajJangle/fast-is-equal/compare/v1.2.3...v1.2.4) (2025-12-07)


### Bug Fixes

* **merge:** apply maintenance updates (deps, tests, ci) and trigger patch release ([3d9898e](https://github.com/JairajJangle/fast-is-equal/commit/3d9898ec2c8808d27f506dd376720e992fa0895c))

## [1.2.3](https://github.com/JairajJangle/fast-is-equal/compare/v1.2.2...v1.2.3) (2025-05-31)


### Bug Fixes

* improve type checking and add support for Symbol, BigInt, and DataView ([4f66af2](https://github.com/JairajJangle/fast-is-equal/commit/4f66af2deb8a7e4f4ef70343003c647c8041aeaa))

## [1.2.2](https://github.com/JairajJangle/fast-is-equal/compare/v1.2.1...v1.2.2) (2025-05-29)


### Bug Fixes

* updated docs ([534d10e](https://github.com/JairajJangle/fast-is-equal/commit/534d10eb5e0b35ae4a368c05933375cbb0274630))

## [1.2.1](https://github.com/JairajJangle/fast-is-equal/compare/v1.2.0...v1.2.1) (2025-05-29)


### Bug Fixes

* **perf:** greatly optimized performance by implementing the below improvements ([41c391f](https://github.com/JairajJangle/fast-is-equal/commit/41c391f327a69c46967a3a3531c5f024d8b00189))
* **perf:** optimize fastIsEqual for better performance on equal objects and primitives ([c42094f](https://github.com/JairajJangle/fast-is-equal/commit/c42094f1c8df421841b7f82d02e870342270b387))

# [1.2.0](https://github.com/JairajJangle/fast-is-equal/compare/v1.1.0...v1.2.0) (2025-05-23)


### Features

* **trigger release:** force release ([13cea85](https://github.com/JairajJangle/fast-is-equal/commit/13cea8576ae3ae753ec93a443c3562a665e82b7b))

# [1.1.0](https://github.com/JairajJangle/fast-is-equal/compare/v1.0.4...v1.1.0) (2025-05-22)


### Features

* update benchmark results and improve performance ([a50d999](https://github.com/JairajJangle/fast-is-equal/commit/a50d999b5a092e5226afbb09dac5da9d0722ff1a))
* update benchmark results and improve performance ([7138dcb](https://github.com/JairajJangle/fast-is-equal/commit/7138dcb9c7640861dd83adcec01bd5d96d81e18e))

# 1.0.0 (2025-05-22)


### Bug Fixes

* docs: updated readme ([9342620](https://github.com/JairajJangle/fast-is-equal/commit/9342620e60a0e887081f5fa186893bd047ebd878))
