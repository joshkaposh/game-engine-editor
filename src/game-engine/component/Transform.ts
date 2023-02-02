import Vect2 from "../vector/Vect2";

class Transform {
    pos: Vect2;
    constructor(pos = new Vect2()) {
        this.pos = pos;
    }
}

export default Transform
    