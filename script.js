class GPXAnalyzer {
    constructor() {
        this.routes = [];
        this.chart = null;
        this.initializeEventListeners();
        this.initializeChart();
    }

    initializeEventListeners() {
        const fileInput = document.getElementById('gpxFileInput');
        const downloadBtn = document.getElementById('downloadBtn');
        const clearBtn = document.getElementById('clearBtn');

        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        downloadBtn.addEventListener('click', () => this.downloadChart());
        clearBtn.addEventListener('click', () => this.clearAllData());
    }

    initializeChart() {
        const ctx = document.getElementById('elevationChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                backgroundColor: '#ffffff',
                plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: '距離 (km)',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '高度 (m)',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                },
                interaction: {
                    intersect: true,
                    mode: 'point'
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        mode: 'point',
                        intersect: true,
                        callbacks: {
                            title: function(context) {
                                return '距離: ' + context[0].parsed.x.toFixed(2) + ' km';
                            },
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(0) + ' m';
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 0,
                        hoverRadius: 6,
                        hoverBorderWidth: 2
                    },
                    line: {
                        borderWidth: 1.5
                    }
                }
            }
        });
    }

    async handleFileUpload(event) {
        const files = Array.from(event.target.files);
        
        for (const file of files) {
            try {
                const routeData = await this.parseGPXFile(file);
                if (routeData) {
                    this.routes.push(routeData);
                }
            } catch (error) {
                console.error('解析 GPX 文件失敗:', error);
                alert(`解析文件 ${file.name} 時發生錯誤: ${error.message}`);
            }
        }

        this.updateRoutesList();
        this.updateChart();
    }

    async parseGPXFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(text, 'text/xml');
                    
                    const routeData = this.extractRouteData(xmlDoc, file.name);
                    resolve(routeData);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('文件讀取失敗'));
            reader.readAsText(file);
        });
    }

    extractRouteData(xmlDoc, fileName) {
        const trackPoints = xmlDoc.querySelectorAll('trkpt');
        
        if (trackPoints.length === 0) {
            throw new Error('未找到軌跡點');
        }

        const points = [];
        let totalDistance = 0;
        let minElevation = Infinity;
        let maxElevation = -Infinity;

        trackPoints.forEach((point, index) => {
            const lat = parseFloat(point.getAttribute('lat'));
            const lon = parseFloat(point.getAttribute('lon'));
            const elevation = parseFloat(point.querySelector('ele')?.textContent || 0);

            if (index > 0) {
                const prevPoint = points[points.length - 1];
                const distance = this.calculateDistance(
                    prevPoint.lat, prevPoint.lon,
                    lat, lon
                );
                totalDistance += distance;
            }

            points.push({ lat, lon, elevation, distance: totalDistance });
            
            if (elevation < minElevation) minElevation = elevation;
            if (elevation > maxElevation) maxElevation = elevation;
        });

        return {
            id: Date.now() + Math.random(),
            name: fileName.replace('.gpx', ''),
            points: points,
            totalDistance: totalDistance,
            minElevation: minElevation,
            maxElevation: maxElevation,
            visible: true
        };
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // 地球半徑 (公里)
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI/180);
    }

    updateRoutesList() {
        const routesSection = document.getElementById('routesSection');
        const routesList = document.getElementById('routesList');
        
        if (this.routes.length === 0) {
            routesSection.style.display = 'none';
            return;
        }

        routesSection.style.display = 'block';
        routesList.innerHTML = '';

        this.routes.forEach(route => {
            const routeItem = document.createElement('div');
            routeItem.className = 'route-item';
            
            routeItem.innerHTML = `
                <input type="checkbox" class="route-checkbox" ${route.visible ? 'checked' : ''} 
                       onchange="gpxAnalyzer.toggleRoute('${route.id}')">
                <div class="route-info">
                    <div class="route-name">${route.name}</div>
                    <div class="route-stats">
                        距離: ${route.totalDistance.toFixed(2)} km | 
                        高度: ${route.minElevation.toFixed(0)}m - ${route.maxElevation.toFixed(0)}m
                    </div>
                </div>
            `;
            
            routesList.appendChild(routeItem);
        });
    }

    toggleRoute(routeId) {
        const route = this.routes.find(r => r.id == routeId);
        if (route) {
            route.visible = !route.visible;
            this.updateChart();
        }
    }

    updateChart() {
        const visibleRoutes = this.routes.filter(route => route.visible);
        
        if (visibleRoutes.length === 0) {
            this.chart.data.datasets = [];
            this.chart.update();
            document.getElementById('noDataMessage').style.display = 'block';
            document.getElementById('downloadBtn').disabled = true;
            return;
        }

        document.getElementById('noDataMessage').style.display = 'none';
        document.getElementById('downloadBtn').disabled = false;

        const datasets = visibleRoutes.map((route, index) => {
            const colors = [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
            ];
            
            return {
                label: route.name,
                data: route.points.map(point => ({
                    x: point.distance,
                    y: point.elevation
                })),
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '20',
                borderWidth: 2,
                fill: false,
                tension: 0.1
            };
        });

        this.chart.data.datasets = datasets;
        this.chart.update();
    }

    downloadChart() {
        // Create a temporary canvas with white background
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const originalCanvas = this.chart.canvas;
        
        // Set the same dimensions as the original chart
        tempCanvas.width = originalCanvas.width;
        tempCanvas.height = originalCanvas.height;
        
        // Fill with white background
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw the chart on top
        tempCtx.drawImage(originalCanvas, 0, 0);
        
        // Create download link
        const link = document.createElement('a');
        link.download = `gpx-elevation-chart-${new Date().toISOString().split('T')[0]}.png`;
        link.href = tempCanvas.toDataURL('image/png', 1.0);
        link.click();
    }

    clearAllData() {
        this.routes = [];
        this.chart.data.datasets = [];
        this.chart.update();
        document.getElementById('routesSection').style.display = 'none';
        document.getElementById('noDataMessage').style.display = 'block';
        document.getElementById('downloadBtn').disabled = true;
        document.getElementById('gpxFileInput').value = '';
    }
}

// 初始化應用
const gpxAnalyzer = new GPXAnalyzer();
