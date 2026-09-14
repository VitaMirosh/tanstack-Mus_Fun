import {useDeleteMutation} from '../api/use-delete-mutation.ts';

type Props ={
  playlistId:string
  onDelete:(playlistId:string)=>void
}

export const DeletePlaylist = ({playlistId,onDelete}:Props) => {
  const{mutate, isPending} = useDeleteMutation(playlistId)

  const handleDeleteClick=()=>{
    // передаем id явно — хук теперь принимает id в mutate, а не только через замыкание
    // это избегает бага stale closure и позволяет переиспользовать один хук
    mutate(playlistId)
    onDelete?.(playlistId)
  }
  return (
    <button
   onClick={handleDeleteClick} disabled={isPending} >delete</button>
  );
};

