const fs = require('fs');
const { DateTime } = require('luxon');

module.exports = {
  tags: ['post'],
  layout: 'layouts/post.njk',
  eleventyComputed: {
    created: (data) => {
      const dateObj = fs.statSync(data.page.inputPath).birthtime;
      return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
        'yyyy-LL-dd',
      );
    },
    updated: (data) => {
      const dateObj = fs.statSync(data.page.inputPath).mtime;
      return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
        'yyyy-LL-dd',
      );
    },
  },
};
