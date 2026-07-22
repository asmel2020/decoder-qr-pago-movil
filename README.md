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

Solo en la rama principal (`master`), después de mergear un PR.

### Requisito previo

Agregar el secret `NPM_TOKEN` en GitHub:

1. Ir a **Repo → Settings → Secrets and variables → Actions → New repository secret**
2. **Name:** `NPM_TOKEN`
3. **Value:** (el token npm que tenga permiso de publish con bypass 2FA)

### Pasos

### Con el script automático (recomendado)

Un solo comando desde la raíz. Verifica el working tree, bump, commit, tag y push:

```bash
bun run release          # patch (1.0.3 → 1.0.4)
bun run release:minor    # minor (1.0.3 → 1.1.0)
bun run release:major    # major (1.0.3 → 2.0.0)
```

### Manual paso a paso

```bash
# 1. Asegurarse de tener el working tree limpio
git status

# 2. Moverse al directorio del paquete
cd packages/decoder-qr-pago-movil

# 3. Actualizar versión y crear tag (patch / minor / major)
npm version patch

# 4. Volver a la raíz y subir commit + tag
cd ../..
git push --follow-tags
```

### Problemas comunes

**`npm version patch` falla con "Git working directory not clean"**
→ Hay cambios sin commitear. Hacer `git status`, commitear o stashear.

**`npm version patch` falla con "Unsupported URL Type workspace:*"**
→ Ignorar. El comando igual dejó la versión actualizada pero sin commit ni tag. Ejecutar manualmente:

```bash
git add packages/decoder-qr-pago-movil/package.json
git commit -m "chore: bump version a 1.0.X"
git tag v1.0.X
git push origin master && git push origin v1.0.X
```

**La Action no se activa**
→ El tag no llegó al remoto. Verificar con `git tag -l "v*"` y `git push origin v1.0.X`.

La Action se activa automáticamente al pushear un tag `v*` y publica a npm.
