/**
 * 주어진 ISBN 문자열에서 13자리 ISBN을 우선적으로 추출합니다.
 * 만약 13자리 ISBN이 없으면, 공백으로 분리된 첫 번째 ISBN을 반환합니다.
 *
 * @param {string} rawIsbn - 카카오 API 등에서 받아온 원본 ISBN 문자열 (예: "1186151684 9791186151686")
 * @returns {string} 추출된 주요 ISBN
 */
export const getPrimaryIsbn = (rawIsbn: string): string => {
  if (!rawIsbn) {
    console.warn("getPrimaryIsbn: rawIsbn is empty or null.", rawIsbn);
    return ""; // 또는 적절한 기본값/오류 처리
  }

  const isbns = rawIsbn.split(' ');
  
  // 13자리 ISBN을 우선적으로 찾습니다. (일반적으로 ISBN-13이 대표 ISBN)
  const primaryIsbn = isbns.find(part => part.length === 13);

  // 13자리 ISBN이 있다면 그것을 반환하고, 없다면 첫 번째 ISBN을 반환합니다.
  return primaryIsbn || isbns[0];
};