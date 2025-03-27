import { useSetAtom } from 'jotai';
import { router } from 'expo-router';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';
import {
  tokenAtom,
  userAtom,
  isLoadingAtom,
  showLinkingModalAtom,
  linkingDataAtom,
} from '../atoms/authAtoms';

export function useAuthActions() {
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setShowLinkingModal = useSetAtom(showLinkingModalAtom);
  const setLinkingData = useSetAtom(linkingDataAtom);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      await setToken(data.token);
      setUser(data.user);
      router.replace('/(app)');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);

      // Check if user is already signed in to Google
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();

      // Get the ID token
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      // Send the token to your backend
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (response.status === 409) {
        // Account linking needed
        setLinkingData({
          provider: 'google',
          email: data.email,
          token: idToken,
        });
        setShowLinkingModal(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in with Google');
      }

      await setToken(data.token);
      setUser(data.user);
      router.replace('/(app)');
    } catch (error: any) {
      setIsLoading(false);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.error('Google sign in error:', error);
      }

      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      setIsLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Send the identity token to your backend
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/apple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identityToken: credential.identityToken,
          authorizationCode: credential.authorizationCode,
        }),
      });

      const data = await response.json();

      if (response.status === 409) {
        // Account linking needed
        setLinkingData({
          provider: 'apple',
          email: data.email,
          token: credential.identityToken!,
        });
        setShowLinkingModal(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in with Apple');
      }

      await setToken(data.token);
      setUser(data.user);
      router.replace('/(app)');
    } catch (error) {
      console.error('Apple sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Sign out from Google if signed in
      const isSignedIn = GoogleSignin.hasPreviousSignIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }

      const token = await GoogleSignin.getTokens()
        .then((tokens) => tokens.idToken)
        .catch(() => null);
      if (token) {
        await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await setToken(null);
      setUser(null);
      router.replace('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify email');
      }

      // If verification is successful, set the user and token
      if (data.token && data.user) {
        await setToken(data.token);
        setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/resend-verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email');
      }

      return data;
    } catch (error) {
      console.error('Resend verification email error:', error);
      throw error;
    }
  };

  const linkAccount = async (provider: string, token: string) => {
    try {
      const currentToken = await SecureStore.getItemAsync('auth_token');
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/link-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ provider, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to link account');
      }

      return data;
    } catch (error) {
      console.error('Account linking error:', error);
      throw error;
    }
  };

  return {
    signIn,
    signInWithGoogle,
    signInWithApple,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    linkAccount,
  };
}
