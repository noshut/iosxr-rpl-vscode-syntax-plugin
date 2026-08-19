// node test.js — fails loudly if grammar/snippets JSON break or completion routing regresses.
// Expected values verified against a live IOS XR device (vPE1, CML) via `?` in (config-rpl).
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { complete, blockContext, CONDITIONS, SET_ATTRS, STATEMENTS, TOPLEVEL } = require('./keywords');

for (const f of ['syntaxes/rpl.tmLanguage.json', 'snippets/rpl.json', 'package.json', 'language-configuration.json']) {
  JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
}

assert(CONDITIONS.length > 60 && SET_ATTRS.length > 55 && STATEMENTS.length > 18 && TOPLEVEL.length > 15);

const labels = (prefix) => complete(prefix).map((i) => i.label);

// statement / toplevel routing
assert(labels('').includes('route-policy'), 'statement start offers route-policy');
assert(labels('').includes('var'), 'statement start offers var');
assert(labels('').includes('esi-set'), 'toplevel offers esi-set');
assert(labels('').includes('ospf-area-set'), 'toplevel offers ospf-area-set');

// conditions
assert(labels('  if ').includes('destination in'), 'if offers conditions');
assert(labels('  if ').includes('mldp opaque'), 'if offers mldp conditions');
assert(labels('  if ').includes('i-pmsi-present'), 'if offers i-pmsi-present');
assert(labels('  if destination in PFX and ').includes('community matches-any'), 'and offers conditions');
assert(labels('  if destination ').join() === 'in,is-all,is-backup-path,is-best-external,is-best-path,is-multi-path,is-multipath-protect,longer-than,or-longer', 'destination operators (device-verified)');
assert(labels('  if community ').join() === 'in,is-empty,length,matches-any,matches-every,matches-within', 'community operators');
assert(labels('  if community length ').join() === 'eq,ge,le,is', 'community length comparators');
assert(labels('  if large-community ').includes('length'), 'large-community length');
assert(labels('  if extcommunity ').join() === 'color,length,rt,seg-nh,soo', 'extcommunity subtypes (if-context)');
assert(labels('  if extcommunity rt ').includes('in'), 'extcommunity rt in');
assert(labels('  if extcommunity soo ').join() === 'matches-any,matches-every,matches-within,is-empty', 'extcommunity soo ops (no in)');
assert(labels('  if med ').join() === 'eq,ge,le,is', 'med comparators');
assert(labels('  if tag ').join() === 'eq,ge,in,is,le', 'tag comparators incl. in');
assert(labels('  if globalVar3 ').join() === 'eq,ge,le,is', 'globalVar comparators');
assert(labels('  if as-path ').includes('passes-through'), 'as-path operators');
assert(labels('  if protocol ').join() === 'is,in', 'protocol operators');
assert(labels('  if protocol is ').includes('ospfv3'), 'protocol enum incl. ospfv3');
assert(labels('  if origin is ').join() === 'igp,egp,incomplete', 'origin is enum');
assert(labels('  if validation-state is ').includes('not-found'), 'RPKI states');
assert(labels('  if route-type is ').includes('ospf-external-type-2'), 'route-type enum');
assert(labels('  if route-type is ').includes('interarea'), 'route-type interarea');
assert(labels('  if evpn-route-type is ').includes('5'), 'evpn-route-type 1-8');
assert(labels('  if mldp ').join() === 'flex-algo,opaque,root', 'mldp operators');
assert(labels('  if mldp opaque ').includes('vpnv4'), 'mldp opaque types');
assert(labels('  if ospf-area ').join() === 'all-paths,in,is', 'ospf-area operators');
assert(labels('  if rib-has-route ').join() === 'async,in', 'rib-has-route operators');
assert(labels('  if track FOO ').join() === 'is', 'track is');
assert(labels('  if track FOO is ').join() === 'up,down', 'track states');

// set attributes
assert(labels('  set ').includes('local-preference'), 'set offers attributes');
assert(labels('  set ').includes('sr-policy-color'), 'set offers sr-policy-color');
assert(labels('  set ').includes('maximum-paths'), 'set offers maximum-paths');
assert(labels('  set ').includes('fallback-vrf-lookup'), 'set offers fallback-vrf-lookup');
assert(labels('  set origin ').join() === 'igp,egp,incomplete', 'set origin enum');
assert(labels('  set next-hop ').join() === 'self,peer-address,discard,ipv6-global,ipv6-linklocal,unchanged', 'next-hop enum (device-verified)');
assert(labels('  set label ').join() === 'explicit-null,implicit-null', 'set label nulls');
assert(labels('  set metric-type ').includes('rib-metric-as-internal'), 'metric-type rib-metric-as-*');
assert(labels('  set med ').join() === 'igp-cost,max-reachable', 'set med enum, no comparators');
assert(labels('  set tag ').length === 0, 'set tag: numeric, no comparators');
assert(labels('  set core-tree ').includes('mldp-partitioned-p2mp'), 'core-tree types');
assert(labels('  set downstream-core-tree ').join() === 'ingress-replication,mldp,p2mp-te,sr-p2mp', 'downstream-core-tree types');
assert(labels('  set extcommunity ').join() === 'bandwidth,color,cost,evpn-link-bandwidth,redirect-to-rt,rt,seg-nh,soo', 'set extcommunity subtypes (device-verified)');
assert(labels('  set community FOO ').join() === 'additive', 'additive after named set');
assert(labels('  set community (65000:100) ').join() === 'additive', 'additive after inline set');
assert(labels('  set community ').length === 0, 'set community: names come from NAME_CTX, no keyword enum');
assert(labels('  set rpf-topology ').join() === 'ipv4,ipv6,vrf', 'rpf-topology afi');
assert(labels('  set rpf-topology ipv4 ').join() === 'multicast,unicast', 'rpf-topology safi');
assert(labels('  set srv6 ').join() === 'sid-format', 'srv6 sid-format');
assert(labels('  set srv6-alloc-mode ').join() === 'per-ce,per-vrf', 'srv6-alloc-mode');
assert(labels('  set dampening ').includes('halflife'), 'dampening params');

// path-selection (device-verified: all|backup 1|best-path|group-best|multipath)
assert(labels('  set path-selection ').join() === 'all,backup,best-path,group-best,multipath', 'path-selection modes');
assert(labels('  set path-selection backup ').join() === '1', 'backup path number');
assert(labels('  set path-selection backup 1 ').join() === 'install,advertise,multipath-protect', 'backup options');
assert(labels('  set path-selection backup 1 install ').includes('advertise'), 'backup install advertise');
assert(labels('  set path-selection multipath advertise ').join() === 'multipath-protect', 'multipath advertise protect');
assert(labels('  set path-selection group-best ').join() === 'advertise', 'group-best advertise');

// statements
assert(labels('  add ').join() === 'eigrp-metric,rip-metric', 'add targets');
assert(labels('  var ').join() === 'globalVar1,globalVar2,globalVar3,globalVar4,globalVar5', 'var targets');
assert(labels('  delete ').join() === 'community,extcommunity,large-community,prefix-sid', 'delete targets');
assert(labels('  delete extcommunity ').join() === 'bandwidth,color,evpn-link-bandwidth,rt,seg-nh,soo', 'delete extcommunity subtypes');
assert(labels('  delete extcommunity rt ').join() === 'in,not in,all', 'delete extcommunity rt ops');
assert(labels('  delete community ').join() === 'in,not in,all', 'delete community ops');
assert(labels('  prepend ').join() === 'as-path', 'prepend as-path');
assert(labels('  prepend as-path ').join() === 'most-recent,own-as', 'prepend as-path values');
assert(labels('  replace as-path ').join() === 'all,private-as', 'replace as-path values');
assert(labels('  replace as-path all ').join() === 'auto,none', 'replace as-path all values');
assert(complete('if destination in FOO then pass').length === 0, 'mid-statement: nothing');

// block context detection
assert.equal(blockContext('route-policy FOO\n'), 'route-policy');
assert.equal(blockContext('route-policy FOO\nend-policy\n'), null);
assert.equal(blockContext('community-set CS\n'), 'community-set');
assert.equal(blockContext('extcommunity-set rt MY-RT\n'), 'extcommunity-set rt');
assert.equal(blockContext('prefix-set P\nend-set\ncommunity-set CS\n'), 'community-set');
assert.equal(blockContext('policy-global\n'), 'policy-global');
assert.equal(blockContext(''), null);

// block-scoped completion
const inBlock = (block, prefix) => complete(prefix, block).map((i) => i.label);
assert(inBlock('route-policy', '  ').includes('set'), 'route-policy body offers statements');
assert(!inBlock('route-policy', '  ').includes('prefix-set'), 'route-policy body hides toplevel');
assert(inBlock(null, '').includes('prefix-set'), 'toplevel offers set definitions');
assert(!inBlock(null, '').includes('drop'), 'toplevel hides statements');
assert(inBlock('community-set', '  ').includes('no-export'), 'community-set well-knowns');
assert(inBlock('community-set', '  ').includes('local-AS'), 'community-set local-AS');
assert(inBlock('community-set', '  ').includes('ios-regex'), 'community-set ios-regex');
assert(inBlock('as-path-set', '  ').includes('passes-through'), 'as-path-set elements');
assert(inBlock('as-path-set', '  length ').join() === 'eq,ge,le,is', 'as-path-set length comparators');
assert(inBlock('prefix-set', '  10.0.0.0/8 ').join() === 'ge,le,eq', 'prefix-set ge/le/eq');
assert(inBlock('prefix-set', '  2001:db8::/32 ').join() === 'ge,le,eq', 'prefix-set v6 ge/le/eq');
assert(inBlock('extcommunity-set rt', '  ').includes('dfa-regex'), 'extcommunity-set rt regex elems');
assert(inBlock('rd-set', '  ').length === 0, 'rd-set body: plain values');
assert(inBlock('community-set', '  if ').length === 0, 'no conditions inside set bodies');

console.log('ok');
