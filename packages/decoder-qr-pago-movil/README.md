# decoder-qr-pago-movil

Decodifica y codifica códigos QR del estándar **Suiche 7B** (Pago Móvil Interbancario). Extrae y genera datos del beneficiario: **dni, phone, bank, name, amount, description, bdv**.

Compatible con más de **58 bancos**. Funciona en **Node.js**, **Bun** y **navegador** (React, Next.js, Vite).

## Instalación

```bash
bun add decoder-qr-pago-movil
# o
npm install decoder-qr-pago-movil
```

## Uso rápido

### Decodificar

```ts
import { decodeQr } from "decoder-qr-pago-movil";

const payload =
  "9fbRuC0tEp6n0rkkRa2TgAF5...?merchantId=0114&strong_id=1784217050";

const result = decodeQr(payload);
// {
//   dni:   'V00000000',
//   phone: '584260000000',
//   bank:  '0114',
//   name:  'Marco Aurelio'
// }
```

### Codificar

```ts
import { encodeQr } from "decoder-qr-pago-movil";

const payload = encodeQr({
  dni: "12345678",
  prefix: "V", // opcional, por defecto "V" (válidos: V, J, G, E)
  phone: "584120000000",
  bank: "0114",
  name: "Pago de prueba",
  amount: "150,00",
});

// payload: "fXr5Kt...?merchantId=0114&origin=app"
```

## API

### `decodeQr(payload: string): QrData`

Parsea y descifra el QR. Retorna:

| Campo         | Tipo               | Ejemplo         |
| ------------- | ------------------ | --------------- |
| `dni`         | `string`           | `V00000000`     |
| `phone`       | `string`           | `584260000000`  |
| `bank`        | `string`           | `0114`          |
| `name`        | `string` (opcional) | `Marco Aurelio` |
| `amount`      | `string` (opcional) | `150,00`        |
| `description` | `string` (opcional) | `Pago alquiler` |
| `bdv`         | `string` (opcional) | `1234567890123456` |

> El campo `id` del JSON original se mapea a `dni` y conserva su prefijo de letra (V, J, G, E); si no trae prefijo se le antepone `V` por defecto.
> El campo `description` no es aceptado por todos los bancos. Verifica con tu entidad antes de usarlo.

### `encodeQr(data: QrData): string`

Genera un payload QR codificado con AES-256-CBC. `bank` es el código del merchant (mismo que `merchantId`). Todos los campos opcionales se incluyen solo si tienen valor.

| Campo         | Tipo    | Obligatorio |
| ------------- | ------- | ----------- |
| `dni`         | string  | Sí          |
| `phone`       | string  | Sí          |
| `bank`        | string  | Sí          |
| `prefix`      | string  | No          |
| `name`        | string  | No          |
| `amount`      | string  | No          |
| `description` | string  | No          |
| `bdv`         | string  | No          |

> El `dni` debe contener solo dígitos. El `prefix` es opcional y por defecto es `"V"`; solo se admiten `"V"`, `"J"`, `"G"` y `"E"` (se normaliza a mayúscula). Si pasas un prefijo no admitido lanza error.
> El `amount` se valida y auto-corrige automáticamente: `150` → `150,00`, `150.5` → `150,50`, `150.00` → `150,00`.
> El campo `description` no es aceptado por todos los bancos. Verifica con tu entidad antes de usarlo.

### `QrCodec` (clase)

Para crear múltiples codificadores/decodificadores o inyectar claves manualmente:

```ts
import { QrCodec } from "decoder-qr-pago-movil";

const codec = new QrCodec({ aesKeys, rsaKeys });
const result = codec.decode(payload);
const newPayload = codec.encode({ dni: "12345678", phone: "584120000000", bank: "0114" });
```

### Tipos

```ts
export interface QrData {
  dni: string;
  phone: string;
  bank: string;
  prefix?: string;
  name?: string;
  amount?: string;
  description?: string;
  bdv?: string;
}

export interface KeyMaps {
  aesKeys: Record<string, { key: string; iv: string }>;
  rsaKeys: Record<string, string>;
}
```

## Formatos

| Archivo                                 | Formato | Target                     |
| --------------------------------------- | ------- | -------------------------- |
| `dist/decoder-qr-pago-movil.js`         | ESM     | Node.js / Bun              |
| `dist/decoder-qr-pago-movil.cjs`        | CJS     | Node.js                    |
| `dist/decoder-qr-pago-movil.browser.js` | ESM     | Navegador / Vite / Next.js |

## Características

- 58+ bancos compatibles
- Decodificación AES-256-CBC + RSA PKCS1 v1.5
- Codificación AES-256-CBC con validación de montos
- Sin dependencias nativas (usa `node-forge`)
- Funciona en cliente (browser) sin bundlers especiales
- Claves pre-procesadas (no necesita Blowfish en runtime)

## Licencia

MIT
