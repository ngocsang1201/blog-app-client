import { AutorenewRounded, ErrorRounded, TaskAltRounded } from '@mui/icons-material';
import { Box, Button, CircularProgress, Container, Stack, Typography } from '@mui/material';
import clsx from 'clsx';
import jwtDecode from 'jwt-decode';
import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '~/api';
import { usePageTitle } from '~/hooks';
import { themeMixins } from '~/utils/theme';
import { showErrorToastFromServer } from '~/utils/toast';
import { translateFiles } from '~/utils/translation';

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
  const { toast: toastTranslation } = translateFiles('toast');

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
        showErrorToastFromServer(error);
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
      toast.info(toastTranslation.auth.activeAccount);
    } catch (error) {
      showErrorToastFromServer(error);
    }
    setSubmitting(false);
  };

  const renderStatusIcon = () => {
    const StatusIcon = statusObject.icon;
    return (
      <StatusIcon
        fontSize="medium"
        color="inherit"
        className={clsx({ spin: status === Status.PENDING })}
      />
    );
  };

  return (
    <Container maxWidth="sm">
      <Box mt={3} p={3} sx={{ ...themeMixins.paperBorder() }}>
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
