const getApiHost = () => {
  if (typeof window === 'undefined') {
    return 'localhost'
  }

  return window.location.hostname || 'localhost'
}

export const API_BASE_URL = `http://${getApiHost()}:8080/api`

export const apiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
