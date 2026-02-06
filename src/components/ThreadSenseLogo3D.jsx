import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreadSenseLogo3D() {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const frameRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Measure container
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null; // Transparent background to blend with CSS
        sceneRef.current = scene;

        // Camera
        // Adjusted FOV/Position to keep the object visible regardless of aspect ratio
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
        camera.position.set(0, 0, 12);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.4;
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Enhanced Lighting Setup
        const ambientLight = new THREE.AmbientLight(0x0a0a1a, 0.4);
        scene.add(ambientLight);

        // Key cyan light
        const keyLight = new THREE.PointLight(0x00ffff, 3, 30);
        keyLight.position.set(0, 0, 8);
        scene.add(keyLight);

        // Fill lights for depth
        const fillLight1 = new THREE.PointLight(0x0088ff, 2, 25);
        fillLight1.position.set(6, 4, 6);
        scene.add(fillLight1);

        const fillLight2 = new THREE.PointLight(0x0088ff, 2, 25);
        fillLight2.position.set(-6, -4, 6);
        scene.add(fillLight2);

        // Rim light (purple)
        const rimLight = new THREE.PointLight(0x8800ff, 1.5, 20);
        rimLight.position.set(0, 0, -5);
        scene.add(rimLight);

        // Additional accent lights
        const accentLight1 = new THREE.PointLight(0x00ffff, 1, 15);
        accentLight1.position.set(4, 0, 3);
        scene.add(accentLight1);

        const accentLight2 = new THREE.PointLight(0x00ffff, 1, 15);
        accentLight2.position.set(-4, 0, 3);
        scene.add(accentLight2);

        // Main Group
        const logoGroup = new THREE.Group();
        scene.add(logoGroup);

        // ===== OUTER HUD RINGS =====

        // Outer chrome ring - main structure
        const outerRingGeometry = new THREE.TorusGeometry(3.2, 0.12, 32, 128);
        const chromeMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a6b88,
            metalness: 0.95,
            roughness: 0.15,
            envMapIntensity: 2
        });
        const outerRing = new THREE.Mesh(outerRingGeometry, chromeMaterial);
        logoGroup.add(outerRing);

        // HUD segments on outer ring
        const segmentGroup = new THREE.Group();
        const numSegments = 60;
        const segmentGeometry = new THREE.BoxGeometry(0.08, 0.15, 0.05);
        const segmentMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a4a5a,
            metalness: 0.8,
            roughness: 0.3,
            emissive: 0x1a3a4a,
            emissiveIntensity: 0.2
        });

        for (let i = 0; i < numSegments; i++) {
            const angle = (i / numSegments) * Math.PI * 2;
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial.clone());
            const radius = 3.0;
            segment.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );
            segment.rotation.z = angle;
            segmentGroup.add(segment);
        }
        logoGroup.add(segmentGroup);

        // Glowing accent segments (4 main points)
        const accentSegments = new THREE.Group();
        const accentPositions = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];

        for (let angle of accentPositions) {
            const accentGeo = new THREE.BoxGeometry(0.4, 0.25, 0.08);
            const accentMat = new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                metalness: 0.6,
                roughness: 0.2,
                emissive: 0x00ffff,
                emissiveIntensity: 1.5
            });
            const accent = new THREE.Mesh(accentGeo, accentMat);
            const radius = 3.0;
            accent.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0.1
            );
            accent.rotation.z = angle;
            accentSegments.add(accent);

            // Glow for accents
            const glowGeo = new THREE.BoxGeometry(0.5, 0.35, 0.1);
            const glowMat = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.4
            });
            const glow = new THREE.Mesh(glowGeo, glowMat);
            glow.position.copy(accent.position);
            glow.rotation.z = angle;
            accentSegments.add(glow);
        }
        logoGroup.add(accentSegments);

        // Inner HUD ring with detail
        const innerHUDRing = new THREE.TorusGeometry(2.7, 0.08, 24, 100);
        const innerHUDMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a3a4a,
            metalness: 0.9,
            roughness: 0.2,
            emissive: 0x0066aa,
            emissiveIntensity: 0.3
        });
        const innerHUD = new THREE.Mesh(innerHUDRing, innerHUDMaterial);
        logoGroup.add(innerHUD);

        // Thin glowing ring
        const glowRingGeometry = new THREE.TorusGeometry(2.5, 0.04, 16, 100);
        const glowRingMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            metalness: 0.5,
            roughness: 0.3,
            emissive: 0x00ffff,
            emissiveIntensity: 2
        });
        const glowRing = new THREE.Mesh(glowRingGeometry, glowRingMaterial);
        logoGroup.add(glowRing);

        // ===== BRAIN CIRCUIT BOARD =====

        const brainGroup = new THREE.Group();

        // Create brain outline with circuit traces
        const brainShape = new THREE.Shape();

        // Brain silhouette (simplified)
        brainShape.moveTo(0, 1.2);
        brainShape.bezierCurveTo(0.8, 1.2, 1.4, 0.9, 1.4, 0.3);
        brainShape.bezierCurveTo(1.4, -0.3, 1.2, -0.8, 0.8, -1.1);
        brainShape.bezierCurveTo(0.4, -1.3, 0, -1.3, 0, -1.3);
        brainShape.bezierCurveTo(0, -1.3, -0.4, -1.3, -0.8, -1.1);
        brainShape.bezierCurveTo(-1.2, -0.8, -1.4, -0.3, -1.4, 0.3);
        brainShape.bezierCurveTo(-1.4, 0.9, -0.8, 1.2, 0, 1.2);

        // Base brain surface
        const brainGeometry = new THREE.ExtrudeGeometry(brainShape, {
            depth: 0.05,
            bevelEnabled: false
        });
        const brainBaseMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a1a2a,
            metalness: 0.6,
            roughness: 0.4,
            transparent: true,
            opacity: 0.8
        });
        const brainBase = new THREE.Mesh(brainGeometry, brainBaseMaterial);
        brainBase.position.z = -0.1;
        brainGroup.add(brainBase);

        // Circuit trace lines on brain
        const tracesMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 2,
            metalness: 0.8,
            roughness: 0.2
        });

        // Create circuit paths across brain surface
        const createCircuitPath = (startX, startY, endX, endY, complexity = 3) => {
            const points = [];
            points.push(new THREE.Vector3(startX, startY, 0.1));

            for (let i = 1; i < complexity; i++) {
                const t = i / complexity;
                const x = startX + (endX - startX) * t + (Math.random() - 0.5) * 0.2;
                const y = startY + (endY - startY) * t + (Math.random() - 0.5) * 0.2;
                points.push(new THREE.Vector3(x, y, 0.1));
            }
            points.push(new THREE.Vector3(endX, endY, 0.1));

            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
            return new THREE.Mesh(tubeGeometry, tracesMaterial);
        };

        // Add multiple circuit traces forming brain-like pattern
        const traces = [
            createCircuitPath(-0.8, 0.6, -0.3, -0.4, 5),
            createCircuitPath(0.8, 0.6, 0.3, -0.4, 5),
            createCircuitPath(-0.5, 0.8, 0.5, 0.8, 4),
            createCircuitPath(-0.9, 0, -0.2, -0.7, 6),
            createCircuitPath(0.9, 0, 0.2, -0.7, 6),
            createCircuitPath(-0.4, 0.3, 0.4, 0.3, 3),
            createCircuitPath(-0.6, -0.2, 0.6, -0.2, 4),
            createCircuitPath(0, 0.9, 0, -0.9, 7),
            createCircuitPath(-0.3, 0.5, 0.3, -0.8, 5),
            createCircuitPath(0.3, 0.5, -0.3, -0.8, 5),
        ];

        traces.forEach(trace => brainGroup.add(trace));

        // Circuit nodes (connection points)
        const nodeGeometry = new THREE.SphereGeometry(0.05, 12, 12);
        const nodeMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 3,
            metalness: 0.5,
            roughness: 0.2
        });

        const nodePositions = [
            [-0.8, 0.6], [-0.5, 0.8], [-0.3, 0.5], [-0.6, -0.2], [-0.9, 0],
            [0.8, 0.6], [0.5, 0.8], [0.3, 0.5], [0.6, -0.2], [0.9, 0],
            [0, 0.9], [0, 0.3], [0, -0.3], [0, -0.9],
            [-0.4, 0.3], [0.4, 0.3], [-0.3, -0.4], [0.3, -0.4],
            [-0.2, -0.7], [0.2, -0.7]
        ];

        nodePositions.forEach(([x, y]) => {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
            node.position.set(x, y, 0.15);
            brainGroup.add(node);

            // Node glow
            const glowGeo = new THREE.SphereGeometry(0.08, 12, 12);
            const glowMat = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.5
            });
            const glow = new THREE.Mesh(glowGeo, glowMat);
            glow.position.copy(node.position);
            brainGroup.add(glow);
        });

        logoGroup.add(brainGroup);

        // ===== "TS" LETTERS =====

        const tsGroup = new THREE.Group();

        // Letter material - bright white/cyan with glow
        const letterMaterial = new THREE.MeshStandardMaterial({
            color: 0xe0f8ff,
            metalness: 0.3,
            roughness: 0.2,
            emissive: 0x88ddff,
            emissiveIntensity: 0.6
        });

        // Create "T"
        const tGroup = new THREE.Group();

        // T horizontal
        const tHorizGeo = new THREE.BoxGeometry(0.7, 0.15, 0.2);
        const tHoriz = new THREE.Mesh(tHorizGeo, letterMaterial);
        tHoriz.position.set(0, 0.42, 0);
        tGroup.add(tHoriz);

        // T vertical
        const tVertGeo = new THREE.BoxGeometry(0.15, 0.9, 0.2);
        const tVert = new THREE.Mesh(tVertGeo, letterMaterial.clone());
        tVert.position.set(0, 0, 0);
        tGroup.add(tVert);

        tGroup.position.set(-0.42, 0, 0.3);
        tsGroup.add(tGroup);

        // Create "S"
        const sGroup = new THREE.Group();

        // Top curve of S
        const topCurveGeo = new THREE.TorusGeometry(0.2, 0.08, 16, 32, Math.PI);
        const topCurve = new THREE.Mesh(topCurveGeo, letterMaterial.clone());
        topCurve.rotation.z = Math.PI * 1.5;
        topCurve.position.set(0.1, 0.25, 0);
        sGroup.add(topCurve);

        // Middle bar of S
        const sMidGeo = new THREE.BoxGeometry(0.35, 0.12, 0.2);
        const sMid = new THREE.Mesh(sMidGeo, letterMaterial.clone());
        sMid.position.set(0, 0, 0);
        sMid.rotation.z = -0.2;
        sGroup.add(sMid);

        // Bottom curve of S
        const bottomCurveGeo = new THREE.TorusGeometry(0.2, 0.08, 16, 32, Math.PI);
        const bottomCurve = new THREE.Mesh(bottomCurveGeo, letterMaterial.clone());
        bottomCurve.rotation.z = Math.PI * 0.5;
        bottomCurve.position.set(-0.1, -0.25, 0);
        sGroup.add(bottomCurve);

        sGroup.position.set(0.35, 0, 0.3);
        tsGroup.add(sGroup);

        logoGroup.add(tsGroup);

        // Add letter glow effect
        tsGroup.children.forEach(letterGroup => {
            letterGroup.children.forEach(part => {
                const glowGeo = part.geometry.clone();
                const glowMat = new THREE.MeshBasicMaterial({
                    color: 0x00ffff,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.BackSide
                });
                const glow = new THREE.Mesh(glowGeo, glowMat);
                glow.position.copy(part.position);
                glow.rotation.copy(part.rotation);
                glow.scale.set(1.3, 1.3, 1.3);
                letterGroup.add(glow);
            });
        });

        // ===== VOLUMETRIC ATMOSPHERE =====

        // Inner glow sphere
        const volumeGeo1 = new THREE.SphereGeometry(2.3, 32, 32);
        const volumeMat1 = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide
        });
        const volume1 = new THREE.Mesh(volumeGeo1, volumeMat1);
        logoGroup.add(volume1);

        // Outer glow sphere
        const volumeGeo2 = new THREE.SphereGeometry(3.5, 32, 32);
        const volumeMat2 = new THREE.MeshBasicMaterial({
            color: 0x0088ff,
            transparent: true,
            opacity: 0.04,
            side: THREE.BackSide
        });
        const volume2 = new THREE.Mesh(volumeGeo2, volumeMat2);
        logoGroup.add(volume2);

        // Purple rim glow
        const volumeGeo3 = new THREE.SphereGeometry(4, 32, 32);
        const volumeMat3 = new THREE.MeshBasicMaterial({
            color: 0x8800ff,
            transparent: true,
            opacity: 0.02,
            side: THREE.BackSide
        });
        const volume3 = new THREE.Mesh(volumeGeo3, volumeMat3);
        logoGroup.add(volume3);

        // ===== ANIMATION =====

        let time = 0;
        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            time += 0.01;

            // Slow rotation of outer ring
            outerRing.rotation.z = time * 0.15;
            segmentGroup.rotation.z = time * 0.15;
            accentSegments.rotation.z = time * 0.15;

            // Counter-rotate inner HUD ring
            innerHUD.rotation.z = -time * 0.25;
            glowRing.rotation.z = time * 0.3;

            // Pulse accent segments
            accentSegments.children.forEach((child, i) => {
                if (child.material.emissiveIntensity !== undefined) {
                    const offset = i * Math.PI * 0.5;
                    child.material.emissiveIntensity = 1.5 + Math.sin(time * 2 + offset) * 0.5;
                }
            });

            // Pulse circuit traces
            brainGroup.children.forEach((child, i) => {
                if (child.material && child.material.emissiveIntensity !== undefined) {
                    const pulseSpeed = 1.5 + (i % 7) * 0.2;
                    child.material.emissiveIntensity = 2 + Math.sin(time * pulseSpeed + i) * 0.8;
                }
            });

            // Pulse nodes
            nodePositions.forEach((_, i) => {
                const node = brainGroup.children.find((child, idx) =>
                    idx > 10 && child.geometry?.type === 'SphereGeometry' && idx % 2 === 0
                );
                if (node) {
                    const pulseSpeed = 2 + (i % 5) * 0.3;
                    const scale = 1 + Math.sin(time * pulseSpeed + i) * 0.3;
                    node.scale.set(scale, scale, scale);
                }
            });

            // Subtle TS letter pulse
            tsGroup.children.forEach(letterGroup => {
                letterGroup.children.forEach(part => {
                    if (part.material.emissiveIntensity !== undefined) {
                        part.material.emissiveIntensity = 0.6 + Math.sin(time * 1.5) * 0.2;
                    }
                });
            });

            // Gentle volumetric rotation
            volume1.rotation.y = time * 0.1;
            volume1.rotation.x = Math.sin(time * 0.3) * 0.1;
            volume2.rotation.y = -time * 0.08;
            volume3.rotation.x = time * 0.05;

            // Subtle camera sway
            camera.position.x = Math.sin(time * 0.3) * 0.3;
            camera.position.y = Math.cos(time * 0.4) * 0.2;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        // Handle Window Resize
        const handleResize = () => {
            if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative' // relative to parent
        }}>
            <div ref={mountRef} style={{
                width: '100%',
                height: '100%',
            }} />
        </div>
    );
}
