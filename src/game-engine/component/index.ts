import GameObject from '../game-object';
import Id from '../Id';

class Component extends Id {
    readonly coName: string;
    #owner!: GameObject;
    constructor(goName: string) {
        super();
        this.coName = goName
    }

    get owner() {
        return this.#owner
    }
    
    setOwner(owner: GameObject) {
        this.#owner = owner
    }
}

export default Component