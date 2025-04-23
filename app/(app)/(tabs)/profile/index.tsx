import { Stack, useRouter } from 'expo-router';
import { Platform, View } from 'react-native';

import { Avatar, AvatarFallback } from '~/components/nativewindui/Avatar';
import { Button } from '~/components/nativewindui/Button';
import {
  ESTIMATED_ITEM_HEIGHT,
  List,
  ListItem,
  type ListRenderItemInfo,
  ListSectionHeader,
} from '~/components/nativewindui/List';
import { Text } from '~/components/nativewindui/Text';
import { useAuthActions } from '~/features/auth/hooks/useAuthActions';
import { cn } from '~/lib/cn';
import { userAtom } from '~/features/auth/atoms/authAtoms';
import { useAtomValue } from 'jotai';
import { useAuth } from '~/features/auth/hooks/useAuth';
import { useUser } from '~/features/profile/hooks/useUser';
import { Icon } from '@roninoss/icons';

const SCREEN_OPTIONS = {
  title: 'Profile',
  headerShown: false,
} as const;

const ESTIMATED_ITEM_SIZE =
  ESTIMATED_ITEM_HEIGHT[Platform.OS === 'ios' ? 'titleOnly' : 'withSubTitle'];

export default function Profile() {
  const user = useUser();

  // Generate display data based on user information
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email?.split('@')[0] || 'User';

  const email = user?.email || '';

  // Create data array with user information
  const DATA: DataItem[] = [
    ...(Platform.OS !== 'ios' ? ['Account Information'] : []),
    {
      id: 'name',
      title: 'Name',
      ...(Platform.OS === 'ios' ? { value: displayName } : { subTitle: displayName }),
    },
    {
      id: 'email',
      title: 'Email',
      ...(Platform.OS === 'ios' ? { value: email } : { subTitle: email }),
    },
  ];

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />

      {user ? (
        <List
          variant="insets"
          data={DATA}
          sectionHeaderAsGap={Platform.OS === 'ios'}
          estimatedItemSize={ESTIMATED_ITEM_SIZE}
          renderItem={renderItem}
          ListHeaderComponent={<ListHeaderComponent />}
          ListFooterComponent={<ListFooterComponent />}
        />
      ) : (
        <SignupCTA />
      )}
    </>
  );
}

function renderItem(info: ListRenderItemInfo<DataItem>) {
  return <Item info={info} />;
}

function Item({ info }: { info: ListRenderItemInfo<DataItem> }) {
  if (typeof info.item === 'string') {
    return <ListSectionHeader {...info} />;
  }
  return (
    <ListItem
      titleClassName="text-lg"
      rightView={
        <View className="flex-1 flex-row items-center gap-0.5 px-2">
          {!!info.item.value && <Text className="text-muted-foreground">{info.item.value}</Text>}
        </View>
      }
      {...info}
    />
  );
}

function ListHeaderComponent() {
  const user = useUser();
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user?.email?.substring(0, 2).toUpperCase() || 'U';

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email?.split('@')[0] || 'User';

  const username = user?.email || '';

  return (
    <View className="ios:pb-8 items-center pb-4 pt-8">
      <Avatar alt={`${displayName}'s Profile`} className="h-24 w-24">
        <AvatarFallback>
          <Text
            variant="largeTitle"
            className={cn(
              'font-medium text-white dark:text-background',
              Platform.OS === 'ios' && 'dark:text-foreground'
            )}>
            {initials}
          </Text>
        </AvatarFallback>
      </Avatar>
      <View className="p-1" />
      <Text variant="title1">{displayName}</Text>
      <Text className="text-muted-foreground">{username}</Text>
    </View>
  );
}

function ListFooterComponent() {
  const { isAuthenticated } = useAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  return (
    <View className="ios:px-0 px-4 pt-8">
      {isAuthenticated ? (
        <Button
          onPress={signOut}
          size="lg"
          variant={Platform.select({ ios: 'primary', default: 'secondary' })}
          className="border-border bg-card">
          <Text className="text-destructive">Log Out</Text>
        </Button>
      ) : (
        <Button
          onPress={() => router.push('/auth')}
          size="lg"
          variant="secondary"
          className="border-border bg-card">
          <Text>Sign in</Text>
        </Button>
      )}
    </View>
  );
}

function SignupCTA() {
  const router = useRouter();

  return (
    <View className="flex-1 px-6 py-8">
      <View className="mb-8 items-center">
        <View className="bg-primary/10 mb-4 h-24 w-24 items-center justify-center rounded-full">
          <Icon name="account-circle-outline" size={48} color="primary" />
        </View>
        <Text variant="title1" className="mb-2 text-center">
          Create Your Account
        </Text>
        <Text className="mb-6 text-center text-muted-foreground">
          Join PackRat to unlock all features
        </Text>
      </View>

      <View className="mb-10 flex-col gap-6">
        <FeatureItem
          icon="cloud-outline"
          title="Sync Across Devices"
          description="Keep your packs in sync everywhere"
        />
        <FeatureItem
          icon="weather-sunny"
          title="Weather Integration"
          description="Get weather-based recommendations"
        />
        <FeatureItem
          icon="message-outline"
          title="AI Chat & Suggestions"
          description="Smart packing assistance"
        />
        <FeatureItem
          icon="archive-outline"
          title="Share Your Packs"
          description="Share and browse public packs"
        />
      </View>

      <Button
        onPress={() => router.push('/auth')}
        size="lg"
        variant="primary"
        className="mb-4 w-full">
        <Text className="font-medium">Sign In</Text>
      </Button>
    </View>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-center">
      <View className="bg-primary/10 mr-4 h-10 w-10 items-center justify-center rounded-full">
        <Icon name={icon} size={20} color="primary" />
      </View>
      <View className="flex-1">
        <Text variant="title3" className="mb-0.5">
          {title}
        </Text>
        <Text className="text-muted-foreground">{description}</Text>
      </View>
    </View>
  );
}

type DataItem =
  | string
  | {
      id: string;
      title: string;
      value?: string;
      subTitle?: string;
      onPress?: () => void;
    };
