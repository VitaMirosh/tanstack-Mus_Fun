import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {client} from '../../../shared/api/client.ts';
import {Pagination} from '../../../shared/ui/pagination/pagination.tsx';
import {useState} from 'react';
import {DeletePlaylist} from '../../../features/playlists/deletePlaylist/ui/deletePlaylist.tsx';
import {playlistsKeys} from '../../../shared/api/keys-factories/playlists-keys-factory.ts';

type Props = {
  userId?: string
  onPlaylistSelected?: (playlistId: string) => void
  isSearchActive?: boolean
}

export const Playlists = ({userId, onPlaylistSelected, isSearchActive}: Props) => {
  const [pageNumber, setPageNumber] = useState(1)
  const [search, setSearch] = useState('')

  const key = userId ? playlistsKeys.myList() : playlistsKeys.list({search,pageNumber})

  const queryParams = userId ? {userId} : {
    pageNumber: pageNumber,
    search,
    userId,
  }

  const query = useQuery({
    queryKey: key,
    queryFn: async ({signal}) => {
      const response = await client.GET('/playlists', {
        params: {
          query: queryParams
        },
        signal
      });
      if (response.error) {
        throw (response as unknown as { error: Error }).error;
      }
      return response.data;
    },
    placeholderData: keepPreviousData
  })
  console.log('status:' + query.status);
  console.log('fetchStatus:' + query.fetchStatus)

  const handleSelectePlaylistClick = (playlistId: string) => {
    onPlaylistSelected?.(playlistId);
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
        <li key={playlist.id} onClick={() => {
          handleSelectePlaylistClick(playlist.id)
        }}>
          {playlist.attributes.title} <DeletePlaylist playlistId={playlist.id}/>
        </li>
      ))}
    </ul>
  </div>
}