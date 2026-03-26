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

    // Update final output
    const finalSequence = tableData.map(row => row.binaryCode).join(' ');
    document.getElementById('pcm-final-output').textContent = finalSequence;
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

    // Update final output
    const finalSequence = tableData.map(row => row.bit).join(' ');
    document.getElementById('delta-final-output').textContent = finalSequence;
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
    const pcmFinal = document.getElementById('pcm-final-output');
    if (pcmFinal) pcmFinal.textContent = 'Run simulation to see final digital sequence';
}

function clearDeltaTable() {
    document.getElementById('delta-table-body').innerHTML = '<tr><td colspan="5" class="no-data">Run simulation to see data</td></tr>';
    const deltaFinal = document.getElementById('delta-final-output');
    if (deltaFinal) deltaFinal.textContent = 'Run simulation to see final digital sequence';
}

// ================== ANIMATION SYSTEM ==================

// Animation State
let animationState = {
    isPlaying: false,
    currentStep: 0,
    totalSteps: 0,
    speed: 1,
    mode: null, // 'pcm' or 'delta'
    data: null,
    timer: null,
    stepInfo: null
};

// Animation Steps Definition
const pcmSteps = [
    { name: 'Sampling', description: 'Analog signal is sampled at regular intervals. The sampling frequency determines how many samples are taken per second.', color: '#10b981' },
    { name: 'Quantization', description: 'Each sample value is mapped to the nearest quantization level. The step size depends on the number of bits used.', color: '#f59e0b' },
    { name: 'Encoding', description: 'Each quantized level is converted to its binary representation. These binary digits form the digital output.', color: '#ef4444' },
    { name: 'Complete PCM Signal', description: 'The final PCM digital signal (NRZ-L encoding) is ready for transmission.', color: '#3b82f6' }
];

const deltaSteps = [
    { name: 'Sampling', description: 'The input signal is sampled at each time interval.', color: '#10b981' },
    { name: 'Comparison', description: 'Compare current sample with staircase approximation. Decide whether to go UP or DOWN.', color: '#f59e0b' },
    { name: 'Staircase Update', description: 'Update staircase value by adding or subtracting the step size (Δ).', color: '#9c27b0' },
    { name: 'Bit Generation', description: 'Output 1 for UP step, 0 for DOWN step. This forms the delta modulated bitstream.', color: '#ef4444' }
];

// Initialize Animation System
document.addEventListener('DOMContentLoaded', function() {
    setupAnimationControls();
});

function setupAnimationControls() {
    // PCM Animation Button
    const pcmAnimateBtn = document.getElementById('pcm-animate');
    if (pcmAnimateBtn) {
        pcmAnimateBtn.addEventListener('click', () => startAnimation('pcm'));
    }
    
    // Delta Animation Button
    const deltaAnimateBtn = document.getElementById('delta-animate');
    if (deltaAnimateBtn) {
        deltaAnimateBtn.addEventListener('click', () => startAnimation('delta'));
    }
    
    // Modal Controls
    const closeBtn = document.getElementById('animation-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAnimationModal);
    }
    
    // Playback Controls
    document.getElementById('anim-first')?.addEventListener('click', goToFirst);
    document.getElementById('anim-prev')?.addEventListener('click', goToPrev);
    document.getElementById('anim-play-pause')?.addEventListener('click', togglePlayPause);
    document.getElementById('anim-next')?.addEventListener('click', goToNext);
    document.getElementById('anim-last')?.addEventListener('click', goToLast);
    document.getElementById('anim-reset')?.addEventListener('click', resetAnimation);
    
    // Speed Control
    const speedSlider = document.getElementById('anim-speed');
    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
            animationState.speed = parseFloat(e.target.value);
            document.getElementById('anim-speed-value').textContent = animationState.speed.toFixed(1) + 'x';
        });
    }
    
    // Close modal on background click
    const modal = document.getElementById('animation-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAnimationModal();
        });
    }
}

function startAnimation(mode) {
    animationState.mode = mode;
    animationState.currentStep = 0;
    animationState.isPlaying = false;
    
    // Generate data based on current parameters
    if (mode === 'pcm') {
        generatePCMAnimationData();
    } else {
        generateDeltaAnimationData();
    }
    
    // Setup modal
    const modal = document.getElementById('animation-modal');
    const title = document.getElementById('animation-title');
    
    title.textContent = mode === 'pcm' ? '🔬 PCM Animation' : '🔬 Delta Modulation Animation';
    modal.classList.add('active');
    
    // Initial render
    updateAnimationDisplay();
    
    // Start auto-play
    togglePlayPause();
}

function generatePCMAnimationData() {
    const signalType = document.getElementById('pcm-signal-type').value;
    const amplitude = parseFloat(document.getElementById('amplitude').value);
    const frequency = parseInt(document.getElementById('frequency').value);
    const samplingFreq = parseInt(document.getElementById('sampling-freq').value);
    const quantBits = parseInt(document.getElementById('quant-bits').value);
    
    const analogSignal = generateAnalogSignal(signalType, amplitude, frequency, 0.1, samplingFreq);
    const sampledSignal = sampleSignal(analogSignal, samplingFreq);
    const { quantizedSignal, tableData } = quantizeSignal(sampledSignal, quantBits, amplitude);
    const bitDuration = 1 / (samplingFreq * quantBits);
    const pcmWaveform = generatePCMWaveform(tableData, bitDuration);
    
    animationState.data = {
        analogSignal,
        sampledSignal,
        quantizedSignal,
        pcmWaveform,
        tableData,
        amplitude,
        quantBits
    };
    
    // Calculate total animation steps
    // Each sample gets: sampling, quantization, encoding
    animationState.totalSteps = sampledSignal.length * 3 + 1; // +1 for final view
    animationState.stepInfo = pcmSteps;
}

function generateDeltaAnimationData() {
    const signalType = document.getElementById('delta-signal-type').value;
    const amplitude = parseFloat(document.getElementById('delta-amplitude').value);
    const frequency = parseInt(document.getElementById('delta-frequency').value);
    const samplingFreq = parseInt(document.getElementById('delta-sampling-freq').value);
    const stepSize = parseFloat(document.getElementById('step-size').value);
    
    const analogSignal = generateAnalogSignal(signalType, amplitude, frequency, 0.1, samplingFreq);
    const sampledSignal = sampleSignal(analogSignal, samplingFreq);
    
    const staircaseSignal = [];
    const bitstream = [];
    const stepData = [];
    
    let staircaseValue = 0;
    
    sampledSignal.forEach((point, index) => {
        const prevStaircase = index > 0 ? staircaseSignal[index - 1].y : 0;
        const error = point.y - prevStaircase;
        const bit = error >= 0 ? 1 : 0;
        staircaseValue = prevStaircase + (bit === 1 ? stepSize : -stepSize);
        staircaseValue = Math.max(-amplitude, Math.min(amplitude, staircaseValue));
        
        staircaseSignal.push({ x: point.x, y: staircaseValue });
        bitstream.push({ x: point.x, y: bit });
        
        stepData.push({
            time: point.x,
            signalValue: point.y,
            prevStaircase,
            staircaseValue,
            bit,
            error,
            direction: bit === 1 ? 'Up' : 'Down'
        });
    });
    
    animationState.data = {
        analogSignal,
        sampledSignal,
        staircaseSignal,
        bitstream,
        stepData,
        stepSize,
        amplitude
    };
    
    animationState.totalSteps = sampledSignal.length * 4 + 1;
    animationState.stepInfo = deltaSteps;
}

function closeAnimationModal() {
    stopAnimation();
    document.getElementById('animation-modal').classList.remove('active');
}

function togglePlayPause() {
    const btn = document.getElementById('anim-play-pause');
    
    if (animationState.isPlaying) {
        stopAnimation();
        btn.textContent = '▶️';
        btn.title = 'Play';
    } else {
        startAutoPlay();
        btn.textContent = '⏸️';
        btn.title = 'Pause';
    }
}

function startAutoPlay() {
    animationState.isPlaying = true;
    const baseDelay = 1000; // 1 second per step at 1x speed
    
    function next() {
        if (!animationState.isPlaying) return;
        
        if (animationState.currentStep < animationState.totalSteps - 1) {
            animationState.currentStep++;
            updateAnimationDisplay();
            
            const delay = baseDelay / animationState.speed;
            animationState.timer = setTimeout(next, delay);
        } else {
            // Animation complete
            animationState.isPlaying = false;
            document.getElementById('anim-play-pause').textContent = '▶️';
        }
    }
    
    next();
}

function stopAnimation() {
    animationState.isPlaying = false;
    if (animationState.timer) {
        clearTimeout(animationState.timer);
        animationState.timer = null;
    }
}

function goToFirst() {
    stopAnimation();
    animationState.currentStep = 0;
    updateAnimationDisplay();
    updatePlayButton();
}

function goToPrev() {
    stopAnimation();
    if (animationState.currentStep > 0) {
        animationState.currentStep--;
        updateAnimationDisplay();
    }
    updatePlayButton();
}

function goToNext() {
    stopAnimation();
    if (animationState.currentStep < animationState.totalSteps - 1) {
        animationState.currentStep++;
        updateAnimationDisplay();
    }
    updatePlayButton();
}

function goToLast() {
    stopAnimation();
    animationState.currentStep = animationState.totalSteps - 1;
    updateAnimationDisplay();
    updatePlayButton();
}

function resetAnimation() {
    stopAnimation();
    animationState.currentStep = 0;
    animationState.speed = 1;
    document.getElementById('anim-speed').value = 1;
    document.getElementById('anim-speed-value').textContent = '1.0x';
    updateAnimationDisplay();
    updatePlayButton();
}

function updatePlayButton() {
    const btn = document.getElementById('anim-play-pause');
    btn.textContent = '▶️';
    btn.title = 'Play';
}

function updateAnimationDisplay() {
    const { mode, currentStep, totalSteps, data, stepInfo } = animationState;
    
    // Update progress bar
    const progress = ((currentStep + 1) / totalSteps) * 100;
    document.getElementById('animation-progress').style.setProperty('--progress', progress + '%');
    
    // Determine current phase
    let phaseIndex, stepInPhase, phaseName, explanation;
    
    if (mode === 'pcm') {
        const samplesPerPhase = Math.floor((totalSteps - 1) / 3);
        if (currentStep === totalSteps - 1) {
            phaseIndex = 3;
            phaseName = stepInfo[3].name;
            explanation = stepInfo[3].description;
        } else {
            phaseIndex = Math.floor(currentStep / samplesPerPhase);
            stepInPhase = currentStep % samplesPerPhase;
            phaseName = stepInfo[phaseIndex]?.name || 'Complete';
            explanation = stepInfo[phaseIndex]?.description || 'Animation complete!';
        }
    } else {
        const samplesPerPhase = Math.floor((totalSteps - 1) / 4);
        if (currentStep === totalSteps - 1) {
            phaseIndex = 4;
            phaseName = 'Complete';
            explanation = 'Delta modulation process complete! The staircase approximation tracks the original signal.';
        } else {
            phaseIndex = Math.floor(currentStep / samplesPerPhase);
            stepInPhase = currentStep % samplesPerPhase;
            phaseName = stepInfo[phaseIndex]?.name || 'Complete';
            explanation = stepInfo[phaseIndex]?.description || 'Animation complete!';
        }
    }
    
    document.getElementById('step-indicator').textContent = `Step ${currentStep + 1} of ${totalSteps}: ${phaseName}`;
    document.getElementById('explanation-title').textContent = phaseName;
    document.getElementById('explanation-text').textContent = explanation;
    
    // Render animation
    const canvas = document.getElementById('animation-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    if (mode === 'pcm') {
        renderPCMAnimation(ctx, canvas, currentStep, phaseIndex, stepInPhase);
    } else {
        renderDeltaAnimation(ctx, canvas, currentStep, phaseIndex, stepInPhase);
    }
    
    // Update data display
    updateDataDisplay(mode, currentStep, phaseIndex, stepInPhase);
}

function renderPCMAnimation(ctx, canvas, currentStep, phaseIndex, stepInPhase) {
    const { analogSignal, sampledSignal, quantizedSignal, pcmWaveform, tableData } = animationState.data;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 40;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    // Draw grid
    drawGrid(ctx, padding, width, height);
    
    // Calculate scales
    const maxX = analogSignal[analogSignal.length - 1]?.x || 1;
    const minY = Math.min(...analogSignal.map(d => d.y));
    const maxY = Math.max(...analogSignal.map(d => d.y));
    const yRange = maxY - minY || 1;
    
    // Always show analog signal as background
    drawSignalPath(ctx, analogSignal, padding, width, height, maxX, minY, yRange, 'rgba(59, 130, 246, 0.3)', 2);
    
    if (phaseIndex >= 0) {
        // Show samples up to current point
        const maxSampleIndex = phaseIndex === 0 ? Math.min(stepInPhase + 1, sampledSignal.length) : sampledSignal.length;
        const visibleSamples = sampledSignal.slice(0, maxSampleIndex);
        drawScatterPoints(ctx, visibleSamples, padding, width, height, maxX, minY, yRange, '#10b981', 6);
        
        // Highlight current sample
        if (phaseIndex === 0 && stepInPhase < sampledSignal.length) {
            const currentSample = sampledSignal[stepInPhase];
            if (currentSample) {
                const x = padding + (currentSample.x / maxX) * width;
                const y = padding + (1 - (currentSample.y - minY) / yRange) * height;
                drawHighlight(ctx, x, y, '#ffeb3b');
                
                // Update label
                document.getElementById('animation-label').textContent = 
                    `Sampling: t=${currentSample.x.toFixed(3)}s, value=${currentSample.y.toFixed(3)}V`;
            }
        }
    }
    
    if (phaseIndex >= 1) {
        // Show quantized signal
        const maxQuantIndex = phaseIndex === 1 ? Math.min(stepInPhase + 1, quantizedSignal.length) : quantizedSignal.length;
        const visibleQuantized = quantizedSignal.slice(0, maxQuantIndex);
        drawStepPath(ctx, visibleQuantized, padding, width, height, maxX, minY, yRange, '#f59e0b', 3);
        
        if (phaseIndex === 1 && stepInPhase < quantizedSignal.length) {
            const currentQuant = quantizedSignal[stepInPhase];
            const currentTableRow = tableData[stepInPhase];
            if (currentQuant && currentTableRow) {
                const x = padding + (currentQuant.x / maxX) * width;
                const y = padding + (1 - (currentQuant.y - minY) / yRange) * height;
                drawHighlight(ctx, x, y, '#ff9800');
                
                document.getElementById('animation-label').textContent = 
                    `Quantization: Level ${currentTableRow.quantizationLevel}, Value ${currentQuant.y.toFixed(3)}V`;
            }
        }
    }
    
    if (phaseIndex >= 2 || currentStep === animationState.totalSteps - 1) {
        // Show PCM waveform
        drawDigitalWaveform(ctx, pcmWaveform, padding, width, height, maxX, '#ef4444', 2);
        
        if (phaseIndex === 2 && stepInPhase < tableData.length) {
            const currentTableRow = tableData[stepInPhase];
            if (currentTableRow) {
                document.getElementById('animation-label').textContent = 
                    `Encoding: Binary ${currentTableRow.binaryCode} (${currentTableRow.quantizationLevel})`;
            }
        }
    }
    
    if (currentStep === animationState.totalSteps - 1) {
        document.getElementById('animation-label').textContent = 'PCM Complete! Ready for transmission.';
    }
}

function renderDeltaAnimation(ctx, canvas, currentStep, phaseIndex, stepInPhase) {
    const { analogSignal, sampledSignal, staircaseSignal, bitstream, stepData } = animationState.data;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const padding = 40;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    // Draw grid
    drawGrid(ctx, padding, width, height);
    
    // Calculate scales
    const maxX = analogSignal[analogSignal.length - 1]?.x || 1;
    const minY = Math.min(...analogSignal.map(d => d.y));
    const maxY = Math.max(...analogSignal.map(d => d.y));
    const yRange = maxY - minY || 1;
    
    // Always show analog signal
    drawSignalPath(ctx, analogSignal, padding, width, height, maxX, minY, yRange, 'rgba(59, 130, 246, 0.4)', 2);
    
    if (phaseIndex >= 0) {
        // Show current sample point
        const maxSampleIndex = Math.min(stepInPhase + 1, sampledSignal.length);
        const visibleSamples = sampledSignal.slice(0, maxSampleIndex);
        drawScatterPoints(ctx, visibleSamples, padding, width, height, maxX, minY, yRange, '#10b981', 6);
        
        if (phaseIndex === 0 && stepInPhase < sampledSignal.length) {
            const currentSample = sampledSignal[stepInPhase];
            if (currentSample) {
                const x = padding + (currentSample.x / maxX) * width;
                const y = padding + (1 - (currentSample.y - minY) / yRange) * height;
                drawHighlight(ctx, x, y, '#ffeb3b');
                document.getElementById('animation-label').textContent = 
                    `Sample: t=${currentSample.x.toFixed(3)}s, value=${currentSample.y.toFixed(3)}V`;
            }
        }
    }
    
    if (phaseIndex >= 1 || (phaseIndex === 0 && stepInPhase > 0)) {
        // Show staircase
        const maxStairIndex = phaseIndex === 1 ? Math.min(stepInPhase + 1, staircaseSignal.length) : 
                              phaseIndex > 1 ? staircaseSignal.length : stepInPhase;
        const visibleStaircase = staircaseSignal.slice(0, maxStairIndex);
        
        if (visibleStaircase.length > 0) {
            drawStepPath(ctx, visibleStaircase, padding, width, height, maxX, minY, yRange, '#9c27b0', 3);
        }
        
        // Highlight current comparison
        if (stepInPhase < stepData.length) {
            const currentStepData = stepData[stepInPhase];
            if (currentStepData) {
                const x = padding + (currentStepData.time / maxX) * width;
                const signalY = padding + (1 - (currentStepData.signalValue - minY) / yRange) * height;
                const stairY = padding + (1 - (currentStepData.prevStaircase - minY) / yRange) * height;
                
                // Draw comparison line
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(x, signalY);
                ctx.lineTo(x, stairY);
                ctx.stroke();
                ctx.setLineDash([]);
                
                if (phaseIndex === 1) {
                    const decision = currentStepData.error >= 0 ? 'UP' : 'DOWN';
                    const color = currentStepData.error >= 0 ? '#00e676' : '#ff5722';
                    drawHighlight(ctx, x, signalY, color);
                    
                    document.getElementById('animation-label').textContent = 
                        `Compare: Signal ${currentStepData.signalValue.toFixed(3)}V vs Staircase ${currentStepData.prevStaircase.toFixed(3)}V → ${decision}`;
                }
            }
        }
    }
    
    if (phaseIndex >= 3 || currentStep === animationState.totalSteps - 1) {
        // Show bitstream visualization
        if (stepInPhase < bitstream.length) {
            const bitValue = bitstream[stepInPhase].y;
            const bitText = bitValue === 1 ? '1 (UP)' : '0 (DOWN)';
            const bitColor = bitValue === 1 ? '#00e676' : '#ff5722';
            
            document.getElementById('animation-label').textContent = `Output Bit: ${bitText}`;
            document.getElementById('animation-label').style.background = bitColor === 1 ? 
                'rgba(0, 230, 118, 0.3)' : 'rgba(255, 87, 34, 0.3)';
        }
    }
    
    if (currentStep === animationState.totalSteps - 1) {
        document.getElementById('animation-label').textContent = 'Delta Modulation Complete!';
        // Show all bits as binary string
        const bitString = bitstream.map(b => b.y).join('');
        document.getElementById('explanation-text').textContent += `\nBitstream: ${bitString.substring(0, 20)}...`;
    }
}

function drawGrid(ctx, padding, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * height;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + width, y);
        ctx.stroke();
    }
    
    // Vertical lines
    for (let i = 0; i <= 5; i++) {
        const x = padding + (i / 5) * width;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + height);
        ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding + height);
    ctx.lineTo(padding + width, padding + height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + height);
    ctx.stroke();
}

function drawSignalPath(ctx, data, padding, width, height, maxX, minY, yRange, color, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    
    data.forEach((point, index) => {
        const x = padding + (point.x / maxX) * width;
        const y = padding + (1 - (point.y - minY) / yRange) * height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function drawScatterPoints(ctx, data, padding, width, height, maxX, minY, yRange, color, radius) {
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    
    data.forEach(point => {
        const x = padding + (point.x / maxX) * width;
        const y = padding + (1 - (point.y - minY) / yRange) * height;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    ctx.shadowBlur = 0;
}

function drawStepPath(ctx, data, padding, width, height, maxX, minY, yRange, color, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    
    data.forEach((point, index) => {
        if (index === 0) return;
        
        const prev = data[index - 1];
        const prevX = padding + (prev.x / maxX) * width;
        const prevY = padding + (1 - (prev.y - minY) / yRange) * height;
        const x = padding + (point.x / maxX) * width;
        const y = padding + (1 - (point.y - minY) / yRange) * height;
        
        // Horizontal
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, prevY);
        ctx.stroke();
        
        // Vertical
        ctx.beginPath();
        ctx.moveTo(x, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
    });
    
    ctx.shadowBlur = 0;
}

function drawDigitalWaveform(ctx, data, padding, width, height, maxX, color, lineWidth) {
    const bitHeight = height / 4;
    const baseY = padding + height - bitHeight;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    
    data.forEach((point, index) => {
        const x = padding + (point.x / maxX) * width;
        const y = baseY - point.y * bitHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            const prevX = padding + (data[index - 1].x / maxX) * width;
            ctx.lineTo(prevX, y);
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function drawHighlight(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Outer ring
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function updateDataDisplay(mode, currentStep, phaseIndex, stepInPhase) {
    const timeEl = document.getElementById('anim-time');
    const valueEl = document.getElementById('anim-value');
    const levelEl = document.getElementById('anim-level');
    const binaryEl = document.getElementById('anim-binary');
    
    if (mode === 'pcm') {
        const { sampledSignal, tableData } = animationState.data;
        if (stepInPhase < tableData.length) {
            const row = tableData[stepInPhase];
            timeEl.textContent = row.time.toFixed(4) + 's';
            valueEl.textContent = row.sampleValue + 'V';
            levelEl.textContent = row.quantizationLevel;
            binaryEl.textContent = row.binaryCode;
        }
    } else {
        const { stepData } = animationState.data;
        if (stepInPhase < stepData.length) {
            const row = stepData[stepInPhase];
            timeEl.textContent = row.time.toFixed(4) + 's';
            valueEl.textContent = row.signalValue.toFixed(3) + 'V';
            levelEl.textContent = row.direction;
            binaryEl.textContent = row.bit;
        }
    }
}
