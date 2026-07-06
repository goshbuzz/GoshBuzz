const fs = require('fs');

let content = fs.readFileSync('src/data.ts', 'utf8');

const regex = /\{\s*id:\s*['"]([^'"]+)['"],(.*?)\}/gs;
content = content.replace(regex, (match, id, rest) => {
  if (match.includes('category:')) return match;
  
  let category = 'Essential';
  if (id.includes('idea')) {
    if (id === 'idea-1' || id === 'idea-4') category = 'Investment';
    else if (id === 'idea-2' || id === 'idea-8' || id === 'idea-15' || id === 'idea-16' || id === 'idea-17' || id === 'idea-28') category = 'Content Creation';
    else if (id === 'idea-3' || id === 'idea-11') category = 'E-commerce';
    else if (id === 'idea-7' || id === 'idea-12' || id === 'idea-13' || id === 'idea-19' || id === 'idea-25' || id === 'idea-29') category = 'Marketing';
    else if (id === 'idea-6' || id === 'idea-9' || id === 'idea-26' || id === 'idea-30') category = 'Tech & AI';
    else category = 'Freelancing'; 
  } else {
    if (id === 'skill-1' || id === 'skill-28') category = 'Tech & AI';
    else if (id === 'skill-2' || id === 'skill-9' || id === 'skill-13' || id === 'skill-19' || id === 'skill-24') category = 'Security';
    else if (id === 'skill-3' || id === 'skill-15' || id === 'skill-17' || id === 'skill-21') category = 'Communication';
    else if (id === 'skill-7' || id === 'skill-16' || id === 'skill-18' || id === 'skill-22' || id === 'skill-27') category = 'Productivity';
    else if (id === 'skill-4' || id === 'skill-5' || id === 'skill-6' || id === 'skill-25' || id === 'skill-29' || id === 'skill-30') category = 'Business';
    else category = 'Essential';
  }

  return `{ id: '${id}', category: '${category}',${rest}}`;
});

fs.writeFileSync('src/data.ts', content);
