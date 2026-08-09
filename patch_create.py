import re
with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

target = """  const createNewSeries = async () => {
    const newId = `serie-${Date.now()}`;
    const newSeriesObj: Series = {"""

replacement = """  const createNewSeries = async () => {
    const PLACEHOLDERS = [
      "https://res.cloudinary.com/hf3ijl6p/image/upload/v1786260552/POSTER_PLACEHOLDER_rcprmd.png",
      "https://res.cloudinary.com/hf3ijl6p/image/upload/v1786260552/POSTER_PLACEHOLDER_3_nps6pv.png",
      "https://res.cloudinary.com/hf3ijl6p/image/upload/v1786260552/POSTER_PLACEHOLDER_2_jpmeco.png",
      "https://res.cloudinary.com/hf3ijl6p/image/upload/v1786260552/POSTER_PLACEHOLDER_1_cpamop.png"
    ];
    const randomPlaceholder = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];
    const newId = `serie-${Date.now()}`;
    const newSeriesObj: Series = {"""

if target in content:
    content = content.replace(target, replacement)
    
    # also replace the coverImage and bannerImage
    content = content.replace(
        "coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',",
        "coverImage: randomPlaceholder,"
    )
    content = content.replace(
        "bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',",
        "bannerImage: randomPlaceholder,"
    )
    with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
        f.write(content)
    print("Patched createNewSeries")
else:
    print("Target not found")
