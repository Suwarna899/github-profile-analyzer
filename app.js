async function getUser() {
    const username = document.getElementById("username").value;
    const result = document.getElementById("result");

    if (!username) {
        alert("Please enter a GitHub username");
        return;
    }

    result.innerHTML = "<p class='muted'>Loading profile...</p>";

    try {
        // Fetch user
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const user = await userRes.json();

        if (user.message === "Not Found") {
            result.innerHTML = "<p>User not found ❌</p>";
            return;
        }

        // Fetch repos
        const repoRes = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await repoRes.json();

        // Language count
        const langCount = {};

        repos.forEach(repo => {
            if (repo.language) {
                langCount[repo.language] = (langCount[repo.language] || 0) + 1;
            }
        });

        const labels = Object.keys(langCount);
        const data = Object.values(langCount);

        result.innerHTML = `
            <div class="card">
                <img src="${user.avatar_url}" width="100" />
                <h3>${user.name || user.login}</h3>
                <p class="muted">${user.bio || "No bio available"}</p>

                <p><b>Repos:</b> ${user.public_repos}</p>
                <p><b>Followers:</b> ${user.followers}</p>
                <p><b>Following:</b> ${user.following}</p>
                <p><b>Location:</b> ${user.location || "N/A"}</p>

                <h4>Top Repositories ⭐</h4>
                <ul>
                    ${repos
                        .sort((a, b) => b.stargazers_count - a.stargazers_count)
                        .slice(0, 5)
                        .map(r => `<li>${r.name} ⭐ ${r.stargazers_count}</li>`)
                        .join("")
                    }
                </ul>

                <h4>Top Languages 📊</h4>
                <canvas id="langChart"></canvas>
            </div>
        `;

        // Create chart
        new Chart(document.getElementById("langChart"), {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: data
                }]
            }
        });

    } catch (err) {
        result.innerHTML = "<p>Error fetching data ❌</p>";
    }
}