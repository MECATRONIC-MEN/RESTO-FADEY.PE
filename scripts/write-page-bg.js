const fs = require('fs');
const content = `/**
 * Fondo fijo de toda la pagina: color base constante + brillos alternados L/R al scroll.
 */
export function PageBackground() {
  const glows = [
    { top: '0%', side: 'left', color: '59, 130, 246', size: 'min(90vw, 720px)' },
    { top: '18%', side: 'right', color: '139, 92, 246', size: 'min(85vw, 680px)' },
    { top: '36%', side: 'left', color: '16, 185, 129', size: 'min(80vw, 640px)' },
    { top: '54%', side: 'right', color: '59, 130, 246', size: 'min(85vw, 680px)' },
    { top: '72%', side: 'left', color: '201, 162, 39', size: 'min(80vw, 640px)' },
    { top: '88%', side: 'right', color: '139, 92, 246', size: 'min(90vw, 720px)' },
  ];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #0f1219 0%, #0d1018 35%, #0e111a 65%, #0f1219 100%)',
        }}
      />
      {glows.map((glow, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-[100px] sm:blur-[120px]"
          style={{
            top: glow.top,
            left: glow.side === 'left' ? '-12%' : undefined,
            right: glow.side === 'right' ? '-12%' : undefined,
            width: glow.size,
            height: glow.size,
            background: \`radial-gradient(circle, rgba(\${glow.color}, 0.22) 0%, rgba(\${glow.color}, 0.08) 45%, transparent 70%)\`,
          }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-0 h-[min(70vh,600px)] w-[min(120vw,900px)] -translate-x-1/2 rounded-full blur-[100px]"
        style={{
          background:
            'radial-gradient(ellipse, rgba(59, 130, 246, 0.18) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)',
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </motion.div>
  );
}
`;
const fixed = content.replace(/<motion\.div/g, '<motion.div').replace(/<motion\.motion\.motion\.motion\.motion\.motion\.motion\.div/g, '<motion.div');
const fixed2 = fixed.replace(/<motion\.div/g, '<motion.div');
// Actually replace motion.div with div globally in this file
const out = content.replace(/<motion\.motion\.motion\.motion\.motion\.motion\.motion\.div/g, 'TEMP_DIV').replace(/<motion\.div/g, '<motion.div').replace(/<\\/motion\.motion\.motion\.motion\.motion\.motion\.motion\.motion\.div>/g, '</motion.div>');
fs.writeFileSync('components/PageBackground.tsx', content.replace(/motion\.div/g, 'div'));
console.log('done');
