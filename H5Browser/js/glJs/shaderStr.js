let ShaderStr = (function () {
  function ShaderStr() {

  }

  let __proto = ShaderStr.prototype;

  let vs =
    'attribute vec4 a_position;' +
    'void main() {' +
    ' gl_Position = a_position;' +
    '}';

  let vsViewConvert =
    'attribute vec2 a_position;' + // 需要的位置
    'uniform vec2 u_resolution;' + // 真实大小
    'void main() {' +
    ' vec2 zeroToOne = a_position / u_resolution;' + // 转成0~1
    ' vec2 zeroToTwo = zeroToOne * 2.0;' + // 0~1转成0~2
    ' vec2 clip = zeroToTwo - 1.0;' + // -1~1
    ' gl_Position = vec4(clip * vec2(1, -1), 0, 1);'  + // 0点在左上角
    '}';

  let vsTexture =
    'attribute vec2 a_position;' +
    'uniform vec2 u_resolution;' +
    'attribute vec2 a_texCoord;' +
    'varying vec2 v_texCoord;' +
    'void main() {' +
    ' vec2 zeroToOne = a_position / u_resolution;' +
    ' vec2 zeroToTwo = zeroToOne * 2.0;' +
    ' vec2 clip = zeroToTwo - 1.0;' +
    'v_texCoord = a_texCoord;' + // 纹理坐标
    ' gl_Position = vec4(clip * vec2(1, -1), 0, 1);'  +
    '}';

  let vsTranslation =
    'attribute vec2 a_position;' +
    'uniform vec2 u_resolution;' +
    'uniform vec2 u_translation;' +
    'void main() {' +
    ' vec2 position = a_position + u_translation;' +
    ' vec2 zeroToOne = position / u_resolution;' +
    ' vec2 zeroToTwo = zeroToOne * 2.0;' +
    ' vec2 clip = zeroToTwo - 1.0;' +
    ' gl_Position = vec4(clip * vec2(1, -1), 0, 1);'  +
    '}';

  let vsTranslationRotation =
    'attribute vec2 a_position;' +
    'uniform vec2 u_resolution;' +
    'uniform vec2 u_translation;' +
    'uniform vec2 u_rotation;' +
    'void main() {' +
    ' vec2 rotationPosition = vec2(a_position.x * u_rotation.y + a_position.y * u_rotation.x, a_position.y * u_rotation.y - a_position.x * u_rotation.x);' +
    ' vec2 position = rotationPosition + u_translation;' +
    ' vec2 zeroToOne = position / u_resolution;' +
    ' vec2 zeroToTwo = zeroToOne * 2.0;' +
    ' vec2 clip = zeroToTwo - 1.0;' +
    ' gl_Position = vec4(clip * vec2(1, -1), 0, 1);'  +
    '}';

  let vsScale =
    'attribute vec2 a_position;' +
    'uniform vec2 u_resolution;' +
    'uniform vec2 u_translation;' +
    'uniform vec2 u_rotation;' +
    'uniform vec2 u_scale;' +
    'void main() {' +
    'vec2 transformPosition = a_position * u_scale;' +
    ' vec2 rotationPosition = vec2(transformPosition.x * u_rotation.y + transformPosition.y * u_rotation.x, transformPosition.y * u_rotation.y - transformPosition.x * u_rotation.x);' +
    ' vec2 position = rotationPosition + u_translation;' +
    ' vec2 zeroToOne = position / u_resolution;' +
    ' vec2 zeroToTwo = zeroToOne * 2.0;' +
    ' vec2 clip = zeroToTwo - 1.0;' +
    ' gl_Position = vec4(clip * vec2(1, -1), 0, 1);'  +
    '}';

  let vsMath =
    'attribute vec2 a_position;' +
    'uniform mat3 u_matrix;' +
    'void main() {' +
    ' gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);' +
    '}';

  let vs3D =
    'attribute vec4 a_position;' +
    'uniform mat4 u_matrix;' +
    'attribute vec4 a_color;' +
    'varying vec4 v_color;' +
    'void main() {' +
    ' gl_Position = u_matrix * a_position;' + // 这里不能反过来
    ' v_color = a_color;' +
    '}';

  let vs3DTexture =
    'attribute vec4 a_position;' +
    'uniform mat4 u_matrix;' +
    'attribute vec2 a_texcoord;' +
    'varying vec2 v_texcoord;' +
    'void main() {' +
    ' gl_Position = u_matrix * a_position;' + // 这里不能反过来
    ' v_texcoord = a_texcoord;' +
    '}';

  let fs =
    'precision mediump float;' + // 定义浮点数的精度
    'void main() {' +
    '  gl_FragColor = vec4(1, 0, 0.5, 1);' +
    '}';

  let fsColor =
    'precision mediump float;' +
    'uniform vec4 u_color;' +
    'void main() {' +
    '  gl_FragColor = u_color;' +
    '}';

  let fsTexture =
    'precision mediump float;' +
    'uniform sampler2D u_img;' +
    'varying vec2 v_texCoord;' +
    'void main() {' +
    ' gl_FragColor = texture2D(u_img, v_texCoord).gbra;' +
    '}';

  let fsColorSingle =
    'precision mediump float;' +
    'varying vec4 v_color;' +
    'void main() {' +
    ' gl_FragColor = v_color;' +
    '}';

  let fs3DTexture =
    'precision mediump float;' +
    'varying vec2 v_texcoord;' +
    'uniform sampler2D u_texture;' +
    'void main() {' +
    ' gl_FragColor = texture2D(u_texture, v_texcoord);' +
    '}';

  __proto.getShaderSource = function (index) {
    switch (index) {
      case ShaderStr.INDEX_SHADER_TRIANGLES: {
        return [vs, fs];
      }

      case ShaderStr.INDEX_SHADER_TRIANGLES_ZERO_POINT: {
        return [vsViewConvert, fs];
      }

      case ShaderStr.INDEX_SHADER_SINGL_RECT_COLOR: {
        return [vsViewConvert, fsColor];
      }

      case ShaderStr.INDEX_SHADER_TEXUER: {
        return [vsTexture, fsTexture];
      }

      case ShaderStr.INDEX_SHADER_TRANSLATION_MOVE: {
        return [vsTranslation, fsColor];
      }

      case ShaderStr.INDEX_SHADER_TRANSLATION_ROTATION: {
        return [vsTranslationRotation, fsColor];
      }

      case ShaderStr.INDEX_SHADER_SCALE: {
        return [vsScale, fsColor];
      }

      case ShaderStr.INDEX_SHADER_MATH: {
        return [vsMath, fsColor];
      }

      case ShaderStr.INDEX_SHADER_3D: {
        return [vs3D, fsColorSingle];
      }

      case ShaderStr.INDEX_SHADER_3D_TEXTURE: {
        return [vs3DTexture, fs3DTexture];
      }

      default: {
        return [];
      }
    }
  };


  ShaderStr.INDEX_SHADER_TRIANGLES = 1; // 单个三角形，0点在中心点
  ShaderStr.INDEX_SHADER_TRIANGLES_ZERO_POINT = 2; // 两个三角形，0点在左上角
  ShaderStr.INDEX_SHADER_SINGL_RECT_COLOR = 3; // 绘制单个带随机颜色的四边形
  ShaderStr.INDEX_SHADER_TEXUER = 4; // 图片
  ShaderStr.INDEX_SHADER_TRANSLATION_MOVE = 5; // 移动
  ShaderStr.INDEX_SHADER_TRANSLATION_ROTATION = 6; // 移动 + 旋转
  ShaderStr.INDEX_SHADER_SCALE = 7; // 移动 + 旋转 + 缩放
  ShaderStr.INDEX_SHADER_MATH = 8; // 通过矩阵运算变化

  ShaderStr.INDEX_SHADER_3D = 9;
  ShaderStr.INDEX_SHADER_3D_TEXTURE = 10; // 3D纹理

  return ShaderStr;
} ());
