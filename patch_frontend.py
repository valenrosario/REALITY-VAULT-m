import re

with open('src/components/SeriesDetailView.tsx', 'r') as f:
    content = f.read()

# 1. Add `activeTag` state
state_target = """  const [activeSeasonId, setActiveSeasonId] = useState(selectedSeries.seasons?.[0]?.id || '');"""
state_replacement = """  const [activeSeasonId, setActiveSeasonId] = useState(selectedSeries.seasons?.[0]?.id || '');
  const [activeTag, setActiveTag] = useState<string | null>(null);"""
content = content.replace(state_target, state_replacement)

# 2. Extract unique tags and Add filter buttons & filter logic
gallery_target = """      {/* Gallery Section */}
      {selectedSeries.gallery && selectedSeries.gallery.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20 relative z-30">
          <div className="absolute top-0 left-4 right-4 md:left-8 md:right-8 h-px bg-gradient-to-r from-transparent via-pink-200 dark:via-white/20 to-transparent"></div>
          <h3 className="text-2xl md:text-3xl font-gravity font-bold text-white mb-8 pt-8 md:pt-12 flex items-center gap-2">
            <Sparkles size={24} className="text-[#00dbef]" /> Galería
          </h3>
          <div className="flex flex-row overflow-x-auto gap-4 pb-6 px-2 snap-x snap-mandatory no-scrollbar w-full">
            {(selectedSeries.gallery || []).map((img) => (
              <div 
                key={img.id} 
                className="shrink-0 w-[220px] md:w-[280px] aspect-[3/4] relative rounded-xl overflow-hidden snap-center cursor-pointer group shadow-lg border border-white/10 hover:border-pink-500 transition-all"
                onClick={() => setSelectedGalleryImage(img.url)}
              >
                <img src={img.url} alt={img.category || 'Gallery image'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  {img.category && (
                    <span className="self-start mb-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 shadow-lg">
                      {img.category}
                    </span>
                  )}
                  {img.tags && img.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {img.tags.map(tag => (
                        <span key={tag} className="bg-black/60 backdrop-blur-md text-pink-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}"""

gallery_replacement = """      {/* Gallery Section */}
      {selectedSeries.gallery && selectedSeries.gallery.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20 relative z-30">
          <div className="absolute top-0 left-4 right-4 md:left-8 md:right-8 h-px bg-gradient-to-r from-transparent via-pink-200 dark:via-white/20 to-transparent"></div>
          <h3 className="text-2xl md:text-3xl font-gravity font-bold text-white mb-8 pt-8 md:pt-12 flex items-center gap-2">
            <Sparkles size={24} className="text-[#00dbef]" /> Galería
          </h3>
          
          {(() => {
            const allTags = Array.from(new Set(selectedSeries.gallery?.flatMap(img => img.tags || []) || []));
            const filteredGallery = activeTag ? selectedSeries.gallery?.filter(img => img.tags?.includes(activeTag)) : selectedSeries.gallery;
            
            return (
              <>
                {allTags.length > 0 && (
                  <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar mb-4">
                    <button 
                      onClick={() => setActiveTag(null)}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${!activeTag ? 'bg-pink-500 text-white border-pink-500' : 'bg-black/40 text-gray-300 border-white/10 hover:bg-white/10'}`}
                    >
                      Todos
                    </button>
                    {allTags.map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${activeTag === tag ? 'bg-pink-500 text-white border-pink-500' : 'bg-black/40 text-gray-300 border-white/10 hover:bg-white/10'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-row overflow-x-auto gap-4 pb-6 px-2 snap-x snap-mandatory no-scrollbar w-full">
                  {(filteredGallery || []).map((img) => (
                    <div 
                      key={img.id} 
                      className="shrink-0 w-[220px] md:w-[280px] aspect-[3/4] relative rounded-xl overflow-hidden snap-center cursor-pointer group shadow-lg border border-white/10 hover:border-pink-500 transition-all"
                      onClick={() => setSelectedGalleryImage(img.url)}
                    >
                      <img src={img.url} alt={img.category || 'Gallery image'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      
                      {/* Burbujas de Tags sobre las fotos */}
                      {img.tags && img.tags.length > 0 && (
                        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 z-10 pointer-events-none">
                          {img.tags.map(tag => (
                            <span key={tag} className="bg-black/70 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-white/20 shadow-lg">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-start p-4">
                        {img.category && (
                          <span className="self-end bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 shadow-lg">
                            {img.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}"""
content = content.replace(gallery_target, gallery_replacement)

with open('src/components/SeriesDetailView.tsx', 'w') as f:
    f.write(content)
print("Patched SeriesDetailView successfully")
