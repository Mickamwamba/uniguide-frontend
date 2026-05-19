export function renderInlineMarkdown(text) {
    if (!text) return text;
    const parts = [];
    const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
        if (match[0].startsWith('**')) {
            parts.push(<strong key={match.index}>{match[2]}</strong>);
        } else {
            parts.push(<em key={match.index}>{match[3]}</em>);
        }
        lastIndex = pattern.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
}
