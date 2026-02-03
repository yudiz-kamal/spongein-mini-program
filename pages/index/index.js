Page({
  data: {
    isLoading: true,
    hasError: false,
    errorMessage: '',
  },

  onLoad(query) {
    console.info('Page onLoad with query: ' + JSON.stringify(query));
    this.setData({ isLoading: true, hasError: false });
  },

  onReady() {
    // Page rendering complete
  },

  onShow() {
    // Page becomes visible
  },

  onHide() {
    // Page becomes hidden
  },

  onUnload() {
    // Page is closed
  },

  onTitleClick() {
    // Title bar clicked
  },

  onPullDownRefresh() {
    this.setData({ isLoading: true, hasError: false });
    my.stopPullDownRefresh();
  },

  onReachBottom() {
    // Scrolled to bottom
  },

  onShareAppMessage() {
    return {
      title: 'Spongein - Your Learning Journey',
      desc: 'Join me on Spongein to enhance your learning!',
      path: 'pages/index/index',
    };
  },

  // Handle messages from the web application
  onMessageHandler(e) {
    console.info('Message from WebView:', e.detail);
    var detail = e.detail || {};
    var type = detail.type;
    var data = detail.data || {};

    switch (type) {
      case 'navigate':
        if (data.url) {
          my.navigateTo({ url: data.url });
        }
        break;
      case 'share':
        // Handle share request from web app
        break;
      default:
        console.info('Unhandled message type:', type);
    }
  },

  // WebView loaded successfully
  onWebViewLoad() {
    this.setData({ isLoading: false, hasError: false });
  },

  // WebView failed to load
  onWebViewError(e) {
    console.error('WebView load error:', e.detail);
    this.setData({
      isLoading: false,
      hasError: true,
      errorMessage: 'Failed to load content. Please check your connection.',
    });
  },

  // Retry loading the page
  onRetry() {
    this.setData({ isLoading: true, hasError: false });
    // Reload the page
    my.reLaunch({ url: '/pages/index/index' });
  },
});
