import { AutorenewRounded, ErrorRounded, TaskAltRounded } from '@mui/icons-material';
import { Box, Button, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '~/api';
import { usePageTitle } from '~/hooks/common';
import { themeMixins } from '~/utils/theme';
import { showToast } from '~/utils/toast';

enum Status {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

const statusOptions = {
  [Status.PENDING]: {
    color: 'warning.main',
    icon: AutorenewRounded,
  },
  [Status.SUCCESS]: {
    color: 'success.main',
    icon: TaskAltRounded,
  },
  [Status.ERROR]: {
    color: 'error.main',
    icon: ErrorRounded,
  },
};

export function ActiveAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = queryString.parse(location.search)?.token as string;

  const { t } = useTranslation('activeAccount');

  const [status, setStatus] = useState<Status>(Status.PENDING);
  const [submitting, setSubmitting] = useState(false);

  const statusObject = useMemo(() => statusOptions[status], [status]);

  usePageTitle(t('pageTitle'));

  useEffect(() => {
    (async () => {
      try {
        await authApi.active(token);
        setStatus(Status.SUCCESS);
      } catch (error) {
        setStatus(Status.ERROR);
      }
    })();
  }, [token]);

  const handleClick = async () => {
    if (status === Status.SUCCESS) {
      navigate('/login', { replace: true });
      return;
    }

    await reactiveAccount();
  };

  const reactiveAccount = async () => {
    setSubmitting(true);
    try {
      const { _id }: { _id: string } = jwtDecode(token);
      await authApi.reactive(_id);
      showToast('checkEmail', 'info');
    } catch (error) {}
    setSubmitting(false);
  };

  const renderStatusIcon = () => {
    const StatusIcon = statusObject.icon;
    return (
      <StatusIcon
        fontSize="medium"
        color="inherit"
        className={`${status === Status.PENDING ? 'spin' : ''}`}
      />
    );
  };

  return (
    <Container maxWidth="sm">
      <Box mt={3} p={3} sx={{ ...themeMixins.getPaperStyles() }}>
        <Stack spacing={1} color={statusObject.color}>
          {renderStatusIcon()}

          <Typography color="inherit" fontSize={20} fontWeight={600}>
            {t(`status.${status}`)}
          </Typography>
        </Stack>

        {status !== Status.PENDING && (
          <Button
            variant="contained"
            size="small"
            disabled={submitting}
            startIcon={submitting && <CircularProgress size={14} />}
            onClick={handleClick}
            sx={{
              mt: 2,
              bgcolor: statusObject.color,
            }}
          >
            {t(`button.${status}`)}
          </Button>
        )}
      </Box>
    </Container>
  );
}
