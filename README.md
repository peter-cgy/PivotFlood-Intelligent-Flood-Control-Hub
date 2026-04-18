```markdown
# PivotFlood — Intelligent Flood Control Hub

**PivotFlood** is a world-model-based intelligent decision support system for urban flood management. It integrates a Physics-Informed Spatio-Temporal Graph Neural Network (PI-STGNN) with multi-modal real-time data (radar, IoT, social media) to achieve millisecond-level waterlogging prediction and intervention simulation.

> 中文简介：基于世界模型的城市洪涝智能决策中枢，实现毫秒级积水预测与干预模拟。

---

## ✨ Features

- World Model core (PI-STGNN) for state prediction
- Millisecond inference, 5000× faster than SWMM
- What-if intervention simulation (pump, gate, dispatch)
- Multi-modal fusion: radar, IoT, social media
- Risk heatmap & resilience radar chart
- LLM-generated emergency reports

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/peter-cgy/PivotFlood.git
cd PivotFlood
```

### 2. Open the website

Simply open `index.html` in your browser.

Or use a local server (recommended):

```bash
# Python 3
python -m http.server 8000

# Then visit http://localhost:8000
```

---

## 📁 Project Structure

```
PivotFlood/
├── index.html          # Main entry
├── css/                # Styles
├── js/                 # JavaScript
├── data/               # Sample data (GeoJSON, CSV)
└── assets/             # Images, icons
```

---

## 🌍 Deployment

### Temporary sharing (for testing)

```bash
npx localtunnel --port 8000
```

You will get a temporary public URL.

### Permanent hosting (static site)

Upload the entire folder to:
- **Vercel**: `vercel --prod`
- **Netlify**: drag & drop
- **GitHub Pages**: push to `gh-pages` branch

---

## 📄 License

MIT License

---

## 📧 Contact

**Project Lead**: Chen Guoyi  
**Email**: 10253901414@stu.ecnu.edu.cn  
**Institution**: East China Normal University

---

## 🙏 Acknowledgements

- Prof. Li Xia (consultant)
- SWMM (EPA)
- OpenStreetMap, Tianditu
```
