# PivotFlood-Intelligent-Flood-Control-Hub
PivotFlood is an intelligent decision hub for urban flood management that systematically integrates the World Model paradigm into disaster response. 
```markdown
# PivotFlood — Intelligent Flood Control Hub

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-green.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-red.svg)](https://pytorch.org/)

**PivotFlood** is a world-model-based intelligent decision support system for urban flood management. It integrates a Physics-Informed Spatio-Temporal Graph Neural Network (PI-STGNN) with multi-modal real-time data (radar, IoT, social media) to achieve millisecond-level waterlogging prediction and intervention simulation.

> 中文简介：PivotFlood 是一个基于世界模型的城市洪涝智能决策中枢，融合物理信息增强的时空图神经网络（PI-STGNN）与多模态实时数据，实现毫秒级积水预测与干预模拟。

---

## ✨ Features

- **World Model Core** – Learns the state transition function of drainage networks: \( s_{t+1} = f(s_t, a_t, x_t) \)
- **Millisecond Prediction** – Up to 5000× faster than traditional SWMM dynamic wave solver
- **What-If Intervention** – Evaluate pump activation, gate control, or emergency dispatch in real time
- **Multi-Modal Fusion** – Integrates radar imagery, IoT time series, and social media text
- **Risk Visualization** – Heatmaps (red/orange/yellow/blue) and resilience radar charts
- **Automatic Reports** – LLM-generated emergency plans and public alerts

---

## 🏗️ System Architecture

```
Data Layer          → Model Layer                → Application Layer
DEM /管网 / 降雨      → PI-STGNN (World Model)     → Web Dashboard
IoT / 雷达 / 微博     → Multi-modal Encoder       → Mini Program
历史案例 / 规则       → Knowledge Graph           → API
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- PyTorch & PyTorch Geometric
- SWMM 5.2 (for data generation)

### Installation

```bash
git clone https://github.com/your-username/PivotFlood.git
cd PivotFlood
pip install -r requirements.txt
```

### Run Demo

```bash
python backend/app.py
# Open browser at http://localhost:8000
```

---

## 📁 Data Preparation

The model requires:
- **Subcatchments** (polygons with Area, Slope, Imperv)
- **Manholes** (nodes with elevation)
- **Conduits** (edges with length, diameter)
- **Rainfall time series** (design storms or historical events)

We provide a sample dataset for East China Normal University (Minhang Campus). To use your own city data, follow the [Data Guide](docs/data_guide.md).

---

## 🧠 Model Training

```bash
python train.py --config configs/pistgnn.yaml
```

Key parameters:
- `--node_features`: 水位, 流量, 静态属性
- `--physics_weight`: 0.01 ~ 0.1 (balance data loss vs physics loss)
- `--epochs`: 200

After training, the model is saved as `checkpoints/world_model.pth`.

---

## 📊 Evaluation

| Metric | Value (Test Set) |
|--------|------------------|
| RMSE (water depth) | 3.2 cm |
| MAE | 2.5 cm |
| Inference time | 35 ms per step |

Compare with SWMM dynamic wave: **~5000× speedup**.

---

## 📝 Citation

If you use PivotFlood in your research, please cite:

```bibtex
@software{pivotflood2026,
  author = {Chen Guoyi and Wang Hongwei and Wu Chenwei and Ren Yutong},
  title = {PivotFlood: A World-Model-Based Urban Flood Decision Support System},
  year = {2026},
  url = {https://github.com/your-username/PivotFlood}
}
```

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

Project Lead: Chen Guoyi  
Email: 10253901414@stu.ecnu.edu.cn  
Institution: East China Normal University

---

## 🙏 Acknowledgements

- Prof. Li Xia (consultant)
- SWMM (EPA)
- PyTorch & PyTorch Geometric communities
```
