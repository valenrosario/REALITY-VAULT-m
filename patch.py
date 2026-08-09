import sys

with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

target = """export const AdminDashboard = ({ onExit }: { onExit?: () => void }) => {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  
  const requestConfirm = (message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, message, onConfirm });
  };"""

replacement = """export const AdminDashboard = ({ onExit }: { onExit?: () => void }) => {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  const [toastMessage, setToastMessage] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  
  const requestConfirm = (message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, message, onConfirm });
  };
  
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({msg, type});
    setTimeout(() => setToastMessage(null), 3000);
  };"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Target not found")
