import { Button, Form, Input, message } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import feishu from '@/assets/images/feishu.png'
import { Icon } from '@/components'
import { Link } from '@umijs/pro'

const { Item, useForm } = Form

const Index = () => {
	const [form] = useForm()
	const { getFieldValue } = form
	const is_cn = true

	const onFinish = (v: any) => {
		const is_email = v.mobile.indexOf('@') !== -1

		if (is_email) {
			if (
				!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
					v.mobile
				)
			) {
				// return message.warning(login_messages.form.validate.email)
			}
		} else {
			if (!/^1[3|4|5|8|9][0-9]\d{4,8}$/.test(v.mobile)) {
				// return message.warning(login_messages.form.validate.mobile)
			}
		}
	}

	return (
		<Form
			className='form_wrap border_box flex flex_column'
			name='form_login'
			form={form}
			onFinish={onFinish}
		>
			<div className='input_wrap'>
				<Item noStyle shouldUpdate>
					{() => (
						<Item noStyle name='mobile'>
							<Input
								className={clsx([
									'input input_mobile',
									getFieldValue('mobile') ? 'has_value' : '',
									!is_cn && 'en'
								])}
								type='text'
								maxLength={30}
								prefix={
									<Icon
										name='person_outline-outline'
										size={21}
									></Icon>
								}
							></Input>
						</Item>
					)}
				</Item>
			</div>
			<div className='input_wrap'>
				<Item noStyle shouldUpdate>
					{() => (
						<Item noStyle name='password'>
							<Input
								className={clsx([
									'input input_password',
									getFieldValue('password') ? 'has_value' : '',
									!is_cn && 'en'
								])}
								type='password'
								maxLength={23}
								prefix={<Icon name='lock-outline' size={21}></Icon>}
							></Input>
						</Item>
					)}
				</Item>
			</div>
			<div className='input_wrap relative'>
				<Item noStyle shouldUpdate>
					{() => (
						<Item noStyle name='captcha_code'>
							<Input
								className={clsx([
									'input input_captcha_code',
									getFieldValue('captcha_code')
										? 'has_value'
										: '',
									!is_cn && 'en'
								])}
								autoComplete='off'
								type='text'
								maxLength={6}
								prefix={
									<Icon
										name='security-outline'
										size={20}
									></Icon>
								}
							></Input>
						</Item>
					)}
				</Item>
				<span className='img_captcha_code absolute cursor_point' />
			</div>
			<Item noStyle shouldUpdate>
				{() => (
					<Button
						className='btn_login'
						type='primary'
						htmlType='submit'
						shape='round'
						// disabled={
						// 	!(
						// 		getFieldValue('mobile') &&
						// 		getFieldValue('password') &&
						// 		getFieldValue('captcha_code')
						// 	)
						// }
					>
						登录
					</Button>
				)}
			</Item>
			<Link className='btn_link w_100 text_center transition_normal' to='/login/user'>
				普通用户登录
			</Link>
			{/* <div className='flex flex_column'>
				<div className='or_wrap flex justify_between align_center'>
					<span className='line'></span>
					<span className='text'>or</span>
					<span className='line'></span>
				</div>
				<div className='third_wrap w_100 flex flex_column'>
					<Button
						className='btn_third relative'
						shape='round'
						icon={
							<img
								className='logo_third absolute'
								src={feishu}
								alt='feishu'
							/>
						}
					>
						使用飞书进行登录
					</Button>
				</div>
			</div> */}
		</Form>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
