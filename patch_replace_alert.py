import re

with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Make sure we add `const showToast = useContext(ToastContext);` to the sub-components that use alert.
components = ['SeriesManager', 'BannerManager', 'SettingsManager']
for comp in components:
    target = f"const {comp} = ({{ "
    if target in content:
        print(f"Found {comp} with props")
    else:
        target = f"const {comp} = () => {{"
        if target in content:
            print(f"Found {comp} without props")

