'use client';

import { Renderer, Program, Mesh, Color, Transform, Box, Sphere, Cylinder, Torus } from 'ogl';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const vertexShader = `
  attribute vec3 position;
  attribute vec3 normal;
  
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;

  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  varying vec3 vNormal;
  
  uniform vec3 uColor;
  uniform float uTime;

  void main() {
    vec3 normal = normalize(vNormal);
    float lighting = dot(normal, normalize(vec3(0.5, 1.0, 0.8))) * 0.7 + 0.3;
    
    float fresnel = pow(1.0 - dot(normal, vec3(0, 0, 1.0)), 2.0);
    
    vec3 color = uColor * lighting;
    color += vec3(1.0) * fresnel * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
    let h = hex.startsWith('hsl') ? hslToHex(hex) : hex;
    h = h.replace('#', '').trim();
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const num = parseInt(h, 16);
    return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

function hslToHex(hsl: string): string {
    const hslMatch = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!hslMatch) return "#000000";
    let h = parseInt(hslMatch[1]);
    let s = parseInt(hslMatch[2]) / 100;
    let l = parseInt(hslMatch[3]) / 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    const toHex = (c: number) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    return `#${toHex(r + m)}${toHex(g + m)}${toHex(b + m)}`;
}

type Trophy3DProps = {
  shape?: 'box' | 'sphere' | 'cylinder' | 'torus';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function Trophy3D({
  shape = 'torus',
  color = '#FFD700',
  className,
  style,
}: Trophy3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;

    const renderer = new Renderer({ dpr: 2, alpha: true });
    const gl = renderer.gl;
    ctn.appendChild(gl.canvas);

    const scene = new Transform();

    const geometryMap = {
        box: new Box(gl, { width: 1.5, height: 1.5, depth: 1.5 }),
        sphere: new Sphere(gl, { radius: 1 }),
        cylinder: new Cylinder(gl, { radiusTop: 0.8, radiusBottom: 0.8, height: 2 }),
        torus: new Torus(gl, { radius: 0.8, tube: 0.3 }),
    };

    const geometry = geometryMap[shape];
    
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...hexToRgb(color)) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    const resize = () => {
      if (!ctn) return;
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(ctn);
    resize();

    const update = (t: number) => {
      rafRef.current = requestAnimationFrame(update);
      
      mesh.rotation.y -= 0.005;
      mesh.rotation.x = Math.sin(t * 0.0002) * 0.2;
      
      program.uniforms.uTime.value = t * 0.001;

      renderer.render({ scene });
    };
    rafRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (ctn && gl.canvas.parentElement === ctn) {
          ctn.removeChild(gl.canvas);
      }
      resizeObserver.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [shape, color]);

  return <div ref={containerRef} className={cn("w-full h-full", className)} style={style} />;
}
