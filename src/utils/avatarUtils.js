function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

const gradients = [
  'from-primary to-emerald-400',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-orange-400 to-pink-500',
  'from-cyan-400 to-blue-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-500',
];

export function getAvatarGradient(companyName) {
  const idx = hashCode(companyName) % gradients.length;
  return gradients[idx];
}

export function getInitials(companyName) {
  if (!companyName) return '?';
  const chinese = companyName.match(/[\u4e00-\u9fa5]/g);
  if (chinese) return chinese.slice(0, 1).join('');
  return companyName.charAt(0).toUpperCase();
}

const sourceOptions = ['内推', '官网', '猎头', 'Boss直聘', '拉勾', '牛客', '其他'];
export function getSourceTag(companyName) {
  const idx = hashCode(companyName) % sourceOptions.length;
  return sourceOptions[idx];
}

const sourceColors = {
  '内推': 'bg-blue-50 text-blue-500 border-blue-100',
  '官网': 'bg-purple-50 text-purple-500 border-purple-100',
  '猎头': 'bg-amber-50 text-amber-500 border-amber-100',
  'Boss直聘': 'bg-rose-50 text-rose-500 border-rose-100',
  '拉勾': 'bg-teal-50 text-teal-500 border-teal-100',
  '牛客': 'bg-indigo-50 text-indigo-500 border-indigo-100',
  '其他': 'bg-gray-50 text-gray-500 border-gray-100',
};

export function getSourceColor(source) {
  return sourceColors[source] || 'bg-gray-50 text-gray-500 border-gray-100';
}
