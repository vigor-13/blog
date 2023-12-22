module.exports = function (eleventyConfig) {
  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig.addPassthroughCopy({
    './public/': '/',
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
