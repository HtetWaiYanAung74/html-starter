function initApp() {
    // Elements
    const loadingScreen = document.getElementById("loadingScreen");
    const mainScreen = document.getElementById("mainScreen");
    const page2Screen = document.getElementById("page2Screen");
    const page3Screen = document.getElementById("page3Screen");
    const loadingChar = document.getElementById("loadingChar");
    const loadingLetters = document.querySelectorAll("#loadingText span");
    const progressBar = document.getElementById("progressBar");
    const progressNumber = document.getElementById("progressNumber");
    const photoLayers = document.querySelectorAll(".photo-layer");
    const mainHeader = document.getElementById("mainHeader");
    const btnCollection = document.getElementById("btnCollection");
    const page2Logo = document.getElementById("page2Logo");
    const page2Girl = document.getElementById("page2Girl");
    const girlHand = document.getElementById("girlHand");
    const girlArmTop = document.getElementById("girlArmTop");
    const girlLegs = document.getElementById("girlLegs");
    const scrollPrompt = document.getElementById("scrollPrompt");
    const scrollUpPrompt = document.getElementById("scrollUpPrompt");
    const scrollDownPrompt2 = document.getElementById("scrollDownPrompt2");
    const scrollUpPrompt3 = document.getElementById("scrollUpPrompt3");
    const page3OneAnimal = document.getElementById("page3OneAnimal");
    const page3Girl = document.getElementById("page3Girl");
    const page3Message = document.getElementById("page3Message");

    if (!loadingScreen || !mainScreen) return;

    let masterTimeline = null;
    let layerFloatingAnimations = [];
    let currentPage = 1; // 1 = mainScreen, 2 = page2Screen, 3 = page3Screen
    let isTransitioning = false;
    let girlLayingFloatAnim = null;
    let girlLimbsAnimation = [];
    let cornerAnimalAnim = null;
    let page3GirlAnim = null;

    // Motion profiles for each layer to give varied organic up & down motion
    const layerMotionProfiles = [
        { y: -16, duration: 2.6, delay: 0 },
        { y: 18, duration: 3.2, delay: 0.2 },
        { y: -12, duration: 2.4, delay: 0.4 },
        { y: 22, duration: 3.6, delay: 0.1 },
        { y: -20, duration: 2.8, delay: 0.3 },
        { y: 15, duration: 3.0, delay: 0.5 },
        { y: -24, duration: 3.4, delay: 0.25 },
        { y: 17, duration: 2.7, delay: 0.45 },
        { y: -19, duration: 3.3, delay: 0.15 },
        { y: 21, duration: 3.5, delay: 0.35 },
        { y: -14, duration: 2.5, delay: 0.55 },
        { y: 19, duration: 3.1, delay: 0.05 },
        { y: -22, duration: 3.7, delay: 0.2 },
    ];

    function runSequence() {
        // Kill existing timelines & tweens if any
        if (masterTimeline) {
            masterTimeline.kill();
        }
        layerFloatingAnimations.forEach((anim) => anim.kill());
        layerFloatingAnimations = [];
        if (girlLayingFloatAnim) girlLayingFloatAnim.kill();

        currentPage = 1;
        isTransitioning = false;

        // Reset initial states
        gsap.set(loadingScreen, {
            opacity: 1,
            visibility: "visible",
            scale: 1,
            pointerEvents: "auto",
        });
        gsap.set(loadingChar, { opacity: 1, scale: 1, y: 0, rotate: 0 });
        if (progressBar) gsap.set(progressBar, { width: "0%" });
        if (progressNumber) progressNumber.textContent = "0%";

        gsap.set(mainScreen, { opacity: 0, visibility: "hidden", scale: 1.05 });
        if (page2Screen)
            gsap.set(page2Screen, {
                opacity: 0,
                visibility: "hidden",
                yPercent: 100,
                y: 0,
            });
        if (page3Screen)
            gsap.set(page3Screen, {
                opacity: 0,
                visibility: "hidden",
                yPercent: 100,
                y: 0,
            });
        if (cornerAnimalAnim) cornerAnimalAnim.kill();
        if (page3GirlAnim) page3GirlAnim.kill();

        // Set initial offsets for photo layers
        photoLayers.forEach((layer, idx) => {
            const initialY = (idx % 2 === 0 ? 30 : -30) + idx * 2;
            gsap.set(layer, { y: initialY, opacity: 0, scale: 1.02 });
        });

        if (mainHeader) gsap.set(mainHeader, { y: -50, opacity: 0, scale: 0.9 });
        if (btnCollection)
            gsap.set(btnCollection, {
                y: 40,
                scale: 0.7,
                opacity: 0,
                transformOrigin: "bottom right",
            });
        if (scrollPrompt) gsap.set(scrollPrompt, { opacity: 0, y: 20 });

        masterTimeline = gsap.timeline();

        // 1. Loading Idle & Floating Animations
        const charBounce = gsap.to(loadingChar, {
            y: -12,
            duration: 0.75,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        const textWave = gsap.to(loadingLetters, {
            y: -5,
            opacity: 0.6,
            stagger: {
                each: 0.07,
                repeat: -1,
                yoyo: true,
            },
            duration: 0.35,
            ease: "power2.inOut",
        });

        // 2. Simulated Progress Bar Filling (0 to 100%)
        const progressObj = { value: 0 };
        masterTimeline.to(progressObj, {
            value: 100,
            duration: 2.0,
            ease: "power2.inOut",
            onUpdate: () => {
                const val = Math.round(progressObj.value);
                if (progressBar) progressBar.style.width = val + "%";
                if (progressNumber) progressNumber.textContent = val + "%";
            },
        });

        // 3. Outro of Loading Screen
        masterTimeline.add(() => {
            charBounce.kill();
            textWave.kill();
        });

        masterTimeline.to(loadingChar, {
            scale: 1.18,
            y: -15,
            duration: 0.3,
            ease: "back.in(1.4)",
        });

        masterTimeline.to(
            loadingScreen,
            {
                opacity: 0,
                scale: 0.94,
                duration: 0.5,
                ease: "power3.inOut",
                onComplete: () => {
                    gsap.set(loadingScreen, {
                        visibility: "hidden",
                        pointerEvents: "none",
                    });
                },
            },
            "-=0.1",
        );

        // 4. Intro of Main Screen
        masterTimeline.set(mainScreen, { visibility: "visible" }, "<0.05");

        masterTimeline.to(
            mainScreen,
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
            },
            "<",
        );

        // 5. Entrance transition for each photo layer
        masterTimeline.to(
            photoLayers,
            {
                y: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.04,
                duration: 0.9,
                ease: "power3.out",
            },
            "<0.05",
        );

        // 6. Start continuous Up-and-Down floating animation for each layer
        masterTimeline.add(() => {
            photoLayers.forEach((layer, idx) => {
                const profile = layerMotionProfiles[idx % layerMotionProfiles.length];
                const floatAnim = gsap.to(layer, {
                    y: profile.y,
                    duration: profile.duration,
                    delay: profile.delay,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });
                layerFloatingAnimations.push(floatAnim);
            });
        });

        // 7. Logo / Header Drop-in
        if (mainHeader) {
            masterTimeline.to(
                mainHeader,
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.75,
                    ease: "elastic.out(1, 0.65)",
                },
                "-=0.6",
            );
        }

        // 9. "View Collection" Button Bounce
        if (btnCollection) {
            masterTimeline.to(
                btnCollection,
                {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.65,
                    ease: "elastic.out(1.1, 0.5)",
                },
                "-=0.35",
            );
        }

        // 10. Ambient Header & Button pulse
        masterTimeline.add(() => {
            gsap.to(".brand-title", {
                y: "-=3",
                duration: 1.6,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
            });

            if (btnCollection) {
                gsap.to(btnCollection, {
                    scale: 1.04,
                    duration: 1.2,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut",
                });
            }
        });
    }

    // ================= SCROLL / WHEEL MOTION: TRANSITION TO PAGE 2 =================
    function transitionToPage2() {
        if (isTransitioning || currentPage === 2) return;
        isTransitioning = true;
        girlLimbsAnimation.forEach((a) => a.kill());
        girlLimbsAnimation = [];

        // Reset Page 2 girl starting posture: upright/floating down from top
        gsap.set(page2Screen, {
            visibility: "visible",
            opacity: 1,
            yPercent: 100,
            y: 0,
        });
        gsap.set(page2Logo, { opacity: 0, scale: 0.85, y: -40 });

        // Start upright posture (rotate: 0, higher Y)
        gsap.set(page2Girl, {
            opacity: 0,
            scale: 1.2,
            rotate: 0,
            y: -100,
            x: 0,
        });

        const p2Tl = gsap.timeline({
            onComplete: () => {
                currentPage = 2;
                isTransitioning = false;

                // Continuous gentle floating of laying-down girl
                girlLayingFloatAnim = gsap.to(page2Girl, {
                    y: "+=12",
                    duration: 2.8,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });

                // Motion ONLY hand (phone hand waving/tilting)
                const handAnim = gsap.to(girlHand, {
                    rotate: -14,
                    x: -6,
                    y: 4,
                    duration: 1.4,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });

                const armTopAnim = gsap.to(girlArmTop, {
                    rotate: 10,
                    y: -4,
                    duration: 1.8,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });

                // Motion ONLY legs (kicking/floating up and down motion)
                const legsAnim = gsap.to(girlLegs, {
                    rotate: 8,
                    x: 5,
                    y: -8,
                    duration: 2.0,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });

                girlLimbsAnimation.push(handAnim, armTopAnim, legsAnim);
            },
        });

        // Slide main page out upwards
        p2Tl.to(mainScreen, {
            yPercent: -100,
            opacity: 0.2,
            duration: 1.0,
            ease: "power3.inOut",
        });

        // Slide page 2 in from bottom
        p2Tl.to(
            page2Screen,
            {
                yPercent: 0,
                duration: 1.0,
                ease: "power3.inOut",
            },
            "<",
        );

        // Fade & scale in big "Fluffy HÜGS" logo
        p2Tl.to(
            page2Logo,
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.9,
                ease: "back.out(1.2)",
            },
            "-=0.6",
        );

        // Girl lay down in motion: Rotates from 0deg (standing) into exactly 180-degree horizontal lay down (-90deg relative)
        p2Tl.to(
            page2Girl,
            {
                opacity: 1,
                scale: 1.65,
                rotate: -90,
                y: 0,
                x: 0,
                duration: 1.2,
                ease: "power2.out",
            },
            "-=0.8",
        );
    }

    function transitionToPage1() {
        if (isTransitioning || currentPage === 1) return;
        isTransitioning = true;
        if (girlLayingFloatAnim) girlLayingFloatAnim.kill();
        girlLimbsAnimation.forEach((a) => a.kill());
        girlLimbsAnimation = [];

        const p1Tl = gsap.timeline({
            onComplete: () => {
                currentPage = 1;
                isTransitioning = false;
                gsap.set(page2Screen, { visibility: "hidden" });
            },
        });

        // Girl rotates back as she floats away
        p1Tl.to(page2Girl, {
            rotate: 0,
            scale: 1.2,
            y: -80,
            opacity: 0,
            duration: 0.8,
            ease: "power2.in",
        });

        // Slide page 2 out downwards
        p1Tl.to(
            page2Screen,
            {
                yPercent: 100,
                duration: 0.9,
                ease: "power3.inOut",
            },
            "-=0.5",
        );

        // Slide main page back in
        p1Tl.to(
            mainScreen,
            {
                yPercent: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.inOut",
            },
            "<",
        );
    }

    // ================= SCROLL / WHEEL MOTION: TRANSITION TO PAGE 3 =================
    function transitionToPage3() {
        if (isTransitioning || currentPage === 3) return;
        isTransitioning = true;
        if (girlLayingFloatAnim) girlLayingFloatAnim.kill();
        girlLimbsAnimation.forEach((a) => a.kill());
        girlLimbsAnimation = [];
        if (cornerAnimalAnim) cornerAnimalAnim.kill();
        if (page3GirlAnim) page3GirlAnim.kill();

        // Reset Page 3 elements
        gsap.set(page3Screen, {
            visibility: "visible",
            opacity: 1,
            yPercent: 100,
            y: 0,
        });
        gsap.set(page3Girl, { opacity: 0, x: -60, y: 0 });
        gsap.set(page3Message, { opacity: 0, y: 30, scale: 0.96 });
        gsap.set(page3OneAnimal, { opacity: 0, rotate: -20, y: -40 });

        const p3Tl = gsap.timeline({
            onComplete: () => {
                currentPage = 3;
                isTransitioning = false;

                // Start hanging corner animal swaying / wiggling motion ONLY
                cornerAnimalAnim = gsap.to(page3OneAnimal, {
                    rotate: 10,
                    y: 6,
                    duration: 2.2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });

                // Start Page 3 girl gentle idle breathing motion
                page3GirlAnim = gsap.to(page3Girl, {
                    y: -8,
                    duration: 2.6,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });
            },
        });

        // Slide Page 2 out upwards
        p3Tl.to(page2Screen, {
            yPercent: -100,
            opacity: 0.2,
            duration: 1.0,
            ease: "power3.inOut",
        });

        // Slide Page 3 in from bottom
        p3Tl.to(
            page3Screen,
            {
                yPercent: 0,
                duration: 1.0,
                ease: "power3.inOut",
            },
            "<",
        );

        // Entrance animation for hanging corner animal (sways in)
        p3Tl.to(
            page3OneAnimal,
            {
                opacity: 1,
                rotate: 0,
                y: 0,
                duration: 0.9,
                ease: "back.out(1.6)",
            },
            "-=0.6",
        );

        // Entrance animation for Standing Girl
        p3Tl.to(
            page3Girl,
            {
                opacity: 1,
                x: 0,
                duration: 0.85,
                ease: "power3.out",
            },
            "-=0.6",
        );

        // Entrance animation for Center Japanese Typography
        p3Tl.to(
            page3Message,
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power2.out",
            },
            "-=0.5",
        );
    }

    function transitionToPage2FromPage3() {
        if (isTransitioning || currentPage !== 3) return;
        isTransitioning = true;
        if (cornerAnimalAnim) cornerAnimalAnim.kill();
        if (page3GirlAnim) page3GirlAnim.kill();

        const p2ReturnTl = gsap.timeline({
            onComplete: () => {
                currentPage = 2;
                isTransitioning = false;
                gsap.set(page3Screen, { visibility: "hidden" });

                // Resume Page 2 animations
                girlLayingFloatAnim = gsap.to(page2Girl, {
                    y: "+=12",
                    duration: 2.8,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });

                const handAnim = gsap.to(girlHand, {
                    rotate: -14,
                    x: -6,
                    y: 4,
                    duration: 1.4,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });

                const armTopAnim = gsap.to(girlArmTop, {
                    rotate: 10,
                    y: -4,
                    duration: 1.8,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });

                const legsAnim = gsap.to(girlLegs, {
                    rotate: 8,
                    x: 5,
                    y: -8,
                    duration: 2.0,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });

                girlLimbsAnimation.push(handAnim, armTopAnim, legsAnim);
            },
        });

        // Slide Page 3 out downwards
        p2ReturnTl.to(page3Screen, {
            yPercent: 100,
            duration: 0.9,
            ease: "power3.inOut",
        });

        // Slide Page 2 back into view
        p2ReturnTl.to(
            page2Screen,
            {
                yPercent: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.inOut",
            },
            "<",
        );
    }

    // Mouse wheel scroll listener for multi-page flow (Page 1 <-> Page 2 <-> Page 3)
    let wheelDelta = 0;
    let wheelTimeout = null;

    window.addEventListener(
        "wheel",
        (e) => {
            wheelDelta += e.deltaY;
            clearTimeout(wheelTimeout);

            wheelTimeout = setTimeout(() => {
                if (wheelDelta > 40) {
                    // Scrolling Down
                    if (currentPage === 1) {
                        transitionToPage2();
                    } else if (currentPage === 2) {
                        transitionToPage3();
                    }
                } else if (wheelDelta < -40) {
                    // Scrolling Up
                    if (currentPage === 3) {
                        transitionToPage2FromPage3();
                    } else if (currentPage === 2) {
                        transitionToPage1();
                    }
                }
                wheelDelta = 0;
            }, 40);
        },
        { passive: true },
    );

    // Touch / Swipe support for mobile & tablet
    let touchStartY = 0;
    window.addEventListener(
        "touchstart",
        (e) => {
            touchStartY = e.touches[0].clientY;
        },
        { passive: true },
    );

    window.addEventListener(
        "touchend",
        (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            if (diff > 50) {
                // Swiping Up (Scroll Down)
                if (currentPage === 1) {
                    transitionToPage2();
                } else if (currentPage === 2) {
                    transitionToPage3();
                }
            } else if (diff < -50) {
                // Swiping Down (Scroll Up)
                if (currentPage === 3) {
                    transitionToPage2FromPage3();
                } else if (currentPage === 2) {
                    transitionToPage1();
                }
            }
        },
        { passive: true },
    );

    // Click on scroll prompts
    if (scrollPrompt) {
        scrollPrompt.addEventListener("click", () => {
            transitionToPage2();
        });
    }
    if (scrollUpPrompt) {
        scrollUpPrompt.addEventListener("click", () => {
            transitionToPage1();
        });
    }
    if (scrollDownPrompt2) {
        scrollDownPrompt2.addEventListener("click", () => {
            transitionToPage3();
        });
    }
    if (scrollUpPrompt3) {
        scrollUpPrompt3.addEventListener("click", () => {
            transitionToPage2FromPage3();
        });
    }

    // Start sequence immediately
    runSequence();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
