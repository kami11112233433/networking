// AI Assistant for networking learning

class AIAssistant {
    constructor() {
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.conversationHistory = [];
        this.currentContext = null;
        this.learningProgress = {};
        
        this.init();
    }

    init() {
        this.setupEventHandlers();
        this.loadPersonality();
        this.initializeHelpFeatures();
    }

    initializeKnowledgeBase() {
        return {
            protocols: {
                tcp: {
                    name: 'Transmission Control Protocol',
                    description: 'A reliable, connection-oriented protocol that guarantees data delivery',
                    features: ['Connection-oriented', 'Reliable delivery', 'Flow control', 'Error detection'],
                    use_cases: ['Web browsing (HTTP/HTTPS)', 'Email (SMTP)', 'File transfer (FTP)', 'Remote login (SSH)'],
                    diagram: 'tcp-handshake',
                    interactive: true
                },
                udp: {
                    name: 'User Datagram Protocol',
                    description: 'A fast, connectionless protocol for applications that need speed over reliability',
                    features: ['Connectionless', 'Fast transmission', 'No delivery guarantee', 'Minimal overhead'],
                    use_cases: ['DNS queries', 'Video streaming', 'Online gaming', 'Voice over IP'],
                    diagram: 'udp-flow',
                    interactive: true
                },
                http: {
                    name: 'HyperText Transfer Protocol',
                    description: 'Application layer protocol for transferring web content',
                    features: ['Request-response model', 'Stateless', 'Human-readable', 'Extensible'],
                    use_cases: ['Web browsing', 'REST APIs', 'Web services', 'Content delivery'],
                    diagram: 'http-flow',
                    interactive: true
                },
                dns: {
                    name: 'Domain Name System',
                    description: 'Hierarchical system that translates domain names to IP addresses',
                    features: ['Hierarchical structure', 'Distributed database', 'Caching', 'Load balancing'],
                    use_cases: ['Website access', 'Email routing', 'Service discovery', 'Content distribution'],
                    diagram: 'dns-resolution',
                    interactive: true
                }
            },
            
            models: {
                osi: {
                    name: 'OSI 7-Layer Model',
                    description: 'Conceptual framework for understanding network communication',
                    layers: [
                        { number: 7, name: 'Application', description: 'User interface and network services', examples: ['HTTP', 'FTP', 'SMTP', 'DNS'] },
                        { number: 6, name: 'Presentation', description: 'Data encryption, compression, translation', examples: ['SSL/TLS', 'JPEG', 'ASCII', 'MPEG'] },
                        { number: 5, name: 'Session', description: 'Session management and control', examples: ['NetBIOS', 'RPC', 'SQL sessions', 'X11'] },
                        { number: 4, name: 'Transport', description: 'End-to-end data delivery', examples: ['TCP', 'UDP', 'SPX', 'SCTP'] },
                        { number: 3, name: 'Network', description: 'Routing and logical addressing', examples: ['IP', 'ICMP', 'OSPF', 'BGP'] },
                        { number: 2, name: 'Data Link', description: 'Frame formatting and error detection', examples: ['Ethernet', 'WiFi', 'PPP', 'ATM'] },
                        { number: 1, name: 'Physical', description: 'Physical transmission of raw bits', examples: ['Cables', 'Fiber optics', 'Radio waves', 'Electrical signals'] }
                    ],
                    interactive: true
                },
                
                tcpip: {
                    name: 'TCP/IP Model',
                    description: 'Practical model used by the Internet',
                    layers: [
                        { number: 4, name: 'Application', description: 'Application protocols and services', examples: ['HTTP', 'FTP', 'SMTP', 'DNS'] },
                        { number: 3, name: 'Transport', description: 'Host-to-host communication', examples: ['TCP', 'UDP'] },
                        { number: 2, name: 'Internet', description: 'Routing across networks', examples: ['IP', 'ICMP', 'ARP'] },
                        { number: 1, name: 'Network Access', description: 'Physical network access', examples: ['Ethernet', 'WiFi', 'Token Ring'] }
                    ],
                    interactive: true
                }
            },
            
            topologies: {
                star: {
                    name: 'Star Topology',
                    description: 'All devices connect to a central hub or switch',
                    advantages: ['Easy to install', 'Centralized management', 'Failure isolation', 'Good performance'],
                    disadvantages: ['Single point of failure', 'Hub dependency', 'More cable required'],
                    use_cases: ['Home networks', 'Small offices', 'Ethernet LANs'],
                    interactive: true
                },
                mesh: {
                    name: 'Mesh Topology',
                    description: 'Every device connects to every other device',
                    advantages: ['High redundancy', 'No single point of failure', 'Multiple paths', 'High reliability'],
                    disadvantages: ['Complex installation', 'Expensive', 'Difficult management'],
                    use_cases: ['Critical networks', 'Internet backbone', 'Wireless networks'],
                    interactive: true
                },
                bus: {
                    name: 'Bus Topology',
                    description: 'All devices connect to a single communication line',
                    advantages: ['Simple installation', 'Cost-effective', 'Easy to extend'],
                    disadvantages: ['Single point of failure', 'Performance degradation', 'Collision issues'],
                    use_cases: ['Legacy networks', 'Simple LANs', 'Industrial networks'],
                    interactive: true
                }
            },
            
            concepts: {
                subnetting: {
                    name: 'Subnetting',
                    description: 'Dividing a network into smaller subnetworks',
                    benefits: ['Improved security', 'Better performance', 'Efficient IP usage', 'Reduced broadcasts'],
                    steps: ['Determine requirements', 'Choose subnet mask', 'Calculate subnets', 'Assign addresses'],
                    examples: ['192.168.1.0/24 → 192.168.1.0/26, 192.168.1.64/26, etc.'],
                    calculator: true
                },
                routing: {
                    name: 'Routing',
                    description: 'Process of selecting paths for data packets across networks',
                    types: ['Static routing', 'Dynamic routing', 'Default routing'],
                    algorithms: ['Distance Vector (RIP)', 'Link State (OSPF)', 'Path Vector (BGP)'],
                    metrics: ['Hop count', 'Bandwidth', 'Delay', 'Reliability', 'Cost'],
                    interactive: true
                }
            }
        };
    }

    setupEventHandlers() {
        // Voice recognition setup (if supported)
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.setupVoiceRecognition();
        }
        
        // Setup smart suggestions
        this.setupSmartSuggestions();
        
        // Setup context awareness
        this.setupContextAwareness();
    }

    setupVoiceRecognition() {
        // Check for speech recognition support
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            this.isListening = false;
            
            this.recognition.onstart = () => {
                this.isListening = true;
                const voiceBtn = document.querySelector('.voice-input-btn');
                if (voiceBtn) {
                    voiceBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
                    voiceBtn.innerHTML = '🎤 Listening...';
                }
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                const voiceBtn = document.querySelector('.voice-input-btn');
                if (voiceBtn) {
                    voiceBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                    voiceBtn.innerHTML = '🎤';
                }
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceInput(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.warn('Speech recognition error:', event.error);
                this.isListening = false;
                const voiceBtn = document.querySelector('.voice-input-btn');
                if (voiceBtn) {
                    voiceBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                    voiceBtn.innerHTML = '🎤';
                }
            };
            
            // Setup text-to-speech
            if ('speechSynthesis' in window) {
                this.setupTextToSpeech();
            }
        }
        
        // Add voice input button
        this.addVoiceInputButton();
    }

    setupTextToSpeech() {
        this.speechSynthesis = window.speechSynthesis;
        this.voiceEnabled = false;
        
        // Add voice controls to AI assistant
        this.addVoiceControls();
    }

    addVoiceControls() {
        const aiHeader = document.querySelector('.ai-header');
        if (!aiHeader) return;
        
        const voiceControls = document.createElement('div');
        voiceControls.className = 'voice-controls';
        voiceControls.style.cssText = `
            display: flex;
            gap: 5px;
            margin-left: auto;
        `;
        
        const voiceToggle = document.createElement('button');
        voiceToggle.id = 'voice-toggle';
        voiceToggle.innerHTML = '🔇';
        voiceToggle.title = 'Toggle AI voice responses';
        voiceToggle.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 4px 8px;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        `;
        
        voiceToggle.addEventListener('click', () => {
            this.voiceEnabled = !this.voiceEnabled;
            voiceToggle.innerHTML = this.voiceEnabled ? '🔊' : '🔇';
            voiceToggle.style.color = this.voiceEnabled ? '#4facfe' : 'var(--text-secondary)';
            
            // Show feedback
            this.addAIMessage(
                this.voiceEnabled ? 
                '🔊 Voice responses enabled! I will now speak my answers.' :
                '🔇 Voice responses disabled.',
                'ai'
            );
        });
        
        voiceControls.appendChild(voiceToggle);
        aiHeader.appendChild(voiceControls);
    }

    addVoiceInputButton() {
        const aiInput = document.querySelector('.ai-input');
        if (aiInput && !document.querySelector('.voice-input-btn')) {
            const voiceBtn = document.createElement('button');
            voiceBtn.innerHTML = '🎤';
            voiceBtn.className = 'voice-input-btn';
            voiceBtn.title = 'Click to speak your question';
            voiceBtn.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 8px 12px;
                color: var(--text-secondary);
                cursor: pointer;
                transition: all 0.3s ease;
                margin-left: 5px;
                font-size: 14px;
            `;
            
            voiceBtn.addEventListener('click', () => {
                if (this.recognition) {
                    if (this.isListening) {
                        this.recognition.stop();
                    } else {
                        this.recognition.start();
                    }
                } else {
                    this.addAIMessage('🚫 Voice recognition is not supported in your browser.', 'ai');
                }
            });
            
            voiceBtn.addEventListener('mouseenter', () => {
                voiceBtn.style.background = 'rgba(79, 172, 254, 0.3)';
                voiceBtn.style.borderColor = '#4facfe';
            });
            
            voiceBtn.addEventListener('mouseleave', () => {
                if (!this.isListening) {
                    voiceBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                    voiceBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
            });
            
            aiInput.appendChild(voiceBtn);
        }
    }

    processVoiceInput(transcript) {
        const questionInput = document.getElementById('ai-question');
        if (questionInput) {
            questionInput.value = transcript;
            
            // Show what was heard
            this.addAIMessage(`🎤 I heard: "${transcript}"`, 'user');
            
            // Auto-process the question
            setTimeout(() => {
                this.processQuestion(transcript);
            }, 500);
        }
    }

    speakResponse(text) {
        if (!this.voiceEnabled || !this.speechSynthesis) return;
        
        // Cancel any ongoing speech
        this.speechSynthesis.cancel();
        
        // Clean text for speech (remove markdown, emojis, etc.)
        const cleanText = text
            .replace(/[🔊🔇🎤🤖📊🛣🛡🧪⚡👑🏅🔥👶]/g, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/```.*?```/gs, 'code block')
            .replace(/`(.*?)`/g, '$1');
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Use a pleasant voice if available
        const voices = this.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('Samantha') || 
            voice.name.includes('Karen') ||
            voice.lang.startsWith('en')
        );
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        this.speechSynthesis.speak(utterance);
    }

    setupSmartSuggestions() {
        const questionInput = document.getElementById('ai-question');
        if (!questionInput) return;
        
        // Create suggestions container
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'ai-suggestions';
        suggestionsContainer.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 8px 8px 0 0;
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-height: 150px;
            overflow-y: auto;
            display: none;
            z-index: 1000;
        `;
        
        questionInput.parentElement.style.position = 'relative';
        questionInput.parentElement.appendChild(suggestionsContainer);
        
        // Setup input event listener
        questionInput.addEventListener('input', (e) => {
            this.showSmartSuggestions(e.target.value, suggestionsContainer);
        });
        
        questionInput.addEventListener('focus', (e) => {
            if (e.target.value) {
                this.showSmartSuggestions(e.target.value, suggestionsContainer);
            }
        });
        
        questionInput.addEventListener('blur', () => {
            setTimeout(() => {
                suggestionsContainer.style.display = 'none';
            }, 200);
        });
    }

    showSmartSuggestions(input, container) {
        if (!input || input.length < 2) {
            container.style.display = 'none';
            return;
        }
        
        const suggestions = this.generateSuggestions(input);
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" style="
                padding: 8px 12px;
                cursor: pointer;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                transition: background-color 0.2s ease;
            " onclick="this.parentElement.parentElement.querySelector('input').value = '${suggestion}'; this.parentElement.style.display = 'none';">
                ${suggestion}
            </div>
        `).join('');
        
        container.style.display = 'block';
        
        // Add hover effects
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = 'rgba(79, 172, 254, 0.2)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'transparent';
            });
        });
    }

    generateSuggestions(input) {
        const commonQuestions = [
            'What is the OSI model?',
            'Explain TCP vs UDP',
            'How does DNS work?',
            'What is subnetting?',
            'Explain network topologies',
            'What is the difference between HTTP and HTTPS?',
            'How does routing work?',
            'What is a subnet mask?',
            'Explain the TCP handshake',
            'What is DHCP?',
            'How does ARP work?',
            'What is a VLAN?',
            'Explain network security basics',
            'What is NAT?',
            'How do firewalls work?'
        ];
        
        return commonQuestions.filter(question => 
            question.toLowerCase().includes(input.toLowerCase())
        ).slice(0, 5);
    }

    setupContextAwareness() {
        // Monitor current chapter/section for context
        const observer = new MutationObserver(() => {
            this.updateContext();
        });
        
        const contentArea = document.getElementById('chapter-content');
        if (contentArea) {
            observer.observe(contentArea, { childList: true, subtree: true });
        }
        
        this.updateContext();
    }

    updateContext() {
        // Determine current learning context
        const activeChapter = document.querySelector('.chapter.active');
        if (activeChapter) {
            this.currentContext = activeChapter.id.replace('-chapter', '');
        }
        
        // Update conversation context
        this.setContextualResponses();
    }

    setContextualResponses() {
        const contextualPrompts = {
            intro: 'I see you\'re learning networking fundamentals. Feel free to ask about basic concepts!',
            protocols: 'You\'re exploring network protocols. Ask me about TCP, UDP, HTTP, DNS, or any other protocol!',
            topologies: 'Learning about network topologies? I can explain star, mesh, bus, ring, and hybrid topologies!',
            routing: 'Studying routing and switching? Ask about routing algorithms, switching techniques, or packet forwarding!',
            security: 'Exploring network security? I can help with firewalls, encryption, VPNs, and security protocols!',
            labs: 'Ready for hands-on practice? I can guide you through network simulations and exercises!'
        };
        
        if (this.currentContext && contextualPrompts[this.currentContext]) {
            this.showContextualPrompt(contextualPrompts[this.currentContext]);
        }
    }

    showContextualPrompt(prompt) {
        const lastMessage = document.querySelector('.ai-chat .ai-message:last-child');
        const now = Date.now();
        
        // Only show if no recent contextual prompt
        if (!lastMessage || !lastMessage.dataset.contextual || (now - parseInt(lastMessage.dataset.timestamp)) > 30000) {
            setTimeout(() => {
                this.addAIMessage(prompt, 'ai', true);
            }, 1000);
        }
    }

    processQuestion(question) {
        // Add question to history
        this.conversationHistory.push({
            type: 'user',
            content: question,
            timestamp: Date.now(),
            context: this.currentContext
        });
        
        // Generate response
        const response = this.generateResponse(question);
        
        // Add response to history
        this.conversationHistory.push({
            type: 'ai',
            content: response.text,
            timestamp: Date.now(),
            context: this.currentContext,
            interactive: response.interactive
        });
        
        return response;
    }

    generateResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        // Check for exact topic matches
        const topicResponse = this.findTopicResponse(lowerQuestion);
        if (topicResponse) return topicResponse;
        
        // Check for conceptual matches
        const conceptResponse = this.findConceptualResponse(lowerQuestion);
        if (conceptResponse) return conceptResponse;
        
        // Check for interactive requests
        const interactiveResponse = this.findInteractiveResponse(lowerQuestion);
        if (interactiveResponse) return interactiveResponse;
        
        // Generate contextual response
        const contextualResponse = this.generateContextualResponse(lowerQuestion);
        if (contextualResponse) return contextualResponse;
        
        // Default helpful response
        return this.generateDefaultResponse(question);
    }

    findTopicResponse(question) {
        // OSI Model
        if (question.includes('osi') || question.includes('seven layer') || question.includes('7 layer')) {
            const osi = this.knowledgeBase.models.osi;
            return {
                text: `The ${osi.name} is ${osi.description}. Here are the 7 layers:\n\n${osi.layers.map(layer => 
                    `**Layer ${layer.number} - ${layer.name}**: ${layer.description}\nExamples: ${layer.examples.join(', ')}`
                ).join('\n\n')}\n\nWould you like me to show an interactive visualization?`,
                interactive: 'osi-model',
                type: 'detailed'
            };
        }
        
        // TCP/IP Model
        if (question.includes('tcp/ip model') || question.includes('internet model')) {
            const tcpip = this.knowledgeBase.models.tcpip;
            return {
                text: `The ${tcpip.name} is ${tcpip.description}. Here are the 4 layers:\n\n${tcpip.layers.map(layer => 
                    `**Layer ${layer.number} - ${layer.name}**: ${layer.description}\nExamples: ${layer.examples.join(', ')}`
                ).join('\n\n')}\n\nWould you like to see how it compares to the OSI model?`,
                interactive: 'tcpip-model',
                type: 'detailed'
            };
        }
        
        // TCP Protocol
        if (question.includes('tcp') && !question.includes('tcp/ip') && !question.includes('udp')) {
            const tcp = this.knowledgeBase.protocols.tcp;
            return {
                text: `**${tcp.name} (TCP)** is ${tcp.description}.\n\n**Key Features:**\n${tcp.features.map(f => `• ${f}`).join('\n')}\n\n**Common Use Cases:**\n${tcp.use_cases.map(u => `• ${u}`).join('\n')}\n\nWould you like to see the TCP three-way handshake in action?`,
                interactive: 'tcp-handshake',
                type: 'detailed'
            };
        }
        
        // UDP Protocol
        if (question.includes('udp')) {
            const udp = this.knowledgeBase.protocols.udp;
            return {
                text: `**${udp.name} (UDP)** is ${udp.description}.\n\n**Key Features:**\n${udp.features.map(f => `• ${f}`).join('\n')}\n\n**Common Use Cases:**\n${udp.use_cases.map(u => `• ${u}`).join('\n')}\n\nWant to see how UDP differs from TCP in a simulation?`,
                interactive: 'udp-flow',
                type: 'detailed'
            };
        }
        
        // DNS
        if (question.includes('dns') || question.includes('domain name')) {
            const dns = this.knowledgeBase.protocols.dns;
            return {
                text: `**${dns.name} (DNS)** is ${dns.description}.\n\n**Key Features:**\n${dns.features.map(f => `• ${f}`).join('\n')}\n\n**Common Use Cases:**\n${dns.use_cases.map(u => `• ${u}`).join('\n')}\n\nWould you like to see the DNS resolution process step by step?`,
                interactive: 'dns-resolution',
                type: 'detailed'
            };
        }
        
        return null;
    }

    findConceptualResponse(question) {
        // TCP vs UDP comparison
        if ((question.includes('tcp') && question.includes('udp')) || question.includes('difference between tcp and udp')) {
            return {
                text: `**TCP vs UDP Comparison:**\n\n**TCP (Transmission Control Protocol):**\n• Connection-oriented\n• Reliable delivery guaranteed\n• Error checking and correction\n• Flow control\n• Slower due to overhead\n• Used for: Web browsing, email, file transfer\n\n**UDP (User Datagram Protocol):**\n• Connectionless\n• No delivery guarantee\n• Minimal error checking\n• No flow control\n• Faster, less overhead\n• Used for: Gaming, streaming, DNS queries\n\n**Choose TCP when:** Reliability is crucial\n**Choose UDP when:** Speed is more important than reliability\n\nWant to see both protocols in action?`,
                interactive: 'protocol-comparison',
                type: 'comparison'
            };
        }
        
        // Subnetting
        if (question.includes('subnet') || question.includes('subnetting')) {
            const subnetting = this.knowledgeBase.concepts.subnetting;
            return {
                text: `**${subnetting.name}** is ${subnetting.description}.\n\n**Benefits:**\n${subnetting.benefits.map(b => `• ${b}`).join('\n')}\n\n**Steps to subnet:**\n${subnetting.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n**Example:**\n${subnetting.examples[0]}\n\nWould you like to use the subnet calculator?`,
                interactive: 'subnet-calculator',
                type: 'detailed'
            };
        }
        
        return null;
    }

    findInteractiveResponse(question) {
        if (question.includes('show') || question.includes('demonstrate') || question.includes('simulate')) {
            if (question.includes('handshake') || question.includes('tcp connection')) {
                return {
                    text: "I'll demonstrate the TCP three-way handshake for you! Watch as the client and server establish a connection through SYN, SYN-ACK, and ACK packets.",
                    interactive: 'tcp-handshake',
                    type: 'demo'
                };
            }
            
            if (question.includes('dns') || question.includes('resolution')) {
                return {
                    text: "Let me show you how DNS resolution works! You'll see the step-by-step process of converting a domain name to an IP address.",
                    interactive: 'dns-resolution',
                    type: 'demo'
                };
            }
            
            if (question.includes('routing') || question.includes('packet')) {
                return {
                    text: "I'll simulate packet routing for you! Watch how packets find their way through the network using routing algorithms.",
                    interactive: 'packet-routing',
                    type: 'demo'
                };
            }
        }
        
        return null;
    }

    generateContextualResponse(question) {
        if (!this.currentContext) return null;
        
        const contextResponses = {
            intro: () => {
                if (question.includes('start') || question.includes('begin')) {
                    return {
                        text: "Great! Let's start with networking basics. Here are key concepts to understand:\n\n• **Networks**: Connected devices that can communicate\n• **Protocols**: Rules for how devices communicate\n• **IP Addresses**: Unique identifiers for devices\n• **Packets**: Units of data sent across networks\n\nWhich topic interests you most?",
                        type: 'guidance'
                    };
                }
            },
            
            protocols: () => {
                if (question.includes('which') || question.includes('what protocol')) {
                    return {
                        text: "Here are the main protocols you should know:\n\n• **TCP**: Reliable, connection-oriented (web, email)\n• **UDP**: Fast, connectionless (gaming, streaming)\n• **HTTP/HTTPS**: Web communication\n• **DNS**: Domain name resolution\n• **DHCP**: Automatic IP configuration\n• **ARP**: MAC address resolution\n\nWhich protocol would you like to explore?",
                        type: 'guidance'
                    };
                }
            },
            
            topologies: () => {
                if (question.includes('best') || question.includes('choose')) {
                    return {
                        text: "Choosing a network topology depends on your needs:\n\n• **Star**: Best for small networks, easy management\n• **Mesh**: Best for high reliability, no single point of failure\n• **Bus**: Best for simple, cost-effective setups\n• **Ring**: Best for token-based networks\n\nWhat's your network scenario? I can recommend the best topology!",
                        type: 'guidance'
                    };
                }
            }
        };
        
        const contextFn = contextResponses[this.currentContext];
        return contextFn ? contextFn() : null;
    }

    generateDefaultResponse(question) {
        const helpfulResponses = [
            "That's a great networking question! I can help explain concepts like protocols, topologies, routing, and security. What specific aspect would you like to learn about?",
            "I'm here to help you understand networking! Try asking about specific topics like 'What is TCP?', 'How does DNS work?', or 'Explain network topologies'.",
            "Networking can be complex, but I'll make it clear! Ask me about any protocol, concept, or technology you'd like to understand better.",
            "I love helping with networking questions! Whether it's basics like IP addresses or advanced topics like routing algorithms, I'm here to help."
        ];
        
        return {
            text: helpfulResponses[Math.floor(Math.random() * helpfulResponses.length)],
            type: 'helpful'
        };
    }

    addAIMessage(message, type = 'ai', isContextual = false) {
        const chatContainer = document.querySelector('.ai-chat');
        if (!chatContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';
        if (isContextual) {
            messageDiv.dataset.contextual = 'true';
            messageDiv.dataset.timestamp = Date.now().toString();
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = `message ${type}`;
        
        if (type === 'ai') {
            messageContent.innerHTML = `
                <div class="message-icon">🤖</div>
                <div class="message-content">
                    <p>${this.formatMessage(message)}</p>
                </div>
            `;
            
            // Speak the message if voice is enabled
            if (this.voiceEnabled && message && !message.startsWith('🎤')) {
                // Add a small delay to let the message appear first
                setTimeout(() => {
                    this.speakResponse(message);
                }, 500);
            }
        } else {
            messageContent.innerHTML = `
                <div class="message-icon">👤</div>
                <div class="message-content">
                    <p>${message}</p>
                </div>
            `;
        }
        
        messageDiv.appendChild(messageContent);
        chatContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Add typing animation for AI messages
        if (type === 'ai') {
            this.animateTyping(messageContent.querySelector('p'));
        }
    }

    formatMessage(message) {
        // Convert markdown-like formatting to HTML
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }

    animateTyping(element) {
        const text = element.innerHTML;
        element.innerHTML = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 20);
    }

    triggerInteractiveFeature(feature) {
        const features = {
            'osi-model': () => this.showOSIVisualization(),
            'tcpip-model': () => this.showTCPIPVisualization(),
            'tcp-handshake': () => this.startTCPHandshakeDemo(),
            'dns-resolution': () => this.startDNSResolutionDemo(),
            'protocol-comparison': () => this.showProtocolComparison(),
            'subnet-calculator': () => this.openSubnetCalculator(),
            'packet-routing': () => this.startPacketRoutingDemo()
        };
        
        const featureFn = features[feature];
        if (featureFn) {
            featureFn();
        }
    }

    showOSIVisualization() {
        // Create interactive OSI model visualization
        this.addAIMessage("Let me show you the OSI model layers! Click on any layer to learn more about it.");
        
        if (window.networkingApp) {
            window.networkingApp.showOSIModel();
        }
    }

    startTCPHandshakeDemo() {
        this.addAIMessage("Starting TCP handshake demonstration! Watch the three-way handshake process.");
        
        if (window.networkingSimulation) {
            const clientNode = { x: 100, y: 200, id: 'client' };
            const serverNode = { x: 300, y: 200, id: 'server' };
            window.networkingSimulation.simulateTCPHandshake(clientNode, serverNode);
        }
    }

    startDNSResolutionDemo() {
        this.addAIMessage("Demonstrating DNS resolution! Watch how a domain name gets resolved to an IP address.");
        
        if (window.networkingSimulation) {
            const clientNode = { x: 100, y: 200, id: 'client' };
            const dnsServer = { x: 300, y: 200, id: 'dns-server' };
            window.networkingSimulation.simulateDNSResolution(clientNode, dnsServer, 'example.com');
        }
    }

    showProtocolComparison() {
        this.addAIMessage("I'll create a side-by-side comparison of TCP and UDP protocols for you!");
        
        // Create protocol comparison visualization
        this.createProtocolComparisonChart();
    }

    createProtocolComparisonChart() {
        const comparison = document.createElement('div');
        comparison.className = 'protocol-comparison';
        comparison.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            background: rgba(26, 31, 46, 0.95);
            border-radius: 16px;
            padding: 20px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1100;
        `;
        
        comparison.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: #4facfe; margin: 0;">TCP vs UDP Comparison</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    position: absolute;
                    right: 15px;
                    top: 15px;
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 18px;
                    cursor: pointer;
                ">×</button>
            </div>
            <div style="display: flex; gap: 20px;">
                <div style="flex: 1; background: rgba(79, 172, 254, 0.1); border-radius: 8px; padding: 15px;">
                    <h4 style="color: #4facfe; margin: 0 0 10px 0;">TCP</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #fff;">
                        <li>Connection-oriented</li>
                        <li>Reliable delivery</li>
                        <li>Error checking</li>
                        <li>Flow control</li>
                        <li>Slower</li>
                    </ul>
                </div>
                <div style="flex: 1; background: rgba(86, 204, 242, 0.1); border-radius: 8px; padding: 15px;">
                    <h4 style="color: #56ccf2; margin: 0 0 10px 0;">UDP</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #fff;">
                        <li>Connectionless</li>
                        <li>No delivery guarantee</li>
                        <li>Minimal error checking</li>
                        <li>No flow control</li>
                        <li>Faster</li>
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(comparison);
    }

    openSubnetCalculator() {
        this.addAIMessage("Opening the subnet calculator! You can practice subnetting with different IP ranges.");
        
        // Create subnet calculator interface
        this.createSubnetCalculator();
    }

    createSubnetCalculator() {
        const calculator = document.createElement('div');
        calculator.className = 'subnet-calculator';
        calculator.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: rgba(26, 31, 46, 0.95);
            border-radius: 16px;
            padding: 20px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1100;
        `;
        
        calculator.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: #ffa726; margin: 0;">Subnet Calculator</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    position: absolute;
                    right: 15px;
                    top: 15px;
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 18px;
                    cursor: pointer;
                ">×</button>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="color: #fff; display: block; margin-bottom: 5px;">IP Address:</label>
                <input type="text" id="subnet-ip" value="192.168.1.0" style="
                    width: 100%;
                    padding: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                ">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="color: #fff; display: block; margin-bottom: 5px;">Subnet Mask (CIDR):</label>
                <input type="number" id="subnet-cidr" value="24" min="1" max="32" style="
                    width: 100%;
                    padding: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                ">
            </div>
            <button onclick="calculateSubnet()" style="
                width: 100%;
                padding: 10px;
                background: linear-gradient(135deg, #ffa726, #ff7043);
                border: none;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                cursor: pointer;
                margin-bottom: 15px;
            ">Calculate</button>
            <div id="subnet-results" style="color: #fff; font-family: monospace; font-size: 14px;"></div>
        `;
        
        document.body.appendChild(calculator);
        
        // Add calculation function to global scope
        window.calculateSubnet = () => {
            const ip = document.getElementById('subnet-ip').value;
            const cidr = parseInt(document.getElementById('subnet-cidr').value);
            const results = this.calculateSubnetInfo(ip, cidr);
            
            document.getElementById('subnet-results').innerHTML = `
                <strong>Network Address:</strong> ${results.network}<br>
                <strong>Broadcast Address:</strong> ${results.broadcast}<br>
                <strong>Subnet Mask:</strong> ${results.mask}<br>
                <strong>Host Range:</strong> ${results.hostRange}<br>
                <strong>Total Hosts:</strong> ${results.totalHosts}<br>
                <strong>Usable Hosts:</strong> ${results.usableHosts}
            `;
        };
    }

    calculateSubnetInfo(ip, cidr) {
        // Simple subnet calculation (simplified for demo)
        const ipParts = ip.split('.').map(Number);
        const hostBits = 32 - cidr;
        const totalHosts = Math.pow(2, hostBits);
        const usableHosts = totalHosts - 2;
        
        // Calculate subnet mask
        const maskBits = '1'.repeat(cidr) + '0'.repeat(hostBits);
        const maskParts = [];
        for (let i = 0; i < 4; i++) {
            const byte = maskBits.substr(i * 8, 8);
            maskParts.push(parseInt(byte, 2));
        }
        
        return {
            network: ip,
            broadcast: `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${ipParts[3] + totalHosts - 1}`,
            mask: maskParts.join('.'),
            hostRange: `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${ipParts[3] + 1} - ${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${ipParts[3] + totalHosts - 2}`,
            totalHosts,
            usableHosts
        };
    }

    startPacketRoutingDemo() {
        this.addAIMessage("Starting packet routing demonstration! Watch how packets navigate through the network.");
        
        if (window.networkingApp) {
            window.networkingApp.startSimulation();
        }
    }

    loadPersonality() {
        // Set AI personality traits
        this.personality = {
            helpful: true,
            patient: true,
            encouraging: true,
            technical: true,
            interactive: true
        };
    }

    initializeHelpFeatures() {
        // Initialize contextual help tooltips
        this.addHelpTooltips();
        
        // Initialize quick actions
        this.addQuickActions();
    }

    addHelpTooltips() {
        // Add help tooltips to various elements
        const helpElements = document.querySelectorAll('[data-help]');
        helpElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const helpText = e.target.dataset.help;
                this.showHelpTooltip(helpText, e.target);
            });
        });
    }

    addQuickActions() {
        // Add quick action buttons to AI assistant
        const quickActions = document.createElement('div');
        quickActions.className = 'ai-quick-actions';
        quickActions.style.cssText = `
            padding: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        `;
        
        const actions = [
            { text: 'OSI Model', action: () => this.showOSIVisualization() },
            { text: 'TCP vs UDP', action: () => this.showProtocolComparison() },
            { text: 'Subnet Calc', action: () => this.openSubnetCalculator() },
            { text: 'DNS Demo', action: () => this.startDNSResolutionDemo() }
        ];
        
        actions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action.text;
            button.style.cssText = `
                background: rgba(79, 172, 254, 0.2);
                border: 1px solid rgba(79, 172, 254, 0.3);
                border-radius: 4px;
                padding: 4px 8px;
                color: #4facfe;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
            button.addEventListener('click', action.action);
            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(79, 172, 254, 0.3)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(79, 172, 254, 0.2)';
            });
            quickActions.appendChild(button);
        });
        
        const aiContent = document.querySelector('.ai-content');
        if (aiContent) {
            aiContent.appendChild(quickActions);
        }
    }

    showHelpTooltip(text, element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'help-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1200;
            max-width: 200px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;
        
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 3000);
    }
}

// Initialize AI Assistant
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new AIAssistant();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAssistant;
}