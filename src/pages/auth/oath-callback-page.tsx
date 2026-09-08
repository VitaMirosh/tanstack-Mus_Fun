import {useEffect} from 'react';


export function OathCallbackPage() {
useEffect(() => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  if(code && window.opener){
    window.opener.postMessage({code},window.location.origin)
  }
  window.close();
},[])
  return (
    <>
      <h2>OAuth Callback page </h2>

    </>
  )
}

