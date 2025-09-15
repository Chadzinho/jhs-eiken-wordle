class WordleApp {
    constructor() {
        this.currentLevel = null;
        this.game = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showHomeScreen();
    }

    setupEventListeners() {
        document.querySelectorAll(".level-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const level = e.target.dataset.level;
                this.startGame(level);
            });
        });

        document.getElementById("home-btn")?.addEventListener("click", () => {
            this.showHomeScreen();
        });

        document.getElementById("new-btn")?.addEventListener("click", () => {
            if (this.currentLevel) {
                this.startGame(this.currentLevel);
            }
        });

        document.getElementById("howto-btn")?.addEventListener("click", () => {
            this.toggleInstructions();
        });

        document.getElementById("hint-btn")?.addEventListener("click", () => {
            this.showHint();
        });

        this.setupModalButtons();
    }

    setupModalButtons() {
        document
            .getElementById("win-home-btn")
            ?.addEventListener("click", () => {
                this.hideModal("win-modal");
                this.showHomeScreen();
            });

        document
            .getElementById("win-newgame-btn")
            ?.addEventListener("click", () => {
                this.hideModal("win-modal");
                this.startGame(this.currentLevel);
            });

        const lossModal = document.getElementById("loss-modal");
        const lossHomeBtn = lossModal?.querySelector(".btn-secondary");
        const lossNewGameBtn = lossModal?.querySelector(".btn-primary");

        lossHomeBtn?.addEventListener("click", () => {
            this.hideModal("loss-modal");
            this.showHomeScreen;
        });

        lossNewGameBtn?.addEventListener("click", () => {
            this.hideModal("loss-modal");
            this.startGame(this.currentLevel);
        });
    }

    startGame(level) {
        this.currentLevel = level;
        this.showGameScreen();

        if (this.game) {
            this.game.cleanup();
        }

        this.game = new WordleGame(level);
        this.updateNavTitle(level);
    }

    showHomeScreen() {
        this.hideAllScreens();
        document.getElementById("home-screen").classList.remove("hidden");
        document.getElementById("home-screen").classList.add("active");
    }

    showGameScreen() {
        this.hideAllScreens();
        document.getElementById("game-screen").classList.remove("hidden");
        document.getElementById("game-screen").classList.add("active");
    }

    hideAllScreens() {
        document.querySelectorAll(".screen").forEach((screen) => {
            screen.classList.add("hidden");
            screen.classList.remove("active");
        });
    }

    updateNavTitle(level) {
        const navTitle = document.querySelector(".nav-center h1");
        const levelNames = {
            jhs1: "JHS Year 1",
            jhs2: "JHS Year 2",
            jhs3: "JHS Year 3",
            eiken5: "Eiken 5",
            eiken4: "Eiken 4",
            eiken3: "Eiken 3",
            "eiken-pre2": "Eiken Pre-2",
            eiken2: "Eiken 2",
            "eiken-pre1": "Eiken Pre-1",
            eiken1: "Eiken 1",
        };

        if (navTitle && levelNames[level]) {
            navTitle.textContent = `${levelNames[level]} Wordle`;
        }
    }

    toggleInstructions() {
        const sidebar = document.querySelector(".instructions-sidebar");
        const content = document.querySelector(".sidebar-content");

        if (sidebar.classList.contains("hidden")) {
            sidebar.classList.remove("hidden");
            content.classList.remove("hidden");
        } else {
            sidebar.classList.add("hidden");
            content.classList.add("hidden");
        }
    }

    //showHint () {}
    // add hints once the game is working properly

    showModal(modalId, data = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (data.word) {
            const wordEl = modal.querySelector(".result-word span:first-child");
            const defEl = modal.querySelector(".result-word span:last-child");
            if (wordEl) wordEl.textcontent = data.word.toUpperCase();
            if (defEl) defEl.textContent = data.definition || "";
        }

        modal.classList.remove("hidden");
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add("hidden");
        }
    }

    onGameWin(word, definition) {
        setTimeout(() => {
            this.showModal("win-modal", { word, definition });
        }, 1500);
    }

    onGameLoss(word, definition) {
        setTimeout(() => {
            this.showModal("loss-modal", { word, definition });
        }, 1500);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.app = new WordleApp();
});
