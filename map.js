window.Charts = {
  radarChart: null,
  lineChart: null,
  scenarioData: null,
  rainfallData: null,

  initRadar(resilienceData) {
    const container = document.getElementById('radar-chart');
    this.radarChart = echarts.init(container, 'dark');

    const indicators = ['抗冲击', '快恢复', '有冗余', '能适应'].map(name => ({
      name, max: 100
    }));

    const seriesData = resilienceData.map(item => ({
      name: `${item.name} (${item['综合']})`,
      value: [item['抗冲击'], item['快恢复'], item['有冗余'], item['能适应']]
    }));

    const colors = ['#00d4ff', '#ff6b6b', '#00ff88'];

    this.radarChart.setOption({
      backgroundColor: 'transparent',
      legend: {
        bottom: 10,
        padding: [5, 5, 5, 5],
        textStyle: { color: '#8899aa', fontSize: 11 },
        data: seriesData.map(d => d.name)
      },
      radar: {
        indicator: indicators,
        shape: 'polygon',
        center: ['43%', '35%'],
        radius: '35%',
        axisName: { 
          color: '#8899aa', 
          fontSize: 11,
          formatter: function(value) {
            if (value.length > 3) {
              return value.split('').join('\n');
            }
            return value;
          }
        },
        splitArea: { areaStyle: { color: ['rgba(0,212,255,0.02)', 'rgba(0,212,255,0.05)'] } },
        splitLine: { lineStyle: { color: 'rgba(0,212,255,0.15)' } },
        axisLine: { lineStyle: { color: 'rgba(0,212,255,0.2)' } }
      },
      series: [{
        type: 'radar',
        data: seriesData.map((d, i) => ({
          ...d,
          lineStyle: { color: colors[i], width: 2 },
          areaStyle: { color: colors[i], opacity: 0.1 },
          itemStyle: { color: colors[i] }
        }))
      }]
    });
  },

  initLine(scenarioData, rainfallData) {
    this.scenarioData = scenarioData;
    this.rainfallData = rainfallData;

    const container = document.getElementById('line-chart');
    this.lineChart = echarts.init(container, 'dark');
    this._renderLine();
  },

  updateLineScenario(scenarioData) {
    this.scenarioData = scenarioData;
    this._renderLine();
  },

  updateTimeCursor(time) {
    if (!this.lineChart) return;
    this.lineChart.setOption({
      series: [],
      xAxis: { data: this.scenarioData?.time_axis || [] },
      dataZoom: [],
    }, false);
    this.lineChart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: this._timeToIndex(time)
    });
  },

  _timeToIndex(time) {
    const axis = this.scenarioData?.time_axis || [];
    for (let i = 0; i < axis.length; i++) {
      if (axis[i] >= time) return i;
    }
    return axis.length - 1;
  },

  _renderLine() {
    if (!this.lineChart || !this.scenarioData) return;
    const timeAxis = this.scenarioData.time_axis || [];
    const pointColors = ['#00d4ff', '#ffd700', '#ff6b6b'];

    const series = [];

    if (this.rainfallData) {
      series.push({
        name: '降雨量 (mm)',
        type: 'bar',
        yAxisIndex: 1,
        data: this.rainfallData.map(r => r.rain_mm),
        itemStyle: { color: 'rgba(0,150,255,0.4)' },
        barWidth: '40%'
      });
    }

    this.scenarioData.points.forEach((pt, i) => {
      const data = [...pt.data];
      while (data.length < timeAxis.length) data.push(0);
      series.push({
        name: pt.name,
        type: 'line',
        yAxisIndex: 0,
        data: data.map(v => (v * 100).toFixed(1)),
        smooth: true,
        lineStyle: { color: pointColors[i], width: 2 },
        itemStyle: { color: pointColors[i] },
        areaStyle: { color: pointColors[i], opacity: 0.05 },
        symbol: 'circle',
        symbolSize: 4
      });
    });

    this.lineChart.setOption({
      backgroundColor: 'transparent',
      grid: { 
        top: '130px', 
        right: '50px', 
        bottom: '40px', 
        left: '50px',
        containLabel: true
      },
      legend: {
        top: '35px',
        textStyle: { color: '#8899aa', fontSize: 10 },
        itemWidth: 12,
        itemGap: 10
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10,22,40,0.95)',
        borderColor: '#00d4ff',
        textStyle: { color: '#ccc', fontSize: 11 },
        z: 9999
      },
      xAxis: {
        type: 'category',
        data: timeAxis.map(t => t + 'min'),
        axisLine: { lineStyle: { color: '#334455' } },
        axisLabel: { color: '#667788', fontSize: 10 }
      },
      yAxis: [
        {
          type: 'value',
          name: '积水(cm)',
          nameTextStyle: { color: '#667788', fontSize: 10 },
          nameGap: 20,
          axisLine: { lineStyle: { color: '#334455' } },
          axisLabel: { color: '#667788', fontSize: 10 },
          splitLine: { lineStyle: { color: 'rgba(0,212,255,0.08)' } }
        },
        {
          type: 'value',
          name: '雨量(mm)',
          nameTextStyle: { color: '#667788', fontSize: 10 },
          nameGap: 20,
          axisLine: { lineStyle: { color: '#334455' } },
          axisLabel: { color: '#667788', fontSize: 10 },
          splitLine: { show: false },
          inverse: true
        }
      ],
      series
    }, true);
    
    this.lineChart.resize();
  },

  resize() {
    this.radarChart?.resize();
    this.lineChart?.resize();
  }
};
