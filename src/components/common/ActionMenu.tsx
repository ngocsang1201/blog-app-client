import { Drawer, MenuItem, MenuList, PopperProps } from '@mui/material';
import { useCustomMediaQuery } from '~/hooks/common';
import { MenuOption } from '~/models';
import { PopperWrapper } from '.';
import { ReactNode } from 'react';

export interface ActionMenuProps extends PopperProps {
  menu: MenuOption[];
  onClose?: () => void;
}

export function ActionMenu(props: ActionMenuProps) {
  const { menu, onClose, ...rest } = props;

  const handleClick = (callback?: () => void) => () => {
    onClose?.();
    callback?.();
  };

  return (
    <ActionMenuWrapper onClose={onClose} {...rest}>
      {menu.map(({ label, icon: Icon, onClick, show = true }, idx) =>
        show ? (
          <MenuItem
            key={idx}
            onClick={handleClick(onClick)}
            sx={{
              py: 1.5,
              px: 2.5,
              fontSize: 15,
            }}
          >
            {Icon && <Icon sx={{ mr: 2, fontSize: 18 }} />}
            {label}
          </MenuItem>
        ) : null
      )}
    </ActionMenuWrapper>
  );
}

interface ActionMenuWrapperProps extends Partial<ActionMenuProps> {
  children?: ReactNode;
}

function ActionMenuWrapper(props: ActionMenuWrapperProps) {
  const { open = false, onClose, children, ...rest } = props;

  const smUp = useCustomMediaQuery('up', 'sm');

  if (smUp) {
    return (
      <PopperWrapper open={open} onClose={onClose} {...rest}>
        <MenuList disablePadding>{children}</MenuList>
      </PopperWrapper>
    );
  }

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
        },
      }}
    >
      <MenuList
        sx={{
          '& .MuiMenuItem-root': {
            px: 3,
          },
        }}
      >
        {children}
      </MenuList>
    </Drawer>
  );
}
