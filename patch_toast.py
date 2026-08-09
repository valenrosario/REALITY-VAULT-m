import sys

with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

target = """  return (
    <ConfirmContext.Provider value={requestConfirm}>
      <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">"""

replacement = """  return (
    <ToastContext.Provider value={showToast}>
    <ConfirmContext.Provider value={requestConfirm}>
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-[9999] px-6 py-3 rounded-2xl shadow-xl border font-bold text-sm transition-all animate-in fade-in slide-in-from-top-5 ${toastMessage.type === 'success' ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600'}`}>
          {toastMessage.msg}
        </div>
      )}
      <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">"""

if target in content:
    content = content.replace(target, replacement)
    
    # Also we need to close ToastContext.Provider at the end of the file.
    # Where does ConfirmContext.Provider close?
    
    with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Target not found")
