// node test.js — fails loudly if grammar/snippets JSON break or completion routing regresses.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { complete, CONDITIONS, SET_ATTRS, STATEMENTS, TOPLEVEL } = require('./keywords');

for (const f of ['syntaxes/rpl.tmLanguage.json', 'snippets/rpl.json', 'package.json', 'language-configuration.json']) {
  JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
}

assert(CONDITIONS.length > 30 && SET_ATTRS.length > 30 && STATEMENTS.length > 15 && TOPLEVEL.length > 8);

const labels = (prefix) => complete(prefix).map((i) => i.label);

assert(labels('').includes('route-policy'), 'statement start offers route-policy');
assert(labels('  if ').includes('destination in'), 'if offers conditions');
assert(labels('  if destination in PFX and ').includes('community matches-any'), 'and offers conditions');
assert(labels('  set ').includes('local-preference'), 'set offers attributes');
assert(labels('  set origin ').join() === 'igp,egp,incomplete', 'set origin enum');
assert(labels('  if origin is ').join() === 'igp,egp,incomplete', 'origin is enum');
assert(labels('  set next-hop ').includes('peer-address'), 'next-hop enum');
assert(labels('  if med ').join() === 'eq,ge,le,is', 'med comparators');
assert(labels('  if as-path ').includes('passes-through'), 'as-path operators');
assert(labels('  if community ').includes('matches-any'), 'community operators');
assert(labels('  delete ').includes('extcommunity rt'), 'delete targets');
assert(labels('  prepend ').join() === 'as-path', 'prepend as-path');
assert(labels('  if validation-state is ').includes('not-found'), 'RPKI states');
assert(labels('  if route-type is ').includes('ospf-external-type-2'), 'route-type enum');
assert(complete('if destination in FOO then pass').length === 0, 'mid-statement: nothing');

console.log('ok');
