import { ScrollView } from 'react-native';
import CreatePackForm from '~/components/initial/CreatePackForm';

export default function CreatePackScreen() {
  return (
    <ScrollView className="w-full bg-background">
      <CreatePackForm />
    </ScrollView>
  );
}
