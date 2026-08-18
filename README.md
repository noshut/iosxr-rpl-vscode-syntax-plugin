# IOS XR RPL for VS Code

Cisco IOS XR Routing Policy Language (`.rpl`): syntax highlighting, context-aware
autocomplete, snippets.

## Features

- **Highlighting**: control flow, conditions, actions, sets, `ios-regex '...'`,
  `$params`, communities, prefixes, `#` comments
- **Autocomplete** (context-aware, triggers on space / `$` / Ctrl+Space):
  - after `if` / `and` / `or` / `not` → match conditions (incl. EVPN, MVPN/mLDP,
    flowspec, `track`, `globalVar1-5`, `destination is-*`/`longer-than`/`or-longer`)
  - after `set` → settable attributes with syntax hints (incl. SR/SRv6, path-selection,
    core-tree, EVPN, rpf-topology, …)
  - enums in place: `origin is` → `igp|egp|incomplete`, `route-type is`,
    `validation-state is`, comparators after `med`/`local-preference`/`tag`,
    `set path-selection backup 1` → `install|advertise|multipath-protect`,
    `delete extcommunity` subtypes, `add`/`var` targets, …
  - after `in` / `matches-any` / `longer-than` / `apply` / `set community` →
    set & policy names defined in the file
  - `$parameters` collected from the file
- **Snippets**: `route-policy`, `if`, `ifelse`, all set types (`prefix-set`,
  `community-set`, `large-community-set`, `as-path-set`, `extcommunity-set`,
  `rd-set`, `tag-set`, `esi-set`, `etag-set`, `mac-set`, `ospf-area-set`),
  `policy-global`, `path-selection-backup`
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

Syntax source: verified against a live IOS XR 24.3.1 device (`?` completion in
`(config-rpl)` mode), plus Cisco IOS XR *Routing Configuration Guide —
Implementing Routing Policy* and *Routing Command Reference — RPL Commands*.
