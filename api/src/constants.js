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
  imageTimelineItem: 'http://placehold.jpg/125x50.png',
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
