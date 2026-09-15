import { useMemo } from 'react'
import { createQrMatrix } from '@/lib/qrCode'

interface QrCodeProps {
  value: string
  size?: number
  className?: string
  alt?: string
}

export function QrCode({ value, size = 220, className = '', alt = 'QR Code Pix' }: QrCodeProps) {
  const matrix = useMemo(() => {
    try {
      return createQrMatrix(value)
    } catch (err) {
      console.error('Erro ao gerar matriz do QR code:', err)
      return null
    }
  }, [value])

  if (!matrix) {
    return (
      <div
        className={`flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-xs text-white/50 ${className}`}
        style={{ width: size, height: size }}
      >
        QR Code indisponível
      </div>
    )
  }

  const moduleCount = matrix.length
  // Add a quiet zone border of 2 modules
  const margin = 2
  const totalUnits = moduleCount + margin * 2

  // Build SVG path for dark modules
  let path = ''
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (matrix[r][c]) {
        path += `M${c + margin},${r + margin}h1v1h-1z `
      }
    }
  }

  return (
    <div
      className={`inline-flex items-center justify-center p-3 sm:p-3.5 bg-white rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_25px_rgba(0,229,255,0.25)] border border-[#00E5FF]/40 ${className}`}
      role="img"
      aria-label={alt}
    >
      <svg
        viewBox={`0 0 ${totalUnits} ${totalUnits}`}
        width={size}
        height={size}
        className="w-full h-auto max-w-[220px] max-h-[220px] block"
        shapeRendering="crispEdges"
      >
        <rect width={totalUnits} height={totalUnits} fill="#FFFFFF" rx={1} />
        <path d={path} fill="#050A15" />
      </svg>
    </div>
  )
}
