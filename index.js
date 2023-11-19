import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppContainer as ReactHotLoader } from 'react-hot-loader'
import { ThemeProvider } from 'emotion-theming'
import ReactGA from 'react-ga'
import * as Sentry from '@sentry/browser'

import { MainContainer as Root } from 'containers'
import { GlobalStyles } from 'components'
import theme from './theme'

require('dotenv').config()

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://66e8a28472ba439eabfa9cb013eaa1b4@sentry.io/1540454'
  })
  ReactGA.initialize('UA-86342987-2')
}

const renderApp = Root => {
  render(
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ReactHotLoader>
        <Router>
          <Root />
        </Router>
      </ReactHotLoader>
    </ThemeProvider>,
    document.getElementById('root')
  )
}

renderApp(Root)

if (module.hot) {
  document.head.querySelector('link[rel=icon]').href =
    '/assets/static/other/favicon-dev.png'
  module.hot.accept('containers/Main/MainContainer', () => {
    const Root = require('containers/Main/MainContainer').default
    renderApp(Root)
  })
}
