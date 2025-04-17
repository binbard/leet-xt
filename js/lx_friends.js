async function addFriendsIconOnNavbar() {
    const button = document.querySelector('button.flex.items-center.focus\\:outline-none span#navbar_user_avatar')?.closest('button');

    if (!button) return;

    const parent = button.parentElement;
    const grandparent = parent?.parentElement;

    if (!parent || parent.classList.contains('done')) return;
    parent.classList.add('done');

    const a = document.createElement('a');
    a.href = 'https://leetcode.com/friends/';
    a.setAttribute('class', 'group relative flex h-8 p-1 items-center justify-center rounded hover:bg-fill-3 dark:hover:bg-dark-fill-3');
    a.innerHTML = people_icon_svg;

    const svg = a.querySelector('svg');
    svg.setAttribute('class', 'h-[20px] w-[20px] group-hover:text-text-primary dark:group-hover:text-dark-text-primary text-text-secondary dark:text-dark-text-secondary');
    svg.setAttribute('fill', 'currentColor');

    grandparent.parentElement.parentElement.insertBefore(a, grandparent.parentElement);
}

async function handleFriendsPage() {
    let jsTimer = setInterval(function () { document.title = "Friends - LeetCode" }, 69);
    setTimeout(function () { clearInterval(jsTimer) }, 2000);

    await makeFriendsPage();
}

async function getUserDetails(username) {
    const data = {
        query: `query userCombinedInfo($username: String!) { 
                matchedUser(username: $username) { 
                    profile { 
                        userAvatar 
                        realName 
                    } 
                } 
                userContestRanking(username: $username) { 
                    attendedContestsCount 
                    rating 
                    topPercentage 
                } 
                matchedUser(username: $username) { 
                    submitStatsGlobal { 
                        acSubmissionNum { 
                            count 
                        } 
                    } 
                } 
            }`,
        variables: {
            username: username
        }
    };

    const res = await makeRequest('https://leetcode.com/graphql', data);
    if (!res) return null;
    if (!res.data.matchedUser) return -1;

    const details = {
        username: username,
        avatar: res.data.matchedUser.profile.userAvatar,
        name: res.data.matchedUser.profile.realName,
        rating: res.data.userContestRanking ? res.data.userContestRanking.rating : "-",
        contests: res.data.userContestRanking ? res.data.userContestRanking.attendedContestsCount : "-",
        problems_solved: res.data.matchedUser.submitStatsGlobal.acSubmissionNum[0].count,
        easy: res.data.matchedUser.submitStatsGlobal.acSubmissionNum[1].count,
        medium: res.data.matchedUser.submitStatsGlobal.acSubmissionNum[2].count,
        hard: res.data.matchedUser.submitStatsGlobal.acSubmissionNum[3].count,
        top: res.data.userContestRanking ? res.data.userContestRanking.topPercentage : "-"
    };

    return details;
}


async function addFriendRow(username, rowgroup) {

    let details = await getUserDetails(username);
    if (!details) return;
    if (details == -1) {
        removeFriend(username);
        alert("User " + username + " does not exist. Removed from friends list.");
        return;
    }

    let { name, avatar, rating, contests, problems_solved, easy, medium, hard, top } = details;

    if (!name) name = username;
    else name = username + " (" + name + ")";

    let div = document.createElement('div');
    div.innerHTML = friends_row;
    let row = div.querySelector('div');
    row.querySelector('.lx-favatar').src = avatar;
    row.querySelector('.lx-fname').innerHTML = name;
    row.querySelector('.lx-fname').href = "https://leetcode.com/" + username;

    let hoverCard = document.createElement('iframe');
    hoverCard.setAttribute('class', 'absolute hidden p-0 m-0 rounded-xl w-[300px] h-[120px]');

    row.querySelector('.lx-fname').appendChild(hoverCard);
    row.querySelector('.lx-fname').addEventListener('mouseenter', function () {
        hoverCard.classList.remove('hidden');
        hoverCard.style.opacity = "0";
        let theme;
        if (isDarkTheme()) {
            theme = 'nord';
            hoverCard.style.border = "none";
        } else {
            theme = 'light';
            hoverCard.style.border = "1px solid #E5E7EB";
        }
        hoverCard.src = `https://leetcard.jacoblin.cool/${username}?theme=${theme}&border=0&radius=10&sheets=https://bit.ly/M3NpQr7`;
    });

    row.querySelector('.lx-fname').addEventListener('mouseleave', function () {
        hoverCard.classList.add('hidden');
    });

    hoverCard.addEventListener('load', function () {
        hoverCard.style.opacity = "1";
    });

    row.querySelector('.lx-frating').innerHTML = rating == "-" ? rating : Math.round(rating);
    row.querySelector('.lx-fnumcontest').innerHTML = contests == "-" ? "" : "(" + contests + ")";
    row.querySelector('.lx-ftotal').innerHTML = problems_solved;
    row.querySelector('.lx-feasy').innerHTML = easy;
    row.querySelector('.lx-fmedium').innerHTML = medium;
    row.querySelector('.lx-fhard').innerHTML = hard;
    row.querySelector('.lx-ftop').innerHTML = top == "-" ? top : top + "%";

    rowgroup.appendChild(row);
}

async function makeFriendsPage() {
    let area = document.querySelector('.mx-auto');
    if (!area) return

    area.innerHTML = friends_table;

    let fx_headers = ['fx-huser', 'fx-hrating', 'fx-hprobsolved'];
    for (let i = 0; i < fx_headers.length; i++) {
        let fx_header = area.querySelector('#' + fx_headers[i]);
        fx_header.parentElement.querySelector('svg').innerHTML = updown_arrow;
        fx_header.parentElement.querySelector('svg').classList.add('lx-updown');
        fx_header.parentElement.querySelector('svg').classList.remove('lx-down');
        fx_header.parentElement.querySelector('svg').classList.remove('lx-up');
        fx_header.parentElement.querySelector('svg').setAttribute('viewBox', '0 0 24 24');
    }

    let data = await browser.storage.local.get(['myfriends']);
    myfriends = data.myfriends || [];

    let huser = document.querySelector('#fx-huser');
    let hrating = document.querySelector('#fx-hrating');
    let hprobsolved = document.querySelector('#fx-hprobsolved');

    huser.textContent = huser.textContent + ` (${myfriends.length}/50)`;

    let rowgroup = document.querySelector('#friends-rowgroup');

    if (myfriends.length == 0) {
        rowgroup.innerHTML = '<div class="text-center text-gray-5 dark:text-dark-gray-5">No Friends Added</div>';
        return;
    }

    let promises = myfriends.map(async (username) => {
        await addFriendRow(username, rowgroup);
    });
    await Promise.all(promises);
}


async function makeFriendsPage() {
    let area = document.querySelector('.mx-auto');
    if (!area) return

    area.innerHTML = friends_table;

    let fx_headers = ['fx-huser', 'fx-hrating', 'fx-hprobsolved', 'fx-htop'];

    const resetSortingIcons = () => {
        for (let i = 0; i < fx_headers.length; i++) {
            let fx_header = area.querySelector('#' + fx_headers[i]);
            fx_header.parentElement.querySelector('svg').innerHTML = updown_arrow;
            fx_header.parentElement.querySelector('svg').classList.add('lx-updown');
            fx_header.parentElement.querySelector('svg').classList.remove('lx-down');
            fx_header.parentElement.querySelector('svg').classList.remove('lx-up');
            fx_header.parentElement.querySelector('svg').setAttribute('viewBox', '0 0 24 24');
        }
    }

    resetSortingIcons();

    for (let i = 0; i < fx_headers.length; i++) {
        let fx_header = area.querySelector('#' + fx_headers[i]);
        fx_header.parentElement.querySelector('svg').innerHTML = updown_arrow;
        fx_header.parentElement.querySelector('svg').classList.add('lx-updown');
        fx_header.parentElement.querySelector('svg').classList.remove('lx-down');
        fx_header.parentElement.querySelector('svg').classList.remove('lx-up');
        fx_header.parentElement.querySelector('svg').setAttribute('viewBox', '0 0 24 24');
    }

    let data = await browser.storage.local.get(['myfriends']);
    myfriends = data.myfriends || [];

    let huser = document.querySelector('#fx-huser');
    let hrating = document.querySelector('#fx-hrating');
    let hprobsolved = document.querySelector('#fx-hprobsolved');
    let htop = document.querySelector('#fx-htop');

    huser.textContent = huser.textContent + ` (${myfriends.length}/50)`;

    let rowgroup = document.querySelector('#friends-rowgroup');

    if (myfriends.length == 0) {
        rowgroup.innerHTML = '<div class="text-center text-gray-5 dark:text-dark-gray-5">No Friends Added</div>';
        return;
    }

    let promises = myfriends.map(async (username) => {
        await addFriendRow(username, rowgroup);
    });
    await Promise.all(promises);

    function sortTable(header, selector) {
        let asc = true;
        let fx_header_svg = header.parentElement.querySelector('svg');
    
        // Check if it's already in ascending order
        if (fx_header_svg.classList.contains('lx-up')) {
            asc = false;
        }
    
        // Toggle sorting order (ascending or descending)
        if (asc) {  // Currently in descending order
            resetSortingIcons();
            fx_header_svg.innerHTML = up_arrow;  // Change to ascending order
            fx_header_svg.classList.remove('lx-updown');
            fx_header_svg.classList.remove('lx-down');
            fx_header_svg.classList.add('lx-up');
        } else {
            resetSortingIcons();
            fx_header_svg.innerHTML = down_arrow;  // Change to descending order
            fx_header_svg.classList.remove('lx-updown');
            fx_header_svg.classList.remove('lx-up');
            fx_header_svg.classList.add('lx-down');
        }
        fx_header_svg.setAttribute('viewBox', '0 0 14 14');
    
        let table, rows, switching, i, x, y, shouldSwitch;
        table = document.querySelector("#friends-rowgroup");
        switching = true;
    
        // Continue sorting while necessary
        while (switching) {
            switching = false;
            rows = table.querySelectorAll(".lx-frow");
    
            // Loop through all rows to determine whether to switch them
            for (i = 0; i < rows.length - 1; i++) {
                shouldSwitch = false;
                x = rows[i].querySelector(selector);
                y = rows[i + 1].querySelector(selector);
    
                let xval = x.innerHTML.trim();
                let yval = y.innerHTML.trim();
    
                // Handle sorting for name (alphabetical sorting)
                if (selector === '.lx-fname') {
                    // Compare names in a case-insensitive manner
                    xval = xval.toLowerCase();
                    yval = yval.toLowerCase();
                }
    
                // Handle special cases for values like "-" or percentages
                if (xval === "-") xval = "0";  // Treat "-" as "0"
                if (yval === "-") yval = "0";
    
                // Check if the values are numeric or percentages (e.g., 0.01%)
                if (xval.includes('%')) {
                    xval = parseFloat(xval.replace('%', '')) / 100;
                }
                if (yval.includes('%')) {
                    yval = parseFloat(yval.replace('%', '')) / 100;
                }
    
                // Try to parse as numbers if possible
                if (!isNaN(xval)) {
                    xval = parseFloat(xval);
                }
                if (!isNaN(yval)) {
                    yval = parseFloat(yval);
                }
    
                // Determine if the rows should switch based on the sorting order
                if (asc) {
                    if (xval > yval) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (xval < yval) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
    
            // If rows should switch, perform the switch and continue checking
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }      

    huser.parentElement.addEventListener("click", function () {
        sortTable(this, '.lx-fname');
    });

    hrating.parentElement.addEventListener("click", function () {
        sortTable(this, '.lx-frating');
    });

    hprobsolved.parentElement.addEventListener("click", function () {
        sortTable(this, '.lx-ftotal');
    });

    htop.parentElement.addEventListener("click", function () {
        sortTable(this, '.lx-ftop');
    });
}

function addFriendButton() {
    let jsTimer = setInterval(addStar, 69);
    setTimeout(function () { clearInterval(jsTimer) }, 2000);

    function addStar() {
        let name_box = document.querySelector(".text-label-1.break-all.text-base.font-semibold");
        if (!name_box) return;
        clearInterval(jsTimer);

        if (name_box.classList.contains("done")) return;
        name_box.classList.add("done");

        let name_box_gp = name_box.parentElement.parentElement;
        let uname_box = name_box_gp.querySelector(".text-label-3");
        if (uname_box.innerHTML == "") uname_box = name_box_gp.querySelector(".text-label-1");
        uname_box.id = "uname-box";

        let star = document.createElement('div');
        star.innerHTML = star_icon_svg;
        star.id = "star-icon";
        star.style.cursor = "pointer";
        name_box.parentNode.appendChild(star);
        name_box.parentNode.classList.add("flex", "items-center", "space-x-2");

        star.addEventListener("click", toggleFriend);
        toggleFriend(1);
    }
}

function toggleFriend(loading = 0) {
    let friend_color = 'rgb(255, 226, 96)';         // #ffe260
    let not_friend_color = 'rgb(204, 204, 215)';    // #ccccd7

    let star = document.querySelector("#star-icon");
    let star_path = star.querySelector('path');

    let uname_box = document.querySelector("#uname-box");
    let username = uname_box.innerHTML;
    // console.log(username)

    browser.storage.local.get('myfriends', function (result) {
        myfriends = result.myfriends;
        myfriends = myfriends || [];

        if (loading == 1) {
            if (myfriends.includes(username)) {         // User is Friend
                star_path.style.fill = friend_color;
            } else {                                    // User is not Friend
                star_path.style.fill = not_friend_color;
            }
            return;
        }

        if (myfriends.includes(username)) {         // User is Friend, Remove it
            star_path.style.fill = not_friend_color;
            removeFriend(username, myfriends);
        } else {                                    // User is not Friend, Add it
            if (myfriends.length >= 50) {
                alert("You can only add upto 50 friends, ensuring an inclusive and sustainable experience for everyone!");
                return;
            }
            star_path.style.fill = friend_color;
            addFriend(username, myfriends);
        }
    });
}
