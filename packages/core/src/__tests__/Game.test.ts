import { expect } from 'chai';
import * as sinon from 'sinon';
import { createDom, RafManipulator } from '@sectjs/test-utils';
import Component from '../Component';
import Game from '../Game';
import createSystem, { System } from '../createSystem';
import SystemRegistry from '../SystemRegistry';
import { createSecureContext } from 'tls';

describe('Game', function () {
    describe('game state', function () {
        it('should allow access to a state property by key', function () {
            const game = new Game(new SystemRegistry());
            const expectedScore = 100;

            game.setState<number>('score', () => expectedScore);

            const actualScore = game.getState<number>('score');

            expect(actualScore).to.equal(expectedScore);
        });

        it('should support new state computations based upon the previous value', function () {
            const game = new Game(new SystemRegistry());
            const initialScore = 100;
            const expectedScore = 200;

            game.setState<number>('score', () => initialScore);
            game.setState<number>('score', score => score + 100);

            const actualScore = game.getState<number>('score');

            expect(actualScore).to.equal(expectedScore);
        });
    });

    describe('start', function () {
        let destroyDom: () => void;
        let raf: RafManipulator;

        const system = createSystem('stubSystem', (...args) => undefined);
        const mockSystem = sinon.mock(system);
        const systemRegistry = new SystemRegistry([[Component, system]]);
        let game: Game;

        beforeEach(function ()  {
            const { destroy, rafManipulator } = createDom();

            game = new Game(systemRegistry);
            destroyDom = destroy;
            raf = rafManipulator;
        });

        afterEach(function () {
            destroyDom();
            mockSystem.restore();
        });

        it('should update all of the systems in a rAF loop', function () {
            mockSystem.expects('update')
                .twice()
                .withArgs(sinon.match.number);

            game.start();
            raf.step();
            raf.step();

            mockSystem.verify();
        });

        it('should call the callback passed to onLoopStart if provided', function () {
            const onLoopStart = sinon.spy();

            game.onLoopStart(onLoopStart);

            game.start();
            raf.step();
            raf.step();
            raf.step();

            expect(onLoopStart.calledThrice).to.be.true;
        });

        it('should call the callback passed to onLoopEnd if provided', function () {
            const onLoopEnd = sinon.spy();

            game.onLoopEnd(onLoopEnd);

            game.start();
            raf.step();
            raf.step();
            raf.step();

            expect(onLoopEnd.calledThrice).to.be.true;
        });
    });
});
