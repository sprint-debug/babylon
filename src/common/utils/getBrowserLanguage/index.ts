
export function getBrowserLanguage(defaultLng = 'jp') {
  if (navigator.language) {
    const lng = navigator.language;
    return lng.length > 2 ? lng.substring(0, 2) : lng;
  }
  else {
    // 기본값 일본어
    return defaultLng;
  }
}