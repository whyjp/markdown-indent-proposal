/**
 * @typedef {import('vscode').ExtensionContext} ExtensionContext
 */

/**
 * @param {ExtensionContext} context
 */
function activate(context) {
  return {
    extendMarkdownIt(md) {
      try {
        const dotIndent = require('markdown-it-dot-indent');
        return md.use(dotIndent);
      } catch (err) {
        console.error('[markdown-dot-indent]', err);
        return md;
      }
    }
  };
}

function deactivate() {}

module.exports = { activate, deactivate };
