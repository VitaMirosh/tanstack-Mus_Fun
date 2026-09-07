import { createFileRoute } from '@tanstack/react-router'
import {OathCallbackPage} from '../../../pages/auth/oath-callback-page.tsx';




export const Route = createFileRoute('/oauth/callback')({
  component:OathCallbackPage,
})
