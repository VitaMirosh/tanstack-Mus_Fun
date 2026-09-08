import {callbackUrl, useLoginMutation} from '../api/use-login-mutation.ts';


export const LoginButton = () => {

  const mutation = useLoginMutation()

  const handleLoginClick = () => {
    window.addEventListener('message', handleOauthMessage)
    window.open(`https://musicfun.it-incubator.app/api/1.0/auth/oauth-redirect?callbackUrl=${encodeURIComponent(callbackUrl)}`, 'apihub-oauth2', 'width=500,height=600')
  }
  const handleOauthMessage = (event: MessageEvent) => {
    window.removeEventListener('message', handleOauthMessage)
    if (event.origin !== document.location.origin) {
      console.log('origin is not supported')
      return
    }
    const code = event.data.code
    if (!code) {
      console.log('no code')
      return
    }
    mutation.mutate({code})
  }

  return <button onClick={handleLoginClick}>Login with APIHUB</button>
}