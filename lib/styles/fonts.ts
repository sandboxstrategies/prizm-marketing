import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

const fonts = [GeistSans, GeistMono]
const fontsVariable = fonts.map((font) => font.variable).join(' ')

export { fontsVariable }
