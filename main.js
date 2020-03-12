function main() {
    var canvas = document.getElementById("canvas_main"), gl = canvas.getContext("webgl");

    var vertices = [];
    var cubePoints = [
        [-0.5,  0.5,  -0.25], // A
        [-0.5, -0.5,  -0.25], // B
        [0.5,  -0.5,  -0.25], // C
        [0.5,   0.5,  -0.25], // D
        [-0.5,  0.5, -0.5], // E
        [-0.5, -0.5, -0.5], // F
        [0.5,  -0.5, -0.5], // G
        [0.5,  0.5, -0.5],  // H
    ];

    var cubeColors = [
        [],
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
        [1.0, 1.0, 1.0],
        [1.0, 0.5, 0.0],
        [1.0, 1.0, 0.0],
        []
    ];

    function quad(a, b, c, d){
        var indices = [a, b, c, c, d, a];
        for (var i=0; i <indices.length; i++){
            for (var j=0; j<3; j++){
                vertices.push(cubePoints[indices[i]][j]);
            }
            for (var j=0; j<3; j++){
                vertices.push(cubeColors[a][j]);
            }
        }
    }

    // quad(0, 1, 2, 3);
    // quad(3, 2, 6, 7);
    // quad(7, 6, 5, 4);
    // quad(4, 5, 1, 0);
    // quad(4, 0, 3, 7);
    // quad(1, 5, 6, 2);

    quad(1, 2, 3, 0);
    quad(2, 6, 7, 3);
    quad(3, 7, 4, 0);
    quad(4, 5, 1, 0);
    quad(5, 4, 7, 6);
    quad(6, 2, 1, 5);

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var vertexShaderCode = 
        'attribute vec3 aPosition;' +
        'attribute vec3 aColor;' +
        'varying vec3 vColor;' +
        'void main(void) {' +
            ' vColor = aColor;' +
            ' float n = 0.1;' +
            ' float f = 10.0;' +
            ' float tanVal = 0.125;' +
            ' float w = (aPosition.z) * -1.0;' +
            ' float x = aPosition.x * tanVal / w;' +
            ' float y = aPosition.y * tanVal / w;' +
            ' float z = ((aPosition.z) * (f + n) / (f - n) + 2.0 * f * n / (f - n)) / w;' +
            ' gl_Position = vec4(x, y, z, 1.0);' +
            ' gl_PointSize = 5.0;' +
        '}';

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);
    
    var fragmentShaderCode =
        'precision mediump float;' +
        'varying vec3 vColor;' +
        'void main(void) {' +
            'gl_FragColor = vec4(vColor, 1.0);' +
        '}';

    //gl_FragCoord.x

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var position = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(position);
    var color = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(color);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.35, 0.35, 0.9, 0.9);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}
