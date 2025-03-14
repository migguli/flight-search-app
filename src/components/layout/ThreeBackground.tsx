'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './ThreeBackground.module.css';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const timeRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 500;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.1);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    // Track mouse movement for interactive effects
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    // Create particles
    const createParticles = () => {
      // Remove any existing particles
      if (particlesRef.current) {
        scene.remove(particlesRef.current);
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }

      // Create geometry
      const count = 10000;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const rotations = new Float32Array(count);

      // Create particles in a 3D space with varied colors and sizes
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Position particles in a sphere
        const radius = Math.random() * 500;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Random psychedelic colors
        colors[i3] = Math.random();
        colors[i3 + 1] = Math.random();
        colors[i3 + 2] = Math.random();
        
        // Random sizes
        sizes[i] = Math.random() * 5 + 1;
        
        // Random rotations
        rotations[i] = Math.random() * Math.PI * 2;
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      particleGeometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));

      // Create shader material for advanced visual effects
      const particleMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          attribute float size;
          attribute float rotation;
          varying vec3 vColor;
          uniform float time;
          
          void main() {
            vColor = color;
            
            // Animate position with time
            vec3 pos = position;
            float noise = sin(position.x * 0.05 + time) * cos(position.y * 0.05 + time) * sin(position.z * 0.05 + time) * 10.0;
            pos.x += sin(time * 0.5 + position.z * 0.02) * 10.0;
            pos.y += cos(time * 0.4 + position.x * 0.01) * 10.0;
            pos.z += noise;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            
            // Size attenuation
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          uniform float time;
          
          void main() {
            // Calculate position in point with 0,0 being center
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);
            
            // Create a star shape
            float strength = 0.05 / dist;
            
            // Pulse effect
            strength *= 1.0 + 0.3 * sin(time * 2.0);
            
            // Psychedelic color shift
            vec3 color = vColor;
            color.r += 0.2 * sin(time * 2.0 + vColor.g * 5.0);
            color.g += 0.2 * cos(time * 1.5 + vColor.b * 5.0);
            color.b += 0.2 * sin(time * 1.0 + vColor.r * 5.0);
            
            // Add rainbow glow
            float hue = time * 0.1 + dist * 2.0;
            vec3 glow = 0.5 + 0.5 * cos(hue + vec3(0.0, 2.0, 4.0));
            
            gl_FragColor = vec4(mix(color, glow, 0.5) * strength, strength);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: true,
        uniforms: {
          time: { value: 0 }
        }
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      particlesRef.current = particles;
    };

    // Create a pulsing light in the center
    const createCenterLight = () => {
      const light = new THREE.PointLight(0xffffff, 2, 500);
      light.position.set(0, 0, 0);
      scene.add(light);
      
      return light;
    };

    // Add fog for depth effect
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    // Create an outer sphere for a cosmic effect
    const createOuterSphere = () => {
      const geometry = new THREE.SphereGeometry(800, 32, 32);
      const material = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vPosition;
          uniform float time;
          
          // Noise functions for the nebula effect
          float rand(vec2 n) { 
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
          }
          
          float noise(vec2 p) {
            vec2 ip = floor(p);
            vec2 u = fract(p);
            u = u*u*(3.0-2.0*u);
            
            float res = mix(
              mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
              mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x), u.y);
            return res*res;
          }
          
          void main() {
            // Create cosmic nebula effect
            vec3 pos = normalize(vPosition);
            float t = time * 0.1;
            
            // Scrolling nebula pattern
            float n = noise(vec2(pos.x * 5.0 + t, pos.y * 5.0 - t)) * 
                      noise(vec2(pos.z * 5.0 - t, pos.x * 5.0 + t)) * 
                      noise(vec2(pos.y * 5.0 + t, pos.z * 5.0 - t));
            
            // Psychedelic color mapping
            vec3 color1 = vec3(0.5 + 0.5 * sin(t), 0.5 + 0.5 * sin(t + 2.0), 0.5 + 0.5 * sin(t + 4.0));
            vec3 color2 = vec3(0.5 + 0.5 * cos(t + 1.0), 0.5 + 0.5 * cos(t + 3.0), 0.5 + 0.5 * cos(t + 5.0));
            
            vec3 finalColor = mix(color1, color2, n);
            
            // Add star-like sparkles
            if (n > 0.7) {
              finalColor += vec3(1.0) * (n - 0.7) * 3.0;
            }
            
            gl_FragColor = vec4(finalColor, 0.3 * n);
          }
        `,
        uniforms: {
          time: { value: 0 }
        },
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      
      return sphere;
    };

    const centerLight = createCenterLight();
    const outerSphere = createOuterSphere();
    createParticles();

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !particlesRef.current) return;
      
      const time = performance.now() * 0.001; // time in seconds
      timeRef.current = time;
      
      // Update uniforms
      if (particlesRef.current.material instanceof THREE.ShaderMaterial) {
        particlesRef.current.material.uniforms.time.value = time;
      }
      
      if (outerSphere.material instanceof THREE.ShaderMaterial) {
        outerSphere.material.uniforms.time.value = time;
      }
      
      // Rotate the scene based on mouse position
      sceneRef.current.rotation.x += (mouseRef.current.y * 0.01 - sceneRef.current.rotation.x) * 0.05;
      sceneRef.current.rotation.y += (mouseRef.current.x * 0.01 - sceneRef.current.rotation.y) * 0.05;
      
      // Pulsing light effect
      centerLight.intensity = 1.5 + Math.sin(time * 2) * 0.5;
      centerLight.color.setHSL((time * 0.1) % 1, 0.8, 0.5);
      
      // Render
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    };

    // Start animation
    animate();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (particlesRef.current) {
        sceneRef.current?.remove(particlesRef.current);
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }
      
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container} aria-hidden="true" />
  );
} 