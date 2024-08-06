'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.enum([
    "Aerospace Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Petroleum Engineering",
  ], { required_error: 'Required' }),
  description: z.string().min(1, { message: 'Required' }).max(500),
  Developedby: z.string().min(1, { message: 'Required' }).max(50),
  Companywebsite: z.string().url({ message: 'Invalid URL' }),
});

type FormValues = z.infer<typeof formSchema>;

interface TagFormProps {
  onCreate: (data: FormValues) => Promise<void>;
}

export default function TagForm({ onCreate }: TagFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '' as any,
      description: '',
      Developedby: '',
      Companywebsite: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await onCreate(values);
      toast.success('Tag created successfully');
      form.reset();
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Engineering <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className="background-light800_dark300 light-border text-dark500_light700 min-w-[150px] rounded-lg px-5 focus-visible:ring-0 focus-visible:ring-transparent sm:w-[200px]"
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
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
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
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
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
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="primary-gradient px-10 text-light-800"
        >
          {isSubmitting ? 'Creating...' : 'Create Tag'}
        </Button>
      </form>
    </Form>
  );
}
