# API

## Prerequisite

- nodejs 16 >=
- Yarn (Installed globally)

## Getting started

### Install

```
git clone `https://github.com/coding-mountain/ecommerce.git`
cd ecommerce
yarn install
```

### Run


Build the project

```
 yarn build
```

Run the project for production

```
 yarn start
```

Run the project for development

```
 yarn dev
```

### Code Lint & Formating

We are using Eslint to find coding errors and Prettier for code formatting. Install `ESlint`, `Prettier` and `Editorconfig` extension on your editor.

Make sure to use prettier as default formatter when saving a file.

Open command palette and select Format Document With... -> Configure Default Formatter -> Prettier - Code Formatter

For linting
```
yarn lint
```


For formatting
```
yarn format
```

## Debugging in VS Code with Nodemon

In order to attach debugger when we run `yarn dev`, add following json inside `.vscode/launch.json`

```
{
    "type": "node",
    "request": "attach",
    "name": "Node: Nodemon",
    "processId": "${command:PickProcess}",
    "restart": true,
    "protocol": "inspector",
}
```

https://github.com/microsoft/vscode-recipes/tree/main/nodemon#debugging-the-node-process
