import re

with open('src/components/admin/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# First replace all alert(...) with showToast(...) or showToast(..., 'error') if it says Error.
def replacer(match):
    msg = match.group(1)
    if 'Error' in msg or 'Fallo' in msg:
        return f"showToast({msg}, 'error')"
    else:
        return f"showToast({msg}, 'success')"

content = re.sub(r'alert\((.*?)\)', replacer, content)

# Now we need to inject `const showToast = useContext(ToastContext);` into all functional components that have `showToast`.
# Find all functional components: `const Name = (...) => {`
components = re.findall(r'const ([A-Z][a-zA-Z0-9_]*) = \([^{]*\) => \{', content)

for comp in components:
    # Find the body of the component and see if it contains showToast
    # This regex is a bit simplistic but works for finding the first brace
    pattern = r'(const ' + comp + r' = \([^{]*\) => \{)'
    
    # Check if this component actually has showToast
    comp_start = content.find(f"const {comp} = ")
    # Find next component start to limit the search
    next_comp_match = re.search(r'\nconst [A-Z]', content[comp_start+10:])
    comp_end = comp_start + 10 + next_comp_match.start() if next_comp_match else len(content)
    
    comp_body = content[comp_start:comp_end]
    
    if 'showToast' in comp_body and 'useContext(ToastContext)' not in comp_body and comp != 'AdminDashboard':
        content = re.sub(pattern, r'\1\n  const showToast = useContext(ToastContext);', content)


with open('src/components/admin/AdminDashboard.tsx', 'w') as f:
    f.write(content)
print("Patched alerts successfully")
