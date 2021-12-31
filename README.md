# @nkp/smart-promise

[![npm version](https://badge.fury.io/js/%40nkp%2Fsmart-promise.svg)](https://www.npmjs.com/package/@nkp/smart-promise)
[![deploy status](https://github.com/NickKelly1/nkp-smart-promise/actions/workflows/release.yml/badge.svg)](https://github.com/NickKelly1/nkp-smart-promise/actions/workflows/release.yml)
[![known vulnerabilities](https://snyk.io/test/github/NickKelly1/nkp-smart-promise/badge.svg)](https://snyk.io/test/github/NickKelly1/nkp-smart-promise)

Zero dependency SmartPromise utility. SmartPromise is is a Promise that can be resolved from outside it's executor.

```ts
import { SmartPromise } from '@nkp/smart-promise';

const promise = new SmartPromsie<string>();
promise.then((value) => console.log('resolved with:', value));
promise.resolve('success :)');
// resolved with: success :)
```

## Table of contents

- [Installation](#installation)
  - [npm](#npm)
  - [yarn](#yarn)
  - [pnpm](#pnpm)
  - [Exports](#exports)
- [Updating Dependencies](#updating-dependencies)
- [Publishing](#publishing)

## Installation

### npm

```sh
npm install @nkp/smart-promise
```

### yarn

```sh
yarn add @nkp/smart-promise
```

### pnpm

```sh
pnpm add @nkp/range
```

### Exports

`@nkp/smart-promise` targets CommonJS and ES modules. To utilise ES modules consider using a bundler like `webpack` or `rollup`.

## Updating dependencies

To update dependencies run one of

```sh
# if npm
# update package.json
npx npm-check-updates -u
# install
npm install

# if yarn
# update package.json
yarn create npm-check-updates -u
# install
yarn

# if pnpm
# update package.json
pnpx npm-check-updates -u
# install
pnpm install
```

## Publishing

To a release a new version:

1. Update the version number in package.json
2. Push the new version to the `master` branch on GitHub
3. Create a `new release` on GitHub for the latest version

This will trigger a GitHub action that tests and publishes the npm package.
