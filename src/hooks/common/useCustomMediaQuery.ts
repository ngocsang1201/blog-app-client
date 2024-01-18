import { Breakpoint, Theme, useMediaQuery } from '@mui/material';

export function useCustomMediaQuery(upDown: 'up' | 'down', breakpoint: Breakpoint) {
  return useMediaQuery<Theme>((theme) => theme.breakpoints[upDown](breakpoint));
}
