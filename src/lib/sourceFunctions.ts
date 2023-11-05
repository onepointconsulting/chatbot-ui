export function extractPdfs(source: string): string[] {
  let start = 0
  const ending = ".pdf"
  const res: string[] = []
  for(let i = 0; i < source.length; i++) {
    if(i > ending.length && source.substring(i - ending.length, i) === ending) {
      let pdfFile = source.substring(start, i);
      let sepPos = pdfFile.indexOf(",");
      if(sepPos < 0) {
        sepPos = pdfFile.indexOf(";");
      }
      if(sepPos > 0) {
        pdfFile = pdfFile.substring(sepPos);
      }
      res.push(pdfFile)
      start = i + 1
    }
    if(source[i] === ',' || source[i] === ';') {
      start = i + 1
    }
  }
  return res
}

export function injectSourceLinks(source: string, sourceDownloadUrl: string = window.chatConfig.sourceDownloadUrl): string {
  const pdfs = extractPdfs(source)
  let res = source
  for(const pdf of pdfs) {
    res = res.replace(pdf,
      `<a href="${sourceDownloadUrl}/${encodeURIComponent(pdf.trim())}" target="_blank" class="underline font-bold">${pdf}</a>`)
  }
  return res
}