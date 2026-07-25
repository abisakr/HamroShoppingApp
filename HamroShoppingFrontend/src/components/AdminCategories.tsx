// src/pages/admin/AdminCategories.tsx
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaImage, FaFolder } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { categoryService } from '../services/api';
import { Skeleton } from './Skeleton';

const AdminCategories: React.FC = () => {
  // Data States
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BASE_URL = "https://localhost:7223";

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err: any) {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Image Selection & Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openModal = (category?: any) => {
    if (category) {
      setEditId(category.id);
      setCategoryName(category.categoryName);
      setPreviewUrl(category.photoPath ? `${BASE_URL}${category.photoPath}` : null);
    } else {
      setEditId(null);
      setCategoryName('');
      setPreviewUrl(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setCategoryName('');
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return toast.warning("Category name is required");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('categoryName', categoryName);
    if (imageFile) {
      formData.append('photo', imageFile);
    }

    try {
      if (editId) {
        await categoryService.update(editId, formData);
        toast.success("Category updated successfully");
      } else {
        await categoryService.create(formData);
        toast.success("Category created successfully");
      }
      closeModal();
      loadCategories();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category? This might affect products in this category.")) return;

    try {
      await categoryService.delete(id);
      toast.success("Category deleted");
      loadCategories();
    } catch (err: any) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Categories</h1>
          <p className="text-gray-500 font-medium">Manage your store's product groupings</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-xl shadow-blue-100"
        >
          <FaPlus /> Add New Category
        </button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height="200px" className="rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-32 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  {cat.photoPath ? (
                    <img 
                      src={`${BASE_URL}${cat.photoPath}`} 
                      alt={cat.categoryName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <FaFolder className="text-4xl text-gray-200" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      onClick={() => openModal(cat)}
                      className="p-3 bg-white text-blue-600 rounded-xl hover:scale-110 transition"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-3 bg-white text-red-600 rounded-xl hover:scale-110 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-black text-lg text-gray-800">{cat.categoryName}</h3>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category ID: {cat.id}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed">
              <p className="text-gray-400 font-bold">No categories found. Create your first one!</p>
            </div>
          )}
        </div>
      )}

      {/* --- CRUD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900">{editId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-black transition">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-500 uppercase tracking-wider ml-1">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Electronics, Clothing..."
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-500 uppercase tracking-wider ml-1">Category Image</label>
                <div className="relative group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                  />
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    {previewUrl ? (
                      <img src={previewUrl} className="h-24 w-24 object-cover rounded-xl shadow-md" alt="Preview" />
                    ) : (
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <FaImage className="text-2xl text-gray-300" />
                      </div>
                    )}
                    <span className="text-sm font-bold text-gray-500">
                      {imageFile ? imageFile.name : "Click to browse image"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:bg-gray-300 transition-all"
                >
                  {isSubmitting ? 'Saving...' : editId ? 'Update Category' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;