import { Tooltip } from 'antd'

import { Icon } from '@/widgets'

const sns = [
	{
		name: 'Github',
		icon: 'icon-github',
		href: 'https://github.com/YaoApp/yao'
	},
	{
		name: 'Product Hunt',
		icon: 'icon-gift',
		href: 'https://www.producthunt.com/@yao_app_engine'
	},
	{
		name: 'Twitter',
		icon: 'icon-twitter',
		href: 'https://twitter.com/YaoApp'
	},
	{
		name: 'Slack',
		icon: 'icon-slack',
		href: 'https://join.slack.com/t/yaoapps/shared_invite/zt-13dm0cwvo-R9Q8xFGbrLZUffeygm9tXQ'
	}
]

const Index = () => {
	return (
		<div className='media_items w_100 flex justify_center absolute'>
			{sns.map((item, index) => (
				<Tooltip title={item.name} key={index}>
					<a className='media_item' target='_blank' href={item.href}>
						<Icon name={item.icon} size={18}></Icon>
					</a>
				</Tooltip>
			))}
		</div>
	)
}

export default window.$app.memo(Index)
