import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: ['.next/**', 'out/**', '.source/**', '.cache/**', 'src/generated/**', 'next-env.d.ts', 'test-results/**', 'playwright-report/**'] }
];

export default config;
