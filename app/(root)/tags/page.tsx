'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchIcon, MoreHorizontal } from 'lucide-react';
import { SearchParamsProps } from '@/types/props';
import { TagFilters } from '@/constants/filters';
import { tagNoResult } from '@/constants/no-result';
import { getAllTags, createTag, updateTag } from '@/actions/tag.action';
import LocalSearch from '@/components/local-search';
import Filter from '@/components/filter';
import NoResult from '@/components/no-result';
import { tagVariants } from '@/components/tags-badge';
import { cn } from '@/lib/utils';
import Pagination from '@/components/pagination';
import { UserCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import TagForm from '@/components/forms/tag-form'; // Import TagForm component
import TagEditForm from '@/components/forms/tagupdate'; // Import TagEditForm component

interface Tag {
  _id: string;
  name: string;
  Developedby: string;
  description: string;
  Companywebsite: string;
  questions: { length: number };
}

const truncateDescription = (description?: string, wordLimit = 6) => {
  if (!description) return '';
  const words = description.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return description;
};

export default function TagsPage({ searchParams }: SearchParamsProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isNext, setIsNext] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      const result = await getAllTags({
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        page: Number(searchParams.page) || 1,
      });
      setTags(result.tags);
      setIsNext(result.isNext);
    };
    fetchTags();
  }, [searchParams]);

  const handleCreateTag = async (tagData: { name: string; description: string; Developedby: string; Companywebsite: string; }) => {
    try {
      await createTag(tagData);
      // Reload the tags list
      const result = await getAllTags({
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        page: Number(searchParams.page) || 1,
      });
      setTags(result.tags);
      setIsNext(result.isNext);
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  const handleUpdateTag = async (tagData: { id: string; name: string; description: string; Developedby: string; Companywebsite: string; }) => {
    try {
      await updateTag(tagData);
      // Update the tag in the current state
      setTags((prevTags) =>
        prevTags.map((tag) =>
          tag._id === tagData.id ? { ...tag, ...tagData } : tag
        )
      );
      setEditingTag(null);
    } catch (error) {
      console.error('Failed to update tag:', error);
    }
  };

  return (
    <>
      <h1 className="h1-bold">All Engineering Software/Tags</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/tags"
          icon={<SearchIcon />}
          iconPosition="left"
          placeholder="Search for tags"
          className="flex-1"
        />
        <Filter filters={TagFilters} />
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className={cn(buttonVariants(), 'btn-secondary small-medium w-full text-orange-500')}
          >
            <UserCircle className="h-5 w-5 lg:hidden" />
            <span className="max-lg:hidden">Create Tag</span>
          </button>
        </div>
      </div>
      {showForm && (
        <div className="mt-6">
          <TagForm onCreate={handleCreateTag} />
        </div>
      )}
      <section className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-4">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <div key={tag._id} className="relative rounded-lg bg-gray-100 dark:bg-dark-200">
              <Link href={`tags/${tag._id}`} className="block p-5">
                <article className="flex w-full flex-col items-center gap-3">
                  <div>
                    <p
                      className={cn(
                        tagVariants({ size: 'md' }),
                        'background-light700_dark300 font-semibold shadow',
                      )}
                    >
                      {tag.name}
                    </p>
                  </div>
                  <p className="font-semibold text-[#ff7000] ">{tag.Developedby}</p>
                  <span className="text-xs text-[#ff7000] ">{tag.Companywebsite}</span>
                  <p className="text-center font-semibold text-gray-500">
                    {truncateDescription(tag.description, 10)}
                  </p>
                  <p className="text-dark400_light500 text-sm">
                    <span className="primary-text-gradient mr-2 font-semibold">
                      {tag.questions.length}+
                    </span>
                    Questions
                  </p>
                </article>
              </Link>
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => setEditingTag(tag)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-300"
                >
                  <MoreHorizontal />
                </button>
              </div>
            </div>
          ))
        ) : (
          <NoResult
            title={tagNoResult.title}
            description={tagNoResult.description}
            buttonText={tagNoResult.buttonText}
            buttonLink={tagNoResult.buttonLink}
          />
        )}
      </section>
      <Pagination pageNumber={Number(searchParams.page) || 1} isNext={isNext} />
      {editingTag && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
            <TagEditForm
              tag={editingTag}
              onCancel={() => setEditingTag(null)}
              onUpdate={handleUpdateTag}
            />
          </div>
        </div>
      )}
    </>
  );
}
