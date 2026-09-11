import {useDeleteMutation} from '../api/use-delete-mutation.ts';

type Props ={
  playlistId:string
}

export const DeletePlaylist = ({playlistId}:Props) => {
  const{mutate, isPending} = useDeleteMutation(playlistId)

  const handleDeleteClick=()=>{
    // передаем id явно — хук теперь принимает id в mutate, а не только через замыкание
    // это избегает бага stale closure и позволяет переиспользовать один хук
    mutate(playlistId)
  }
  return (
    <button
   onClick={handleDeleteClick} disabled={isPending} >delete</button>
  );
};

