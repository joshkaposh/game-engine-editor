type Indexable = {[key:string]:any}
// type Paths = { [key: string]: string[] }

export default class Paths {
    root: Indexable;
    #entries:ReturnType<typeof Object.entries>
    constructor(root: Indexable) {
        this.root = root;
        this.#entries = Object.entries(root);
    }

    next() {
    }

    previous() {
    }
}