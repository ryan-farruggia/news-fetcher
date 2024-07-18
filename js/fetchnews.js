function timeAgo(date) {
    const now = new Date();
    const publishedDate = new Date(date);
    const secondsAgo = Math.floor((now - publishedDate) / 1000);

    if (secondsAgo < 60) {
        return `${secondsAgo}s`;
    }

    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        return `${minutesAgo}m`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        return `${hoursAgo}h`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 7) {
        return `${daysAgo}d`;
    }

    const weeksAgo = Math.floor(daysAgo / 7);
    if (weeksAgo < 4) {
        return `${weeksAgo}w`;
    }

    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) {
        return `${monthsAgo}mo`;
    }

    const yearsAgo = Math.floor(daysAgo / 365);
    return `${yearsAgo}y`;
}

function truncateText(text, maxLength) {
    if (text) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength) + '...';
    }
    if (!text) {
        return "No information provided."
    }
}

function getSourceImg(source) {
    if (source) {
        const lowerCaseSource = source.toLowerCase();
        if (lowerCaseSource.includes('cnn')) {
            return 'img/cnn.png';
        } else if (lowerCaseSource.includes('fox')) {
            return 'img/fox.png';
        } else if (lowerCaseSource.includes('usa today')) {
            return 'img/usa-today.png';
        } else if (lowerCaseSource.includes('bbc')) {
            return 'img/bbc.png';
        } else if (lowerCaseSource.includes('google')) {
            return 'img/google.png';
        } else if (lowerCaseSource.includes('nbc')) {
            return 'img/nbc.jpg';
        } else if (lowerCaseSource.includes('abc')) {
            return 'img/abc.svg';
        } else if (lowerCaseSource.includes('cbs')) {
            return 'img/cbs.png';
        } else if (lowerCaseSource.includes('associated')) {
            return 'img/ap.jpg';
        } else if (lowerCaseSource.includes('yahoo')) {
            return 'img/yahoo.jpg';
        } else if (lowerCaseSource.includes('eonline')) {
            return 'img/enews.png';
        } else if (lowerCaseSource.includes('wash')) {
            return 'img/wp.png';
        } else if (lowerCaseSource.includes('holly')) {
            return 'img/hollywood.jpeg';
        } else if (lowerCaseSource.includes('espn')) {
            return 'img/espn.jpeg';
        } else {
            return 'img/default.png'; // Default image if no match is found
        }
    }
    else {
        return 'img/default.png';
    }
}

// Function to update news card with article data
function updateNewsCard(article) {
    const template = document.querySelector('#news-card-template');
    const clone = template.content.cloneNode(true);
    if (article.title.includes('Removed')) {
        return null;
    }

    clone.querySelector('.news-card').href = article.url;
    clone.querySelector('.news-card').style.backgroundImage = `url(${article.urlToImage})`;
    clone.querySelector('.source-img').src = getSourceImg(article.source.name);
    clone.querySelector('.time-published').textContent = timeAgo(article.publishedAt);
    clone.querySelector('.news-headline').textContent = truncateText(article.title, 30);
    clone.querySelector('.description').textContent = truncateText(article.description, 150);

    document.getElementById('content-container').appendChild(clone);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const fromDate = formatDate(yesterday);
const toDate = formatDate(today);

function fetchNews() {
const url = `https://newsapi.org/v2/everything?` +
    `domains=abcnews.go.com,eonline.com,ap.org,msnbc.com,nbcnews.com,cbsnews.com,news.google.com,news.yahoo.com,finance.yahoo.com,politico.com,us.cnn.com,usatoday.com/news,foxnews.com&` +
    `from=${fromDate}&` +
    `to=${toDate}&` +
    `language=en&` +
    `pageSize=50&` +
    `sortBy=publishedAt&` +
    `apiKey=c53986d1dfcf40a6be9744c2d9d2dd99`;

// Use the URL for your API request
fetch(url)
    .then(response => response.json())
    .then(data => {
        newsData = data.articles;
        newsData.forEach(article => {
            updateNewsCard(article);
        });
    })
    .catch(error => console.error('Error fetching news:', error));
}
let countdownInterval;
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    let timeLeft = 1800; // 30 minutes in seconds

    countdownInterval = setInterval(() => {
        // Decrement time left
        timeLeft--;

        // Calculate minutes and seconds
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        // Update the countdown display
        countdownElement.textContent = `News automatically updates in: ${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Check if time left is zero
        if (timeLeft <= 0) {
            runGauntlet();
            timeLeft = 1800; // Reset to 30 minutes
        }
    }, 1000);
}

function resetCountdown() {
    clearInterval(countdownInterval);
    startCountdown();
}

startCountdown();
document.getElementById('refresh').addEventListener('click', resetCountdown);
