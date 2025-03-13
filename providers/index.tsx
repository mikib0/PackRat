import { JotaiProvider } from './JotaiProvider';
import { TanstackProvider } from './TanstackProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <TanstackProvider>{children}</TanstackProvider>
    </JotaiProvider>
  );
}
