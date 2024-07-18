document.addEventListener('DOMContentLoaded', (event) => {
    runGauntlet();
});

function runGauntlet() {
    displayNotification();
    deleteAllCards();
    fetchNews();
    setTimeout(() => {
        const newsCards = document.querySelectorAll('.news-card');
        newsCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('show');
            }, index * 100); // Adjust the delay time (200ms) as needed
        });
    }, 1000);
}

function deleteAllCards() {
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach((card) => {
        card.remove();
    });
}

function displayNotification() {
    const modal = document.getElementById('refreshModal');

    // Show the modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 500); // Delay before the modal appears

    // Hide the modal after a few seconds
    setTimeout(() => {
        modal.classList.remove('show');
    }, 2000); // Modal visible for 3 seconds
}