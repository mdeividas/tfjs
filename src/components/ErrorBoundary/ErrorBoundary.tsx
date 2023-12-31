import React from 'react';

const CommonError = () => <div>Oops!</div>;

interface ErrorModel extends Error {
    code: string;
}

enum ErrorName {
    chunk = 'ChunkLoadError',
    type = 'TypeError',
}

enum ErrorCode {
    cssChunk = 'CSS_CHUNK_LOAD_FAILED',
    dynamicImport = 'Failed to fetch dynamically imported module',
}

interface Props {
    FallBackComponent?: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<Props>, State> {
    static getDerivedStateFromError() {
        return {
            hasError: true,
        };
    }
    constructor(props: Props) {
        super(props);

        this.state = {
            hasError: false,
        };
    }

    componentDidCatch(error: ErrorModel) {
        const isChunkError =
            error?.name === ErrorName.chunk ||
            error?.code === ErrorCode.cssChunk ||
            error?.message?.includes?.(ErrorCode.dynamicImport);

        if (isChunkError) {
            window.location.reload();
        }
    }

    render() {
        if (this.state.hasError) {
            if (this.props.FallBackComponent) {
                return this.props.FallBackComponent;
            }

            return <CommonError />;
        }

        return this.props.children;
    }
}
