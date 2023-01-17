

export default class Vect2 {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
    }
    
	clone():Vect2 {
		return new Vect2(this.x, this.y);
    }

	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	norm() {
		let m = this.mag();
		if (m > 0) {
			this.div(m);
			return this;
		}
	}

	add(v:Vect2) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}
	sub(v:Vect2) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	set(v:Vect2) {
		this.x = v.x;
		this.y = v.y;
		return this;
    }

	div(scalar:number) {
		this.x /= scalar;
		this.y /= scalar;
		return this;
	}

	mult(scalar:number) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
    }
    
    
	setXY(x:number,y:number) {
		this.x = x;
		this.y = y;
        return this;
    }

    addXY(x:number,y:number) {
		this.x += x;
		this.y += y;
        return this;
    }
    
    subXY(x:number,y:number) {
		this.x -= x;
		this.y -= y;
        return this;
    }

	setX(x:number) {
		this.x = x;
		return this;
    }
    
	setY(y:number) {
		this.y = y;
		return this;
    }
    
	addX(x:number) {
		this.x += x;
		return this;
	}

	addY(y:number) {
		this.y += y;
		return this;
	}

	subX(x:number) {
		this.x -= x;
		return this;
	}
	subY(y:number) {
		this.y -= y;
		return this;
	}
    
	static get up() {
		return new Vect2(0, -1);
	}

	static get down() {
		return new Vect2(0, 1);
	}

	static get left() {
		return new Vect2(-1, 0);
	}

	static get right() {
		return new Vect2(1, 0);
	}
    
    static Norm(vect:Vect2) {
		let m = Vect2.Mag(vect);
		if (m > 0) {
			return Vect2.Div(vect, m);
		}
    }
    
	static Mag(vect:Vect2):number {
		return Math.sqrt(vect.x * vect.x + vect.y * vect.y);
	}

	static Distance(v:Vect2, o:Vect2):number {
		return Math.sqrt(Math.pow(v.x - o.x, 2) + Math.pow(v.y - o.y, 2));
	}


	static Add(v:Vect2, o:Vect2):Vect2 {
		return new Vect2(v.x + o.x, v.y + o.y);
	}

	static Sub(v:Vect2, o:Vect2):Vect2 {
		return new Vect2(v.x - o.x, v.y - o.y);
	}

	static Mult(v:Vect2, scalar:number):Vect2 {
		return new Vect2(v.x * scalar, v.y * scalar);
	}

	static Div(v:Vect2, scalar:number):Vect2 {
		return new Vect2(v.x / scalar, v.y / scalar);
	}

}
