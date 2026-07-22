# decoder-qr-pago-movil

Decodifica códigos QR del estándar **Suiche 7B** (Pago Móvil Interbancario). Extrae los datos del beneficiario: **dni, phone, bank, name**.

Compatible con más de **58 bancos**. Funciona en **Node.js**, **Bun** y **navegador** (React, Next.js, Vite).

## Instalación

```bash
bun add decoder-qr-pago-movil
# o
npm install decoder-qr-pago-movil
```

## Uso rápido

```ts
import { decodeQr } from 'decoder-qr-pago-movil'

const payload = '9fbRuC0tEp6n0rkkRa2TgAF5...?merchantId=0114&strong_id=1784217050'

const result = decodeQr(payload)
// {
//   dni:   'V18776649',
//   phone: '584263833791',
//   bank:  '0114',
//   name:  'Pinedas Velasquez Yesenia Del'
// }
```

## API

### `decodeQr(payload: string): QrData`

Parsea y descifra el QR. Retorna:

| Campo   | Tipo     | Ejemplo             |
|---------|----------|----------------------|
| `dni`   | `string` | `V18776649`          |
| `phone` | `string` | `584263833791`       |
| `bank`  | `string` | `0114`               |
| `name`  | `string` | `Pinedas Velasquez Yesenia Del` |

> El campo `id` del JSON original se mapea a `dni` y se le antepone `V` si no lo trae.

### `QrDecoder` (clase)

Para crear múltiples decodificadores o inyectar claves manualmente:

```ts
import { QrDecoder } from 'decoder-qr-pago-movil'

const decoder = new QrDecoder({ aesKeys, rsaKeys })
const result = decoder.decode(payload)
```

## Formatos

| Archivo | Formato | Target |
|---------|---------|--------|
| `dist/decoder-qr-pago-movil.js` | ESM | Node.js / Bun |
| `dist/decoder-qr-pago-movil.cjs` | CJS | Node.js |
| `dist/decoder-qr-pago-movil.browser.js` | ESM | Navegador / Vite / Next.js |

## Características

- 58+ bancos compatibles
- AES-256-CBC + RSA PKCS1 v1.5
- Sin dependencias nativas (usa `node-forge`)
- Funciona en cliente (browser) sin bundlers especiales
- Claves pre-procesadas (no necesita Blowfish en runtime)

## Licencia

MIT
