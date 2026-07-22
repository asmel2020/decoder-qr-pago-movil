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

Todos los comandos se ejecutan desde la **raíz del proyecto**, salvo que se indique lo contrario.

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
# 1. Moverse al directorio del paquete
cd packages/decoder-qr-pago-movil

# 2. Actualizar versión y crear tag (patch / minor / major)
npm version patch

# 3. Volver a la raíz y subir commit + tag
cd ../..
git push --follow-tags
```

GitHub Actions publica automáticamente al detectar el tag `v*`.

Requiere el secret `NPM_TOKEN` configurado en el repo.
