const vscode = require('vscode');
const { complete } = require('./keywords');

const SET_DEF_RE = /^\s*(?:route-policy|prefix-set|as-path-set|community-set|large-community-set|rd-set|tag-set|esi-set|etag-set|mac-set|ospf-area-set|extcommunity-set\s+(?:rt|soo|cost|bandwidth|opaque|evpn-link-bandwidth|seg-nh))\s+([A-Za-z0-9][A-Za-z0-9._-]*)/gm;
const PARAM_RE = /\$[A-Za-z0-9_]+/g;
const NAME_CTX = /\b(?:in|matches-any|matches-every|matches-within|longer-than|or-longer|async|apply)\s+\(?\s*[\w.-]*$|\bset\s+(?:community|large-community|extcommunity\s+[\w-]+)\s+[\w.-]*$/;

function activate(context) {
  const provider = vscode.languages.registerCompletionItemProvider(
    'rpl',
    {
      provideCompletionItems(document, position) {
        const linePrefix = document.lineAt(position).text.slice(0, position.character);
        const out = [];

        for (const { label, detail, snippet } of complete(linePrefix)) {
          const kind = snippet
            ? vscode.CompletionItemKind.Snippet
            : vscode.CompletionItemKind.Keyword;
          const item = new vscode.CompletionItem(label, kind);
          if (detail) item.detail = detail;
          if (snippet) item.insertText = new vscode.SnippetString(snippet);
          out.push(item);
        }

        const text = document.getText();

        // Named sets / policies defined in this file, offered after in/matches-*/apply.
        if (NAME_CTX.test(linePrefix)) {
          for (const name of new Set([...text.matchAll(SET_DEF_RE)].map((m) => m[1]))) {
            out.push(new vscode.CompletionItem(name, vscode.CompletionItemKind.Reference));
          }
        }

        // $parameters seen anywhere in the file.
        for (const p of new Set(text.match(PARAM_RE) || [])) {
          out.push(new vscode.CompletionItem(p, vscode.CompletionItemKind.Variable));
        }

        return out;
      },
    },
    ' ', '$'
  );
  context.subscriptions.push(provider);
}

function deactivate() {}

module.exports = { activate, deactivate };
