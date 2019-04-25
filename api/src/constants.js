/**
 * Database and model constants related to schema and interface references
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
   * Placeholders for generating seed or empty objects from factories.
   */
  exports.placeholders = {
    imageTimelineItem: 'http://placehold.jpg/125x50.png'
  };
  
  /**
   * Locale
   */
  exports.locale = {
    english: 'EN_EN',
    german: 'DE_DE'
  };

  