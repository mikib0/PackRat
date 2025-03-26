'use client';

import { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon } from '@roninoss/icons';

type AccountLinkingModalProps = {
  isVisible: boolean;
  onClose: () => void;
  provider: 'google' | 'apple';
  email: string;
  providerToken: string;
  onLinkAccount: () => Promise<void>;
};

export function AccountLinkingModal({
  isVisible,
  onClose,
  provider,
  email,
  providerToken,
  onLinkAccount,
}: AccountLinkingModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkAccount = async () => {
    try {
      setIsLoading(true);
      await onLinkAccount();
    } catch (error) {
      console.error('Account linking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const providerName = provider === 'google' ? 'Google' : 'Apple';
  const providerIcon = provider === 'google' ? 'google' : 'apple';
  const providerColor = provider === 'google' ? '#4285F4' : '#000';

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50 p-6">
        <View className="w-full max-w-md rounded-xl bg-white p-6">
          <View className="mb-4 items-center">
            <View className="mb-4 rounded-full bg-gray-100 p-4">
              <Icon name={providerIcon} size={32} color={providerColor} />
            </View>
            <Text className="text-center text-xl font-bold">Link Your Account</Text>
          </View>

          <Text className="mb-6 text-center text-gray-600">
            We found an existing account with the email <Text className="font-medium">{email}</Text>
            . Would you like to link your {providerName} account to it?
          </Text>

          <View className="space-y-3">
            <TouchableOpacity
              className="w-full items-center rounded-lg bg-blue-500 py-3"
              onPress={handleLinkAccount}
              disabled={isLoading}
              activeOpacity={0.8}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-medium text-white">Link Accounts</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full items-center rounded-lg py-3"
              onPress={onClose}
              disabled={isLoading}
              activeOpacity={0.8}>
              <Text className="text-gray-700">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
