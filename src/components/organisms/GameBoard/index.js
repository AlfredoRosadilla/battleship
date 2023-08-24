import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { useRef, useEffect } from 'react';

import Tile from './../../atoms/Tile';
import { TILE_RESULTS } from './../../../constants/dashboard';

const GameWrapper = styled.section`
  flex-direction: column;
  display: flex;
  width: 100%;
`;

const Column = styled.div`
  flex-direction: column;
  display: flex;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  max-width: 100vw;
`;

/**
 * GameBoard
 * @param {props} props
 * @returns GameBoard component instance
 */
function GameBoard({
  testId,
  className,

  shots,
  onShot,
  virtualBoard,
}) {
  const mainElement = useRef(null);
  const methods = Object.assign(new Methods(), {
    shots,

    virtualBoard,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      const currentTile = document.activeElement;

      if (currentTile) {
        let newTileToFocus = null;

        switch (event.keyCode) {
          case 37: // Flecha izquierda
            console.log('left');
            newTileToFocus = currentTile.previousSibling;
            break;
          case 38: // Flecha arriba
            console.log('top');
            const prevRow = currentTile.parentNode.previousSibling;
            if (prevRow) {
              const tileIndex = Array.from(
                currentTile.parentNode.children,
              ).indexOf(currentTile);
              newTileToFocus = prevRow.children[tileIndex] || null;
            }
            break;
          case 39: // Flecha derecha
            console.log('right');
            newTileToFocus = currentTile.nextSibling;
            break;
          case 40: // Flecha abajo
            console.log('down');
            const nextRow = currentTile.parentNode.nextSibling;
            if (nextRow) {
              const tileIndex = Array.from(
                currentTile.parentNode.children,
              ).indexOf(currentTile);
              newTileToFocus = nextRow.children[tileIndex] || null;
            }
            break;
          default:
            break;
        }

        if (newTileToFocus) {
          newTileToFocus.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mainElement]);

  if (!virtualBoard) {
    return null;
  }

  return (
    <GameWrapper ref={mainElement}>
      <Column className={`${className}`} data-testid={`${testId}-game-board`}>
        {virtualBoard.map((column, x) => (
          <Row key={`column-${x}`}>
            {column.map((cellValue, y) => (
              <Tile
                key={`tile-${x}-${y}`}
                onShot={() => onShot(x, y)}
                testId={`${testId}-tile-${x}-${y}`}
                status={methods.getTileStatus(x, y, cellValue)}
              />
            ))}
          </Row>
        ))}
      </Column>
    </GameWrapper>
  );
}

/**
 * Controller
 */
export function Methods() {}

Methods.prototype.isTileShot = function isTileShot(x, y) {
  return this.shots.some((shot) => shot.x === x && shot.y === y);
};

Methods.prototype.getTileStatus = function getTileStatus(x, y, cellValue) {
  let status = TILE_RESULTS.HIDE;

  if (this.isTileShot(x, y)) {
    status = cellValue !== 0 ? TILE_RESULTS.HIT : TILE_RESULTS.MISS;
  }

  return status;
};

GameBoard.propTypes = {
  onShot: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  shots: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      status: PropTypes.string,
    }),
  ).isRequired,

  virtualBoard: PropTypes.array,
  className: PropTypes.string,
};

export default GameBoard;
