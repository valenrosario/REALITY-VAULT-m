import re

with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

target_container = """              <SortableContext items={(formData.gallery || []).map(g => g.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">"""

replacement_container = """              <SortableContext items={(formData.gallery || []).map(g => g.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-4 mt-6">"""

content = content.replace(target_container, replacement_container)

target_sortable_item = """const SortableGalleryItem = ({ 
  img, 
  onRemove, 
  onUpdateTags 
}: { 
  key?: string;
  img: GalleryImage, 
  onRemove: () => void, 
  onUpdateTags: (tags: string[]) => void 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [localTags, setLocalTags] = useState(img.tags ? img.tags.join(', ') : '');

  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-xl overflow-hidden border border-slate-200">
      <div className="aspect-[4/3] bg-slate-100 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
      </div>
      
      {/* Botón de eliminar (esquina superior derecha) */}
      <button 
        type="button"
        onPointerDown={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-2 right-2 text-white p-1.5 rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-pink-500 hover:bg-pink-600"
      >
        <Trash2 size={14} />
      </button>

      {/* Input de Tags en la base */}
      <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-md p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <input 
          type="text" 
          value={localTags}
          onPointerDown={(e) => e.stopPropagation()} // Para que no active el drag
          onChange={(e) => setLocalTags(e.target.value)}
          onBlur={() => {
            const tagsArray = localTags.split(',').map(t => t.trim()).filter(Boolean);
            onUpdateTags(tagsArray);
          }}
          placeholder="Tags (Y2K, Set...)"
          className="w-full bg-transparent text-white text-[10px] font-bold px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-white border border-white/20"
        />
      </div>
    </div>
  );
};"""

replacement_sortable_item = """const SortableGalleryItem = ({ 
  img, 
  onRemove, 
  onUpdateTags 
}: { 
  key?: string;
  img: GalleryImage, 
  onRemove: () => void, 
  onUpdateTags: (tags: string[]) => void 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [localTags, setLocalTags] = useState(img.tags ? img.tags.join(', ') : '');

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 transition-colors">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg shrink-0 overflow-hidden cursor-grab active:cursor-grabbing relative" {...attributes} {...listeners}>
        <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 flex flex-col gap-2 w-full">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tags (Separados por coma)</label>
        <input 
          type="text" 
          value={localTags}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => setLocalTags(e.target.value)}
          onBlur={() => {
            const tagsArray = localTags.split(',').map(t => t.trim()).filter(Boolean);
            onUpdateTags(tagsArray);
          }}
          placeholder="Tags (Y2K, Set...)"
          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-500 text-sm text-slate-900"
        />
      </div>

      <button 
        type="button"
        onPointerDown={(e) => { e.stopPropagation(); onRemove(); }}
        className="text-red-500 hover:text-white p-2 rounded-lg transition-colors hover:bg-red-500 shrink-0 self-end md:self-center"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};"""

if target_sortable_item in content:
    content = content.replace(target_sortable_item, replacement_sortable_item)
    print("Replaced SortableGalleryItem")
else:
    print("SortableGalleryItem not found")

with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
    f.write(content)
