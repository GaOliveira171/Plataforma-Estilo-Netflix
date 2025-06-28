// Utilitário para registrar erros no console
export const logError = (error: any, context?: string): void => {
  console.error(`[Netflix Clone Error]${context ? ` [${context}]: ` : ': '}`, error);
};

// Configurar um handler global para erros não capturados
export const setupErrorHandlers = (): void => {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('[Global Error]', { message, source, lineno, colno, error });
    return false;
  };

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Promise Rejection]', event.reason);
  });
};

