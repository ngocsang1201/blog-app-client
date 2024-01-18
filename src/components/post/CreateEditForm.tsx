import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { FileInputField, InputField, MdEditorField, MuiTextField } from '~/components/formFields';
import { useCustomMediaQuery } from '~/hooks/common';
import { Post } from '~/models';
import { delay } from '~/utils/common';
import { themeMixins, themeVariables } from '~/utils/theme';

export interface CreateEditFormProps {
  defaultValues: Post;
  onSubmit?: (data: Post) => void;
  isNewPost?: boolean;
}

const TITLE_WRAPPER_PADDING = 16;

export function CreateEditForm(props: CreateEditFormProps) {
  const { defaultValues, onSubmit, isNewPost } = props;

  const { t } = useTranslation('createEditForm');
  const { t: tValidate } = useTranslation('validate');

  const schema = z.object({
    title: z
      .string()
      .min(1, tValidate('required'))
      .max(100, tValidate('max', { max: 100 })),
    content: z.string().min(1, tValidate('required')),
    thumbnail: z.string(),
    description: z.string(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Post>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const title = watch('title');
  const content = watch('content');
  const thumbnail = watch('thumbnail');

  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const buttonRef = useRef<any>(null);

  const closeDialog = () => setOpen(false);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    (async () => {
      if (isSubmitting) return;

      const errorValues: any = Object.values(errors);
      if (errorValues?.length === 0) return;

      for (const error of errorValues) {
        toast.error(error.message);
        await delay(200);
      }
    })();
  }, [isSubmitting]);

  const removeThumbnail = () => {
    setValue('thumbnail', '');
  };

  const handleFormSubmit = async (formValues: Post) => {
    try {
      await onSubmit?.({ ...defaultValues, ...formValues });
    } catch (error) {}
  };

  const smUp = useCustomMediaQuery('up', 'sm');

  return (
    <Stack
      component="form"
      direction="column"
      spacing={2}
      sx={{
        height: `calc(100vh - (${themeVariables.headerHeight}px + 16px))`,
        pb: {
          xs: `${(buttonRef.current?.offsetHeight || 0) + TITLE_WRAPPER_PADDING * 2}px`,
          sm: 2,
        },
      }}
    >
      <Stack
        direction="column"
        sx={{
          ...themeMixins.getPaperStyles(),
          position: 'relative',
          height: '100%',
        }}
      >
        <Stack spacing={{ xs: 0, sm: 2 }} flexShrink={0} px={2}>
          <InputField
            name="title"
            control={control}
            placeholder={t('title.placeholder')}
            spellCheck={false}
            autoFocus
            sx={{
              pt: 2,
              pb: 1,
              fontSize: { xs: 20, sm: 28 },
              fontWeight: 500,
            }}
          />

          <Box
            flexShrink={0}
            width={{ xs: '100%', sm: 'auto' }}
            sx={{
              position: { xs: 'absolute', sm: 'relative' },
              top: { xs: `calc(100% + ${TITLE_WRAPPER_PADDING}px)`, sm: 0 },
              left: 0,
            }}
          >
            <Button
              ref={buttonRef}
              variant="outlined"
              size="large"
              fullWidth={!smUp}
              disabled={!title || !content}
              onClick={() => setOpen(true)}
            >
              {isNewPost ? t('btnLabel.create') : t('btnLabel.edit')}
            </Button>
          </Box>
        </Stack>

        <Box flex={1}>
          <MdEditorField name="content" control={control} placeholder={t('content.placeholder')} />
        </Box>
      </Stack>

      <Dialog open={open} onClose={closeDialog} fullWidth>
        <Typography
          variant="h6"
          component="div"
          sx={{
            ...themeMixins.truncate(1),
            py: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 3 },
          }}
        >
          {title}
        </Typography>

        <DialogContent
          dividers
          sx={{
            py: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 3 },
          }}
        >
          <MuiTextField
            name="description"
            control={control}
            label={t('description')}
            variant="outlined"
            multiline
            rows={3}
            optional
            sx={{ mb: 2 }}
          />

          <Box>
            {thumbnail && (
              <Box
                sx={{
                  maxWidth: 400,
                  mb: 1,
                  aspectRatio: '2',
                  bgcolor: 'action.hover',
                  backgroundImage: `url('${thumbnail}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 2,
                }}
              />
            )}

            <Stack alignItems="center" spacing={1}>
              <Button
                variant="contained"
                size="small"
                component="label"
                htmlFor="thumbnail-input"
                disabled={uploading}
                startIcon={uploading && <CircularProgress size={18} />}
              >
                <FileInputField
                  name="thumbnail"
                  control={control}
                  id="thumbnail-input"
                  setUploading={setUploading}
                />
                {thumbnail ? t('btnLabel.changeThumbnail') : t('btnLabel.addThumbnail')}
              </Button>

              {thumbnail && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  disabled={uploading}
                  onClick={removeThumbnail}
                >
                  {t('btnLabel.removeThumbnail')}
                </Button>
              )}
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: { xs: 1, sm: 2 } }}>
          <Button variant="text" size={smUp ? 'large' : 'medium'} onClick={closeDialog}>
            {t('btnLabel.cancel')}
          </Button>

          <Button
            variant="contained"
            size={smUp ? 'large' : 'medium'}
            autoFocus
            disabled={isSubmitting || uploading}
            startIcon={isSubmitting && <CircularProgress size={20} />}
            onClick={handleSubmit(handleFormSubmit)}
          >
            {isNewPost ? t('btnLabel.create') : t('btnLabel.edit')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
