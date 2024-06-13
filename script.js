document.addEventListener('DOMContentLoaded', () => {
    const clockContainer = document.getElementById('clock-container');
    const clock = document.getElementById('clock');
    const dateDisplay = document.getElementById('date');
    const prayerTimesDisplay = document.getElementById('prayer-times');
    const settingsButton = document.getElementById('settings-button');
    const settingsPanel = document.getElementById('settings-panel');
    const bgColorInput = document.getElementById('bg-color');
    const textColorInput = document.getElementById('text-color');
    const fontSelect = document.getElementById('font-select');
    const textSizeInput = document.getElementById('text-size');
    const timeFormatSelect = document.getElementById('time-format');
    const showDateCheckbox = document.getElementById('show-date');
    const showPrayerTimesCheckbox = document.getElementById('show-prayer-times');
    const autoColorIntervalSelect = document.getElementById('auto-color-interval');
    const customIntervalInput = document.getElementById('custom-interval');
    const applySettingsButton = document.getElementById('apply-settings');

    let isSettingsOpen = false;
    let autoColorChange = false;
    let autoColorInterval;

    settingsButton.addEventListener('click', toggleSettings);
    document.addEventListener('keydown', (e) => {
        if (e.key === 's') {
            toggleSettings();
        } else if (e.key === 'Enter' && isSettingsOpen) {
            applySettings();
        }
    });

    bgColorInput.addEventListener('input', updateSettings);
    textColorInput.addEventListener('input', updateSettings);
    fontSelect.addEventListener('input', updateSettings);
    textSizeInput.addEventListener('input', updateSettings);
    timeFormatSelect.addEventListener('input', updateSettings);
    showDateCheckbox.addEventListener('input', updateSettings);
    showPrayerTimesCheckbox.addEventListener('input', updateSettings);
    autoColorIntervalSelect.addEventListener('input', handleAutoColorInterval);
    customIntervalInput.addEventListener('input', updateSettings);
    applySettingsButton.addEventListener('click', applySettings);

    function toggleSettings() {
        isSettingsOpen = !isSettingsOpen;
        settingsPanel.classList.toggle('open', isSettingsOpen);
        clockContainer.style.filter = isSettingsOpen ? 'blur(5px)' : 'none';
    }

    function applySettings() {
        toggleSettings();
        saveSettings();
    }

    function updateSettings() {
        document.body.style.backgroundColor = bgColorInput.value || "#000";
        clock.style.color = textColorInput.value || "#fff";
        clock.style.fontFamily = fontSelect.value;
        clock.style.fontSize = `${textSizeInput.value}vw`;

        if (showDateCheckbox.checked) {
            dateDisplay.style.display = 'block';
            dateDisplay.textContent = new Date().toLocaleDateString();
        } else {
            dateDisplay.style.display = 'none';
        }

        if (showPrayerTimesCheckbox.checked) {
            prayerTimesDisplay.style.display = 'block';
            // Placeholder for prayer times. Replace with actual times as needed.
            prayerTimesDisplay.textContent = 'Prayer: 09:00, 23:00, 36:50, 39:00, 41:00';
        } else {
            prayerTimesDisplay.style.display = 'none';
        }

        saveSettings();
    }

    function handleAutoColorInterval() {
        const value = autoColorIntervalSelect.value;
        if (value === 'custom') {
            customIntervalInput.style.display = 'block';
        } else {
            customIntervalInput.style.display = 'none';
            autoColorChange = true;
            startAutoColorChange();
        }
        saveSettings();
    }

    function startAutoColorChange() {
        stopAutoColorChange();
        const interval = autoColorIntervalSelect.value === 'custom' ? customIntervalInput.value : autoColorIntervalSelect.value;
        autoColorInterval = setInterval(() => {
            const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
            document.body.style.backgroundColor = randomColor();
            clock.style.color = randomColor();
        }, interval);
    }

    function stopAutoColorChange() {
        clearInterval(autoColorInterval);
    }

    function saveSettings() {
        const settings = {
            bgColor: bgColorInput.value,
            textColor: textColorInput.value,
            font: fontSelect.value,
            textSize: textSizeInput.value,
            timeFormat: timeFormatSelect.value,
            showDate: showDateCheckbox.checked,
            showPrayerTimes: showPrayerTimesCheckbox.checked,
            autoColorInterval: autoColorIntervalSelect.value,
            customInterval: customIntervalInput.value
        };
        localStorage.setItem('clockSettings', JSON.stringify(settings));
    }

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('clockSettings'));
        if (settings) {
            bgColorInput.value = settings.bgColor;
            textColorInput.value = settings.textColor;
            fontSelect.value = settings.font;
            textSizeInput.value = settings.textSize;
            timeFormatSelect.value = settings.timeFormat;
            showDateCheckbox.checked = settings.showDate;
            showPrayerTimesCheckbox.checked = settings.showPrayerTimes;
            autoColorIntervalSelect.value = settings.autoColorInterval;
            customIntervalInput.value = settings.customInterval;

            updateSettings();
            if (settings.autoColorInterval !== 'custom') {
                startAutoColorChange();
            }
        }
    }

    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds() * 2;

        // Adjust for 48-hour format
        hours = (hours % 24) * 2 + Math.floor(minutes / 30);
        minutes = (minutes % 30) * 2 + Math.floor(seconds / 60);
        seconds = seconds % 60;

        if (timeFormatSelect.value === '24-hour') {
            hours = hours % 24;
        } else if (timeFormatSelect.value === 'am-pm') {
            hours = hours % 12 || 12;
        }

        clock.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        requestAnimationFrame(updateClock);
    }

    loadSettings();
    updateClock();
});
