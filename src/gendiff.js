import fs from 'fs';
import _ from 'lodash';
import { isAbsolute, resolve } from 'path';

const operators = {
    minus: '-',
    plus: '+'
};

const parseFile = (filepath) => {
    const path = isAbsolute(filepath) ? filepath : resolve(filepath);
    const file = fs.readFileSync(path, 'utf-8');
    return JSON.parse(file);
};

const genDiff = (filepath1, filepath2) => {
    const file1 = parseFile(filepath1);
    const file2 = parseFile(filepath2);

    const lines = _.sortBy(Object.entries({ ...file2, ...file1 }))
        .reduce((acc, [key, value]) => {
            if (_.has(file1, key) && _.has(file2, key)) {
                if (file1[key] === file2[key]) {
                    acc[`  ${key}`] = value;
                } else if (file1[key] !== file2[key]) {
                    acc[`${operators.minus} ${key}`] = file1[key];
                    acc[`${operators.plus} ${key}`] = file2[key];
                }
            } else {
                if (_.has(file1, key)) {
                    acc[`${operators.minus} ${key}`] = value;
                } else if (_.has(file2, key)) {
                    acc[`${operators.plus} ${key}`] = value;
                }
            }
            return acc;
        }, {});
    const result = JSON.stringify(lines, null, 2);
    return result.replace(/"/g, '').replace(/,/g, '');
}

export default genDiff;
