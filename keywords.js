// RPL keyword data + context routing. Pure Node, no vscode dependency (testable).
// Source: Cisco IOS XR Routing Configuration Guide "Implementing Routing Policy"
// + Routing Command Reference "RPL Commands".

// [label, detail, insertSnippet?]  — insertSnippet uses VS Code snippet syntax.
const CONDITIONS = [
  ['destination in', 'destination in <prefix-set | (inline) | $param>', 'destination in ${1:prefix-set}'],
  ['as-path in', 'as-path in <as-path-set | (ios-regex \'...\') | $param>', 'as-path in ${1:as-path-set}'],
  ['as-path is-local', 'true if path was originated locally'],
  ['as-path length', 'as-path length <eq|is|ge|le> <number>', 'as-path length ${1|eq,ge,le,is|} ${2:number}'],
  ['as-path unique-length', 'as-path unique-length <eq|is|ge|le> <number>', 'as-path unique-length ${1|eq,ge,le,is|} ${2:number}'],
  ['as-path neighbor-is', "as-path neighbor-is '<asn> [asn...]'", "as-path neighbor-is '${1:asn}'"],
  ['as-path originates-from', "as-path originates-from '<asn>'", "as-path originates-from '${1:asn}'"],
  ['as-path passes-through', "as-path passes-through '<asn>'", "as-path passes-through '${1:asn}'"],
  ['community matches-any', 'true if any community matches any set element', 'community matches-any ${1:community-set}'],
  ['community matches-every', 'true if every set element is matched', 'community matches-every ${1:community-set}'],
  ['community matches-within', 'true if every community matches the set', 'community matches-within ${1:community-set}'],
  ['community is-empty', 'true if route has no community attribute'],
  ['large-community matches-any', 'large-community matches-any <set | (inline)>', 'large-community matches-any ${1:set}'],
  ['large-community matches-every', 'large-community matches-every <set | (inline)>', 'large-community matches-every ${1:set}'],
  ['large-community matches-within', 'large-community matches-within <set | (inline)>', 'large-community matches-within ${1:set}'],
  ['large-community is-empty', 'true if route has no large-community attribute'],
  ['extcommunity rt matches-any', 'extcommunity rt matches-any <set | (inline)>', 'extcommunity rt matches-any ${1:set}'],
  ['extcommunity rt matches-every', 'extcommunity rt matches-every <set | (inline)>', 'extcommunity rt matches-every ${1:set}'],
  ['extcommunity rt matches-within', 'extcommunity rt matches-within <set | (inline)>', 'extcommunity rt matches-within ${1:set}'],
  ['extcommunity rt is-empty', 'true if route has no RT extended community'],
  ['extcommunity soo matches-any', 'extcommunity soo matches-any <set | (inline)>', 'extcommunity soo matches-any ${1:set}'],
  ['extcommunity soo matches-every', 'extcommunity soo matches-every <set | (inline)>', 'extcommunity soo matches-every ${1:set}'],
  ['local-preference', 'local-preference <eq|is|ge|le> <number>', 'local-preference ${1|eq,ge,le,is|} ${2:number}'],
  ['med', 'med <eq|is|ge|le> <number>', 'med ${1|eq,ge,le,is|} ${2:number}'],
  ['aigp-metric', 'aigp-metric <eq|is|ge|le> <number>', 'aigp-metric ${1|eq,ge,le,is|} ${2:number}'],
  ['next-hop in', 'next-hop in <prefix-set | (inline)>', 'next-hop in ${1:prefix-set}'],
  ['origin is', 'origin is <igp|egp|incomplete>', 'origin is ${1|igp,egp,incomplete|}'],
  ['orf prefix in', 'orf prefix in <prefix-set | (inline)>', 'orf prefix in ${1:prefix-set}'],
  ['path-type is', 'path-type is <ibgp|ebgp>', 'path-type is ${1|ibgp,ebgp|}'],
  ['protocol is', 'protocol is <bgp|ospf|isis|rip|eigrp|connected|static>', 'protocol is ${1|bgp,ospf,isis,rip,eigrp,connected,static|}'],
  ['protocol in', 'protocol in (proto, proto, ...)', 'protocol in (${1:bgp})'],
  ['rd in', 'rd in <rd-set | (inline)>', 'rd in ${1:rd-set}'],
  ['rib-has-route in', 'true if RIB has a route in the prefix set', 'rib-has-route in ${1:prefix-set}'],
  ['route-has-label', 'true if route carries one or more MPLS labels'],
  ['route-type is', 'route-type is <internal|external|local|interarea|ospf-external-type-1|...>', 'route-type is ${1|internal,external,local,interarea,level-1,level-2,ospf-external-type-1,ospf-external-type-2,ospf-inter-area,ospf-intra-area,ospf-nssa-type-1,ospf-nssa-type-2,type-1,type-2|}'],
  ['source in', 'source in <prefix-set | (inline)> — route source/originator', 'source in ${1:prefix-set}'],
  ['tag', 'tag <eq|is|ge|le> <number>', 'tag ${1|eq,ge,le,is|} ${2:number}'],
  ['tag in', 'tag in <tag-set | (inline)>', 'tag in ${1:tag-set}'],
  ['validation-state is', 'RPKI: validation-state is <valid|invalid|not-found>', 'validation-state is ${1|valid,invalid,not-found|}'],
  ['vpn-distinguisher is', 'vpn-distinguisher is <number>', 'vpn-distinguisher is ${1:number}'],
];

const SET_ATTRS = [
  ['administrative-distance', 'set administrative-distance <1-255>'],
  ['aigp-metric', 'set aigp-metric <number | igp-cost>'],
  ['community', 'set community <set | (inline)> [additive]', 'community ${1:community-set}${2: additive}'],
  ['core-tree', 'set core-tree <mLDP/P2MP-TE/... multicast core tree type>'],
  ['dampening', 'set dampening halflife <min> reuse <n> suppress <n> max-suppress <min>', 'dampening halflife ${1:15} reuse ${2:750} suppress ${3:2000} max-suppress ${4:60}'],
  ['eigrp-metric', 'set eigrp-metric <bw> <delay> <reliability> <loading> <mtu>'],
  ['extcommunity rt', 'set extcommunity rt <set | (inline)> [additive]', 'extcommunity rt ${1:set}${2: additive}'],
  ['extcommunity soo', 'set extcommunity soo <set | (inline)> [additive]', 'extcommunity soo ${1:set}${2: additive}'],
  ['extcommunity cost', 'set extcommunity cost <set | (inline)>'],
  ['extcommunity bandwidth', 'set extcommunity bandwidth <set | (asn:bps)>'],
  ['fallback-vrf', 'set fallback-vrf <vrf-name>'],
  ['flow-tag', 'set flow-tag <1-63>'],
  ['forward-class', 'set forward-class <1-7>'],
  ['ip-precedence', 'set ip-precedence <0-7>'],
  ['isis-metric', 'set isis-metric <number>'],
  ['label', 'set label <MPLS label>'],
  ['label-index', 'set label-index <segment-routing index>'],
  ['label-mode', 'set label-mode <per-ce|per-vrf|per-prefix>', 'label-mode ${1|per-ce,per-vrf,per-prefix|}'],
  ['large-community', 'set large-community <set | (inline)> [additive]', 'large-community ${1:set}${2: additive}'],
  ['level', 'set level <level-1|level-2|level-1-2>', 'level ${1|level-1,level-2,level-1-2|}'],
  ['local-preference', 'set local-preference <number>', 'local-preference ${1:100}'],
  ['med', 'set med <number | +n | -n | igp-cost | max-reachable>', 'med ${1:number}'],
  ['metric-type', 'set metric-type <type-1|type-2|internal|external|rib-metric-as-...>', 'metric-type ${1|type-1,type-2,internal,external|}'],
  ['next-hop', 'set next-hop <A.B.C.D | X:X::X | self | peer-address | discard> [destination-vrf]', 'next-hop ${1:address}'],
  ['origin', 'set origin <igp|egp|incomplete>', 'origin ${1|igp,egp,incomplete|}'],
  ['ospf-metric', 'set ospf-metric <number>'],
  ['path-selection', 'set path-selection <all|backup 1|best-path|group-best|multipath> [install] [advertise]'],
  ['qos-group', 'set qos-group <number>'],
  ['rib-metric', 'set rib-metric <number>'],
  ['rip-metric', 'set rip-metric <0-16>'],
  ['rip-tag', 'set rip-tag <number>'],
  ['spf-priority', 'set spf-priority <critical|high|medium>', 'spf-priority ${1|critical,high,medium|}'],
  ['tag', 'set tag <number>'],
  ['traffic-index', 'set traffic-index <1-63 | ignore>'],
  ['vpn-distinguisher', 'set vpn-distinguisher <number>'],
  ['weight', 'set weight <0-65535>'],
];

const STATEMENTS = [
  ['if', 'if <condition> then ... endif', 'if ${1:condition} then\n\t$0\nendif'],
  ['elseif', 'elseif <condition> then', 'elseif ${1:condition} then'],
  ['else', 'else branch'],
  ['endif', 'end of if block'],
  ['set', 'set <attribute> <value>'],
  ['apply', 'apply <route-policy> [(param, ...)] — hierarchical policy', 'apply ${1:policy-name}'],
  ['pass', 'accept route, continue evaluating'],
  ['drop', 'reject route, stop'],
  ['done', 'accept route, stop'],
  ['abort', 'discard all policy modifications, reject'],
  ['delete community', 'delete community <in|not in> <set | (inline) | all>', 'delete community in ${1:community-set}'],
  ['delete extcommunity rt', 'delete extcommunity rt <in|not in> <set | (inline)>', 'delete extcommunity rt in ${1:set}'],
  ['delete large-community', 'delete large-community <in|not in> <set | (inline)>', 'delete large-community in ${1:set}'],
  ['prepend as-path', 'prepend as-path <asn | most-recent | own-as> [count]', 'prepend as-path ${1:asn} ${2:count}'],
  ['replace as-path', "replace as-path <(asn, ...) | private-as [with own-as]>", 'replace as-path ${1:private-as}'],
  ['remove as-path private-as', 'strip private AS numbers from path'],
  ['suppress-route', 'suppress component route of an aggregate'],
  ['unsuppress-route', 'unsuppress previously suppressed route'],
  ['end-policy', 'end of route-policy definition'],
];

const TOPLEVEL = [
  ['route-policy', 'route-policy <name> [($param, ...)]', 'route-policy ${1:name}\n\t$0\nend-policy'],
  ['prefix-set', 'prefix-set <name>', 'prefix-set ${1:name}\n\t${2:10.0.0.0/8 le 24}\nend-set'],
  ['as-path-set', 'as-path-set <name>', "as-path-set ${1:name}\n\tios-regex '${2:_65000\\$}'\nend-set"],
  ['community-set', 'community-set <name>', 'community-set ${1:name}\n\t${2:65000:100}\nend-set'],
  ['large-community-set', 'large-community-set <name>', 'large-community-set ${1:name}\n\t${2:65000:1:100}\nend-set'],
  ['extcommunity-set rt', 'extcommunity-set rt <name>', 'extcommunity-set rt ${1:name}\n\t${2:65000:100}\nend-set'],
  ['extcommunity-set soo', 'extcommunity-set soo <name>', 'extcommunity-set soo ${1:name}\n\t${2:65000:100}\nend-set'],
  ['rd-set', 'rd-set <name>', 'rd-set ${1:name}\n\t${2:65000:*}\nend-set'],
  ['tag-set', 'tag-set <name>', 'tag-set ${1:name}\n\t${2:100}\nend-set'],
  ['policy-global', 'policy-global — systemwide $variables', "policy-global\n\t${1:name} '${2:value}'\nend-global"],
];

const ENUM_AFTER = [
  // [regex on line prefix, completions]
  [/\b(?:set\s+)?origin\s+(?:is\s+)?\w*$/, ['igp', 'egp', 'incomplete']],
  [/\bpath-type\s+is\s+\w*$/, ['ibgp', 'ebgp']],
  [/\bvalidation-state\s+is\s+\w*$/, ['valid', 'invalid', 'not-found']],
  [/\bprotocol\s+(?:is|in)\s+\(?\s*\w*$/, ['bgp', 'ospf', 'isis', 'rip', 'eigrp', 'connected', 'static', 'subscriber']],
  [/\bset\s+level\s+\w*$/, ['level-1', 'level-2', 'level-1-2']],
  [/\bset\s+metric-type\s+\w*$/, ['type-1', 'type-2', 'internal', 'external']],
  [/\bset\s+next-hop\s+\w*$/, ['self', 'peer-address', 'discard']],
  [/\bset\s+label-mode\s+\w*$/, ['per-ce', 'per-vrf', 'per-prefix']],
  [/\broute-type\s+is\s+[\w-]*$/, ['internal', 'external', 'local', 'interarea', 'level-1', 'level-2',
    'ospf-external-type-1', 'ospf-external-type-2', 'ospf-inter-area', 'ospf-intra-area',
    'ospf-nssa-type-1', 'ospf-nssa-type-2', 'type-1', 'type-2']],
  [/\b(?:med|local-preference|tag|aigp-metric|as-path\s+length|as-path\s+unique-length)\s+\w*$/, ['eq', 'ge', 'le', 'is']],
  [/\bas-path\s+[\w-]*$/, ['in', 'is-local', 'length', 'unique-length', 'neighbor-is', 'originates-from', 'passes-through']],
  [/\bcommunity\s+[\w-]*$/, ['matches-any', 'matches-every', 'matches-within', 'is-empty']],
  [/\bextcommunity\s+\w*$/, ['rt', 'soo']],
  [/\bextcommunity\s+(?:rt|soo)\s+[\w-]*$/, ['matches-any', 'matches-every', 'matches-within', 'is-empty']],
  [/\bdelete\s+[\w-]*$/, ['community', 'extcommunity rt', 'extcommunity soo', 'large-community']],
  [/\bdelete\s+(?:community|large-community|extcommunity\s+(?:rt|soo))\s+\w*$/, ['in', 'not in', 'all']],
  [/\b(?:prepend|replace)\s+\w*$/, ['as-path']],
  [/\bremove\s+[\w-]*$/, ['as-path private-as']],
];

// Condition context: after if/elseif or a boolean operator.
const CONDITION_CTX = /\b(?:if|elseif|and|or|not)\s+(?:\(\s*)?[\w-]*$|\(\s*[\w-]*$/;

// Returns [{label, detail?, snippet?}] for a given line prefix.
function complete(linePrefix) {
  const items = (list) => list.map(([label, detail, snippet]) => ({ label, detail, snippet }));
  const words = (list) => list.map((w) => ({ label: w }));

  for (const [re, values] of ENUM_AFTER) {
    if (re.test(linePrefix)) return words(values);
  }
  if (/\bset\s+[\w-]*$/.test(linePrefix)) return items(SET_ATTRS);
  if (CONDITION_CTX.test(linePrefix)) return items(CONDITIONS);
  if (/^\s*[\w-]*$/.test(linePrefix)) return items(STATEMENTS).concat(items(TOPLEVEL));
  return [];
}

module.exports = { CONDITIONS, SET_ATTRS, STATEMENTS, TOPLEVEL, ENUM_AFTER, complete };
