'use server';

import { FilterQuery } from 'mongoose';
import Tag, { ITag } from '@/db/models/tag.model';
import User from '@/db/models/user.model';
import Question from '@/db/models/question.model';
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from '@/types/action';

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    const { searchQuery, filter, page = 1, pageSize = 20 } = params;
    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }];
    }
    const skip = (page - 1) * pageSize;

    let sortOptions = {};
    switch (filter) {
      case 'popular':
        sortOptions = { questions: -1 };
        break;
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'old':
        sortOptions = { createdAt: 1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query).skip(skip).limit(pageSize).sort(sortOptions);
    const totalTags = await Tag.countDocuments(query);
    const isNext = totalTags > skip + tags.length;
    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTopInteractedTags = async (params: GetTopInteractedTagsParams) => {
  try {
    const { userId, limit = 3 } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const tags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: limit },
    ]);
    return [
      { id: '1', name: 'Tag 1' },
      { id: '2', name: 'Tag 2' },
      { id: '3', name: 'Tag 3' },
    ];
  } catch (error) {
    console.log(error);
  }
};

export const getQuestionsByTagId = async (params: GetQuestionsByTagIdParams) => {
  try {
    const { tagId, searchQuery, page = 1, pageSize = 10 } = params;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };
    const skip = (page - 1) * pageSize;

    const tag = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery ? { title: { $regex: searchQuery, $options: 'i' } } : {},
      options: {
        sort: { createdAt: -1 },
        skip,
        limit: pageSize,
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name username picture' },
      ],
    });
    if (!tag) throw new Error('Tag not found');
    const questions = tag.questions;
    // Tags questions without pagination & sorting for checking next page
    const tag2 = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery ? { title: { $regex: searchQuery, $options: 'i' } } : {},
    });
    const isNext = tag2.questions.length > skip + questions.length;
    return {
      companyWeb: tag.Companywebsite,
      tagName: tag.name,
      companyName: tag.Developedby,
      questions,
      isNext,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPopularTags = async () => {
  try {
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createTag = async ({
  name,
  description,
  Developedby,
  Companywebsite,
}: {
  name: string;
  description: string;
  Developedby: string;
  Companywebsite: string;
}) => {
  try {
    const allowedTagNames = [
      "Aerospace Engineering",
      "Chemical Engineering",
      "Civil Engineering",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Petroleum Engineering",
    ];

    if (
      !name ||
      typeof name !== 'string' ||
      name.trim() === '' ||
      !description ||
      typeof description !== 'string' ||
      description.trim() === '' ||
      !Developedby ||
      typeof Developedby !== 'string' ||
      Developedby.trim() === '' ||
      !Companywebsite ||
      typeof Companywebsite !== 'string' ||
      Companywebsite.trim() === ''
    ) {
      throw new Error('Invalid input');
    }

    if (!allowedTagNames.includes(name.trim())) {
      throw new Error(`Tag name must be one of the following: ${allowedTagNames.join(', ')}`);
    }

    const existingTag = await Tag.findOne({ name: name.trim() });
    if (existingTag) {
      throw new Error('Tag already exists');
    }

    const newTag = new Tag({
      name: name.trim(),
      description: description.trim(),
      Developedby: Developedby.trim(),
      Companywebsite: Companywebsite.trim(),
    });

    await newTag.save();
    return newTag;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTag = async (params: {
  id: string;
  name?: string;
  description?: string;
  Developedby?: string;
  Companywebsite?: string;
}) => {
  try {
    const { id, name, description, Developedby, Companywebsite } = params;

    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid tag ID');
    }

    const updateFields: Partial<ITag> = {};

    if (name && typeof name === 'string' && name.trim() !== '') {
      updateFields.name = name.trim();
    }
    if (description && typeof description === 'string' && description.trim() !== '') {
      updateFields.description = description.trim();
    }
    if (Developedby && typeof Developedby === 'string' && Developedby.trim() !== '') {
      updateFields.Developedby = Developedby.trim();
    }
    if (Companywebsite && typeof Companywebsite === 'string' && Companywebsite.trim() !== '') {
      updateFields.Companywebsite = Companywebsite.trim();
    }

    const updatedTag = await Tag.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedTag) {
      throw new Error('Tag not found');
    }

    return updatedTag;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
