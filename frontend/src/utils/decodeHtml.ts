export function decodeHtml(html: string) {
  if (!html) {
    return '';
  }
  // 1. 이스케이프 문자열을 실제 문자로 변환 (예: "\\n" -> "\n")
  // `JSON.parse`는 이스케이프 문자를 안전하게 처리하는 좋은 방법입니다.
  // 단, 전체 문자열이 유효한 JSON 문자열이어야 합니다.
  try {
    // 만약 `html` 문자열이 큰따옴표로 감싸져 있지 않다면, JSON.parse를 위해 추가
    // JSON.parse는 이스케이프 문자를 자동으로 처리해 줍니다.
    const unescapedString = JSON.parse(`"${html}"`);
    html = unescapedString;
  } catch {
    return; 
  }

  // 2. HTML 엔티티를 디코딩
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.documentElement.textContent;
}