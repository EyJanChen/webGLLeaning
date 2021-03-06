class Tools {
	constructor() {

	}

	static getRectPosArr(x, y, w, h) {
		let x1 = x;
		let x2 = w + x1;
		let y1 = y;
		let y2 = y1 + h;
		return [
			x1, y1,
			x2, y1,
			x1, y2,
			x1, y2,
			x2, y1,
			x2, y2
		];
	}

	static getRectPosFloatArr(x, y, w, h) {
		let arr = this.getRectPosArr(x, y, w, h);
		return new Float32Array(arr);
	}

	static isPowerOf2(value) {
		return (value & (value - 1)) === 0;
	}

	static degToRad(num) {
		return num / Math.PI * 180;
	}

	static getColorArr() {
		return new Uint8Array([
			255, 0, 0,
			255, 0, 0,
			255, 0, 0,
			255, 0, 0,
			255, 0, 0,
			255, 0, 0,

			0, 255, 0,
			0, 255, 0,
			0, 255, 0,
			0, 255, 0,
			0, 255, 0,
			0, 255, 0,

			0, 0, 255,
			0, 0, 255,
			0, 0, 255,
			0, 0, 255,
			0, 0, 255,
			0, 0, 255,

			255, 255, 0,
			255, 255, 0,
			255, 255, 0,
			255, 255, 0,
			255, 255, 0,
			255, 255, 0,

			0, 255, 255,
			0, 255, 255,
			0, 255, 255,
			0, 255, 255,
			0, 255, 255,
			0, 255, 255,

			255, 0, 255,
			255, 0, 255,
			255, 0, 255,
			255, 0, 255,
			255, 0, 255,
			255, 0, 255
		]);
	}

	static getRectArr() {
		return new Float32Array([
			0, 0, 0,
			0,100,0,
			100, 0, 0,
			0,100,0,
			100,100,0,
			100,0,0,

			0,0,0,
			0,0,100,
			100,0,0,
			0,0,100,
			100,0,100,
			100,0,0,

			0,100,0,
			0,0,0,
			0,0,100,
			0,0,100,
			0,100,100,
			0,100,0,

			100,100,0,
			100,100,100,
			100,0,0,
			100,0,100,
			100,0,0,
			100,100,100,

			0,0,100,
			0,100,100,
			100,100,100,
			0,0,100,
			100,0,100,
			100,100,100,

			0,100,0,
			100,100,0,
			100,100,100,
			100,100,100,
			0,100,100,
			0,100,0
		]);
	}

	static getTextureArr() {
		return new Float32Array([
			0, 0,
			0, 1,
			1, 0,
			0, 1,
			1, 1,
			1, 0,

			0, 0,
			0, 1,
			1, 0,
			0, 1,
			1, 1,
			1, 0,

			0, 0,
			0, 1,
			1, 0,
			0, 1,
			1, 1,
			1, 0,

			0, 0,
			0, 1,
			1, 0,
			0, 1,
			1, 1,
			1, 0,

			0, 0,
			0, 1,
			1, 0,
			0, 1,
			1, 1,
			1, 0,

			0, 0,
			0, 1,
			1, 0,
			0, 1,
			1, 1,
			1, 0,
		]);
	}
}
