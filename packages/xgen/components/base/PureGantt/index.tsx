import clsx from 'clsx'

import styles from './index.less'

const Index = () => {
	const currentDate = new Date()
	const tasks = [
		{
			start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
			end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
			name: 'Some Project',
			id: 'ProjectSample',
			progress: 25,
			type: 'project',
			hideChildren: false,
			displayOrder: 1
		},
		{
			start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
			end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 12, 28),
			name: 'Idea',
			id: 'Task 0',
			progress: 45,
			type: 'task',
			project: 'ProjectSample',
			displayOrder: 2
		},
		{
			start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
			end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
			name: 'Research',
			id: 'Task 1',
			progress: 25,
			dependencies: ['Task 0'],
			type: 'task',
			project: 'ProjectSample',
			displayOrder: 3
		},
		{
			start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
			end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
			name: 'Discussion with team',
			id: 'Task 2',
			progress: 10,
			dependencies: ['Task 1'],
			type: 'task',
			project: 'ProjectSample',
			displayOrder: 4
		}
	]

	return <div className={clsx([styles._local, 'w_100'])}></div>
}

export default window.$app.memo(Index)
