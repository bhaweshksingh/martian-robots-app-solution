import {Robot} from './robot';

export type HTTPMethod = 'GET' | 'POST' | 'PUT';

export enum HTTPStatus {
    OK = 200,
    BadRequest = 400,
    InternalServerError = 500
}

export interface ApiResponse<Res> {
    message: Res;
}

// tslint:disable:no-any
// tslint:disable:max-line-length

const num = ((p: any, path: string) => typeof p === 'number' ? undefined : (`${path}: not a number`)) as any as number;
const str = ((p: any, path: string) => typeof p === 'string' ? undefined : (`${path}: not a string`)) as any as string;
const boolVal = ((p: any, path: string) => typeof p === 'boolean' ? undefined : (`${path}: not a boolean`)) as any as boolean;

function fun<T, TS extends [any?, any?]>(returns: T, ...takes: TS) {
    return ((...t: TS) => takes
        .map((validator, i) => (validator)(t[i], 'message'))
        .find(i => i)) as any as (...t: TS) => Promise<T>;
}

function optional<T>(param: T) {
    return ((t: T | undefined, path: string) => (t !== undefined) && (param as any)(t, `${path}?`)) as any as (T | undefined);
}

function arr<T>(param: T) {
    return ((p: T[], path: string) => p.find((t, i) => (param as any)(t, `${path}[${i}]`))) as any as T[];
}

function isNotObject(t: any, path: string) {
    return typeof t === 'object' ? false : `${path}: not an object`;
}

function obj<T extends object>(p: T) {
    return ((inner: T, path: string) => isNotObject(inner, path) ||
            Object.keys(p)
                .map((checkme: string) => (p as any)[checkme]((inner as any)[checkme], `${path}.${checkme}`))
                .find(i => i)
    ) as any as T;
}

function asPartial<T>(p: T): Partial<T> {
    return p;
}

// tslint:enable:no-any

const customer = obj({id: num, name: str});
const grid: Grid = obj({topRightX: num, topRightY: num});
const coordinates: Coordinate = obj({x: num, y: num});
const dir: Direction = str as Direction;
const robot: Robot = obj({name: str, coordinate: coordinates, direction: dir, isLost: boolVal, lostAt: coordinates});
export type Customer = typeof customer;
// Query parameters have to be strings
const partialCustomer = asPartial(obj({id: optional(str), name: optional(str)}));
const robotRequest = asPartial(obj({name: str}));
export const apiObject = {
    initialise: {
        POST: fun(grid, str),
        GET: fun(grid),
    },
    robots: {
        POST: fun(robot, str),
        GET: fun(robot, robotRequest),
    },
    moveRobot: {
        POST: fun(robot, str),
    }
};

export type ApiMap = typeof apiObject;

export interface Coordinate {
    x: number;
    y: number;
}

export type Direction = 'N' | 'S' | 'E' | 'W';

export interface RobotMap {
    [key: string]: Robot;
}

export interface Grid {
    topRightX: number;
    topRightY: number;
}
