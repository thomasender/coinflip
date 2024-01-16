
import App from './App'
import { ThemeProvider } from 'styled-components'
import { ThemeContext, dark, light } from './theme-context'
import { useState } from 'react'
import { GlobalStyle } from './components/styles'


export const AppWrapper = () => {
  const [theme, toggleTheme] = useState('dark')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme === 'dark' ? dark : light}>
      <GlobalStyle />
          <App />
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
