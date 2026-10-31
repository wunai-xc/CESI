// src/app/lib/formatDate.ts
// 把 "YYYY-MM-DD" 格式化成 "2025年10月20日"。
// 纯字符串处理，不走 Date/时区，服务端与客户端结果完全一致。

export function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${year}年${Number(month)}月${Number(day)}日`;
}
