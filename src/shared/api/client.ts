import createClient, {type Middleware} from 'openapi-fetch';
import type {paths} from './schema';

export const baseUrl = 'https://musicfun.it-incubator.app/api/1.0/'
const apiKey= 'cfb5bfa9-69d4-4439-9be6-0e61787bc84d'
let refreshPromise: Promise<void> | null = null;

function makeRefreshToken() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async (): Promise<void> => {
    const refreshToken = localStorage.getItem('musicfun-refresh-token')
    if (!refreshToken) throw new Error('No refresh token')

    const response = await fetch(baseUrl + 'auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-KEY': apiKey,
      },
      body: JSON.stringify({ refreshToken })
    })
    if (!response.ok) {
      localStorage.removeItem('musicfun-refresh-token')
      localStorage.removeItem('musicfun-access-token')
      throw new Error('Refresh token failed.')
    }
    const data = await response.json()
    localStorage.setItem('musicfun-refresh-token', data.refreshToken)
    localStorage.setItem('musicfun-access-token', data.accessToken)
  })()
  refreshPromise.finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

const authMiddleware: Middleware = {
  async onRequest({request}) {
    const accessToken = localStorage.getItem('musicfun-access-token')
    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    // @ts-ignore
    request._retryRequest = request.clone()
    return request;
  },
  async onResponse({request, response}) {
    if (response.ok) return response;
    if (response.status !== 401) {
      throw new Error(`${response.url}: ${response.status} ${response.statusText}`)
    }
    if (request.url.includes('/auth/refresh')) return response
    try {
      await makeRefreshToken()
      const originalRequest: Request = (request as any)._retryRequest
      const retryRequest = new Request(originalRequest,{headers:new Headers(originalRequest.headers)})
      const newAccessToken = localStorage.getItem('musicfun-access-token')
      retryRequest.headers.set('Authorization', `Bearer ${newAccessToken}`)
      return fetch(retryRequest)
    } catch {
      return response
    }
  }

};


export const client = createClient<paths>({
  baseUrl: baseUrl, headers: {
    'api-key':  apiKey
  }
});
client.use(authMiddleware);