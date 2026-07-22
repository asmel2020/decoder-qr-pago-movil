# decoder-qr-pago-movil

Decodifica los códigos QR del estándar **Suiche 7B** (Pago Móvil Interbancario) y extrae los datos del beneficiario: **dni, phone, bank, name**.

Funciona en **Node.js**, **Bun**, y **navegador** (React, Next.js, Vite).

## Cómo funciona

Los QR de Suiche 7B contienen datos cifrados en Base64 con parámetros en la URL:

```
<base64>?merchantId=0114&strong_id=1784217050
<base64>?merchantId=0174&strong_id=1784728017&origin=web
```

El paquete:

1. **Deriva** las claves AES/RSA embebidas en el estándar (58 bancos compatibles)
2. **Decide algoritmo**: si `origin=web` usa RSA, si no usa AES-256-CBC
3. **Descifra** el payload y retorna `{ dni, phone, bank, name }`

## Instalación

```bash
bun add decoder-qr-pago-movil
# o
npm install decoder-qr-pago-movil
```

## Uso básico

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

### `createDecoderFromStrings(strings)`

Solo Node/Bun. Construye el decodificador desde los strings ofuscados originales:

```ts
import { createDecoderFromStrings } from 'decoder-qr-pago-movil'
import keysData from './keys.json'

const decoder = createDecoderFromStrings(keysData.strings)
```

## Formatos de distribución

| Archivo | Formato | Target |
|---------|---------|--------|
| `dist/decoder-qr-pago-movil.js` | ESM | Node.js / Bun |
| `dist/decoder-qr-pago-movil.cjs` | CJS | Node.js |
| `dist/decoder-qr-pago-movil.browser.js` | ESM | Navegador / Vite / Next.js |

## Características

- ✅ 58 bancos compatibles
- ✅ AES-256-CBC + RSA PKCS1 v1.5
- ✅ Sin dependencias nativas (usa `node-forge`)
- ✅ Funciona en cliente (browser) sin bundlers especiales
- ✅ Las claves vienen pre-procesadas (no necesita Blowfish en runtime)

## Licencia

MIT
