import { PortalHost } from '@rn-primitives/portal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ErrorBoundary } from '~/components/initial/ErrorBoundary';
import '~/utils/polyfills';
import { JotaiProvider } from './JotaiProvider';
import { TanstackProvider } from './TanstackProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <JotaiProvider>
        <TanstackProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              {children}
              <PortalHost />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </TanstackProvider>
      </JotaiProvider>
    </ErrorBoundary>
  );
}
