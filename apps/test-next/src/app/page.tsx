'use client'

import { useState } from 'react'
import { decodeQr } from 'decoder-qr-pago-movil'
import { Button } from '@/components/ui/button'

const PAYLOADS = [
  { label: 'QR #1 - AES 0114', value: '9fbRuC0tEp6n0rkkRa2TgAH55doZlBgAK1V9MWslgy5pCNLpLLQybP50FiM/5Dqta9hjUAC1LUyTsR/F4+pCpz1gUleC890g2o4E/V/RU8ztkNOxtspdVBRMt5poi4lYNefnkpkz6udpDD66oRR2DRwFzIpMcrWt9Lb5IVDyL1BtJtJd3WvZH0J0LsJGX7O86rIpQyj/X0txKu6GyKH8WA==?merchantId=0114&strong_id=1784217050' },
  { label: 'QR #2 - RSA 0174', value: 'gB88aL3CUERepSTW53QXcYVDP8wpjOm4gR37ktHh854bWeBE3gb/AGjf0JtOYHeRswp62Du2pLRoVw9HiyfUBXrvERIiVaXPsrNXf7+K4uHRW+lFoZbrPhyewkM22hZRztQcd8WvfCe6+pXIvcc4W4Apzw8Llo2D47Hu8fhNPJQvx/lLU4ieUV6ocESXox7oe5blQwxfDj39WJUwkme1tnB34/elsXYaDWzhMONboLsKfDuJjHBR29HYWvAK+ybSMk2DqO4YyyMg4FZNzLSKfs+xgRMPwRgjeWfl+y5QTKAWgutFpzQkmC40mmLBkq+BQwnV0RFtPNm6EuNm9X+Ulw==?merchantId=0174&strong_id=1784728017&origin=web' },
  { label: 'QR #3 - AES 0191', value: '0qulBU0rBIKWt0pNRTm4thyvFWWkIE/7Uq+Jl+lw4WkLGfFCqAUzjvJqV/fUePYnRpeWmsJVXvvO9CjAka/mzlss2DwZIUoPfM6mkMZ/XhqUKZIjIv/68NAT864eghUXVn7sLYGvTfSJg23awA54zwe4obqRn2bGA+zdU//OFO/B8eyHlhaWOrT2i+8ellTuXp4OIhZNivNu35YuGNVanA==?merchantId=0191&strong_id=1784754275' },
  { label: 'QR #4 - RSA 0105', value: 'm28tuwbizhMer7LqTrXDR390LJYTLTMLxvAojSnPrZ2ese+vGGypN/1IfjBJVQyduC5qN+Hvyqa8FzYoP1xntmkI7PU6HlnAEpYgEZ1TSahnec0Ctt1Tpg3gK3rTG0ay5ST8h24YHsc6Q4aZtmxdLjtKyeChlbRhqq6v8e9qNlrpc/2nZ6HV0a1mcIOz7qm4GgpPQMaHW5ywzkuWE0ps9fMB9kCiyGPNj6G0SZomROybsNlMDevCMdpbGyz5w84MxNdomJwEgy8qhBYgKSEPlCn/cCmAdeZCtyFypu6Tr1tDgrlL0kLNRrv2CQKkLw3uHx8zxZohwuu3Cau0io4elA==?merchantId=0105&strong_id=260722171116&origin=web' },
]

export default function Home() {
  const [results, setResults] = useState<Record<number, any>>({})

  const decode = (i: number) => {
    try {
      const r = decodeQr(PAYLOADS[i].value)
      setResults(p => ({ ...p, [i]: r }))
    } catch (e: any) {
      setResults(p => ({ ...p, [i]: { error: e.message } }))
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 font-mono">
      <h1 className="text-2xl font-bold mb-1">BNC QR Decoder</h1>
      <p className="text-muted-foreground mb-6">Test en Next.js + shadcn/ui</p>

      {PAYLOADS.map((p, i) => (
        <div key={i} className="border rounded-lg p-4 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{p.label}</span>
            <Button size="sm" onClick={() => decode(i)}>
              Decodificar
            </Button>
          </div>
          {results[i] && !results[i].error && (
            <div className="bg-muted p-3 rounded text-sm space-y-1">
              <div>dni: <span className="font-bold">{results[i].dni}</span></div>
              <div>phone: <span className="font-bold">{results[i].phone}</span></div>
              <div>bank: <span className="font-bold">{results[i].bank}</span></div>
              <div>name: <span className="font-bold">{results[i].name}</span></div>
            </div>
          )}
          {results[i]?.error && <p className="text-destructive text-sm">{results[i].error}</p>}
        </div>
      ))}
    </div>
  )
}
