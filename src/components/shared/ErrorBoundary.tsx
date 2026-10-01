import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Icon } from './Icon';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
          <Icon name="error" size={64} className="text-rose-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Eyvah, bir şeyler kırıldı!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            Beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
          </p>
          <pre className="text-left bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-4 rounded-xl text-xs overflow-auto max-w-full w-full mb-6">
            {this.state.error?.message}
            {'\n'}
            {this.state.error?.stack}
          </pre>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-xl"
            >
              Yenile
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl"
            >
              Ana Sayfa
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
