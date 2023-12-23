const { EleventyRenderPlugin } = require('@11ty/eleventy');
const { DateTime } = require('luxon');

module.exports = function (eleventyConfig) {
  /* Plugins */
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  /* Public Asset */
  eleventyConfig.addPassthroughCopy({
    './public/': '/',
  });

  /* Post Date */
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  return {
    dir: {
      input: 'contents',
      includes: '../src/includes',
      layouts: '../src/layouts',
      output: 'dist',
    },
  };
};
