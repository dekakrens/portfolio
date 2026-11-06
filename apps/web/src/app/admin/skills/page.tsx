'use client';

import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  FolderPlus,
  Star,
  ExternalLink,
} from 'lucide-react';
import {
  adminGetSkills,
  adminCreateSkillCategory,
  adminUpdateSkillCategory,
  adminDeleteSkillCategory,
  adminCreateSkill,
  adminUpdateSkill,
  adminDeleteSkill,
} from '@/lib/admin-api';

interface Skill {
  id: string;
  categoryId: string;
  name: string;
  iconSlug?: string;
  isFeatured: boolean;
  displayOrder: number;
}

interface SkillCategory {
  id: string;
  name: string;
  displayOrder: number;
  skills: Skill[];
}

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Category modal / editing
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id?: string; name: string; displayOrder: number } | null>(null);

  // Skill modal / editing
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<{
    id?: string;
    categoryId: string;
    name: string;
    iconSlug?: string;
    isFeatured: boolean;
    displayOrder: number;
  } | null>(null);

  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminGetSkills();
      setCategories(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load skills' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Category Actions ---
  const handleOpenCategoryModal = (cat?: SkillCategory) => {
    if (cat) {
      setEditingCategory({ id: cat.id, name: cat.name, displayOrder: cat.displayOrder });
    } else {
      setEditingCategory({ name: '', displayOrder: categories.length });
    }
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;

    try {
      setSaving(true);
      if (editingCategory.id) {
        await adminUpdateSkillCategory(editingCategory.id, {
          name: editingCategory.name,
          displayOrder: editingCategory.displayOrder,
        });
        setMessage({ type: 'success', text: 'Category updated and cache revalidated' });
      } else {
        await adminCreateSkillCategory({
          name: editingCategory.name,
          displayOrder: editingCategory.displayOrder,
        });
        setMessage({ type: 'success', text: 'New category created and cache revalidated' });
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      await loadData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save category' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}" and all skills inside it?`)) {
      return;
    }
    try {
      await adminDeleteSkillCategory(id);
      setMessage({ type: 'success', text: 'Category deleted successfully' });
      await loadData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete category' });
    }
  };

  // --- Skill Actions ---
  const handleOpenSkillModal = (categoryId: string, skill?: Skill) => {
    if (skill) {
      setEditingSkill({
        id: skill.id,
        categoryId: skill.categoryId,
        name: skill.name,
        iconSlug: skill.iconSlug || '',
        isFeatured: skill.isFeatured,
        displayOrder: skill.displayOrder,
      });
    } else {
      setEditingSkill({
        categoryId,
        name: '',
        iconSlug: '',
        isFeatured: true,
        displayOrder: 0,
      });
    }
    setShowSkillModal(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name.trim()) return;

    try {
      setSaving(true);
      if (editingSkill.id) {
        await adminUpdateSkill(editingSkill.id, {
          categoryId: editingSkill.categoryId,
          name: editingSkill.name,
          iconSlug: editingSkill.iconSlug,
          isFeatured: editingSkill.isFeatured,
          displayOrder: editingSkill.displayOrder,
        });
        setMessage({ type: 'success', text: 'Skill updated and cache revalidated' });
      } else {
        await adminCreateSkill({
          categoryId: editingSkill.categoryId,
          name: editingSkill.name,
          iconSlug: editingSkill.iconSlug,
          isFeatured: editingSkill.isFeatured,
          displayOrder: editingSkill.displayOrder,
        });
        setMessage({ type: 'success', text: 'Skill added and cache revalidated' });
      }
      setShowSkillModal(false);
      setEditingSkill(null);
      await loadData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save skill' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove skill "${name}"?`)) return;
    try {
      await adminDeleteSkill(id);
      setMessage({ type: 'success', text: 'Skill removed successfully' });
      await loadData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete skill' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-500" />
            Skills &amp; Tech Stack
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Organize the technical skills and competencies displayed on your portfolio homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenCategoryModal()}
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
          <a
            href="https://dekakrens.com#skills"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
          >
            <span>Live Section</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-neutral-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm">Loading skills &amp; competencies...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-16 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center">
          <Cpu className="w-10 h-10 text-neutral-400 mb-2" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">No skill categories found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mb-4">
            Click "Add Category" above to create your first skill grouping.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                    {cat.name}
                  </h2>
                  <span className="text-xs text-neutral-400 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 font-medium">
                    {cat.skills?.length || 0} skills
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenSkillModal(cat.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Skill</span>
                  </button>
                  <button
                    onClick={() => handleOpenCategoryModal(cat)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Edit Category Name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Skills Chips Grid */}
              <div className="flex flex-wrap gap-2.5">
                {(cat.skills || []).map((skill) => (
                  <div
                    key={skill.id}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-all"
                  >
                    {skill.isFeatured && (
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    )}
                    <span>{skill.name}</span>
                    {skill.iconSlug && (
                      <span className="text-[10px] text-neutral-400 font-mono">
                        ({skill.iconSlug})
                      </span>
                    )}

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1 pl-1 border-l border-neutral-300 dark:border-neutral-700">
                      <button
                        onClick={() => handleOpenSkillModal(cat.id, skill)}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id, skill.name)}
                        className="text-neutral-400 hover:text-rose-500"
                        title="Delete Skill"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {(cat.skills || []).length === 0 && (
                  <div className="text-xs text-neutral-400 italic py-2">
                    No skills added in this category yet. Click "+ Add Skill" above.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                {editingCategory?.id ? 'Edit Skill Category' : 'New Skill Category'}
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Languages & Runtimes"
                  value={editingCategory?.name || ''}
                  onChange={(e) =>
                    setEditingCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))
                  }
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingCategory?.displayOrder ?? 0}
                  onChange={(e) =>
                    setEditingCategory((prev) =>
                      prev ? { ...prev, displayOrder: parseInt(e.target.value) || 0 } : null
                    )
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                {editingSkill?.id ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setShowSkillModal(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. TypeScript, React Native, Docker"
                  value={editingSkill?.name || ''}
                  onChange={(e) =>
                    setEditingSkill((prev) => (prev ? { ...prev, name: e.target.value } : null))
                  }
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Icon Slug (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. typescript, react, docker, esp32"
                  value={editingSkill?.iconSlug || ''}
                  onChange={(e) =>
                    setEditingSkill((prev) => (prev ? { ...prev, iconSlug: e.target.value } : null))
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="isFeaturedSkill"
                  checked={editingSkill?.isFeatured ?? true}
                  onChange={(e) =>
                    setEditingSkill((prev) =>
                      prev ? { ...prev, isFeatured: e.target.checked } : null
                    )
                  }
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
                />
                <label
                  htmlFor="isFeaturedSkill"
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Featured Skill (Highlighted on homepage)
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingSkill?.displayOrder ?? 0}
                  onChange={(e) =>
                    setEditingSkill((prev) =>
                      prev ? { ...prev, displayOrder: parseInt(e.target.value) || 0 } : null
                    )
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
