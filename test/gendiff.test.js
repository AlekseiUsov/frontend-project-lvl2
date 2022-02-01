import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/gendiff';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
console.log(genDiff('file1.json', 'file2.json'))

test('check diff', () => {
    const actual = genDiff('file1.json', 'file2.json');
    const plain = readFile('plain.txt');
    expect(actual).toEqual(plain);
});