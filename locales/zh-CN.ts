export default {
	login: {
		title: '登录',
		user_login_tip: '普通用户登录',
		admin_login_tip: '管理员登录',
		no_entry: '应用未设置首页，请在app.json中设置首页',
		auth_lark_err: '飞书快捷登录失败',
		form: {
			validate: {
				email: '邮箱格式错误',
				mobile: '手机号格式错误'
			}
		}
	},
	layout: {
            logout: '退出登录',
            avatar:{
                  reset:'重置随机头像'
            },
		setting: {
			title: '设置',
			update_menu: {
				title: '更新菜单',
				desc: '修改菜单之后，需手动更新本地数据',
                        btn_text: '更新',
                        feedback:'菜单更新成功'
			},
			language: {
				title: '语言'
			},
			theme: {
				title: '主题'
			}
		}
	}
}
