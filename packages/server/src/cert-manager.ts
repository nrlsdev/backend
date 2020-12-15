import { readFileSync } from 'fs';
import { join } from 'path';

const certDir: string =
  process.env.NODE_ENV === 'development' ? 'development' : 'production';

export function getSSLCert(certName: string) {
  return readFileSync(
    join(__dirname, 'certs', certDir, `${certName}.crt`),
    'utf8',
  ).replace(new RegExp('\\\\n', 'g'), '\n');
}

export function getSSLKey(certKey: string) {
  return readFileSync(
    join(__dirname, 'certs', certDir, `${certKey}.key`),
    'utf8',
  ).replace(new RegExp('\\\\n', 'g'), '\n');
}
