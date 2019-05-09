/**
 * @todo: create schema provider/factory, this schema is a copy of API's one
 */
exports.schema = {
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
        hodling: 'companyHolding'
      }
    }
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
        content: 'postContent'
      }
    }
  },
  timeline: {
    category: {
      table: 'timelineItemCategories',
      column: {
        id: 'categoryId',
        active: 'categoryActive',
        name: 'categoryName',
        description: 'categoryDescription'
      }
    },
    item: {
      table: 'timelineItems',
      column: {
        id: 'itemId',
        active: 'itemActive',
        category: 'itemCategoryId',
        content: 'itemContent',
        start: 'itemStartDate',
        end: 'itemEndDate'
      }
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
        region: 'detailRegion'
      }
    }
  }
};

/**
 * @see https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes
 */
const _locales = {
  polish: 'POL',
  english: 'ENG',
  german: 'GEM'
};

/**
 * Locale
 */
exports.locale = _locales;

exports.labels = {
  app: {
    POL: 'BIGOS',
    ENG: 'BIGOS',
    GEM: 'BIGOS'
  },
  home: {
    POL: 'Strona główna',
    ENG: 'Home Page',
    GEM: 'Startseite'
  },
  timeline: {
    home: {
      POL: 'Linia Czasu',
      ENG: 'Timeline',
      GEM: 'Zeitlinie'
    },
    navigation: {
      all: {
        POL: 'Wszystkie',
        ENG: 'All',
        GEM: 'Alle'
      }
    }
  }
};

/**
 * API endpoints routes
 */
exports.routes = {
  home: '/',
  timeline: {
    home: '/timeline',

    category: {
      api: '/timeline/category',
      all: '/all',
      home: '/timeline'
    },

    item: {
      api: '/timeline/item',
      all: '/all',
      category: '/category',
      home: '/timeline'
    }
  }
};
