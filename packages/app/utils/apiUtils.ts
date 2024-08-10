import { AxiosError } from 'axios';
import { Alert } from 'react-native';
import { InformUser } from './ToastUtils';

export const getErrorMessageFromError = (e: unknown) => {
  const defaultErrorMessage = 'Failure: Please contact to support';
  InformUser({
    title: 'e msg: ' + e.message,
    placement: 'bottom',
    duration: 9000,
    style: { backgroundColor: 'red' },
  });

  InformUser({
    title: 'instanceof: ' + (e instanceof AxiosError),
    placement: 'bottom',
    duration: 6000,
    style: { backgroundColor: 'red' },
  });

  if (!(e instanceof AxiosError)) {
    return defaultErrorMessage;
  }

  const responseData = e.response?.data;

  return (
    responseData?.[0]?.error?.message ||
    responseData?.error?.message ||
    defaultErrorMessage
  );
};
