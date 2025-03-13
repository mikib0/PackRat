'use client';

import { Icon } from '@roninoss/icons';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import type React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';
import { useCreateItem } from '~/hooks/usePackItems';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import type { WeightUnit } from '~/types';

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

// Validation message display
const FieldError = ({ field }: { field: any }) => (
  <>
    {field.state.meta.isTouched && field.state.meta.errors.length ? (
      <Text className="ml-1 mt-1 text-xs text-destructive">
        {field.state.meta.errors.map((err: any) => err.message).join(', ')}
      </Text>
    ) : null}
  </>
);

// Form label component
const FormLabel = ({
  children,
  required,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <Text className={cn('text-foreground/80 mb-2 ml-1 text-sm font-medium', className)}>
    {children}
    {required && <Text className="text-destructive"> *</Text>}
  </Text>
);

// Form field wrapper
const FormField = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <View className={cn('mb-6', className)}>{children}</View>;

const CreatePackItemForm = ({ packId, existingItem }: { packId: string; existingItem?: any }) => {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { mutateAsync: createItem, isPending } = useCreateItem();
  const isEditing = !!existingItem;

  const form = useForm({
    defaultValues: existingItem || {
      name: '',
      description: '',
      weight: 0,
      weightUnit: 'g',
      quantity: 1,
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
      console.log('Form Submitted:', value);
      await createItem(
        {
          ...value,
          packId,
          id: existingItem?.id,
        },
        {
          onSuccess: (item) => {
            console.log('Item Created/Updated:', item);
            router.back();
          },
          onError: (error) => {
            console.error('Error Creating/Updating Item:', error);
          },
        }
      );
    },
  });

  const handleAddImage = async () => {
    // In a real app, you would use expo-image-picker
    // This is just a placeholder
    form.setFieldValue('image', 'https://placehold.co/400x300/png');
  };

  const handleRemoveImage = () => {
    form.setFieldValue('image', null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <View className="flex-row items-center border-b border-border bg-background px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Icon name="chevron-left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-semibold text-foreground">
          {isEditing ? 'Edit Item' : 'Add New Item'}
        </Text>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <TouchableOpacity
              onPress={() => form.handleSubmit()}
              disabled={!canSubmit || isSubmitting}
              className={`rounded-lg px-4 py-1.5 ${!canSubmit || isSubmitting ? 'bg-primary/70' : 'bg-primary'}`}>
              <Text className="font-medium text-primary-foreground">
                {isSubmitting ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          )}
        </form.Subscribe>
      </View>

      <ScrollView className="flex-1 p-4">
        <form.Field name="name">
          {(field) => (
            <FormField>
              <FormLabel required>Name</FormLabel>
              <TextInput
                className="rounded-lg border border-input bg-background p-3 text-foreground"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                placeholder="Item name"
                placeholderTextColor="text-muted-foreground"
              />
              <FieldError field={field} />
            </FormField>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <FormField>
              <FormLabel>Description</FormLabel>
              <TextInput
                className="rounded-lg border border-input bg-background p-3 text-foreground"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                placeholder="Brief description"
                placeholderTextColor="text-muted-foreground"
                multiline
              />
            </FormField>
          )}
        </form.Field>

        <View className="mb-6 flex-row">
          <form.Field name="weight">
            {(field) => (
              <View className="mr-2 flex-1">
                <FormLabel required>Weight</FormLabel>
                <TextInput
                  className="rounded-lg border border-input bg-background p-3 text-foreground"
                  value={field.state.value.toString()}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                  placeholder="0.0"
                  placeholderTextColor="text-muted-foreground"
                  keyboardType="numeric"
                />
                <FieldError field={field} />
              </View>
            )}
          </form.Field>

          <form.Field name="weightUnit">
            {(field) => (
              <View className="w-24">
                <FormLabel>Unit</FormLabel>
                <View className="overflow-hidden rounded-lg border border-input bg-background">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {WEIGHT_UNITS.map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        className={`px-3 py-2 ${field.state.value === unit ? 'bg-primary' : 'bg-background'}`}
                        onPress={() => field.handleChange(unit)}>
                        <Text
                          className={
                            field.state.value === unit
                              ? 'text-primary-foreground'
                              : 'text-foreground'
                          }>
                          {unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          </form.Field>

          <form.Field name="quantity">
            {(field) => (
              <View className="ml-2 w-20">
                <FormLabel>Qty</FormLabel>
                <TextInput
                  className="rounded-lg border border-input bg-background p-3 text-foreground"
                  value={field.state.value.toString()}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                  placeholder="1"
                  placeholderTextColor="text-muted-foreground"
                  keyboardType="numeric"
                />
                <FieldError field={field} />
              </View>
            )}
          </form.Field>
        </View>

        <form.Field name="category">
          {(field) => (
            <FormField>
              <FormLabel>Category</FormLabel>
              <TextInput
                className="rounded-lg border border-input bg-background p-3 text-foreground"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                placeholder="e.g., Shelter, Cooking, Clothing"
                placeholderTextColor="text-muted-foreground"
              />
            </FormField>
          )}
        </form.Field>

        <FormField>
          <FormLabel>Properties</FormLabel>
          <View className="rounded-lg border border-input bg-background p-3">
            <form.Field name="consumable">
              {(field) => (
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-foreground">Consumable</Text>
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
              )}
            </form.Field>

            <form.Field name="worn">
              {(field) => (
                <View className="flex-row items-center justify-between">
                  <Text className="text-foreground">Worn (not carried)</Text>
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
              )}
            </form.Field>
          </View>
        </FormField>

        <form.Field name="image">
          {(field) => (
            <FormField>
              <FormLabel>Image</FormLabel>
              {field.state.value ? (
                <View className="relative">
                  <Image
                    source={{ uri: field.state.value }}
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
            </FormField>
          )}
        </form.Field>

        <form.Field name="notes">
          {(field) => (
            <FormField>
              <FormLabel>Notes</FormLabel>
              <TextInput
                className="h-24 rounded-lg border border-input bg-background p-3 text-foreground"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                placeholder="Additional notes about this item"
                placeholderTextColor="text-muted-foreground"
                multiline
                textAlignVertical="top"
              />
            </FormField>
          )}
        </form.Field>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreatePackItemForm;
