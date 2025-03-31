import { Stack } from 'expo-router';
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

const SCREEN_OPTIONS = {
  title: 'Profile',
  headerShown: false,
} as const;

const ESTIMATED_ITEM_SIZE =
  ESTIMATED_ITEM_HEIGHT[Platform.OS === 'ios' ? 'titleOnly' : 'withSubTitle'];

export default function Profile() {
  const user = useAtomValue(userAtom);

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
      <List
        variant="insets"
        data={DATA}
        sectionHeaderAsGap={Platform.OS === 'ios'}
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        renderItem={renderItem}
        ListHeaderComponent={<ListHeaderComponent />}
        ListFooterComponent={<ListFooterComponent />}
      />
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
  const user = useAtomValue(userAtom);
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
  const { signOut } = useAuthActions();
  return (
    <View className="ios:px-0 px-4 pt-8">
      <Button
        onPress={signOut}
        size="lg"
        variant={Platform.select({ ios: 'primary', default: 'secondary' })}
        className="border-border bg-card">
        <Text className="text-destructive">Log Out</Text>
      </Button>
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
