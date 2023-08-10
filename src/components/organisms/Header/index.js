import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Wrapper = styled.section`
  width: 90%;
`;

/**
 * Search
 * @param {props} props
 * @returns Search component instance
 */
function Header({ className, testId }) {
  return <Wrapper className={`is-centered ${className}`}></Wrapper>;
}

/**
 * Controller
 */
export function Methods() {}

Header.propTypes = {
  testId: PropTypes.string.isRequired,

  className: PropTypes.string,
};

Header.defaultProps = {
  className: '',
};

export default Header;
