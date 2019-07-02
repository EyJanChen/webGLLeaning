class ShaderUtil {
	static waitList;
	constructor() {
	}

	// 创建，赋值，编译
	static createShader (gl, type, source) {
		let shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (!success) {
			console.error('create shader err');
			console.log(gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return;
		}

		return shader;
	};

	// 创建，赋值，链接
	static createProgram (gl, vsShader, fsShader) {
		let program = gl.createProgram();
		gl.attachShader(program, vsShader);
		gl.attachShader(program, fsShader);
		gl.linkProgram(program);

		let success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (!success) {
			console.error('create program err');
			console.log(gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			return;
		}

		return program;
	};

	static loadShaderFile(fileName, indexName) {
		let request = new XMLHttpRequest();

		request.onreadystatechange = function() {
			if (request.readyState === 4 && request.status !== 404) {
				ShaderUtil.loadShaderSuccess(request.responseText, fileName, indexName);
			}
		};

		let suffix;
		let perFile;
		if (/^vs/.test(fileName)) {
			suffix = '.vert';
			perFile = 'vs/'
		} else if (/^fs/.test(fileName)) {
			suffix = '.frag';
			perFile = 'fs/'
		}

		request.open('GET', '../../shaders/' + perFile + fileName + suffix);
		request.send();
	}

	static loadShaderSuccess(data, fileName, indexName) {
		if (!ShaderUtil.waitList[indexName]) {
			return;
		}

		if (/^vs/.test(fileName)) {
			ShaderUtil.waitList[indexName]['vs'] = data;
		} else if (/^fs/.test(fileName)) {
			ShaderUtil.waitList[indexName]['fs'] = data;
		}

		ShaderUtil.loadProgram(indexName);
	}

	static loadProgram(indexName) {
		let sourceArr = ShaderUtil.waitList[indexName];
		if (sourceArr['vs'] && sourceArr['fs']) {
			ShaderUtil.getShaderProgram(sourceArr['gl'], sourceArr['vs'], sourceArr['fs'], sourceArr['func']);
		}
	}

	static getShaderProgram(gl, vsShader, fsShader, callBack) {
		let vs = ShaderUtil.createShader(gl, gl.VERTEX_SHADER, vsShader);
		let fs = ShaderUtil.createShader(gl, gl.FRAGMENT_SHADER, fsShader);

		if (vs && fs) {
			let program = ShaderUtil.createProgram(gl, vs, fs);
			if (program && callBack) {
				callBack(program);
			}
		} else {
			console.error('vs or fs err');
			return null;
		}
	}

	static loadShader (gl, shaderNames, waitFunc) {
		ShaderUtil.waitList = ShaderUtil.waitList || {};
		if (shaderNames && shaderNames.length === 3) {
			let indexName = shaderNames[0];
			if (ShaderUtil.waitList[indexName]) {
				return;
			}
			ShaderUtil.waitList[indexName] = {func:waitFunc, gl:gl};
			ShaderUtil.loadShaderFile(shaderNames[1], indexName);
			ShaderUtil.loadShaderFile(shaderNames[2], indexName);
		}
	};
}

ShaderUtil.INDEX_SHADER_TRIANGLES = ['INDEX_SHADER_TRIANGLES', 'vs', 'fs']; // 单个三角形，0点在中心点
ShaderUtil.INDEX_SHADER_TRIANGLES_ZERO_POINT = ['INDEX_SHADER_TRIANGLES_ZERO_POINT', 'vsViewConvert', 'fs']; // 两个三角形，0点在左上角
ShaderUtil.INDEX_SHADER_SINGL_RECT_COLOR = ['INDEX_SHADER_SINGL_RECT_COLOR', 'vsViewConvert', 'fsColor']; // 绘制单个带随机颜色的四边形
ShaderUtil.INDEX_SHADER_TEXUER = ['INDEX_SHADER_TEXUER', 'vsTexture', 'fsTexture']; // 图片
ShaderUtil.INDEX_SHADER_TRANSLATION_MOVE = ['INDEX_SHADER_TRANSLATION_MOVE', 'vsTranslation', 'fsColor']; // 移动
ShaderUtil.INDEX_SHADER_TRANSLATION_ROTATION = ['INDEX_SHADER_TRANSLATION_ROTATION', 'vsTranslationRotation', 'fsColor']; // 移动 + 旋转
ShaderUtil.INDEX_SHADER_SCALE = ['INDEX_SHADER_SCALE', 'vsScale', 'fsColor']; // 移动 + 旋转 + 缩放
ShaderUtil.INDEX_SHADER_MATH = ['INDEX_SHADER_MATH', 'vsMath', 'fsColor']; // 通过矩阵运算变化

ShaderUtil.INDEX_SHADER_3D = ['INDEX_SHADER_3D', 'vs3D', 'fsColorSingle'];
ShaderUtil.INDEX_SHADER_3D_TEXTURE = ['INDEX_SHADER_3D_TEXTURE', 'vs3DTexture', 'fs3DTexture']; // 3D纹理
