export const fragment = `
#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

#define iTime time
#define iResolution resolution

#define PI 3.1415926535897932384626433832795
      vec3 pal( float t )
    {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);
    
    
        return a + b*cos( 6.28318*(c*t+d) );
    }
    
    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
        vec2 uv0 = uv;
        vec3 finalColor = vec3(0.0);
        
        
        float d = length(uv);
        
        vec3 col = pal(length(uv0) - iTime);
        
        
        d = sin(d * 8. - iTime) / 8.;
        d=abs(d);
        
        d = 0.01 / d;
        finalColor += col * d;
        fragColor = vec4(finalColor, 1.0);
    }
    void main() {
        mainImage(gl_FragColor, fragCoord.xy);
        gl_FragColor.a = 0.0;
    }
`;
