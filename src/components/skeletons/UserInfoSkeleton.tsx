import { Box, Stack } from '@mui/material';
import { themeMixins } from '~/utils/theme';
import { StyledSkeleton } from './StyledSkeleton';

export function UserInfoSkeleton() {
  return (
    <Box
      sx={{
        ...themeMixins.getPaperStyles(),
        p: { xs: 1, sm: 2 },
        mb: 2,
      }}
    >
      <Stack alignItems="center" position="relative">
        <StyledSkeleton
          variant="circular"
          sx={{
            width: { xs: 60, sm: 100 },
            height: { xs: 60, sm: 100 },
          }}
        />

        <Box ml={3} flexGrow={1}>
          <StyledSkeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
          <StyledSkeleton variant="text" width="30%" height={16} sx={{ mb: 1 }} />
          <StyledSkeleton variant="text" width="50%" height={12} />
        </Box>
      </Stack>
      <StyledSkeleton variant="text" width="100%" height={20} sx={{ mt: 2 }} />
    </Box>
  );
}
