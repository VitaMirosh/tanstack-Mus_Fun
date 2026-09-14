import {Playlists} from '../widgets/playlists/ui/playlists.tsx';
import {useMeQuery} from '../features/auth/api/use-me-query.ts';
import {Navigate} from '@tanstack/react-router';
import {AddPlaylistForm} from '../features/playlists/add-playlists/ui/AddPlaylistForm.tsx';
import {EditPlaylistForm} from '../features/playlists/edit-playlist/ui/edit-playlists-form.tsx';
import {useState} from 'react';

export function MyPlaylistPage() {
const {data, isPending} = useMeQuery()
  const [editPlaylistForm, setEditPlaylistForm] = useState<string | null>(null);

const handlePlaylistDeleted=(playlistId:string)=>{
  if(playlistId === editPlaylistForm){
    setEditPlaylistForm(null)
  }
}

  if (isPending) return (
    <div>Loading...</div>
  )

  if(!data) return <Navigate to ='/' replace/>
  return (
    <>
      <h2>My playlists</h2>
      <hr/>
      <AddPlaylistForm/>
      <hr/>
      <Playlists userId={data.userId} onPlaylistSelected={(playlistId)=>setEditPlaylistForm(playlistId)} onPlaylistDeleted={handlePlaylistDeleted}/>
      <hr/>
       <EditPlaylistForm  playlistId={editPlaylistForm }/>
    </>
  )
}



