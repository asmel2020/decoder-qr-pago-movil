# decoder-qr-pago-movil

Monorepo del paquete `decoder-qr-pago-movil`.

## Estructura

```
├── apps/
│   ├── test-next/          # App Next.js de prueba
│   └── test-react/         # App React/Vite de prueba
├── packages/
│   └── decoder-qr-pago-movil/   # El paquete npm
└── .github/workflows/
    └── publish.yml         # CI para publicar a npm
```

## Desarrollo

```bash
bun install
```

### Apps de prueba

```bash
bun run dev:next    # Next.js
bun run dev:react   # React + Vite
```

### Build del paquete

```bash
bun run build:lib
```

Genera en `packages/decoder-qr-pago-movil/dist/`:
- `decoder-qr-pago-movil.js` (ESM Node/Bun)
- `decoder-qr-pago-movil.cjs` (CJS Node)
- `decoder-qr-pago-movil.browser.js` (ESM browser)
- `index.d.ts` + tipos (TypeScript)

## Publicar a npm

Solo en la rama principal, después de mergear un PR:

```bash
# 1. Actualizar versión y crear tag
npm version patch   # o minor / major

# 2. Subir commit + tag
git push --follow-tags
```

GitHub Actions publica automáticamente al detectar el tag `v*`.

Requiere el secret `NPM_TOKEN` configurado en el repo.
