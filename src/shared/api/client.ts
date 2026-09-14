import createClient, {type Middleware} from 'openapi-fetch';
import type {paths} from './schema';
import {apiKey, baseUrl} from '../config/api-config.ts';
import {localStorageKeys} from '../config/localstorage-key.ts';


let refreshPromise: Promise<void> | null = null;

function makeRefreshToken() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async (): Promise<void> => {
    const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)
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
      localStorage.removeItem(localStorageKeys.refreshToken)
      localStorage.removeItem(localStorageKeys.accessToken)
      throw new Error('Refresh token failed.')
    }
    const data = await response.json()
    localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)
    localStorage.setItem(localStorageKeys.accessToken, data.accessToken)
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
      const newAccessToken = localStorage.getItem(localStorageKeys.accessToken)
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