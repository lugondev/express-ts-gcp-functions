# Firebase Functions TypeScript starter

>Create & test Firebase Cloud Functions in TypeScript

This starter allows you to create & test **Firebase Cloud Functions** in _TypeScript_.

Get the [Changelog](https://github.com/robisim74/firebase-functions-typescript-starter/blob/master/CHANGELOG.md).

## Contents
* [1 Project structure](#1)
* [2 Customizing](#2)
* [3 Building](#4)
* [4 Publishing](#5)

## <a name="1"></a>1 Project structure
- **functions**:
    - **src** folder for the Functions
        - **index.ts** entry point for all your Firebase Functions
    - **package.json** _npm_ options
    - **rollup.config.js** _Rollup_ configuration for building the ES bundle
    - **tsconfig.json** _TypeScript_ compiler options
    - **.eslintrc.json** _ESLint_ configuration
- **.firebaserc**: Firebase projects

## <a name="2"></a>2 Customizing
1. Update [Firebase CLI](https://github.com/firebase/firebase-tools).

2. Update `.firebaserc` with your `project-id`.

3. Add your Firebase Functions to `index.ts` and create different files for each one.

4. Update in `rollup.config.js` file external dependencies with those that actually you use to build the ES bundle.

5. Create unit tests in `tests` folder.

## <a name="4"></a>3 Building
#### Development
Start _tsc_ compiler with _watch_ option:
```Shell
npm run build:dev
```

Start the emulator _firebase emulators:start --only functions_
```Shell
npm run serve:dev
```

For the other supported emulators, please refer to the official documentation: [
Run Functions Locally](https://firebase.google.com/docs/functions/local-emulator)

#### Production
The following command:
```Shell
npm run build
```
creates `lib` folder with the file of distribution:
```
└── functions
    └──lib
        └── index.js
```

## <a name="5"></a>4 Publishing
```Shell
npm run deploy
```

## License
MIT
