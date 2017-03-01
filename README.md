# WARNING

The current state of this is very limited, and this is very much in **alpha**. Consider the API in complete flux.

It is completely possible that master will be completely broken at any given time until we hit a stable 1.x.

# elm-firebase

**elm-firebase** is a set of bindings between Elm (>= ?) 0.18 and Firebase 3.x.

## Goals

 - Be as close to the javascript api as possible.
 - Follow the elm architecture.

## Getting started

First, you'll need to install [elm-github-install](https://github.com/gdotdesign/elm-github-install).

```
$ npm install elm-github-install -g
```

Then you can add elm-firebase to your elm-package.json like so:

```
{
  "dependencies": {
    "pairshaped/elm-firebase": "0.0.1 <= v < 1.0.0"
  },
  "dependency-sources": {
    "pairshaped/elm-firebase": {
      "url": "https://github.com/pairshaped/elm-firebase.git",
      "ref": "master"
    }
  }
}
```

Now you're ready to install!

```
$ elm-github-install
```

## Example

Check out the [kitchen sink](./examples/kitchenSink/src/Main.elm) or [writer](./examples/writer/src/Main.elm) examples for information.

# Alternatives

 - [elmfire](https://github.com/ThomasWeiser/elmfire)
