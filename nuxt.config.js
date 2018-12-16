const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/<repository-name>/'
  }
} : {}

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'ytdj',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'ytdj' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },

    /**
     * just for ignoring a warning
     */
    postcss: {
      plugins: {
        'postcss-custom-properties': false
      }
    },

    vendor: [ 'vue-cookies' ]
  },
  /**
   * watchers
   */
  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 5000
    }
  },
  /**
   * plugins
   */
  plugins: [
    '~plugins/buefy',
    '~plugins/v-hotkey',
    '~plugins/vue-cookies',
    { src: '~plugins/vue-youtube-embed', ssr: false }
  ],
  /**
   * router
   */
  ...routerBase
}
