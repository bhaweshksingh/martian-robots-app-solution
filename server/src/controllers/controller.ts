import {Coordinate, Customer, Direction, Grid, RobotMap} from '../api/base';
import {ClearExistingScents, NewGrid, ValidateGrid} from '../api/grid';
import {move, Robot, ValidateInstructions} from '../api/robot';

const customers: Customer[] = [];
let id = 0;

let grid: Grid;

const robots: RobotMap = {};

export function getCustomers(): Promise<Customer[]> {
    return new Promise(resolve => resolve(customers));
}

export function addCustomer(customerName: string): Promise<Customer> {
    const newCustomer = {name: customerName, id: id++};
    customers.push(newCustomer);

    return new Promise(resolve => resolve(newCustomer));
}

export function searchCustomers(params: { id?: string; name?: string }): Promise<Customer[]> {
    const filteredCustomers = customers
        .filter(customer => !params.id || `${customer.id}` === params.id)
        .filter(customer => !params.name || customer.name.includes(params.name));

    return new Promise(resolve => resolve(filteredCustomers));
}

export function initializeServer(coords: string): Promise<Grid> {
    const errString: string = ValidateGrid(coords);
    if (errString.length > 0) {
        return Promise.reject('Error');
    }

    grid = NewGrid(coords);
    ClearExistingScents();

    return new Promise(resolve => resolve(grid));
}

export function getInitialisedCoordinates(): Promise<Grid> {
    return new Promise(resolve => resolve(grid));
}

export function createRobot(robotInit: string): Promise<Robot> {
    const roboParams = robotInit.split(' ');
    // tslint:disable-next-line:no-magic-numbers
    if (roboParams.length !== 2) {
        return Promise.reject('Invalid Input');
    }

    const position = roboParams[1].split('');
    // tslint:disable-next-line:no-magic-numbers
    if (position.length !== 3 || Number(position[0]) < 0 || Number(position[1]) < 0) {
        return Promise.reject('Invalid Input');
    }

    const start: Coordinate = {x: Number(position[0]), y: Number(position[1])};
    // tslint:disable-next-line:no-magic-numbers
    const initDirection: Direction = `${position[2]}` as Direction;
    const robot: Robot = {
        name: roboParams[0],
        coordinate: start,
        direction: initDirection,
        isLost: false,
        lostAt: {x: -100, y: -100}
    };
    robots[roboParams[0]] = robot;

    return new Promise(resolve => resolve(robot));
}

function findRobot(roboName: string) {
    return Object.keys(robots)
        .filter((robotName: string) => `${robotName}` === roboName);
}

export function getRobotPosition(params: { name: string }): Promise<Robot> {
    const filteredRobots = findRobot(params.name);

    if (filteredRobots.length !== 1) {
        return Promise.reject('Error');
    }
    const roboName: string = filteredRobots[0];

    return new Promise(resolve => resolve(robots[roboName]));
}

export function moveRobot(roboMoveInstruction: string): Promise<Robot> {
    const roboParams = roboMoveInstruction.split(' ');
    // tslint:disable-next-line:no-magic-numbers
    if (roboParams.length !== 2) {
        return Promise.reject('Error');
    }

    const name = roboParams[0];
    const instructions = roboParams[1];
    const filteredRobots = findRobot(name);

    if (filteredRobots.length !== 1) {
        return Promise.reject('Error');
    }

    const instructionsError = ValidateInstructions(instructions);
    if (instructionsError.length > 0) {
        return Promise.reject('Error');
    }

    const roboName: string = filteredRobots[0];

    robots[roboName] = move(robots[roboName], instructions, grid);

    return new Promise(resolve => resolve(robots[roboName]));
}
