import authApi from 'api/authApi';
import { useAppSelector } from 'app/hooks';
import { selectCurrentUser } from 'features/auth/authSlice';
import { ChangePasswordFormValue } from 'models';
import React from 'react';
import { toast } from 'react-toastify';
import { useTranslateFiles } from 'utils/translation';
import ChangePasswordForm from '../components/ChangePasswordForm';

export function ChangePasswordPage() {
  const { toast: toastTranslation } = useTranslateFiles('toast');

  const currentUser = useAppSelector(selectCurrentUser);

  const defaultValues: ChangePasswordFormValue = {
    userId: currentUser?._id as string,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleFormSubmit = async (formValues: ChangePasswordFormValue) => {
    await authApi.changePassword(formValues);
  };

  const handleForgotPassword = () => {
    toast.info(toastTranslation.changePasswordPage.forgotPassword);
  };

  return (
    <ChangePasswordForm
      defaultValues={defaultValues}
      onSubmit={handleFormSubmit}
      forgotPassword={handleForgotPassword}
    />
  );
}
