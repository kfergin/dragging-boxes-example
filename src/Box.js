import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { transparentize } from 'polished';

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
				className={this.props.className}
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

export default styled(Box)`
	position: absolute;
	width: 100px;
	height: 100px;
	border-radius: 3px;
	background-color: ${props => transparentize(0.6, props.theme.blue)};
	cursor: -webkit-grab;
	transition: background-color 350ms ease;
	// If you're passing in a prop only for styling reasons and that prop changes (a lot)...avoid?
	// Also would like to reference App.grabbing but I think that's an circular import
	.grabbing & {
		cursor: -webkit-grabbing;
	}
	.removing &:hover {
		background-color: ${props => transparentize(0.6, props.theme.red)};
		cursor: pointer;
	}
	@media only screen and (min-width: 400px) {
		& {
			width: 160px;
			height: 160px;
		}
	}
`;