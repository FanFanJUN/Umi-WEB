import fs from 'fs';
import path from 'path';
import lessToJs from 'less-vars-to-js';

const themeConfig = () => {
  const themePath = path.join(__dirname, '../src/themes/default.less');
  return lessToJs(fs.readFileSync(themePath, 'utf8'));
};

export default themeConfig;
