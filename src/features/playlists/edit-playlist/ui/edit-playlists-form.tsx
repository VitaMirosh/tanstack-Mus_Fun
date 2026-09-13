import {useForm} from 'react-hook-form';
import type {SchemaGetPlaylistsOutput, SchemaUpdatePlaylistRequestPayload} from '../../../../shared/api/schema.ts';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {client} from '../../../../shared/api/client.ts';
import {useEffect} from 'react';
import {useMeQuery} from '../../../auth/api/use-me-query.ts';

type Props = {
  playlistId: string | null
}

export const EditPlaylistForm = ({playlistId}: Props) => {
  const {register, handleSubmit, reset} = useForm<SchemaUpdatePlaylistRequestPayload>()

  const {data: meData} = useMeQuery()
  useEffect(() => {
    reset()
  }, [playlistId])

  const {data, isPending, isError} = useQuery({
    queryKey: ['playlists', playlistId],
    queryFn: async () => {
      const response = await client.GET('/playlists/{playlistId}', {params: {path: {playlistId: playlistId!}}})
      return response.data!
    },
    enabled: !!playlistId
  })
  const queryClient = useQueryClient()
  const key = ['playlists', 'my', meData!.userId]
  const {mutate} = useMutation(
    {
      mutationFn: async (formData: SchemaUpdatePlaylistRequestPayload) => {
        const payload: SchemaUpdatePlaylistRequestPayload = {
          data: {
            type: 'playlists',
            attributes: {
              title: formData.data.attributes.title?.trim() ?? '',
              description: formData.data.attributes.description?.trim() ? formData.data.attributes.description.trim() : null,
              // если форма не содержит tagIds (нет поля ввода), берем текущие теги из GET, иначе сбрасываем в []
              tagIds: formData.data.attributes.tagIds ?? data?.data.attributes.tags.map(t => t.id) ?? [],
            },
          },
        }
        const response = await client.PUT('/playlists/{playlistId}', {
          params: {
            path: {playlistId: playlistId!}
          },
          body: payload
        })
        if (response.error) {
          // пробрасываем ошибку чтобы увидеть детали 400 в onError / devtools
          throw response.error
        }
        return response.data
      },
      onMutate: async (data: SchemaUpdatePlaylistRequestPayload) => {
        await queryClient.cancelQueries({queryKey: ['playlists']})

        const previousMyPlaylist = queryClient.getQueryData(key)

        queryClient.setQueryData(key, (oldData: SchemaGetPlaylistsOutput) => {
          return {
            ...oldData,
            data: oldData.data.map(p => {
              if (p.id === playlistId) return {
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
      onError: (_, __: SchemaUpdatePlaylistRequestPayload, context) => {
        queryClient.setQueryData(
          key,
          context!.previousMyPlaylist,
        )
      },

      onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['playlists'],refetchType:'all' },)
    })
  // onSuccess: () => {
  //   queryClient.invalidateQueries({
  //     queryKey: ['playlists'],
  //     refetchType: 'all'
  //   })
  // }


  const onSubmit = (data: SchemaUpdatePlaylistRequestPayload) => {
    mutate(data)
  }
  if (!playlistId) return <></>
  if (isPending) return <p>Loading...</p>
  if (isError) return <p>Error...</p>
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit Playlist</h2>
      <p>
        <input {...register('data.attributes.title', {required: true})} defaultValue={data.data.attributes.title}/>
      </p>
      {/* Обязательное поле по JSON:API схеме CreatePlaylistData */}
      <input type="hidden" {...register('data.type')} value="playlists"/>
      <p>
        <textarea {...register('data.attributes.description')} defaultValue={data.data.attributes.description ?? ''}/>
      </p>
      <button type={'submit'}>Save</button>
    </form>
  );
};
