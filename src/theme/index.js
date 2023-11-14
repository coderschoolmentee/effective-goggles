import { CssBaseline } from '@mui/material'
import {
  createTheme,
  ThemeProvider as MUIThemeProvider
} from '@mui/material/styles'

const PRIMARY = {
  main: '#6D4C41'
}
const SECONDARY = {
  main: '#D2691E'
}

const NAV_TEXT = {
  main: '#F0E68C'
}

const ERROR = {
  main: '#e9514e'
}

function ThemeProvider ({ children }) {
  const themeOptions = {
    palette: {
      primary: PRIMARY,
      secondary: SECONDARY,
      error: ERROR,
      nav: NAV_TEXT
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true
        }
      },
      MuiLink: {
        defaultProps: {
          underline: 'hover'
        }
      }
    },
    typography: {
      fontFamily: ['Roboto Mono', 'monospace', 'Roboto', 'sans-serif'].join(
        ','
      )
    }
  }

  const theme = createTheme(themeOptions)

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}

export default ThemeProvider
