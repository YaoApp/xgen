import {
	closeModal,
	confirm,
	historyBack,
	historyPush,
	openModal,
	refetch,
	reload,
	reloadMenu,
	showMessage,
	emitEvent
} from '../Common'
import { delete as formDelete, find as formFind, fullscreen as formFullscreen, submit as formSubmit } from '../Form'
import { delete as TableDelete, save as tableSave, search as tableSearch } from '../Table'
import { Service, Studio } from '../Yao'

import type { Queue } from '@yaoapp/actionflow'
import type { OnAction } from '../useAction'

export default ({ namespace, primary, data_item, it, extra }: OnAction) => {
	return it.action.reduce((total: Queue, item) => {
		const { name, type, payload, next, error } = item

		const flow_info = { name, payload, next, error }

		switch (type) {
			case 'Common.openModal':
				total.push({ task: openModal({ namespace, primary, data_item, payload }), ...flow_info })
				break
			case 'Common.closeModal':
				total.push({ task: closeModal({ namespace }), ...flow_info })
				break
			case 'Common.historyPush':
				total.push({ task: historyPush({ namespace, extra }), ...flow_info })
				break
			case 'Common.historyBack':
				total.push({ task: historyBack(), ...flow_info })
				break
			case 'Common.confirm':
				total.push({ task: confirm(), ...flow_info })
				break
			case 'Common.refetch':
				total.push({ task: refetch({ namespace }), ...flow_info })
				break
			case 'Common.reload':
				total.push({ task: reload(), ...flow_info })
				break

			case 'Common.reloadMenu':
				total.push({ task: reloadMenu(), ...flow_info })
				break

			case 'Common.showMessage':
				total.push({ task: showMessage(), ...flow_info })
				break
			case 'Common.emitEvent':
				total.push({ task: emitEvent(), ...flow_info })
				break
			case 'Table.search':
				total.push({ task: tableSearch({ namespace }), ...flow_info })
				break
			case 'Table.save':
				total.push({ task: tableSave({ namespace, data_item, primary, payload }), ...flow_info })
				break
			case 'Table.delete':
				total.push({ task: TableDelete({ namespace, primary, data_item }), ...flow_info })
				break
			case 'Form.find':
				total.push({ task: formFind({ namespace }), ...flow_info })
				break
			case 'Form.submit':
				total.push({ task: formSubmit({ namespace }), ...flow_info })
				break
			case 'Form.delete':
				total.push({ task: formDelete({ namespace, primary, data_item }), ...flow_info })
				break
			case 'Form.fullscreen':
				total.push({ task: formFullscreen({ namespace }), ...flow_info })
				break
			default:
				if (type.startsWith('Service.')) total.push({ task: Service({ action: item }), ...flow_info })
				if (type.startsWith('Studio.')) total.push({ task: Studio({ action: item }), ...flow_info })
				break
		}

		return total
	}, [])
}
