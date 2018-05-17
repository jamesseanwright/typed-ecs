import { RectPositionable, RectRenderable } from '@tecs/basics';
import { LinearCollidable } from '@tecs/collision';
import { Entity, EntityBinder } from '@tecs/core';

const createEdge = (bindEntity: EntityBinder, y: number, width: number) => {
    const positionable = new RectPositionable(0, y, width, 10); // TODO: world space, real coords
    const linearCollidable = new LinearCollidable('edge', positionable);
    const rectRenderable = new RectRenderable(positionable, 'black');
    const entity = new Entity(positionable, linearCollidable);

    return bindEntity(entity);
};

export default createEdge;
