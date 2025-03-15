import { CreatePackItemForm } from '~/screens/CreatePackItemForm';
import { NotFoundScreen } from './NotFoundScreen';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { useLocalSearchParams } from 'expo-router';
import { usePackItem } from '~/hooks/usePackItems';

export function EditPackItemScreen() {
  const { id, packId } = useLocalSearchParams();
  const effectiveItemId = Array.isArray(id) ? id[0] : id;
  const effectivePackId = Array.isArray(packId) ? packId[0] : packId;

  const { data: item, isLoading } = usePackItem(effectiveItemId, effectivePackId);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!item) {
    return (
      <NotFoundScreen
        title="Pack not found"
        message="The pack you're looking for doesn't exist or has been moved."
        backButtonLabel="Go Back"
      />
    );
  }

  return <CreatePackItemForm packId={effectivePackId} existingItem={item} />;
}
