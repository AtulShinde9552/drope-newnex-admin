// tags/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchIcon } from 'lucide-react';
import { SearchParamsProps } from '@/types/props';
import { TagFilters } from '@/constants/filters';
import { tagNoResult } from '@/constants/no-result';
import { getAllTags, createTag } from '@/actions/tag.action';
import LocalSearch from '@/components/local-search';
import Filter from '@/components/filter';
import NoResult from '@/components/no-result';
import { tagVariants } from '@/components/tags-badge';
import { cn } from '@/lib/utils';
import Pagination from '@/components/pagination';
import { UserCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import TagForm from '@/components/forms/tag-form'; // Import TagForm component

interface Tag {
  _id: string;
  name: string;
  Developedby: string;
  description: string;
  questions: { length: number };
}

export default function TagsPage({ searchParams }: SearchParamsProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isNext, setIsNext] = useState(false);
  const [showForm, setShowForm] = useState(false);

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

  return (
    <>
    <h1 className="h1-bold">All Tags</h1>
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
          <Link
            href={`tags/${tag._id}`}
            key={tag._id}
            className="rounded-lg bg-gray-100 dark:bg-dark-200"
          >
            <article className="flex w-full flex-col items-center gap-3 p-5">
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
                <p className="text-gray-500 font-semibold">{tag.Developedby}</p>
                <p className="text-gray-500 font-semibold text-center">{tag.description}</p>

              <p className="text-dark400_light500 text-sm">
                <span className="primary-text-gradient mr-2 font-semibold">
                  {tag.questions.length}+
                </span>
                Questions
              </p>
            </article>
          </Link>
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
  </>
  );
}
