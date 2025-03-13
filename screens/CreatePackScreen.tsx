'use client';

import { useForm } from '@tanstack/react-form';
import { Button, Switch, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

// Define Zod schema
const packSchema = z.object({
  name: z.string().min(1, 'Pack name is required'),
  description: z.string().optional(),
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
  baseWeight: z.number().nonnegative().optional(),
  totalWeight: z.number().nonnegative().optional(),
  isPublic: z.boolean(),
  tags: z.array(z.string()).optional(),
});

// Type inference
type PackFormValues = z.infer<typeof packSchema>;

// Validation message display
const FieldInfo = ({ field }: { field: any }) => (
  <>
    {field.state.meta.isTouched && field.state.meta.errors.length ? (
      <Text className="text-red-500">
        {field.state.meta.errors.map((err: any) => err.message).join(', ')}
      </Text>
    ) : null}
  </>
);

const CreatePackForm = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: 'hiking',
      baseWeight: 0,
      totalWeight: 0,
      isPublic: false,
      tags: [],
    },
    validators: {
      onChange: packSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Form Submitted:', value);
    },
  });

  return (
    <View className="p-4">
      <Text className="mb-4 text-2xl font-bold">Create New Pack</Text>

      <form.Field name="name">
        {(field) => (
          <View className="mb-4">
            <Text className="mb-2">Pack Name</Text>
            <TextInput
              className="rounded border p-2"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
            />
            <FieldInfo field={field} />
          </View>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <View className="mb-4">
            <Text className="mb-2">Description</Text>
            <TextInput
              className="rounded border p-2"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              multiline
            />
          </View>
        )}
      </form.Field>

      <form.Field name="category">
        {(field) => (
          <View className="mb-4">
            <Text className="mb-2">Category</Text>
            <TextInput
              className="rounded border p-2"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
            />
          </View>
        )}
      </form.Field>

      <form.Field name="baseWeight">
        {(field) => (
          <View className="mb-4">
            <Text className="mb-2">Base Weight (g)</Text>
            <TextInput
              className="rounded border p-2"
              value={String(field.state.value)}
              onBlur={field.handleBlur}
              onChangeText={(text) => field.handleChange(Number(text))}
              keyboardType="numeric"
            />
          </View>
        )}
      </form.Field>

      <form.Field name="totalWeight">
        {(field) => (
          <View className="mb-4">
            <Text className="mb-2">Total Weight (g)</Text>
            <TextInput
              className="rounded border p-2"
              value={String(field.state.value)}
              onBlur={field.handleBlur}
              onChangeText={(text) => field.handleChange(Number(text))}
              keyboardType="numeric"
            />
          </View>
        )}
      </form.Field>

      <form.Field name="isPublic">
        {(field) => (
          <View className="mb-4 flex-row items-center">
            <Text className="mr-2">Public Pack</Text>
            <Switch value={field.state.value} onValueChange={field.handleChange} />
          </View>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button
            title={isSubmitting ? 'Submitting...' : 'Create Pack'}
            onPress={form.handleSubmit}
            disabled={!canSubmit}
          />
        )}
      </form.Subscribe>
    </View>
  );
};

export default CreatePackForm;
