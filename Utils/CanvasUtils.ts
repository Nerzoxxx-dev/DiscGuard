export function applyText(canvas, text: string, fontSize: number, fontName: string = 'sans-serif'){
  const context = canvas.getContext('2d')
  do {
    context.font = `${fontSize -= 10}px ${fontName}`
  }while(context.measureText(text).width > canvas.width - 300)
  return context.font
}