// Set up alarm to trigger every minute
chrome.alarms.create("MTWCTimer", {
  periodInMinutes: 1 / 60,
});

// Listen for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  // Check if the alarm is for MTWCTimer
  if (alarm.name === "MTWCTimer") {
    // Retrieve timer data from local storage
    chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
      // Check if the timer is running
      if (res.isRunning) {
        let timer = res.timer + 1; // Increment timer
        let isRunning = true; // Set timer status to running

        // If timer reaches the specified time
        if (timer === 60 * res.timeOption) {
          // Show notification when timer is up
          chrome.notifications.create("timerUpNotification", {
            type: "basic",
            iconUrl: "icon.png",
            title: "MTWC Timer is Up",
            message: `${res.timeOption} minutes have passed!`,
          });

          // Reset timer and stop timer
          timer = 0;
          isRunning = false;
        }

        // Update timer and timer status in local storage
        chrome.storage.local.set({
          timer,
          isRunning,
        });
      }
    });
  }
});

// Initialize timer data in local storage
chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
  // Set initial values if not already present
  chrome.storage.local.set({
    timer: "timer" in res ? res.timer : 0,
    timeOption: "timeOption" in res ? res.timeOption : 25,
    isRunning: "isRunning" in res ? res.isRunning : false,
  });
});
