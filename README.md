# IOS XR RPL for VS Code

Cisco IOS XR Routing Policy Language (`.rpl`): syntax highlighting, context-aware
autocomplete, snippets.

## Features

- **Highlighting**: control flow, conditions, actions, sets, `ios-regex '...'`,
  `$params`, communities, prefixes, `#` comments
- **Autocomplete** (context-aware, triggers on space / `$` / Ctrl+Space):
  - after `if` / `and` / `or` / `not` → match conditions
  - after `set` → settable attributes with syntax hints
  - enums in place: `origin is` → `igp|egp|incomplete`, `route-type is`,
    `validation-state is`, comparators after `med`/`local-preference`/`tag`, …
  - after `in` / `matches-any` / `apply` → set & policy names defined in the file
  - `$parameters` collected from the file
- **Snippets**: `route-policy`, `if`, `ifelse`, `prefix-set`, `community-set`,
  `as-path-set`, `extcommunity-set`, `rd-set`, `policy-global`
- Auto-indent for `then`/`endif`/`end-policy`/`end-set` blocks

## Install (local)

```sh
ln -s ~/code/vscode-rpl ~/.vscode/extensions/lucas-weiselowski.rpl-0.1.0
```

Reload VS Code. Files ending in `.rpl` activate the extension.

## Test

```sh
node test.js
```

Syntax source: Cisco IOS XR *Routing Configuration Guide — Implementing Routing
Policy* and *Routing Command Reference — RPL Commands*.
