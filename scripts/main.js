// Main JavaScript - Core functionality for the networking learning platform

class NetworkingApp {
    constructor() {
        this.currentChapter = 'intro';
        this.isLoading = true;
        this.sidebarCollapsed = false;
        this.aiAssistantCollapsed = false;
        this.simulationRunning = false;
        this.userProgress = this.loadProgress();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.loadChapter(this.currentChapter);
        this.hideLoadingScreen();
        this.startBackgroundAnimations();
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Chapter navigation
        const chapterItems = document.querySelectorAll('.chapter-item');
        chapterItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const chapter = e.currentTarget.dataset.chapter;
                this.loadChapter(chapter);
            });
        });

        // AI Assistant toggle
        const aiToggle = document.getElementById('ai-toggle');
        const aiHeader = document.querySelector('.ai-header');
        if (aiToggle && aiHeader) {
            aiHeader.addEventListener('click', () => this.toggleAIAssistant());
        }

        // AI Assistant input
        const aiSend = document.getElementById('ai-send');
        const aiQuestion = document.getElementById('ai-question');
        if (aiSend && aiQuestion) {
            aiSend.addEventListener('click', () => this.sendAIQuestion());
            aiQuestion.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendAIQuestion();
            });
        }

        // Simulation controls
        const startBtn = document.getElementById('start-simulation');
        const pauseBtn = document.getElementById('pause-simulation');
        const resetBtn = document.getElementById('reset-simulation');
        
        if (startBtn) startBtn.addEventListener('click', () => this.startSimulation());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pauseSimulation());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetSimulation());

        // Concept cards
        const conceptCards = document.querySelectorAll('.concept-card');
        conceptCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const concept = e.currentTarget.dataset.concept;
                this.exploreConcept(concept);
            });
        });

        // Floating action buttons
        const quizFab = document.getElementById('quiz-fab');
        const labFab = document.getElementById('lab-fab');
        const helpFab = document.getElementById('help-fab');

        if (quizFab) quizFab.addEventListener('click', () => this.openQuiz());
        if (labFab) labFab.addEventListener('click', () => this.openLab());
        if (helpFab) helpFab.addEventListener('click', () => this.showHelp());

        // Quiz controls
        const closeQuiz = document.getElementById('close-quiz');
        const submitAnswer = document.getElementById('submit-answer');
        const nextQuestion = document.getElementById('next-question');

        if (closeQuiz) closeQuiz.addEventListener('click', () => this.closeQuiz());
        if (submitAnswer) submitAnswer.addEventListener('click', () => this.submitQuizAnswer());
        if (nextQuestion) nextQuestion.addEventListener('click', () => this.nextQuizQuestion());

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    initializeComponents() {
        // Initialize network canvas
        this.initNetworkCanvas();
        
        // Initialize tooltips
        this.initTooltips();
        
        // Initialize progress tracking
        this.updateProgressBar();
        
        // Initialize particle effects
        this.initParticleEffects();
    }

    initNetworkCanvas() {
        const canvas = document.getElementById('network-canvas');
        if (!canvas) return;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        
        // Initialize network nodes
        this.networkNodes = [
            { id: 'router1', x: 150, y: 100, type: 'router', connected: ['switch1', 'router2'] },
            { id: 'router2', x: 450, y: 100, type: 'router', connected: ['router1', 'server1'] },
            { id: 'switch1', x: 150, y: 250, type: 'switch', connected: ['router1', 'pc1', 'pc2'] },
            { id: 'server1', x: 450, y: 250, type: 'server', connected: ['router2'] },
            { id: 'pc1', x: 75, y: 350, type: 'pc', connected: ['switch1'] },
            { id: 'pc2', x: 225, y: 350, type: 'pc', connected: ['switch1'] }
        ];

        this.packets = [];
        this.animationId = null;
        
        // Start animation loop
        this.animate();
        
        // Add click handler for canvas
        canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        canvas.addEventListener('mousemove', (e) => this.handleCanvasHover(e));
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.drawConnections();
        
        // Draw nodes
        this.drawNodes();
        
        // Draw packets
        this.drawPackets();
        
        // Update packets
        this.updatePackets();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        this.ctx.strokeStyle = 'rgba(79, 172, 254, 0.6)';
        this.ctx.lineWidth = 2;
        
        this.networkNodes.forEach(node => {
            node.connected.forEach(connectedId => {
                const connectedNode = this.networkNodes.find(n => n.id === connectedId);
                if (connectedNode) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(connectedNode.x, connectedNode.y);
                    this.ctx.stroke();
                }
            });
        });
    }

    drawNodes() {
        this.networkNodes.forEach(node => {
            const radius = 15;
            const colors = {
                router: '#4facfe',
                switch: '#56ccf2',
                server: '#f093fb',
                pc: '#ffa726'
            };
            
            // Draw node circle
            this.ctx.fillStyle = colors[node.type] || '#4facfe';
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw node border
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw node label
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(node.type, node.x, node.y + 30);
        });
    }

    drawPackets() {
        this.packets.forEach(packet => {
            this.ctx.fillStyle = '#4facfe';
            this.ctx.shadowColor = '#4facfe';
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(packet.x, packet.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    updatePackets() {
        this.packets = this.packets.filter(packet => {
            // Move packet towards target
            const dx = packet.targetX - packet.x;
            const dy = packet.targetY - packet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5) {
                // Packet reached destination
                return false;
            }
            
            const speed = 2;
            packet.x += (dx / distance) * speed;
            packet.y += (dy / distance) * speed;
            
            return true;
        });
    }

    sendPacket(fromNodeId, toNodeId) {
        const fromNode = this.networkNodes.find(n => n.id === fromNodeId);
        const toNode = this.networkNodes.find(n => n.id === toNodeId);
        
        if (fromNode && toNode) {
            this.packets.push({
                x: fromNode.x,
                y: fromNode.y,
                targetX: toNode.x,
                targetY: toNode.y,
                fromNode: fromNodeId,
                toNode: toNodeId
            });
        }
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if click is on a node
        const clickedNode = this.networkNodes.find(node => {
            const dx = x - node.x;
            const dy = y - node.y;
            return Math.sqrt(dx * dx + dy * dy) < 20;
        });
        
        if (clickedNode) {
            this.showNodeInfo(clickedNode);
            
            // Send a packet for demonstration
            if (clickedNode.connected.length > 0) {
                this.sendPacket(clickedNode.id, clickedNode.connected[0]);
            }
        }
    }

    handleCanvasHover(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if hovering over a node
        const hoveredNode = this.networkNodes.find(node => {
            const dx = x - node.x;
            const dy = y - node.y;
            return Math.sqrt(dx * dx + dy * dy) < 20;
        });
        
        this.canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
    }

    showNodeInfo(node) {
        // Show tooltip with node information
        const tooltip = this.createTooltip();
        tooltip.innerHTML = `
            <strong>${node.type.toUpperCase()}</strong><br>
            ID: ${node.id}<br>
            Connections: ${node.connected.length}
        `;
        
        // Position tooltip
        const rect = this.canvas.getBoundingClientRect();
        tooltip.style.left = `${rect.left + node.x}px`;
        tooltip.style.top = `${rect.top + node.y - 40}px`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 3000);
    }

    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
        return tooltip;
    }

    initTooltips() {
        // Add hover tooltips for interactive elements
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const text = e.target.dataset.tooltip;
                if (text) {
                    const tooltip = this.createTooltip();
                    tooltip.textContent = text;
                    
                    const rect = e.target.getBoundingClientRect();
                    tooltip.style.left = `${rect.left + rect.width / 2}px`;
                    tooltip.style.top = `${rect.top - 40}px`;
                    
                    e.target._tooltip = tooltip;
                }
            });
            
            element.addEventListener('mouseleave', (e) => {
                if (e.target._tooltip) {
                    document.body.removeChild(e.target._tooltip);
                    e.target._tooltip = null;
                }
            });
        });
    }

    initParticleEffects() {
        // Create floating particles in background
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        document.body.appendChild(particleContainer);
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle(particleContainer);
            }, i * 500);
        }
        
        // Continue creating particles
        setInterval(() => {
            this.createParticle(particleContainer);
        }, 2000);
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${8 + Math.random() * 4}s`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 12000);
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        this.sidebarCollapsed = !this.sidebarCollapsed;
        
        if (this.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
    }

    toggleAIAssistant() {
        const aiAssistant = document.getElementById('ai-assistant');
        const aiToggle = document.getElementById('ai-toggle');
        
        this.aiAssistantCollapsed = !this.aiAssistantCollapsed;
        
        if (this.aiAssistantCollapsed) {
            aiAssistant.classList.add('collapsed');
            aiToggle.style.transform = 'rotate(180deg)';
        } else {
            aiAssistant.classList.remove('collapsed');
            aiToggle.style.transform = 'rotate(0deg)';
        }
    }

    loadChapter(chapterId) {
        // Update active chapter in navigation
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-chapter="${chapterId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        // Update content
        document.querySelectorAll('.chapter').forEach(chapter => {
            chapter.classList.remove('active');
        });
        
        const activeChapter = document.getElementById(`${chapterId}-chapter`);
        if (activeChapter) {
            activeChapter.classList.add('active');
        }
        
        // Update title
        const titles = {
            'intro': 'Introduction to Networking',
            'protocols': 'Network Protocols',
            'topologies': 'Network Topologies',
            'routing': 'Routing & Switching',
            'security': 'Network Security',
            'labs': 'Interactive Labs'
        };
        
        const titleElement = document.getElementById('chapter-title');
        if (titleElement && titles[chapterId]) {
            titleElement.textContent = titles[chapterId];
        }
        
        this.currentChapter = chapterId;
        this.updateProgressBar();
        
        // Load chapter-specific content
        this.loadChapterContent(chapterId);
    }

    loadChapterContent(chapterId) {
        // This would typically load content from a data source
        // For now, we'll create some dynamic content
        
        if (chapterId === 'protocols') {
            this.createProtocolDemo();
        } else if (chapterId === 'topologies') {
            this.createTopologyDemo();
        } else if (chapterId === 'routing') {
            this.createRoutingDemo();
        }
    }

    createProtocolDemo() {
        // Add interactive protocol demonstration
        console.log('Creating protocol demo...');
    }

    createTopologyDemo() {
        // Add topology visualization
        console.log('Creating topology demo...');
    }

    createRoutingDemo() {
        // Add routing simulation
        console.log('Creating routing demo...');
    }

    startSimulation() {
        this.simulationRunning = true;
        
        // Start packet animation
        setInterval(() => {
            if (this.simulationRunning && this.networkNodes.length > 1) {
                const fromNode = this.networkNodes[Math.floor(Math.random() * this.networkNodes.length)];
                if (fromNode.connected.length > 0) {
                    const toNodeId = fromNode.connected[Math.floor(Math.random() * fromNode.connected.length)];
                    this.sendPacket(fromNode.id, toNodeId);
                }
            }
        }, 1000);
        
        this.showNotification('Simulation started', 'success');
    }

    pauseSimulation() {
        this.simulationRunning = false;
        this.showNotification('Simulation paused', 'warning');
    }

    resetSimulation() {
        this.simulationRunning = false;
        this.packets = [];
        this.showNotification('Simulation reset', 'success');
    }

    exploreConcept(concept) {
        console.log(`Exploring concept: ${concept}`);
        
        // Create concept-specific visualization
        const concepts = {
            'osi-model': () => this.showOSIModel(),
            'tcp-ip': () => this.showTCPIPStack(),
            'packet-flow': () => this.showPacketFlow()
        };
        
        if (concepts[concept]) {
            concepts[concept]();
        }
    }

    showOSIModel() {
        // Create interactive OSI model visualization
        this.createInteractiveOSIModel();
    }

    createInteractiveOSIModel() {
        // Remove any existing OSI visualization
        const existingViz = document.getElementById('osi-visualization');
        if (existingViz) {
            existingViz.remove();
        }

        const osiContainer = document.createElement('div');
        osiContainer.id = 'osi-visualization';
        osiContainer.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            height: 600px;
            background: rgba(26, 31, 46, 0.95);
            border-radius: 16px;
            padding: 20px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1100;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        `;

        const title = document.createElement('h2');
        title.textContent = '🌐 Interactive OSI Model';
        title.style.cssText = `
            margin: 0;
            color: #4facfe;
            font-size: 24px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✗';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #ff6b6b;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
        `;
        closeBtn.addEventListener('click', () => osiContainer.remove());

        header.appendChild(title);
        header.appendChild(closeBtn);

        const layersContainer = document.createElement('div');
        layersContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            height: 480px;
            overflow-y: auto;
        `;

        const osiLayers = [
            {
                number: 7,
                name: 'Application',
                description: 'User interface and network services',
                examples: ['HTTP', 'FTP', 'SMTP', 'DNS', 'HTTPS', 'SSH'],
                color: '#ff6b6b',
                functions: ['User interface', 'Network services', 'File transfers', 'Email']
            },
            {
                number: 6,
                name: 'Presentation',
                description: 'Data encryption, compression, translation',
                examples: ['SSL/TLS', 'JPEG', 'ASCII', 'MPEG', 'GIF', 'AES'],
                color: '#ff9500',
                functions: ['Encryption', 'Compression', 'Data translation', 'Format conversion']
            },
            {
                number: 5,
                name: 'Session',
                description: 'Session management and control',
                examples: ['NetBIOS', 'RPC', 'SQL sessions', 'X11', 'PPTP'],
                color: '#ffcc00',
                functions: ['Session establishment', 'Session maintenance', 'Session termination', 'Checkpointing']
            },
            {
                number: 4,
                name: 'Transport',
                description: 'End-to-end data delivery',
                examples: ['TCP', 'UDP', 'SPX', 'SCTP', 'DCCP'],
                color: '#4facfe',
                functions: ['Reliability', 'Flow control', 'Error detection', 'Segmentation']
            },
            {
                number: 3,
                name: 'Network',
                description: 'Routing and logical addressing',
                examples: ['IP', 'ICMP', 'OSPF', 'BGP', 'RIP', 'EIGRP'],
                color: '#00d2ff',
                functions: ['Routing', 'Logical addressing', 'Path determination', 'Packet forwarding']
            },
            {
                number: 2,
                name: 'Data Link',
                description: 'Frame formatting and error detection',
                examples: ['Ethernet', 'WiFi', 'PPP', 'ATM', 'Frame Relay'],
                color: '#41b883',
                functions: ['Frame synchronization', 'Error detection', 'Flow control', 'MAC addressing']
            },
            {
                number: 1,
                name: 'Physical',
                description: 'Physical transmission of raw bits',
                examples: ['Cables', 'Fiber optics', 'Radio waves', 'Electrical signals'],
                color: '#34495e',
                functions: ['Bit transmission', 'Physical topology', 'Signal encoding', 'Hardware specs']
            }
        ];

        let selectedLayer = null;

        osiLayers.forEach(layer => {
            const layerElement = document.createElement('div');
            layerElement.className = 'osi-layer';
            layerElement.style.cssText = `
                background: linear-gradient(135deg, ${layer.color}20, ${layer.color}10);
                border-left: 4px solid ${layer.color};
                border-radius: 8px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
            `;

            layerElement.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <h3 style="margin: 0; color: ${layer.color}; font-size: 18px;">
                            Layer ${layer.number}: ${layer.name}
                        </h3>
                        <p style="margin: 5px 0; color: var(--text-secondary); font-size: 14px;">
                            ${layer.description}
                        </p>
                    </div>
                    <div style="font-size: 24px; color: ${layer.color}; opacity: 0.7;">
                        ${layer.number}
                    </div>
                </div>
                <div class="layer-details" style="
                    display: none;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                ">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <h4 style="margin: 0 0 10px 0; color: ${layer.color};">Key Functions</h4>
                            <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary);">
                                ${layer.functions.map(func => `<li>${func}</li>`).join('')}
                            </ul>
                        </div>
                        <div>
                            <h4 style="margin: 0 0 10px 0; color: ${layer.color};">Examples</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                                ${layer.examples.map(example => `
                                    <span style="
                                        background: ${layer.color}30;
                                        color: ${layer.color};
                                        padding: 3px 8px;
                                        border-radius: 12px;
                                        font-size: 12px;
                                        border: 1px solid ${layer.color}50;
                                    ">${example}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add click event to expand/collapse layer details
            layerElement.addEventListener('click', () => {
                const details = layerElement.querySelector('.layer-details');
                const isExpanded = details.style.display === 'block';

                // Collapse all other layers
                layersContainer.querySelectorAll('.layer-details').forEach(d => {
                    d.style.display = 'none';
                });
                layersContainer.querySelectorAll('.osi-layer').forEach(l => {
                    l.style.transform = 'scale(1)';
                    l.style.boxShadow = 'none';
                });

                if (!isExpanded) {
                    details.style.display = 'block';
                    layerElement.style.transform = 'scale(1.02)';
                    layerElement.style.boxShadow = `0 10px 30px ${layer.color}30`;
                    selectedLayer = layer.number;
                } else {
                    selectedLayer = null;
                }
            });

            // Add hover effects
            layerElement.addEventListener('mouseenter', () => {
                if (selectedLayer !== layer.number) {
                    layerElement.style.transform = 'scale(1.01)';
                    layerElement.style.boxShadow = `0 5px 15px rgba(0, 0, 0, 0.2)`;
                }
            });

            layerElement.addEventListener('mouseleave', () => {
                if (selectedLayer !== layer.number) {
                    layerElement.style.transform = 'scale(1)';
                    layerElement.style.boxShadow = 'none';
                }
            });

            layersContainer.appendChild(layerElement);
        });

        const footer = document.createElement('div');
        footer.style.cssText = `
            margin-top: 20px;
            text-align: center;
            color: var(--text-secondary);
            font-size: 14px;
        `;
        footer.innerHTML = '💡 Click on any layer to learn more about its functions and protocols!';

        osiContainer.appendChild(header);
        osiContainer.appendChild(layersContainer);
        osiContainer.appendChild(footer);
        document.body.appendChild(osiContainer);

        // Add entrance animation
        osiContainer.style.opacity = '0';
        osiContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            osiContainer.style.transition = 'all 0.3s ease';
            osiContainer.style.opacity = '1';
            osiContainer.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        this.showNotification('🌐 Interactive OSI Model loaded! Click layers to explore.', 'success');
    }

    showTCPIPStack() {
        // Create TCP/IP stack visualization
        this.createTCPIPStackVisualization();
    }

    createTCPIPStackVisualization() {
        // Remove any existing visualization
        const existingViz = document.getElementById('tcpip-visualization');
        if (existingViz) {
            existingViz.remove();
        }

        const tcpipContainer = document.createElement('div');
        tcpipContainer.id = 'tcpip-visualization';
        tcpipContainer.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 700px;
            height: 500px;
            background: rgba(26, 31, 46, 0.95);
            border-radius: 16px;
            padding: 20px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1100;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        `;

        const title = document.createElement('h2');
        title.textContent = '🌐 TCP/IP Protocol Stack';
        title.style.cssText = `
            margin: 0;
            color: #4facfe;
            font-size: 24px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✗';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #ff6b6b;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
        `;
        closeBtn.addEventListener('click', () => tcpipContainer.remove());

        header.appendChild(title);
        header.appendChild(closeBtn);

        const layersContainer = document.createElement('div');
        layersContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
            height: 400px;
        `;

        const tcpipLayers = [
            {
                number: 4,
                name: 'Application Layer',
                description: 'User applications and network services',
                protocols: ['HTTP', 'HTTPS', 'FTP', 'SMTP', 'DNS', 'DHCP', 'SSH', 'Telnet'],
                color: '#ff6b6b',
                osiEquivalent: 'Layers 5-7 (Session, Presentation, Application)'
            },
            {
                number: 3,
                name: 'Transport Layer',
                description: 'End-to-end communication and reliability',
                protocols: ['TCP', 'UDP'],
                color: '#4facfe',
                osiEquivalent: 'Layer 4 (Transport)'
            },
            {
                number: 2,
                name: 'Internet Layer',
                description: 'Routing and logical addressing',
                protocols: ['IP', 'IPv6', 'ICMP', 'ARP', 'OSPF', 'BGP'],
                color: '#00d2ff',
                osiEquivalent: 'Layer 3 (Network)'
            },
            {
                number: 1,
                name: 'Network Access Layer',
                description: 'Physical network interface',
                protocols: ['Ethernet', 'WiFi', 'PPP', 'Frame Relay'],
                color: '#41b883',
                osiEquivalent: 'Layers 1-2 (Physical, Data Link)'
            }
        ];

        tcpipLayers.forEach(layer => {
            const layerElement = document.createElement('div');
            layerElement.style.cssText = `
                background: linear-gradient(135deg, ${layer.color}20, ${layer.color}10);
                border-left: 6px solid ${layer.color};
                border-radius: 10px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
                flex: 1;
            `;

            layerElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 8px 0; color: ${layer.color}; font-size: 18px;">
                            ${layer.name}
                        </h3>
                        <p style="margin: 0 0 12px 0; color: var(--text-secondary); font-size: 14px;">
                            ${layer.description}
                        </p>
                        <div style="margin-bottom: 10px;">
                            <span style="font-size: 12px; color: var(--text-secondary);">
                                OSI Equivalent: ${layer.osiEquivalent}
                            </span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                            ${layer.protocols.map(protocol => `
                                <span style="
                                    background: ${layer.color}30;
                                    color: ${layer.color};
                                    padding: 4px 10px;
                                    border-radius: 12px;
                                    font-size: 12px;
                                    font-weight: 500;
                                    border: 1px solid ${layer.color}50;
                                ">${protocol}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div style="
                        font-size: 36px; 
                        color: ${layer.color}; 
                        opacity: 0.7;
                        font-weight: bold;
                        margin-left: 20px;
                    ">
                        ${layer.number}
                    </div>
                </div>
            `;

            // Add hover effects
            layerElement.addEventListener('mouseenter', () => {
                layerElement.style.transform = 'scale(1.02)';
                layerElement.style.boxShadow = `0 10px 30px ${layer.color}30`;
            });

            layerElement.addEventListener('mouseleave', () => {
                layerElement.style.transform = 'scale(1)';
                layerElement.style.boxShadow = 'none';
            });

            layersContainer.appendChild(layerElement);
        });

        tcpipContainer.appendChild(header);
        tcpipContainer.appendChild(layersContainer);
        document.body.appendChild(tcpipContainer);

        // Add entrance animation
        tcpipContainer.style.opacity = '0';
        tcpipContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            tcpipContainer.style.transition = 'all 0.3s ease';
            tcpipContainer.style.opacity = '1';
            tcpipContainer.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        this.showNotification('🌐 TCP/IP Stack visualization loaded!', 'success');
    }

    showPacketFlow() {
        // Start enhanced packet flow animation
        this.createPacketFlowVisualization();
    }

    createPacketFlowVisualization() {
        // Remove any existing visualization
        const existingViz = document.getElementById('packet-flow-visualization');
        if (existingViz) {
            existingViz.remove();
        }

        const packetContainer = document.createElement('div');
        packetContainer.id = 'packet-flow-visualization';
        packetContainer.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 900px;
            height: 600px;
            background: rgba(26, 31, 46, 0.95);
            border-radius: 16px;
            padding: 20px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1100;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        `;

        const title = document.createElement('h2');
        title.textContent = '📡 Interactive Packet Flow Simulation';
        title.style.cssText = `
            margin: 0;
            color: #4facfe;
            font-size: 24px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✗';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #ff6b6b;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
        `;
        closeBtn.addEventListener('click', () => packetContainer.remove());

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Create network canvas
        const canvas = document.createElement('canvas');
        canvas.width = 860;
        canvas.height = 400;
        canvas.style.cssText = `
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.3);
        `;

        const ctx = canvas.getContext('2d');

        // Network nodes
        const nodes = [
            { id: 'Client', x: 50, y: 200, color: '#4facfe', type: 'device' },
            { id: 'Router1', x: 200, y: 150, color: '#ff9500', type: 'router' },
            { id: 'Router2', x: 350, y: 200, color: '#ff9500', type: 'router' },
            { id: 'Router3', x: 500, y: 150, color: '#ff9500', type: 'router' },
            { id: 'Switch', x: 650, y: 200, color: '#41b883', type: 'switch' },
            { id: 'Server', x: 800, y: 200, color: '#f093fb', type: 'device' }
        ];

        // Network connections
        const connections = [
            { from: 0, to: 1 },
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 3, to: 4 },
            { from: 4, to: 5 },
            { from: 1, to: 3 } // Alternative path
        ];

        // Packets
        let packets = [];
        let animationId = null;

        function drawNetwork() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            connections.forEach(conn => {
                const from = nodes[conn.from];
                const to = nodes[conn.to];
                
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();
            });

            // Draw nodes
            nodes.forEach(node => {
                // Node circle
                ctx.fillStyle = node.color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
                ctx.fill();

                // Node border
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Node label
                ctx.fillStyle = 'white';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(node.id, node.x, node.y - 35);

                // Node type icon
                const icons = {
                    'device': '💻',
                    'router': '🔀',
                    'switch': '🔀'
                };
                ctx.font = '16px Arial';
                ctx.fillText(icons[node.type] || '⚡', node.x, node.y + 5);
            });

            // Draw packets
            packets.forEach(packet => {
                ctx.fillStyle = packet.color;
                ctx.shadowColor = packet.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(packet.x, packet.y, 8, 0, 2 * Math.PI);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Packet trail
                ctx.fillStyle = packet.color + '40';
                for (let i = 1; i <= 3; i++) {
                    const trailX = packet.x - (packet.dx * i * 5);
                    const trailY = packet.y - (packet.dy * i * 5);
                    ctx.beginPath();
                    ctx.arc(trailX, trailY, 8 - i * 2, 0, 2 * Math.PI);
                    ctx.fill();
                }
            });
        }

        function animatePackets() {
            packets.forEach((packet, index) => {
                packet.x += packet.dx;
                packet.y += packet.dy;

                // Check if packet reached destination
                const target = nodes[packet.target];
                const distance = Math.sqrt((packet.x - target.x) ** 2 + (packet.y - target.y) ** 2);
                
                if (distance < 20) {
                    packets.splice(index, 1);
                    
                    // Create response packet
                    setTimeout(() => {
                        createPacket(packet.target, packet.source, '#f093fb');
                    }, 500);
                }
            });

            drawNetwork();
            animationId = requestAnimationFrame(animatePackets);
        }

        function createPacket(fromIndex, toIndex, color = '#4facfe') {
            const from = nodes[fromIndex];
            const to = nodes[toIndex];
            const distance = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
            const speed = 3;
            
            packets.push({
                x: from.x,
                y: from.y,
                dx: (to.x - from.x) / distance * speed,
                dy: (to.y - from.y) / distance * speed,
                source: fromIndex,
                target: toIndex,
                color: color
            });
        }

        // Controls
        const controls = document.createElement('div');
        controls.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 15px;
            justify-content: center;
        `;

        const sendRequestBtn = document.createElement('button');
        sendRequestBtn.textContent = '📤 Send HTTP Request';
        sendRequestBtn.style.cssText = `
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s ease;
        `;
        sendRequestBtn.addEventListener('click', () => {
            createPacket(0, 5, '#4facfe'); // Client to Server
        });

        const sendPingBtn = document.createElement('button');
        sendPingBtn.textContent = '🏓 Send Ping';
        sendPingBtn.style.cssText = `
            background: linear-gradient(135deg, #ff9500, #ff6b00);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s ease;
        `;
        sendPingBtn.addEventListener('click', () => {
            createPacket(0, 5, '#ff9500'); // Ping packet
        });

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🧹 Clear Packets';
        clearBtn.style.cssText = `
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        `;
        clearBtn.addEventListener('click', () => {
            packets = [];
        });

        // Add hover effects to buttons
        [sendRequestBtn, sendPingBtn, clearBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });

        controls.appendChild(sendRequestBtn);
        controls.appendChild(sendPingBtn);
        controls.appendChild(clearBtn);

        packetContainer.appendChild(header);
        packetContainer.appendChild(canvas);
        packetContainer.appendChild(controls);
        document.body.appendChild(packetContainer);

        // Start animation
        drawNetwork();
        animatePackets();

        // Cleanup on close
        const originalClose = closeBtn.onclick;
        closeBtn.onclick = () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            originalClose();
        };

        // Add entrance animation
        packetContainer.style.opacity = '0';
        packetContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            packetContainer.style.transition = 'all 0.3s ease';
            packetContainer.style.opacity = '1';
            packetContainer.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        this.showNotification('📡 Packet flow simulation loaded! Try sending packets.', 'success');
    }

    sendAIQuestion() {
        const questionInput = document.getElementById('ai-question');
        const question = questionInput.value.trim();
        
        if (!question) return;
        
        // Add user message to chat
        this.addAIMessage(question, 'user');
        
        // Clear input
        questionInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = this.generateAIResponse(question);
            this.addAIMessage(response, 'ai');
        }, 1000);
    }

    addAIMessage(message, type) {
        const chatContainer = document.querySelector('.ai-chat');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';
        
        const messageContent = document.createElement('div');
        messageContent.className = `message ${type}`;
        
        if (type === 'ai') {
            messageContent.innerHTML = `
                <i class="fas fa-robot"></i>
                <p>${message}</p>
            `;
        } else {
            messageContent.innerHTML = `
                <i class="fas fa-user"></i>
                <p>${message}</p>
            `;
        }
        
        messageDiv.appendChild(messageContent);
        chatContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    generateAIResponse(question) {
        // Simple AI response generator (in a real app, this would call an AI API)
        const responses = {
            'osi': 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. Each layer has specific responsibilities in network communication.',
            'tcp': 'TCP (Transmission Control Protocol) is a reliable, connection-oriented protocol that ensures data delivery and maintains packet order.',
            'ip': 'IP (Internet Protocol) is responsible for routing packets between networks and addressing devices with unique IP addresses.',
            'routing': 'Routing is the process of selecting paths in a network to send data packets from source to destination.',
            'subnet': 'Subnetting divides a network into smaller subnetworks to improve performance and security.'
        };
        
        const lowerQuestion = question.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerQuestion.includes(key)) {
                return response;
            }
        }
        
        return 'That\'s a great question! I can help explain networking concepts like OSI model, TCP/IP, routing, subnetting, and more. What specific topic would you like to learn about?';
    }

    openQuiz() {
        const quizPanel = document.getElementById('quiz-panel');
        quizPanel.classList.remove('hidden');
        
        // Load quiz question
        this.loadQuizQuestion();
    }

    closeQuiz() {
        const quizPanel = document.getElementById('quiz-panel');
        quizPanel.classList.add('hidden');
    }

    loadQuizQuestion() {
        const questions = [
            {
                question: "How many layers does the OSI model have?",
                options: ["5", "6", "7", "8"],
                correct: 2
            },
            {
                question: "Which protocol is connection-oriented?",
                options: ["UDP", "TCP", "IP", "ICMP"],
                correct: 1
            },
            {
                question: "What does DNS stand for?",
                options: ["Dynamic Name System", "Domain Name System", "Data Network Service", "Digital Network Standard"],
                correct: 1
            }
        ];
        
        const currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        
        document.getElementById('quiz-question').textContent = currentQuestion.question;
        
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';
        
        currentQuestion.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.textContent = option;
            optionDiv.dataset.index = index;
            optionDiv.addEventListener('click', () => this.selectQuizOption(optionDiv));
            optionsContainer.appendChild(optionDiv);
        });
        
        this.currentQuizQuestion = currentQuestion;
    }

    selectQuizOption(optionElement) {
        // Remove previous selection
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select current option
        optionElement.classList.add('selected');
        this.selectedQuizOption = parseInt(optionElement.dataset.index);
    }

    submitQuizAnswer() {
        if (this.selectedQuizOption === undefined) {
            this.showNotification('Please select an answer', 'warning');
            return;
        }
        
        const isCorrect = this.selectedQuizOption === this.currentQuizQuestion.correct;
        
        // Show correct/incorrect styling
        document.querySelectorAll('.quiz-option').forEach((opt, index) => {
            if (index === this.currentQuizQuestion.correct) {
                opt.classList.add('correct');
            } else if (index === this.selectedQuizOption && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });
        
        // Update UI
        document.getElementById('submit-answer').classList.add('hidden');
        document.getElementById('next-question').classList.remove('hidden');
        
        // Show notification
        if (isCorrect) {
            this.showNotification('Correct! Well done!', 'success');
            this.updateProgress('quiz', 1);
        } else {
            this.showNotification('Incorrect. The correct answer is highlighted.', 'error');
        }
    }

    nextQuizQuestion() {
        // Reset quiz interface
        document.getElementById('submit-answer').classList.remove('hidden');
        document.getElementById('next-question').classList.add('hidden');
        this.selectedQuizOption = undefined;
        
        // Load new question
        this.loadQuizQuestion();
    }

    openLab() {
        this.showNotification('Interactive lab coming soon!', 'info');
    }

    showHelp() {
        this.addAIMessage('Hi! I can help you with any networking questions. Try asking about OSI model, TCP/IP, routing, or any other networking concept!', 'ai');
        
        if (this.aiAssistantCollapsed) {
            this.toggleAIAssistant();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    updateProgressBar() {
        const chapters = ['intro', 'protocols', 'topologies', 'routing', 'security', 'labs'];
        const currentIndex = chapters.indexOf(this.currentChapter);
        const progress = ((currentIndex + 1) / chapters.length) * 100;
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    updateProgress(activity, points) {
        this.userProgress.points += points;
        this.userProgress[activity] = (this.userProgress[activity] || 0) + points;
        this.saveProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem('networking-progress');
        return saved ? JSON.parse(saved) : { points: 0 };
    }

    saveProgress() {
        localStorage.setItem('networking-progress', JSON.stringify(this.userProgress));
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 2000);
    }

    startBackgroundAnimations() {
        // Start any background animations
        this.animateBackground();
    }

    animateBackground() {
        // Background animation logic
        let time = 0;
        
        const animate = () => {
            time += 0.01;
            
            // Update CSS custom properties for animated background
            document.documentElement.style.setProperty('--bg-shift-x', `${Math.sin(time) * 10}px`);
            document.documentElement.style.setProperty('--bg-shift-y', `${Math.cos(time * 0.7) * 5}px`);
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    handleResize() {
        this.resizeCanvas();
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K: Focus AI assistant
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('ai-question').focus();
        }
        
        // Ctrl/Cmd + B: Toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            this.toggleSidebar();
        }
        
        // Escape: Close modals
        if (e.key === 'Escape') {
            this.closeQuiz();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.networkingApp = new NetworkingApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NetworkingApp;
}