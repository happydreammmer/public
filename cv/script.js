// AI Data Flow Visualization
        class DataFlowVisualization {
            constructor() {
                this.canvas = document.getElementById('dataflow-canvas');
                this.ctx = this.canvas.getContext('2d');
                this.particles = [];
                this.streams = [];
                this.aiTerms = [
                    'AI', 'ML', 'React', 'Node.js', 'LangChain', 'OpenAI', 'Claude', 
                    'Python', 'API', 'Vector', 'Neural', 'Data', 'Deep', 'Learn',
                    'Prompt', 'Model', 'GPT', 'Train', 'Infer', 'Algo', 'Code',
                    'Deploy', 'Scale', 'Cloud', 'Ops', 'Dev', 'Build', 'Test'
                ];
                
                this.resize();
                this.initStreams();
                this.animate();
                
                window.addEventListener('resize', () => this.resize());
            }
            
            resize() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
            
            initStreams() {
                const streamCount = Math.floor(this.canvas.width / 100);
                this.streams = [];
                
                for (let i = 0; i < streamCount; i++) {
                    this.streams.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        speed: 0.5 + Math.random() * 1.5,
                        angle: Math.random() * Math.PI * 2,
                        length: 100 + Math.random() * 200,
                        opacity: 0.1 + Math.random() * 0.3,
                        hue: 220 + Math.random() * 40
                    });
                }
                
                // Initialize particles
                for (let i = 0; i < 30; i++) {
                    this.particles.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        vx: (Math.random() - 0.5) * 0.5,
                        vy: (Math.random() - 0.5) * 0.5,
                        size: 1 + Math.random() * 2,
                        opacity: 0.2 + Math.random() * 0.6,
                        term: this.aiTerms[Math.floor(Math.random() * this.aiTerms.length)],
                        termOpacity: 0.1 + Math.random() * 0.3,
                        lastTermTime: 0
                    });
                }
            }
            
            drawStream(stream) {
                this.ctx.save();
                this.ctx.translate(stream.x, stream.y);
                this.ctx.rotate(stream.angle);
                
                const gradient = this.ctx.createLinearGradient(0, 0, stream.length, 0);
                gradient.addColorStop(0, `hsla(${stream.hue}, 70%, 60%, 0)`);
                gradient.addColorStop(0.5, `hsla(${stream.hue}, 70%, 60%, ${stream.opacity})`);
                gradient.addColorStop(1, `hsla(${stream.hue}, 70%, 60%, 0)`);
                
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(stream.length, 0);
                this.ctx.stroke();
                
                // Add flowing dots
                for (let i = 0; i < 3; i++) {
                    const dotX = (Date.now() * stream.speed * 0.01 + i * stream.length / 3) % stream.length;
                    this.ctx.fillStyle = `hsla(${stream.hue}, 70%, 70%, ${stream.opacity * 2})`;
                    this.ctx.beginPath();
                    this.ctx.arc(dotX, 0, 1, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                this.ctx.restore();
            }
            
            drawParticle(particle) {
                // Draw particle
                this.ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Occasionally show AI term
                if (Date.now() - particle.lastTermTime > 3000 + Math.random() * 5000) {
                    particle.lastTermTime = Date.now();
                    particle.showTerm = true;
                    setTimeout(() => {
                        particle.showTerm = false;
                    }, 2000);
                }
                
                if (particle.showTerm) {
                    this.ctx.fillStyle = `rgba(102, 126, 234, ${particle.termOpacity})`;
                    this.ctx.font = '10px monospace';
                    this.ctx.fillText(particle.term, particle.x + 5, particle.y - 5);
                }
            }
            
            animate() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Draw streams
                this.streams.forEach(stream => {
                    this.drawStream(stream);
                    
                    // Move streams slowly
                    stream.x += Math.cos(stream.angle) * stream.speed * 0.1;
                    stream.y += Math.sin(stream.angle) * stream.speed * 0.1;
                    
                    // Wrap around screen
                    if (stream.x < -stream.length) stream.x = this.canvas.width;
                    if (stream.x > this.canvas.width + stream.length) stream.x = -stream.length;
                    if (stream.y < -stream.length) stream.y = this.canvas.height;
                    if (stream.y > this.canvas.height + stream.length) stream.y = -stream.length;
                });
                
                // Draw particles
                this.particles.forEach(particle => {
                    this.drawParticle(particle);
                    
                    // Move particles
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Wrap around screen
                    if (particle.x < 0) particle.x = this.canvas.width;
                    if (particle.x > this.canvas.width) particle.x = 0;
                    if (particle.y < 0) particle.y = this.canvas.height;
                    if (particle.y > this.canvas.height) particle.y = 0;
                });
                
                requestAnimationFrame(() => this.animate());
            }
        }
        
        // Load profile photo
        async function loadProfilePhoto() {
            try {
                const imageData = await window.fs.readFile('image.jpg');
                const blob = new Blob([imageData], { type: 'image/jpeg' });
                const imageUrl = URL.createObjectURL(blob);
                
                const img = document.getElementById('profile-photo');
                const initials = document.getElementById('initials');
                
                img.src = imageUrl;
                img.style.display = 'block';
                initials.style.display = 'none';
            } catch (error) {
                console.log('No profile photo found, using initials');
            }
        }

        function downloadPDF() {
            // Hide animations for print
            const canvas = document.getElementById('dataflow-canvas');
            const downloadSection = document.querySelector('.download-section');
            
            canvas.style.display = 'none';
            downloadSection.style.display = 'none';
            
            const originalTitle = document.title;
            document.title = 'Hatef_Kouzechi_AI_Engineer_Resume';
            
            // Use setTimeout to ensure styles are applied
            setTimeout(() => {
                // For browsers that support it, try to save as PDF directly
                if (window.chrome && window.chrome.webstore) {
                    window.print();
                } else {
                    // Fallback to print dialog
                    window.print();
                }
                
                // Restore after print
                setTimeout(() => {
                    canvas.style.display = 'block';
                    downloadSection.style.display = 'block';
                    document.title = originalTitle;
                }, 2000);
            }, 100);
        }

        // Initialize everything
        window.addEventListener('load', () => {
            loadProfilePhoto();
            
            // Initialize data flow animation
            if (window.innerWidth > 768) {
                new DataFlowVisualization();
            }
            
            // Animate skill bars
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.style.width || '0%';
                }, index * 200);
            });
        }); 