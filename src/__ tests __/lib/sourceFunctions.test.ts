import {extractPdfs, injectSourceLinks} from "../../lib/sourceFunctions.ts";

const input = "Onepoint - Transforming the data platform of TravelCo (Client credential).pdf, pages: [2]; Onepoint - Client story - Reaching for the skies (1).pdf, pages: [21, 1, 2, 3, 7, 8, 6, 11, 22, 12, 13, 18, 19]"

test('extractPdfs', () => {
  const extracted = extractPdfs(input)
  expect(extracted.length).toBe(2)
})

test('injectSourceLinks', () => {
  const res = injectSourceLinks(input, "http://localhost:3000")
  expect(res.includes("<a ")).toBe(true)
})