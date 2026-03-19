// avoid service worker in dev mode
if ("serviceWorker" in navigator) {
    const isLocalhost = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);

    if (!isLocalhost) {
        navigator.serviceWorker.register("./serviceWorker.js", { scope: "./" });
    }
    else {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => registration.unregister());
        });
    }
}


window.MathJax = {
    tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] }
};