import { describe, expect, it } from "bun:test";
import { decodeQr, encodeQr } from "../index";

describe("encodeQr + decodeQr round-trip", () => {
  it("datos básicos: dni, phone y bank", () => {
    const data = { dni: "12345678", phone: "584120000000", bank: "0114" as const };
    const payload = encodeQr(data);
    const decoded = decodeQr(payload);

    expect(decoded.dni).toBe("V12345678");
    expect(decoded.phone).toBe("584120000000");
    expect(decoded.bank).toBe("0114");
  });

  it("con amount válido (150,00)", () => {
    const data = { dni: "87654321", phone: "584140000000", bank: "0114" as const, amount: "150,00" };
    const payload = encodeQr(data);
    const decoded = decodeQr(payload);

    expect(decoded.dni).toBe("V87654321");
    expect(decoded.phone).toBe("584140000000");
    expect(decoded.bank).toBe("0114");
    expect(decoded.amount).toBe("150,00");
  });

  it("con amount + description", () => {
    const data = {
      dni: "11223344",
      phone: "584160000000",
      bank: "0114" as const,
      amount: "200,50",
      description: "Pago de prueba",
    };
    const payload = encodeQr(data);
    const decoded = decodeQr(payload);

    expect(decoded.dni).toBe("V11223344");
    expect(decoded.phone).toBe("584160000000");
    expect(decoded.bank).toBe("0114");
    expect(decoded.amount).toBe("200,50");
    expect(decoded.description).toBe("Pago de prueba");
  });

  it("con amount + bdv", () => {
    const data = {
      dni: "55667788",
      phone: "584180000000",
      bank: "0114" as const,
      amount: "50,00",
      bdv: "1234567890123456",
    };
    const payload = encodeQr(data);
    const decoded = decodeQr(payload);

    expect(decoded.dni).toBe("V55667788");
    expect(decoded.phone).toBe("584180000000");
    expect(decoded.bank).toBe("0114");
    expect(decoded.amount).toBe("50,00");
    expect(decoded.bdv).toBe("1234567890123456");
  });

  it("dni con letra lanza error (solo dígitos)", () => {
    const data = { dni: "V12345678", phone: "584120000000", bank: "0114" as const };
    expect(() => encodeQr(data)).toThrow("solo dígitos");
  });

  it("prefix opcional: por defecto V", () => {
    const data = { dni: "12345678", phone: "584120000000", bank: "0114" as const };
    const decoded = decodeQr(encodeQr(data));
    expect(decoded.dni).toBe("V12345678");
  });

  it("prefix J se respeta", () => {
    const data = { dni: "12345678", phone: "584120000000", bank: "0114" as const, prefix: "J" };
    const decoded = decodeQr(encodeQr(data));
    expect(decoded.dni).toBe("J12345678");
  });

  it("prefix E se respeta", () => {
    const data = { dni: "12345678", phone: "584120000000", bank: "0102" as const, prefix: "E" };
    const decoded = decodeQr(encodeQr(data));
    expect(decoded.dni).toBe("E12345678");
  });

  it("prefix inválido lanza error", () => {
    const data = { dni: "12345678", phone: "584120000000", bank: "0114" as const, prefix: "X" };
    expect(() => encodeQr(data)).toThrow("Prefijo de DNI no admitido");
  });

  it("dni sin prefijo V se agrega en decode", () => {
    const data = { dni: "12345678", phone: "584120000000", bank: "0114" as const };
    const payload = encodeQr(data);
    const decoded = decodeQr(payload);

    expect(decoded.dni).toBe("V12345678");
  });

  it("name opcional: se incluye si se pasa y se recupera en decode", () => {
    const data = {
      dni: "12345678",
      phone: "584120000000",
      bank: "0114" as const,
      name: "Marco Aurelio",
    };
    const payload = encodeQr(data);
    const decoded = decodeQr(payload);

    expect(decoded.dni).toBe("V12345678");
    expect(decoded.name).toBe("Marco Aurelio");
  });

  it("name opcional: no se incluye si no se pasa", () => {
    const data = { dni: "12345678", phone: "584120000000", bank: "0114" as const };
    const payload = encodeQr(data);
    const decoded = decodeQr(payload);

    expect(decoded.name).toBe("");
  });

  it("lanza error si amount es inválido en encode", () => {
    const data = {
      dni: "12345678",
      phone: "584120000000",
      bank: "0114" as const,
      amount: "0,00",
    };
    expect(() => encodeQr(data)).toThrow("Monto inválido");
  });

  it("round-trip con otro merchant (0105)", () => {
    const data = { dni: "99887766", phone: "584120000000", bank: "0105" as const };
    const payload = encodeQr(data);
    const decoded = decodeQr(payload);

    expect(decoded.dni).toBe("V99887766");
    expect(decoded.phone).toBe("584120000000");
    expect(decoded.bank).toBe("0105");
  });
});
