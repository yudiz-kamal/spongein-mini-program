Page({
  data: {
    webViewReady: false,
    authCode: null,
    retryCount: 0,
    maxRetries: 3
  },

  onLoad(query) {
    console.log('Page loaded with query:', query)
    
    // Create webview context to send messages to H5
    this.webViewContext = my.createWebViewContext('web-view-1')
    
    // Get auth code immediately when page loads
    this.getUserInfo()
  },

  onReady() {
    console.log('Page rendering complete')
  },

  onShow() {
    console.log('Page becomes visible')
    // Retry authentication if it failed before
    if (!this.data.authCode && this.data.retryCount < this.data.maxRetries) {
      this.getUserInfo()
    }
  },

  onHide() {
    console.log('Page becomes hidden')
  },

  onUnload() {
    console.log('Page is closed')
  },

  // Called when webview finishes loading
  onWebViewLoad(e) {
    console.log('WebView loaded successfully:', e)
    this.setData({ webViewReady: true })
    
    // Send auth code again if we already have it and webview just loaded
    if (this.data.authCode) {
      this.sendAuthCodeToWebView(this.data.authCode)
    }
  },

  // Called when webview encounters an error
  onWebViewError(e) {
    console.error('WebView error:', e)
    my.showToast({
      type: 'fail',
      content: 'Failed to load page. Please try again.',
      duration: 3000
    })
  },

  // Get user authentication info from VodaPay
  getUserInfo() {
    console.log('Attempting to get auth code...')
    
    my.showLoading({
      content: 'Authenticating...',
    })

    my.getAuthCode({
      scopes: ['auth_user'],
      success: (res) => {
        console.log('Auth code received:', res.authCode)
        
        my.hideLoading()
        
        this.setData({
          authCode: res.authCode,
          retryCount: 0
        })
        
        // Send auth code to web view
        this.sendAuthCodeToWebView(res.authCode)
        
        my.showToast({
          type: 'success',
          content: 'Authentication successful',
          duration: 2000
        })
      },
      fail: (err) => {
        console.error('Failed to get auth code:', err)
        
        my.hideLoading()
        
        const newRetryCount = this.data.retryCount + 1
        this.setData({ retryCount: newRetryCount })
        
        if (newRetryCount < this.data.maxRetries) {
          my.showToast({
            type: 'fail',
            content: 'Authentication failed. Retrying...',
            duration: 2000
          })
          
          // Retry after 2 seconds
          setTimeout(() => {
            this.getUserInfo()
          }, 2000)
        } else {
          my.showToast({
            type: 'fail',
            content: 'Authentication failed. Please restart the app.',
            duration: 3000
          })
        }
      }
    })
  },

  // Send auth code to web view
  sendAuthCodeToWebView(authCode) {
    if (!this.webViewContext) {
      console.error('WebView context not initialized')
      return
    }

    console.log('Sending auth code to web view:', authCode)
    
    try {
      this.webViewContext.postMessage({
        action: {
          type: 'authCode',
          detail: { 
            authCode: authCode,
            timestamp: Date.now()
          }
        }
      })
      console.log('Auth code sent successfully')
    } catch (error) {
      console.error('Error sending auth code to web view:', error)
    }
  },

  // Handle pull down refresh
  onPullDownRefresh() {
    console.log('Pull down refresh triggered')
    my.stopPullDownRefresh()
    
    // Refresh auth
    this.getUserInfo()
  },

  // Handle share
  onShareAppMessage() {
    return {
      title: 'Spongein - Your Learning Journey',
      desc: 'Join me on Spongein to enhance your learning experience!',
      path: 'pages/index/index',
    }
  },

  // Handle messages from the web application
  onMessageHandler(e) {
    console.log('Message received from web app:', e)
    
    var detail = e.detail || {}
    var type = detail.type
    var data = detail.data || {}

    switch (type) {
      case 'navigate':
        // Handle navigation requests from web app
        if (data.url) {
          console.log('Navigating to:', data.url)
          my.navigateTo({ 
            url: data.url,
            fail: (err) => {
              console.error('Navigation failed:', err)
            }
          })
        }
        break
        
      case 'share':
        // Handle share request from web app
        console.log('Share requested:', data)
        my.showSharePanel({
          title: data.title || 'Spongein',
          desc: data.desc || 'Check out Spongein!',
          success: (res) => {
            console.log('Share successful:', res)
          },
          fail: (err) => {
            console.error('Share failed:', err)
          }
        })
        break
        
      case 'requestAuth':
        // Web app requesting re-authentication
        console.log('Re-authentication requested')
        this.getUserInfo()
        break
        
      case 'showToast':
        // Show toast message from web app
        my.showToast({
          type: data.type || 'success',
          content: data.message || 'Success',
          duration: data.duration || 2000
        })
        break
        
      default:
        console.info('Unhandled message type:', type, data)
    }
  }
})