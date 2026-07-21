import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export function stringToLexical(text: string): DefaultTypedEditorState {
  const paragraphs = text.split('\n').filter((line) => line.trim())
  return {
    root: {
      type: 'root',
      children: paragraphs.length > 0
        ? paragraphs.map((line) => ({
            type: 'paragraph',
            children: [{ type: 'text', text: line, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            textStyle: '',
            version: 1,
          }))
        : [{ type: 'paragraph', children: [], direction: null, format: '', indent: 0, textFormat: 0, textStyle: '', version: 1 }],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}
