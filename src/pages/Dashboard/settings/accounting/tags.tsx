import { type FC, useState, useRef, useEffect } from "react";
import { AccountingSettingsLayout } from "../../../../components/common/AccountingSettingsLayout";
import Button from "../../../../components/common/Button";
import { Plus, X, MoreHorizontal, Edit2, Trash2 } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  color: string;
}

const TAG_COLORS = [
  "#FF9EA2", // Red/Pink
  "#FFF59E", // Yellow
  "#9EFFA6", // Green
  "#9EDFFF", // Light Blue
  "#AA9EFF", // Purple
];

const AccountingTagsSettings: FC = () => {
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", name: "Main", color: "#FFB5B9" }, // Example mock data matching image style loosely
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      let isClickInside = false;

      Object.values(menuRefs.current).forEach((ref) => {
        if (ref && ref.contains(target)) {
          isClickInside = true;
        }
      });

      if (!isClickInside) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openMenuId]);

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    if (editingTag) {
      // Update existing tag
      setTags(tags.map((tag) =>
        tag.id === editingTag.id
          ? { ...tag, name: newTagName, color: selectedColor }
          : tag
      ));
      setEditingTag(null);
    } else {
      // Add new tag
      const newTag: Tag = {
        id: Date.now().toString(),
        name: newTagName,
        color: selectedColor,
      };
      setTags([...tags, newTag]);
    }

    setNewTagName("");
    setSelectedColor(TAG_COLORS[0]);
    setIsModalOpen(false);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setSelectedColor(tag.color);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
    setOpenMenuId(null);
  };

  const handleOpenModal = () => {
    setEditingTag(null);
    setNewTagName("");
    setSelectedColor(TAG_COLORS[0]);
    setIsModalOpen(true);
  };

  return (
    <AccountingSettingsLayout
      activeTab="tags"
      headerActions={
        <Button
          className="bg-[#7BD747] hover:bg-[#6bc03d] text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors w-full sm:w-auto"
          onClick={handleOpenModal}
        >
          Add Tag
        </Button>
      }
    >
      <div className="flex flex-wrap gap-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="group relative w-[200px] h-[120px] rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-md overflow-visible"
            style={{ backgroundColor: tag.color }}
          >
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-800">{tag.name}</span>
              <div className="relative" ref={(el) => { menuRefs.current[tag.id] = el; }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === tag.id ? null : tag.id);
                  }}
                  className="text-gray-700 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                {openMenuId === tag.id && (
                  <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 px-1 z-50 min-w-[120px] animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEdit(tag);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 rounded-md"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(tag.id);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add Tag Placeholder/Button in Grid */}
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#272727] text-white hover:bg-black transition-colors self-center ml-2"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add Tag Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 ">
          <div className="bg-[#FBFBFB] rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8]">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTag ? "Edit Tag" : "Add Tag"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTag(null);
                  setNewTagName("");
                  setSelectedColor(TAG_COLORS[0]);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Tag Name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E8E8] bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7BD747] transition-shadow"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900 mb-4 block">Tag Color</label>
                <div className="flex gap-4">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 ${selectedColor === color ? "ring-[#7BD747] scale-110" : "ring-transparent"
                        }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer (Optional - purely visual based on image, image doesn't show buttons but usually needed. 
               The image shows just inputs. I'll add a hidden submit or rely on Enter key/auto-save/outside click? 
               Wait, the image just shows the popup content. I should probably add a "Save" button or at least make "Enter" work.
               I'll add a button for better UX even if not explicitly in the crop.)
            */}
            <div className="px-6 pb-6">
              <Button
                onClick={handleAddTag}
                className="w-full bg-[#272727] text-white hover:bg-black py-3 rounded-lg"
              >
                {editingTag ? "Update Tag" : "Save Tag"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AccountingSettingsLayout>
  );
};

export default AccountingTagsSettings;


