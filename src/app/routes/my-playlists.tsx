import { createFileRoute } from '@tanstack/react-router'
import {MyPlaylistPage} from '../../pages/my-playlist-page.tsx';



export const Route = createFileRoute('/my-playlists')({
  component:MyPlaylistPage,
})


