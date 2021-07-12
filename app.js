//ServiceWorker Check and Register
if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js")
    .then(registration =>{
        console.log("SW Registered");
        console.log(registration);
    })
    .catch(error=>{
        console.log(error);
        console.log("SW Error");
    })
};

// BUTTON Activate Installation Prompt
//
let deferredPrompt; // Allows to show the install prompt
const installButton = document.getElementById("install_button");

window.addEventListener("beforeinstallprompt", e => {
  console.log("beforeinstallprompt fired");
  // Prevent Chrome 76 and earlier from automatically showing a prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Show the install button
  installButton.hidden = false;
  installButton.addEventListener("click", installApp);
});

function installApp() {
  // Show the prompt
  deferredPrompt.prompt();
  installButton.disabled = true;

  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then(choiceResult => {
    if (choiceResult.outcome === "accepted") {
      console.log("PWA setup accepted");
      installButton.hidden = true;
    } else {
      console.log("PWA setup rejected");
    }
    installButton.disabled = false;
    deferredPrompt = null;
  });
}
window.addEventListener("appinstalled", evt => {
  console.log("appinstalled fired", evt);
}); 




//notification 
if (Notification.permission === 'default'){
  Notification.requestPermission()
}
if (!navigator.onLine){
  new Notification('Alert!',{body:'Currently in Offline Mode, Reading Cache'})
}
window.addEventListener('online',()=>{
  new Notification('Alert!',{body:'Connected to Internet, Please refresh your Browser!'})
})

