module.exports = function (md) {
  md.core.ruler.after('inline', 'previewLink', (state) => {
    state.tokens.forEach((token) => {
      if (_isPreviewItem(token)) _createPreviewLink(token, state);
    });
  });

  // md.renderer.rules.preview_link_open = function (tokens, idx) {
  //   const attrs = tokens[idx].attrs;
  //   const className = attrs[0][1];
  //   const href = attrs[1][1];
  //   return `
  //     <a class=${className} href=${href}>
  //   `;
  // };
};

function _isPreviewItem(token) {
  const isInline = token.type === 'inline';
  if (!isInline) return false;

  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]* preview[^)]*)\)/g;
  const isPreviewLink = markdownLinkRegex.exec(token.content);
  if (isPreviewLink) return true;

  return false;
}

function _extractLink(content) {
  const regex = /\(([^\s]+)\s/;
  let match = regex.exec(content)[1];

  return match;
}

function _createPreviewLink(token, state) {
  const TokenFactory = state.Token;
  const href = _extractLink(token.content);

  state.env[href] = href;

  // Delete origin text
  token.children.pop();

  // Make link
  var linkOpen = new TokenFactory('preview_link_open', 'a', 1);
  linkOpen.attrs = [
    ['class', 'preview-link'],
    ['href', href],
    ['data-preview', href],
  ];
  var linkEnd = new TokenFactory('preview_link_close', 'a', -1);
  token.children.unshift(linkOpen);
  token.children.push(linkEnd);
}
