import {Coordinate, Grid} from './base';

export const MAX_COORDINATE_SIZE = 50;
export const COORDINATE_PAIR_LENGTH = 2;
export const NewGrid = (coords: string): Grid => {
    const upperRightCoords: number[] = coords.split(' ').map(Number);

    return {topRightX: upperRightCoords[0], topRightY: upperRightCoords[1]};
};

export const ValidateGrid = (coords: string): string => {
    const upperRightCoords: number[] = coords.split(' ').map(Number).filter(isFinite);

    if (!upperRightCoords || upperRightCoords.length !== COORDINATE_PAIR_LENGTH ||
        upperRightCoords[0] < 1 || upperRightCoords[0] > MAX_COORDINATE_SIZE ||
        upperRightCoords[1] < 1 || upperRightCoords[1] > MAX_COORDINATE_SIZE) {
        return 'Error';
    }

    return '';
};

let GridScents = [] as Coordinate[];

export const ClearExistingScents = (): void => {
    GridScents = [];
};
export const IsInExistingScents = (currentCoordinate: Coordinate): boolean => {
    for (const scent of GridScents) {
        if (scent.x === currentCoordinate.x && scent.y === currentCoordinate.y) {
            return true;
        }
    }

    return false;
};

export const AddToGridScents = (offTheWorldScent: Coordinate) => {
    GridScents.push(offTheWorldScent);
};

export const IsOutOfGridBounds = (nextCoord: Coordinate, grid: Grid): boolean =>
    (nextCoord.x > grid.topRightX || nextCoord.y > grid.topRightY);
