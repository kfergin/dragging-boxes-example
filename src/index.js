import React, { Component } from 'react';
import { render } from 'react-dom';
import { TransitionMotion, spring } from 'react-motion';
import uuid from 'uuid';
import classNames from 'classnames';

import './index.scss';

class Box extends Component {
	constructor(props) {
		super(props);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
	}
	handleMouseDown(e) {
		this.props.handleMouseDown(e, this.props.id);
	}
	handleTouchStart(e) {
		e.preventDefault();
		this.props.handleTouchStart(e, this.props.id);
	}
	render() {
		const {opacity, left, top, id} = this.props;
		return (
			<div
				className="box"
				style={{
					opacity: opacity,
					left: `${left}px`,
					top: `${top}px`
				}}
				onMouseDown={this.handleMouseDown}
				onTouchStart={this.handleTouchStart}
			/>
		);
	}
}

class Container extends Component {
	constructor(props) {
		super(props);

		// Determine if we're responding to touch or click events
		this.touchDebounce = undefined;
		this.handleGlobalTouch = this.handleGlobalTouch.bind(this);
		this.handleGlobalMouseover = this.handleGlobalMouseover.bind(this);

		// Notify when Shift is pressed. CSS purposes.
		this.handleKeyUpDown = this.handleKeyUpDown.bind(this);

		// Adding, moving, and removing boxes
		this.addBox = this.addBox.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.selectBox = this.selectBox.bind(this);
		this.removeBox = this.removeBox.bind(this);
		this.handleMove = this.handleMove.bind(this);
		this.handleRelease = this.handleRelease.bind(this);

		// Initial state
		const id = uuid(), left = 0, top = 0;
		this.state = {
			touchBased: 'ontouchstart' in window,
			boxes: {
				byID: {[id]: {id, left, top}},
				allIDs: [id]
			},
			selectedBox: null,
			lastSelect: 0,
			removing: false
		};
	}
	// would want to remove these listeners if component were part of larger app
	componentDidMount() {
		document.addEventListener('touchstart', this.handleGlobalTouch);
		document.addEventListener('mouseover', this.handleGlobalMouseover);
		document.querySelector('html').addEventListener('keydown', this.handleKeyUpDown);
		document.querySelector('html').addEventListener('keyup', this.handleKeyUpDown);
	}
	handleGlobalTouch() {
		clearTimeout(this.touchDebounce);
		if (!this.state.touchBased) this.setState({touchBased: true});
		this.touchDebounce = setTimeout(() => {
			this.touchDebounce = undefined;
		}, 500)
	}
	handleGlobalMouseover() {
		if (this.touchDebounce === undefined && this.state.touchBased) this.setState({touchBased: false});
	}
	handleKeyUpDown(e) {
		if (e.which === 16) {
			this.setState(prevState => ({
				...prevState,
				removing: !prevState.removing
			}));
		}
	}
	addBox(e) {
		if (this.state.selectedBox) return;
		const id = uuid(), left = 0, top = 0;
		this.setState(prevState => ({
			...prevState,
			boxes: {
				byID: {
					...prevState.boxes.byID,
					[id]: {id, left, top}
				},
				allIDs: [...prevState.boxes.allIDs, id]
			}
		}));
	}
	selectBox(e, id, now) {
		let {clientX, clientY} = e;
		if (e.type === 'touchstart') {
			({clientX, clientY} = e.changedTouches[0]);
		}
		this.setState(prevState => {
			// Possible to "select" a box as it's transition out.
			// Potential problem bc it's out of state but kept in TransitionMotion
			const box = prevState.boxes.byID[id],
				selectedBox = !box ? null : {
					id,
					diffX: clientX - box.left,
					diffY: clientY - box.top
				};
			return {
				...prevState,
				lastSelect: now,
				selectedBox
			};
		});
	}
	removeBox(id) {
		this.setState(prevState => {
			const {[id]: toRemove, ...rest} = prevState.boxes.byID;
			return {
				...prevState,
				selectedBox: null,
				boxes: {
					byID: rest,
					allIDs: prevState.boxes.allIDs.filter(aid => aid !== id)
				}
			};
		});
	}
	handleMouseDown(e, id) {
		if (this.state.touchBased) return;
		const now = Date.now();
		if (e.shiftKey) {
			this.removeBox(id);
		} else {
			this.selectBox(e, id, now);
		}
	}
	handleTouchStart(e, id) {
		const now = Date.now();
		if (now - this.state.lastSelect > 250) {
			this.selectBox(e, id, now);
		} else {
			this.removeBox(id);
		}
	}
	handleMove(e) {
		if (!this.state.selectedBox) return;
		let {clientX, clientY} = e;
		if (e.type === 'touchmove') {
			e.preventDefault();
			({clientX, clientY} = e.changedTouches[0]);
		}
		this.setState(prevState => {
			const {id, diffX, diffY} = prevState.selectedBox;
			return {
				...prevState,
				boxes: {
					...prevState.boxes,
					byID: {
						...prevState.boxes.byID,
						[id]: {
							id,
							left: clientX - diffX,
							top: clientY - diffY
						}
					}
				}
			};
		});
	}
	handleRelease(e) {
		this.setState(prevState => ({
			...prevState,
			selectedBox: null
		}));
	}
	render() {
		const containerClasses = classNames({
			"container": true,
			"grabbing": this.state.selectedBox,
			"removing": this.state.removing
		});
		return (
			<div
				className={containerClasses}
				onMouseMove={this.handleMove}
				onTouchMove={this.handleMove}
				onMouseUp={this.handleRelease}
				onTouchEnd={this.handleRelease}
			>
				<div className="instructions">
					<h4>Drag some boxes!</h4>
					<ul>
						<li>Add boxes by {this.state.touchBased ? 'tapping' : 'hovering over'} the top-left area of the screen</li>
						<li>To remove, {this.state.touchBased ? 'double-tap' : 'hold shift and click on'} a box.</li>
					</ul>
				</div>
				<div
					className="new-box-area"
					onMouseEnter={this.addBox}
					onTouchStart={this.addBox}
				/>
				<TransitionMotion
					willEnter={() => ({opacity: 0, left: 0, top: 0})}
					willLeave={(lv) => ({...lv.styles, opacity: spring(0)})}
					styles={this.state.boxes.allIDs.map((id) => ({
						key: id,
						style: {
							opacity: spring(1),
							left: spring(this.state.boxes.byID[id].left),
							top: spring(this.state.boxes.byID[id].top)
						}
					}))}
				>
					{instances => (
						<div className="boxes">
							{instances.map(inst => (
								<Box
									key={inst.key}
									{...{...inst.style, id: inst.key}}
									handleMouseDown={this.handleMouseDown}
									handleTouchStart={this.handleTouchStart}
								/>
							))}
						</div>
					)}
				</TransitionMotion>
			</div>
		);
	}
}

render(
	<Container/>,
	document.getElementById('dragEl')
);