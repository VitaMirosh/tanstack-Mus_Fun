import {Playlists} from '../widgets/playlists/ui/playlists.tsx';
import {useMeQuery} from '../features/auth/api/use-me-query.ts';
import {Navigate} from '@tanstack/react-router';
import {AddPlaylistForm} from '../features/playlists/add-playlists/ui/AddPlaylistForm.tsx';

export function MyPlaylistPage() {
const {data, isPending} = useMeQuery()

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
      <Playlists userId={data.userId}/>
    </>
  )
}



