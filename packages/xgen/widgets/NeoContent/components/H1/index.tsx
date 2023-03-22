import clsx from 'clsx'

import styles from './index.less'

interface IProps {
	children: string
}

const Index = ({ children }: IProps) => {
      console.log(555);
      
	return (
		<h1 className={clsx(styles._local)} style={{ color: 'red' }}>
			{children}
		</h1>
	)
}

export default Index
