import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useAppSelector } from 'app/hooks';
import {
  FileInputField,
  InputField,
  KeywordInputField,
  MdEditorField,
} from 'components/formFields';
import { selectCdnLoading } from 'features/cdn/cdnSlice';
import { Post } from 'models';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { mixins, themeConstants } from 'utils/theme';
import * as yup from 'yup';
import { translateValidation } from 'utils/translation';

export interface CreateEditFormProps {
  defaultValues: Post;
  onSubmit?: (data: Post) => void;
  isNewPost?: boolean;
}

export default function CreateEditForm(props: CreateEditFormProps) {
  const { defaultValues, onSubmit, isNewPost } = props;

  const { t } = useTranslation('createEditForm');
  const validation = translateValidation();

  const schema = yup.object().shape({
    title: yup.string().required(validation.title.required),
    content: yup.string().required(validation.content.required).min(50, validation.content.min(50)),
    thumbnail: yup.string(),
    keywords: yup.array().of(
      yup.object().shape({
        name: yup.string().required(),
        value: yup.string().required(),
      })
    ),
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const thumbnail = watch('thumbnail');
  const maxKeywords = 5;

  const imageLoading = useAppSelector(selectCdnLoading);
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (isSubmitting) return;

    const errorValues = Object.values(errors);
    if (errorValues.length === 0) return;

    for (const error of errorValues) {
      toast.error(error.message);
    }
  }, [isSubmitting]);

  const removeThumbnail = () => {
    setValue('thumbnail', '');
  };

  const handleFormSubmit = async (data: Post) => {
    try {
      await onSubmit?.(data);
    } catch (error) {
      const content = isNewPost ? t('error.create') : t('error.edit');
      toast.error(content);
    }
  };

  return (
    <form>
      <Box height={`calc(100vh - ${themeConstants.headerHeight} * 2 - 24px)`} mt={1}>
        <Grid container alignItems="center">
          <Grid item xs>
            <InputField
              name="title"
              control={control}
              placeholder={t('placeholder.title')}
              spellCheck={false}
              autoFocus
              sx={{
                pt: 2,
                pb: 1,
                fontSize: 28,
                fontWeight: 500,
              }}
            />
          </Grid>

          <Grid item xs="auto" ml={2}>
            <Button variant="outlined" size="large" onClick={openDialog}>
              {isNewPost ? t('btnLabel.create') : t('btnLabel.edit')}
            </Button>
          </Grid>
        </Grid>

        <MdEditorField name="content" control={control} placeholder={t('placeholder.content')} />
      </Box>

      <Dialog
        open={open}
        onClose={closeDialog}
        sx={(theme) => ({
          '& .MuiPaper-root': {
            width: 800,
          },
          '& .MuiTypography-h6': {
            padding: theme.spacing(1, 3),
          },
          '& .MuiDialogActions-root': {
            padding: theme.spacing(1),
          },
        })}
      >
        <Typography variant="h6" component="div" sx={{ ...mixins.truncate(1) }}>
          {getValues('title') || t('noTitle')}
        </Typography>

        <DialogContent dividers>
          <Box
            sx={{
              maxWidth: 400,
              height: 200,
              bgcolor: 'grey.200',
              backgroundImage: `url('${thumbnail}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2,
            }}
          ></Box>

          <Stack direction="row" alignItems="center" mt={1} mb={2} spacing={1}>
            <Button
              variant="contained"
              size="small"
              component="label"
              htmlFor="thumbnail-input"
              disabled={imageLoading}
              startIcon={imageLoading && <CircularProgress size={20} />}
              sx={{ fontWeight: 400 }}
            >
              <FileInputField name="thumbnail" control={control} id="thumbnail-input" />
              {t('btnLabel.addThumbnail')}
            </Button>

            {thumbnail && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                disabled={imageLoading}
                sx={{ fontWeight: 400 }}
                onClick={removeThumbnail}
              >
                {t('btnLabel.removeThumbnail')}
              </Button>
            )}
          </Stack>

          <KeywordInputField
            name="keywords"
            control={control}
            maxKeywords={maxKeywords}
            placeholder={t('placeholder.keyword', { maxKeywords })}
            maxKeywordsError={t('placeholder.maxKeywordsError', { maxKeywords })}
          />
        </DialogContent>

        <DialogActions>
          <Button variant="text" size="large" onClick={closeDialog}>
            {t('btnLabel.cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            autoFocus
            disabled={isSubmitting || imageLoading}
            startIcon={isSubmitting && <CircularProgress size={20} />}
            onClick={handleSubmit(handleFormSubmit)}
          >
            {isNewPost ? t('btnLabel.create') : t('btnLabel.edit')}
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}