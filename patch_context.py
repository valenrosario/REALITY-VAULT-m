import re

with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

components = ['SeriesManager', 'BannersManager', 'BannerEditor', 'SeriesEditor', 'ImageUploader', 'SettingsManager']

for comp in components:
    # Find the declaration of the component
    match = re.search(r'(const ' + comp + r' = \([^)]*\) => \{)', content)
    if match:
        content = content.replace(match.group(1), match.group(1) + '\n  const showToast = useContext(ToastContext);')
        print(f"Patched {comp}")
    else:
        # Maybe it has types in props? Let's use a simpler approach:
        # Find `const CompName = `
        idx = content.find(f"const {comp} = ")
        if idx != -1:
            # find the first `{` after `=>`
            arrow_idx = content.find("=>", idx)
            if arrow_idx != -1:
                brace_idx = content.find("{", arrow_idx)
                if brace_idx != -1:
                    pre = content[:brace_idx+1]
                    post = content[brace_idx+1:]
                    content = pre + '\n  const showToast = useContext(ToastContext);' + post
                    print(f"Patched manually {comp}")

with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
    f.write(content)
import re
with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

idx = content.find("const ConfigManager = ")
if idx != -1:
    arrow_idx = content.find("=>", idx)
    brace_idx = content.find("{", arrow_idx)
    pre = content[:brace_idx+1]
    post = content[brace_idx+1:]
    content = pre + '\n  const showToast = useContext(ToastContext);' + post
    print("Patched ConfigManager")
    
    with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
        f.write(content)
