> Share terminal sessions as razor-sharp animated SVG everywhere

<p align="center">
  <img width="600" src="https://cdn.rawgit.com/marionebl/svg-term-cli/1250f9c1/examples/parrot.svg">
</p>

> Example generated with `svg-term --cast 113643 --out examples/parrot.svg --window --no-cursor --from=4500`

# svg-term-cli

* 💄 Render asciicast to animated SVG
* 🌐 Share asciicasts everywhere (sans JS)
* 🤖 Style with common [color profiles](https://github.com/marionebl/term-schemes#supported-formats)

> Maintenance note: This CLI is a maintained fork of [marionebl/svg-term-cli](https://github.com/marionebl/svg-term-cli). The underlying renderer uses a maintained fork of `svg-term`: [okhsunrog/svg-term](https://github.com/okhsunrog/svg-term).

## Install

1. Install asciinema via: https://asciinema.org/docs/installation
2. Install svg-term-cli:
      ```sh
      npm install -g svg-term-cli
      # or using Bun
      bunx --yes npm@latest i -g svg-term-cli
      ```

### Requirements

- Node.js >= 18 (ESM)
- For local development/build: Bun >= 1.0

## Usage

Generate the `parrot.svg` example from asciicast at <https://asciinema.org/a/113643>

```
svg-term --cast=113643 --out examples/parrot.svg --window
```

### Optimization

SVG output is optimized by default using SVGO. You can control optimization and size with the following flags:

- `--no-optimize`: disable SVGO optimization (default is optimized)
- `--window`: include window chrome; omit for smaller output
- `--padding`, `--padding-x`, `--padding-y`: reduce padding to shrink the canvas, e.g. `--padding 0`
- `--at <ms>`: render a single frame (static preview) instead of the full animation
- `--from <ms>` / `--to <ms>`: trim the animation to a time range

Examples:

```sh
# Optimized animated SVG (default optimization)
svg-term --in rec.cast --out examples/archinstall-zfs.svg --window

# Unoptimized output (bigger)
svg-term --in rec.cast --out examples/unoptimized.svg --window --no-optimize

# Smallest static preview: no window, no padding, single frame
svg-term --in rec.cast --out examples/preview.svg --at 4500 --padding 0
```

## Development

This repo uses Bun for tooling.

```sh
# install deps
bun install

# type-check + build to lib/
bun run build

# run tests
bun test
```

## Interface

```
λ svg-term --help

  Share terminal sessions as razor-sharp animated SVG everywhere

  Usage
    $ svg-term [options]

  Options
    --at            timestamp of frame to render in ms [number]
    --cast          asciinema cast id to download [string], required if no stdin provided [string]
    --command       command to record [string]
    --from          lower range of timeline to render in ms [number]
    --height        height in lines [number]
    --help          print this help [boolean]
    --in            json file to use as input [string]
    --no-cursor     disable cursor rendering [boolean]
    --no-optimize   disable svgo optimization [boolean]
    --out           output file, emits to stdout if omitted, [string]
    --padding       distance between text and image bounds, [number]
    --padding-x     distance between text and image bounds on x axis [number]
    --padding-y     distance between text and image bounds on y axis [number]
    --profile       terminal profile file to use, requires --term [string]
    --term          terminal profile format [iterm2, xrdb, xresources, terminator, konsole, terminal, remmina, termite, tilda, xcfe], requires --profile [string]
    --to            upper range of timeline to render in ms [number]
    --width         width in columns [number]
    --window        render with window decorations [boolean]

  Examples
    $ cat rec.json | svg-term
    $ svg-term --cast 113643
    $ svg-term --cast 113643 --out examples/parrot.svg
```

## Rationale

Replace GIF asciicast recordings where you can not use the [asciinema player](https://asciinema.org/), e.g. `README.md` files on GitHub and the npm registry.

The image at the top of this README is an example. See how sharp the text looks, even when you zoom in? That’s because it’s an SVG!

## Related

* [asciinema/asciinema](https://github.com/asciinema/asciinema) - Terminal session recorder
* [derhuerst/asciicast-to-svg](https://github.com/derhuerst/asciicast-to-svg) - Render frames of Asciicasts as SVGs
* [marionebl/svg-term](https://github.com/marionebl/svg-term) - Render asciicast to animated SVG
* [marionebl/term-schemes](https://github.com/marionebl/term-schemes) - Parse and normalize common terminal emulator color schemes

## Differences from upstream

Compared to the original projects:

- Upstream CLI: [marionebl/svg-term-cli](https://github.com/marionebl/svg-term-cli)
- Upstream renderer: [marionebl/svg-term](https://github.com/marionebl/svg-term)
- Maintained renderer fork used here: [okhsunrog/svg-term](https://github.com/okhsunrog/svg-term)

Changes in this CLI:
- Migrated to Bun for tooling (install/build/test) and TypeScript 5
- Switched to ESM (NodeNext) and modern tsconfig
- Replaced Jest + ts-jest with Bun’s test runner
- Updated dependencies: `meow@^13`, `chalk@^5`, `execa@^9`, `svgo@^4`, `plist@^3`, `get-stdin@^9`, `tempy@^3`
- Removed legacy/unused deps and old type packages
- CLI help/flags updated; optimization flags documented; example SVGs refreshed

Changes in the renderer fork (okhsunrog/svg-term):
- Migrated to ESM and Bun tooling; added `types` entry
- Updated React to 19 and Emotion to 11 (`@emotion/react`, `@emotion/styled`)
- Fixed React key warnings in frame word rendering
- Kept public `render(input, options)` API compatible with upstream

These updates modernize the stack while preserving the core behavior and interface of the original tools.

## Gallery

* [marionebl/commitlint](https://github.com/marionebl/commitlint)
* [marionebl/share-cli](https://github.com/marionebl/share-cli)
* [marionebl/remote-share-cli](https://github.com/marionebl/remote-share-cli)

## License

Copyright 2025. Released under the MIT license.
