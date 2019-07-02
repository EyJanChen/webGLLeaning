class DocumentUtil {
	static glContext;
	static getGL () {
		if (!DocumentUtil.glContext) {
			let cvs = document.getElementById('c');
			let gl = cvs.getContext('webgl');
			if (!gl) {
				console.error('gl err');
				return;
			}

			DocumentUtil.glContext = gl;
		}

		return DocumentUtil.glContext;
	}
}
