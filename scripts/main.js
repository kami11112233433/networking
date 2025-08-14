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
        // Create OSI model visualization
        this.showNotification('OSI Model visualization loaded', 'success');
    }

    showTCPIPStack() {
        // Create TCP/IP stack visualization
        this.showNotification('TCP/IP Stack visualization loaded', 'success');
    }

    showPacketFlow() {
        // Start packet flow animation
        this.startSimulation();
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