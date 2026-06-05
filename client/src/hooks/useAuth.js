import { useSelector, useDispatch } from 'react-redux';
import { login, logout, fetchMe, clearError } from '../app/slices/authSlice.js';

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    login: (credentials) => dispatch(login(credentials)),
    logout: () => dispatch(logout()),
    fetchMe: () => dispatch(fetchMe()),
    clearError: () => dispatch(clearError()),
  };
}
