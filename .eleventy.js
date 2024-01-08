const { DateTime } = require('luxon');
const { EleventyRenderPlugin } = require('@11ty/eleventy');
const pluginBundle = require('@11ty/eleventy-plugin-bundle');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const { attrs } = require('@mdit/plugin-attrs');
const markdownItCheckbox = require('markdown-it-task-checkbox');
const markdownItCallout = require('./eleventy.callout');
const markdownItLinkPreview = require('./eleventy.linkPreview');

module.exports = function (eleventyConfig) {
  /* Plugins */
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginBundle);
  eleventyConfig.addPlugin(syntaxHighlight, {
    alwaysWrapLineHighlights: true,
  });
  eleventyConfig.amendLibrary('md', (mdLib) =>
    mdLib.use(markdownItCheckbox, {
      ulClass: 'checkbox-list',
      liClass: 'checkbox-list-item',
    }),
  );
  eleventyConfig.amendLibrary('md', (mdLib) => mdLib.use(markdownItCallout));
  eleventyConfig.amendLibrary('md', (mdLib) => mdLib.use(attrs));
  eleventyConfig.amendLibrary('md', (mdLib) =>
    mdLib.use(markdownItLinkPreview),
  );

  /* Public Asset */
  eleventyConfig.addPassthroughCopy({
    './public/': '/',
  });

  /* Post Date */
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('filterTagList', function filterTagList(tags) {
    const t = (tags || []).filter(
      (tag) => !['all', 'nav', 'post', 'posts'].includes(tag),
    );
    return t;
  });

  eleventyConfig.addFilter('isEmpty', function isEmptyList(tags) {
    const t = (tags || []).filter(
      (tag) => !['all', 'nav', 'post', 'posts'].includes(tag),
    );

    return t.length > 0 ? true : false;
  });

  return {
    // templateFormats: ['md', 'njk', 'html', 'css', 'png', 'jpg', 'gif'],
    // markdownTemplateEngine: 'njk',
    // htmlTemplateEngine: 'njk',
    // dataTemplateEngine: 'njk',
    // passthroughFileCopy: true,
    dir: {
      input: 'content', // default: "."
      includes: '../src/includes', // default: "_includes"
      data: '../src/data', // default: "_data"
      output: 'dist',
    },
    pathPrefix: '/',
  };
};
