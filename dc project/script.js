// Global variables
let pcmCharts = {};
let deltaCharts = {};
let currentTab = 'pcm';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupTabNavigation();
    setupPCMControls();
    setupDeltaControls();
    updateSliderValues();
}

// Tab Navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            currentTab = targetTab;
        });
    });
}

// PCM Controls Setup
function setupPCMControls() {
    // Get all control elements
    const signalType = document.getElementById('pcm-signal-type');
    const amplitude = document.getElementById('amplitude');
    const frequency = document.getElementById('frequency');
    const samplingFreq = document.getElementById('sampling-freq');
    const quantBits = document.getElementById('quant-bits');
    
    // Add event listeners for real-time updates
    amplitude.addEventListener('input', updatePCMValues);
    frequency.addEventListener('input', updatePCMValues);
    samplingFreq.addEventListener('input', updatePCMValues);
    quantBits.addEventListener('input', updatePCMValues);
    
    // Button event listeners
    document.getElementById('pcm-generate').addEventListener('click', generatePCMSignal);
    document.getElementById('pcm-run').addEventListener('click', runPCMSimulation);
    document.getElementById('pcm-reset').addEventListener('click', resetPCMControls);
}

// Delta Controls Setup
function setupDeltaControls() {
    // Get all control elements
    const signalType = document.getElementById('delta-signal-type');
    const amplitude = document.getElementById('delta-amplitude');
    const frequency = document.getElementById('delta-frequency');
    const samplingFreq = document.getElementById('delta-sampling-freq');
    const stepSize = document.getElementById('step-size');
    
    // Add event listeners for real-time updates
    amplitude.addEventListener('input', updateDeltaValues);
    frequency.addEventListener('input', updateDeltaValues);
    samplingFreq.addEventListener('input', updateDeltaValues);
    stepSize.addEventListener('input', updateDeltaValues);
    
    // Button event listeners
    document.getElementById('delta-generate').addEventListener('click', generateDeltaSignal);
    document.getElementById('delta-run').addEventListener('click', runDeltaSimulation);
    document.getElementById('delta-reset').addEventListener('click', resetDeltaControls);
}

// Update PCM slider values display
function updatePCMValues() {
    const amplitude = parseFloat(document.getElementById('amplitude').value);
    const frequency = parseInt(document.getElementById('frequency').value);
    const samplingFreq = parseInt(document.getElementById('sampling-freq').value);
    const quantBits = parseInt(document.getElementById('quant-bits').value);
    
    document.getElementById('amplitude-value').textContent = amplitude.toFixed(1);
    document.getElementById('frequency-value').textContent = frequency;
    document.getElementById('sampling-freq-value').textContent = samplingFreq;
    document.getElementById('quant-bits-value').textContent = quantBits;
    
    // Update Quantization Levels
    const levels = Math.pow(2, quantBits);
    document.getElementById('quant-levels-info').textContent = levels;
    document.getElementById('quant-levels-bits').textContent = quantBits;
    
    // Update Step Size
    const stepSize = (2 * amplitude) / levels;
    document.getElementById('quant-step-info').textContent = stepSize.toFixed(3);
    document.getElementById('quant-step-a').textContent = amplitude.toFixed(1);
    document.getElementById('quant-step-l').textContent = levels;
    
    // Update Maximum Quantization Error
    const maxError = stepSize / 2;
    document.getElementById('quant-error-info').textContent = maxError.toFixed(3);
    document.getElementById('quant-error-delta').textContent = stepSize.toFixed(3);
    
    // Update PCM Bit Rate
    const bitRate = samplingFreq * quantBits;
    document.getElementById('pcm-bitrate-info').textContent = bitRate;
    document.getElementById('pcm-bitrate-fs').textContent = samplingFreq;
    document.getElementById('pcm-bitrate-bits').textContent = quantBits;
    
    // Update SQNR
    const sqnr = 6.02 * quantBits;
    document.getElementById('sqnr-info').textContent = sqnr.toFixed(2);
    document.getElementById('sqnr-bits').textContent = quantBits;
    
    // Update Nyquist Criterion
    const nyquistCard = document.getElementById('nyquist-card');
    const nyquistTitle = document.getElementById('nyquist-title');
    const nyquistMessage = document.getElementById('nyquist-message');
    const nyquistComparison = document.getElementById('nyquist-comparison');
    
    const minSamplingFreq = 2 * frequency;
    const isNyquistSatisfied = samplingFreq >= minSamplingFreq;
    
    if (isNyquistSatisfied) {
        // Nyquist criterion satisfied
        nyquistCard.classList.remove('aliasing-risk');
        nyquistTitle.innerHTML = '✅ Nyquist Criterion Satisfied';
        nyquistMessage.textContent = 'Sampling rate is sufficient';
        nyquistComparison.innerHTML = `${samplingFreq} ≥ ${minSamplingFreq} ✓ No Aliasing`;
        nyquistComparison.style.color = '#28a745';
        nyquistComparison.style.background = 'rgba(40, 167, 69, 0.1)';
    } else {
        // Aliasing risk
        nyquistCard.classList.add('aliasing-risk');
        nyquistTitle.innerHTML = '⚠️ Aliasing Risk';
        nyquistMessage.textContent = 'Sampling rate insufficient - aliasing may occur';
        nyquistComparison.innerHTML = `${samplingFreq} < ${minSamplingFreq} ⚠️ Aliasing Detected`;
        nyquistComparison.style.color = '#dc3545';
        nyquistComparison.style.background = 'rgba(220, 53, 69, 0.1)';
    }
    
    // Update slider backgrounds
    updateSliderBackground('amplitude', amplitude, 0.1, 5);
    updateSliderBackground('frequency', frequency, 1, 20);
    updateSliderBackground('sampling-freq', samplingFreq, 10, 200);
    updateSliderBackground('quant-bits', quantBits, 1, 8);
}

// Update Delta slider values display
function updateDeltaValues() {
    const amplitude = parseFloat(document.getElementById('delta-amplitude').value);
    const frequency = parseInt(document.getElementById('delta-frequency').value);
    const samplingFreq = parseInt(document.getElementById('delta-sampling-freq').value);
    const stepSize = parseFloat(document.getElementById('step-size').value);
    
    document.getElementById('delta-amplitude-value').textContent = amplitude.toFixed(1);
    document.getElementById('delta-frequency-value').textContent = frequency;
    document.getElementById('delta-sampling-freq-value').textContent = samplingFreq;
    document.getElementById('step-size-value').textContent = stepSize.toFixed(2);
    
    // Update Bit Rate
    document.getElementById('delta-bitrate-info').textContent = samplingFreq;
    document.getElementById('delta-bitrate-formula').textContent = samplingFreq.toString();
    
    // Update Granular Noise
    const granularNoise = stepSize / 2;
    document.getElementById('granular-noise-info').textContent = granularNoise.toFixed(3);
    document.getElementById('granular-noise-formula').textContent = `${stepSize.toFixed(2)}/2`;
    
    // Update Maximum Signal Slope
    const maxSlope = 2 * Math.PI * amplitude * frequency;
    document.getElementById('max-slope-info').textContent = maxSlope.toFixed(2);
    document.getElementById('max-slope-a').textContent = amplitude.toFixed(1);
    document.getElementById('max-slope-f').textContent = frequency;
    
    // Update Maximum Tracking Slope
    const maxTrackingSlope = stepSize * samplingFreq;
    document.getElementById('max-tracking-slope-info').textContent = maxTrackingSlope.toFixed(2);
    document.getElementById('tracking-delta').textContent = stepSize.toFixed(2);
    document.getElementById('tracking-fs').textContent = samplingFreq;
    
    // Update Slope Overload Detection
    const overloadCard = document.getElementById('slope-overload-card');
    const overloadTitle = document.getElementById('overload-title');
    const overloadMessage = document.getElementById('overload-message');
    const slopeComparison = document.getElementById('slope-comparison');
    
    const isOverload = maxSlope > maxTrackingSlope;
    
    if (isOverload) {
        // Slope overload detected
        overloadCard.classList.remove('no-overload');
        overloadTitle.innerHTML = '⚠️ Slope Overload Risk';
        overloadMessage.textContent = 'Signal slope exceeds tracking capability';
        slopeComparison.innerHTML = `${maxSlope.toFixed(2)} > ${maxTrackingSlope.toFixed(2)} ✓ Overload Detected`;
        slopeComparison.style.color = '#dc3545';
        slopeComparison.style.background = 'rgba(220, 53, 69, 0.1)';
    } else {
        // No slope overload
        overloadCard.classList.add('no-overload');
        overloadTitle.innerHTML = '✅ No Slope Overload';
        overloadMessage.textContent = 'Signal changes within step size limits';
        slopeComparison.innerHTML = `${maxSlope.toFixed(2)} ≤ ${maxTrackingSlope.toFixed(2)} ✓ Safe Operation`;
        slopeComparison.style.color = '#28a745';
        slopeComparison.style.background = 'rgba(40, 167, 69, 0.1)';
    }
    
    // Update slider backgrounds
    updateSliderBackground('delta-amplitude', amplitude, 0.1, 5);
    updateSliderBackground('delta-frequency', frequency, 1, 20);
    updateSliderBackground('delta-sampling-freq', samplingFreq, 10, 200);
    updateSliderBackground('step-size', stepSize, 0.01, 1);
}

// Update slider background gradient
function updateSliderBackground(sliderId, value, min, max) {
    const slider = document.getElementById(sliderId);
    const percentage = ((value - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #0a0a0a ${percentage}%, #0a0a0a 100%)`;
}

// Update all slider values initially
function updateSliderValues() {
    updatePCMValues();
    updateDeltaValues();
}

// Signal Generation Functions
function generateAnalogSignal(type, amplitude, frequency, duration = 0.1, sampleRate = 1000) {
    const points = [];
    const numPoints = Math.floor(duration * sampleRate);
    
    for (let i = 0; i < numPoints; i++) {
        const time = i / sampleRate;
        let value = 0;
        
        switch (type) {
            case 'sine':
                value = amplitude * Math.sin(2 * Math.PI * frequency * time);
                break;
            case 'square':
                value = amplitude * Math.sign(Math.sin(2 * Math.PI * frequency * time));
                break;
            case 'triangle':
                const period = 1 / frequency;
                const t = time % period;
                const normalizedT = t / period;
                value = amplitude * (normalizedT < 0.5 ? 4 * normalizedT - 1 : 3 - 4 * normalizedT);
                break;
        }
        
        points.push({ x: time, y: value });
    }
    
    return points;
}

function sampleSignal(signal, samplingFrequency) {
    if (signal.length === 0) return [];
    
    const sampleInterval = 1 / samplingFrequency;
    const sampled = [];
    
    for (let time = 0; time <= signal[signal.length - 1].x; time += sampleInterval) {
        // Find closest point in original signal
        let closestPoint = signal[0];
        let minDistance = Math.abs(signal[0].x - time);
        
        for (const point of signal) {
            const distance = Math.abs(point.x - time);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
            }
        }
        
        sampled.push({ x: time, y: closestPoint.y });
    }
    
    return sampled;
}

function quantizeSignal(sampledSignal, quantizationBits, amplitude) {
    const levels = Math.pow(2, quantizationBits);
    const stepSize = (2 * amplitude) / levels;
    const quantizedSignal = [];
    const tableData = [];
    
    sampledSignal.forEach((point, index) => {
        // Normalize to [0, levels-1]
        const normalizedValue = (point.y + amplitude) / (2 * amplitude);
        const quantizationLevel = Math.round(normalizedValue * (levels - 1));
        
        // Convert back to signal range
        const quantizedValue = -amplitude + (quantizationLevel * stepSize);
        
        // Generate binary code
        const binaryCode = quantizationLevel.toString(2).padStart(quantizationBits, '0');
        
        quantizedSignal.push({ x: point.x, y: quantizedValue });
        
        tableData.push({
            sampleIndex: index,
            time: point.x,
            sampleValue: point.y.toFixed(3),
            quantizationLevel,
            quantizedValue: quantizedValue.toFixed(3),
            binaryCode
        });
    });
    
    return { quantizedSignal, tableData };
}

function generatePCMWaveform(tableData, bitDuration) {
    const waveform = [];
    
    tableData.forEach((row, sampleIndex) => {
        const startTime = sampleIndex * bitDuration * row.binaryCode.length;
        
        row.binaryCode.split('').forEach((bit, bitIndex) => {
            const time = startTime + bitIndex * bitDuration;
            waveform.push({ x: time, y: bit === '1' ? 1 : 0 });
        });
    });
    
    return waveform;
}

// PCM Functions
function generatePCMSignal() {
    const signalType = document.getElementById('pcm-signal-type').value;
    const amplitude = parseFloat(document.getElementById('amplitude').value);
    const frequency = parseInt(document.getElementById('frequency').value);
    
    const analogSignal = generateAnalogSignal(signalType, amplitude, frequency);
    
    // Create chart
    const ctx = document.getElementById('analog-chart').getContext('2d');
    createChart(ctx, analogSignal, '#3b82f6', 'Analog Signal');
}

function runPCMSimulation() {
    const signalType = document.getElementById('pcm-signal-type').value;
    const amplitude = parseFloat(document.getElementById('amplitude').value);
    const frequency = parseInt(document.getElementById('frequency').value);
    const samplingFreq = parseInt(document.getElementById('sampling-freq').value);
    const quantBits = parseInt(document.getElementById('quant-bits').value);
    
    // Generate analog signal
    const analogSignal = generateAnalogSignal(signalType, amplitude, frequency);
    
    // Sample signal
    const sampledSignal = sampleSignal(analogSignal, samplingFreq);
    
    // Quantize signal
    const { quantizedSignal, tableData } = quantizeSignal(sampledSignal, quantBits, amplitude);
    
    // Generate PCM waveform
    const bitDuration = 1 / (samplingFreq * quantBits);
    const pcmWaveform = generatePCMWaveform(tableData, bitDuration);
    
    // Update all charts
    updatePCMCharts(analogSignal, sampledSignal, quantizedSignal, pcmWaveform);
    
    // Update table
    updatePCMTable(tableData);
}

function updatePCMCharts(analogSignal, sampledSignal, quantizedSignal, pcmWaveform) {
    // Analog Signal Chart
    const analogCtx = document.getElementById('analog-chart').getContext('2d');
    createChart(analogCtx, analogSignal, '#3b82f6', 'Analog Signal');
    
    // Sampled Signal Chart
    const sampledCtx = document.getElementById('sampled-chart').getContext('2d');
    createScatterChart(sampledCtx, sampledSignal, '#10b981', 'Sampled Signal');
    
    // Quantized Signal Chart
    const quantizedCtx = document.getElementById('quantized-chart').getContext('2d');
    createChart(quantizedCtx, quantizedSignal, '#f59e0b', 'Quantized Signal');
    
    // PCM Digital Signal Chart
    const digitalCtx = document.getElementById('pcm-digital-chart').getContext('2d');
    createChart(digitalCtx, pcmWaveform, '#ef4444', 'PCM Digital Signal (NRZ-L)');
}

function updatePCMTable(tableData) {
    const tbody = document.getElementById('pcm-table-body');
    tbody.innerHTML = '';
    
    tableData.slice(0, 10).forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.sampleIndex}</td>
            <td>${row.time.toFixed(4)}</td>
            <td>${row.sampleValue}</td>
            <td>${row.quantizationLevel}</td>
            <td>${row.quantizedValue}</td>
            <td>${row.binaryCode}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Delta Modulation Functions
function generateDeltaSignal() {
    const signalType = document.getElementById('delta-signal-type').value;
    const amplitude = parseFloat(document.getElementById('delta-amplitude').value);
    const frequency = parseInt(document.getElementById('delta-frequency').value);
    
    const analogSignal = generateAnalogSignal(signalType, amplitude, frequency);
    
    // Create chart
    const ctx = document.getElementById('delta-original-chart').getContext('2d');
    createChart(ctx, analogSignal, '#3b82f6', 'Original Signal');
}

function runDeltaSimulation() {
    const signalType = document.getElementById('delta-signal-type').value;
    const amplitude = parseFloat(document.getElementById('delta-amplitude').value);
    const frequency = parseInt(document.getElementById('delta-frequency').value);
    const samplingFreq = parseInt(document.getElementById('delta-sampling-freq').value);
    const stepSize = parseFloat(document.getElementById('step-size').value);
    
    // Generate analog signal
    const analogSignal = generateAnalogSignal(signalType, amplitude, frequency);
    
    // Sample signal
    const sampledSignal = sampleSignal(analogSignal, samplingFreq);
    
    // Delta modulation algorithm
    const staircaseSignal = [];
    const bitstream = [];
    const errorSignal = [];
    const tableData = [];
    
    let staircaseValue = 0;
    
    sampledSignal.forEach((point, index) => {
        const prevStaircase = index > 0 ? staircaseSignal[index - 1].y : 0;
        
        // Compare signal with staircase approximation
        const error = point.y - prevStaircase;
        const bit = error >= 0 ? 1 : 0;
        
        // Update staircase value
        staircaseValue = prevStaircase + (bit === 1 ? stepSize : -stepSize);
        
        // Clamp to amplitude range
        staircaseValue = Math.max(-amplitude, Math.min(amplitude, staircaseValue));
        
        staircaseSignal.push({ x: point.x, y: staircaseValue });
        bitstream.push({ x: point.x, y: bit });
        errorSignal.push({ x: point.x, y: error });
        
        tableData.push({
            time: point.x.toFixed(4),
            signalValue: point.y.toFixed(3),
            staircaseValue: staircaseValue.toFixed(3),
            bit,
            direction: bit === 1 ? 'Up ↑' : 'Down ↓'
        });
    });
    
    // Update all charts
    updateDeltaCharts(analogSignal, staircaseSignal, bitstream, errorSignal);
    
    // Update table
    updateDeltaTable(tableData);
}

function updateDeltaCharts(analogSignal, staircaseSignal, bitstream, errorSignal) {
    // Original Signal Chart
    const originalCtx = document.getElementById('delta-original-chart').getContext('2d');
    createChart(originalCtx, analogSignal, '#3b82f6', 'Original Signal');
    
    // Staircase Chart
    const staircaseCtx = document.getElementById('staircase-chart').getContext('2d');
    createStepChart(staircaseCtx, staircaseSignal, '#10b981', 'Staircase Approximation');
    
    // Bitstream Chart
    const bitstreamCtx = document.getElementById('delta-bitstream-chart').getContext('2d');
    createChart(bitstreamCtx, bitstream, '#f59e0b', 'Delta Modulated Bitstream');
    
    // Error Signal Chart
    const errorChartElement = document.getElementById('error-chart');
    if (errorChartElement) {
        const errorCtx = errorChartElement.getContext('2d');
        createChart(errorCtx, errorSignal, '#ef4444', 'Error Signal');
    }
}

function updateDeltaTable(tableData) {
    const tbody = document.getElementById('delta-table-body');
    tbody.innerHTML = '';
    
    tableData.slice(0, 10).forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.time}</td>
            <td>${row.signalValue}</td>
            <td>${row.staircaseValue}</td>
            <td><strong>${row.bit}</strong></td>
            <td>${row.direction}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Chart Creation Functions
function createChart(ctx, data, color, title) {
    const canvas = ctx.canvas;
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, width, height);
    
    if (data.length === 0) return;
    
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Find min and max values
    const minY = Math.min(...data.map(d => d.y));
    const maxY = Math.max(...data.map(d => d.y));
    const maxX = Math.max(...data.map(d => d.x));
    const valueRange = maxY - minY || 1;
    const timeRange = maxX || 1;
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * graphHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + graphWidth, y);
        ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 5; i++) {
        const x = padding + (i / 5) * graphWidth;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + graphHeight);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(padding, padding + graphHeight);
    ctx.lineTo(padding + graphWidth, padding + graphHeight);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + graphHeight);
    ctx.stroke();
    
    // Draw signal
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = padding + (point.x / timeRange) * graphWidth;
        const y = padding + (1 - (point.y - minY) / valueRange) * graphHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    ctx.shadowBlur = 0;
}

function createScatterChart(ctx, data, color, title) {
    const canvas = ctx.canvas;
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, width, height);
    
    if (data.length === 0) return;
    
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Find min and max values
    const minY = Math.min(...data.map(d => d.y));
    const maxY = Math.max(...data.map(d => d.y));
    const maxX = Math.max(...data.map(d => d.x));
    const valueRange = maxY - minY || 1;
    const timeRange = maxX || 1;
    
    // Draw grid and axes (same as createChart)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * graphHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + graphWidth, y);
        ctx.stroke();
    }
    
    for (let i = 0; i <= 5; i++) {
        const x = padding + (i / 5) * graphWidth;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + graphHeight);
        ctx.stroke();
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(padding, padding + graphHeight);
    ctx.lineTo(padding + graphWidth, padding + graphHeight);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + graphHeight);
    ctx.stroke();
    
    // Draw scatter points
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    
    data.forEach(point => {
        const x = padding + (point.x / timeRange) * graphWidth;
        const y = padding + (1 - (point.y - minY) / valueRange) * graphHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    ctx.shadowBlur = 0;
}

function createStepChart(ctx, data, color, title) {
    const canvas = ctx.canvas;
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, width, height);
    
    if (data.length === 0) return;
    
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Find min and max values
    const minY = Math.min(...data.map(d => d.y));
    const maxY = Math.max(...data.map(d => d.y));
    const maxX = Math.max(...data.map(d => d.x));
    const valueRange = maxY - minY || 1;
    const timeRange = maxX || 1;
    
    // Draw grid and axes (same as createChart)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * graphHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + graphWidth, y);
        ctx.stroke();
    }
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(padding, padding + graphHeight);
    ctx.lineTo(padding + graphWidth, padding + graphHeight);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + graphHeight);
    ctx.stroke();
    
    // Draw step signal
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    
    data.forEach((point, index) => {
        const x = padding + (point.x / timeRange) * graphWidth;
        const y = padding + (1 - (point.y - minY) / valueRange) * graphHeight;
        
        if (index === 0) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else {
            const prevPoint = data[index - 1];
            const prevX = padding + (prevPoint.x / timeRange) * graphWidth;
            const prevY = padding + (1 - (prevPoint.y - minY) / valueRange) * graphHeight;
            
            // Draw horizontal line
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, prevY);
            ctx.stroke();
            
            // Draw vertical line
            ctx.beginPath();
            ctx.moveTo(x, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    });
    
    ctx.shadowBlur = 0;
}

// Reset Functions
function resetPCMControls() {
    document.getElementById('pcm-signal-type').value = 'sine';
    document.getElementById('amplitude').value = 2.5;
    document.getElementById('frequency').value = 5;
    document.getElementById('sampling-freq').value = 50;
    document.getElementById('quant-bits').value = 4;
    
    updatePCMValues();
    
    // Clear charts
    clearPCMCharts();
    clearPCMTable();
}

function resetDeltaControls() {
    document.getElementById('delta-signal-type').value = 'sine';
    document.getElementById('delta-amplitude').value = 2.5;
    document.getElementById('delta-frequency').value = 5;
    document.getElementById('delta-sampling-freq').value = 50;
    document.getElementById('step-size').value = 0.2;
    
    updateDeltaValues();
    
    // Clear charts
    clearDeltaCharts();
    clearDeltaTable();
}

function clearPCMCharts() {
    const charts = ['analog-chart', 'sampled-chart', 'quantized-chart', 'pcm-digital-chart'];
    charts.forEach(chartId => {
        const ctx = document.getElementById(chartId).getContext('2d');
        const canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}

function clearDeltaCharts() {
    const charts = ['delta-original-chart', 'staircase-chart', 'delta-bitstream-chart', 'error-chart'];
    charts.forEach(chartId => {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
}

function clearPCMTable() {
    document.getElementById('pcm-table-body').innerHTML = '<tr><td colspan="6" class="no-data">Run simulation to see data</td></tr>';
}

function clearDeltaTable() {
    document.getElementById('delta-table-body').innerHTML = '<tr><td colspan="5" class="no-data">Run simulation to see data</td></tr>';
}
