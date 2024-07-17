import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getDatabase, ref, set, get, query, orderByChild, limitToFirst, push } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyBIZpus3mIVgSKMW5a7HjYPdnMMq4Xn6jI",
    authDomain: "memory-game-x.firebaseapp.com",
    projectId: "memory-game-x",
    storageBucket: "memory-game-x.appspot.com",
    messagingSenderId: "395880299612",
    appId: "1:395880299612:web:ea298a813d61d4b58cfa99",
    measurementId: "G-LLYFFHFJB6",
    databaseURL: "https://memory-game-x-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const LEVEL_TIMES = {
    easy: 60 * 1000,
    medium: 120 * 1000,
    hard: 180 * 1000
};

const IMAGES = {
    colour: Array.from({ length: 12 }, (_, i) => `images/colours/colour${i + 1}.webp`),
    animal: Array.from({ length: 12 }, (_, i) => `images/animals/animal${i + 1}.webp`),
    tech: Array.from({ length: 12 }, (_, i) => `images/logos/logo${i + 1}.webp`),
    coding: Array.from({ length: 12 }, (_, i) => ({
        open: `images/codes/code${i + 1}_o.webp`,
        close: `images/codes/code${i + 1}_c.webp`
    }))
};

const userList = JSON.parse(localStorage.getItem('userList') || '[]');
populateUserDropdown();

function populateUserDropdown() {
    const userDropdown = document.getElementById('user-dropdown');
    userDropdown.innerHTML = '<option value="">Select User</option>';
    userList.forEach(user => {
        const option = document.createElement('option');
        option.value = user.name;
        option.textContent = `${user.name} (${user.country})`;
        userDropdown.appendChild(option);
    });
    userDropdown.classList.remove('hidden');
}

function saveScore(name, country, time, gameType, level) {
    const scoresRef = ref(database, 'scores');
    const newScoreRef = push(scoresRef);
    const actualTime = LEVEL_TIMES[level] - time; // Convert remaining time to actual time spent
    set(newScoreRef, {
        name: name,
        country: country,
        time: actualTime,
        gameType: gameType,
        level: level
    }).then(() => {
        updateLeaderboard();
    }).catch((error) => {
        console.error('Error saving score:', error);
    });
}

function updateLeaderboard(filterCountry = '', filterLevel = '') {
    const leaderboardEntries = document.getElementById('leaderboard-entries');
    leaderboardEntries.innerHTML = ''; // Clear previous leaderboard entries
    const scoresRef = query(ref(database, 'scores'), orderByChild('time'), limitToFirst(100));
    get(scoresRef).then((snapshot) => {
        if (snapshot.exists()) {
            const scores = [];
            snapshot.forEach((childSnapshot) => {
                const score = childSnapshot.val();
                if ((!filterCountry || score.country === filterCountry) &&
                    (!filterLevel || score.level === filterLevel)) {
                    scores.push(score);
                }
            });
            displayScores(scores);
        }
    }).catch((error) => {
        console.error('Error updating leaderboard:', error);
    });
}

function displayScores(scores) {
    const leaderboardEntries = document.getElementById('leaderboard-entries');
    leaderboardEntries.innerHTML = ''; // Clear previous leaderboard entries
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    headerRow.innerHTML = `
        <th>Name</th>
        <th>Country <i class="fas fa-filter filter-icon" data-type="country"></i></th>
        <th>Time</th>
        <th>Level <i class="fas fa-filter filter-icon" data-type="level"></i></th>
        <th>Medal</th>
    `;
    scores.forEach((score, index) => {
        const row = table.insertRow();
        const levelColor = score.level === 'easy' ? 'green' : score.level === 'medium' ? 'orange' : 'red';
        row.innerHTML = `
            <td>${score.name}</td>
            <td>${score.country}</td>
            <td>${formatTime(score.time)}</td>
            <td style="color:${levelColor}">${score.level.charAt(0).toUpperCase() + score.level.slice(1)}</td>
            <td>${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1) + 'th'}</td>
        `;
    });
    leaderboardEntries.appendChild(table);
}

function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const millis = Math.floor((milliseconds % 1000) / 10);
    return `${seconds}:${millis.toString().padStart(2, '0')}`;
}

function populateCountryOptions() {
    const countries = [
        'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
        'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
        'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
        'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad',
        'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
        'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
        'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany',
        'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
        'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
        'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
        'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
        'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
        'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
        'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
        'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
        'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
        'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan',
        'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga',
        'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
        'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ];
    const countryList = document.getElementById('country-list');
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        countryList.appendChild(option);
    });
}

populateCountryOptions();

document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const saveUserButton = document.getElementById('save-user');
    const restartGameButton = document.getElementById('restart-game');
    const gameBoard = document.getElementById('game-board');
    const leaderboardEntries = document.getElementById('leaderboard-entries');
    const levelSelectionPopup = document.getElementById('level-selection-popup');
    const timerElement = document.getElementById('time-left');
    const timerContainer = document.getElementById('timer');
    const leaderboardContainer = document.querySelector('.leaderboard');
    const usernameInput = document.getElementById('username');
    const countrySelect = document.getElementById('country');
    const userDropdown = document.getElementById('user-dropdown');
    let selectedGameType = '';
    let selectedLevel = '';
    let timer;
    let firstCard, secondCard;
    let lockBoard = false;
    let matchedPairs = 0;
    let totalPairs = 0;
    let startTime = 0;

    // Load saved username
    usernameInput.value = localStorage.getItem('username') || '';

    themeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });

    saveUserButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const country = countrySelect.value.trim();
        if (!username || !country) {
            showAlert('Please enter a valid username and country.');
            return;
        }
        if (!Array.from(countrySelect.list.options).map(opt => opt.value).includes(country)) {
            showAlert('Please enter a valid country from the list.');
            return;
        }
        const user = { name: username, country };
        userList.push(user);
        localStorage.setItem('userList', JSON.stringify(userList));
        populateUserDropdown();
        showAlert('User saved successfully.');
    });

    userDropdown.addEventListener('change', () => {
        const selectedUser = userList.find(user => user.name === userDropdown.value);
        if (selectedUser) {
            usernameInput.value = selectedUser.name;
            countrySelect.value = selectedUser.country;
        }
    });

    restartGameButton.addEventListener('click', () => {
        if (selectedGameType === 'coding') {
            setupCodingGameBoard(selectedLevel);  // Restart the coding game with the same type and level
        } else {
            setupGameBoard(selectedLevel);  // Restart the game with the same type and level
        }
        startTimer(selectedLevel);
    });

    document.querySelectorAll('.game-type-selection button').forEach(button => {
        button.addEventListener('click', () => {
            selectedGameType = button.dataset.type;
            console.log(`Selected game type: ${selectedGameType}`);
            updateButtonStyles(button, 'game-type-selection');
            levelSelectionPopup.classList.add('visible');
        });
    });

    document.querySelectorAll('.popup-content button').forEach(button => {
        button.addEventListener('click', () => {
            selectedLevel = button.dataset.level;
            console.log(`Selected difficulty level: ${selectedLevel}`);
            updateButtonStyles(button, 'popup-content');
            levelSelectionPopup.classList.remove('visible');
            if (selectedGameType === 'coding') {
                setupCodingGameBoard(selectedLevel);
            } else {
                setupGameBoard(selectedLevel);
            }
            startTimer(selectedLevel);
            timerContainer.classList.remove('hidden');
            restartGameButton.classList.remove('hidden');
            leaderboardContainer.classList.remove('hidden');
        });
    });

    function updateButtonStyles(button, groupClass) {
        document.querySelectorAll(`.${groupClass} button`).forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    function setupGameBoard(level) {
        gameBoard.innerHTML = ''; // Clear previous game board
        let gridSize;
        if (level === 'easy') {
            gridSize = [4, 2]; // Change easy level to 4x2 grid
        } else if (level === 'medium') {
            gridSize = [4, 3];
        } else if (level === 'hard') {
            gridSize = [4, 4];
        }
        console.log(`Setting up game board with grid size: ${gridSize}`);

        const numCards = gridSize[0] * gridSize[1];
        totalPairs = numCards / 2;
        matchedPairs = 0;

        let cardValues = getRandomElements(IMAGES[selectedGameType], totalPairs).flatMap(img => [{ img }, { img }]);
        cardValues.sort(() => 0.5 - Math.random());

        gameBoard.style.gridTemplateColumns = `repeat(${gridSize[0]}, 1fr)`;
        cardValues.forEach(cardValue => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.value = cardValue.img;
            card.innerHTML = `
                <div class="front-face">?</div>
                <div class="back-face"><img src="${cardValue.img}" alt="memory card image"></div>
            `;
            card.addEventListener('click', () => flipCard(card));
            gameBoard.appendChild(card);
        });
        console.log(`Game board set up with ${numCards} cards.`);
    }

    function setupCodingGameBoard(level) {
        gameBoard.innerHTML = ''; // Clear previous game board
        let gridSize;
        if (level === 'easy') {
            gridSize = [4, 2]; // Change easy level to 4x2 grid
        } else if (level === 'medium') {
            gridSize = [4, 3];
        } else if (level === 'hard') {
            gridSize = [4, 4];
        }
        console.log(`Setting up coding game board with grid size: ${gridSize}`);

        const numCards = gridSize[0] * gridSize[1];
        totalPairs = numCards / 2;
        matchedPairs = 0;

        let selectedPairs = getRandomElements(IMAGES[selectedGameType], totalPairs);
        let cardValues = selectedPairs.flatMap((img, index) => [
            { id: index, img: img.open },
            { id: index, img: img.close }
        ]);
        cardValues.sort(() => 0.5 - Math.random());

        gameBoard.style.gridTemplateColumns = `repeat(${gridSize[0]}, 1fr)`;
        cardValues.forEach(cardValue => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.value = cardValue.id;
            card.innerHTML = `
                <div class="front-face">?</div>
                <div class="back-face"><img src="${cardValue.img}" alt="memory card image"></div>
            `;
            card.addEventListener('click', () => flipCodingCard(card));
            gameBoard.appendChild(card);
        });
        console.log(`Coding game board set up with ${numCards} cards.`);
    }

    function getRandomElements(arr, count) {
        const shuffled = arr.slice(0);
        let i = arr.length;
        const min = i - count;
        while (i-- > min) {
            const rand = Math.floor((i + 1) * Math.random());
            [shuffled[i], shuffled[rand]] = [shuffled[rand], shuffled[i]];
        }
        return shuffled.slice(min);
    }

    function flipCard(card) {
        if (lockBoard) return;
        if (card === firstCard) return;

        card.classList.add('flip');

        if (!firstCard) {
            firstCard = card;
            return;
        }

        secondCard = card;
        checkForMatch();
    }

    function flipCodingCard(card) {
        if (lockBoard) return;
        if (card === firstCard) return;

        card.classList.add('flip');

        if (!firstCard) {
            firstCard = card;
            return;
        }

        secondCard = card;
        checkForCodingMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;

        if (isMatch) {
            disableCards();
            matchedPairs++;
            if (matchedPairs === totalPairs) {
                setTimeout(gameWon, 500); // Delay "You win!" message to ensure last card is shown
            }
        } else {
            unflipCards();
        }
    }

    function checkForCodingMatch() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;

        if (isMatch) {
            disableCodingCards();
            matchedPairs++;
            if (matchedPairs === totalPairs) {
                setTimeout(gameWon, 500); // Delay "You win!" message to ensure last card is shown
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function disableCodingCards() {
        firstCard.removeEventListener('click', flipCodingCard);
        secondCard.removeEventListener('click', flipCodingCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function startTimer(level) {
        clearInterval(timer);
        startTime = LEVEL_TIMES[level];
        let timeLeft = startTime;
        timerElement.textContent = formatTime(timeLeft);

        timer = setInterval(() => {
            timeLeft -= 10; // Decrement by 10 milliseconds
            timerElement.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                showAlert(`⏰⏰⏰<br>Time is up!<br>Don't Worry, ${usernameInput.value}! Let's Try Again.`);
            }
        }, 10);
    }

    function getLevelWithClass(level) {
        let levelClass = '';
        if (level === 'easy') {
            levelClass = 'easy';
        } else if (level === 'medium') {
            levelClass = 'medium';
        } else if (level === 'hard') {
            levelClass = 'hard';
        }
        return `<span class="${levelClass}">${level.charAt(0).toUpperCase() + level.slice(1)}</span>`;
    }
    

    function gameWon() {
        clearInterval(timer);
        const username = usernameInput.value.trim();
        const country = countrySelect.value;
        const remainingTime = parseTime(timerElement.textContent);
        const actualTime = (LEVEL_TIMES[selectedLevel] - remainingTime) / 1000; // Convert to seconds
        if (username && country) {
            saveScore(username, country, remainingTime, selectedGameType, selectedLevel);
            const levelWithClass = getLevelWithClass(selectedLevel);
            showAlert(`🎉🎉🎉<br>Congratulations, ${username}!<br>Your Time: ${actualTime.toFixed(2)}s.<br>${levelWithClass}<br>Please Check Your Rankings on Our Leaderboard.`);
        }
    }    
    
    

    function parseTime(timeText) {
        const [seconds, millis] = timeText.split(':').map(Number);
        return (seconds * 1000) + (millis * 10);
    }

    // function calculatePlace(level) {
    //     let place = 1;
    //     // Fetch scores and calculate the place for the current user
    //     // This is just a placeholder logic; you'll need to implement the actual place calculation based on the database
    //     return `${place}th`;
    // }

    function showAlert(message) {
        const alertBox = document.getElementById('custom-alert');
        const alertContent = document.getElementById('custom-alert-content');
        const overlay = document.getElementById('overlay');
    
        alertContent.innerHTML = message;
        alertBox.classList.remove('hidden');
        overlay.classList.remove('hidden');
    
        // Hide the alert automatically after 5 seconds
        setTimeout(() => {
            hideAlert();
        }, 10000);
    }
    
    // Function to hide the alert
    function hideAlert() {
        const alertBox = document.getElementById('custom-alert');
        const overlay = document.getElementById('overlay');
        alertBox.classList.add('hidden');
        overlay.classList.add('hidden');
    }
    
    // Event listener to hide the alert when clicking outside of it (on the overlay)
    document.getElementById('overlay').addEventListener('click', hideAlert);

    updateLeaderboard();

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('filter-icon')) {
            const filterType = event.target.dataset.type;
            const existingDropdown = document.querySelector(`.${filterType}-filter-dropdown`);
            if (existingDropdown) {
                existingDropdown.remove();
                updateLeaderboard();
                return;
            }

            const dropdown = document.createElement('select');
            dropdown.className = `${filterType}-filter-dropdown`;
            // dropdown.style.width = '150px'; // Adjust width for better appearance

            if (filterType === 'country') {
                const countries = getCountriesFromLeaderboard();
                dropdown.appendChild(createOption('All Countries', ''));
                countries.forEach(country => {
                    dropdown.appendChild(createOption(country, country));
                });
            } else if (filterType === 'level') {
                dropdown.appendChild(createOption('All Levels', ''));
                dropdown.appendChild(createOption('Easy', 'easy'));
                dropdown.appendChild(createOption('Medium', 'medium'));
                dropdown.appendChild(createOption('Hard', 'hard'));
            }

            const currentCell = event.target.parentNode;
            currentCell.appendChild(dropdown);
            dropdown.addEventListener('change', () => {
                if (filterType === 'country') {
                    updateLeaderboard(dropdown.value);
                } else if (filterType === 'level') {
                    updateLeaderboard('', dropdown.value);
                }
                dropdown.remove();
            });
        }
    });

    function getCountriesFromLeaderboard() {
        const countries = new Set();
        const rows = document.querySelectorAll('#leaderboard-entries table tr');
        rows.forEach(row => {
            const countryCell = row.querySelector('td:nth-child(2)');
            if (countryCell) {
                countries.add(countryCell.textContent);
            }
        });
        return Array.from(countries);
    }

    function createOption(text, value) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        return option;
    }

    document.getElementById('view-all').addEventListener('click', () => {
        updateLeaderboard();
    });

    usernameInput.addEventListener('change', () => {
        localStorage.setItem('username', usernameInput.value);
    });
});


// Additional Scripts

document.getElementById('dropdownIcon').addEventListener('click', function() {
var dropdown = document.getElementById('user-dropdown');
if (dropdown.classList.contains('hidden')) {
    dropdown.classList.remove('hidden');
    dropdown.style.display = 'block';
} else {
    dropdown.classList.add('hidden');
    dropdown.style.display = 'none';
}
});