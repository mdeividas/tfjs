import React from 'react';
import { ErrorBoundary } from './../ErrorBoundary';

export const LazyLoad: React.FC<React.PropsWithChildren> = (props) => (
    <ErrorBoundary>
        <React.Suspense fallback={<div />}>{props.children}</React.Suspense>
    </ErrorBoundary>
);
