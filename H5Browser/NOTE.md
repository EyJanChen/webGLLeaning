#WebGL Note

webGL -> 光栅化引擎 -> 提供API -> 写入指令，按照指令输出\画出

[example 所有例子](https://eyjanchen.github.io/webGLLeaning/H5Browser/index.html)

## 基础流程 && 简单三角形
1.在html中定义一个canvas，canvas.getContext(不同的浏览器接口会不同，这里以谷歌浏览器为例子) -> 获取所需要的环境 2d\webgl


```html
<canvas id="c" width="400" height="400"></canvas>
```
```js
let cvs = document.getElementById('c');
let gl = cvs.getContext('webgl');
```
获取webgl的环境 = WebGLRenderingContext -> 可以使用webGL API

2.webGL是在GPU上运行的，那么在GPU上运行就需要有一段代码，也就是一段程序，这段程序 = 顶点着色器 + 片段着色器 = 着色器程序；顶点着色器主要就是位置，片段着色器就是管颜色，像素

3.怎么创建一个有效的着色器程序？ == 创建着色器，一个顶点一个片段 -> 创建一个程序，把着色器放进去（一定要成对 = 顶点 + 片段） -> 和GPU链接一下

4.创建着色器步骤 = 创建 + 赋值 + 编译

```js
// 创建，创建的时候还要告诉一个是什么类型的着色器
let shader = gl.createShader(type); 
// type === gl.VERTEX_SHADER(顶点) gl.FRAGMENT_SHADER(片段) 
```
```js
// 赋值，这个shader需要用到什么程序 -> source 一段着色器代码 GLSL
gl.shaderSource(shader, source);

// 着色器代码
let vs =
    'attribute vec4 a_position;' +
    'void main() {' +
    ' gl_Position = a_position;' +
    '}';
    
let fs =
    'precision mediump float;' + // 定义浮点数的精度
    'void main() {' +
    '  gl_FragColor = vec4(1, 0, 0.5, 1);' +
    '}';
```
```js
// 编译 -> 理解成：变成他内部可以识别的样子
gl.compileShader(shader);
// 看看是不是编译成功了
let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
// 没有成功就删掉这个shader咯
gl.deleteShader(shader);
```

5.在两个shader都完成了上边的步骤之后，就把这两个shader组合成一个程序
  创建program步骤 = 创建 + 赋值 + 链接
  
```js
// 创建一个program
let program = gl.createProgram();
```
```js
// 赋值阶段
gl.attachShader(program, vsShader); // 用的是哪一个顶点着色器
gl.attachShader(program, fsShader); // 用的是哪一个片段着色器
```
```js
// 链接
gl.linkProgram(program);
// 看看是否链接成功
let success = gl.getProgramParameter(program, gl.LINK_STATUS);
// 没有成功就删掉
gl.deleteProgram(program);
```

6.program创建完成了之后，就告诉GPU现在想用新生成的着色器程序，当然你不告诉，就放在那里也行，要用的话就userProgram

```js
gl.useProgram(program);
```

7.上面就是准备阶段，就准备好了着色器，准备好了环境，那么怎么操作，怎么生成图像

8.首先先设置一下视口，设置这个的目的是为了能够告诉WEBGL，怎么把裁剪坐标对应到画布的像素坐标（屏幕坐标）上，因为在webGL中裁剪坐标是-1到1，中间要做一个转换计算。裁剪坐标其实是我们自己定的，通过设置顶点着色器中的gl_Position

```js
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
// 裁剪空间中的（-1，1） == -1，-1 和 1，1点对应的是画布的0, 0 和 width,height
```

9.画画之前就是需要把黑板或者纸什么的擦干净，或者直接拿新纸 = 清空画布

```js
gl.clearColor(1, 1, 1, 1); // R,G,B,A
gl.clear(gl.COLOR_BUFFER_BIT);
```

10.画东西
```js
gl.drawElements
gl.drawArrays
// webGL中绘制东西就只用这两个中的其中一个
// drawArrays(mode: GLenum, first: GLint, count: GLsizei): void;
// mode -> 什么图元 first -> 数据的开始位置, count -> 总共要画多少次
```

画一个三角形可以使用drawArrays,mode是gl.TRIANGLES,也就是三角形，first = 0,count = 3 ->因为有三个点要画，那么总共执行三次

11.光是执行上面的draw是没用的，因为还不知道要画什么，画三角形，那么是什么样的三角形，三角形的数据哪里。在draw的时候运行的就是program里面的东西了，在draw之前我们先要将program里面的东西设置好，好让它知道怎么执行。

12.着色器中的变量申明，着色器获取数据有4种方式 = (attributes + buffer) || uniform || textures || varying

第一种方式 attributes + buffer，属性和缓冲，二进制，这个属性存放在哪个缓冲区中

第二种方式 uniform 全局变量

第三种方式 textures 纹理

第四种方式 varying 可变量，顶点着色器向片段着色器传值

如果想要绘制一个三角形，那么要知道三角形的三个点在什么位置，点或者位置一般用attributes

在顶点着色器中定义了一个attributes vec4 a_position -> vec4 x,y,z,w -> w默认给1

attributes定义好了之后就需要一个缓冲区 -> 步骤 -> 创建 + 绑定 + 赋值

```js
// 创建
let positionBuff = gl.createBuffer();
// 绑定
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
// 赋值
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      0, 0.5,
      0.5, 0.5
    ]), gl.STATIC_DRAW);
```

13.创建好了缓冲区之后，就需要知道怎么从缓冲区里面拿点出来，着色器怎么拿数据

步骤：

拿了数据之后给谁（或者说谁要去哪数据） -> 最后表现是在program上，那么点数据就是我们之前定义的a_position，要现在program中拿到这个a_position

```js
let aPosition = gl.getAttribLocation(program, 'a_position');
```

通知webGL开启通道，webGL是一个巨大的状态机，所以要拿数据，就需要通知，打开谁去拿

```js
gl.enableVertexAttribArray(aPosition);
```
状态开好了之后，需要解决的就是要怎么拿数据
```js
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

// vertexAttribPointer(index: GLuint, size: GLint, type: GLenum, normalized: GLboolean, stride: GLsizei, offset: GLintptr): void;
// index 谁去拿\拿给谁
// size 一次拿多少个
// type 数据类型是什么
// normalized 要不要变成 1 -1的形式
// stride 每组数据的个数
// offset 偏移量
```

14.最后就是使用drawArrays就能够一个三角形

[简单三角形](https://eyjanchen.github.io/webGLLeaning/H5Browser/js/modules/HelloWorld_1.html)

***
##坐标转换

1.在webGL中坐标轴是-1到1，也就是说左上角是(-1, -1),原点在画布中心，那么当我们需要原点(0, 0)在左上角的时候就需要做一些转换，转换过程可以再js代码中实现，也可以在顶点着色器中实现

2.转换过程:首先设点A(200, 200),设左上角坐标O(0, 0),右下角坐标E(400, 400)，那么需要实现的效果是A点需要显示在屏幕中心

```js
let vsViewConvert =
    'attribute vec2 a_position;' + // 需要的位置
    'uniform vec2 u_resolution;' + // 真实大小
    'void main() {' +
    ' vec2 zeroToOne = a_position / u_resolution;' + // 转成0~1
    ' vec2 zeroToTwo = zeroToOne * 2.0;' + // 0~1转成0~2
    ' vec2 clip = zeroToTwo - 1.0;' + // -1~1
    ' gl_Position = vec4(clip * vec2(1, -1), 0, 1);'  + // 0点在左上角
    '}';
// 首先是将点换算成[0, 1]，扩大2倍之后，再-1转换成[-1, 1],最后*[1, -1],最终还是回到了[0, 1]
```

实际上这个过程只是一个转换的过程，实质上的坐标原点是没有改变的，只是在上层应用的时候，方便表达

3.获取program中的uniform变量
```js
let uResolution = gl.getUniformLocation(program, 'u_resolution');
```

给全局变量赋值
```js
gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);
```
[坐标轴转换](https://eyjanchen.github.io/webGLLeaning/H5Browser/js/modules/HelloWorld_2.html)
***
