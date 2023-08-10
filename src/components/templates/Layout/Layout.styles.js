import styled from 'styled-components';

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100vw;

  a {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
