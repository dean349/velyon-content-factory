with open('src/components/PortfolioItemEditor.tsx', 'r') as f:
    lines = f.readlines()

depth = 0
for i, line in enumerate(lines, start=1):
    # Count opening divs
    opens = line.count('<div ')
    opens += line.count('<div>')
    opens += line.count('<div\\n')
    # Count closing divs
    closes = line.count('</div>')
    depth += opens - closes
    if depth > 0 and i >= 230 and i <= 330:
        print(f'{i}: depth={depth} | {line.rstrip()[:100]}')
