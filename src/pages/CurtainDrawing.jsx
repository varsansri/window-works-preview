import { UNIT_SHORT } from './common';

/* The customer's window, drawn to scale, with the chosen curtain hanging on it. */
export default function CurtainDrawing({ wFt, hFt, w, h, unit, id, name }) {
  const VW = 520; const VH = 430;
  const scale = Math.min((VW - 150) / Math.max(wFt, 8), (VH - 140) / Math.max(hFt, 8));
  const W = Math.max(wFt * scale, 26); const H = Math.max(hFt * scale, 26);
  const x = 90 + (VW - 130 - W) / 2; const y = 84 + (VH - 120 - H) / 2;
  const over = Math.max(W * 0.14, 12);
  const rodY = y - 14; const left = x - over; const right = x + W + over; const span = right - left;
  const recess = id === 'recess';
  const top = recess ? 12 : rodY; const bottom = recess ? VH - 8 : Math.min(y + H + 18, VH - 8);
  const sheer = id === 'sheers';
  const cloth = sheer ? '#FBF9F5' : '#E4CFA4';
  const fold = sheer ? '#D9D2C3' : '#9E7B32';
  const cover = sheer ? 0.5 : 0.27; // each side covers this share of the rod
  const pw = span * cover;
  const panel = (px, key) => {
    const lines = [];
    for (let i = 1, fx = px + 7; fx < px + pw - 3; i++, fx += 9) lines.push(<rect key={i} x={fx} y={top} width="2.5" height={bottom - top} fill={fold} opacity={sheer ? 0.55 : 0.4} />);
    return <g key={key} opacity={sheer ? 0.72 : 1}><rect x={px} y={top} width={pw} height={bottom - top} fill={cloth} />{lines}</g>;
  };
  const label = (v) => `${+Number(v).toFixed(2)} ${UNIT_SHORT[unit]}`;
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="block w-full h-auto" role="img" aria-label={`${name} on a window ${label(w)} wide and ${label(h)} tall, drawn to scale`}>
      {id === 'led' && <rect x={left} y={top - 10} width={span} height={26} fill="#F2D888" opacity=".55" filter="url(#glow)" />}
      <defs><filter id="glow" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="6" /></filter></defs>
      <rect x={x} y={y} width={W} height={H} fill="#5B76AD" />
      <rect x={x} y={y} width={W} height={H} fill="none" stroke="#fff" strokeWidth="5" />
      {recess && <rect x="0" y="0" width={VW} height="12" fill="#C9C2B4" />}
      <g key={id} className="draw-part">
        <g className="part-l">{panel(left, 'l')}</g>
        <g className="part-r">{panel(right - pw, 'r')}</g>
      </g>
      {!recess && <rect x={left - 6} y={rodY - 3} width={span + 12} height="5" fill={id === 'motorised' ? '#fff' : '#C59B63'} />}
      {id === 'eyelet' && Array.from({ length: 10 }, (_, i) => <circle key={i} cx={i < 5 ? left + 6 + i * (pw - 12) / 4 : right - pw + 6 + (i - 5) * (pw - 12) / 4} cy={rodY} r="4" fill="none" stroke="#7D5F22" strokeWidth="2" />)}
      {id === 'pleated' && Array.from({ length: 8 }, (_, i) => <rect key={i} x={(i < 4 ? left + 4 + i * (pw - 12) / 3 : right - pw + 4 + (i - 4) * (pw - 12) / 3)} y={rodY + 2} width="5" height="12" fill="#7D5F22" />)}
      {id === 'motorised' && <rect x={right - 4} y={rodY - 9} width="22" height="16" fill="#fff" stroke="#081C45" strokeWidth="1.5" />}
      <g stroke="#F2D888" strokeWidth="1.5">
        <line x1={x} x2={x + W} y1={y - 44} y2={y - 44} /><line x1={x} x2={x} y1={y - 51} y2={y - 37} /><line x1={x + W} x2={x + W} y1={y - 51} y2={y - 37} />
        <line x1={left - 26} x2={left - 26} y1={y} y2={y + H} /><line x1={left - 33} x2={left - 19} y1={y} y2={y} /><line x1={left - 33} x2={left - 19} y1={y + H} y2={y + H} />
      </g>
      <text x={x + W / 2} y={y - 53} textAnchor="middle" fill="#F2D888" fontSize="16" fontWeight="600" className="tabular-nums">{label(w)}</text>
      <text x={left - 38} y={y + H / 2} textAnchor="middle" fill="#F2D888" fontSize="16" fontWeight="600" transform={`rotate(-90 ${left - 38} ${y + H / 2})`}>{label(h)}</text>
    </svg>
  );
}

/* Why a 4 ft window takes about 8 ft of fabric: flat fabric above, the same fabric gathered into folds below. */
export function FoldDiagram({ fullness }) {
  const win = 150; const flat = win * fullness;
  const x0 = 40; const x1 = x0 + flat;
  const folds = 12; const step = win / folds;
  let d = `M${x0 + (flat - win) / 2} 196`;
  for (let i = 0; i < folds; i++) { const sx = x0 + (flat - win) / 2 + i * step; d += ` Q${sx + step / 2} ${i % 2 ? 214 : 178} ${sx + step} 196`; }
  const wx = x0 + (flat - win) / 2;
  return (
    <svg viewBox={`0 0 ${x1 + 40} 290`} className="block w-full h-auto" role="img" aria-label={`Flat fabric ${fullness} times the window width, gathered into folds across the window`}>
      <text x={x0} y="26" fill="#081C45" fontSize="16" fontWeight="600">Fabric laid flat: {fullness} × the width</text>
      <rect x={x0} y="40" width={flat} height="36" fill="#E4CFA4" />
      {Array.from({ length: Math.floor(flat / 18) }, (_, i) => <rect key={i} x={x0 + 9 + i * 18} y="40" width="2" height="36" fill="#9E7B32" opacity=".35" />)}
      <path d={`M${x0} 92 L${wx} 150 M${x1} 92 L${wx + win} 150`} stroke="#9E7B32" strokeWidth="1.5" strokeDasharray="4 5" fill="none" />
      <text x={wx + win / 2} y="140" textAnchor="middle" fill="#081C45" fontSize="16" fontWeight="600">Gathered on the rod</text>
      <path d={d} stroke="#9E7B32" strokeWidth="5" fill="none" strokeLinejoin="round" />
      <rect x={wx} y="224" width={win} height="12" fill="#5B76AD" />
      <g stroke="#081C45" strokeWidth="1.5"><line x1={wx} x2={wx + win} y1="250" y2="250" /><line x1={wx} x2={wx} y1="242" y2="258" /><line x1={wx + win} x2={wx + win} y1="242" y2="258" /></g>
      <text x={wx + win / 2} y="280" textAnchor="middle" fill="#081C45" fontSize="15" fontWeight="600">Window width</text>
    </svg>
  );
}
