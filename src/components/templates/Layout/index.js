import React from 'react';
import PropTypes from 'prop-types';

import { Container } from './Layout.styles';
import Header from './../../organisms/Header';
import Footer from './../../organisms/Footer';

/**
 * @typedef {Object} props
 * @property {JSX} children element
 * @property {string} testId, id to use as testing reference
 */

/**
 * Layout
 * @param {props} props
 * @returns Layout component instance
 */
const Layout = ({ children, testId, className }) => (
  <Container className={className} data-testid={`${testId}-container`}>
    <Header testId={`${testId}-header`} />
    {children}
    <Footer testId={`${testId}-footer`} />
  </Container>
);

Layout.propTypes = {
  testId: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,

  className: PropTypes.string,
};

Layout.defaultProps = {
  className: '',
};

export default Layout;
