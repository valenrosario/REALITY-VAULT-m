with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

target = """const SortableEpisodeCard: React.FC<{ 
  episode: Episode, 
  onChange: (ep: Episode) => void,
  onDelete: () => void 
}> = ({ episode, onChange, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: episode.id });"""

replacement = """const SortableEpisodeCard: React.FC<{ 
  episode: Episode, 
  onChange: (ep: Episode) => void,
  onDelete: () => void 
}> = ({ episode, onChange, onDelete }) => {
  const showToast = useContext(ToastContext);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: episode.id });"""

if target in content:
    content = content.replace(target, replacement)
    print("Patched SortableEpisodeCard")
else:
    print("SortableEpisodeCard target not found")

with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
    f.write(content)
