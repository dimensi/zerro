import React from 'react'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import ruDateLocale from 'date-fns/locale/ru'
import { AppThemeProvider } from '../src/AppThemeProvider'
import { DemoStoreProvider } from '../src/demoData/DemoStoreProvider'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  Story => (
    <DemoStoreProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruDateLocale}>
        <AppThemeProvider>
          <Story />
        </AppThemeProvider>
      </LocalizationProvider>
    </DemoStoreProvider>
  ),
]