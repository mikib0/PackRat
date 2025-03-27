import { useAtomValue } from "jotai"
import { userAtom, isLoadingAtom, isAuthenticatedAtom } from "../atoms/authAtoms"

export function useAuthState() {
  const user = useAtomValue(userAtom)
  const isLoading = useAtomValue(isLoadingAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  return {
    user,
    isLoading,
    isAuthenticated,
  }
}

