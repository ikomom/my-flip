import type { EditorPlugin } from './types'
import { WindiDecoration } from '~/monaco/plugins/windicss/decorations'

export const editorPlugins: EditorPlugin[] = [
  WindiDecoration,
]
