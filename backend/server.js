// backend/server.js
const express = require('express');
const cors = require('cors');
const ping = require('ping');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 🛡️ Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// 📊 Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// 🏠 Ana sayfa - Frontend'i serve et
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 🌐 Tek ping endpoint
app.get('/api/ping/:host', async (req, res) => {
    try {
        const host = req.params.host;
        
        // 🔍 Basit host validation
        if (!isValidHost(host)) {
            return res.status(400).json({ 
                error: 'Geçersiz host adresi',
                host: host 
            });
        }

        console.log(`🏓 Ping atılıyor: ${host}`);
        
        const startTime = Date.now();
        const result = await ping.promise.probe(host, {
            timeout: 10, // 10 saniye timeout
            extra: ['-c', '1'], // Linux/Mac için 1 paket gönder
            min_reply: 1,
            deadline: 10
        });
        
        const endTime = Date.now();
        const totalTime = endTime - startTime;

        // 📈 Sonucu logla
        console.log(`✅ Ping sonucu - ${host}: ${result.time}ms (${result.alive ? 'Başarılı' : 'Başarısız'})`);
        
        res.json({
            host: host,
            alive: result.alive,
            time: result.alive ? parseFloat(result.time) : null,
            timestamp: new Date().toISOString(),
            totalRequestTime: totalTime
        });

    } catch (error) {
        console.error(`❌ Ping hatası:`, error.message);
        res.status(500).json({ 
            error: 'Ping işlemi başarısız',
            message: error.message,
            host: req.params.host
        });
    }
});

// 🚀 Çoklu ping endpoint (seri olarak)
app.post('/api/ping-series', async (req, res) => {
    try {
        const { hosts, count = 5 } = req.body;
        
        if (!hosts || !Array.isArray(hosts)) {
            return res.status(400).json({ 
                error: 'hosts array gerekli' 
            });
        }

        if (count > 20) {
            return res.status(400).json({ 
                error: 'Maksimum 20 ping'
            });
        }

        const results = [];
        
        for (const host of hosts) {
            if (!isValidHost(host)) {
                results.push({
                    host,
                    error: 'Geçersiz host',
                    pings: []
                });
                continue;
            }

            console.log(`🔄 ${host} için ${count} ping başlatılıyor...`);
            const hostResults = {
                host: host,
                pings: [],
                avg: null,
                min: null,
                max: null,
                lost: 0
            };

            // Her host için belirlenen sayıda ping at
            for (let i = 0; i < count; i++) {
                try {
                    const result = await ping.promise.probe(host, {
                        timeout: 10,
                        extra: ['-c', '1']
                    });

                    const pingData = {
                        sequence: i + 1,
                        time: result.alive ? parseFloat(result.time) : null,
                        alive: result.alive,
                        timestamp: new Date().toISOString()
                    };

                    hostResults.pings.push(pingData);
                    
                    if (!result.alive) {
                        hostResults.lost++;
                    }

                    // Küçük delay (network'ü bombalamasın)
                    await new Promise(resolve => setTimeout(resolve, 100));

                } catch (pingError) {
                    hostResults.pings.push({
                        sequence: i + 1,
                        time: null,
                        alive: false,
                        error: pingError.message,
                        timestamp: new Date().toISOString()
                    });
                    hostResults.lost++;
                }
            }

            // İstatistikleri hesapla
            const successfulPings = hostResults.pings
                .filter(p => p.alive && p.time !== null)
                .map(p => p.time);

            if (successfulPings.length > 0) {
                hostResults.avg = successfulPings.reduce((a, b) => a + b, 0) / successfulPings.length;
                hostResults.min = Math.min(...successfulPings);
                hostResults.max = Math.max(...successfulPings);
            }

            results.push(hostResults);
            
            console.log(`✅ ${host} tamamlandı: ${successfulPings.length}/${count} başarılı`);
        }

        res.json({
            results: results,
            timestamp: new Date().toISOString(),
            totalHosts: hosts.length,
            requestedCount: count
        });

    } catch (error) {
        console.error('❌ Ping series hatası:', error);
        res.status(500).json({ 
            error: 'Ping series işlemi başarısız',
            message: error.message 
        });
    }
});

// 📊 Server durumu endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        node: process.version
    });
});

// 🔍 Host validation fonksiyonu
function isValidHost(host) {
    if (!host || typeof host !== 'string') return false;
    
    // IP adresi regex (basit)
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    
    // Domain regex (basit)
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Localhost, private IP'ler vs. izin ver
    if (host === 'localhost' || host === '127.0.0.1') return true;
    
    return ipRegex.test(host) || domainRegex.test(host);
}

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint bulunamadı',
        path: req.originalUrl 
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('🚨 Server Error:', error);
    res.status(500).json({ 
        error: 'Sunucu hatası',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Bir hata oluştu'
    });
});

// 🚀 Server'ı başlat
app.listen(PORT, () => {
    console.log(`
    🚀 Ping API Server başlatıldı!
    
    📍 Server: http://localhost:${PORT}
    🌐 Frontend: http://localhost:${PORT}
    📊 Status: http://localhost:${PORT}/api/status
    🏓 Ping API: http://localhost:${PORT}/api/ping/8.8.8.8
    
    📝 Loglar konsola yazılacak...
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Server kapatılıyor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Server kapatılıyor... (Ctrl+C)');
    process.exit(0);
});