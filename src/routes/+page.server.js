import fs from 'fs';
import path from 'path';

export function load() {
	return { fs: fs.readdirSync('./src/entries').map((file) => path.parse(file).name) };
}
