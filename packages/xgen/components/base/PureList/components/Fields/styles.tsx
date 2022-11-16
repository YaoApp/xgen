import { Fragment } from 'react'
import { Else, If, Then } from 'react-if'

interface IProps {
	showLabel: boolean | undefined
}

const Index = (props: IProps) => {
      const { showLabel } = props
      
	return (
		<Fragment>
			<style>{`
				:host .xgen-form-item {
					width: 100%;
					margin-bottom: 0;
				}
			`}</style>
			<If condition={showLabel}>
				<Then>
					<style>{`
						:host .xgen-form-item {
							padding: 0 18px;
							padding-top: 12px;
							border-radius: var(--radius);
							background-color: var(--color_bg_nav);
						}

						:host .xgen-checkbox-group,
						:host .xgen-radio-group {
							padding: 0;
						}

						:host .xgen-input,
						:host .xgen-input-number,
						:host .xgen-input-number-input,
						:host .xgen-mentions,
						:host .xgen-picker,
						:host .xgen-select,
						:host .xgen-select-selector {
							padding: 0 !important;
							background-color: transparent !important;
							color: var(--color_text);
							border: none !important;
							outline: none !important;
							box-shadow: none !important;
						}

						:host .xgen-form-item-label {
							display: flex;
							padding-bottom: 0;
						}

						:host .xgen-form-item-label label {
							height: auto;
							color: var(--color_text);
							font-weight: 700;
							font-size: 12.6px;
						}

						:host .xgen-form-item-control {
							min-height: auto;
							height: auto;
						}
					`}</style>
				</Then>
				<Else>
					<style>{`
						:host .xgen-form-item-label {
							display: none !important;
						}

						:host .xgen-col {
							display: flex;
							justify-content: center;
						}

						:host .field_tooltip {
							position: absolute;
							top: -36px;
							z-index: 2;
							display: flex;
							justify-content: center;
							padding: 6px;
							font-size: 12px;
							line-height: 1;
							background-color: var(--color_title);
							color: var(--color_bg);
							box-shadow: var(--shadow);
							border-radius: var(--radius);
							transform: translateX(-10px);
						}

						:host .field_tooltip::after {
							content: '';
							position: absolute;
							bottom: -6px;
							width: 0;
							height: 0;
							border-left: 6px solid transparent;
							border-right: 6px solid transparent;
							border-top: 6px solid var(--color_title);
						}
					`}</style>
				</Else>
			</If>
		</Fragment>
	)
}

export default window.$app.memo(Index)
