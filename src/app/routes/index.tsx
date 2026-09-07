import { createFileRoute } from '@tanstack/react-router'
import {PlaylistPage} from '../../pages/playlistPage.tsx';




export const Route = createFileRoute('/')({
  component: PlaylistPage,
})
