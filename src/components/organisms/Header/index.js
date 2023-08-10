import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.header`
  background-color: hsl(240deg 100% 79.22%);
  align-items: center;
  justify-content: space-around;
  display: flex;  
  height: 60px;
  width: 100vw;
`;

const Container = styled.section`
  display: flex;  
  height: 40px;
  justify-content: space-between;
  padding: 0 16px;
  max-width: 1280px;
  width: 100%;
`;

const LogoWrapper = styled.div`
  background-color: hsl(0deg 0% 28.63%);
  height: 100%;
  width: 120px;
`;

const SearchWrapper = styled.div`
  background-color: white;
  height: 100%;
  margin-left: 16px;
  width: 100%;
`;

const SearchIcon = styled.div`
  background-color: hsl(240deg 32.04% 59.61%);
  height: 100%;
  margin: 0 8px 0 4px;
  width: 80px;
`;

const MenuWrapper = styled.div`
  background-color: hsl(0deg 0% 28.63%);
  height: 40px;
  margin-left: 8px;
  width: 80px;
`;

const OtherMenusWrapper = styled(MenuWrapper)`
  @media(max-width: 768px) {
    display: none;
  }
`;

/**
 * Search
 * @param {props} props
 * @returns Search component instance
 */
function Header({ className, testId }) {
  return (
    <Wrapper className={`is-centered ${className}`}>
      <Container>
        <LogoWrapper />
        <SearchWrapper />
        <SearchIcon />

        <OtherMenusWrapper/>
        <OtherMenusWrapper/>
        
        <MenuWrapper />
      </Container>
    </Wrapper>
  );
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
