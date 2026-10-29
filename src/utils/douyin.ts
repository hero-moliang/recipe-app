/**
 * Extract Douyin URL from share text
 * Supports formats like:
 * - "6.23 HIC:/ 复制打开抖音... https://v.douyin.com/xxxxx/"
 * - "https://v.douyin.com/xxxxx"
 * - "https://www.douyin.com/video/xxxxx"
 */
export function extractDouyinUrl(text: string): string | null {
  const patterns = [
    /https?:\/\/v\.douyin\.com\/[A-Za-z0-9]+\/?/,
    /https?:\/\/www\.douyin\.com\/video\/\d+/,
    /https?:\/\/v\.douyin\.com\/[A-Za-z0-9]+[^\s]*/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].replace(/[\/;:,。，！!？?]+$/, ''); // trim trailing punctuation
    }
  }
  return null;
}

/**
 * Try to open a Douyin URL
 * Attempts: iframe embed -> new window -> copy link fallback
 */
export function openDouyinUrl(url: string): void {
  // Try opening in a new window/tab
  // On mobile, this may trigger the Douyin app via deep link
  window.open(url, '_blank', 'noopener,noreferrer');
}
