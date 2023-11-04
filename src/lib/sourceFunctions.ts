export function extractPdfs(source: string): string[] {
  const splits = source.split(';')
  const regex = /.+\.pdf/g
  return splits.flatMap(split => {
    const matches = split.match(regex)
    return matches || []
  })
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