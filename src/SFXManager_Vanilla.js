/**
 * SFX Manager (Vanilla JS version)
 * Integrated directly into index.html for the CODIFY Studio dashboard.
 */
const SFXManager_Vanilla = {
    sounds: {
        btn_click_1: new Audio('src/audio/btn_click_1.mp3'),
        btn_click_2: new Audio('src/audio/btn_click_2.mp3'),
        btn_toggle: new Audio('src/audio/btn_toggle.mp3'),
        hover_soft_1: new Audio('src/audio/hover_soft_1.mp3'),
        hover_soft_2: new Audio('src/audio/hover_soft_2.mp3'),
        success_ping_1: new Audio('src/audio/success_ping_1.mp3'),
        success_ping_2: new Audio('src/audio/success_ping_2.mp3'),
        error_buzz_1: new Audio('src/audio/error_buzz_1.mp3'),
        ambient_background: new Audio('src/audio/ambient_background.mp3')
    },

    isMuted: false,
    globalVolume: 0.2,

    init: function() {
        // Setup initial volumes
        Object.keys(this.sounds).forEach(key => {
            const audio = this.sounds[key];
            if (key === 'ambient_background') {
                audio.volume = 0.08;
                audio.loop = true;
                // Note: Most browsers block autoplay without user interaction.
                // We'll try to play it on first interaction.
            } else {
                audio.volume = this.globalVolume;
            }
        });

        // Event listener to start ambient on first interaction if blocked
        window.addEventListener('click', () => {
            if (this.sounds.ambient_background.paused && !this.isMuted) {
                this.sounds.ambient_background.play().catch(() => {});
            }
        }, { once: true });
    },

    play: function(soundName, volume = null) {
        if (this.isMuted) return;

        let sound;
        
        // Random choices logic
        if (soundName === 'btn_click') {
            sound = Math.random() > 0.5 ? this.sounds.btn_click_1 : this.sounds.btn_click_2;
        } else if (soundName === 'hover') {
            sound = Math.random() > 0.5 ? this.sounds.hover_soft_1 : this.sounds.hover_soft_2;
        } else if (soundName === 'success') {
            sound = Math.random() > 0.5 ? this.sounds.success_ping_1 : this.sounds.success_ping_2;
        } else if (soundName === 'btn_toggle') {
            sound = this.sounds.btn_toggle;
        } else if (soundName === 'error') {
            sound = this.sounds.error_buzz_1;
        } else {
            sound = this.sounds[soundName];
        }

        if (sound) {
            sound.currentTime = 0;
            if (volume !== null) sound.volume = volume;
            sound.play().catch(err => console.error("SFX Play Error:", err));
        }
    },

    toggleMute: function() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.sounds.ambient_background.pause();
        } else {
            this.sounds.ambient_background.play().catch(() => {});
        }
        return this.isMuted;
    },

    setVolume: function(vol) {
        this.globalVolume = vol;
        Object.keys(this.sounds).forEach(key => {
            if (key !== 'ambient_background') {
                this.sounds[key].volume = vol;
            }
        });
    }
};

// Initialize SFX
SFXManager_Vanilla.init();
