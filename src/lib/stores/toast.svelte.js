export const toastState = $state({
  current: null
});

export function showToast(message, type = 'success', duration = 3000) {
  toastState.current = { message, type };
  setTimeout(() => {
    // Only clear if it's the exact same message to avoid clearing a newer toast
    if (toastState.current && toastState.current.message === message) {
      toastState.current = null;
    }
  }, duration);
}
