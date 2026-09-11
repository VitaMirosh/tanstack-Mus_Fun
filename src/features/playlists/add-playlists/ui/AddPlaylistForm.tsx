import {useForm} from 'react-hook-form';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {client} from '../../../../shared/api/client.ts';
import type {SchemaCreatePlaylistRequestPayload} from '../../../../shared/api/schema.ts';


export const AddPlaylistForm = () => {
  const {register, handleSubmit} = useForm<SchemaCreatePlaylistRequestPayload>({
    defaultValues: {
      data: {
        type: 'playlists',
        attributes: {
          title: '',
          description: null,
        },
      },
    },
  })
  const queryClient = useQueryClient()
  const {mutate} = useMutation(
    {
      mutationFn: async (data: SchemaCreatePlaylistRequestPayload) => {
        const response = await client.POST('/playlists', {
          body: data
        })
        if (response.error) {
          // пробрасываем ошибку чтобы увидеть детали 400 в onError / devtools
          throw response.error
        }
        return response.data
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['playlists'],
          refetchType:'all'
        })
      }
    }
  )
  const onSubmit = (data: SchemaCreatePlaylistRequestPayload) => {
    // Главная причина 400 — отсутствие обязательного поля data.type
    // Гарантируем JSON:API payload: { data: { type: 'playlists', attributes: { title, description } } }
    const payload: SchemaCreatePlaylistRequestPayload = {
      data: {
        type: 'playlists',
        attributes: {
          title: data.data.attributes.title?.trim(),
          // пустую строку API не принимает как description, нужно null
          description: data.data.attributes.description?.trim() ? data.data.attributes.description : null,
        },
      },
    }
    mutate(payload)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Add New Playlist</h2>
      <p>
        <input {...register('data.attributes.title', { required: true })}/>
      </p>
      {/* Обязательное поле по JSON:API схеме CreatePlaylistData */}
      <input type="hidden" {...register('data.type')} value="playlists" />
      <p>
        <textarea {...register('data.attributes.description')} />
      </p>
      <button type={'submit'}>Create</button>
    </form>
  );
};
