const { EleventyRenderPlugin } = require('@11ty/eleventy');
const pluginBundle = require('@11ty/eleventy-plugin-bundle');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
var markdownItCheckbox = require('markdown-it-task-checkbox');
const { DateTime } = require('luxon');

module.exports = function (eleventyConfig) {
  /* Plugins */
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginBundle);
  eleventyConfig.addPlugin(syntaxHighlight, {
    alwaysWrapLineHighlights: true,
  });
  // eleventyConfig.setLibrary('md', markdownIt());
  eleventyConfig.amendLibrary('md', (mdLib) =>
    mdLib.use(markdownItCheckbox, {
      ulClass: 'checkbox-list',
      liClass: 'checkbox-list-item',
    }),
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
    console.log(tags);
    return (tags || []).filter(
      (tag) => !['all', 'nav', 'post', 'posts'].includes(tag),
    );
  });

  return {
    dir: {
      input: 'content', // default: "."
      includes: '../src/includes', // default: "_includes"
      data: '../src/data', // default: "_data"
      output: 'dist',
    },
    pathPrefix: '/',
  };
};
