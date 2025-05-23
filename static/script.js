fetch("https://api.github.com/users/petrusjohannesmaas/repos")
    .then(res => res.json())
    .then(repos => {
        const mostUsedLanguage = getMostUsedLanguage(repos);
        const totalIssues = getTotalIssues(repos);

        const langDiv = document.createElement("div");
        langDiv.innerHTML = `
            <p><strong>Most Used Language:</strong> ${mostUsedLanguage}</p>
            <p><strong>Total Open Issues:</strong> ${totalIssues}</p>
        `;
        document.querySelector(".git-metrics").appendChild(langDiv);
    });

function getMostUsedLanguage(repos) {
    const langCount = {};
    repos.forEach(repo => {
        const lang = repo.language;
        if (lang) langCount[lang] = (langCount[lang] || 0) + 1;
    });
    return Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
}

function getTotalIssues(repos) {
    return repos.reduce((total, repo) => total + repo.open_issues_count, 0);
}
// Fetch general user activity
fetch("https://api.github.com/users/petrusjohannesmaas")
    .then(res => res.json())
    .then(data => {
        const info = document.createElement("div");
        info.innerHTML = `
            <p><strong>Total Public Repositories:</strong> ${data.public_repos}</p>
        `;
        document.querySelector(".card-content").appendChild(info);
    });

// Fetch recent public events (last pushes, PRs, commits)
fetch("https://api.github.com/users/petrusjohannesmaas/events")
    .then(res => res.json())
    .then(events => {
        const recentPushes = events
            .filter(event => event.type === "PushEvent")
            .slice(0, 3); // Last 3 push events

        const pushDiv = document.createElement("div");
        pushDiv.innerHTML = `<h4 class="title is-5">Recent Activity</h4><hr>`;

        recentPushes.forEach(push => {
            const repoName = push.repo.name;
            const commitMessage = push.payload.commits[0]?.message;
            const time = new Date(push.created_at).toLocaleString();

            pushDiv.innerHTML += `
                <p><strong>${repoName}</strong></p>
                <p>📝 ${commitMessage}</p>
                <p>⏱️ ${time}</p>
                <hr>
            `;
        });

        document.querySelector(".recent-activity").appendChild(pushDiv);
    });

// // Scroll to project section
document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("#portfolio-button");
    const targetSection = document.querySelector("#projects-section");

    button.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default navigation
        targetSection.scrollIntoView({ behavior: "smooth" });
    });
});


// Styling and tags for all unstarted projects
document.querySelectorAll("td").forEach(td => {
    if (td.querySelector(".fa-solid.fa-spinner")) {
        td.style.opacity = "0.25";
    }
});
// Styling for completed projects
document.querySelectorAll("td").forEach(td => {
    if (td.querySelector(".fa-solid.fa-check")) {
        td.querySelectorAll("a").forEach(a => {
            a.classList.add("glow"); // Adds the 'glow' class to anchors
        });
    }
});
// Redirect to tabs instead of reloading
document.addEventListener("DOMContentLoaded", function () {
    let links = document.querySelectorAll("a");
    links.forEach(link => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer"); // Security best practice
    });
});
// Tags auto classes
document.addEventListener("DOMContentLoaded", () => {
    const parent = document.querySelector(".tags");
    const spans = parent.querySelectorAll("span");

    spans.forEach((span) => {
        span.classList.add("tag"); // Add 'tag' class to each <span>

        const icon = span.querySelector("i");
        if (icon) {
            icon.classList.add("mr-1"); // Add 'mr-1' class to each <i>
        }
    });
});
// Progress total calculation
document.addEventListener("DOMContentLoaded", () => {
    const progressBars = document.querySelectorAll(".progress");
    const totalSpan = document.querySelector("#total");

    let totalProgress = 0;
    let totalMax = 0;

    progressBars.forEach(progress => {
        totalProgress += parseInt(progress.getAttribute("value"), 10);
        totalMax += parseInt(progress.getAttribute("max"), 10);
    });

    const percentage = ((totalProgress / totalMax) * 100).toFixed(2);

    totalSpan.textContent = `${percentage} %`;
});


// Navbar menu
document.addEventListener('DOMContentLoaded', () => {
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Modal behaviour
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        document.getElementById("loading-overlay").style.display = "none";
    }, 2000);
});