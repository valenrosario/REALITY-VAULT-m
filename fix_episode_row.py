with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

target = """const EpisodeRow = ({ 
  episode, 
  index, 
  onMoveUp, 
  onMoveDown, 
  onRemove, 
  onChange 
}: { 
  episode: Episode, 
  index: number, 
  onMoveUp: () => void, 
  onMoveDown: () => void, 
  onRemove: () => void, 
  onChange: (e: Episode) => void 
}) => {
  const [isUploading, setIsUploading] = useState(false);"""

replacement = """const EpisodeRow = ({ 
  episode, 
  index, 
  onMoveUp, 
  onMoveDown, 
  onRemove, 
  onChange 
}: { 
  episode: Episode, 
  index: number, 
  onMoveUp: () => void, 
  onMoveDown: () => void, 
  onRemove: () => void, 
  onChange: (e: Episode) => void 
}) => {
  const showToast = useContext(ToastContext);
  const [isUploading, setIsUploading] = useState(false);"""

if target in content:
    content = content.replace(target, replacement)
    print("Patched EpisodeRow")
else:
    # Just try to find the start of EpisodeRow
    idx = content.find("const EpisodeRow = ")
    if idx != -1:
        arrow_idx = content.find("=>", idx)
        brace_idx = content.find("{", arrow_idx)
        pre = content[:brace_idx+1]
        post = content[brace_idx+1:]
        content = pre + '\n  const showToast = useContext(ToastContext);' + post
        print("Patched EpisodeRow manually")

with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
    f.write(content)
