import { Positionable } from '@tecs/basics';
import { Component } from '@tecs/core';

class LinearCollidable extends Component {
    private _name: string;
    private _positionable: Positionable;
    private _collisions: LinearCollidable[];

    constructor(name: string, positionable: Positionable) {
        super();
        this._name = name;
        this._positionable = positionable;
        this._collisions = []; // TODO: more efficient way than dynamic array?
    }

    public get name(): string {
        return this._name;
    }

    public get positionable(): Positionable {
        return this._positionable;
    }

    public addCollision(target: LinearCollidable): void {
        this._collisions.push(target);
    }

    public removeCollisionsWith(name: string): void {
        this._collisions = this._collisions.filter(c => c.name !== name); // TODO: see above TODO
    }

    public hasCollisionWith(name: string): boolean {
        return this._collisions.some(c => c.name === name);
    }
}

export default LinearCollidable;