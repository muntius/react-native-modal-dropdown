import React, { PureComponent } from 'react'
import {
	Dimensions,
	FlatList,
	Modal,
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	ViewStyle,
} from 'react-native'

import { Colors2 } from '../../../App/Themes'

interface Props {
	buttonComponentRef: any
	options?: string[]
	animated?: boolean
	onSelect?: (index: number) => void
	dropdownStyle?: StyleProp<ViewStyle>
	dropdownTextStyle?: StyleProp<TextStyle>
	selectedIndex?: number
}

interface State {
	showDropdown: boolean
}

export default class ModalDropdown extends PureComponent<Props, State> {
	static defaultProps = {
		disabled: false,
		scrollEnabled: true,
		defaultIndex: -1,
		defaultValue: 'Please select...',
		options: null,
		animated: true,
		showsVerticalScrollIndicator: true,
		keyboardShouldPersistTaps: 'never',
	}

	buttonFrame

	constructor(props: Props) {
		super(props)
		this.state = {
			showDropdown: false,
		}
	}

	render = () => {
		const { animated, dropdownStyle } = this.props
		const { showDropdown } = this.state
		if (showDropdown) {
			const frameStyle = this.calcPosition()
			const animationType = animated ? 'fade' : 'none'
			return (
				<Modal
					animationType={animationType}
					visible={true}
					transparent={true}
					onRequestClose={this.hide}
					supportedOrientations={[
						'portrait',
						'portrait-upside-down',
						'landscape',
						'landscape-left',
						'landscape-right',
					]}>
					<TouchableWithoutFeedback disabled={!showDropdown} onPress={this.hide}>
						<View style={styles.modal}>
							<View style={[styles.dropdown, dropdownStyle, frameStyle]}>{this.renderDropdown()}</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			)
		}
	}

	updatePosition = (callback) => {
		this.props.buttonComponentRef.measure((fx, fy, width, height, px, py) => {
			this.buttonFrame = { x: px, y: py, w: width, h: height }
			callback?.()
		})
	}

	show = () => {
		this.updatePosition(() => {
			this.setState({
				showDropdown: true,
			})
		})
	}

	hide = () => {
		this.setState({
			showDropdown: false,
		})
	}

	select = (idx) => {
		this.props.onSelect(idx)
		this.hide()
	}

	calcPosition = () => {
		const dimensions = Dimensions.get('window')
		const windowWidth = dimensions.width
		const windowHeight = dimensions.height

		const dropdownHeight = this.props.options.length * 40 + 5
		const dropdownWidth = StyleSheet.flatten(styles.dropdown).width

		const bottomSpace = windowHeight - this.buttonFrame.y - this.buttonFrame.h
		const rightSpace = windowWidth - this.buttonFrame.x
		const showInTop = bottomSpace <= dropdownHeight
		const showInLeft = rightSpace <= this.buttonFrame.x

		const positionStyle = {
			height: dropdownHeight,
			top: showInTop ? this.buttonFrame.y - this.buttonFrame.h : Math.max(0, this.buttonFrame.y) + 50 + 5,
		} as any

		if (showInLeft) {
			positionStyle.left = this.buttonFrame.x - dropdownWidth + this.buttonFrame.w - 5
		} else {
			positionStyle.width = dropdownWidth
			positionStyle.right = rightSpace - this.buttonFrame.w
		}

		return positionStyle
	}

	renderDropdown = () => {
		const { options } = this.props
		return (
			<FlatList
				scrollEnabled={false}
				contentContainerStyle={{ paddingVertical: 10 }}
				data={options}
				keyExtractor={(item, index) => 'dropDown' + index}
				renderItem={this.renderItem}
				automaticallyAdjustContentInsets={false}
				showsVerticalScrollIndicator={false}
				extraData={this.props.selectedIndex}
			/>
		)
	}

	renderItem = ({ item, index }) => {
		const { dropdownTextStyle, selectedIndex } = this.props
		const highlighted = index === selectedIndex
		return (
			<TouchableOpacity onPress={() => this.select(index)}>
				<Text
					numberOfLines={1}
					ellipsizeMode={'tail'}
					style={[
						styles.rowText,
						dropdownTextStyle,
						highlighted && styles.highlightedRowText,
						highlighted && styles.highlightedRow,
					]}>
					{item}
				</Text>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	button: {
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 12,
	},
	modal: {
		flexGrow: 1,
	},
	dropdown: {
		position: 'absolute',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: Colors2.bizarreDark,
		borderRadius: 15,
		backgroundColor: Colors2.bizarre,
		alignItems: 'center',
		justifyContent: 'center',
		width: 120,
	},
	loading: {
		alignSelf: 'center',
	},
	rowText: {
		paddingVertical: 10,
		fontSize: 12,
		color: Colors2.darkBlue,
	},
	highlightedRowText: {
		color: '#D7AF9B',
	},
	highlightedRow: {
		flex: 1,
		backgroundColor: Colors2.darkBlue,
	},
})
