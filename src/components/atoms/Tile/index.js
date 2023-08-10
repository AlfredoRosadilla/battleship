import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

import { TILE_RESULTS } from './../../../constants/dashboard';

const hitAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const missAnimation = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const tileColors = {
  [TILE_RESULTS.HIT]: 'red',
  [TILE_RESULTS.MISS]: 'blue',
  [TILE_RESULTS.HIDE]: 'transparent',
};

const tileContent = {
  [TILE_RESULTS.HIT]: '🚢',
  [TILE_RESULTS.MISS]: '💧',
  [TILE_RESULTS.HIDE]: '🔍',
};

const Wrapper = styled.button`
  height: 10%;
  width: 10%;
  background-color: ${({ status }) => tileColors[status]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  animation: ${({ status }) => 
    status === TILE_RESULTS.HIT ? css`${hitAnimation} 0.5s ease` : 
    status === TILE_RESULTS.MISS ? css`${missAnimation} 0.5s ease` : 
    'none'};
`;

/**
 * Tile
 * @param {props} props
 * @returns Tile component instance
 */
function Tile({ testId, className, onShot, status }) {
  return (
    <Wrapper
      status={status}
      onClick={onShot}
      data-testid={`${testId}-tile`}
      className={`${className} column is-1`}
    >
      {tileContent[status]}
    </Wrapper>
  );
}

Tile.propTypes = {
  onShot: PropTypes.func.isRequired,
  status: PropTypes.oneOf(Object.values(TILE_RESULTS)).isRequired,
  className: PropTypes.string,
  testId: PropTypes.string.isRequired,
};

export default Tile;
