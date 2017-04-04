

# Chatter, using Semantic-UI
---

## WARNING: Pre-Alpha state, bugs and missing functionality everywhere!

This is the Semantic UI package for the chatter-core package. This is a **bring-your-own-css** package, meaning you need to bring a flavor of Semantic UI with you, like the semantic:ui-css package.

Chatter has the ambition of becoming an easy to set up in-app chat package that requires minimal configuration to run, yet can be heavily customized to fit your needs should you wish. The current state of in-app chat felt lacking, hence this project was born. I will be using this in my own production apps, so it will not be going away in the near future.

This logic needs to be moved to the Accounts.onCreateUser() call of your meteor application:

## Usage

### Add the package

By adding it to your packagesfile or running the following command:

```
meteor add hubroedu:chatter-semantic
```

### Read the docs for the hubroedu:chatter-core package

A number of things need to be configured to be able to use the package with your meteor app.

### Tests

In order to run the test packages simpy run the following command in the root of your meteor app

```
meteor test-packages ./packages/chattercore --port 3100 --driver-package practicalmeteor:mocha
```
