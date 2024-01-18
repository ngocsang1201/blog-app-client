import { Box, Container, LinearProgress, Stack } from '@mui/material';
import { useGlobalStore } from '~/store';
import { themeMixins, themeVariables } from '~/utils/theme';
import { Brand, SearchBox, Sidebar, UserActions } from '.';

export function Header() {
  const loading = useGlobalStore((state) => state.loading);

  return (
    <Box
      component="header"
      sx={{
        ...themeMixins.getPaperStyles(),
        borderWidth: ' 0 0 1px',
        position: 'sticky',
        zIndex: 'appBar',
        top: 0,
        height: themeVariables.headerHeight,
        borderRadius: 0,
      }}
    >
      {loading && (
        <Box position="absolute" top="0" width="100%">
          <LinearProgress sx={{ height: 3 }} />
        </Box>
      )}

      <Container sx={{ height: '100%' }}>
        <Stack justifyContent="space-between" height="100%" position="relative">
          <Stack spacing={2}>
            <Sidebar type="drawer" />
            <Brand />
          </Stack>

          <Stack spacing={2}>
            <SearchBox />
            <UserActions />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
