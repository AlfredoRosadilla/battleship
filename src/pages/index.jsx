import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import { TILE_RESULTS } from './../constants/dashboard';
import GameBoard from './../components/organisms/GameBoard';

export const Wrapper = styled.section`
  width: 90%;
`;

/**
 * Dashboard page
 * @param {props} props
 * @returns Dashboard page instance
 */
function Dashboard({ boardSize, layout }) {
  const testId = 'dashboard';
  const [shots, setShots] = useState([]);
  const [sunkShips, setSunkShips] = useState([]);
  const [virtualBoard, setVirtualBoard] = useState(null);
  const methods = Object.assign(new Methods(), {
    layout,
    boardSize,

    shots,
    sunkShips,

    setShots,
    virtualBoard,
    setSunkShips,
  });

  useEffect(() => {
    setVirtualBoard(methods.generateVirtualBoard());
  }, []);

  return (
    <div className="container">
      <h1 className="title">Battleship</h1>

      <GameBoard
        shots={shots}
        testId={testId}
        virtualBoard={virtualBoard}
        onShot={(x, y) => methods.handleShot(x, y)}
      />

      <div className="game-status">
        {shots.length > 0 && (
          <div>
            <h2>Last Shot:</h2>
            <p>
              Position: ({shots[shots.length - 1].x},{' '}
              {shots[shots.length - 1].y}) Status:{' '}
              {shots[shots.length - 1].status}
            </p>
          </div>
        )}

        {sunkShips.map((ship) => (
          <div key={ship}>The {ship} has been sunk!</div>
        ))}
      </div>
    </div>
  );
}

/**
 * Controller
 */
export function Methods() {}

Methods.prototype.generateVirtualBoard = function generateVirtualBoard() {
  const { layout, boardSize } = this;
  const virtualBoard = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(0));

  // Place ships on the board based on the layout
  layout.forEach((shipData) => {
    shipData.positions.forEach(([x, y]) => {
      virtualBoard[x][y] = shipData.ship;
    });
  });

  return virtualBoard;
};

Methods.prototype.positionAlreadyShooted = function positionAlreadyShooted(
  x,
  y,
) {
  const { shots } = this;

  return shots.some((shot) => shot.x === x && shot.y === y);
};

Methods.prototype.setHitOrMiss = function setHitOrMiss(x, y) {
  const { virtualBoard, shots } = this;
  let result = TILE_RESULTS.MISS;

  const shipHit = virtualBoard[x][y];

  if (shipHit !== 0) {
    result = TILE_RESULTS.HIT;
  }

  const newShot = { x, y, status: result };

  // Add new shot to shots state
  this.setShots([...shots, newShot]);

  return result;
};

Methods.prototype.handleShot = function handleShot(x, y) {
  // If shot already made at this position, ignore
  if (!this.positionAlreadyShooted(x, y)) {
    const result = this.setHitOrMiss(x, y);

    // If it's a hit, check if the entire ship has been sunk
    if (result === TILE_RESULTS.HIT) {
      const { layout, shots, virtualBoard } = this;

      const shipHit = virtualBoard[x][y];
      // Find the ship layout from the provided layout
      const shipLayout = layout.find((ship) => ship.ship === shipHit);

      // Check if all positions of this ship have been hit
      const isSunk = shipLayout.positions.every((position) => {
        const [posX, posY] = position;

        return shots.some(
          (shot) => shot.x === posX && shot.y === posY && shot.status === 'hit',
        );
      });

      if (isSunk) {
        setSunkShips((prevSunkShips) => {
          console.log(`Adding ${shipHit} to sunk ships`);

          return [...prevSunkShips, shipHit];
        });
      }
    }
  }
};

/**
 * @param {Object} ctx
 * @returns {Object} instance data and next context
 */
export async function getServerSideProps(ctx) {
  return {
    props: {
      boardSize: 10,
      shipTypes: {
        carrier: { size: 5, count: 1 },
        battleship: { size: 4, count: 1 },
        cruiser: { size: 3, count: 1 },
        destroyer: { size: 2, count: 1 },
        submarine: { size: 3, count: 1 },
      },
      layout: [
        {
          ship: 'carrier',
          positions: [
            [2, 9],
            [3, 9],
            [4, 9],
            [5, 9],
            [6, 9],
          ],
        },
        {
          ship: 'battleship',
          positions: [
            [5, 2],
            [5, 3],
            [5, 4],
            [5, 5],
          ],
        },
        {
          ship: 'cruiser',
          positions: [
            [8, 1],
            [8, 2],
            [8, 3],
          ],
        },
        {
          ship: 'submarine',
          positions: [
            [3, 0],
            [3, 1],
            [3, 2],
          ],
        },
        {
          ship: 'destroyer',
          positions: [
            [0, 0],
            [1, 0],
          ],
        },
      ],
    },
  };
}

export default Dashboard;
