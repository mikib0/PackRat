import { useLocalSearchParams } from 'expo-router';
import { PackForm } from '~/components/initial/PackForm';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { usePackDetails } from '~/hooks/usePacks';
import { NotFoundScreen } from './NotFoundScreen';

export function EditPackScreen() {
  const { id } = useLocalSearchParams();
  const effectiveId = Array.isArray(id) ? id[0] : id;

  const { data: pack, isLoading } = usePackDetails(effectiveId);

  console.log('pack', pack, isLoading, id);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!pack) {
    return (
      <NotFoundScreen
        title="Pack not found"
        message="The pack you're looking for doesn't exist or has been moved."
        backButtonLabel="Go Back"
      />
    );
  }

  return <PackForm pack={pack} />;
}
