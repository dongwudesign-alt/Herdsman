// Bundle entry: exposes ThinkingOrb for plain-HTML usage.
// Builds to a self-contained IIFE (React inlined) via vite.config.bundle.ts
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ThinkingOrb } from './src';

export function mountOrb(container, props = {}) {
  const root = createRoot(container);
  root.render(createElement(ThinkingOrb, props));
  return root;
}

export { ThinkingOrb };
