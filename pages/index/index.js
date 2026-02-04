Page({
  data: {
    isLoading: true,
    hasError: false,
    errorMessage: '',
  },

  onLoad(query) {
    // Create webview context to send messages to H5
    this.webViewContext = my.createWebViewContext('web-view-1')
  },

  // Get user info from VodaPay
  getUserInfo() {
    my.getAuthCode({
      scopes: ['auth_user'],
      success: (res) => {
        // Send authCode to WebView
        my.alert({
          title: 'Auth Code',
          content: res.authCode,
          buttonText: 'OK',
        });
        this.webViewContext.postMessage({ action: { type: 'authCode', detail: { authCode: res.authCode } } });

        // Also get user info if needed
        my.getOpenUserInfo({
          success: (userInfoRes) => {
            my.alert({
              title: 'User Info',
              content: JSON.stringify(userInfoRes),
              buttonText: 'OK',
            });
            this.webViewContext.postMessage({ action: { type: 'userInfo', detail: userInfoRes } });
          }
        });
      },
      fail: (err) => {
        console.error('Failed to get auth code:', err)
      }
    })
  },

  sendToWebView(type, data) {
    if (this.webViewContext) {
      this.webViewContext.postMessage({ type, data });
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
    var action = detail.action || {};
    var type = action.type;
    var data = action.detail || {};

    switch (type) {
      case 'clientReady':
        console.info('Client is ready, fetching auth info...');
        this.getUserInfo();
        break;
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
