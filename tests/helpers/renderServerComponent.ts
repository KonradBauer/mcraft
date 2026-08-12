import type { ReactElement } from 'react'
import { renderToReadableStream } from 'react-dom/server.edge'

/**
 * Owinięcie w <Suspense> (wymagane przez Next.js Cache Components dla stron czytających
 * cookies()/Payload) sprawia, że @testing-library/react `render()` nie doczeka się
 * rozwiązania async komponentu-dziecka - widzi tylko fallback. `renderToReadableStream`
 * (ten sam mechanizm co RSC w Next.js) poprawnie czeka na Suspense przed zwróceniem HTML.
 */
export async function renderServerComponent(jsx: ReactElement): Promise<void> {
  document.body.innerHTML = ''
  let caughtError: unknown

  const stream = await renderToReadableStream(jsx, {
    onError(error) {
      caughtError = error
    },
  })
  await stream.allReady

  if (caughtError) throw caughtError

  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let html = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    html += decoder.decode(value, { stream: true })
  }

  document.body.innerHTML = html
}
