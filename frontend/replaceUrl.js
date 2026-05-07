import fs from 'fs';
import path from 'path';

const srcDir = './src';
const searchString = 'http://localhost:5000';
const replacementString = '${import.meta.env.VITE_API_URL || \\\'http://localhost:5000\\\'}';

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // We want to replace 'http://localhost:5000...' with `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}...`
      // This means we need to change the surrounding quotes to backticks if they are single or double quotes.
      
      // Find all instances of 'http://localhost:5000...' or "http://localhost:5000..."
      const regex = /(['"])http:\/\/localhost:5000(.*?)\1/g;
      
      if (regex.test(content)) {
        content = content.replace(regex, (match, quote, rest) => {
          return `\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${rest}\``;
        });
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
      }
      
      // Also catch cases where it's already in backticks: `http://localhost:5000...`
      const backtickRegex = /`http:\/\/localhost:5000(.*?)`/g;
      if (backtickRegex.test(content)) {
         content = content.replace(backtickRegex, (match, rest) => {
            return `\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${rest}\``;
         });
         fs.writeFileSync(filePath, content, 'utf8');
         console.log(`Updated ${filePath} (backticks)`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Done replacing URLs');
