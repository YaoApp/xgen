import { ErrorBoundary } from 'react-error-boundary'

import FallbackComponent from './FallbackComponent'

interface IProps {
	children: React.ReactNode
}

const Index = ({ children }: IProps) => {
	return <ErrorBoundary FallbackComponent={FallbackComponent}>{children}</ErrorBoundary>
}

export default Index
