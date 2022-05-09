import authApi from 'api/authApi';
import { useAppSelector } from 'app/hooks';
import { selectCurrentUser } from 'features/auth/authSlice';
import { IChangePasswordFormValues, IField } from 'models';
import React from 'react';
import ChangePasswordForm from '../components/ChangePasswordForm';

export function ChangePasswordPage() {
  const currentUser = useAppSelector(selectCurrentUser);

  const defaultValues: IChangePasswordFormValues = {
    userId: currentUser?._id as string,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleFormSubmit = async (formValues: IChangePasswordFormValues) => {
    await authApi.changePassword(formValues);
  };

  const handleForgotPassword = async () => {
    await authApi.forgotPassword(currentUser?.email as string);
  };

  const fieldList: IField[] = [
    { name: 'currentPassword', props: {} },
    { name: 'newPassword', props: {} },
    { name: 'confirmPassword', props: {} },
  ];

  return (
    <ChangePasswordForm
      fieldList={fieldList}
      defaultValues={defaultValues}
      onSubmit={handleFormSubmit}
      forgotPassword={handleForgotPassword}
    />
  );
}
