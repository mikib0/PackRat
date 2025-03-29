import { useLocalSearchParams } from 'expo-router';
import { PackForm } from '~/features/packs/components/PackForm';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { NotFoundScreen } from '../../../screens/NotFoundScreen';
import { usePackDetails } from '~/features/packs';

export function EditPackScreen() {
  const { id } = useLocalSearchParams();
  const effectiveId = Array.isArray(id) ? id[0] : id;

  const { data: pack, isLoading } = usePackDetails(effectiveId);

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
