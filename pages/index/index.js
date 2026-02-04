Page({
  onLoad(query) {
    // Create webview context to send messages to H5
    this.webViewContext = my.createWebViewContext('web-view-1')
     // Wait a bit for webview to be ready
     setTimeout(() => {
      this.getUserInfo()
    }, 1000)
  },

  // Get user info from VodaPay
  getUserInfo() {
    my.getAuthCode({
      scopes: ['auth_user'],
      success: (res) => {
        // VodaPay WebView communication requires my.postMessage
        my.postMessage({
          action: {
            type: 'authCode',
            detail: { authCode: res.authCode }
          }
        });
      },
      fail: (err) => {
        console.error('Failed to get auth code:', err)
      }
    })
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
    my.startPullDownRefresh()
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
  }
});
