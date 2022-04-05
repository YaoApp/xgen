import type { IPropsViewComponent } from '@/types'

interface IProps extends IPropsViewComponent {}

const Index = (props: IProps) => {
      const { __value } = props
      
	return <span>{__value}</span>
}

export default window.$app.memo(Index)
