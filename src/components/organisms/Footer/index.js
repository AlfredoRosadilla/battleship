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
function Footer({ className, testId }) {
  return <Wrapper className={`is-centered ${className}`}></Wrapper>;
}

/**
 * Controller
 */
export function Methods() {}

Footer.propTypes = {
  testId: PropTypes.string.isRequired,

  className: PropTypes.string,
};

Footer.defaultProps = {
  className: '',
};

export default Footer;
