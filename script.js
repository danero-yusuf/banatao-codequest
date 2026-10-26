
document.addEventListener("DOMContentLoaded", function () {

    // Automatically update the footer year
    document.querySelectorAll("[data-current-year]").forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });

    // COPY CODE BUTTONS
    document.querySelectorAll("[data-copy]").forEach(function (button) {
        button.addEventListener("click", async function () {
            const codeId = button.getAttribute("data-copy");
            const codeElement = document.getElementById(codeId);

            if (!codeElement) {
                button.textContent = "CODE NOT FOUND";
                return;
            }

            const codeText = codeElement.innerText;
            const originalText = button.textContent;

            try {
                await navigator.clipboard.writeText(codeText);
                button.textContent = "COPIED! ✓";
            } catch (error) {
                // Fallback for browsers that block clipboard access
                const textArea = document.createElement("textarea");
                textArea.value = codeText;
                textArea.style.position = "fixed";
                textArea.style.opacity = "0";

                document.body.appendChild(textArea);
                textArea.select();

                const copied = document.execCommand("copy");
                textArea.remove();

                button.textContent = copied ? "COPIED! ✓" : "COPY FAILED";
            }

            setTimeout(function () {
                button.textContent = originalText;
            }, 1800);
        });
    });

    // QUIZ FUNCTIONALITY
    const quizForm = document.getElementById("quizForm");
    const feedback = document.getElementById("quizFeedback");

    if (quizForm && feedback) {

        const correctAnswers = {
            q1: "a",
            q2: "b",
            q3: "c",
            q4: "b",
            q5: "c"
        };

        quizForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const formData = new FormData(quizForm);
            let score = 0;
            const totalQuestions = Object.keys(correctAnswers).length;

            for (const question in correctAnswers) {
                if (formData.get(question) === correctAnswers[question]) {
                    score++;
                }
            }

            let message = "";

            if (score === totalQuestions) {
                message = "🕷️ AMAZING! You're a true coding superhero!";
            } else if (score >= 3) {
                message = "💥 GREAT JOB! Keep practicing your coding skills!";
            } else {
                message = "🕸️ KEEP TRAINING! Review your lessons and try again.";
            }

            feedback.textContent =
                "YOUR SCORE: " + score + " / " + totalQuestions +
                ". " + message;
        });

        quizForm.addEventListener("reset", function () {
            feedback.textContent = "";
        });
    }



    // =================================
    // CODEQUEST INTERACTIVE PLAYGROUND
    // HTML + CSS EDITORS
    // =================================

    const playgroundEditor = document.getElementById("playgroundEditor");
    const playgroundCSS = document.getElementById("playgroundCSS");
    const playgroundPreview = document.getElementById("playgroundPreview");
    const runPlayground = document.getElementById("runPlayground");
    const resetPlayground = document.getElementById("resetPlayground");
    const playgroundStatus = document.getElementById("playgroundStatus");

    // Only run this feature on pages containing the playground
    if (
        playgroundEditor &&
        playgroundCSS &&
        playgroundPreview &&
        runPlayground &&
        resetPlayground &&
        playgroundStatus
    ) {
        // Save the original HTML and CSS for Reset
        const starterHTML = playgroundEditor.value;
        const starterCSS = playgroundCSS.value;

        // RUN HTML AND CSS
        function runCodeQuest() {
            const htmlCode = playgroundEditor.value;
            const cssCode = playgroundCSS.value;

            // Protect the preview's style element
            const safeCSS = cssCode.replace(
                /<\/style/gi,
                "<\\/style"
            );

            // Combine the HTML and CSS in the preview
            const completeCode = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0">
                    <style>${safeCSS}</style>
                </head>
                <body>
                    ${htmlCode}
                </body>
                </html>
            `;

            playgroundPreview.srcdoc = completeCode;

            playgroundStatus.textContent =
                "✓ Preview updated! Check your webpage below.";
        }

        // RUN CODE BUTTON
        runPlayground.addEventListener("click", function () {
            runCodeQuest();
        });

        // RESET CODE BUTTON
        resetPlayground.addEventListener("click", function () {
            playgroundEditor.value = starterHTML;
            playgroundCSS.value = starterCSS;

            runCodeQuest();

            playgroundStatus.textContent =
                "↻ HTML and CSS reset! Your starter example is ready.";
        });

        // Show the starter webpage when the page loads
        runCodeQuest();
    }


// ==========================================
// CODEQUEST HERO MISSION BOARD
// ADD INSIDE THE EXISTING DOMContentLoaded
// FUNCTION, BEFORE ITS FINAL CLOSING });
// ==========================================

const missionBoard = document.getElementById("hero-missions");

if (missionBoard) {
    const missionButtons = missionBoard.querySelectorAll(
        "[data-mission-complete]"
    );

    const missionsCompletedDisplay =
        document.getElementById("missionsCompleted");

    const heroXPDisplay =
        document.getElementById("heroXP");

    const missionProgressText =
        document.getElementById("missionProgressText");

    const missionProgressFill =
        document.getElementById("missionProgressFill");

    const missionProgressTrack =
        document.getElementById("missionProgressTrack");

    const missionCompletionMessage =
        document.getElementById("missionCompletionMessage");

    const missionMessageTitle =
        document.getElementById("missionMessageTitle");

    const missionMessageText =
        document.getElementById("missionMessageText");

    const resetMissionsButton =
        document.getElementById("resetMissions");

    const totalMissions = 5;
    const xpPerMission = 100;
    const storageKey = "codequestHeroMissionsV1";

    // Track completed missions by their number.
    let completedMissions = [];

    // Try to restore saved progress from this browser.
    try {
        const savedProgress = JSON.parse(
            localStorage.getItem(storageKey) || "[]"
        );

        if (Array.isArray(savedProgress)) {
            completedMissions = savedProgress.filter(function (number) {
                return (
                    Number.isInteger(number) &&
                    number >= 1 &&
                    number <= totalMissions
                );
            });

            // Remove duplicate mission numbers.
            completedMissions = [...new Set(completedMissions)];
        }
    } catch (error) {
        // The board still works if browser storage is unavailable.
        completedMissions = [];
    }

    // Save progress when browser storage is available.
    function saveMissionProgress() {
        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(completedMissions)
            );
        } catch (error) {
            // Progress will still work until the page is closed.
        }
    }

    // Update the mission cards, XP, and progress bar.
    function updateMissionBoard() {
        const completedCount = completedMissions.length;
        const totalXP = completedCount * xpPerMission;
        const percentage = Math.round(
            (completedCount / totalMissions) * 100
        );

        missionsCompletedDisplay.textContent =
            completedCount + "/" + totalMissions;

        heroXPDisplay.textContent = totalXP + " XP";

        missionProgressText.textContent =
            percentage + "% Complete";

        missionProgressFill.style.width = percentage + "%";

        missionProgressTrack.setAttribute(
            "aria-valuenow",
            percentage
        );

        missionButtons.forEach(function (button) {
            const missionNumber = Number(
                button.dataset.missionComplete
            );

            const isComplete =
                completedMissions.includes(missionNumber);

            const missionCard = button.closest(".mission-card");

            const missionStatus = document.getElementById(
                "missionStatus" + missionNumber
            );

            if (missionCard) {
                missionCard.classList.toggle(
                    "is-complete",
                    isComplete
                );
            }

            if (missionStatus) {
                missionStatus.textContent = isComplete
                    ? "✓ COMPLETED"
                    : "NOT STARTED";
            }

            button.disabled = isComplete;

            button.textContent = isComplete
                ? "✓ MISSION COMPLETE!"
                : "MARK AS COMPLETE";
        });

        // Show a message based on the student's progress.
        missionCompletionMessage.classList.remove(
            "all-missions-complete"
        );

        if (completedCount === totalMissions) {
            missionMessageTitle.textContent =
                "🎉 YOU ARE A CODEQUEST HERO!";

            missionMessageText.textContent =
                "Amazing work! You completed all 5 missions and earned " +
                totalXP +
                " XP. You are ready for your next coding adventure!";

            missionCompletionMessage.classList.add(
                "all-missions-complete"
            );
        } else if (completedCount > 0) {
            missionMessageTitle.textContent =
                "💥 GREAT JOB, HERO!";

            missionMessageText.textContent =
                "You completed " +
                completedCount +
                " out of " +
                totalMissions +
                " missions. Keep going to earn more Hero Points!";
        } else {
            missionMessageTitle.textContent =
                "YOUR ADVENTURE BEGINS!";

            missionMessageText.textContent =
                "Complete your first mission and start earning Hero Points!";
        }
    }

    // Mark a mission complete and award its XP.
    missionButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const missionNumber = Number(
                button.dataset.missionComplete
            );

            // Prevent the same mission from awarding XP twice.
            if (completedMissions.includes(missionNumber)) {
                return;
            }

            completedMissions.push(missionNumber);

            saveMissionProgress();
            updateMissionBoard();

            // Announce the reward to screen readers.
            missionCompletionMessage.setAttribute(
                "aria-label",
                "Mission " +
                    missionNumber +
                    " completed. You earned " +
                    xpPerMission +
                    " XP."
            );
        });
    });

    // Reset all mission progress.
    resetMissionsButton.addEventListener("click", function () {
        const shouldReset = window.confirm(
            "Are you sure you want to reset all mission progress and XP?"
        );

        if (!shouldReset) {
            return;
        }

        completedMissions = [];

        saveMissionProgress();
        updateMissionBoard();

        missionCompletionMessage.setAttribute(
            "aria-label",
            "Mission progress has been reset."
        );
    });

    // Display saved progress when the page loads.
    updateMissionBoard();
}

});
