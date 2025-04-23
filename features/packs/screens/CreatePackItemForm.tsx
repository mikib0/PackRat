'use client';

import { Icon } from '@roninoss/icons';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { z } from 'zod';
import { Form, FormItem, FormSection } from '~/components/nativewindui/Form';
import { SegmentedControl } from '~/components/nativewindui/SegmentedControl';
import { TextField } from '~/components/nativewindui/TextField';
import { useCreatePackItem, useUpdatePackItem } from '../hooks';
import { useImageUpload } from '../hooks/useImageUpload';
import { useColorScheme } from '~/lib/useColorScheme';
import type { WeightUnit } from '~/types';
import { useState, useRef, useEffect } from 'react';

// Define Zod schema
const itemFormSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string(),
  weight: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number().min(0, 'Weight must be a positive number')
  ),
  weightUnit: z.enum(['g', 'oz', 'kg', 'lb']),
  quantity: z.preprocess(
    (val) => (val === '' ? 1 : Number(val)),
    z.number().int().min(1, 'Quantity must be at least 1')
  ),
  category: z.string(),
  consumable: z.boolean(),
  worn: z.boolean(),
  notes: z.string(),
  image: z.string().nullable(),
});

// Type inference
type ItemFormValues = z.infer<typeof itemFormSchema>;

// Weight units
const WEIGHT_UNITS: WeightUnit[] = ['g', 'oz', 'kg', 'lb'];

export const CreatePackItemForm = ({
  packId,
  existingItem,
}: {
  packId: string;
  existingItem?: any;
}) => {
  const router = useRouter();
  const { colorScheme, colors } = useColorScheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const createPackItem = useCreatePackItem();
  const updatePackItem = useUpdatePackItem();
  const {
    selectedImage,
    pickImage,
    takePhoto,
    uploadSelectedImage,
    deleteImage,
    clearSelectedImage,
    isUploading,
    error,
  } = useImageUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep track of the initial image URL for comparison during updates
  const initialImageUrl = useRef(existingItem?.image || null);
  const isEditing = !!existingItem;

  // Track if the image has been changed
  const [imageChanged, setImageChanged] = useState(false);

  const form = useForm({
    defaultValues: existingItem || {
      name: '',
      description: '',
      weight: 0,
      weightUnit: 'g',
      quantity: '',
      category: '',
      consumable: false,
      worn: false,
      notes: '',
      image: null,
    },
    validators: {
      onChange: itemFormSchema,
    },
    onSubmit: async ({ value }) => {
      // Don't handle submission here - we'll use our custom submit handler
    },
  });

  // Custom submit handler to handle image upload
  const handleSubmit = async () => {
    if (!form.state.canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // First upload the image if one is selected
      let imageUrl = form.getFieldValue('image');
      const oldImageUrl = initialImageUrl.current;

      // Upload the new image if one is selected
      if (selectedImage) {
        imageUrl = await uploadSelectedImage();
        if (!imageUrl) {
          Alert.alert('Error', 'Failed to upload image. Please try again.');
          setIsSubmitting(false);
          return;
        }
        form.setFieldValue('image', imageUrl);
      }

      // Get the form values with the updated image URL
      const formData = form.state.values;

      // Submit the form with the image URL
      if (isEditing) {
        updatePackItem({ id: existingItem.id, ...formData });
        router.back();
      } else {
        createPackItem({ packId, itemData: formData });
        router.back();
      }

      // Check if we need to delete the old image
      if (isEditing && oldImageUrl && imageChanged) {
        // Delete the old image in the background
        deleteImage(oldImageUrl).catch((err) => {
          console.error('Failed to delete old image:', err);
          // Non-blocking error - the user doesn't need to know about this
        });
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImage = async () => {
    const options = ['Take Photo', 'Choose from Library', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        containerStyle: {
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
        },
        textStyle: {
          color: colors.foreground,
        },
      },
      async (selectedIndex) => {
        try {
          switch (selectedIndex) {
            case 0: // Take Photo
              await takePhoto();
              setImageChanged(true);
              break;
            case 1: // Choose from Library
              await pickImage();
              setImageChanged(true);
              break;
            case cancelButtonIndex:
              // Canceled
              return;
          }
        } catch (err) {
          console.error('Error handling image:', err);
          Alert.alert('Error', 'Failed to process image. Please try again.');
        }
      }
    );
  };

  const handleRemoveImage = () => {
    // If we have a selected image (not yet uploaded), clear it
    if (selectedImage) {
      clearSelectedImage();
    }

    // If we have an existing image URL in the form, clear it
    if (form.getFieldValue('image')) {
      form.setFieldValue('image', null);
      setImageChanged(true);
    }
  };

  useEffect(() => {
    // Show error alert if there's an error
    if (error) {
      Alert.alert('Image Error', error);
    }
  }, [error]);

  // Determine what image to show in the UI
  const displayImage = selectedImage
    ? { uri: selectedImage.uri }
    : form.getFieldValue('image')
      ? { uri: form.getFieldValue('image') }
      : null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <ScrollView contentContainerClassName="p-8">
        <Form>
          <FormSection
            ios={{ title: 'Item Details' }}
            footnote="Enter the basic information about your item">
            <form.Field name="name">
              {(field) => (
                <FormItem>
                  <TextField
                    placeholder="Item Name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                    errorMessage={field.state.meta.errors.map((err: any) => err.message).join(', ')}
                    leftView={
                      <View className="ios:pl-2 justify-center pl-2">
                        <Icon name="backpack" size={16} color={colors.grey3} />
                      </View>
                    }
                  />
                </FormItem>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <FormItem>
                  <TextField
                    placeholder="Description"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    leftView={
                      <View className="ios:pl-2 justify-center pl-2">
                        <Icon name="information" size={16} color={colors.grey3} />
                      </View>
                    }
                  />
                </FormItem>
              )}
            </form.Field>

            <form.Field name="category">
              {(field) => (
                <FormItem>
                  <TextField
                    placeholder="Category (e.g., Shelter, Cooking)"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                    leftView={
                      <View className="ios:pl-2 justify-center pl-2">
                        <Icon name="tag" size={16} color={colors.grey3} />
                      </View>
                    }
                  />
                </FormItem>
              )}
            </form.Field>
          </FormSection>

          <FormSection ios={{ title: 'Weight & Quantity' }} footnote="Specify the weight details">
            <form.Field name="weight">
              {(field) => (
                <FormItem>
                  <TextField
                    placeholder="Weight"
                    value={field.state.value.toString()}
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                    keyboardType="numeric"
                    errorMessage={field.state.meta.errors.map((err: any) => err.message).join(', ')}
                    leftView={
                      <View className="ios:pl-2 justify-center pl-2">
                        <Icon name="dumbbell" size={16} color={colors.grey3} />
                      </View>
                    }
                  />
                </FormItem>
              )}
            </form.Field>

            <form.Field name="weightUnit">
              {(field) => (
                <FormItem>
                  <View className="px-2 py-2">
                    <Text className="text-foreground/70 mb-2 text-sm">Unit</Text>
                    <SegmentedControl
                      values={WEIGHT_UNITS}
                      selectedIndex={WEIGHT_UNITS.indexOf(field.state.value)}
                      onIndexChange={(index) => {
                        field.handleChange(WEIGHT_UNITS[index]);
                      }}
                    />
                  </View>
                </FormItem>
              )}
            </form.Field>

            <form.Field name="quantity">
              {(field) => (
                <FormItem>
                  <TextField
                    placeholder="Quantity"
                    value={field.state.value?.toString()}
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                    keyboardType="numeric"
                    errorMessage={field.state.meta.errors.map((err: any) => err.message).join(', ')}
                    leftView={
                      <View className="ios:pl-2 justify-center pl-2">
                        <Icon name="circle-outline" size={16} color={colors.grey3} />
                      </View>
                    }
                  />
                </FormItem>
              )}
            </form.Field>
          </FormSection>

          <FormSection ios={{ title: 'Properties' }} footnote="Special item properties">
            <form.Field name="consumable">
              {(field) => (
                <FormItem>
                  <View className="flex-row items-center justify-between p-4">
                    <View className="flex-row items-center">
                      <Icon name="silverware-fork-knife" size={18} color={colors.foreground} />
                      <Text className="ml-2 font-medium text-foreground">Consumable</Text>
                    </View>
                    <Switch
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      trackColor={{
                        false: 'hsl(var(--muted))',
                        true: 'hsl(var(--primary))',
                      }}
                      ios_backgroundColor="hsl(var(--muted))"
                    />
                  </View>
                </FormItem>
              )}
            </form.Field>

            <form.Field name="worn">
              {(field) => (
                <FormItem>
                  <View className="flex-row items-center justify-between p-4">
                    <View className="flex-row items-center">
                      <Icon name="account-circle" size={18} color={colors.foreground} />
                      <Text className="ml-2 font-medium text-foreground">Worn (not carried)</Text>
                    </View>
                    <Switch
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      trackColor={{
                        false: 'hsl(var(--muted))',
                        true: 'hsl(var(--primary))',
                      }}
                      ios_backgroundColor="hsl(var(--muted))"
                    />
                  </View>
                </FormItem>
              )}
            </form.Field>
          </FormSection>

          <FormSection ios={{ title: 'Image' }} footnote="Add an image of your item (optional)">
            <form.Field name="image">
              {(field) => (
                <FormItem>
                  {isUploading ? (
                    <View className="h-48 items-center justify-center rounded-lg border border-dashed border-input bg-background p-4">
                      <ActivityIndicator size="large" color={colors.primary} />
                      <Text className="mt-2 text-muted-foreground">Uploading image...</Text>
                    </View>
                  ) : displayImage ? (
                    <View className="relative">
                      <Image
                        source={displayImage}
                        className="h-48 w-full rounded-lg"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        className="absolute right-2 top-2 rounded-full bg-black bg-opacity-50 p-1"
                        onPress={handleRemoveImage}>
                        <Icon name="close" size={20} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="h-48 items-center justify-center rounded-lg border border-dashed border-input bg-background p-4"
                      onPress={handleAddImage}>
                      <Icon name="camera" size={32} color={colors.foreground} />
                      <Text className="mt-2 text-muted-foreground">Tap to add an image</Text>
                    </TouchableOpacity>
                  )}
                </FormItem>
              )}
            </form.Field>
          </FormSection>

          <FormSection ios={{ title: 'Notes' }} footnote="Additional information">
            <form.Field name="notes">
              {(field) => (
                <FormItem>
                  <TextField
                    placeholder="Additional notes about this item"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    leftView={
                      <View className="ios:pl-2 justify-center pl-2">
                        <Icon name="note-text-outline" size={16} color={colors.grey3} />
                      </View>
                    }
                  />
                </FormItem>
              )}
            </form.Field>
          </FormSection>
        </Form>

        <form.Subscribe selector={(state) => [state.canSubmit]}>
          {([canSubmit]) => (
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit || isSubmitting || isUploading}
              className={`mt-6 rounded-lg px-4 py-3.5 ${
                !canSubmit || isSubmitting || isUploading ? 'bg-primary/70' : 'bg-primary'
              }`}>
              <Text className="text-center text-base font-semibold text-primary-foreground">
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Item' : 'Add Item'}
              </Text>
            </Pressable>
          )}
        </form.Subscribe>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
