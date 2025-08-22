# 🚀 Ping Speed Analyzer

**Gerçek zamanlı LAN vs WAN ping karşılaştırma aracı**

Modern web teknolojileri ile yerel ağ (LAN) ve geniş alan ağı (WAN) ping sürelerini karşılaştıran, görsel grafiklerle sunan interaktif web uygulaması.

![Ping Speed Analyzer](https://img.shields.io/badge/status-active-brightgreen) ![Node.js](https://img.shields.io/badge/node.js-v16+-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Özellikler

### 🏠 **LAN & WAN Ping Karşılaştırması**
- Yerel ağ cihazlarına gerçek ping testleri
- İnternet sunucularına WAN ping testleri
- Paralel ping işlemleri ile hızlı sonuçlar

### 📊 **Canlı Görselleştirme**
- Chart.js ile interaktif grafikler
- Gerçek zamanlı ping sonuçları
- Ortalama, minimum, maksimum değerler

### 📈 **Gelişmiş İstatistikler**
- Ping süresi karşılaştırmaları
- Paket kaybı oranları
- Hız farkı hesaplamaları
- Test geçmişi logları

### 🎨 **Modern Kullanıcı Arayüzü**
- Responsive tasarım
- Glassmorphism efektleri
- Animasyonlu butonlar ve geçişler
- Mobil uyumlu interface

## 🛠️ Teknoloji Stack'i

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **ping** - Gerçek ping işlemleri
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Modern markup
- **CSS3** - Glassmorphism & animations
- **Vanilla JavaScript** - DOM manipulation
- **Chart.js** - Data visualization

## 🚀 Kurulum

### Gereksinimler
- **Node.js** v16 veya üzeri
- **npm** v8 veya üzeri
- **Git** (opsiyonel)

### 1. Proje Klonlama
```bash
git clone https://github.com/mratsag/ping-speed-analyzer.git
cd ping-speed-analyzer
```

### 2. Backend Kurulumu
```bash
cd backend
npm install
```

### 3. Environment Ayarları
```bash
# .env dosyası oluştur
cp ../.env.example .env

# İsteğe göre değişkenleri düzenle
nano .env
```

### 4. Sunucuyu Başlatma
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Uygulama Erişimi
```
http://localhost:3001
```

## 📖 Kullanım

### Temel Ping Testi
1. **LAN IP Adresi:** Router veya modem IP'sini girin (örn: `192.168.1.1`)
2. **WAN Adresi:** İnternet sunucusu adresini girin (örn: `8.8.8.8`)
3. **Test Sayısı:** Kaç ping atılacağını belirleyin (3-20 arası)
4. **"Gerçek Ping Testi"** butonuna tıklayın

### Sonuçları Yorumlama
- **LAN Ping:** 1-5ms normal (yerel ağ)
- **WAN Ping:** 20-100ms normal (internet)
- **Paket Kaybı:** %0-5 ideal, %10+ problemli
- **Hız Farkı:** WAN/LAN oranı (genellikle 10-50x)

## 📁 Proje Yapısı

```
ping-speed-analyzer/
├── backend/                    # Node.js API Server
│   ├── server.js              # Ana server dosyası
│   ├── package.json           # Dependencies
│   └── .env                   # Environment variables
├── frontend/                   # Web Client
│   ├── index.html             # Ana sayfa
│   ├── css/
│   │   └── style.css          # Stil dosyaları
│   └── js/
│       └── main.js            # JavaScript logic
├── .env.example               # Environment örneği
├── .gitignore                 # Git ignore rules
└── README.md                  # Bu dosya
```

## 🔧 API Endpoints

### `GET /api/status`
Server durumunu kontrol eder
```json
{
  "status": "OK",
  "timestamp": "2025-08-22T06:25:10.191Z",
  "uptime": 3.858287042,
  "version": "1.0.0"
}
```

### `GET /api/ping/:host`
Tek ping testi yapar
```bash
curl http://localhost:3001/api/ping/8.8.8.8
```

### `POST /api/ping-series`
Çoklu ping testleri yapar
```bash
curl -X POST http://localhost:3001/api/ping-series \
  -H "Content-Type: application/json" \
  -d '{"hosts": ["8.8.8.8", "192.168.1.1"], "count": 5}'
```

## 🎯 Örnek Kullanım Senaryoları

### 🏠 **Ev Ağı Performansı**
- Router ping süresini test edin
- İnternet bağlantı kalitesini ölçün
- WiFi vs Ethernet karşılaştırması

### 🏢 **Ofis Ağı Analizi**
- Yerel sunucu erişim hızını test edin
- İnternet çıkış performansını ölçün
- Network troubleshooting

### 🎮 **Gaming & Streaming**
- Ping süresinin oyun performansına etkisi
- Streaming için optimal bağlantı kontrolü
- Latency optimizasyonu

## 🔧 Geliştirme

### Development Mode
```bash
cd backend
npm run dev  # Nodemon ile auto-restart
```

### Yeni Özellik Ekleme
1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 🐛 Troubleshooting

### Backend Başlamıyor
```bash
# Port kullanımını kontrol et
netstat -an | grep 3001

# Node.js versiyonunu kontrol et
node --version  # v16+ gerekli
```

### Ping Çalışmıyor
- **Linux/Mac:** `ping` komutu yüklü olmalı
- **Windows:** Farklı ping parametreleri gerekebilir
- **Firewall:** ICMP paketlerine izin verilmeli

### CSS/JS Yüklenmiyor
```bash
# Dosya yollarını kontrol et
ls frontend/css/style.css
ls frontend/js/main.js

# Server static dosya servisini kontrol et
curl http://localhost:3001/css/style.css
```

## 📝 Todo List

- [ ] 🌍 Dünya çapında sunucu ping testleri
- [ ] 📱 Progressive Web App (PWA) desteği
- [ ] 💾 Ping geçmişi kaydetme (localStorage)
- [ ] 📊 Gelişmiş istatistik grafikleri
- [ ] 🔔 Ping threshold alertleri
- [ ] 🎵 Başarı/hata ses efektleri
- [ ] 🐳 Docker containerization
- [ ] ⚡ WebSocket real-time updates

## 🤝 Katkıda Bulunma

Katkılar her zaman hoş karşılanır! 

1. **Issues** - Bug report veya feature request
2. **Pull Requests** - Code contributions
3. **Documentation** - README veya API doc iyileştirmeleri
4. **Testing** - Farklı platformlarda test

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**Murat Sağ** - *Initial work* - [GitHub Profile](https://github.com/mratsag) - [Website](https://www.muratsag.com)

## 🙏 Teşekkürler

- [Chart.js](https://www.chartjs.org/) - Awesome charting library
- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [ping npm package](https://www.npmjs.com/package/ping) - Cross-platform ping utility

---

⭐ **Bu proje faydalıysa star vermeyi unutmayın!**

📫 **İletişim:** [mrat.sag@hotmail.com](mailto:mrat.sag@hotmail.com)

🌐 **Website:** [www.muratsag.com](https://www.muratsag.com)

📱 **Demo:** [Live Demo](https://ping-analyzer.muratsag.com) *(yakında)*