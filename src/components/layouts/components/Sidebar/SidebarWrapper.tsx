import { Drawer, Stack } from '@mui/material';
import { ReactNode } from 'react';
import { useCustomMediaQuery } from '~/hooks';
import { themeVariables } from '~/utils/theme';

interface SidebarWrapperProps {
  children: ReactNode;
  open: boolean;
  onClose?: () => void;
}

const SIDEBAR_TOP = themeVariables.headerHeight + 16;

export function SidebarWrapper({ children, open, onClose }: SidebarWrapperProps) {
  const mdDown = useCustomMediaQuery('down', 'md');

  if (mdDown) {
    return (
      <Drawer anchor="left" open={open} onClose={onClose}>
        <Stack
          direction="column"
          sx={{
            width: '75vw',
            maxWidth: 300,
            px: 1,
            pt: 3,
          }}
        >
          {children}
        </Stack>
      </Drawer>
    );
  }

  return (
    <Stack
      component="aside"
      direction="column"
      sx={{
        position: 'sticky',
        top: SIDEBAR_TOP,
        height: `calc(100vh - ${SIDEBAR_TOP}px)`,
      }}
    >
      {children}
    </Stack>
  );
}
