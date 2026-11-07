import { useRef } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import BlindsPage from './pages/BlindsPage.jsx';
import { useSmoothScroll, usePageMotion } from './useSiteMotion';
import './index.css';
import './pages/blinds.css';

function Client() {
  const scope = useRef(null);
  useSmoothScroll();
  usePageMotion(scope);
  return <div ref={scope}><BlindsPage /></div>;
}

const root = document.getElementById('root');
if (root.hasChildNodes()) hydrateRoot(root, <Client />);
else createRoot(root).render(<Client />);
