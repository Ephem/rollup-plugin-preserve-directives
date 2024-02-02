# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2024-02-02

- Support include and exclude options (#21).

## [0.3.1] - 2024-01-19

### Fixed

- Ignore .css-files when parsing (#20)

## [0.3.0] - 2024-01-14

### Added

- Support for Rollup v4 (#19).
- Named `preserveDirectives` export in addition to the default one (#19).

### Fixed

- Updated build output for correct ESM/CJS typing (#19).
- Renamed option `supressPreserveModulesWarning` to `suppressPreserveModulesWarning` to fix typo (#12).

## [0.2.0] - 2023-05-28

### Added

- Generate both CJS and ESM formats (#10).

## [0.1.1] - 2023-05-13

### Fixed

- Added null-safety to "type" check (#6).
- Moved magic-string from devDependencies to dependencies (#7).

## [0.1.0] - 2023-03-12

### Added

- Initial working release
