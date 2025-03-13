import { router } from 'expo-router';
import React, { ErrorInfo } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Pressable, Text, View } from 'react-native';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
  onError?: (error: Error, info: { componentStack: string }) => void;
};

const DefaultFallback = ({ resetErrorBoundary }: { resetErrorBoundary: () => void }) => {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <View className="w-full max-w-md rounded-lg bg-red-50 p-6">
        <Text className="mb-2 text-lg font-semibold text-red-800">Something went wrong</Text>
        <Text className="mb-4 text-red-700">
          The application encountered an unexpected error. You can try again or go back to the home
          screen.
        </Text>
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.replace('/')}
            className="flex-1 items-center rounded-md bg-red-100 py-3">
            <Text className="font-medium text-red-800">Go Home</Text>
          </Pressable>
          <Pressable
            onPress={resetErrorBoundary}
            className="flex-1 items-center rounded-md bg-red-600 py-3">
            <Text className="font-medium text-white">Try Again</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export function ErrorBoundary({ children, fallback, onReset, onError }: ErrorBoundaryProps) {
  const handleError = (error: Error, info: { componentStack: string }) => {
    // Log the error to your preferred logging service
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', info.componentStack);

    // Call the custom error handler if provided
    if (onError) {
      onError(error, info);
    }
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : DefaultFallback}
      onReset={onReset}
      onError={(error: Error, info: ErrorInfo) =>
        handleError(error, { componentStack: info.componentStack || '' })
      }>
      {children}
    </ReactErrorBoundary>
  );
}
