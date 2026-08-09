import re

with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

target = """  return (
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
  );"""

replacement = """  return (
    <div ref={setNodeRef} style={style} className="flex flex-col bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/10 transition-colors relative group">
      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden cursor-grab active:cursor-grabbing relative mb-3" {...attributes} {...listeners}>
        <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
        <button 
          type="button"
          onPointerDown={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 right-2 text-white p-1.5 rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-pink-500 hover:bg-pink-600"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      <div className="flex flex-col gap-1.5 w-full mt-auto">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tags (Separados por coma)</label>
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
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-pink-500 text-xs text-slate-900"
        />
      </div>
    </div>
  );"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced SortableGalleryItem layout")
else:
    print("Could not find SortableGalleryItem layout to replace")

with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
    f.write(content)
