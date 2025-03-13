'use client';

import { Icon } from '@roninoss/icons';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import type React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { z } from 'zod';
import { useCreatePack } from '~/hooks/usePacks';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';

// Define Zod schema
const packFormSchema = z.object({
  name: z.string().min(1, 'Pack name is required'),
  description: z.string(),
  category: z.enum([
    'hiking',
    'backpacking',
    'camping',
    'climbing',
    'winter',
    'desert',
    'custom',
    'water sports',
    'skiing',
  ]),
  isPublic: z.boolean(),
  tags: z.array(z.string()),
});

// Type inference
type PackFormValues = z.infer<typeof packFormSchema>;

// Categories with icons and labels
const CATEGORIES = [
  { value: 'hiking', label: 'Hiking' },
  { value: 'backpacking', label: 'Backpacking' },
  { value: 'camping', label: 'Camping' },
  { value: 'climbing', label: 'Climbing' },
  { value: 'winter', label: 'Winter' },
  { value: 'desert', label: 'Desert' },
  { value: 'custom', label: 'Custom' },
  { value: 'water sports', label: 'Water Sports' },
  { value: 'skiing', label: 'Skiing' },
];

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

const CreatePackForm = () => {
  const router = useRouter();
  const { colors } = useColorScheme();
  const { mutateAsync: createPack, isPending } = useCreatePack();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: 'hiking',
      isPublic: false,
      tags: ['hiking'],
    },
    validators: {
      onChange: packFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Form Submitted:', value);
      await createPack(
        {
          ...value,
          userId: 'default',
          items: [],
          baseWeight: 0,
          category: value.category as
            | 'hiking'
            | 'backpacking'
            | 'camping'
            | 'climbing'
            | 'winter'
            | 'desert'
            | 'custom'
            | 'water sports'
            | 'skiing',
        },
        {
          onSuccess: (pack) => {
            console.log('Pack Created:', pack);
            router.push(`/pack/${pack.id}`);
          },
          onError: (error) => {
            console.error('Error Creating Pack:', error);
          },
        }
      );
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <View className="p-6">
        <Text className="mb-6 text-2xl font-bold text-foreground">Create New Pack</Text>

        <form.Field name="name">
          {(field) => (
            <FormField>
              <View className="mb-1 flex-row items-center">
                <Icon name="folder" size={16} color={colors.foreground} />
                <FormLabel required className="ml-2">
                  Pack Name
                </FormLabel>
              </View>
              <TextInput
                className="rounded-lg border border-input bg-background p-3 text-foreground"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                placeholder="My Ultralight Setup"
                placeholderTextColor="text-muted-foreground"
              />
              <FieldError field={field} />
            </FormField>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <FormField>
              <View className="mb-1 flex-row items-center">
                <Icon name="newspaper" size={16} color={colors.foreground} />
                <FormLabel className="ml-2">Description</FormLabel>
              </View>
              <TextInput
                className="min-h-[100px] rounded-lg border border-input bg-background p-3 text-foreground"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                multiline
                textAlignVertical="top"
                placeholder="Describe your pack and its purpose..."
                placeholderTextColor="text-muted-foreground"
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="category">
          {(field) => (
            <FormField>
              <View className="mb-1 flex-row items-center">
                <Icon name="tag" size={16} color={colors.foreground} />
                <FormLabel required className="ml-2">
                  Category
                </FormLabel>
              </View>
              <View className="overflow-hidden rounded-lg border border-input bg-background">
                {/* TODO: Add select component */}
                <TextInput
                  className="flex-1 rounded-lg border border-input bg-background p-3 text-foreground"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Select Category"
                  placeholderTextColor="text-muted-foreground"
                />
              </View>
            </FormField>
          )}
        </form.Field>

        <form.Field name="isPublic">
          {(field) => (
            <FormField>
              <View className="flex-row items-center justify-between rounded-lg border border-input bg-background p-4">
                <View className="flex-row items-center">
                  {field.state.value ? (
                    <Icon name="eye" size={18} color={colors.foreground} />
                  ) : (
                    <Icon name="eye-off" size={18} color={colors.foreground} />
                  )}
                  <Text className="ml-2 font-medium text-foreground">Make Pack Public</Text>
                </View>
                <Switch
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  trackColor={{ false: 'hsl(var(--muted))', true: 'hsl(var(--primary))' }}
                  ios_backgroundColor="hsl(var(--muted))"
                />
              </View>
              <Text className="ml-1 mt-1 text-xs text-muted-foreground">
                Public packs can be viewed by other users
              </Text>
            </FormField>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Pressable
              onPress={() => {
                // Submit with default weights of 0 - they'll be calculated later when items are added
                form.handleSubmit();
              }}
              disabled={!canSubmit || isSubmitting}
              className={`mt-4 rounded-lg px-4 py-3.5 ${!canSubmit || isSubmitting ? 'bg-primary/70' : 'bg-primary'}`}>
              <Text className="text-center text-base font-semibold text-primary-foreground">
                {isSubmitting ? 'Creating...' : 'Create Pack'}
              </Text>
            </Pressable>
          )}
        </form.Subscribe>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreatePackForm;
