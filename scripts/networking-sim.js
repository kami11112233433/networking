// Advanced networking simulations and visualizations

class NetworkingSimulation {
    constructor() {
        this.protocols = {
            TCP: { color: '#4facfe', packets: [] },
            UDP: { color: '#56ccf2', packets: [] },
            HTTP: { color: '#f093fb', packets: [] },
            DNS: { color: '#ffa726', packets: [] }
        };
        
        this.topologies = {
            star: { center: null, nodes: [] },
            mesh: { nodes: [], connections: [] },
            bus: { backbone: null, nodes: [] },
            ring: { nodes: [] }
        };
        
        this.simulationState = {
            running: false,
            speed: 1,
            bandwidth: 100,
            latency: 50,
            packetLoss: 0
        };
        
        this.init();
    }

    init() {
        this.setupProtocolSimulations();
        this.setupTopologySimulations();
        this.setupRoutingAlgorithms();
    }

    setupProtocolSimulations() {
        // TCP Three-way handshake simulation
        this.tcpHandshake = new TCPHandshakeSimulation();
        
        // HTTP request/response simulation
        this.httpFlow = new HTTPFlowSimulation();
        
        // DNS resolution simulation
        this.dnsResolution = new DNSResolutionSimulation();
        
        // DHCP process simulation
        this.dhcpProcess = new DHCPSimulation();
    }

    setupTopologySimulations() {
        // Network topology visualizations
        this.starTopology = new StarTopologyViz();
        this.meshTopology = new MeshTopologyViz();
        this.busTopology = new BusTopologyViz();
        this.ringTopology = new RingTopologyViz();
    }

    setupRoutingAlgorithms() {
        // Routing algorithm visualizations
        this.dijkstraAlgorithm = new DijkstraVisualization();
        this.ospfProtocol = new OSPFSimulation();
        this.bgpRouting = new BGPSimulation();
    }

    // Protocol Simulations
    simulateTCPHandshake(clientNode, serverNode) {
        return this.tcpHandshake.simulate(clientNode, serverNode);
    }

    simulateHTTPRequest(clientNode, serverNode, url) {
        return this.httpFlow.simulate(clientNode, serverNode, url);
    }

    simulateDNSResolution(clientNode, dnsServer, domain) {
        return this.dnsResolution.simulate(clientNode, dnsServer, domain);
    }

    // Topology Simulations
    createStarTopology(centerNode, connectedNodes) {
        return this.starTopology.create(centerNode, connectedNodes);
    }

    createMeshTopology(nodes) {
        return this.meshTopology.create(nodes);
    }

    // Routing Simulations
    findShortestPath(sourceNode, destNode, networkGraph) {
        return this.dijkstraAlgorithm.findPath(sourceNode, destNode, networkGraph);
    }
}

// TCP Handshake Simulation
class TCPHandshakeSimulation {
    constructor() {
        this.steps = [
            { name: 'SYN', direction: 'client->server', description: 'Client sends SYN packet' },
            { name: 'SYN-ACK', direction: 'server->client', description: 'Server responds with SYN-ACK' },
            { name: 'ACK', direction: 'client->server', description: 'Client sends ACK to complete handshake' }
        ];
    }

    simulate(clientNode, serverNode) {
        return new Promise((resolve) => {
            let currentStep = 0;
            const duration = 1000; // ms per step
            
            const executeStep = () => {
                if (currentStep >= this.steps.length) {
                    resolve({ success: true, connectionEstablished: true });
                    return;
                }
                
                const step = this.steps[currentStep];
                this.animatePacket(clientNode, serverNode, step);
                
                currentStep++;
                setTimeout(executeStep, duration);
            };
            
            executeStep();
        });
    }

    animatePacket(clientNode, serverNode, step) {
        const packet = this.createTCPPacket(step);
        
        if (step.direction === 'client->server') {
            this.movePacket(packet, clientNode, serverNode);
        } else {
            this.movePacket(packet, serverNode, clientNode);
        }
        
        this.showStepInfo(step);
    }

    createTCPPacket(step) {
        const packet = document.createElement('div');
        packet.className = 'tcp-packet';
        packet.style.background = '#4facfe';
        packet.style.width = '12px';
        packet.style.height = '12px';
        packet.style.borderRadius = '50%';
        packet.style.position = 'absolute';
        packet.style.boxShadow = '0 0 10px #4facfe';
        packet.innerHTML = `<span class="packet-label">${step.name}</span>`;
        
        return packet;
    }

    movePacket(packet, fromNode, toNode) {
        const canvas = document.getElementById('network-canvas');
        if (!canvas) return;
        
        canvas.appendChild(packet);
        
        // Animate movement
        packet.style.left = `${fromNode.x}px`;
        packet.style.top = `${fromNode.y}px`;
        
        setTimeout(() => {
            packet.style.transition = 'all 0.8s ease-in-out';
            packet.style.left = `${toNode.x}px`;
            packet.style.top = `${toNode.y}px`;
            
            setTimeout(() => {
                if (packet.parentNode) {
                    packet.parentNode.removeChild(packet);
                }
            }, 800);
        }, 50);
    }

    showStepInfo(step) {
        const info = document.createElement('div');
        info.className = 'protocol-step-info';
        info.innerHTML = `
            <div class="step-name">${step.name}</div>
            <div class="step-description">${step.description}</div>
        `;
        
        // Add to info panel
        const infoPanel = document.querySelector('.network-info-panel') || this.createInfoPanel();
        infoPanel.appendChild(info);
        
        // Remove after delay
        setTimeout(() => {
            if (info.parentNode) {
                info.parentNode.removeChild(info);
            }
        }, 2000);
    }

    createInfoPanel() {
        const panel = document.createElement('div');
        panel.className = 'network-info-panel';
        panel.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            backdrop-filter: blur(10px);
            max-width: 250px;
        `;
        
        const canvas = document.getElementById('network-canvas');
        if (canvas) {
            canvas.appendChild(panel);
        }
        
        return panel;
    }
}

// HTTP Flow Simulation
class HTTPFlowSimulation {
    constructor() {
        this.steps = [
            { name: 'DNS Lookup', description: 'Resolve domain to IP address' },
            { name: 'TCP Connect', description: 'Establish TCP connection' },
            { name: 'HTTP Request', description: 'Send HTTP GET/POST request' },
            { name: 'Server Processing', description: 'Server processes request' },
            { name: 'HTTP Response', description: 'Server sends response' },
            { name: 'Content Download', description: 'Download response content' }
        ];
    }

    simulate(clientNode, serverNode, url) {
        return new Promise((resolve) => {
            let currentStep = 0;
            const results = [];
            
            const executeStep = () => {
                if (currentStep >= this.steps.length) {
                    resolve({ success: true, results });
                    return;
                }
                
                const step = this.steps[currentStep];
                this.executeHTTPStep(step, clientNode, serverNode)
                    .then(result => {
                        results.push(result);
                        currentStep++;
                        setTimeout(executeStep, 1000);
                    });
            };
            
            executeStep();
        });
    }

    executeHTTPStep(step, clientNode, serverNode) {
        return new Promise((resolve) => {
            this.visualizeStep(step, clientNode, serverNode);
            
            // Simulate step duration
            const duration = step.name === 'Server Processing' ? 2000 : 800;
            
            setTimeout(() => {
                resolve({
                    step: step.name,
                    duration,
                    timestamp: Date.now()
                });
            }, duration);
        });
    }

    visualizeStep(step, clientNode, serverNode) {
        const stepElement = document.createElement('div');
        stepElement.className = 'http-step';
        stepElement.innerHTML = `
            <div class="step-indicator">
                <i class="fas fa-globe"></i>
                <span>${step.name}</span>
            </div>
            <div class="step-progress">
                <div class="progress-bar"></div>
            </div>
            <div class="step-description">${step.description}</div>
        `;
        
        // Style the element
        stepElement.style.cssText = `
            background: rgba(240, 147, 251, 0.1);
            border: 1px solid rgba(240, 147, 251, 0.3);
            border-radius: 8px;
            padding: 12px;
            margin: 8px 0;
            transition: all 0.3s ease;
        `;
        
        this.addToTimeline(stepElement);
        this.animateProgress(stepElement);
    }

    addToTimeline(stepElement) {
        let timeline = document.querySelector('.http-timeline');
        if (!timeline) {
            timeline = document.createElement('div');
            timeline.className = 'http-timeline';
            timeline.style.cssText = `
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                width: 300px;
                max-height: 400px;
                overflow-y: auto;
                background: rgba(26, 31, 46, 0.95);
                border-radius: 12px;
                padding: 15px;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                z-index: 800;
            `;
            document.body.appendChild(timeline);
            
            // Add header
            const header = document.createElement('h4');
            header.textContent = 'HTTP Request Flow';
            header.style.cssText = `
                margin: 0 0 15px 0;
                color: #f093fb;
                font-size: 16px;
                text-align: center;
            `;
            timeline.appendChild(header);
        }
        
        timeline.appendChild(stepElement);
    }

    animateProgress(stepElement) {
        const progressBar = stepElement.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.cssText = `
                width: 0%;
                height: 4px;
                background: linear-gradient(90deg, #f093fb, #f5576c);
                border-radius: 2px;
                transition: width 0.8s ease;
            `;
            
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 100);
        }
    }
}

// DNS Resolution Simulation
class DNSResolutionSimulation {
    constructor() {
        this.dnsServers = [
            { name: 'Local DNS Cache', type: 'cache' },
            { name: 'ISP DNS Server', type: 'recursive' },
            { name: 'Root Name Server', type: 'root' },
            { name: 'TLD Name Server', type: 'tld' },
            { name: 'Authoritative Server', type: 'authoritative' }
        ];
    }

    simulate(clientNode, dnsServer, domain) {
        return new Promise((resolve) => {
            this.createDNSVisualization(domain);
            
            let currentServer = 0;
            const queryResults = [];
            
            const queryNextServer = () => {
                if (currentServer >= this.dnsServers.length) {
                    resolve({
                        success: true,
                        domain,
                        resolvedIP: '192.168.1.100',
                        queryPath: queryResults
                    });
                    return;
                }
                
                const server = this.dnsServers[currentServer];
                this.queryDNSServer(server, domain)
                    .then(result => {
                        queryResults.push(result);
                        currentServer++;
                        
                        if (result.found) {
                            resolve({
                                success: true,
                                domain,
                                resolvedIP: result.ip,
                                queryPath: queryResults
                            });
                        } else {
                            setTimeout(queryNextServer, 1000);
                        }
                    });
            };
            
            queryNextServer();
        });
    }

    createDNSVisualization(domain) {
        const visualization = document.createElement('div');
        visualization.className = 'dns-visualization';
        visualization.innerHTML = `
            <div class="dns-header">
                <h3>DNS Resolution: ${domain}</h3>
            </div>
            <div class="dns-hierarchy">
                ${this.dnsServers.map((server, index) => `
                    <div class="dns-server" data-index="${index}">
                        <div class="server-icon">
                            <i class="fas fa-server"></i>
                        </div>
                        <div class="server-name">${server.name}</div>
                        <div class="server-type">${server.type}</div>
                        <div class="query-indicator"></div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Style the visualization
        visualization.style.cssText = `
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
            z-index: 1000;
        `;
        
        document.body.appendChild(visualization);
        
        // Auto-remove after completion
        setTimeout(() => {
            if (visualization.parentNode) {
                visualization.parentNode.removeChild(visualization);
            }
        }, 10000);
    }

    queryDNSServer(server, domain) {
        return new Promise((resolve) => {
            // Animate query
            this.animateDNSQuery(server);
            
            // Simulate server response time
            const responseTime = Math.random() * 500 + 200;
            
            setTimeout(() => {
                const found = server.type === 'authoritative' || Math.random() > 0.7;
                
                resolve({
                    server: server.name,
                    found,
                    ip: found ? this.generateIP() : null,
                    responseTime
                });
            }, responseTime);
        });
    }

    animateDNSQuery(server) {
        const serverElement = document.querySelector(`[data-index="${this.dnsServers.indexOf(server)}"]`);
        if (serverElement) {
            const indicator = serverElement.querySelector('.query-indicator');
            indicator.style.cssText = `
                width: 10px;
                height: 10px;
                background: #ffa726;
                border-radius: 50%;
                animation: pulse 1s ease-in-out infinite;
            `;
        }
    }

    generateIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
}

// DHCP Simulation
class DHCPSimulation {
    constructor() {
        this.dhcpSteps = [
            { name: 'DHCP Discover', type: 'broadcast', description: 'Client broadcasts discover message' },
            { name: 'DHCP Offer', type: 'unicast', description: 'DHCP server offers IP configuration' },
            { name: 'DHCP Request', type: 'broadcast', description: 'Client requests offered configuration' },
            { name: 'DHCP ACK', type: 'unicast', description: 'Server acknowledges configuration' }
        ];
    }

    simulate(clientNode, dhcpServer) {
        return new Promise((resolve) => {
            let currentStep = 0;
            const lease = {
                ip: this.generateIP(),
                subnet: '255.255.255.0',
                gateway: '192.168.1.1',
                dns: ['8.8.8.8', '8.8.4.4'],
                leaseTime: 86400 // 24 hours
            };
            
            const executeStep = () => {
                if (currentStep >= this.dhcpSteps.length) {
                    resolve({ success: true, lease });
                    return;
                }
                
                const step = this.dhcpSteps[currentStep];
                this.executeDHCPStep(step, clientNode, dhcpServer);
                
                currentStep++;
                setTimeout(executeStep, 1500);
            };
            
            executeStep();
        });
    }

    executeDHCPStep(step, clientNode, dhcpServer) {
        // Create DHCP packet visualization
        const packet = this.createDHCPPacket(step);
        
        if (step.type === 'broadcast') {
            this.broadcastPacket(packet, clientNode);
        } else {
            this.unicastPacket(packet, dhcpServer, clientNode);
        }
        
        this.showDHCPStepInfo(step);
    }

    createDHCPPacket(step) {
        const packet = document.createElement('div');
        packet.className = 'dhcp-packet';
        packet.style.cssText = `
            position: absolute;
            width: 15px;
            height: 15px;
            background: ${step.type === 'broadcast' ? '#56ccf2' : '#4facfe'};
            border-radius: 50%;
            box-shadow: 0 0 15px currentColor;
            z-index: 100;
        `;
        
        const label = document.createElement('span');
        label.textContent = step.name;
        label.style.cssText = `
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            color: white;
            background: rgba(0, 0, 0, 0.7);
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
        `;
        
        packet.appendChild(label);
        return packet;
    }

    broadcastPacket(packet, sourceNode) {
        const canvas = document.getElementById('network-canvas');
        if (!canvas) return;
        
        canvas.appendChild(packet);
        
        // Start at source
        packet.style.left = `${sourceNode.x}px`;
        packet.style.top = `${sourceNode.y}px`;
        
        // Animate broadcast (expand in all directions)
        setTimeout(() => {
            packet.style.transition = 'all 1s ease-out';
            packet.style.transform = 'scale(10)';
            packet.style.opacity = '0';
            
            setTimeout(() => {
                if (packet.parentNode) {
                    packet.parentNode.removeChild(packet);
                }
            }, 1000);
        }, 100);
    }

    unicastPacket(packet, fromNode, toNode) {
        const canvas = document.getElementById('network-canvas');
        if (!canvas) return;
        
        canvas.appendChild(packet);
        
        // Animate from server to client
        packet.style.left = `${fromNode.x}px`;
        packet.style.top = `${fromNode.y}px`;
        
        setTimeout(() => {
            packet.style.transition = 'all 1s ease-in-out';
            packet.style.left = `${toNode.x}px`;
            packet.style.top = `${toNode.y}px`;
            
            setTimeout(() => {
                if (packet.parentNode) {
                    packet.parentNode.removeChild(packet);
                }
            }, 1000);
        }, 100);
    }

    showDHCPStepInfo(step) {
        const info = document.createElement('div');
        info.className = 'dhcp-step-info';
        info.innerHTML = `
            <div class="dhcp-step-name">${step.name}</div>
            <div class="dhcp-step-type">Type: ${step.type}</div>
            <div class="dhcp-step-description">${step.description}</div>
        `;
        
        info.style.cssText = `
            background: rgba(86, 204, 242, 0.1);
            border: 1px solid rgba(86, 204, 242, 0.3);
            border-radius: 8px;
            padding: 10px;
            margin: 5px 0;
            color: white;
            font-size: 12px;
        `;
        
        const timeline = this.getDHCPTimeline();
        timeline.appendChild(info);
        
        // Remove after delay
        setTimeout(() => {
            if (info.parentNode) {
                info.parentNode.removeChild(info);
            }
        }, 5000);
    }

    getDHCPTimeline() {
        let timeline = document.querySelector('.dhcp-timeline');
        if (!timeline) {
            timeline = document.createElement('div');
            timeline.className = 'dhcp-timeline';
            timeline.style.cssText = `
                position: fixed;
                right: 20px;
                bottom: 20px;
                width: 280px;
                max-height: 300px;
                overflow-y: auto;
                background: rgba(26, 31, 46, 0.95);
                border-radius: 12px;
                padding: 15px;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                z-index: 800;
            `;
            
            const header = document.createElement('h4');
            header.textContent = 'DHCP Process';
            header.style.cssText = `
                margin: 0 0 10px 0;
                color: #56ccf2;
                font-size: 16px;
                text-align: center;
            `;
            timeline.appendChild(header);
            
            document.body.appendChild(timeline);
        }
        
        return timeline;
    }

    generateIP() {
        return `192.168.1.${Math.floor(Math.random() * 200) + 50}`;
    }
}

// Network Topology Visualizations
class StarTopologyViz {
    create(centerNode, connectedNodes) {
        const svg = this.createSVG();
        
        // Draw center node
        this.drawNode(svg, centerNode, centerNode.x, centerNode.y, 'center');
        
        // Draw connected nodes and connections
        connectedNodes.forEach((node, index) => {
            const angle = (index / connectedNodes.length) * 2 * Math.PI;
            const radius = 150;
            const x = centerNode.x + Math.cos(angle) * radius;
            const y = centerNode.y + Math.sin(angle) * radius;
            
            // Draw connection
            this.drawConnection(svg, centerNode.x, centerNode.y, x, y);
            
            // Draw node
            this.drawNode(svg, node, x, y, 'peripheral');
        });
        
        return svg;
    }

    createSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '600');
        svg.setAttribute('height', '400');
        svg.setAttribute('class', 'topology-svg');
        return svg;
    }

    drawNode(svg, node, x, y, type) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', type === 'center' ? 20 : 15);
        circle.setAttribute('class', 'topology-node-element');
        circle.setAttribute('data-node-id', node.id);
        
        svg.appendChild(circle);
        
        // Add label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y + 35);
        text.setAttribute('class', 'topology-label');
        text.textContent = node.name || node.id;
        
        svg.appendChild(text);
    }

    drawConnection(svg, x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', 'topology-connection-element');
        
        svg.appendChild(line);
    }
}

class MeshTopologyViz {
    create(nodes) {
        const svg = this.createSVG();
        const positions = this.calculatePositions(nodes);
        
        // Draw all connections first
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                this.drawConnection(
                    svg,
                    positions[i].x,
                    positions[i].y,
                    positions[j].x,
                    positions[j].y
                );
            }
        }
        
        // Draw nodes on top
        nodes.forEach((node, index) => {
            this.drawNode(svg, node, positions[index].x, positions[index].y);
        });
        
        return svg;
    }

    calculatePositions(nodes) {
        const positions = [];
        const radius = 120;
        const centerX = 300;
        const centerY = 200;
        
        nodes.forEach((node, index) => {
            const angle = (index / nodes.length) * 2 * Math.PI;
            positions.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius
            });
        });
        
        return positions;
    }

    createSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '600');
        svg.setAttribute('height', '400');
        svg.setAttribute('class', 'topology-svg');
        return svg;
    }

    drawNode(svg, node, x, y) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 15);
        circle.setAttribute('class', 'topology-node-element');
        circle.setAttribute('data-node-id', node.id);
        
        svg.appendChild(circle);
        
        // Add label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y + 30);
        text.setAttribute('class', 'topology-label');
        text.textContent = node.name || node.id;
        
        svg.appendChild(text);
    }

    drawConnection(svg, x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', 'topology-connection-element');
        
        svg.appendChild(line);
    }
}

// Routing Algorithm Visualizations
class DijkstraVisualization {
    findPath(sourceNode, destNode, networkGraph) {
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set();
        
        // Initialize distances
        networkGraph.nodes.forEach(node => {
            distances.set(node.id, node.id === sourceNode.id ? 0 : Infinity);
            previous.set(node.id, null);
            unvisited.add(node.id);
        });
        
        const path = [];
        const steps = [];
        
        while (unvisited.size > 0) {
            // Find unvisited node with minimum distance
            let currentNode = null;
            let minDistance = Infinity;
            
            unvisited.forEach(nodeId => {
                if (distances.get(nodeId) < minDistance) {
                    minDistance = distances.get(nodeId);
                    currentNode = nodeId;
                }
            });
            
            if (currentNode === null) break;
            
            unvisited.delete(currentNode);
            
            // Update distances to neighbors
            const neighbors = this.getNeighbors(currentNode, networkGraph);
            neighbors.forEach(neighbor => {
                if (unvisited.has(neighbor.id)) {
                    const newDistance = distances.get(currentNode) + neighbor.weight;
                    if (newDistance < distances.get(neighbor.id)) {
                        distances.set(neighbor.id, newDistance);
                        previous.set(neighbor.id, currentNode);
                    }
                }
            });
            
            steps.push({
                currentNode,
                distances: new Map(distances),
                unvisited: new Set(unvisited)
            });
            
            if (currentNode === destNode.id) break;
        }
        
        // Reconstruct path
        let currentNode = destNode.id;
        while (currentNode !== null) {
            path.unshift(currentNode);
            currentNode = previous.get(currentNode);
        }
        
        return {
            path,
            distance: distances.get(destNode.id),
            steps
        };
    }

    getNeighbors(nodeId, networkGraph) {
        return networkGraph.edges
            .filter(edge => edge.from === nodeId || edge.to === nodeId)
            .map(edge => ({
                id: edge.from === nodeId ? edge.to : edge.from,
                weight: edge.weight || 1
            }));
    }

    visualizePath(pathResult, networkGraph) {
        // Create visualization of the shortest path algorithm
        const visualization = this.createPathVisualization();
        this.animateAlgorithm(pathResult, networkGraph, visualization);
        return visualization;
    }

    createPathVisualization() {
        const container = document.createElement('div');
        container.className = 'dijkstra-visualization';
        container.style.cssText = `
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
        `;
        
        const header = document.createElement('h3');
        header.textContent = 'Dijkstra\'s Shortest Path Algorithm';
        header.style.cssText = `
            margin: 0 0 20px 0;
            color: #4facfe;
            text-align: center;
        `;
        
        container.appendChild(header);
        document.body.appendChild(container);
        
        return container;
    }

    animateAlgorithm(pathResult, networkGraph, container) {
        // Implementation of step-by-step algorithm animation
        console.log('Animating Dijkstra algorithm:', pathResult);
    }
}

// Export the simulation classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NetworkingSimulation,
        TCPHandshakeSimulation,
        HTTPFlowSimulation,
        DNSResolutionSimulation,
        DHCPSimulation,
        StarTopologyViz,
        MeshTopologyViz,
        DijkstraVisualization
    };
}

// Initialize networking simulations
document.addEventListener('DOMContentLoaded', () => {
    window.networkingSimulation = new NetworkingSimulation();
});