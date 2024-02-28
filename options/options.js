const timeOption = document.getElementById("time");


timeOption.addEventListener("change", () => {
  let timeValue = parseInt(timeOption.value); 
  if (timeValue < 1 || timeValue > 60) {
    timeOption.value = 25; 
  }
});

const saveButton = document.getElementById("save-time-button");


saveButton.addEventListener("click", () => {
  
  chrome.storage.local.set({
    timer: 0,
    timeOption: parseInt(timeOption.value), 
    isRunning: false,
  });
});


chrome.storage.local.get(["timeOption"], (res) => {
  timeOption.value = res.timeOption || 25; 
});
