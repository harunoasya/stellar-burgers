import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { forgotPassword } from '../../services/slices/authSlice';

import {
  getAuthError,
  getAuthLoading
} from '../../services/selectors/authSelectors';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(getAuthError);
  const isLoading = useSelector(getAuthLoading);

  const [email, setEmail] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(forgotPassword(email)).then(() => {
      localStorage.setItem('resetPassword', 'true');

      navigate('/reset-password', {
        replace: true
      });
    });
  };

  return (
    <ForgotPasswordUI
      errorText={error || (isLoading ? 'Загрузка...' : '')}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
