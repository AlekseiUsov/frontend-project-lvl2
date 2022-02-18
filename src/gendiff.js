import fs from 'fs';
import _ from 'lodash';
import { isAbsolute, resolve } from 'path';

const parseFile = (filepath) => {
  const path = isAbsolute(filepath) ? filepath : resolve(filepath);
  const file = fs.readFileSync(path, 'utf-8');
  return JSON.parse(file);
};

const genDiff = (filepath1, filepath2) => {
  const file1 = parseFile(filepath1);
  const file2 = parseFile(filepath2);
  const commomObject = { ...file2, ...file1 };

  const lines = _.sortBy(Object.entries(commomObject))
    .reduce((acc, [key, value]) => {
      if (file1[key] === file2[key]) {
        acc[`  ${key}`] = value;
      } else if (file1[key] !== file2[key]) {
        acc[`- ${key}`] = file1[key];
        acc[`+ ${key}`] = file2[key];
      } else if (_.has(file1, key)) {
        acc[`- ${key}`] = value;
      } else if (_.has(file2, key)) {
        acc[`+ ${key}`] = value;
      }
      return acc;
    }, {});
  const result = JSON.stringify(lines, null, 2);
  return result.replace(/"/g, '').replace(/,/g, '');
};

export default genDiff;
