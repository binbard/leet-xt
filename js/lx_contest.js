async function toggleFriendMode() {
    let table_container = document.querySelector('.table-responsive');

    if (!table_container) return;        // prob on future on contest page
    let original_table = table_container.querySelector('#fx-ranking-table');
    let friend_table = table_container.querySelector('#fx-friend-table');

    let pagination_nav = document.querySelector('nav[class^="pagination-base"]');

    if (original_table == null) {           // friend_table will also be null
        table_container.querySelector('table').id = "fx-ranking-table";
        original_table = table_container.querySelector('#fx-ranking-table');
        original_table.style.display = "none";

        table_container.innerHTML += friend_table_html;
        friend_table = table_container.querySelector('#fx-friend-table');
        friend_table.style.display = "none";
    }

    let div = document.querySelector('#lx-people-mode');
    if (div.querySelector('#lx-people-dark') == null) {
        div.innerHTML = people_dark_svg;
        original_table.style.display = "none";
        friend_table.style.display = "none";
        friend_table.style.display = "table";
        pagination_nav.style.display = "none";

        if (friend_table.classList.contains('done')) return;
        friend_table.classList.add('done');
        await setContestFriends();
    } else {
        div.innerHTML = people_light_svg;
        original_table.style.display = "none";
        friend_table.style.display = "none";
        original_table.style.display = "table";
        pagination_nav.style.display = "none";
        pagination_nav.style.display = "block";
    }
}

async function addContestFriendIcon() {
    let contest_header = document.querySelector('.ranking-title-wrapper');      // on ranking page
    if (!contest_header) return;
    if (document.querySelector('#lx-people-mode')) return;

    let div = document.createElement('div');
    div.id = "lx-people-mode";
    div.style = "cursor: pointer; margin-left: 10px; padding-top: 2px;";
    div.innerHTML = people_light_svg;
    contest_header.appendChild(div);
    div.addEventListener('click', toggleFriendMode);
}

async function getUserContestDetails(username) {
    const proxy = "https://corsproxy.io/?";
    const url = proxy + "https://lccn.lbao.site/api/v1/contest-records/user";
    const contest_name = window.location.pathname.split("/")[2];
    const res = await makeRequest(url + "?username=" + username + "&contest_name=" + contest_name);
    /* SAMPLE RESULT DATA
            [
        {
            "_id": "64f406d063900e4acc4931a2",
            "contest_name": "weekly-contest-361",
            "contest_id": 899,
            "username": "usephysics",
            "user_slug": "usephysics",
            "country_code": "IN",
            "country_name": "India",
            "rank": 4342,
            "score": 18,
            "finish_time": "2023-09-03T03:03:19",
            "data_region": "US",
            "insert_time": "2023-09-03T04:08:37.929000",
            "attendedContestsCount": 48,
            "old_rating": 1578.3541615854353,
            "new_rating": 3309.879095204823,
            "delta_rating": 31.52493361938756,
            "predict_time": "2023-09-03T04:13:51.395000"
        }
    ]*/

    if (!res) return null;
    if(res == []) return 1;
    if (res.detail && res.detail.startsWith('contest not found')) return -1;

    let user_contest_details = {
        rank: res[0] ? res[0].rank : "N/A",
        score: res[0] ? res[0].score : "N/A",
        old_rating: res[0] ? res[0].old_rating : "N/A",
        delta_rating: res[0] ? res[0].delta_rating : "N/A",
        new_rating: res[0] ? res[0].new_rating : "N/A",
    }
    return user_contest_details;
}

async function setContestFriends() {
    let friend_table = document.querySelector('#fx-friend-table');
    let friend_table_body = friend_table.querySelector('tbody');
    friend_table_body.innerHTML = "";
    let friend_list = [];

    const result = await browser.storage.local.get(['myfriends']);
    let myfriends = result.myfriends;
    let loaded = 1;
    let contest_not_found = false;
    let error = false;

    if (!myfriends) myfriends = [];

    let promises = myfriends.map(async (friend) => {
        friend_table_body.innerHTML = `<tr><td colspan="6" style="text-align: center;">Loading ${Math.round(loaded / myfriends.length * 100)}%</td></tr>`;
        let row = document.createElement('tr');
        let user_contest_details = await getUserContestDetails(friend);
        if (!user_contest_details) {
            error = true;
            return;
        }
        if (user_contest_details == 1) return;
        if (user_contest_details == -1) {
            contest_not_found = true;
            return;
        }
        user_contest_details.username = friend;
        friend_list.push(user_contest_details);
        loaded++;
    });
    await Promise.all(promises);

    friend_list.sort((a, b) => {
        if (a.rank == "N/A" && b.rank == "N/A") return 0;
        if (a.rank == "N/A") return 1;
        if (b.rank == "N/A") return -1;
        return parseInt(a.rank) - parseInt(b.rank);
    });
    friend_table_body.innerHTML = "";
    if (error) {
        friend_table_body.innerHTML = `<tr><td colspan="6" style="text-align: center;">Error loading data</td></tr>`;
        alert(update_message);
    } else
    if (contest_not_found) {
        friend_table_body.innerHTML = `<tr><td colspan="6" style="text-align: center;">No data available</td></tr>`;
    } else if (friend_list.length == 0) {
        friend_table_body.innerHTML = `<tr><td colspan="6" style="text-align: center;">No friend added</td></tr>`;
    }
    for (let friend of friend_list) {
        let row = document.createElement('tr');
        row.innerHTML = `<td>${friend.rank}</td><td><a href="/${friend.username}">${friend.username}</a></td><td>${friend.score}</td><td>${friend.old_rating == "N/A" ? "" : parseInt(friend.old_rating)}</td><td>${friend.delta_rating == "N/A" ? "" : parseInt(friend.delta_rating)}</td><td>${friend.new_rating == "N/A" ? "" : parseInt(friend.new_rating)}</td>`;
        friend_table_body.appendChild(row);
    }

}