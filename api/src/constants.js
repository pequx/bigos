/**
 * Database and model constants related to schema and interface references
 * @todo: create schema provider/factory, this schema is a copy of API's one
 */
exports.dbSchema = {
  company: {
    detail: {
      table: 'companyDetails',
      column: {
        id: 'companyId',
        active: 'companyActive',
        name: 'companyName',
        description: 'companyDescription',
        location: 'companyLocation',
        parent: 'companyParent',
        hodling: 'companyHolding',
      },
    },
  },
  blog: {
    post: {
      table: 'blogPosts',
      column: {
        id: 'postId',
        active: 'postActive',
        title: 'postTitle',
        image: 'postImage',
        description: 'postDescription',
        keywords: 'postKeywords',
        content: 'postContent',
      },
    },
  },
  timeline: {
    category: {
      table: 'timelineItemCategories',
      column: {
        id: 'categoryId',
        active: 'categoryActive',
        name: 'categoryName',
        description: 'categoryDescription',
      },
    },
    item: {
      table: 'timelineItems',
      column: {
        id: 'itemId',
        active: 'itemActive',
        category: 'itemCategoryId',
        content: 'itemContent',
        start: 'itemStartDate',
        end: 'itemEndDate',
      },
    },
    detail: {
      table: 'timelineDetails',
      column: {
        id: 'detailId',
        active: 'detailActive',
        name: 'detailName',
        operational: 'detailOperational',
        image: 'detailImage',
        link: 'detailLink',
        index: 'detailIndex',
        description: 'detailDescription',
        parent: 'detailParent',
        industry: 'detailIndustry',
        region: 'detailRegion',
      },
    },
  },
};

exports.containerSchema = {
  app: 'app',
  api: 'api',
  db: 'db',
};

/**
 * Placeholders for generating seed or empty objects from factories.
 */
exports.placeholders = {
  /**
   * @link http://schepers.cc/svg/svg-datauri-img.html
   */
  imageTimelineItem:
    "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'130'%20height%3D'50'%3E%3Crect%20width%3D'100%25'%20height%3D'100%25'%20fill%3D'crimson'%2F%3E%3Cline%20x1%3D'0'%20x2%3D'130'%20y1%3D'0'%20y2%3D'50'%20stroke%3D'gainsboro'%2F%3E%20%3Cline%20x1%3D'130'%20x2%3D'0'%20y1%3D'0'%20y2%3D'50'%20stroke%3D'gainsboro'%2F%3E%3Ctext%20x%3D'65'%20y%3D'30'%20font-size%3D'20'%20font%3D'Verdana%2C%20sans-serif'%20fill%3D'white'%20text-anchor%3D'middle'%3E130%20x%2050%3C%2Ftext%3E%3C%2Fsvg%3E",
};

/**
 * Locale
 * @see https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes
 */
exports.locale = {
  polish: 'POL',
  english: 'ENG',
  german: 'GEM',
};

/**
 * @todo: it seems to be redudndant
 */
exports.factory = {
  all: 'all',
  mock: 'mock',
  timeline: {
    category: {
      name: ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'],
    },
  },
};

/**
 * API endpoints routes
 */
exports.routes = {
  timeline: {
    item: {
      api: '/timeline/item',
      all: '/all',
      category: '/category',
    },
  },
};
