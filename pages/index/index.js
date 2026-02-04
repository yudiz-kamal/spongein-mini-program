Page({
  onLoad(query) {
    // Create webview context to send messages to H5
    this.webViewContext = my.createWebViewContext('web-view-1')
    this.getUserInfo()
  },

  // Get user info from VodaPay
  getUserInfo() {
    my.getAuthCode({
      scopes: ['auth_user'],
      success: (res) => {
        my.alert({
          title: 'Auth Code',
          content: res.authCode,
          buttonText: 'OK',
        });
        // Send authCode to WebView
        this.sendToWebView('authCode', { authCode: res.authCode })
      },
      fail: (err) => {
        console.error('Failed to get auth code:', err)
      }
    })
  },

  sendToWebView(type, data) {
    if (this.webViewContext) {
      this.webViewContext.postMessage({ action: { type, detail: data } });
    } else {
      console.warn('WebView context not ready yet. Queuing message?');
    }
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
  }
});
