gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

const masterTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
    }
});

// Setup Initial State
gsap.set("#map-wrapper", { scale: 10, opacity: 0 });
gsap.set(".glass-panel, .top-bar-overlay, .scene, #ui-subscriptions", { visibility: "hidden", opacity: 0 });
gsap.set(".charging-cable", { opacity: 0, strokeDashoffset: 100 });
gsap.set("#cable-path", { strokeDashoffset: 100, strokeDasharray: 100 });
gsap.set("#active-route", { strokeDashoffset: 0, strokeDasharray: 4000 });
gsap.set(".battery-ui", { opacity: 0, y: 10 });
let mapX = 0, mapY = -1300;

// Responsive Centering Matrix
gsap.set(["#ui-onboarding", "#ui-permission", "#ui-station-locked", "#ui-station-premium", "#ui-confirmation", "#ui-my-bookings", "#ui-filters", "#ui-charging"], { yPercent: -50, xPercent: 0 });
gsap.set("#ui-navigation", { xPercent: -50, yPercent: 0 });
gsap.set(".subscription-container", { xPercent: -50, yPercent: -50 });

/* -------------------- 1. SPLASH -------------------- */
masterTl.addLabel("scene1")
    .to("#initial-scroll-hint", { opacity: 0, duration: 0.5 })
    .to("#energy-dot", { scale: 5, boxShadow: "0 0 100px 50px rgba(37,99,235,0)", duration: 2, ease: "power2.out" }, "<")
    .to("#map-wrapper", { opacity: 1, duration: 2 }, "-=1")
    .to("#energy-dot", { opacity: 0, duration: 1 }, "-=1")
    .to("#map-wrapper", { scale: 1, x: mapX, y: mapY, duration: 4, ease: "power3.inOut" }, "-=1")
    .set("#scene-splash", { visibility: "visible" }, "-=2")
    .to("#scene-splash", { opacity: 1, duration: 1 }, "-=2")

    /* -------------------- 2. ONBOARDING -------------------- */
    .to("#scene-splash", { opacity: 0, y: -50, duration: 1 }, "+=1.5")
    .set("#scene-splash", { visibility: "hidden" })
    .set("#ui-onboarding", { visibility: "visible", x: 50 })
    .to("#ui-onboarding", { opacity: 1, x: 0, duration: 1, ease: "power2.out" })
    .to("#ui-onboarding", { opacity: 0, y: -50, duration: 1 }, "+=2")
    .set("#ui-onboarding", { visibility: "hidden" })

    /* -------------------- 3. PERMISSION -------------------- */
    .set("#ui-permission", { visibility: "visible", x: 50 })
    .to("#ui-permission", { opacity: 1, x: 0, duration: 1, ease: "power2.out" })
    .to("#ui-permission .btn-glow", { scale: 0.95, duration: 0.2, yoyo: true, repeat: 1 }, "+=1")
    .to("#ui-permission", { opacity: 0, scale: 0.9, duration: 1 }, "+=0.5")
    .set("#ui-permission", { visibility: "hidden" })

    /* -------------------- 4. MAP & CAR REVEAL -------------------- */
    .to("#car-container", { opacity: 1, duration: 2 }, "-=1")
    .to(".battery-ui", { opacity: 1, y: 0, duration: 1, ease: "back.out" }, "-=0.5")
    .set("#ui-map-tools", { visibility: "visible", y: -20 })
    .to("#ui-map-tools", { opacity: 1, y: 0, duration: 1 }, "<")

    /* -------------------- 5. DRIVING & LOCKED STATION -------------------- */
    .to(".ev-car", { rotation: -20, duration: 1, ease: "power1.inOut" }, "+=0.5")
    .to("#map-wrapper", { x: 500, y: 100, duration: 8, ease: "power2.inOut" })
    .to("#active-route", { strokeDashoffset: -1500, duration: 8, ease: "none" }, "<")
    .to(".battery-level .fill", { width: "50%", duration: 8, ease: "none" }, "<")
    .to(".battery-text", { innerHTML: "50%", duration: 8, snap: "innerHTML" }, "<")
    .to(".ev-car", { rotation: 0, duration: 1.5, ease: "power1.inOut" }, "-=2")

    .to("#station-1 .radar", { opacity: 1, scale: 2, duration: 2, ease: "power1.out", repeat: 1, yoyo: true }, "-=1")
    .to("#station-1 .radar-ring", { opacity: 1, scale: 2.5, duration: 2, ease: "power1.out", repeat: 1, yoyo: true }, "<")
    .set("#ui-station-locked", { visibility: "visible", x: 50 })
    .to("#ui-station-locked", { opacity: 1, x: 0, duration: 1, ease: "back.out" })
    .to("#ui-station-locked .btn-glow", { scale: 0.95, duration: 0.2, yoyo: true, repeat: 1 }, "+=1")
    .to("#ui-station-locked .btn-glow", { scale: 0.95, duration: 0.2, yoyo: true, repeat: 1 }, "+=1")
    .to("#ui-station-locked", { opacity: 0, x: -50, duration: 1 }, "+=0.5")
    .set("#ui-station-locked", { visibility: "hidden" })

    /* -------------------- 6. SUBSCRIPTIONS -------------------- */
    .to("#night-overlay", { backgroundColor: "rgba(0,0,0,0.6)", duration: 1 }, "<")
    .set("#ui-subscriptions", { visibility: "visible", scale: 0.8 })
    .to("#ui-subscriptions", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)" })
    .to(".plan-card.premium-border .btn-glow", { scale: 0.95, duration: 0.2, yoyo: true, repeat: 1 }, "+=1")
    .to("#payment-success", { visibility: "visible", opacity: 1, duration: 0.5 }, "+=0.2")

    .to(".pay-btn .icon", { animation: "none", opacity: 0, duration: 0.1 }, "+=2.5")
    .fromTo(".pay-btn .check-icon", { scale: 0.5, rotation: -45, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }, "<")

    .to("#ui-subscriptions", { opacity: 0, y: 50, duration: 1 }, "+=2")
    .set("#ui-subscriptions", { visibility: "hidden" })
    .to("#night-overlay", { backgroundColor: "rgba(0,0,0,0)", duration: 1 }, "<")

    /* -------------------- 7. PREMIUM UNLOCKED & BOOKING -------------------- */
    .set("#ui-station-premium", { visibility: "visible", x: 50 })
    .to("#ui-station-premium", { opacity: 1, x: 0, duration: 1, ease: "back.out" })
    .to(".slot.active", { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1 }, "+=1")
    .to("#ui-station-premium .btn-glow", { scale: 0.95, duration: 0.2, yoyo: true, repeat: 1 }, "+=0.5")
    .to("#ui-station-premium", { opacity: 0, x: -50, duration: 1 }, "+=0.5")
    .set("#ui-station-premium", { visibility: "hidden" })

    /* -------------------- 8. CONFIRMATION -------------------- */
    .set("#ui-confirmation", { visibility: "visible", scale: 0.9 })
    .to("#ui-confirmation", { opacity: 1, scale: 1, duration: 1, ease: "back.out" })
    .to("#ui-confirmation", { opacity: 0, scale: 0.9, duration: 1 }, "+=1.5")
    .set("#ui-confirmation", { visibility: "hidden" })

    /* -------------------- 9. MY BOOKINGS DASHBOARD -------------------- */
    .set("#ui-my-bookings", { visibility: "visible", x: 50 })
    .to("#ui-my-bookings", { opacity: 1, x: 0, duration: 1, ease: "back.out" })
    .to(".booking-item", { backgroundColor: "var(--surface)", duration: 0.3, yoyo: true, repeat: 1 }, "+=1")
    .to("#ui-my-bookings", { opacity: 0, y: -50, duration: 1 }, "+=1")
    .set("#ui-my-bookings", { visibility: "hidden" })

    /* -------------------- 10. DRIVE & NAVIGATION -------------------- */
    .to(".ev-car", { rotation: 42, duration: 1, ease: "power1.inOut" })
    .to("#map-wrapper", { x: -500, y: 1200, duration: 6, ease: "power2.inOut" }, "<+=0.5")
    .to("#active-route", { strokeDashoffset: -4000, duration: 6, ease: "none" }, "<")
    .to(".battery-level .fill", { width: "20%", duration: 6, ease: "none" }, "<")
    .to(".battery-text", { innerHTML: "20%", duration: 6, snap: "innerHTML" }, "<")
    .to(".battery-level .fill", { backgroundColor: "#EF4444", duration: 1 }, "<+=4")

    .set("#ui-navigation", { visibility: "visible", y: 20 }, "-=4")
    .to("#ui-navigation", { opacity: 1, y: 0, duration: 1, ease: "back.out" }, "<")

    /* -------------------- 11. FILTERS -------------------- */
    .set("#ui-filters", { visibility: "visible", y: 50 }, "-=3")
    .to("#ui-filters", { opacity: 1, y: 0, duration: 1, ease: "back.out" }, "<")
    .to("#station-2 .core", { scale: 1.5, fill: "#10B981", duration: 0.5, yoyo: true, repeat: 3 }, "-=1")

    .to(".ev-car", { rotation: 0, duration: 1, ease: "power1.inOut" }, "-=1")

    /* -------------------- 11.5 THE CHARGING EXPERIENCE -------------------- */
    .to(["#ui-navigation", "#ui-filters"], { opacity: 0, duration: 1 }, "+=0.5")
    .set(["#ui-navigation", "#ui-filters"], { visibility: "hidden" })

    .to([".charging-cable", "#ev-charger-model"], { opacity: 1, duration: 0.5 }, "+=0.5")
    .add("cable-draw")
    .to("#cable-path", { strokeDashoffset: 0, duration: 1, ease: "power2.out" }, "cable-draw")
    .to(".cable-pulse", { motionPath: { path: "#cable-path", align: "#cable-path", alignOrigin: [0.5, 0.5] }, duration: 1, repeat: 3, ease: "none" }, "cable-draw")

    .set("#ui-charging", { visibility: "visible", x: -50 }, "cable-draw+=0.5")
    .to("#ui-charging", { opacity: 1, x: 0, duration: 1, ease: "back.out" }, "cable-draw+=0.5")

    .add("charge-fill", "cable-draw+=1.0")
    .to(".charge-progress-bar .fill", { width: "100%", duration: 3, ease: "power1.inOut" }, "charge-fill")
    .to(".battery-level .fill", { width: "100%", backgroundColor: "#10B981", duration: 3, ease: "power1.inOut" }, "charge-fill")
    .to(".battery-text", { innerHTML: "100%", duration: 3, snap: "innerHTML" }, "charge-fill")

    .to("#ui-charging", { opacity: 0, x: -50, duration: 1 }, "+=1")
    .set("#ui-charging", { visibility: "hidden" })
    .to([".charging-cable", "#ev-charger-model"], { opacity: 0, duration: 0.5 }, "<")

    /* -------------------- 12. FINAL SCENE -------------------- */
    .to(["#ui-map-tools", ".battery-ui", "#car-container"], { opacity: 0, duration: 1 }, "+=2")
    .set(["#ui-map-tools", ".battery-ui", "#car-container"], { visibility: "hidden" })
    .to("#night-overlay", { backgroundColor: "var(--surface)", duration: 2 }, "<")
    .to("#map-wrapper", { scale: 0.4, x: -100, y: 500, duration: 4, ease: "power3.inOut" }, "<")

    .set("#scene-final", { visibility: "visible", scale: 0.9 })
    .to("#scene-final", { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }, "-=2")

    .fromTo(".thank-you-text", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: "power3.out" }, "-=0.5");
