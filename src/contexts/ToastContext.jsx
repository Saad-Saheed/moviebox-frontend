import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success'); // 'success', 'danger', etc.
  const [visible, setVisible] = useState(false);

  
/**
 * Displays a toast notification with the specified message and type.
 * The toast will automatically dismiss after 3 seconds.
 *
 * @param {string} msg - The message to display in the toast.
 * @param {'success' | 'danger' | 'info' | 'warning'} [type='success'] - The type/variant of the toast notification.
 */
  const showToast = (msg, type = 'success') => {
    setMessage(msg);
    setVariant(type);
    setVisible(true);
    setTimeout(() => setVisible(false), 9000); // Auto-dismiss after 9s
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className={`toast align-items-center text-bg-${variant} show`} role="alert">
            <div className="d-flex">
              <div className="toast-body">{message}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setVisible(false)}></button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
