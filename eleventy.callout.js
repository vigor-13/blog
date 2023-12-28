const { container } = require('@mdit/plugin-container');

const CALLOUT_LIST = ['note', 'tip', 'warning', 'important', 'caution'];

module.exports = function (md) {
  for (const callout of CALLOUT_LIST) {
    container(md, {
      name: callout,
      openRender: (tokens, index, _options) => {
        const info = tokens[index].info.trim().slice(callout.length).trim();
        return `
          <div class="markdown-alert markdown-alert-${callout}">\n<p class="markdown-alert-title">
          ${info || callout.replace(/^[a-z]/, (char) => char.toUpperCase())}
          </p>\n
        `;
      },
    });
  }
};
