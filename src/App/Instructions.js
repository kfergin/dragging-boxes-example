import styled from 'styled-components';

export default styled.div`
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	padding: 16px;
	border-top: 1px solid #ccc;
	user-select: none;
	h4 {
		margin-bottom: 8px;
		font-weight: 300;
	}
	ul {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;
		padding: 0;
		margin: 0;
		list-style-type: none;
		font-weight: 300;
	}
	li {
		position: relative;
		padding-left: 16px;
		margin: 0 0px 4px 0;
		&:last-child {
			margin: 0;
		}
		&:before {
			position: absolute;
			content: '•';
			left: 4px;
			top: 0;
		}
		@media only screen and (min-width: 400px) {
			& {
				margin: 0 8px 0 0;
			}
		}
	}
`;