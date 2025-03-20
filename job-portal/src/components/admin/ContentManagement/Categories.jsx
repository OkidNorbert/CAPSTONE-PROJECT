import React, { useState } from 'react';
import { cn } from '../../../utils/styles';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Technology', count: 150, status: 'active' },
    { id: 2, name: 'Marketing', count: 85, status: 'active' },
    { id: 3, name: 'Design', count: 65, status: 'active' },
    { id: 4, name: 'Sales', count: 95, status: 'active' },
  ]);

  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const newId = Math.max(...categories.map(c => c.id)) + 1;
    setCategories([
      ...categories,
      { id: newId, name: newCategory, count: 0, status: 'active' }
    ]);
    setNewCategory('');
  };

  const handleEditStart = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const handleEditSave = () => {
    if (!editName.trim()) return;

    setCategories(categories.map(category =>
      category.id === editingId
        ? { ...category, name: editName }
        : category
    ));
    setEditingId(null);
    setEditName('');
  };

  const handleToggleStatus = (id) => {
    setCategories(categories.map(category =>
      category.id === id
        ? { ...category, status: category.status === 'active' ? 'inactive' : 'active' }
        : category
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Job Categories
        </h2>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="flex gap-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category name"
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className={cn(
            "button-gradient px-6 py-2 rounded-full",
            "text-sm font-medium",
            "hover-effect"
          )}
        >
          Add Category
        </button>
      </form>

      {/* Categories List */}
      <div className={cn(
        "glass-effect p-6 rounded-2xl",
        "hover-effect"
      )}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Job Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-1 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    ) : (
                      <span className="text-gray-900 dark:text-white">
                        {category.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {category.count} jobs
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      category.status === 'active'
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {category.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      {editingId === category.id ? (
                        <button
                          onClick={handleEditSave}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditStart(category)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleStatus(category.id)}
                        className={cn(
                          "text-sm",
                          category.status === 'active'
                            ? "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            : "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        )}
                      >
                        {category.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;
