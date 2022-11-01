"use strict";

var canvas;
var gl;

var points;
const{vec3}=glMatrix;
var points=[];
var theta = 0.0;
var thetaLoc;
var direction = 1;
var delay = 200;
var theta1 = 0.0;
var thetaLoc1;
function changeDir(){
	direction *= -1;
}

function initRotSquare(){
	canvas = document.getElementById( "rot-canvas" );
	gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	var vertices = [
		-0.5, -0.3,0.0,
		 0.0,  0.6, 0.0,
		 0.5, -0.3, 0.0,
		 -0.5,0.3,0.0,
		 0.5,0.3,0.0,
		 0.0,-0.6,0.0,
		 
	];
	var u = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
	var v = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	var w = vec3.fromValues( vertices[6], vertices[7], vertices[8] );


	var x= vec3.fromValues( vertices[9], vertices[10], vertices[11] );
	var y = vec3.fromValues( vertices[12], vertices[13], vertices[14] );
	var z = vec3.fromValues( vertices[15], vertices[16], vertices[17] );
	divideTriangle( u, v, w,3);
	divideTriangle( x, y, z,3);
	
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
	gl.useProgram( program );

	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	thetaLoc = gl.getUniformLocation( program, "theta" );
	document.getElementById( "controls" ).onclick = function( event ){
		switch( event.target.index ){
			case 0:
				direction *= -1;
				break;
			case 1:
				delay /= 2.0;
				break;
			case 2:
				delay *= 2.0;
				break;	
		}
	};
	renderSquare();
}

function renderSquare(){
	/* gl.clear( gl.COLOR_BUFFER_BIT ); */
	
	// set uniform values
	theta += 0.01;
theta += direction * 0.1;
	if( theta > 2 * Math.PI )
		theta -= (2 * Math.PI);
	else if( theta < -2 * Math.PI )
		theta += ( 2 * Math.PI );
	
	gl.uniform1f( thetaLoc, theta );

	gl.drawArrays( gl.TRIANGLES, 0, points.length/3);

	// update and render
	setTimeout( function (){ requestAnimFrame( renderSquare ); }, delay );
}

function divideTriangle (a,b,c,count) {
	if(count==0){
		triangle(a,b,c);
	}
	else{
		var ab=vec3.create();
		vec3.lerp(ab,a,b,0.5);
		var bc=vec3.create();
		vec3.lerp(bc,c,b,0.5);
		var ac=vec3.create();
		vec3.lerp(ac,a,c,0.5);
		// var ab=mix(0.5,a,b);
		// var ac=mix(0.5,a,c);
		// var bc=mix(0.5,b,c);
		--count;
		divideTriangle(a,ab,ac,count);
		divideTriangle(c,bc,ac,count);
		divideTriangle(b,ab,bc,count);
	}
}
function triangle (a,b,c) {
	points.push(a[0],a[1],a[2]);
	points.push(b[0],b[1],b[2]);
	points.push(c[0],c[1],c[2]);
}