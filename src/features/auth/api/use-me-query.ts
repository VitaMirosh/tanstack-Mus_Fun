
import {useQuery} from '@tanstack/react-query';
import {client} from '../../../shared/api/client.ts';



export const useMeQuery = () => {
  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async() => {
     const clientResponse = await client.GET('/auth/me')
      if (clientResponse.error) {
        // 401 = not authenticated, return null so AccountBar shows LoginButton without error state
        return null
      }
      return clientResponse.data
    },
    retry: false,
  })
  return query
};
