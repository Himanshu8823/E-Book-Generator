export function threeColumnHeaderFooter({ 
  left, 
  center, 
  right 
}: { 
  left: string; 
  center: string; 
  right: string;
}) {
  return (pageNumber: number, totalPages: number) => {
    const getValue = (val: string | undefined | null): string => {
      if (!val) return ''
      if (typeof val === 'function') return ''
      return val
        .replace(/\{page\}/g, String(pageNumber))
        .replace(/\{total\}/g, String(totalPages))
    }
    
    const leftValue = getValue(left)
    const centerValue = getValue(center)
    const rightValue = getValue(right)
    
    // If all values are empty, return empty string
    if (!leftValue && !centerValue && !rightValue) {
      return ''
    }

    return `
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        width: 100%;
      ">
        <div style="text-align: left;">${leftValue}</div>
        <div style="text-align: center;">${centerValue}</div>
        <div style="text-align: right;">${rightValue}</div>
      </div>
    `
  }
}
