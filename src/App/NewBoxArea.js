import styled from 'styled-components';

export default styled.div`
	position: absolute;
	left: 0;
	top: 0;
	width: 100px;
	height: 100px;
	border-radius: 3px;
	@media only screen and (min-width: 400px) {
		& {
			width: 160px;
			height: 160px;
		}
	}
`;