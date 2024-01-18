import { MenuOutlined } from '@mui/icons-material';
import { Drawer, IconButton, Stack } from '@mui/material';
import { ReactNode } from 'react';
import { useCustomMediaQuery } from '~/hooks/common';
import { useAppDispatch } from '~/store/hooks';
import { configActions } from '~/store/slices/configSlice';
import { themeVariables } from '~/utils/theme';

interface SidebarWrapperProps {
  type: 'normal' | 'drawer';
  children: ReactNode;
  open: boolean;
  onClose?: () => void;
}

export function SidebarWrapper({ type, children, open, onClose }: SidebarWrapperProps) {
  const mdDown = useCustomMediaQuery('down', 'md');

  const dispatch = useAppDispatch();

  const toggleSidebar = () => {
    dispatch(configActions.toggleSidebar());
  };

  if (type === 'drawer' && mdDown) {
    return (
      <>
        <IconButton onClick={toggleSidebar}>
          <MenuOutlined />
        </IconButton>

        <Drawer anchor="left" open={open} onClose={onClose}>
          <Stack
            direction="column"
            sx={{
              position: 'relative',
              width: '75vw',
              maxWidth: 300,
              height: '100%',
              px: 1,
              pt: 3,
            }}
          >
            {children}
          </Stack>
        </Drawer>
      </>
    );
  }

  if (type === 'normal' && !mdDown) {
    const TOP_HEIGHT = themeVariables.headerHeight + 16;
    const BOTTOM = 16;
    return (
      <Stack
        component="aside"
        direction="column"
        sx={{
          position: 'sticky',
          top: TOP_HEIGHT,
          height: `calc(100vh - ${TOP_HEIGHT}px - ${BOTTOM}px)`,
        }}
      >
        {children}
      </Stack>
    );
  }

  return null;
}
