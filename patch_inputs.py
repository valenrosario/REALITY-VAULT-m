import re

with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

string_array_input = """
const StringArrayInput = ({ label, value, onChange, placeholder }: { label: string, value: string[], onChange: (val: string[]) => void, placeholder?: string }) => {
  const [localVal, setLocalVal] = useState(value?.join(', ') || '');
  
  useEffect(() => {
    setLocalVal(value?.join(', ') || '');
  }, [value]);

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</label>
      <input 
        type="text" 
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={() => onChange(localVal.split(',').map(t => t.trim()).filter(Boolean))}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
      />
    </div>
  );
};
"""

# Insert `StringArrayInput` before `const SeriesEditor`
idx = content.find("const SeriesEditor = ")
if idx != -1:
    content = content[:idx] + string_array_input + content[idx:]

# Replace tags input
tags_target = """              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Tags (Separados por coma)</label>
                <input 
                  type="text" 
                  value={formData.tags.join(', ')} 
                  onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})} 
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                />
              </div>"""
tags_replacement = """              <StringArrayInput 
                label="Tags (Separados por coma)" 
                value={formData.tags} 
                onChange={val => setFormData({...formData, tags: val})} 
              />"""
content = content.replace(tags_target, tags_replacement)

# Replace cast input
cast_target = """            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Protagonistas / Elenco (Separados por coma)</label>
              <input 
                type="text" 
                value={formData.cast?.join(', ') || ''} 
                onChange={e => setFormData({...formData, cast: e.target.value.split(',').map(t => t.trim())})} 
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
              />
            </div>"""
cast_replacement = """            <StringArrayInput 
              label="Protagonistas / Elenco (Separados por coma)" 
              value={formData.cast || []} 
              onChange={val => setFormData({...formData, cast: val})} 
            />"""
content = content.replace(cast_target, cast_replacement)

# Replace subtitles
subs_target = """                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subtítulos (Separados por coma)</label>
                  <input 
                    type="text" 
                    value={formData.subtitleLanguages?.join(', ') || ''} 
                    onChange={e => setFormData({...formData, subtitleLanguages: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                  />
                </div>"""
subs_replacement = """                <StringArrayInput 
                  label="Subtítulos (Separados por coma)" 
                  value={formData.subtitleLanguages || []} 
                  onChange={val => setFormData({...formData, subtitleLanguages: val})} 
                />"""
content = content.replace(subs_target, subs_replacement)

# Replace featureBadges
badges_target = """              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Feature Badges (Por coma)</label>
                <input 
                  type="text" 
                  value={(formData.featureBadges || []).join(', ')} 
                  onChange={e => setFormData({...formData, featureBadges: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} 
                  placeholder="Ej: HD, CC, 16+"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-500 text-sm text-slate-900" 
                />
              </div>"""
badges_replacement = """              <StringArrayInput 
                label="Feature Badges (Por coma)" 
                value={formData.featureBadges || []} 
                onChange={val => setFormData({...formData, featureBadges: val})} 
                placeholder="Ej: HD, CC, 16+"
              />"""
content = content.replace(badges_target, badges_replacement)

with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
    f.write(content)
print("Inputs replaced successfully")
