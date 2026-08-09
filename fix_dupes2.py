with open('src/components/SeriesDetailView.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);""",
"""  const [activeTag, setActiveTag] = useState<string | null>(null);"""
)

with open('src/components/SeriesDetailView.tsx', 'w') as f:
    f.write(content)
