import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axiosInstance from '~/lib/api/client';

export type SelectedImage = {
  uri: string;
  fileName: string;
  type: string;
};

export function useImageUpload() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pick image from gallery
  const pickImage = async (): Promise<void> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        throw new Error('Permission to access media library was denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri;

        // Extract file info
        const uriParts = uri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
        const type = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

        setSelectedImage({ uri, fileName, type });
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setError(err instanceof Error ? err.message : 'Failed to pick image');
    }
  };

  // Take photo with camera
  const takePhoto = async (): Promise<void> => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        throw new Error('Permission to access camera was denied');
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri;

        // Create file info
        const fileName = `camera_${Date.now()}.jpg`;
        const type = 'image/jpeg';

        setSelectedImage({ uri, fileName, type });
      }
    } catch (err) {
      console.error('Error taking photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to take photo');
    }
  };

  // Function to get a presigned URL for uploading
  const getPresignedUrl = async (
    fileName: string,
    contentType: string
  ): Promise<{ url: string; publicUrl: string; objectKey: string }> => {
    try {
      const response = await axiosInstance.get(
        `/api/upload/presigned?fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(contentType)}`
      );
      return {
        url: response.data.url,
        publicUrl: response.data.publicUrl,
        objectKey: response.data.objectKey,
      };
    } catch (err) {
      console.error('Error getting presigned URL:', err);
      throw new Error('Failed to get upload URL');
    }
  };

  // Function to delete an image from R2
  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
      // Extract the object key from the URL
      const objectKey = extractObjectKeyFromUrl(imageUrl);
      if (!objectKey) return false;

      // Call the delete API
      await axiosInstance.delete(`/api/upload/delete?objectKey=${encodeURIComponent(objectKey)}`);
      return true;
    } catch (err) {
      console.error('Error deleting image:', err);
      return false;
    }
  };

  // Helper function to extract object key from URL
  const extractObjectKeyFromUrl = (url: string): string | null => {
    if (!url) return null;

    const baseUrl = process.env.EXPO_PUBLIC_R2_PUBLIC_URL || '';

    // If the URL starts with our base URL, extract the object key
    if (url.startsWith(baseUrl)) {
      // Remove the base URL and the leading slash
      return url.substring(baseUrl.length + 1);
    }

    return null;
  };

  // Upload the selected image to R2
  const uploadSelectedImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;

    setIsUploading(true);
    setError(null);

    try {
      // Get presigned URL
      const { url: presignedUrl, publicUrl } = await getPresignedUrl(
        selectedImage.fileName,
        selectedImage.type
      );

      // Upload the image
      const uploadResult = await FileSystem.uploadAsync(presignedUrl, selectedImage.uri, {
        httpMethod: 'PUT',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          'Content-Type': selectedImage.type,
        },
      });

      if (uploadResult.status >= 300) {
        throw new Error(`Upload failed with status: ${uploadResult.status}`);
      }

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    selectedImage,
    pickImage,
    takePhoto,
    uploadSelectedImage,
    deleteImage,
    clearSelectedImage: () => setSelectedImage(null),
    isUploading,
    error,
  };
}
