async function toggleFriendMode() {
  let table_container = document.querySelector(
    ".relative.flex.w-full.justify-center"
  );

  if (!table_container) return; // prob on future on contest page'
  let original_table = table_container.querySelector("#fx-ranking-table");
  let friend_table = table_container.querySelector("#fx-friend-table");

  let pagination_nav = document.querySelector('nav[role="navigation"');

  if (original_table == null) {
    // friend_table will also be null
    table_container.querySelector(".relative.flex.w-full.flex-col").id =
      "fx-ranking-table";
    original_table = table_container.querySelector("#fx-ranking-table");
    original_table.style.display = "none";

    table_container.innerHTML += friend_table_html;
    friend_table = table_container.querySelector("#fx-friend-table");
    friend_table.style.display = "none";
  }

  let div = document.querySelector("#lx-people-mode");
  if (div.querySelector("#lx-people-dark") == null) {
    div.innerHTML = people_dark_svg;
    original_table.style.display = "none";
    friend_table.style.display = "none";
    friend_table.style.display = "table";
    pagination_nav.style.display = "none";

    if (friend_table.classList.contains("done")) return;
    friend_table.classList.add("done");
    await setContestFriends();
  } else {
    div.innerHTML = people_light_svg;
    original_table.style.display = "none";
    friend_table.style.display = "none";
    original_table.style.display = "table";
    pagination_nav.style.display = "none";
    pagination_nav.style.display = "flex";
  }
}

var vContestTitleMutObserver = null;

function addContestFriendIcon() {
  let contest_header = document.querySelector(".mx-auto.w-full");
  vContestTitleMutObserver = mutObserve(
    contest_header,
    addContestFriendIconAction
  );
}

async function addContestFriendIconAction() {
  if (vContestTitleMutObserver) vContestTitleMutObserver.disconnect();
  let contest_header = document.querySelector(
    ".lc-xl\\:gap-6.lc-md\\:gap-4.flex.flex-col.gap-3"
  ); // on ranking page
  console.log("contest_header", contest_header);
  if (!contest_header) return;
  if (document.querySelector("#lx-people-mode")) return;
  let div = document.createElement("div");
  div.id = "lx-people-mode";
  div.style =
    "cursor: pointer; margin-right: 350px; padding-top: 10px; display: inline-flex; align-items: center;";
  div.innerHTML = `${people_light_svg}`;
  contest_header.parentElement.insertBefore(div, contest_header.nextSibling);
  div.addEventListener("click", toggleFriendMode);
}

async function getUserContestDetails(username) {
  const proxy = "https://wandb-berm-1c80.public-antagonist-58.workers.dev/?";
  const url = proxy + "https://lccn.lbao.site/api/v1/contest-records/user";
  const contest_name = window.location.pathname.split("/")[2];
  const makeRequestPromise = makeRequest(
    url + "?username=" + username + "&contest_name=" + contest_name
  );
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(69), 25000, "Request timed out");
  });
  const res = await Promise.race([makeRequestPromise, timeoutPromise]);
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
  if (res == []) return 1;
  if (res.detail && res.detail.startsWith("contest not found")) return -1;

  if (res == 69) {
    let user_contest_details = {
      rank: "-",
      score: "-",
      old_rating: "-",
      delta_rating: "-",
      new_rating: "-",
    };
    return user_contest_details;
  }

  let user_contest_details = {
    rank: res[0] ? res[0].rank : "N/A",
    score: res[0] ? res[0].score : "N/A",
    old_rating: res[0] ? Math.round(res[0].old_rating) : "",
    delta_rating: res[0] ? Math.round(res[0].delta_rating) : "",
    new_rating: res[0] ? Math.round(res[0].new_rating) : "",
  };
  return user_contest_details;
}

async function setContestFriends() {
  let friend_table = document.querySelector("#fx-friend-table");
  let friend_table_body = friend_table.querySelector("#fx-friend-table-body");
  friend_table_body.innerHTML = friend_table_body.children[0].outerHTML;
  let friend_list = [];

  const contest_name = window.location.pathname.split("/")[2];
  const result = await browser.storage.local.get(["myfriends"]);
  let myfriends = result.myfriends;
  let loaded = 1;
  let contest_not_found = false;
  let error = false;

  if (!myfriends) myfriends = [];

  let promises = myfriends.map(async (friend) => {
    if (contest_not_found) return;
    // friend_table_body.innerHTML = `<tr><td colspan="6" style="text-align: center;">Loading ${Math.round(loaded / myfriends.length * 100)}%</td></tr>`;
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
    friend_list.sort((a, b) => {
      if (a.rank == "N/A" && b.rank == "N/A") return 0;
      if (a.rank == "-") return 1;
      if (a.rank == "N/A") return 1;
      if (b.rank == "N/A") return -1;
      return a.rank - b.rank;
    });
    friend_table_body.innerHTML = friend_table_body.children[0].outerHTML;
    for (let friend of friend_list) {
      let row = getRankingTableRow(
        friend.rank,
        friend.username,
        friend.score,
        friend.old_rating,
        friend.delta_rating,
        friend.new_rating,
        contest_name
      );
      friend_table_body.appendChild(row);
    }
  });
  await Promise.all(promises);

  if (error) {
    friend_table_body.innerHTML = "";
    friend_table_body.innerHTML = getRankingTableRow("Error loading data");
  } else if (contest_not_found) {
    friend_table_body.innerHTML = "";
    friend_table_body.innerHTML = getRankingTableRow("No data available");
  } else if (friend_list.length == 0) {
    friend_table_body.innerHTML = "";
    friend_table_body.innerHTML = getRankingTableRow("No friends added");
  }
}

function getRankingTableRow(
  rank = "",
  name = "",
  score = "",
  old_rating = "",
  delta_rating = "",
  new_rating = "",
  contest_name = ""
) {
  let row = document.querySelector(".fx-friend-table-row");
  if (!row) return null;
  row = row.cloneNode(true);

  row.querySelector(
    ".row__rank"
  ).innerHTML = `<a href=https://leetcode.com/contest/${contest_name}/ranking/${
    Math.floor(rank / 25) + 1
  }/>${rank}</a>`;
  row.querySelector(".row__name").innerText = name;
  row.querySelector(".row__score").innerText = score;
  row.querySelector(".row__old-rating").innerText = old_rating;
  row.querySelector(".row__delta-rating").innerText = delta_rating;
  row.querySelector(".row__new-rating").innerText = new_rating;
  return row;
}
