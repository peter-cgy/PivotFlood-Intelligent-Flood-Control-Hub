window.Timeline = {
  currentTime: 0,
  playing: false,
  playTimer: null,
  scenarioData: null,
  rainfallData: null,
  onUpdate: null,

  init(onUpdate) {
    this.onUpdate = onUpdate;
    this.slider = document.getElementById('time-slider');
    this.display = document.getElementById('time-display');
    this.rainDisplay = document.getElementById('rain-display');
    this.playBtn = document.getElementById('play-btn');

    this.slider.addEventListener('input', () => {
      this.currentTime = parseInt(this.slider.value);
      this._emitUpdate();
    });

    this.playBtn.addEventListener('click', () => this.togglePlay());
  },

  setScenario(data) {
    this.scenarioData = data;
    this.reset();
  },

  setRainfall(data) {
    this.rainfallData = data;
  },

  reset() {
    this.stop();
    this.currentTime = 0;
    this.slider.value = 0;
    this._emitUpdate();
  },

  togglePlay() {
    this.playing ? this.stop() : this.play();
  },

  play() {
    if (this.playing) return;
    this.playing = true;
    this.playBtn.textContent = '⏸';
    this.playBtn.classList.add('playing');

    this.playTimer = setInterval(() => {
      this.currentTime += CONFIG.PLAY_STEP;
      if (this.currentTime > 120) {
        this.currentTime = 0;
      }
      this.slider.value = this.currentTime;
      this._emitUpdate();
    }, CONFIG.PLAY_INTERVAL_MS);
  },

  stop() {
    this.playing = false;
    this.playBtn.textContent = '▶';
    this.playBtn.classList.remove('playing');
    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
  },

  getDepthsAtTime(time) {
    if (!this.scenarioData) return {};
    const timeAxis = this.scenarioData.time_axis || [];
    const result = {};

    this.scenarioData.points.forEach(pt => {
      result[pt.name] = this._interpolate(timeAxis, pt.data, time);
    });
    return result;
  },

  getRainfallAtTime(time) {
    if (!this.rainfallData || this.rainfallData.length === 0) return 0;
    const times = this.rainfallData.map(r => r.time_min);
    const values = this.rainfallData.map(r => r.rain_mm);
    return this._interpolateArrays(times, values, time);
  },

  _interpolate(timeAxis, dataArr, time) {
    if (!timeAxis.length || !dataArr.length) return 0;
    const data = dataArr.length < timeAxis.length
      ? dataArr.concat(new Array(timeAxis.length - dataArr.length).fill(0))
      : dataArr;

    if (time <= timeAxis[0]) return data[0];
    if (time >= timeAxis[timeAxis.length - 1]) return data[data.length - 1];

    for (let i = 0; i < timeAxis.length - 1; i++) {
      if (time >= timeAxis[i] && time <= timeAxis[i + 1]) {
        const t0 = timeAxis[i], t1 = timeAxis[i + 1];
        const ratio = (time - t0) / (t1 - t0);
        return data[i] + (data[i + 1] - data[i]) * ratio;
      }
    }
    return 0;
  },

  _interpolateArrays(times, values, time) {
    if (time <= times[0]) return values[0];
    if (time >= times[times.length - 1]) return values[values.length - 1];
    for (let i = 0; i < times.length - 1; i++) {
      if (time >= times[i] && time <= times[i + 1]) {
        const ratio = (time - times[i]) / (times[i + 1] - times[i]);
        return values[i] + (values[i + 1] - values[i]) * ratio;
      }
    }
    return 0;
  },

  _emitUpdate() {
    this.display.textContent = `T = ${this.currentTime} min`;
    const rain = this.getRainfallAtTime(this.currentTime);
    this.rainDisplay.textContent = `降雨: ${rain.toFixed(1)} mm`;

    if (this.onUpdate) {
      const depths = this.getDepthsAtTime(this.currentTime);
      this.onUpdate(this.currentTime, depths, rain);
    }
  }
};
