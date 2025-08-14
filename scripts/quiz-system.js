// Interactive Quiz System for networking learning

class QuizSystem {
    constructor() {
        this.questions = this.initializeQuestions();
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.quizStats = {
            totalQuizzes: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            streakCount: 0,
            bestStreak: 0
        };
        this.achievements = [];
        
        this.init();
    }

    init() {
        this.loadQuizStats();
        this.setupEventListeners();
        this.createQuizModes();
    }

    initializeQuestions() {
        return {
            fundamentals: [
                {
                    id: 'fund_001',
                    question: 'How many layers does the OSI model have?',
                    options: ['5 layers', '6 layers', '7 layers', '8 layers'],
                    correct: 2,
                    explanation: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.',
                    difficulty: 'easy',
                    category: 'fundamentals',
                    tags: ['osi', 'model', 'layers']
                },
                {
                    id: 'fund_002',
                    question: 'Which protocol is connection-oriented and provides reliable data delivery?',
                    options: ['UDP', 'TCP', 'IP', 'ICMP'],
                    correct: 1,
                    explanation: 'TCP (Transmission Control Protocol) is connection-oriented and guarantees reliable data delivery through acknowledgments and retransmissions.',
                    difficulty: 'easy',
                    category: 'fundamentals',
                    tags: ['tcp', 'protocol', 'reliable']
                },
                {
                    id: 'fund_003',
                    question: 'What does DNS stand for?',
                    options: ['Dynamic Name System', 'Domain Name System', 'Data Network Service', 'Digital Network Standard'],
                    correct: 1,
                    explanation: 'DNS (Domain Name System) is a hierarchical system that translates human-readable domain names into IP addresses.',
                    difficulty: 'easy',
                    category: 'fundamentals',
                    tags: ['dns', 'domain', 'resolution']
                },
                {
                    id: 'fund_004',
                    question: 'Which topology connects all devices to a central hub or switch?',
                    options: ['Bus topology', 'Ring topology', 'Star topology', 'Mesh topology'],
                    correct: 2,
                    explanation: 'Star topology connects all devices to a central hub or switch, providing easy management and fault isolation.',
                    difficulty: 'easy',
                    category: 'fundamentals',
                    tags: ['topology', 'star', 'hub']
                },
                {
                    id: 'fund_005',
                    question: 'What is the default subnet mask for a Class C network?',
                    options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'],
                    correct: 2,
                    explanation: 'Class C networks use a default subnet mask of 255.255.255.0 (/24), which provides 254 usable host addresses.',
                    difficulty: 'medium',
                    category: 'fundamentals',
                    tags: ['subnet', 'class-c', 'ip']
                }
            ],
            
            protocols: [
                {
                    id: 'prot_001',
                    question: 'In the TCP three-way handshake, what is the correct sequence?',
                    options: ['SYN → ACK → SYN-ACK', 'SYN → SYN-ACK → ACK', 'ACK → SYN → SYN-ACK', 'SYN-ACK → SYN → ACK'],
                    correct: 1,
                    explanation: 'The TCP handshake follows: 1) Client sends SYN, 2) Server responds with SYN-ACK, 3) Client sends ACK to complete the connection.',
                    difficulty: 'medium',
                    category: 'protocols',
                    tags: ['tcp', 'handshake', 'connection']
                },
                {
                    id: 'prot_002',
                    question: 'Which HTTP status code indicates "Not Found"?',
                    options: ['200', '301', '404', '500'],
                    correct: 2,
                    explanation: 'HTTP status code 404 indicates that the requested resource was not found on the server.',
                    difficulty: 'easy',
                    category: 'protocols',
                    tags: ['http', 'status-code', 'error']
                },
                {
                    id: 'prot_003',
                    question: 'What port does HTTPS typically use?',
                    options: ['80', '443', '8080', '22'],
                    correct: 1,
                    explanation: 'HTTPS (HTTP Secure) typically uses port 443 for encrypted web communications using SSL/TLS.',
                    difficulty: 'easy',
                    category: 'protocols',
                    tags: ['https', 'port', 'security']
                },
                {
                    id: 'prot_004',
                    question: 'Which protocol is used for automatic IP address assignment?',
                    options: ['ARP', 'DHCP', 'ICMP', 'SNMP'],
                    correct: 1,
                    explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, and other network configuration to devices.',
                    difficulty: 'medium',
                    category: 'protocols',
                    tags: ['dhcp', 'ip-assignment', 'configuration']
                },
                {
                    id: 'prot_005',
                    question: 'What is the maximum segment size (MSS) typically based on?',
                    options: ['Window size', 'MTU', 'Buffer size', 'Bandwidth'],
                    correct: 1,
                    explanation: 'The Maximum Segment Size (MSS) is typically based on the Maximum Transmission Unit (MTU) of the network path to avoid fragmentation.',
                    difficulty: 'hard',
                    category: 'protocols',
                    tags: ['mss', 'mtu', 'fragmentation']
                }
            ],
            
            routing: [
                {
                    id: 'rout_001',
                    question: 'Which routing protocol is considered a distance-vector protocol?',
                    options: ['OSPF', 'BGP', 'RIP', 'IS-IS'],
                    correct: 2,
                    explanation: 'RIP (Routing Information Protocol) is a distance-vector routing protocol that uses hop count as its metric.',
                    difficulty: 'medium',
                    category: 'routing',
                    tags: ['rip', 'distance-vector', 'routing-protocol']
                },
                {
                    id: 'rout_002',
                    question: 'What is the administrative distance of directly connected routes?',
                    options: ['0', '1', '90', '110'],
                    correct: 0,
                    explanation: 'Directly connected routes have an administrative distance of 0, making them the most trusted route source.',
                    difficulty: 'medium',
                    category: 'routing',
                    tags: ['administrative-distance', 'routing', 'directly-connected']
                },
                {
                    id: 'rout_003',
                    question: 'Which algorithm does OSPF use for shortest path calculation?',
                    options: ['Bellman-Ford', 'Dijkstra', 'Floyd-Warshall', 'A*'],
                    correct: 1,
                    explanation: 'OSPF uses Dijkstra\'s algorithm to calculate the shortest path first (SPF) tree for route determination.',
                    difficulty: 'hard',
                    category: 'routing',
                    tags: ['ospf', 'dijkstra', 'spf', 'algorithm']
                },
                {
                    id: 'rout_004',
                    question: 'What is the default metric used by RIP?',
                    options: ['Bandwidth', 'Delay', 'Hop count', 'Cost'],
                    correct: 2,
                    explanation: 'RIP uses hop count as its metric, with a maximum of 15 hops (16 is considered unreachable).',
                    difficulty: 'easy',
                    category: 'routing',
                    tags: ['rip', 'hop-count', 'metric']
                },
                {
                    id: 'rout_005',
                    question: 'In BGP, what is an Autonomous System (AS)?',
                    options: ['A single router', 'A group of networks under common administrative control', 'A network protocol', 'A routing table'],
                    correct: 1,
                    explanation: 'An Autonomous System (AS) is a collection of networks under a single administrative domain that shares a common routing policy.',
                    difficulty: 'medium',
                    category: 'routing',
                    tags: ['bgp', 'autonomous-system', 'routing-policy']
                }
            ],
            
            security: [
                {
                    id: 'sec_001',
                    question: 'Which type of firewall operates at the application layer?',
                    options: ['Packet filter', 'Stateful inspection', 'Application gateway', 'Circuit gateway'],
                    correct: 2,
                    explanation: 'Application gateway firewalls (proxy firewalls) operate at the application layer and can inspect the content of application protocols.',
                    difficulty: 'medium',
                    category: 'security',
                    tags: ['firewall', 'application-layer', 'proxy']
                },
                {
                    id: 'sec_002',
                    question: 'What does VPN stand for?',
                    options: ['Virtual Private Network', 'Very Private Network', 'Validated Private Network', 'Variable Protocol Network'],
                    correct: 0,
                    explanation: 'VPN stands for Virtual Private Network, which creates a secure tunnel over a public network for private communications.',
                    difficulty: 'easy',
                    category: 'security',
                    tags: ['vpn', 'virtual-private-network', 'tunnel']
                },
                {
                    id: 'sec_003',
                    question: 'Which encryption method is considered symmetric?',
                    options: ['RSA', 'AES', 'ECC', 'DSA'],
                    correct: 1,
                    explanation: 'AES (Advanced Encryption Standard) is a symmetric encryption algorithm that uses the same key for both encryption and decryption.',
                    difficulty: 'medium',
                    category: 'security',
                    tags: ['aes', 'symmetric', 'encryption']
                },
                {
                    id: 'sec_004',
                    question: 'What is the purpose of a DMZ in network security?',
                    options: ['To block all traffic', 'To isolate servers accessible from the internet', 'To encrypt data', 'To monitor network traffic'],
                    correct: 1,
                    explanation: 'A DMZ (Demilitarized Zone) is a network segment that isolates servers that need to be accessible from the internet while protecting the internal network.',
                    difficulty: 'medium',
                    category: 'security',
                    tags: ['dmz', 'network-segmentation', 'security']
                },
                {
                    id: 'sec_005',
                    question: 'Which protocol provides secure remote access to network devices?',
                    options: ['Telnet', 'SSH', 'FTP', 'HTTP'],
                    correct: 1,
                    explanation: 'SSH (Secure Shell) provides encrypted remote access to network devices, replacing insecure protocols like Telnet.',
                    difficulty: 'easy',
                    category: 'security',
                    tags: ['ssh', 'remote-access', 'encryption']
                }
            ],
            
            advanced: [
                {
                    id: 'adv_001',
                    question: 'In IPv6, what is the size of the address space?',
                    options: ['64 bits', '96 bits', '128 bits', '256 bits'],
                    correct: 2,
                    explanation: 'IPv6 addresses are 128 bits long, providing approximately 3.4 × 10^38 unique addresses.',
                    difficulty: 'medium',
                    category: 'advanced',
                    tags: ['ipv6', 'address-space', '128-bit']
                },
                {
                    id: 'adv_002',
                    question: 'What is the purpose of MPLS in networking?',
                    options: ['Encryption', 'Label switching for efficient packet forwarding', 'Network monitoring', 'Address translation'],
                    correct: 1,
                    explanation: 'MPLS (Multiprotocol Label Switching) uses labels to make packet forwarding decisions more efficiently than traditional IP routing.',
                    difficulty: 'hard',
                    category: 'advanced',
                    tags: ['mpls', 'label-switching', 'forwarding']
                },
                {
                    id: 'adv_003',
                    question: 'Which QoS mechanism can guarantee bandwidth for specific traffic?',
                    options: ['Best effort', 'Traffic shaping', 'Traffic policing', 'Guaranteed bandwidth reservation'],
                    correct: 3,
                    explanation: 'Guaranteed bandwidth reservation (like IntServ/RSVP) can provide hard guarantees for specific traffic flows.',
                    difficulty: 'hard',
                    category: 'advanced',
                    tags: ['qos', 'bandwidth-reservation', 'traffic-guarantee']
                },
                {
                    id: 'adv_004',
                    question: 'In SDN, what component makes forwarding decisions?',
                    options: ['Switch', 'Controller', 'Host', 'Router'],
                    correct: 1,
                    explanation: 'In Software-Defined Networking (SDN), the centralized controller makes forwarding decisions and programs the data plane devices.',
                    difficulty: 'hard',
                    category: 'advanced',
                    tags: ['sdn', 'controller', 'forwarding-decisions']
                },
                {
                    id: 'adv_005',
                    question: 'What is the main advantage of using VXLAN?',
                    options: ['Faster routing', 'Network virtualization and scalability', 'Better security', 'Lower latency'],
                    correct: 1,
                    explanation: 'VXLAN (Virtual Extensible LAN) enables network virtualization and provides scalability beyond traditional VLAN limits.',
                    difficulty: 'hard',
                    category: 'advanced',
                    tags: ['vxlan', 'network-virtualization', 'scalability']
                }
            ]
        };
    }

    setupEventListeners() {
        // Quiz option selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quiz-option')) {
                this.selectQuizOption(e.target);
            }
        });
    }

    createQuizModes() {
        this.quizModes = {
            practice: {
                name: 'Practice Mode',
                description: 'Learn at your own pace with immediate feedback',
                icon: 'fas fa-graduation-cap',
                showExplanations: true,
                allowRetry: true,
                timeLimit: null
            },
            challenge: {
                name: 'Challenge Mode',
                description: 'Test your knowledge with timed questions',
                icon: 'fas fa-stopwatch',
                showExplanations: false,
                allowRetry: false,
                timeLimit: 30
            },
            certification: {
                name: 'Certification Prep',
                description: 'Simulate real certification exam conditions',
                icon: 'fas fa-certificate',
                showExplanations: false,
                allowRetry: false,
                timeLimit: 60,
                passingScore: 80
            },
            adaptive: {
                name: 'Adaptive Learning',
                description: 'Questions adapt to your skill level',
                icon: 'fas fa-brain',
                showExplanations: true,
                allowRetry: true,
                timeLimit: null,
                adaptive: true
            }
        };
    }

    startQuiz(category = 'mixed', mode = 'practice', questionCount = 10) {
        this.currentQuiz = {
            category,
            mode: this.quizModes[mode],
            questions: this.generateQuizQuestions(category, questionCount, mode),
            startTime: Date.now(),
            timeLimit: this.quizModes[mode].timeLimit,
            score: 0,
            totalTime: 0
        };
        
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        
        this.showQuizInterface();
        this.loadQuestion();
        
        if (this.currentQuiz.timeLimit) {
            this.startQuizTimer();
        }
    }

    generateQuizQuestions(category, count, mode) {
        let questionPool = [];
        
        if (category === 'mixed') {
            // Mix questions from all categories
            Object.values(this.questions).forEach(categoryQuestions => {
                questionPool = questionPool.concat(categoryQuestions);
            });
        } else if (this.questions[category]) {
            questionPool = [...this.questions[category]];
        }
        
        // Filter by difficulty if adaptive mode
        if (mode === 'adaptive') {
            questionPool = this.filterByAdaptiveDifficulty(questionPool);
        }
        
        // Shuffle and select questions
        return this.shuffleArray(questionPool).slice(0, count);
    }

    filterByAdaptiveDifficulty(questions) {
        const userLevel = this.calculateUserLevel();
        
        const difficultyFilter = {
            beginner: ['easy'],
            intermediate: ['easy', 'medium'],
            advanced: ['medium', 'hard'],
            expert: ['hard']
        };
        
        const allowedDifficulties = difficultyFilter[userLevel] || ['easy', 'medium'];
        
        return questions.filter(q => allowedDifficulties.includes(q.difficulty));
    }

    calculateUserLevel() {
        const accuracy = this.quizStats.totalAnswers > 0 ? 
            (this.quizStats.correctAnswers / this.quizStats.totalAnswers) * 100 : 0;
        
        if (accuracy >= 90) return 'expert';
        if (accuracy >= 75) return 'advanced';
        if (accuracy >= 60) return 'intermediate';
        return 'beginner';
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    showQuizInterface() {
        const quizPanel = document.getElementById('quiz-panel');
        if (!quizPanel) return;
        
        quizPanel.classList.remove('hidden');
        
        // Update quiz header
        const quizHeader = quizPanel.querySelector('.quiz-header h3');
        if (quizHeader) {
            quizHeader.textContent = `${this.currentQuiz.mode.name} - ${this.currentQuiz.category}`;
        }
        
        // Add progress indicator
        this.createProgressIndicator();
        
        // Add timer if needed
        if (this.currentQuiz.timeLimit) {
            this.createQuizTimer();
        }
    }

    createProgressIndicator() {
        const quizHeader = document.querySelector('.quiz-header');
        if (!quizHeader) return;
        
        let progressContainer = quizHeader.querySelector('.quiz-progress');
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.className = 'quiz-progress';
            progressContainer.style.cssText = `
                margin-top: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                color: var(--text-secondary);
            `;
            quizHeader.appendChild(progressContainer);
        }
        
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;
        
        progressContainer.innerHTML = `
            <span>Question ${this.currentQuestionIndex + 1} of ${this.currentQuiz.questions.length}</span>
            <div style="
                flex: 1;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
            ">
                <div style="
                    width: ${progress}%;
                    height: 100%;
                    background: var(--accent-gradient);
                    transition: width 0.3s ease;
                "></div>
            </div>
            <span>${Math.round(progress)}%</span>
        `;
    }

    createQuizTimer() {
        const quizContent = document.querySelector('.quiz-content');
        if (!quizContent) return;
        
        let timerContainer = quizContent.querySelector('.quiz-timer');
        if (!timerContainer) {
            timerContainer = document.createElement('div');
            timerContainer.className = 'quiz-timer';
            timerContainer.style.cssText = `
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(244, 67, 54, 0.2);
                border: 1px solid rgba(244, 67, 54, 0.3);
                border-radius: 8px;
                padding: 8px 12px;
                color: #f44336;
                font-weight: 600;
                font-family: var(--font-mono);
            `;
            quizContent.style.position = 'relative';
            quizContent.appendChild(timerContainer);
        }
    }

    startQuizTimer() {
        this.currentQuiz.remainingTime = this.currentQuiz.timeLimit;
        
        this.quizTimer = setInterval(() => {
            this.currentQuiz.remainingTime--;
            this.updateTimerDisplay();
            
            if (this.currentQuiz.remainingTime <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const timerContainer = document.querySelector('.quiz-timer');
        if (timerContainer) {
            const minutes = Math.floor(this.currentQuiz.remainingTime / 60);
            const seconds = this.currentQuiz.remainingTime % 60;
            timerContainer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Warning colors
            if (this.currentQuiz.remainingTime <= 10) {
                timerContainer.style.background = 'rgba(244, 67, 54, 0.4)';
                timerContainer.style.animation = 'pulse 1s ease-in-out infinite';
            } else if (this.currentQuiz.remainingTime <= 30) {
                timerContainer.style.background = 'rgba(255, 152, 0, 0.3)';
            }
        }
    }

    timeUp() {
        clearInterval(this.quizTimer);
        this.showNotification('Time is up!', 'warning');
        this.submitQuizAnswer(true);
    }

    loadQuestion() {
        if (this.currentQuestionIndex >= this.currentQuiz.questions.length) {
            this.finishQuiz();
            return;
        }
        
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        
        // Update question text
        const questionElement = document.getElementById('quiz-question');
        if (questionElement) {
            questionElement.innerHTML = `
                <div class="question-meta">
                    <span class="difficulty difficulty-${question.difficulty}">${question.difficulty}</span>
                    <span class="category">${question.category}</span>
                </div>
                <div class="question-text">${question.question}</div>
            `;
        }
        
        // Update options
        const optionsContainer = document.getElementById('quiz-options');
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.innerHTML = `
                    <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                    <div class="option-text">${option}</div>
                `;
                optionDiv.dataset.index = index;
                optionsContainer.appendChild(optionDiv);
            });
        }
        
        // Reset submit button
        const submitBtn = document.getElementById('submit-answer');
        const nextBtn = document.getElementById('next-question');
        if (submitBtn && nextBtn) {
            submitBtn.classList.remove('hidden');
            nextBtn.classList.add('hidden');
            submitBtn.disabled = true;
        }
        
        // Update progress
        this.createProgressIndicator();
        
        // Add question-specific styling
        this.addQuestionStyling(question);
    }

    addQuestionStyling(question) {
        const questionElement = document.getElementById('quiz-question');
        if (!questionElement) return;
        
        // Add meta information styling
        const style = document.createElement('style');
        style.textContent = `
            .question-meta {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
                font-size: 12px;
            }
            .difficulty {
                padding: 2px 8px;
                border-radius: 12px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .difficulty-easy { background: rgba(76, 175, 80, 0.2); color: #4caf50; }
            .difficulty-medium { background: rgba(255, 152, 0, 0.2); color: #ff9800; }
            .difficulty-hard { background: rgba(244, 67, 54, 0.2); color: #f44336; }
            .category {
                padding: 2px 8px;
                border-radius: 12px;
                background: rgba(79, 172, 254, 0.2);
                color: #4facfe;
                text-transform: capitalize;
            }
            .option-letter {
                width: 24px;
                height: 24px;
                background: var(--accent-gradient);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 12px;
                color: white;
                margin-right: 12px;
            }
            .quiz-option {
                display: flex;
                align-items: center;
                padding: 12px;
                margin: 8px 0;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .quiz-option:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: var(--accent-blue);
                transform: translateX(5px);
            }
            .quiz-option.selected {
                background: rgba(79, 172, 254, 0.2);
                border-color: var(--accent-blue);
                box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.3);
            }
            .option-text {
                flex: 1;
                line-height: 1.4;
            }
        `;
        
        if (!document.head.querySelector('#quiz-styling')) {
            style.id = 'quiz-styling';
            document.head.appendChild(style);
        }
    }

    selectQuizOption(optionElement) {
        // Remove previous selection
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select current option
        optionElement.classList.add('selected');
        this.selectedQuizOption = parseInt(optionElement.dataset.index);
        
        // Enable submit button
        const submitBtn = document.getElementById('submit-answer');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
    }

    submitQuizAnswer(timeExpired = false) {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const isCorrect = !timeExpired && this.selectedQuizOption === question.correct;
        
        // Record answer
        this.userAnswers.push({
            questionId: question.id,
            selectedAnswer: timeExpired ? null : this.selectedQuizOption,
            correctAnswer: question.correct,
            isCorrect,
            timeExpired,
            timeSpent: this.currentQuiz.timeLimit ? 
                (this.currentQuiz.timeLimit - (this.currentQuiz.remainingTime || 0)) : null
        });
        
        // Update score
        if (isCorrect) {
            this.currentQuiz.score++;
            this.quizStats.correctAnswers++;
            this.quizStats.streakCount++;
            
            if (this.quizStats.streakCount > this.quizStats.bestStreak) {
                this.quizStats.bestStreak = this.quizStats.streakCount;
                this.checkAchievements();
            }
        } else {
            this.quizStats.streakCount = 0;
        }
        
        this.quizStats.totalAnswers++;
        
        // Show answer feedback
        this.showAnswerFeedback(question, isCorrect, timeExpired);
        
        // Update UI
        const submitBtn = document.getElementById('submit-answer');
        const nextBtn = document.getElementById('next-question');
        if (submitBtn && nextBtn) {
            submitBtn.classList.add('hidden');
            nextBtn.classList.remove('hidden');
        }
        
        // Reset timer for next question
        if (this.currentQuiz.timeLimit && !timeExpired) {
            clearInterval(this.quizTimer);
            this.currentQuiz.remainingTime = this.currentQuiz.timeLimit;
        }
    }

    showAnswerFeedback(question, isCorrect, timeExpired) {
        // Highlight correct/incorrect options
        document.querySelectorAll('.quiz-option').forEach((opt, index) => {
            opt.style.pointerEvents = 'none';
            
            if (index === question.correct) {
                opt.classList.add('correct');
                opt.style.background = 'rgba(76, 175, 80, 0.3)';
                opt.style.borderColor = '#4caf50';
            } else if (index === this.selectedQuizOption && !isCorrect) {
                opt.classList.add('incorrect');
                opt.style.background = 'rgba(244, 67, 54, 0.3)';
                opt.style.borderColor = '#f44336';
            }
        });
        
        // Show explanation if available and allowed
        if (question.explanation && this.currentQuiz.mode.showExplanations) {
            this.showExplanation(question.explanation, isCorrect);
        }
        
        // Show feedback message
        if (timeExpired) {
            this.showNotification('Time expired! The correct answer is highlighted.', 'warning');
        } else if (isCorrect) {
            const encouragements = ['Excellent!', 'Well done!', 'Correct!', 'Great job!', 'Perfect!'];
            this.showNotification(encouragements[Math.floor(Math.random() * encouragements.length)], 'success');
        } else {
            this.showNotification('Incorrect. The correct answer is highlighted.', 'error');
        }
    }

    showExplanation(explanation, isCorrect) {
        const questionElement = document.getElementById('quiz-question');
        if (!questionElement) return;
        
        let explanationDiv = questionElement.querySelector('.question-explanation');
        if (!explanationDiv) {
            explanationDiv = document.createElement('div');
            explanationDiv.className = 'question-explanation';
            explanationDiv.style.cssText = `
                margin-top: 15px;
                padding: 12px;
                border-radius: 8px;
                border-left: 4px solid ${isCorrect ? '#4caf50' : '#ff9800'};
                background: rgba(${isCorrect ? '76, 175, 80' : '255, 152, 0'}, 0.1);
                color: var(--text-primary);
                font-size: 14px;
                line-height: 1.5;
            `;
            questionElement.appendChild(explanationDiv);
        }
        
        explanationDiv.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 5px; color: ${isCorrect ? '#4caf50' : '#ff9800'};">
                <i class="fas fa-lightbulb"></i> Explanation:
            </div>
            ${explanation}
        `;
    }

    nextQuizQuestion() {
        this.currentQuestionIndex++;
        this.selectedQuizOption = undefined;
        
        // Clear previous feedback
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('correct', 'incorrect', 'selected');
            opt.style.background = '';
            opt.style.borderColor = '';
            opt.style.pointerEvents = '';
        });
        
        const explanationDiv = document.querySelector('.question-explanation');
        if (explanationDiv) {
            explanationDiv.remove();
        }
        
        // Load next question or finish quiz
        if (this.currentQuestionIndex < this.currentQuiz.questions.length) {
            this.loadQuestion();
            
            if (this.currentQuiz.timeLimit) {
                this.startQuizTimer();
            }
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        clearInterval(this.quizTimer);
        
        // Calculate final results
        const totalQuestions = this.currentQuiz.questions.length;
        const correctAnswers = this.currentQuiz.score;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const totalTime = Date.now() - this.currentQuiz.startTime;
        
        // Update stats
        this.quizStats.totalQuizzes++;
        this.saveQuizStats();
        
        // Check for achievements
        this.checkAchievements();
        
        // Show results
        this.showQuizResults({
            totalQuestions,
            correctAnswers,
            percentage,
            totalTime,
            passed: this.currentQuiz.mode.passingScore ? 
                percentage >= this.currentQuiz.mode.passingScore : true
        });
    }

    showQuizResults(results) {
        const quizPanel = document.getElementById('quiz-panel');
        if (!quizPanel) return;
        
        const quizContent = quizPanel.querySelector('.quiz-content');
        quizContent.innerHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <div class="score-circle">
                        <div class="score-percentage">${results.percentage}%</div>
                        <div class="score-fraction">${results.correctAnswers}/${results.totalQuestions}</div>
                    </div>
                    <div class="results-status ${results.passed ? 'passed' : 'failed'}">
                        <i class="fas ${results.passed ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        <span>${results.passed ? 'Passed' : 'Failed'}</span>
                    </div>
                </div>
                
                <div class="results-details">
                    <div class="detail-item">
                        <span class="detail-label">Time Taken:</span>
                        <span class="detail-value">${this.formatTime(results.totalTime)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Accuracy:</span>
                        <span class="detail-value">${results.percentage}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Current Streak:</span>
                        <span class="detail-value">${this.quizStats.streakCount}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Best Streak:</span>
                        <span class="detail-value">${this.quizStats.bestStreak}</span>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="quiz-btn" onclick="window.networkingApp.closeQuiz()">
                        <i class="fas fa-home"></i> Back to Learning
                    </button>
                    <button class="quiz-btn" onclick="window.networkingApp.openQuiz()">
                        <i class="fas fa-redo"></i> Take Another Quiz
                    </button>
                    <button class="quiz-btn review-btn" onclick="this.showDetailedReview()">
                        <i class="fas fa-chart-line"></i> Review Answers
                    </button>
                </div>
            </div>
        `;
        
        // Add results styling
        this.addResultsStyling();
        
        // Show achievements if any
        this.showNewAchievements();
    }

    addResultsStyling() {
        const style = document.createElement('style');
        style.textContent = `
            .quiz-results {
                text-align: center;
                padding: 20px;
            }
            .results-header {
                margin-bottom: 30px;
            }
            .score-circle {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: conic-gradient(var(--accent-gradient) ${this.currentQuiz.score / this.currentQuiz.questions.length * 360}deg, rgba(255,255,255,0.1) 0deg);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                position: relative;
            }
            .score-circle::before {
                content: '';
                position: absolute;
                inset: 8px;
                border-radius: 50%;
                background: var(--bg-card);
            }
            .score-percentage {
                font-size: 24px;
                font-weight: 700;
                color: var(--text-primary);
                z-index: 1;
            }
            .score-fraction {
                font-size: 12px;
                color: var(--text-secondary);
                z-index: 1;
            }
            .results-status {
                font-size: 18px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            .results-status.passed {
                color: #4caf50;
            }
            .results-status.failed {
                color: #f44336;
            }
            .results-details {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
            }
            .detail-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }
            .detail-label {
                color: var(--text-secondary);
            }
            .detail-value {
                color: var(--text-primary);
                font-weight: 600;
            }
            .results-actions {
                display: flex;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
            }
            .quiz-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 20px;
                background: var(--accent-gradient);
                border: none;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                cursor: pointer;
                transition: transform 0.2s ease;
                font-family: var(--font-family);
            }
            .quiz-btn:hover {
                transform: scale(1.05);
            }
            .review-btn {
                background: rgba(255, 152, 0, 0.8);
            }
        `;
        
        if (!document.head.querySelector('#quiz-results-styling')) {
            style.id = 'quiz-results-styling';
            document.head.appendChild(style);
        }
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    }

    checkAchievements() {
        const newAchievements = [];
        
        // First quiz achievement
        if (this.quizStats.totalQuizzes === 1) {
            newAchievements.push({
                id: 'first_quiz',
                title: 'Quiz Rookie',
                description: 'Completed your first quiz!',
                icon: 'fas fa-baby',
                rarity: 'common'
            });
        }
        
        // Perfect score achievement
        if (this.currentQuiz && this.currentQuiz.score === this.currentQuiz.questions.length) {
            newAchievements.push({
                id: 'perfect_score',
                title: 'Perfectionist',
                description: 'Scored 100% on a quiz!',
                icon: 'fas fa-crown',
                rarity: 'rare'
            });
        }
        
        // Streak achievements
        if (this.quizStats.streakCount === 5) {
            newAchievements.push({
                id: 'streak_5',
                title: 'On Fire',
                description: '5 correct answers in a row!',
                icon: 'fas fa-fire',
                rarity: 'uncommon'
            });
        }
        
        if (this.quizStats.streakCount === 10) {
            newAchievements.push({
                id: 'streak_10',
                title: 'Unstoppable',
                description: '10 correct answers in a row!',
                icon: 'fas fa-bolt',
                rarity: 'rare'
            });
        }
        
        // Quiz count achievements
        if (this.quizStats.totalQuizzes === 10) {
            newAchievements.push({
                id: 'quiz_veteran',
                title: 'Quiz Veteran',
                description: 'Completed 10 quizzes!',
                icon: 'fas fa-medal',
                rarity: 'uncommon'
            });
        }
        
        // Add new achievements
        newAchievements.forEach(achievement => {
            if (!this.achievements.find(a => a.id === achievement.id)) {
                this.achievements.push({
                    ...achievement,
                    earnedAt: Date.now()
                });
            }
        });
        
        this.newAchievements = newAchievements;
    }

    showNewAchievements() {
        if (!this.newAchievements || this.newAchievements.length === 0) return;
        
        this.newAchievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showAchievementNotification(achievement);
            }, index * 1000);
        });
        
        this.newAchievements = [];
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: linear-gradient(135deg, #ffa726, #ff7043);
            border-radius: 12px;
            padding: 15px;
            color: white;
            box-shadow: 0 8px 32px rgba(255, 167, 38, 0.4);
            transform: translateX(100%);
            transition: transform 0.5s ease;
            z-index: 1300;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 24px;">
                    <i class="${achievement.icon}"></i>
                </div>
                <div>
                    <div style="font-weight: 600; margin-bottom: 2px;">
                        Achievement Unlocked!
                    </div>
                    <div style="font-size: 16px; font-weight: 700; margin-bottom: 2px;">
                        ${achievement.title}
                    </div>
                    <div style="font-size: 14px; opacity: 0.9;">
                        ${achievement.description}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }

    showDetailedReview() {
        const reviewPanel = document.createElement('div');
        reviewPanel.className = 'quiz-review-panel';
        reviewPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 800px;
            height: 80vh;
            background: rgba(26, 31, 46, 0.95);
            border-radius: 16px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1200;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;
        
        reviewPanel.innerHTML = `
            <div style="padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 style="margin: 0; color: var(--text-primary);">Quiz Review</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    position: absolute;
                    right: 15px;
                    top: 15px;
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 18px;
                    cursor: pointer;
                ">×</button>
            </div>
            <div style="flex: 1; overflow-y: auto; padding: 20px;">
                ${this.generateReviewContent()}
            </div>
        `;
        
        document.body.appendChild(reviewPanel);
    }

    generateReviewContent() {
        return this.userAnswers.map((answer, index) => {
            const question = this.currentQuiz.questions[index];
            const isCorrect = answer.isCorrect;
            
            return `
                <div style="
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    border-left: 4px solid ${isCorrect ? '#4caf50' : '#f44336'};
                ">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <span style="
                            background: ${isCorrect ? '#4caf50' : '#f44336'};
                            color: white;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                            font-weight: 600;
                        ">
                            ${isCorrect ? 'CORRECT' : 'INCORRECT'}
                        </span>
                        <span style="color: var(--text-secondary); font-size: 12px;">
                            Question ${index + 1}
                        </span>
                    </div>
                    
                    <div style="color: var(--text-primary); margin-bottom: 10px; font-weight: 500;">
                        ${question.question}
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        ${question.options.map((option, optIndex) => `
                            <div style="
                                padding: 8px 12px;
                                margin: 4px 0;
                                border-radius: 6px;
                                font-size: 14px;
                                ${optIndex === question.correct ? 
                                    'background: rgba(76, 175, 80, 0.2); border: 1px solid #4caf50; color: #4caf50;' : 
                                    optIndex === answer.selectedAnswer && !isCorrect ?
                                    'background: rgba(244, 67, 54, 0.2); border: 1px solid #f44336; color: #f44336;' :
                                    'background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-secondary);'
                                }
                            ">
                                ${String.fromCharCode(65 + optIndex)}. ${option}
                                ${optIndex === question.correct ? ' ✓' : ''}
                                ${optIndex === answer.selectedAnswer && !isCorrect ? ' ✗' : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    ${question.explanation ? `
                        <div style="
                            background: rgba(255, 152, 0, 0.1);
                            border: 1px solid rgba(255, 152, 0, 0.3);
                            border-radius: 6px;
                            padding: 10px;
                            color: var(--text-primary);
                            font-size: 14px;
                        ">
                            <strong style="color: #ff9800;">Explanation:</strong><br>
                            ${question.explanation}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    loadQuizStats() {
        const saved = localStorage.getItem('networking-quiz-stats');
        if (saved) {
            this.quizStats = { ...this.quizStats, ...JSON.parse(saved) };
        }
        
        const savedAchievements = localStorage.getItem('networking-quiz-achievements');
        if (savedAchievements) {
            this.achievements = JSON.parse(savedAchievements);
        }
    }

    saveQuizStats() {
        localStorage.setItem('networking-quiz-stats', JSON.stringify(this.quizStats));
        localStorage.setItem('networking-quiz-achievements', JSON.stringify(this.achievements));
    }

    showNotification(message, type = 'info') {
        // Use the main app's notification system
        if (window.networkingApp && window.networkingApp.showNotification) {
            window.networkingApp.showNotification(message, type);
        }
    }

    // Public methods for integration with main app
    openQuizSelection() {
        // Create quiz selection interface
        this.createQuizSelectionModal();
    }

    createQuizSelectionModal() {
        const modal = document.createElement('div');
        modal.className = 'quiz-selection-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 600px;
            background: rgba(26, 31, 46, 0.95);
            border-radius: 16px;
            padding: 30px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1100;
        `;
        
        modal.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: var(--text-primary); margin: 0 0 10px 0;">Choose Your Quiz</h2>
                <p style="color: var(--text-secondary); margin: 0;">Test your networking knowledge</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    position: absolute;
                    right: 15px;
                    top: 15px;
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 20px;
                    cursor: pointer;
                ">×</button>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                ${Object.entries(this.quizModes).map(([mode, config]) => `
                    <div class="quiz-mode-card" data-mode="${mode}" style="
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 12px;
                        padding: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-align: center;
                    ">
                        <div style="font-size: 32px; color: var(--accent-blue); margin-bottom: 15px;">
                            <i class="${config.icon}"></i>
                        </div>
                        <h3 style="color: var(--text-primary); margin: 0 0 10px 0; font-size: 18px;">
                            ${config.name}
                        </h3>
                        <p style="color: var(--text-secondary); margin: 0; font-size: 14px; line-height: 1.4;">
                            ${config.description}
                        </p>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 30px;">
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <div style="flex: 1;">
                        <label style="display: block; color: var(--text-secondary); margin-bottom: 5px; font-size: 14px;">
                            Category:
                        </label>
                        <select id="quiz-category" style="
                            width: 100%;
                            padding: 8px;
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 6px;
                            background: rgba(255, 255, 255, 0.1);
                            color: var(--text-primary);
                        ">
                            <option value="mixed">All Topics</option>
                            <option value="fundamentals">Fundamentals</option>
                            <option value="protocols">Protocols</option>
                            <option value="routing">Routing</option>
                            <option value="security">Security</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; color: var(--text-secondary); margin-bottom: 5px; font-size: 14px;">
                            Questions:
                        </label>
                        <select id="quiz-count" style="
                            width: 100%;
                            padding: 8px;
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 6px;
                            background: rgba(255, 255, 255, 0.1);
                            color: var(--text-primary);
                        ">
                            <option value="5">5 Questions</option>
                            <option value="10" selected>10 Questions</option>
                            <option value="15">15 Questions</option>
                            <option value="20">20 Questions</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners for mode selection
        modal.querySelectorAll('.quiz-mode-card').forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                const category = modal.querySelector('#quiz-category').value;
                const count = parseInt(modal.querySelector('#quiz-count').value);
                
                modal.remove();
                this.startQuiz(category, mode, count);
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.background = 'rgba(79, 172, 254, 0.1)';
                card.style.borderColor = 'rgba(79, 172, 254, 0.3)';
                card.style.transform = 'translateY(-2px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.background = 'rgba(255, 255, 255, 0.05)';
                card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                card.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize Quiz System
document.addEventListener('DOMContentLoaded', () => {
    window.quizSystem = new QuizSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizSystem;
}