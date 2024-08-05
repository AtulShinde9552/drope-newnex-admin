import React, { useState } from 'react';
import { updateTag } from '@/actions/tag.action';

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

const TagEditForm: React.FC<TagEditFormProps> = ({ tag, onCancel, onUpdate }) => {
  const [name, setName] = useState(tag.name);
  const [description, setDescription] = useState(tag.description);
  const [Developedby, setDevelopedby] = useState(tag.Developedby);
  const [Companywebsite, setCompanywebsite] = useState(tag.Companywebsite);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    
    if (!name || !description || !Developedby || !Companywebsite) {
      setError('All fields are required.');
      return;
    }

    setError(null);
    try {
      await onUpdate({ id: tag._id, name, description, Developedby, Companywebsite });
      setSuccess('Tag updated successfully!');
    } catch (error) {
      setError('Failed to update tag. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-md shadow-md">
      {error && <div className="text-red-600 dark:text-red-400">{error}</div>}
      {success && <div className="text-green-600 dark:text-green-400">{success}</div>}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-primary-500 dark:focus:border-primary-500 xl:text-xl"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-primary-500 dark:focus:border-primary-500 xl:text-xl"
        />
      </div>
      
      <div>
        <label htmlFor="Developedby" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Developed By</label>
        <input
          id="Developedby"
          type="text"
          value={Developedby}
          onChange={(e) => setDevelopedby(e.target.value)}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-primary-500 dark:focus:border-primary-500 xl:text-xl"
        />
      </div>
      
      <div>
        <label htmlFor="Companywebsite" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Website</label>
        <input
          id="Companywebsite"
          type="text"
          value={Companywebsite}
          onChange={(e) => setCompanywebsite(e.target.value)}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-primary-500 dark:focus:border-primary-500 xl:text-xl"
        />
      </div>
      
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default TagEditForm;