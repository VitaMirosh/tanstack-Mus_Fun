import {Pagination} from '../../../shared/ui/pagination/pagination.tsx';
import {useState} from 'react';
import {DeletePlaylist} from '../../../features/playlists/deletePlaylist/ui/deletePlaylist.tsx';
import {usePlaylistQuery} from '../api/use-playlists-query.ts';

type Props = {
  userId?: string
  onPlaylistSelected?: (playlistId: string) => void
  onPlaylistDeleted?: (playlistId: string) => void
  isSearchActive?: boolean
}

export const Playlists = ({userId, onPlaylistSelected, isSearchActive, onPlaylistDeleted}: Props) => {
  const [pageNumber, setPageNumber] = useState(1)
  const [search, setSearch] = useState('')


  const query = usePlaylistQuery(userId, {search, pageNumber})

  const handleSelectPlaylistClick = (playlistId: string) => {
    onPlaylistSelected?.(playlistId);
  }
  const handleSelectPlaylist = (playlistId: string) => {
    onPlaylistDeleted?.(playlistId)
  }
  if (query.isPending) return <span> "🕥"</span>
  if (query.isError) return <span>Error: {JSON.stringify(query.error.message)}</span>

  return <div>
    {isSearchActive && <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."/>
    </div>}
    <Pagination pagesCount={query.data.meta.pagesCount} currentPage={pageNumber} onPageNumberChange={setPageNumber}
                isFetching={query.isFetching}/>
    <ul>
      {query.data.data.map(playlist => (
        <li key={playlist.id}>
        <span onClick={() => {handleSelectPlaylistClick(playlist.id)}}>{playlist.attributes.title} <DeletePlaylist playlistId={playlist.id} onDelete={handleSelectPlaylist}/></span>
        </li>
      ))}
    </ul>
  </div>
}