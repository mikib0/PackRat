import { ErrorBoundary } from '~/components/initial/ErrorBoundary';
import { JotaiProvider } from './JotaiProvider';
import { TanstackProvider } from './TanstackProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <JotaiProvider>
        <TanstackProvider>{children}</TanstackProvider>
      </JotaiProvider>
    </ErrorBoundary>
  );
}
