// Advanced animations and interactive effects

class AnimationEngine {
    constructor() {
        this.activeAnimations = new Map();
        this.particleSystems = new Map();
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }

    init() {
        this.setupAnimationLoop();
        this.initializeParticleSystems();
        this.setupScrollAnimations();
        this.setupHoverEffects();
    }

    setupAnimationLoop() {
        const animate = () => {
            this.updateParticleSystems();
            this.updateActiveAnimations();
            
            if (this.isRunning) {
                this.animationId = requestAnimationFrame(animate);
            }
        };
        
        this.start();
        animate();
    }

    start() {
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    // Particle Systems
    initializeParticleSystems() {
        // Background particles
        this.createParticleSystem('background', {
            count: 50,
            speed: { min: 0.5, max: 2 },
            size: { min: 1, max: 3 },
            color: 'rgba(79, 172, 254, 0.3)',
            direction: { x: -1, y: -0.5 },
            spawn: { x: window.innerWidth + 10, y: { min: 0, max: window.innerHeight } },
            lifetime: 10000
        });

        // Data flow particles for network simulation
        this.createParticleSystem('dataflow', {
            count: 0, // Manual spawning
            speed: { min: 2, max: 4 },
            size: { min: 3, max: 6 },
            color: 'rgba(79, 172, 254, 0.8)',
            glow: true,
            lifetime: 3000
        });
    }

    createParticleSystem(name, config) {
        const system = {
            particles: [],
            config,
            lastSpawn: 0
        };
        
        this.particleSystems.set(name, system);
        
        // Create initial particles for continuous systems
        if (config.count > 0) {
            for (let i = 0; i < config.count; i++) {
                this.spawnParticle(system, i * (config.lifetime / config.count));
            }
        }
    }

    spawnParticle(system, delay = 0) {
        const config = system.config;
        
        const particle = {
            x: this.randomBetween(config.spawn?.x || 0, config.spawn?.x || window.innerWidth),
            y: this.randomBetween(config.spawn?.y?.min || 0, config.spawn?.y?.max || window.innerHeight),
            vx: this.randomBetween(config.speed.min, config.speed.max) * (config.direction?.x || 1),
            vy: this.randomBetween(config.speed.min, config.speed.max) * (config.direction?.y || 0),
            size: this.randomBetween(config.size.min, config.size.max),
            color: config.color,
            opacity: 1,
            life: 0,
            maxLife: config.lifetime,
            delay: delay,
            glow: config.glow || false
        };
        
        system.particles.push(particle);
    }

    updateParticleSystems() {
        this.particleSystems.forEach((system, name) => {
            // Update existing particles
            system.particles = system.particles.filter(particle => {
                if (particle.delay > 0) {
                    particle.delay -= 16; // Approximate 60fps
                    return true;
                }
                
                particle.life += 16;
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Fade out
                particle.opacity = 1 - (particle.life / particle.maxLife);
                
                // Remove dead particles
                if (particle.life >= particle.maxLife || 
                    particle.x < -50 || particle.x > window.innerWidth + 50 ||
                    particle.y < -50 || particle.y > window.innerHeight + 50) {
                    return false;
                }
                
                return true;
            });
            
            // Spawn new particles for continuous systems
            if (system.config.count > 0) {
                const now = Date.now();
                const spawnInterval = system.config.lifetime / system.config.count;
                
                if (now - system.lastSpawn > spawnInterval) {
                    this.spawnParticle(system);
                    system.lastSpawn = now;
                }
            }
        });
        
        this.renderParticles();
    }

    renderParticles() {
        // Clear previous particles
        const existingParticles = document.querySelectorAll('.animated-particle');
        existingParticles.forEach(p => p.remove());
        
        // Render current particles
        this.particleSystems.forEach(system => {
            system.particles.forEach(particle => {
                if (particle.delay <= 0) {
                    this.renderParticle(particle);
                }
            });
        });
    }

    renderParticle(particle) {
        const element = document.createElement('div');
        element.className = 'animated-particle';
        element.style.cssText = `
            position: fixed;
            left: ${particle.x}px;
            top: ${particle.y}px;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: ${particle.color};
            border-radius: 50%;
            opacity: ${particle.opacity};
            pointer-events: none;
            z-index: 1;
            ${particle.glow ? `box-shadow: 0 0 ${particle.size * 2}px ${particle.color};` : ''}
        `;
        
        document.body.appendChild(element);
    }

    spawnDataPacket(fromX, fromY, toX, toY, color = 'rgba(79, 172, 254, 0.8)') {
        const system = this.particleSystems.get('dataflow');
        if (!system) return;
        
        const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
        const duration = Math.max(1000, distance * 2);
        
        const packet = {
            x: fromX,
            y: fromY,
            targetX: toX,
            targetY: toY,
            vx: (toX - fromX) / (duration / 16),
            vy: (toY - fromY) / (duration / 16),
            size: this.randomBetween(4, 8),
            color: color,
            opacity: 1,
            life: 0,
            maxLife: duration,
            delay: 0,
            glow: true,
            trail: []
        };
        
        system.particles.push(packet);
    }

    // Animation utilities
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    updateActiveAnimations() {
        this.activeAnimations.forEach((animation, id) => {
            animation.update();
            
            if (animation.isComplete()) {
                this.activeAnimations.delete(id);
                if (animation.onComplete) {
                    animation.onComplete();
                }
            }
        });
    }

    // Scroll animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElementIn(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
        
        // Auto-add animation classes to certain elements
        this.addScrollAnimationClasses();
    }

    addScrollAnimationClasses() {
        // Add scroll animations to concept cards
        document.querySelectorAll('.concept-card').forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.dataset.animationDelay = index * 100;
        });
        
        // Add to chapter items
        document.querySelectorAll('.chapter-item').forEach((item, index) => {
            item.classList.add('animate-on-scroll');
            item.dataset.animationDelay = index * 50;
        });
    }

    animateElementIn(element) {
        const delay = parseInt(element.dataset.animationDelay) || 0;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }, delay);
    }

    // Hover effects
    setupHoverEffects() {
        this.setupRippleEffect();
        this.setupMagneticEffect();
        this.setupGlowEffect();
    }

    setupRippleEffect() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.ripple-effect, .control-btn, .explore-btn, .fab');
            if (!target) return;
            
            this.createRipple(target, e.clientX, e.clientY);
        });
    }

    createRipple(element, x, y) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        const size = Math.max(rect.width, rect.height);
        const rippleX = x - rect.left - size / 2;
        const rippleY = y - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            left: ${rippleX}px;
            top: ${rippleY}px;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    setupMagneticEffect() {
        document.querySelectorAll('.magnetic-effect, .fab').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.applyMagneticEffect(element, e);
            });
            
            element.addEventListener('mouseleave', () => {
                this.resetMagneticEffect(element);
            });
        });
    }

    applyMagneticEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (event.clientX - centerX) * 0.15;
        const deltaY = (event.clientY - centerY) * 0.15;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
    }

    resetMagneticEffect(element) {
        element.style.transform = 'translate(0, 0) scale(1)';
    }

    setupGlowEffect() {
        document.querySelectorAll('.glow-effect, .network-node, .topology-node-element').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addGlowEffect(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.removeGlowEffect(element);
            });
        });
    }

    addGlowEffect(element) {
        element.style.filter = 'drop-shadow(0 0 15px rgba(79, 172, 254, 0.6))';
        element.style.transition = 'filter 0.3s ease';
    }

    removeGlowEffect(element) {
        element.style.filter = 'none';
    }

    // Network-specific animations
    animateNetworkConnection(fromElement, toElement, color = '#4facfe') {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        
        const fromX = fromRect.left + fromRect.width / 2;
        const fromY = fromRect.top + fromRect.height / 2;
        const toX = toRect.left + toRect.width / 2;
        const toY = toRect.top + toRect.height / 2;
        
        this.spawnDataPacket(fromX, fromY, toX, toY, color);
    }

    animateProtocolFlow(steps, delay = 1000) {
        steps.forEach((step, index) => {
            setTimeout(() => {
                this.highlightProtocolStep(step);
            }, index * delay);
        });
    }

    highlightProtocolStep(step) {
        const element = document.querySelector(`[data-protocol-step="${step.id}"]`);
        if (!element) return;
        
        element.classList.add('protocol-step-active');
        
        // Create pulse effect
        const pulse = document.createElement('div');
        pulse.className = 'protocol-pulse';
        pulse.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            border: 2px solid ${step.color || '#4facfe'};
            border-radius: inherit;
            animation: protocolPulse 2s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(pulse);
        
        // Show step information
        this.showProtocolStepInfo(step);
        
        // Cleanup
        setTimeout(() => {
            element.classList.remove('protocol-step-active');
            if (pulse.parentNode) {
                pulse.parentNode.removeChild(pulse);
            }
        }, 2000);
    }

    showProtocolStepInfo(step) {
        const info = document.createElement('div');
        info.className = 'protocol-step-info';
        info.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 14px;
            max-width: 300px;
            text-align: center;
            z-index: 1000;
            animation: slideUpFade 0.5s ease-out;
        `;
        
        info.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 5px;">${step.name}</div>
            <div style="opacity: 0.8;">${step.description}</div>
        `;
        
        document.body.appendChild(info);
        
        setTimeout(() => {
            if (info.parentNode) {
                info.parentNode.removeChild(info);
            }
        }, 3000);
    }

    // Topology animations
    animateTopologyBuilding(topology, nodes, delay = 500) {
        nodes.forEach((node, index) => {
            setTimeout(() => {
                this.animateNodeAppearance(node);
            }, index * delay);
        });
        
        // Animate connections after nodes
        setTimeout(() => {
            this.animateTopologyConnections(topology, nodes);
        }, nodes.length * delay + 500);
    }

    animateNodeAppearance(node) {
        const element = document.querySelector(`[data-node-id="${node.id}"]`);
        if (!element) return;
        
        element.style.transform = 'scale(0)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, 50);
    }

    animateTopologyConnections(topology, nodes) {
        const connections = this.getTopologyConnections(topology, nodes);
        
        connections.forEach((connection, index) => {
            setTimeout(() => {
                this.animateConnectionLine(connection);
            }, index * 200);
        });
    }

    getTopologyConnections(topology, nodes) {
        const connections = [];
        
        switch (topology) {
            case 'star':
                const center = nodes[0];
                nodes.slice(1).forEach(node => {
                    connections.push({ from: center, to: node });
                });
                break;
                
            case 'mesh':
                for (let i = 0; i < nodes.length; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        connections.push({ from: nodes[i], to: nodes[j] });
                    }
                }
                break;
                
            case 'ring':
                for (let i = 0; i < nodes.length; i++) {
                    const nextIndex = (i + 1) % nodes.length;
                    connections.push({ from: nodes[i], to: nodes[nextIndex] });
                }
                break;
        }
        
        return connections;
    }

    animateConnectionLine(connection) {
        const line = document.querySelector(`[data-connection="${connection.from.id}-${connection.to.id}"]`);
        if (!line) return;
        
        line.style.strokeDasharray = '10';
        line.style.strokeDashoffset = '10';
        line.style.animation = 'connectionDraw 1s ease-in-out forwards';
    }

    // Data visualization animations
    animateDataTransfer(data, visualization) {
        switch (visualization) {
            case 'packet-flow':
                this.animatePacketFlow(data);
                break;
            case 'protocol-stack':
                this.animateProtocolStack(data);
                break;
            case 'routing-table':
                this.animateRoutingTable(data);
                break;
        }
    }

    animatePacketFlow(packets) {
        packets.forEach((packet, index) => {
            setTimeout(() => {
                this.createPacketAnimation(packet);
            }, index * 300);
        });
    }

    createPacketAnimation(packet) {
        const element = document.createElement('div');
        element.className = 'animated-packet';
        element.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${packet.color || '#4facfe'};
            border-radius: 50%;
            box-shadow: 0 0 10px ${packet.color || '#4facfe'};
            z-index: 100;
        `;
        
        const container = document.querySelector('.network-canvas-container') || document.body;
        container.appendChild(element);
        
        // Animate along path
        this.animateAlongPath(element, packet.path, packet.duration || 2000);
    }

    animateAlongPath(element, path, duration) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const position = this.getPositionOnPath(path, progress);
            element.style.left = `${position.x}px`;
            element.style.top = `${position.y}px`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }
        };
        
        animate();
    }

    getPositionOnPath(path, progress) {
        if (path.length < 2) return path[0] || { x: 0, y: 0 };
        
        const totalLength = this.calculatePathLength(path);
        const targetLength = totalLength * progress;
        
        let currentLength = 0;
        
        for (let i = 0; i < path.length - 1; i++) {
            const segmentLength = this.calculateDistance(path[i], path[i + 1]);
            
            if (currentLength + segmentLength >= targetLength) {
                const segmentProgress = (targetLength - currentLength) / segmentLength;
                return this.interpolatePoints(path[i], path[i + 1], segmentProgress);
            }
            
            currentLength += segmentLength;
        }
        
        return path[path.length - 1];
    }

    calculatePathLength(path) {
        let length = 0;
        for (let i = 0; i < path.length - 1; i++) {
            length += this.calculateDistance(path[i], path[i + 1]);
        }
        return length;
    }

    calculateDistance(p1, p2) {
        return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    }

    interpolatePoints(p1, p2, progress) {
        return {
            x: p1.x + (p2.x - p1.x) * progress,
            y: p1.y + (p2.y - p1.y) * progress
        };
    }

    // Loading animations
    createLoadingAnimation(container, type = 'network') {
        const animations = {
            network: this.createNetworkLoadingAnimation,
            pulse: this.createPulseLoadingAnimation,
            spinner: this.createSpinnerLoadingAnimation
        };
        
        const animationFn = animations[type] || animations.network;
        return animationFn.call(this, container);
    }

    createNetworkLoadingAnimation(container) {
        const loader = document.createElement('div');
        loader.className = 'network-loader';
        loader.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            height: 100%;
        `;
        
        loader.innerHTML = `
            <div class="network-nodes-loader">
                <div class="node-loader"></div>
                <div class="node-loader"></div>
                <div class="node-loader"></div>
                <div class="connection-loader"></div>
                <div class="connection-loader"></div>
            </div>
            <div style="margin-top: 20px; color: var(--text-secondary);">
                Loading network...
            </div>
        `;
        
        container.appendChild(loader);
        return loader;
    }

    // Cleanup
    destroy() {
        this.stop();
        this.particleSystems.clear();
        this.activeAnimations.clear();
        
        // Remove any remaining animated elements
        document.querySelectorAll('.animated-particle, .protocol-pulse, .protocol-step-info').forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    }
}

// Add CSS animations
const animationCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes protocolPulse {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.7;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.3;
        }
        100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
        }
    }
    
    @keyframes slideUpFade {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes connectionDraw {
        to {
            stroke-dashoffset: 0;
        }
    }
    
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .network-nodes-loader {
        position: relative;
        width: 100px;
        height: 60px;
    }
    
    .node-loader {
        position: absolute;
        width: 12px;
        height: 12px;
        background: var(--accent-gradient);
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
        box-shadow: var(--shadow-glow);
    }
    
    .node-loader:nth-child(1) { top: 0; left: 0; animation-delay: 0s; }
    .node-loader:nth-child(2) { top: 0; right: 0; animation-delay: 0.3s; }
    .node-loader:nth-child(3) { bottom: 0; left: 50%; transform: translateX(-50%); animation-delay: 0.6s; }
    
    .connection-loader {
        position: absolute;
        height: 2px;
        background: var(--accent-gradient);
        animation: flow 2s ease-in-out infinite;
    }
    
    .connection-loader:nth-child(4) {
        top: 6px;
        left: 12px;
        width: 76px;
        transform-origin: left;
    }
    
    .connection-loader:nth-child(5) {
        top: 6px;
        left: 44px;
        width: 50px;
        transform: rotate(60deg);
        transform-origin: left;
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

// Initialize Animation Engine
document.addEventListener('DOMContentLoaded', () => {
    window.animationEngine = new AnimationEngine();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationEngine;
}