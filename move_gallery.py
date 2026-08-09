import re

with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# 1. Extract Gallery Block
start_marker = "          {/* Galería de Imágenes */}"
end_marker = "        </div>\n      </div>\n\n      {/* Modal de Previsualización */}"
gallery_idx = content.find(start_marker)
end_idx = content.find(end_marker, gallery_idx)

if gallery_idx != -1 and end_idx != -1:
    gallery_block = content[gallery_idx:end_idx]
    
    # Modify the block
    gallery_block = gallery_block.replace(
        '<SortableContext items={(formData.gallery || []).map(g => g.id)} strategy={verticalListSortingStrategy}>',
        '<SortableContext items={(formData.gallery || []).map(g => g.id)} strategy={rectSortingStrategy}>'
    )
    gallery_block = gallery_block.replace(
        '<div className="flex flex-col gap-4 mt-6">',
        '<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">'
    )
    
    # Remove from original location
    content = content[:gallery_idx] + content[end_idx:]
    
    # Insert after Temporadas block
    temporadas_end_marker = "            </div>\n          </div>\n        </div>"
    insert_idx = content.find(temporadas_end_marker)
    if insert_idx != -1:
        # Find the end of the col-span-2 div
        actual_insert_idx = insert_idx + len("            </div>\n          </div>\n")
        content = content[:actual_insert_idx] + gallery_block + content[actual_insert_idx:]
        print("Moved and updated gallery block")
    else:
        print("Could not find insert location")
else:
    print("Could not find gallery block")

with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
    f.write(content)
