import container from 'markdown-it-container'
import MarkdownIt from 'markdown-it'

export type RenderPlaceFunction = (info: string) => string

export interface Options {
  type: string
  before: RenderPlaceFunction
  after: RenderPlaceFunction
}

export default (md: MarkdownIt, options: Options) => {
  const stack: string[] = []

  md.use(container, options.type, {
    render(tokens, index) {
      const token = tokens[index]
      if (token.nesting === 1) {
        const info = token.info.trim().slice(options.type.length).trim()
        stack.push(info)
        return options.before(info)
      } else {
        const info = stack.pop() || ''
        return options.after(info)
      }
    },
  })
}
