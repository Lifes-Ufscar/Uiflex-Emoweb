document.getElementById('connectButton').addEventListener('click', async () => {
    chrome.runtime.getBackgroundPage(async (background) => {
      await background.connectToSerialPort();
      document.getElementById('connectButton').disabled = true;
      document.getElementById('disconnectButton').disabled = false;
    });
  });
  
  document.getElementById('disconnectButton').addEventListener('click', async () => {
    chrome.runtime.getBackgroundPage(async (background) => {
      await background.closeSerialPort();
      document.getElementById('connectButton').disabled = false;
      document.getElementById('disconnectButton').disabled = true;
    });
  });
  