// precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying float vElevation;
varying vec2 vUv;
    
void main() {
    // gl_FragColor = vec4(uColor - (1.0 - vElevation) / 2.0, 1.0);
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= (vElevation + 0.3) * 2.0;
    gl_FragColor = textureColor;
}