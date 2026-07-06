const fs = require('fs');
const files = ['src/pages/Home.tsx', 'src/pages/Product.tsx', 'src/pages/OrderTracking.tsx'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Simple replacements
  content = content.replace(/bg-white/g, 'bg-white dark:bg-gray-900');
  content = content.replace(/text-gray-900/g, 'text-gray-900 dark:text-gray-100');
  content = content.replace(/text-gray-600/g, 'text-gray-600 dark:text-gray-400');
  content = content.replace(/text-gray-500/g, 'text-gray-500 dark:text-gray-400');
  content = content.replace(/text-gray-700/g, 'text-gray-700 dark:text-gray-300');
  content = content.replace(/bg-gray-50/g, 'bg-gray-50 dark:bg-gray-800');
  content = content.replace(/bg-gray-100/g, 'bg-gray-100 dark:bg-gray-800');
  content = content.replace(/border-gray-100/g, 'border-gray-100 dark:border-gray-800');
  content = content.replace(/border-gray-200/g, 'border-gray-200 dark:border-gray-700');
  content = content.replace(/bg-amber-100/g, 'bg-amber-100 dark:bg-amber-900/30');
  content = content.replace(/text-amber-800/g, 'text-amber-800 dark:text-amber-300');
  content = content.replace(/bg-indigo-100/g, 'bg-indigo-100 dark:bg-indigo-900/30');
  content = content.replace(/text-indigo-800/g, 'text-indigo-800 dark:text-indigo-300');

  // For bg-white dark:bg-gray-900 dark:bg-gray-900 (in case it already had dark:bg-gray-900)
  content = content.replace(/dark:bg-gray-900 dark:bg-gray-900/g, 'dark:bg-gray-900');
  content = content.replace(/dark:text-gray-100 dark:text-gray-100/g, 'dark:text-gray-100');

  fs.writeFileSync(file, content);
}
console.log('Applied dark mode classes');
