import {useLogoutMutation} from '../api/use-logout-mutation.ts';


export const LogoutButton = () => {

  const mutation = useLogoutMutation()

  const handleLogoutClick = () => {
   mutation.mutate()
  }


  return <button onClick={handleLogoutClick}>Logout </button>
}