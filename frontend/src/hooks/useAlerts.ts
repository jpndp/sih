import { useDispatch } from 'react-redux';
import { setAlert, clearAlert, AlertType } from '../store/slices/uiSlice';

export const useAlerts = () => {
  const dispatch = useDispatch();

  const showAlert = (
    message: string,
    type: AlertType['type'] = 'info',
    autoHide = true,
    duration = 5000
  ) => {
    dispatch(setAlert({ message, type, autoHide, duration }));
    
    if (autoHide) {
      setTimeout(() => {
        dispatch(clearAlert());
      }, duration);
    }
  };

  const hideAlert = () => {
    dispatch(clearAlert());
  };

  return {
    showSuccess: (message: string, autoHide = true) => 
      showAlert(message, 'success', autoHide),
    showError: (message: string, autoHide = true) => 
      showAlert(message, 'error', autoHide),
    showWarning: (message: string, autoHide = true) => 
      showAlert(message, 'warning', autoHide),
    showInfo: (message: string, autoHide = true) => 
      showAlert(message, 'info', autoHide),
    hideAlert,
  };
};