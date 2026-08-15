import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import QRCode from "qrcode";
import { encodeQr, bankList } from "decoder-qr-pago-movil";

const PHONE_PREFIXES = ["0412", "0414", "0416", "0424", "0426"] as const;
const DNI_PREFIXES = ["V", "J", "G", "E"] as const;

const schema = z.object({
  bank: z.string().min(1, "Selecciona un banco"),
  phonePrefix: z.string().min(1, "Selecciona un prefijo"),
  phoneNumber: z
    .string()
    .length(7, "Debe tener 7 dígitos")
    .regex(/^\d{7}$/, "Solo números"),
  dniPrefix: z.enum(DNI_PREFIXES),
  dni: z
    .string()
    .min(5, "Mínimo 5 dígitos")
    .max(8, "Máximo 8 dígitos")
    .regex(/^\d+$/, "Solo números"),
  amount: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function GenerateQrTab() {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bank: "",
      phonePrefix: "",
      phoneNumber: "",
      dniPrefix: "V",
      dni: "",
      amount: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const phone = `58${data.phonePrefix.substring(1)}${data.phoneNumber}`;
      const encoded = encodeQr({
        dni: data.dni,
        prefix: data.dniPrefix,
        phone,
        bank: data.bank,
        ...(data.amount && { amount: data.amount }),
        ...(data.description && { description: data.description }),
      });
      setPayload(encoded);

      const url = await QRCode.toDataURL(encoded, {
        width: 280,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      setQrUrl(url);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = async () => {
    if (!payload) return;
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setQrUrl(null);
    setPayload(null);
    setError(null);
  };

  return (
    <div className="generate-tab">
      {!payload ? (
        <form onSubmit={handleSubmit(onSubmit)} className="generate-form">
          <div className="form-field">
            <label className="form-label">Banco</label>
            <Controller
              name="bank"
              control={control}
              render={({ field }) => (
                <select {...field} className="form-select">
                  <option value="" disabled>
                    Selecciona un banco
                  </option>
                  {bankList.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.bank && (
              <span className="form-error">{errors.bank.message}</span>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Teléfono</label>
            <div className="phone-group">
              <Controller
                name="phonePrefix"
                control={control}
                render={({ field }) => (
                  <select {...field} className="form-select phone-prefix">
                    <option value="" disabled>
                      —
                    </option>
                    {PHONE_PREFIXES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                )}
              />
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    maxLength={7}
                    className="form-input phone-number"
                    placeholder="0000000"
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      field.onChange(v);
                    }}
                  />
                )}
              />
            </div>
            {errors.phonePrefix && (
              <span className="form-error">{errors.phonePrefix.message}</span>
            )}
            {errors.phoneNumber && (
              <span className="form-error">{errors.phoneNumber.message}</span>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">DNI</label>
            <div className="phone-group">
              <Controller
                name="dniPrefix"
                control={control}
                render={({ field }) => (
                  <select {...field} className="form-select dni-prefix">
                    {DNI_PREFIXES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                )}
              />
              <Controller
                name="dni"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    className="form-input dni-number"
                    placeholder="12345678"
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      field.onChange(v);
                    }}
                  />
                )}
              />
            </div>
            {errors.dni && (
              <span className="form-error">{errors.dni.message}</span>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Monto (opcional)</label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  inputMode="decimal"
                  className="form-input"
                  placeholder="150,00"
                />
              )}
            />
            {errors.amount && (
              <span className="form-error">{errors.amount.message}</span>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">
              Descripción (opcional)
              <span className="form-hint"> — No todos los bancos la aceptan</span>
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="form-input"
                  placeholder="Pago de alquiler"
                />
              )}
            />
            {errors.description && (
              <span className="form-error">{errors.description.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="paste-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Generando..." : "Generar QR"}
          </button>
        </form>
      ) : (
        <div className="generate-result">
          <div className="qr-code-wrapper">
            {qrUrl && <img src={qrUrl} alt="QR generado" className="qr-image" />}
          </div>

          <div className="result-card">
            <div className="result-header">
              <div className="result-header-icon">✓</div>
              <div className="result-header-title">QR generado correctamente</div>
              <button
                className="result-header-copy"
                onClick={handleCopy}
                title="Copiar payload"
              >
                {copied ? "✓" : "📋"}
              </button>
            </div>
          </div>

          <div className="raw-section">
            <div className="raw-header">Payload del QR</div>
            <div className="raw-text">{payload}</div>
          </div>

          {error && <div className="error-card">{error}</div>}

          <button
            onClick={handleReset}
            className="dropzone"
            style={{
              marginTop: 24,
              padding: "16px 24px",
              borderStyle: "solid",
              cursor: "pointer",
            }}
          >
            <div className="dropzone-text">Generar otro QR</div>
          </button>
        </div>
      )}
    </div>
  );
}
