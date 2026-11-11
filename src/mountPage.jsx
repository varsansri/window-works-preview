// Starts an inner page in the browser: smooth scrolling, the page's motion, and the prerendered HTML brought to life.
import { useRef } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { useSmoothScroll, usePageMotion } from './useSiteMotion';
import './index.css';
import './pages/blinds.css';
import './pages/pages.css';

export default function mountPage(Page) {
  function Client() {
    const scope = useRef(null);
    useSmoothScroll();
    usePageMotion(scope);
    return <div ref={scope}><Page /></div>;
  }
  const root = document.getElementById('root');
  if (root.hasChildNodes()) hydrateRoot(root, <Client />);
  else createRoot(root).render(<Client />);
}
