import { CssBaseline } from '@mui/material'
import {
  createTheme,
  ThemeProvider as MUIThemeProvider
} from '@mui/material/styles'

const PRIMARY = {
  main: '#6D4C41'
}
const SECONDARY = {
  main: '#43A047'
}

const ERROR = {
  main: '#e9514e'
}

function ThemeProvider ({ children }) {
  const themeOptions = {
    palette: {
      primary: PRIMARY,
      secondary: SECONDARY,
      error: ERROR
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
