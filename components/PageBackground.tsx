/** Fondo fijo: gradiente azul tecnológico + glows celeste/dorado (estilo PowerShell / Azure). */
export function PageBackground() {
  const glows = [
    { top: '0%', side: 'left' as const, color: '59, 201, 244', size: 'min(90vw, 720px)' },
    { top: '20%', side: 'right' as const, color: '27, 140, 255', size: 'min(85vw, 680px)' },
    { top: '40%', side: 'left' as const, color: '0, 120, 212', size: 'min(80vw, 640px)' },
    { top: '58%', side: 'right' as const, color: '91, 200, 255', size: 'min(85vw, 680px)' },
    { top: '76%', side: 'left' as const, color: '212, 175, 55', size: 'min(75vw, 560px)' },
    { top: '90%', side: 'right' as const, color: '59, 201, 244', size: 'min(90vw, 720px)' },
  ];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(165deg, #0a2340 0%, #0f3058 38%, #0e2d52 62%, #0c2848 100%)',
        }}
      />
      {glows.map((glow, index) => (
        <div
          key={index}
          className="absolute rounded-full blur-[100px] sm:blur-[120px]"
          style={{
            top: glow.top,
            left: glow.side === 'left' ? '-10%' : undefined,
            right: glow.side === 'right' ? '-10%' : undefined,
            width: glow.size,
            height: glow.size,
            background: `radial-gradient(circle, rgba(${glow.color}, 0.28) 0%, rgba(${glow.color}, 0.1) 45%, transparent 70%)`,
          }}
        />
      ))}
      <div
        className="absolute left-1/2 top-0 h-[min(65vh,560px)] w-[min(110vw,860px)] -translate-x-1/2 rounded-full blur-[100px]"
        style={{
          background:
            'radial-gradient(ellipse, rgba(59, 201, 244, 0.22) 0%, rgba(27, 140, 255, 0.12) 45%, transparent 72%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
    </div>
  );
}
