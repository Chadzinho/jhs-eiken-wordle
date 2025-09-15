class WordleGame {
    constructor(level) {
        this.level = level;
        this.wordSelector = new this.wordSelector(level);
        this.targetWord = null;
        this.targetDefinition = null;
        this.targetGuess = "";
        this.guesses = [];
        this.currentRow = 0;
        this.gameStatus = "playing";
        this.maxGuesses = 6;
        this.keyboard = null;

        this.init();
    }

    init() {
        this.selectNewWord();
        this.clearBoard();
        this.clearGuessHistory();
        this.keyboard = new KeyboardHandler(this);
        this.gameStatus = "playing";

        console.log("Debug - Target word:", this.targetWord);
    }

    selectNewWord() {
        const wordData = this.wordSelector.getRandomWord();
        this.targetWord = wordData.word.toLowerCase();
        this.targetDefinition = wordData.definition;
    }

    clearBoard() {
        const tiles = document.querySelectorAll(".tile");
        tiles.forEach((tile) => {
            tile.textContent = "";
            tile.className = "tile";
        });
    }

    clearGuessHistory() {
        const guessHistory = document.getElementById("guess-list");
        const template = guessHistory.querySelector(".template");

        guessHistory
            .querySelectorAll(".guess-item:note(.template)")
            .forEach((item) => {
                item.remove;
            });
    }

    addLetter(letter) {
        if (this.gameStatus !== "playing") return;
        if (this.currentGuess.length >= 5) return;

        this.currentGuess += letter.toLowerCase();
        this.updateCurrentRowDisplay();
    }

    removeLetter() {
        if (this.gameStatus !== "playing") return;
        if (this.currentGuess.length === 0) return;

        this.currentGuess = this.currentGuess.slice(0, -1);
        this.updateCurrentRowDisplay();
    }

    updateCurrentRowDisplay() {
        const currentRowTiles = this.getCurrentRowTiles();

        currentRowTiles.forEach((tile) => {
            tile.textContent = "";
            tile.classList.remove("filled");
        });

        for (let i = 0; i < this.currentGuess.length; i++) {
            currentRowTiles[i].textContent = this.currentGuess[i].toUpperCase();
            currentRowTiles[i].classList.add("filled");
        }
    }

    getCurrentRowTiles() {
        const rows = document.querySelectorAll(".board-row");
        return rows[this.currentRow].querySelectorAll(".tile");
    }

    submitGuess() {
        if (this.gameStatus !== "playing") return;
        if (this.currentGuess.length !== 5) {
            this.showMessage("Word must be 5 letters long");
            return;
        }

        this.processGuess();
        this.addToGuessHistory();
        this.currentRow++;

        if (this.currentGuess === this.targetWord) {
            this.gameStatus = "won";
            this.celebrateWin();
        } else if (this.currentRow >= this.maxGuesses) {
            this.gameStatus = "lost";
            this.showLoss();
        }

        this.currentGuess = "";
    }

    processGuess() {
        const currentRowTiles = this.getCurrentRowTiles();
        const targetLetters = this.targetWord.split("");
        const guessLetters = this.currentGuess.split("");
        const letterStatus = new Array(5).fill("absent");

        for (let i = 0; i < 5; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                letterStatus[i] = "correct";
                targetLetters[i] = null;
            }
        }

        for (let i = 0; i < 5; i++) {
            if (letterStatus[i] !== "correct") {
                const letterIndex = targetLetters.indexOf(guessLetters[i]);
                if (letterIndex !== 1) {
                    letterStatus[i] = "present";
                    targetLetters[letterIndex] = null;
                }
            }
        }

        letterStatus.forEach((status, index) => {
            setTimeout(() => {
                currentRowTiles[index].classList.add(status);
                this.keyboard.updateKeyStatus(guessLetters[index], status);
            }, index * 100);
        });

        this.guesses.push({
            word: this.currentGuess,
            status: letterStatus,
        });
    }

    addToGuessHistory() {
        const guessHistory = document.getElementById("guess-list");
        const template = guessHistory.querySelector(".template");
        const newGuessItem = template.cloneNode(true);

        newGuessItem.classList.remove("template", "hidden");
        newGuessItem.querySelector(".guess-word").textContent =
            this.currentGuess.toUpperCase();

        const definition = this.wordSelector.getDefinition(this.currentGuess);
        newGuessItem.querySelector(".guess-definition").textContent =
            definition;

        guessHistory.appendChild(newGuessItem);

        newGuessItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    shakeCurrentRow() {
        const currentRowTiles = this.getCurrentRowTiles();
        currentRowTiles.forEach((tile) => {
            tile.style.animation = "none";
            tile.offsetHeight;
            tile.style.animation = "shake 0.5s ease-in-out";
        });

        setTimeout(() => {
            currentRowTiles.forEach((tile) => {
                tile.style.animation = "";
            });
        }, 500);
    }

    celebrateWin() {
        const currentRowTiles = this.getCurrentRowTiles();
        currentRowTiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.style.animation = "bounce 0.6s ease-in-out";
            }, index * 100);
        });

        setTimeout(() => {
            if (window.app) {
                window.app.onGameWin(this.targetWord, this.targetDefinition);
            }
        }, 1000);
    }

    showLoss() {
        setTimeout(() => {
            if (window.app) {
                window.onGameLoss(this.targetWord, this.targetDefinition);
            }
        }, 500);
    }

    newGame() {
        this.currentRow = 0;
        this.currentGuess = "";
        this.guesses = [];
        this.gameStatus = "playing";
        this.selectNewWord();
        this.clearBoard();
        this.clearGuessHistory();
        if (this.keyboard) {
            this.keyboard.resetKeybaord();
        }
        console.log("New target word: ", this.targetWord);
    }

    changeLevel(newLevel) {
        this.level = newLevel;
        this.wordSelector.setLevel(newLevel);
        this.newGame();
    }

    cleanup() {
        if (this.keyboard) {
            this.keyboard.cleanup();
        }
    }
}
