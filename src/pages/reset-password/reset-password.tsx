import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { resetPassword } from '../../services/slices/authSlice';

import {
  getAuthError,
  getAuthLoading
} from '../../services/selectors/authSelectors';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const error = useSelector(getAuthError);
  const isLoading = useSelector(getAuthLoading);

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      resetPassword({
        password,
        token
      })
    ).then(() => {
      localStorage.removeItem('resetPassword');
      navigate('/login');
    });
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', {
        replace: true
      });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error || (isLoading ? 'Загрузка...' : '')}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
