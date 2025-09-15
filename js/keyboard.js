class KeyboardHandler {
    constructor(game) {
        this.game = game;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener("keydown", (e) =>
            this.handlePhysicaleKeyPress(e)
        );

        document.querySelectorAll(".key").forEach((key) => {
            key.addEventListener("click", (e) => this.handleVirtualKeyPress(e));
        });
    }

    handlePhysicaleKeyPress(event) {
        const key = event.key;

        if (this.isGameKey(key)) {
            event.preventDefault();
        }

        const standardizedKey = this.standardizeKey(key);

        if (standardizedKey) {
            this.processKeyInput(standardizedKey);
        }
    }

    handleVirtualKeyPress(event) {
        const keyElement = event.target.closest(".key");
        if (!keyElement) return;

        const key = keyElement.dataset.key;

        this.animateKeyPress(keyElement);

        this.processKeyInput(keyElement);
    }

    isGameKey(key) {
        return (
            /^[a-zA-Z]$/.test(key) ||
            key === "Enter" ||
            key === "Backspace" ||
            key === "Delete"
        );
    }

    standardizeKey(key) {
        if (/^[a-zA-Z]$/.test(key)) {
            return key.toUpperCase();
        }

        switch (key) {
            case "Enter":
                return "Enter";
            case "Backspace":
            case "Delete":
                return "Backspace";
            default:
                return null;
        }
    }

    processKeyInput(key) {
        if (!this.game) return;

        switch (key) {
            case "Enter":
                this.game.submitGuess();
                break;
            case "Backspace":
                this.game.removeLetter();
                break;
            default:
                if (/^[A-Z]$/.test(key)) {
                    this.game.addLetter(key);
                }
                break;
        }
    }

    animateKeyPress(keyElement) {
        keyElement.style.transform = "scale(0.95)";
        keyElement.style.transition = "transform 0.1s ease";

        setTimeout(() => {
            keyElement.style.transform = "";
            keyElement.style.transition = "";
        }, 100);
    }

    updateKeyStatus(letter, status) {
        const keyElement = document.querySelector(
            `.key[data-key='${letter.toUpperCase()}']`
        );
        if (!keyElement) return;

        keyElement.classList.remove("correct", "present", "absent");

        const currentStatus = this.getKeyCurrentStatus(keyElement);

        if (this.shouldUpdateKeyStatus(currentStatus, status)) {
            keyElement.classList.add(status);
        }
    }

    getKeyCurrentStatus(keyElement) {
        if (keyElement.classList.contains("correct")) return "correct";
        if (keyElement.classList.contains("present")) return "present";
        if (keyElement.classList.contains("absent")) return null;
    }

    shouldUpdateKeyStatus(currentStatus, newStatus) {
        const statusPriority = {
            correct: 3,
            present: 2,
            absent: 1,
        };

        const currentPriority = statusPriority[currentStatus] || 0;
        const newPriority = statusPriority[newStatus] || 0;

        return newPriority > currentPriority;
    }

    resetKeyboard() {
        document.querySelectorAll(".key").forEach((key) => {
            key.classList.remove("correct", "present", "absent");
        });
    }

    setEnabled(enabled) {
        const keys = document.querySelectorAll(".key");
        keys.forEach((key) => {
            if (enabled) {
                key.style.pointerEvents = "";
                key.style.opacity = "";
            } else {
                key.style.pointerEvents = "none";
                key.style.opacity = "0.6";
            }
        });
    }

    getKeyboardState() {
        const state = {};
        document.querySelectorAll(".key[data-key]").forEach((key) => {
            const letter = key.dataset.key;
            if (/^[A-Z]$/.test(letter)) {
                state[letter] = this.getKeyCurrentStatus(key);
            }
        });

        return state;
    }

    setKeyboardState(state) {
        this.resetKayboard();
        Object.entries(state).forEach(([letter, status]) => {
            if (status) {
                this.updateKeyStatus(letter, status);
            }
        });
    }

    cleanup() {
        document.removeEventListener("keydown", this.handlePhysicaleKeyPress);
        document.querySelectorAll(".key").forEach((key) => {
            key.removeEventListener("click", this.handleVirtualKeyPress);
        });
    }
}

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
            case "n":
                event.preventDefault();
                if (window.app && window.app.currentLevel) {
                    window.app.startGame(window.app.currentLevel);
                }
                break;
            case "h":
                event.preventDefault();
                if (window.app) {
                    window.app.showHint();
                }
                break;
            case "/":
                event.preventDefault();
                if (window.app) {
                    window.app.toggleInstructions();
                }
                break;
        }
    }

    if (event === "Escape") {
        const openModals = document.querySelectorAll(".modal:note(.hidden");
        if (openModals.length > 0) {
            openModals.forEach((modal) => modal.classList("hidden"));
        } else if (
            window.app &&
            document.getElementById("game-screen").classList.contains("active")
        ) {
            window.app.showHomeScreen();
        }
    }
});

let lastTouchEnd = 0;
document.addEventListener(
    "touchend",
    (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    },
    false
);

if ("visualViewport" in window) {
    window.visualViewport.addEventListener("resize", () => {
        const keyboardVisible = window.visualViewport < window.innerHeight;
        document.body.classList.toggle("keyboard-visible", keyboardVisible);
    });
}
