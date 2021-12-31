## @nkp/smart-promise

![npm version](https://badge.fury.io/js/%40nkp%2Fsmart-promise.svg)
[![Node.js Package](https://github.com/NickKelly1/smart-promise/actions/workflows/release.yml/badge.svg)](https://github.com/NickKelly1/nkp-smart-promise/actions/workflows/release.yml)
![Known Vulnerabilities](https://snyk.io/test/github/NickKelly1/nkp-smart-promise/badge.svg)

SmartPromise is a Promise that can be resolved from outside it's executor.

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
  - [Exports](#exports)

## Installation

### NPM

```sh
npm install @nkp/smart-promise
```

### Yarn

```sh
yarn add @nkp/smart-promise
```

### Exports

`@nkp/smart-promise` targets CommonJS and ES modules. To utilise ES modules consider using a bundler like `webpack` or `rollup`.

## Publishing

To a release a new version:

1. Update the version number in package.json
2. Push the new version to the `master` branch on GitHub
3. Create a `new release` on GitHub for the latest version

This will trigger a GitHub action that tests and publishes the npm package.
