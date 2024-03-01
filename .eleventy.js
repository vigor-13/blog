const { DateTime } = require('luxon');
const { EleventyRenderPlugin } = require('@11ty/eleventy');
const pluginBundle = require('@11ty/eleventy-plugin-bundle');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const { attrs } = require('@mdit/plugin-attrs');
const { figure } = require('@mdit/plugin-figure');
const { imgSize } = require('@mdit/plugin-img-size');
const { tab } = require('@mdit/plugin-tab');
const embedYouTube = require('eleventy-plugin-youtube-embed');
const markdownItCheckbox = require('markdown-it-task-checkbox');
const markdownItCallout = require('./eleventy.callout');
const markdownItLinkPreview = require('./eleventy.linkPreview');

module.exports = function (eleventyConfig) {
  /* Plugins */
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginBundle);
  eleventyConfig.addPlugin(syntaxHighlight, {
    // alwaysWrapLineHighlights: true,
  });
  eleventyConfig.amendLibrary('md', (mdLib) =>
    mdLib.use(markdownItCheckbox, {
      ulClass: 'checkbox-list',
      liClass: 'checkbox-list-item',
    }),
  );
  eleventyConfig.amendLibrary('md', (mdLib) => mdLib.use(markdownItCallout));
  eleventyConfig.amendLibrary('md', (mdLib) => mdLib.use(attrs));
  eleventyConfig.amendLibrary('md', (mdLib) => mdLib.use(figure));
  eleventyConfig.amendLibrary('md', (mdLib) => mdLib.use(imgSize));
  eleventyConfig.amendLibrary('md', (mdLib) => mdLib.use(tab));
  eleventyConfig.amendLibrary('md', (mdLib) =>
    mdLib.use(markdownItLinkPreview),
  );

  eleventyConfig.addPlugin(embedYouTube, {
    embedClass: 'youtube-embed',
  });

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
      (tag) => !['all', 'nav', 'post', 'posts', 'docs'].includes(tag),
    );
    return t;
  });

  eleventyConfig.addFilter('isEmpty', function isEmptyList(tags) {
    const t = (tags || []).filter(
      (tag) => !['all', 'nav', 'post', 'posts', 'docs'].includes(tag),
    );

    return t.length > 0 ? true : false;
  });

  eleventyConfig.addGlobalData('eleventyComputed.permalink', function () {
    return (data) => {
      if (data.draft && !process.env.BUILD_DRAFTS) {
        return false;
      }

      return data.permalink;
    };
  });

  eleventyConfig.on('eleventy.before', ({ runMode }) => {
    if (runMode === 'serve' || runMode === 'watch') {
      process.env.BUILD_DRAFTS = true;
    }
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
