import {useForm} from 'react-hook-form';
import type {SchemaUpdatePlaylistRequestPayload} from '../../../../shared/api/schema.ts';
import {useEffect} from 'react';
import {usePlaylistQuery} from '../api/use-playlist-query.ts';
import {useUpdatePlaylistMutation} from '../api/use-update-playlist-mutation.ts';

type Props = {
  playlistId: string | null
}

export const EditPlaylistForm = ({playlistId}: Props) => {
  const {register, handleSubmit, reset} = useForm<SchemaUpdatePlaylistRequestPayload>()


  useEffect(() => {
    reset()
  }, [playlistId])


  const {data, isPending, isError} = usePlaylistQuery(playlistId)



  const {mutate} = useUpdatePlaylistMutation()
  // onSuccess: () => {
  //   queryClient.invalidateQueries({
  //     queryKey: ['playlists'],
  //     refetchType: 'all'
  //   })
  // }


  const onSubmit = (data: SchemaUpdatePlaylistRequestPayload) => {
    mutate({...data, playlistId: playlistId!})
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
