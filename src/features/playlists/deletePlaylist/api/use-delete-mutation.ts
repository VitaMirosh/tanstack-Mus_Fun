import {useMutation, useQueryClient} from '@tanstack/react-query';
import {client} from '../../../../shared/api/client.ts';
import type {SchemaGetPlaylistsOutput} from '../../../../shared/api/schema.ts';

export const useDeleteMutation = (playlistId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id?: string) => {
      const targetId = id ?? playlistId
      const response = await client.DELETE('/playlists/{playlistId}', {
        params: {path: {playlistId: targetId}}
      })
      if (response.error) throw response.error
      return targetId
    },
    onSuccess: (deletedId) => {
      // было 3 ошибки:
      // 1) queryKey ['playlists '] с пробелом не совпадает с ['playlists', {page, search}] из playlists.tsx:15
      // 2) тип SchemaGetPlaylistOutput (один плейлист) и обращение oldData.data.id.filter — у массива нет .id
      // 3) setQueryData обновляет только один точный ключ, а у нас ключи с пагинацией — нужен setQueriesData по префиксу
      queryClient.setQueriesData<SchemaGetPlaylistsOutput>({queryKey:['playlists']}, (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: oldData.data.filter(p=>p.id !== deletedId),
            meta: {
              ...oldData.meta,
              totalCount: Math.max(0, oldData.meta.totalCount - 1),
              pagesCount: oldData.meta.pagesCount // можно пересчитать если нужно: Math.ceil((totalCount-1)/pageSize)
            }
          }
        }
      )
    }
  })
}