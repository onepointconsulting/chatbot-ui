export function extractPdfs(source: string): string[] {
  let start = 0;
  const ending = '.pdf';
  const res: string[] = [];
  for (let i = ending.length; i < source.length; i++) {
    if (source.substring(i + 1 - ending.length, i + 1) === ending) {
      let pdfFile = source.substring(start, i + 1);
      let sepPos = pdfFile.indexOf(',');
      if (sepPos < 0) {
        sepPos = pdfFile.indexOf(';');
      }
      if (sepPos > 0) {
        pdfFile = pdfFile.substring(sepPos);
      }
      res.push(pdfFile.trim());
      start = i + 1;
    }
    if (source[i] === ',' || source[i] === ';') {
      start = i + 1;
    }
  }
  return res;
}

function replaceAll(str: string, search: string, replacement: string): string {
  return str.split(search).join(replacement);
}

export function injectSourceLinks(
  source: string,
  uploadedFiles: string[],
  sourceDownloadUrl: string = window.chatConfig.sourceDownloadUrl,
): string {
  const pdfs = uploadedFiles.length > 0 ? uploadedFiles : extractPdfs(source);
  let res = source;
  for (const pdf of pdfs) {
    res = replaceAll(
      res,
      pdf,
      `<a href="${sourceDownloadUrl}/${encodeURIComponent(
        pdf.trim(),
      )}" target="_blank" class="underline font-bold">${pdf}</a>`,
    );
  }
  return res;
}
