import {useMutation, useQueryClient} from '@tanstack/react-query';
import {client} from '../../../shared/api/client.ts';

export const callbackUrl = 'http://localhost:5173/oauth/callback';

export const useLoginMutation = () => {


  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({code}: { code: string }) => {
      const response = await client.POST('/auth/login', {
        body: {
          code: code,
          redirectUri: callbackUrl,
          rememberMe: true,
          accessTokenTTL: '5s',

        }
      })
      if (response.error) {
        const err = response.error as unknown as { message?: string; errors?: { detail?: string; title?: string }[] }
        throw new Error(err.message ?? err.errors?.[0]?.detail ?? err.errors?.[0]?.title ?? 'Login failed')
      }
      return response.data
    },
    onSuccess:(data)=>{
      localStorage.setItem('musicfun-refresh-token',data.refreshToken)
      localStorage.setItem('musicfun-access-token',data.accessToken)
      queryClient.invalidateQueries({queryKey:['auth','me']})
    }
  })

  return mutation
}