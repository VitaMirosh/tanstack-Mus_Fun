import {useMutation, useQueryClient} from '@tanstack/react-query';
import type {SchemaGetPlaylistsOutput, SchemaUpdatePlaylistRequestPayload} from '../../../../shared/api/schema.ts';
import {client} from '../../../../shared/api/client.ts';
import {playlistsKeys} from '../../../../shared/api/keys-factories/playlists-keys-factory.ts';

type MutationArguments = SchemaUpdatePlaylistRequestPayload & {playlistId: string};

export const useUpdatePlaylistMutation = () => {
  const queryClient = useQueryClient()
  const key = playlistsKeys.myList()


  return  useMutation(
    {
      mutationFn: async (data: MutationArguments) => {
        const {playlistId, ...rest} = data
        const response = await client.PUT('/playlists/{playlistId}', {
          params: {
            path: {playlistId: playlistId}
          },
          body: {...rest, tagId:[]}
        })
        if (response.error) {
          // пробрасываем ошибку чтобы увидеть детали 400 в onError / devtools
          throw response.error
        }
        return response.data
      },
      onMutate: async (data: MutationArguments) => {
        await queryClient.cancelQueries({queryKey: playlistsKeys.all})

        const previousMyPlaylist = queryClient.getQueryData(key)

        queryClient.setQueryData(key, (oldData: SchemaGetPlaylistsOutput) => {
          return {
            ...oldData,
            data: oldData.data.map(p => {
              if (p.id === data.playlistId) return {
                ...p,
                attributes: {
                  ...p.attributes,
                  description: data.data.attributes.description,
                  title: data.data.attributes.title
                }
              }
              else return p

            })
          }
        })

        return {previousMyPlaylist}
      },
      onError: (_, __:MutationArguments, context) => {
        queryClient.setQueryData(
          key,
          context!.previousMyPlaylist,
        )
      },

      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: playlistsKeys.lists(),refetchType:'all' },)
    })
}