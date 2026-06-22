const CSRF_URL = 'http://localhost:8080/api/usuarios/csrf'

let csrfToken = null
let csrfHeaderName = 'X-XSRF-TOKEN'

export async function initializeCsrfToken() {
  const response = await fetch(CSRF_URL, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('No se pudo inicializar la proteccion CSRF')
  }

  const data = await response.json()
  csrfToken = data.token
  csrfHeaderName = data.headerName
}

export async function fetchWithCsrf(url, options = {}) {
  if (!csrfToken) {
    await initializeCsrfToken()
  }

  const headers = new Headers(options.headers)
  headers.set(csrfHeaderName, csrfToken)

  return fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  })
}
