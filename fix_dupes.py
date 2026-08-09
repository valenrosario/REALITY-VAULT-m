with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Replace duplicate declarations
content = content.replace(
"""  const showToast = useContext(ToastContext);
  const showToast = useContext(ToastContext);""",
"""  const showToast = useContext(ToastContext);"""
)

with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
    f.write(content)
