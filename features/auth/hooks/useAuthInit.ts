"use client"

import { useEffect } from "react"
import { useSetAtom } from "jotai"
import { tokenAtom, refreshTokenAtom, userAtom, isLoadingAtom } from '../atoms/authAtoms';
import * as SecureStore from "expo-secure-store"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { Platform } from "react-native"
import axios from 'axios';

export function useAuthInit() {
  const setToken = useSetAtom(tokenAtom)
  const setRefreshToken = useSetAtom(refreshTokenAtom);
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
        setIsLoading(true);

        // Get stored tokens
        const accessToken = await SecureStore.getItemAsync('access_token');
        const refreshToken = await SecureStore.getItemAsync('refresh_token');

        if (accessToken) {
          try {
            // Try to validate the access token
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/me`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (response.ok) {
              // Access token is valid
              const userData = await response.json();
              setUser(userData.user);
              setToken(accessToken);
              setRefreshToken(refreshToken);
            } else if (response.status === 401 && refreshToken) {
              // Access token expired, try to refresh
              try {
                const refreshResponse = await axios.post(
                  `${process.env.EXPO_PUBLIC_API_URL}/api/auth/refresh`,
                  {
                    refreshToken,
                  }
                );

                if (refreshResponse.data.success) {
                  // Store new tokens
                  const newAccessToken = refreshResponse.data.accessToken;
                  const newRefreshToken = refreshResponse.data.refreshToken;

                  await SecureStore.setItemAsync('access_token', newAccessToken);
                  await SecureStore.setItemAsync('refresh_token', newRefreshToken);

                  setToken(newAccessToken);
                  setRefreshToken(newRefreshToken);
                  setUser(refreshResponse.data.user);
                } else {
                  // Refresh failed, clear tokens
                  await SecureStore.deleteItemAsync('access_token');
                  await SecureStore.deleteItemAsync('refresh_token');
                  setToken(null);
                  setRefreshToken(null);
                }
              } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Clear tokens on refresh error
                await SecureStore.deleteItemAsync('access_token');
                await SecureStore.deleteItemAsync('refresh_token');
                setToken(null);
                setRefreshToken(null);
              }
            } else {
              // Token invalid and no refresh token, clear it
              await SecureStore.deleteItemAsync('access_token');
              await SecureStore.deleteItemAsync('refresh_token');
              setToken(null);
              setRefreshToken(null);
            }
          } catch (error) {
            console.error('Error validating token:', error);
            // Clear tokens on error
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('refresh_token');
            setToken(null);
            setRefreshToken(null);
          }
        }
      } catch (error) {
        console.error('Failed to load user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [setIsLoading, setToken, setRefreshToken, setUser]);
}

