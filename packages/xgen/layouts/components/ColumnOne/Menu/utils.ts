import { IPropsMenu } from '@/layouts/types'
import { App } from '@/types'

/**
 * Utils class
 */
export class Utils {
	static Merge(navItems: Array<App.Menu>, items: Array<App.Menu>, settingItems: Array<App.Menu>): App.Menus {
		return {
			items: navItems,
			setting: settingItems
		}
	}
}
