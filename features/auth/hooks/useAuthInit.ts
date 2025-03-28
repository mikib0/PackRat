"use client"

import { useEffect } from "react"
import { useSetAtom } from "jotai"
import { tokenAtom, userAtom, isLoadingAtom } from "../atoms/authAtoms"
import * as SecureStore from "expo-secure-store"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { Platform } from "react-native"

export function useAuthInit() {
  const setToken = useSetAtom(tokenAtom)
  const setUser = useSetAtom(userAtom)
  const setIsLoading = useSetAtom(isLoadingAtom)

  // Initialize Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: Platform.OS === "ios" ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID : undefined,
      offlineAccess: false,
      hostedDomain: "",
      forceCodeForRefreshToken: true,
      accountName: "",
      scopes: ["profile", "email"],
    })
  }, [])

  // Check for existing session on app load
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true)
        const token = await SecureStore.getItemAsync("auth_token")
        if (token) {
          // Validate token and get user data
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData.user)
            await setToken(token)
          } else {
            // Token invalid, clear it
            await SecureStore.deleteItemAsync("auth_token")
            setToken(null)
          }
        }
      } catch (error) {
        console.error("Failed to load user session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [setIsLoading, setToken, setUser])
}

