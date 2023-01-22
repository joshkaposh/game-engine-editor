export type DrawCallback = (pen: Pencil) => void

export interface IPencil {
	provide(fn:DrawCallback):void

}

export default class Pencil implements IPencil{
	public canvas: HTMLCanvasElement;
	private c;
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas!;
		this.c = canvas.getContext("2d",{alpha:false})!;
    }
    
    get canvasWidth() {
        return this.canvas.width;
    }

    get canvasHeight() {
        return this.canvas.height;
    }

	set fill(color:string) {
		this.c.fillStyle = color;
	}

	set stroke(color:string) {
		this.c.strokeStyle = color;
	}
	
	set weight(lineWidth: number) {
		this.c.lineWidth = lineWidth;
	}

	set font(font:string) {
		this.c.font = font;
	}
	
	provide(fn: DrawCallback) {
		fn(this);
	}
    
    clear(x:number, y:number, width:number, height:number) {
		this.c.clearRect(x, y, width, height);
	}

	circle(x:number, y:number, radius:number, fillBool:boolean) {
		this.c.beginPath();
		this.c.arc(x, y, radius, 0, Math.PI * 2, false);
		fillBool ? this.c.fill() : this.c.stroke();
		this.c.closePath();
	}

	text(text:string, color:string, x:number, y:number) {
		this.c.beginPath();
		this.fill =color;
		this.c.fillText(text, x, y);
		this.c.closePath();
	}

    rect(x: number, y: number, width: number, height: number, fillBool: boolean) {
		this.c.beginPath();
		this.c.rect(x, y, width, height);
		fillBool ? this.c.fill() : this.c.stroke();
		this.c.closePath();
	}

	drawLine(x1:number,y1:number,x2:number,y2:number) {
		this.c.beginPath();
		this.c.moveTo(x1, y1);
		this.c.lineTo(x2, y2);
		this.c.stroke();
		this.c.closePath();
	}
}
