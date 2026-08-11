// Engine-level contracts shared by every mode implementation.

import type { ModeOpts } from './profiles';

export type { Dot, Line, Rgb } from './core';

/** One frame painter: draws a mode into a 2D context at CSS-px `size`. */
export type ModeDraw = (
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  dark: boolean,
  opts: ModeOpts,
  rgb: Rgb | null
) => void;
