export default class Time {
	#delta: number;
	#totalDelta : number
	#lastFrameTime: number;

	private static instance: Time;
	private	constructor() {
		this.#delta = 0
		this.#totalDelta = 0;
		this.#lastFrameTime = 0;
	}

	public static getInstance(): Time {
		if (!Time.instance) {
			Time.instance = new Time();
		}
		return Time.instance;
	}

	get fps() {
		return 1 / this.#delta
	}

	get deltaTime() {
		return this.#delta;
	}

	get totalElapsedTime() {
		return this.#totalDelta;
	}

	step() {
		if (!this.#lastFrameTime) {
			this.#lastFrameTime = performance.now();
			this.#totalDelta = 0;
			return;
		}

		this.#delta = (performance.now() - this.#lastFrameTime) / 1000;
		this.#lastFrameTime = performance.now();
		this.#totalDelta += this.#delta;
	}
}
