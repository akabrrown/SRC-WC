import React from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingProps> = ({ message = 'Loading campaign information...' }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center" role="status">
    <div className="w-10 h-10 border-4 border-brand-gold border-t-brand-navy rounded-full animate-spin mb-4" />
    <p className="text-sm font-medium text-ink/70">{message}</p>
  </div>
);

interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorProps> = ({
  title = 'Unable to Load Content',
  message = 'There was an issue connecting to the campaign database. Please check your connection and try again.',
  onRetry
}) => (
  <div className="campaign-card border-red-200 bg-red-50/50 p-8 text-center max-w-lg mx-auto my-8">
    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
    <h3 className="text-lg font-bold text-red-900 mb-2">{title}</h3>
    <p className="text-sm text-red-700 mb-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-navy text-sm py-2 px-4 gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    )}
  </div>
);

interface EmptyProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyProps> = ({
  icon = <Inbox className="w-12 h-12 text-ink/40" />,
  title = 'No Items Available',
  message = 'Content will appear here once officially published by the campaign team.',
  actionText,
  onAction
}) => (
  <div className="campaign-card p-10 text-center max-w-md mx-auto my-8 bg-muted/40 border-dashed">
    <div className="flex justify-center mb-3">{icon}</div>
    <h3 className="text-base font-bold text-ink mb-1">{title}</h3>
    <p className="text-xs text-ink/60 mb-5">{message}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="btn-navy text-xs py-2 px-4"
      >
        {actionText}
      </button>
    )}
  </div>
);

interface OfflineProps {
  onRetry?: () => void;
}

export const OfflineState: React.FC<OfflineProps> = ({ onRetry }) => (
  <div className="campaign-card border-amber-200 bg-amber-50/70 p-8 text-center max-w-md mx-auto my-8">
    <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-3">
      <AlertCircle className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-bold text-amber-900 mb-1">You Are Currently Offline</h3>
    <p className="text-xs text-amber-800/80 mb-5 leading-relaxed">
      Please check your internet connection to sync live campaign dispatches and submit registrations.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-navy text-xs py-2 px-4 gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Check Connection
      </button>
    )}
  </div>
);

interface SuccessProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export const SuccessState: React.FC<SuccessProps> = ({
  title = 'Action Completed Successfully',
  message = 'Your submission has been recorded by the campaign administration.',
  actionText,
  onAction
}) => (
  <div className="campaign-card border-emerald-200 bg-emerald-50/60 p-8 text-center max-w-md mx-auto my-8">
    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
      <Inbox className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-bold text-emerald-950 mb-1">{title}</h3>
    <p className="text-xs text-emerald-800/80 mb-5 leading-relaxed">{message}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="btn-navy text-xs py-2 px-4"
      >
        {actionText}
      </button>
    )}
  </div>
);

