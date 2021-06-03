import { readFileSync } from 'fs';
import { join } from 'path';

export function getCert(path: string, certName: string, certExtension: string) {
    return readFileSync(
        join(__dirname, path, `${certName}.${certExtension}`),
        'utf8',
    ).replace(new RegExp('\\\\n', 'g'), '\n');
}
