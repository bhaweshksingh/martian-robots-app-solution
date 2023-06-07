import {Coordinate, Direction, Grid} from './base';
import {AddToGridScents, IsInExistingScents, IsOutOfGridBounds} from './grid';

export const MAX_INSTRUCTIONS_LENGTH = 100;

export interface Robot {
    name: string;
    coordinate: Coordinate;

    isLost: boolean;

    lostAt: Coordinate;

    direction: Direction;
}

const moveForward = (robot: Robot, grid: Grid) => {
    const nextCoord = getForwardCoordinate(robot.coordinate, robot.direction);
    if (IsInExistingScents(robot.coordinate) && IsOutOfGridBounds(nextCoord, grid)) {
        console.log('dropping scent');

        return;
    }

    if (IsOutOfGridBounds(nextCoord, grid)) {
        console.log('lost detected');

        robot.lostAt = robot.coordinate;
        robot.isLost = true;
        AddToGridScents(robot.coordinate);
    }

    robot.coordinate = nextCoord;
};

export const printRobot = (robot: Robot, grid: Grid, prefix: string) => {
    // tslint:disable-next-line:max-line-length
    console.log(` ${prefix} Robot Name: ${robot.name}. Coordinate: ${robot.coordinate.x}:${robot.coordinate.y}. Direction: ${robot.direction}, isLost: ${robot.isLost}, Last: ${robot.lostAt.x}:${robot.lostAt.y}`);
    console.log(` ${prefix} GRID X: ${grid.topRightX}. GRID Y: ${grid.topRightY}.`);
};

const getForwardCoordinate = (existingCoordinate: Coordinate, existingDirection: Direction): Coordinate => {
    const {x, y} = existingCoordinate;

    switch (existingDirection) {
        case 'N':
            return {
                x,
                y: y + 1,
            };
        case 'E':
            return {
                x: x + 1,
                y,
            };
        case 'S':
            return {
                x,
                y: y - 1,
            };
        case 'W':
            return {
                x: x - 1,
                y,
            };
        default:
            return existingCoordinate;
    }
};

const directionsInClockwiseOrder: Direction[] = ['N', 'E', 'S', 'W'];
const directionLength = 4;

function turnLeft(robot: Robot) {
    // tslint:disable-next-line:no-magic-numbers
    robot.direction = turn(robot.direction, -1);
}

function turnRight(robot: Robot) {
    robot.direction = turn(robot.direction, 1);
}

function turn(currentDirection: Direction, delta: number) {
    const currentDirectionIndex = directionsInClockwiseOrder.findIndex(
        (direction: Direction) => currentDirection === direction
    );

    // tslint:disable-next-line:max-line-length
    return directionsInClockwiseOrder[((currentDirectionIndex + delta) % directionLength + directionLength) % directionLength];
}

const moveRobotForSingleInstruction = (robot: Robot, grid: Grid, instruction: string): void => {
    if (robot.isLost) {
        return;
    }
    printRobot(robot, grid, 'before');
    console.log(`instruction : ${instruction}`);
    switch (instruction) {
        case 'F':
            moveForward(robot, grid);
            break;
        case 'L':
            turnLeft(robot);
            break;
        case 'R':
            turnRight(robot);
            break;
        default:
            break;
    }
    printRobot(robot, grid, 'after');
};

export const move = (robot: Robot, instructions: string, grid: Grid): Robot => {
    const instructionArr = instructions.trim().split('');
    instructionArr.forEach((instruction: string) => {
        moveRobotForSingleInstruction(robot, grid, instruction);
    });

    return robot;
};

export const ValidateInstructions = (instructions: string): string => {
    if (instructions.trim().length > MAX_INSTRUCTIONS_LENGTH) {
        return 'Error';
    }

    return '';
};
