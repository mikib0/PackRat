import type React from 'react';
import { useState, useEffect } from 'react';
import { Image, type ImageProps, ActivityIndicator, View, StyleSheet } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import ImageCacheManager from '~/lib/utils/ImageCacheManager';

interface CachedImageProps extends Omit<ImageProps, 'source'> {
  fileName?: string;
  placeholderColor?: string;
}

export const CachedImage: React.FC<CachedImageProps> = ({
  fileName,
  className,
  placeholderColor = '#e1e1e1',
  ...props
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const remoteUrl = `${process.env.EXPO_PUBLIC_R2_PUBLIC_URL}/${fileName}`;

  useEffect(() => {
    if (!fileName) return;
    const loadImage = async () => {
      try {
        setLoading(true);

        const localUri = await ImageCacheManager.getCachedImageUri(fileName);
        if (localUri) {
          setImageUri(localUri);
        } else {
          const localUri = await ImageCacheManager.cacheRemoteImage(fileName, remoteUrl);
          setImageUri(localUri);
        }
      } catch (error) {
        console.error('Error loading image:', error);
        // Fallback to remote URL on error
        setImageUri(remoteUrl);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [fileName, remoteUrl]);

  if (!fileName)
    return (
      <View className={`items-center justify-center bg-muted px-2 ${className}`}>
        <Text className="text-muted-foreground">No image</Text>
      </View>
    );

  if (loading) {
    return (
      <View
        className={`items-center justify-center bg-muted px-2 ${className}`}
        style={[{ backgroundColor: placeholderColor }]}>
        <ActivityIndicator size="small" color="#999" />
      </View>
    );
  }

  return <Image source={{ uri: imageUri || remoteUrl }} {...props} className={className} />;
};
