document.getElementById('linkpopup').addEventListener('click', function() {
    // Abrir a nova página 'boasvindas.html' em uma nova aba
    chrome.tabs.create({ url: 'popup.html' });
});
