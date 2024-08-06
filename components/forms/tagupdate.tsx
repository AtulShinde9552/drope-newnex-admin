'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface Tag {
  _id: string;
  name: string;
  Developedby: string;
  description: string;
  Companywebsite: string;
}

interface TagEditFormProps {
  tag: Tag;
  onCancel: () => void;
  onUpdate: (tagData: {
    id: string;
    name: string;
    description: string;
    Developedby: string;
    Companywebsite: string;
  }) => void;
}

const formSchema = z.object({
  name: z.enum([
    "Aerospace Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Petroleum Engineering",
  ], {
    required_error: 'Required',
  }),
  description: z.string().min(1, { message: 'Required' }).max(500),
  Developedby: z.string().min(1, { message: 'Required' }).max(50),
  Companywebsite: z.string().url({ message: 'Invalid URL' }),
});

type FormValues = z.infer<typeof formSchema>;

const TagEditForm: React.FC<TagEditFormProps> = ({ tag, onCancel, onUpdate }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tag.name as FormValues['name'],
      description: tag.description,
      Developedby: tag.Developedby,
      Companywebsite: tag.Companywebsite,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await onUpdate({ id: tag._id, ...values });
      setSuccess('Tag updated successfully!');
      toast.success('Tag updated successfully');
    } catch (error) {
      setError('Failed to update tag. Please try again.');
      toast.error('Failed to update tag');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
        {error && <div className="text-red-600 dark:text-red-400">{error}</div>}
        {success && <div className="text-green-600 dark:text-green-400">{success}</div>}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Name <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger
                    className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 w-full"
                  >
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {[
                        "Aerospace Engineering",
                        "Chemical Engineering",
                        "Civil Engineering",
                        "Electrical Engineering",
                        "Mechanical Engineering",
                        "Petroleum Engineering",
                      ].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Description <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Developedby"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Developed By <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Companywebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Company Website <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://www.example.com"
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TagEditForm;
