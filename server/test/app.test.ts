import * as supertest from 'supertest';

const request = supertest('http://localhost:3000');

describe('app server', () => {

    describe('initializeServer', () => {

        // @ts-ignore
        // tslint:disable-next-line:max-line-length
        it('should initialize the server with the correct upper-right coordinates of the rectangular grid', async () => {
            const response = await request.post('/api/initialise')
                .set('Content-type', 'application/json')
                .send({message: '5 5'});


            expect(response.status).toBe(200);
            expect(response.text).toBe('{"message":{"topRightX":5,"topRightY":5}}');
        });

        // @ts-ignore
        it('should return an error message if the input is invalid', async () => {
            const response = await request.post('/api/initialise')
                .set('Content-type', 'application/json')
                .send({message: '-5 5'});

            expect(response.status).toBe(500);
            expect(response.text).toBe('Internal server error');
        });

        // @ts-ignore
        it('should return an error message if the input is not a tuple', async () => {
            const response = await request.post('/api/initialise')
                .set('Content-type', 'application/json')
                .send({message: '5'});

            expect(response.status).toBe(500);
            expect(response.text).toBe('Internal server error');
        });

        // @ts-ignore
        it('should return an error message for out of bounds', async () => {
            const response = await request.post('/api/initialise')
                .set('Content-type', 'application/json')
                .send({message: '60 60'});

            expect(response.status).toBe(500);
            expect(response.text).toBe('Internal server error');
        });

        // @ts-ignore
        it('should return an error message if the input is a tuple of the wrong length', async () => {
            const response = await request.post('/api/initialise')
                .set('Content-type', 'application/json')
                .send({message: '5 5 5'});

            expect(response.status).toBe(500);
            expect(response.text).toBe('Internal server error');
        });

        // @ts-ignore
        it('should return an error message if the input is not a tuple of integers', async () => {
            const response = await request.post('/api/initialise')
                .set('Content-type', 'application/json')
                .send({message: '5 av'});

            expect(response.status).toBe(500);
            expect(response.text).toBe('Internal server error');
        });
    });

    describe('create robot', () => {
        // @ts-ignore
        it('should register robot', async () => {
            const response = await request.post('/api/robots')
                .set('Content-type', 'application/json')
                .send({message: 'R2D2 14E'});

            expect(response.status).toBe(200);
            expect(response.text).toBe('{"message":{"name":"R2D2","coordinate":{"x":1,"y":4},"direction":"E","isLost":false,"lostAt":{"x":-100,"y":-100}}}');
        });
    });

    describe('get robot', () => {
        beforeEach(async () => {
            await request.post('/api/robots')
                .set('Content-type', 'application/json')
                .send({message: 'R2D2 14E'});

            await request.post('/api/robots')
                .set('Content-type', 'application/json')
                .send({message: 'R3D4 24E'});
        });
        it('should return the position of a specific robot', async () => {
            const response = await request.get('/api/robots')
                .query({name: 'R2D2'});

            expect(response.status).toBe(200);
            expect(response.text).toBe('{"message":{"name":"R2D2","coordinate":{"x":1,"y":4},"direction":"E","isLost":false,"lostAt":{"x":-100,"y":-100}}}');
        });

        it('should return the position of a another robot', async () => {
            const response = await request.get('/api/robots')
                .query({name: 'R3D4'});

            expect(response.status).toBe(200);
            expect(response.text).toBe('{"message":{"name":"R3D4","coordinate":{"x":2,"y":4},"direction":"E","isLost":false,"lostAt":{"x":-100,"y":-100}}}');
        });

        it('should return an error if no robots match the name', async () => {
            const response = await request.get('/api/robots')
                .query({name: 'R1D2'});

            expect(response.status).toBe(500);
            expect(response.text).toBe('Internal server error');
        });
    });

    describe('robot positions', () => {

        // 53
        // 11E RFRFRFRF
        // 32N FRRFLLFFRRFLL
        // 03W LLFFFLFLFL

        it('should return the final robot positions', async () => {
            const response = await request.post('/api/initialise')
                .set('Content-type', 'application/json')
                .send({message: '5 3'});
            expect(response.status).toBe(200);

            const robotsToInit = ['Robot1 11E', 'Robot2 32N', 'Robot3 03W'];

            for (const roboInitData of robotsToInit) {
                const createRoboResponse = await request.post('/api/robots')
                    .set('Content-type', 'application/json')
                    .send({message: `${roboInitData}`});
                expect(createRoboResponse.status).toBe(200);
                expect(createRoboResponse.text).toContain(roboInitData.split(' ')[0]);
            }

            const firstRoboMoveResponse = await request.post('/api/moveRobot')
                .set('Content-type', 'application/json')
                .send({message: `Robot1 RFRFRFRF`});
            expect(firstRoboMoveResponse.status).toBe(200);

            const firstRoboPosition = await request.get('/api/robots')
                .query({name: 'Robot1'});

            expect(firstRoboPosition.status).toBe(200);
            // tslint:disable-next-line:max-line-length
            expect(firstRoboPosition.text).toBe('{"message":{"name":"Robot1","coordinate":{"x":1,"y":1},"direction":"E","isLost":false,"lostAt":{"x":-100,"y":-100}}}');


            const secondRoboMoveResponse = await request.post('/api/moveRobot')
                .set('Content-type', 'application/json')
                .send({message: `Robot2 FRRFLLFFRRFLL`});
            expect(secondRoboMoveResponse.status).toBe(200);

            const secondRoboPosition = await request.get('/api/robots')
                .query({name: 'Robot2'});

            expect(secondRoboPosition.status).toBe(200);
            // tslint:disable-next-line:max-line-length
             expect(secondRoboPosition.text).toContain('{"message":{"name":"Robot2","coordinate":{"x":3,"y":4},"direction":"N","isLost":true,"lostAt":{"x":3,"y":3}}}');

            const thirdRoboMoveResponse = await request.post('/api/moveRobot')
                .set('Content-type', 'application/json')
                .send({message: `Robot3 LLFFFLFLFL`});
            expect(thirdRoboMoveResponse.status).toBe(200);

            const thirdRoboPosition = await request.get('/api/robots')
                .query({name: 'Robot3'});

            expect(thirdRoboPosition.status).toBe(200);
            // tslint:disable-next-line:max-line-length
            expect(thirdRoboPosition.text).toBe('{"message":{"name":"Robot3","coordinate":{"x":2,"y":3},"direction":"S","isLost":false,"lostAt":{"x":-100,"y":-100}}}');
        });
    });
});
