const people_icon_svg = '<svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 12.8168 3.1088 13.6081 3.31269 14.3603C3.72385 14.0549 4.18033 13.7872 4.67874 13.5718C4.25207 12.9917 3.99999 12.2753 3.99999 11.5C3.99999 9.567 5.56699 8 7.49999 8C9.43298 8 11 9.567 11 11.5C11 12.2753 10.7479 12.9918 10.3212 13.5718C10.7765 13.7685 11.1973 14.009 11.5808 14.2826C11.5933 14.2916 11.6057 14.3008 11.6177 14.3103C12.021 13.878 12.4936 13.4824 13.0284 13.1452C12.0977 12.4128 11.5 11.2762 11.5 10C11.5 7.79086 13.2908 6 15.5 6C17.7091 6 19.5 7.79086 19.5 10C19.5 10.8095 19.2595 11.5629 18.8461 12.1925C19.6192 12.3672 20.3212 12.6528 20.9432 13.0164C20.9807 12.6828 21 12.3436 21 12C21 7.02944 16.9706 3 12 3ZM10.4907 15.9573C10.4664 15.9429 10.4426 15.9274 10.4192 15.9107C9.65816 15.3678 8.67891 15 7.49999 15C6.06158 15 4.91073 15.5491 4.09526 16.3065C5.622 19.1029 8.58946 21 12 21C15.8853 21 19.1956 18.538 20.4559 15.089C20.4386 15.0778 20.4216 15.066 20.4048 15.0536C19.5686 14.4343 18.4544 14 17.0906 14C13.7836 14 12 16.529 12 18C12 18.5523 11.5523 19 11 19C10.4477 19 9.99999 18.5523 9.99999 18C9.99999 17.3385 10.1699 16.6377 10.4907 15.9573ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM15.5 8C14.3954 8 13.5 8.89543 13.5 10C13.5 11.1046 14.3954 12 15.5 12C16.6046 12 17.5 11.1046 17.5 10C17.5 8.89543 16.6046 8 15.5 8ZM5.99999 11.5C5.99999 10.6716 6.67156 10 7.49999 10C8.32841 10 8.99999 10.6716 8.99999 11.5C8.99999 12.3284 8.32841 13 7.49999 13C6.67156 13 5.99999 12.3284 5.99999 11.5Z"/></svg>';

const star_icon_svg = '<svg height="1em" width="1em" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve"><path style="fill:#ccccd7;" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"/></svg>';

const friends_table = '<div><div class="-mx-4 transition-opacity md:mx-0"><div role="table" style="min-width:0" class="border-spacing-0 overflow-auto"><div class="inline-block min-w-full"><div class="border-divider-border-2 dark:border-dark-divider-border-2 border-b"><div role="row" style="display:flex;flex:1 0 auto;min-width:0"><div colspan="1" role="columnheader" style="box-sizing:border-box;flex:22 0 auto;min-width:0;width:22px" class="mx-2 py-[11px] font-normal text-label-3 dark:text-dark-label-3"><div class="flex items-center justify-between"><div class="overflow-hidden text-ellipsis"></div></div></div><div colspan="1" role="columnheader" style="box-sizing:border-box;flex:180 0 auto;min-width:0;width:180px;cursor:pointer" class="mx-2 py-[11px] font-normal text-label-3 dark:text-dark-label-3 hover:text-gray-7 dark:hover:text-dark-gray-7 group"><div class="flex items-center justify-between"><div class="overflow-hidden text-ellipsis" id="fx-huser">Users</div><span class="text-gray-5 dark:text-dark-gray-5 ml-2 h-3.5 w-3.5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span></div></div><div colspan="1" role="columnheader" style="box-sizing:border-box;flex:84 0 auto;min-width:0;width:84px;cursor:pointer" class="mx-2 py-[11px] font-normal text-label-3 dark:text-dark-label-3 hover:text-gray-7 dark:hover:text-dark-gray-7 group"><div class="flex items-center justify-between"><div class="overflow-hidden text-ellipsis" id="fx-hrating">Rating</div><span class="text-gray-5 dark:text-dark-gray-5 ml-2 h-3.5 w-3.5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span></div></div><div colspan="1" role="columnheader" style="box-sizing:border-box;flex:144 0 auto;min-width:0;width:144px;cursor:pointer" class="mx-2 py-[11px] font-normal text-label-3 dark:text-dark-label-3 hover:text-gray-7 dark:hover:text-dark-gray-7 group"><div class="flex items-center justify-between"><div class="overflow-hidden text-ellipsis" id="fx-hprobsolved">Problems Solved</div><span class="text-gray-5 dark:text-dark-gray-5 ml-2 h-3.5 w-3.5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span></div></div><div colspan="1" role="columnheader" style="box-sizing:border-box;flex:54 0 auto;min-width:0;width:54px" class="mx-2 py-[11px] font-normal text-label-3 dark:text-dark-label-3"><div class="flex items-center justify-between"><div class="overflow-hidden text-ellipsis" id="fx-htop">Top</div></div></div></div></div><div role="rowgroup" id="friends-rowgroup"></div></div></div></div></div>';

const friends_row = '<div role="row" style="display:flex;flex:1 0 auto;min-width:0" class="odd:bg-layer-1 even:bg-overlay-1 dark:odd:bg-dark-layer-bg dark:even:bg-dark-fill-4 lx-frow"><div role="cell" style="box-sizing:border-box;flex:22 0 auto;min-width:0;width:22px" class="mx-2 flex items-center py-[11px]"><img src="https://assets.leetcode.com/users/neal_wu/avatar_1574529913.png" class="min-w-[20px] max-w-[20px] rounded-full object-cover lx-favatar" alt="neal_wu"></div><div role="cell" style="box-sizing:border-box;flex:180 0 auto;min-width:0;width:180px" class="mx-2 flex items-center py-[11px]"><div class="max-w-[302px] flex items-center overflow-hidden"><div class="overflow-hidden"><div class="flex items-center"><div class="truncate"><a href="/neal_wu" class="h-5 hover:text-blue-s dark:hover:text-dark-blue-s lx-fname">neal_wu (Neal Wu)</a></div></div></div></div></div><div role="cell" style="box-sizing:border-box;flex:84 0 auto;min-width:0;width:84px" class="mx-2 flex items-center py-[11px]"><span class="lx-frating">3686</span><span>&nbsp;</span><span class="text-gray-5 lx-fnumcontest">(51)</span></div><div role="cell" style="box-sizing:border-box;flex:144 0 auto;min-width:0;width:144px" class="mx-2 flex items-center py-[11px]"><span class="lx-ftotal">253</span><span>&nbsp;(</span><span class="text-olive dark:text-dark-olive lx-feasy">60</span>+<span class="text-yellow dark:text-dark-yellow lx-fmedium">141</span>+<span class="text-pink dark:text-dark-pink lx-fhard">52</span>)</div><div role="cell" style="box-sizing:border-box;flex:54 0 auto;min-width:0;width:54px" class="mx-2 flex items-center py-[11px] lx-ftop"><span>0.01%</span></div></div>';

const down_arrow = '<path d="M7.44926 11.8332C7.46161 11.8229 7.47354 11.8123 7.48504 11.8013L10.9052 8.52958C11.0376 8.4029 11.0305 8.20389 10.8893 8.08509C10.8243 8.03043 10.7385 8.00001 10.6495 8.00001H3.35053C3.15694 8.00001 3 8.1408 3 8.31447C3 8.39354 3.0332 8.46971 3.09299 8.5278L6.45859 11.7977C6.72125 12.0529 7.16479 12.0688 7.44926 11.8332Z"></path>';
const up_arrow = '<path d="M10.9052 5.47044L7.48504 2.19872C7.47354 2.18772 7.46161 2.1771 7.44926 2.16687C7.16479 1.93123 6.72125 1.94709 6.45859 2.20229L3.09299 5.47222C3.0332 5.53031 3 5.60648 3 5.68555C3 5.85922 3.15694 6.00001 3.35053 6.00001H10.6495C10.7385 6.00001 10.8243 5.96959 10.8893 5.91493C11.0305 5.79613 11.0376 5.59712 10.9052 5.47044Z"></path>';
const updown_arrow = '<path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path>';


function addFriendsIconOnNavbar() {
    // console.log("ADD FRIEND ICON")

    if (document.querySelector('#friends-icon')) return;

    let navbar_user_avatar = document.querySelector('#navbar_user_avatar');
    if (!navbar_user_avatar) return;
    // console.log("ADDED")

    var a = document.createElement('a');
    a.id = 'friends-icon';
    a.setAttribute('class', 'group relative flex h-8 p-1 items-center justify-center rounded hover:bg-fill-3 dark:hover:bg-dark-fill-3');
    a.innerHTML = people_icon_svg;
    var svg = a.querySelector('svg');
    svg.setAttribute('class', 'h-[20px] w-[20px] group-hover:text-text-primary dark:group-hover:text-dark-text-primary text-text-secondary dark:text-dark-text-secondary');
    svg.width = '1em';
    svg.height = '1em';
    svg.setAttribute('fill', 'currentColor');
    a.href = 'https://leetcode.com/friends/';

    let profile_icon = navbar_user_avatar.parentElement.parentElement;
    let navmenu = profile_icon.parentElement;
    navmenu.insertBefore(a, profile_icon);
}

function handleFriendsPage() {

    if (location.pathname != "/friends/") return;

    document.title = "Friends - LeetCode";

    let area = document.querySelector('.mx-auto');
    if (area) {
        area.innerHTML = "";
        friendsPage(area);
    }

    let jsTimer = setInterval(function () { document.title = "Friends - LeetCode" }, 20);
    setTimeout(function () { clearInterval(jsTimer) }, 1000);
}

async function getUserDetails(username) {
    try {
        const url = "https://leetcode.com/graphql";
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

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        const details = {
            username: username,
            avatar: responseData.data.matchedUser.profile.userAvatar,
            name: responseData.data.matchedUser.profile.realName,
            rating: responseData.data.userContestRanking ? responseData.data.userContestRanking.rating : "-",
            contests: responseData.data.userContestRanking ? responseData.data.userContestRanking.attendedContestsCount : "-",
            problems_solved: responseData.data.matchedUser.submitStatsGlobal.acSubmissionNum[0].count,
            easy: responseData.data.matchedUser.submitStatsGlobal.acSubmissionNum[1].count,
            medium: responseData.data.matchedUser.submitStatsGlobal.acSubmissionNum[2].count,
            hard: responseData.data.matchedUser.submitStatsGlobal.acSubmissionNum[3].count,
            top: responseData.data.userContestRanking ? responseData.data.userContestRanking.topPercentage : "-"
        };

        // console.log(details);
        return details;
    } catch (error) {
        console.error("Error fetching data:", username, error);
        return null;
    }
}

async function createFriendRow(username, friends_rowgroup) {

    let { name, avatar, rating, contests, problems_solved, easy, medium, hard, top } = await getUserDetails(username);

    if (!name) name = username;
    else name = username + " (" + name + ")";

    let row_div = document.createElement('div');
    row_div.innerHTML = friends_row;
    let row = row_div.querySelector('div');
    row.querySelector('.lx-favatar').src = avatar;
    row.querySelector('.lx-fname').innerHTML = name;
    row.querySelector('.lx-fname').href = "https://leetcode.com/" + username;
    row.querySelector('.lx-frating').innerHTML = rating == "-" ? rating : parseInt(rating); + "<span>&nbsp;</span>";
    row.querySelector('.lx-fnumcontest').innerHTML = contests == "-" ? "" : "(" + contests + ")";
    row.querySelector('.lx-ftotal').innerHTML = problems_solved;
    row.querySelector('.lx-feasy').innerHTML = easy;
    row.querySelector('.lx-fmedium').innerHTML = medium;
    row.querySelector('.lx-fhard').innerHTML = hard;
    row.querySelector('.lx-ftop').innerHTML = top == "-" ? top : top + "%";

    friends_rowgroup.appendChild(row);
    // return row;
}

async function friendsPage(area) {
    // Remove user friends
    area.innerHTML = friends_table;

    function updownAllHeaders(area) {
        let fx_headers = ['fx-huser', 'fx-hrating', 'fx-hprobsolved'];
        for (let i = 0; i < fx_headers.length; i++) {
            let fx_header = area.querySelector('#' + fx_headers[i]);
            fx_header.parentElement.querySelector('svg').innerHTML = updown_arrow;
            fx_header.parentElement.querySelector('svg').classList.add('lx-updown');
            fx_header.parentElement.querySelector('svg').classList.remove('lx-down');
            fx_header.parentElement.querySelector('svg').classList.remove('lx-up');
            fx_header.parentElement.querySelector('svg').setAttribute('viewBox', '0 0 24 24');
        }
    }

    updownAllHeaders(area);

    browser.storage.local.get('myfriends', function (result) {
        myfriends = result.myfriends;
        if (myfriends == undefined) {
            myfriends = [];
        }
        console.log(myfriends)

        let friends_rowgroup = document.querySelector('#friends-rowgroup');
        for (let i = 0; i < myfriends.length; i++) {
            let username = myfriends[i];
            createFriendRow(username, friends_rowgroup);
        }

        function sortTable(header, selector) {

            let asc = true;

            let fx_header_svg = header.parentElement.querySelector('svg');

            if (fx_header_svg.classList.contains('lx-up')) {     // currently in ascending order
                asc = false;
            }

            updownAllHeaders(area);

            if (asc) {                                                                        // currently in descending order
                fx_header_svg.innerHTML = up_arrow;             // change to ascending order
                fx_header_svg.classList.remove('lx-down');
                fx_header_svg.classList.add('lx-up');
                fx_header_svg.setAttribute('viewBox', '0 0 14 14');
            } else {
                fx_header_svg.innerHTML = down_arrow;
                fx_header_svg.classList.remove('lx-up');
                fx_header_svg.classList.add('lx-down');
                fx_header_svg.setAttribute('viewBox', '0 0 14 14');
            }

            let table, rows, switching, i, x, y, shouldSwitch;
            table = document.querySelector("#friends-rowgroup");
            switching = true;
            while (switching) {
                switching = false;
                rows = table.querySelectorAll(".lx-frow");
                for (i = 0; i < (rows.length - 1); i++) {
                    shouldSwitch = false;
                    x = rows[i].querySelector(selector);
                    y = rows[i + 1].querySelector(selector);
                    let xval = x.innerHTML.toLowerCase();
                    let yval = y.innerHTML.toLowerCase();
                    if (xval == "-") xval = "0";
                    if (yval == "-") yval = "0";
                    if (!isNaN(xval)) xval = parseFloat(xval);
                    if (!isNaN(yval)) yval = parseFloat(yval);
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
                if (shouldSwitch) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                }
            }
        }


        let huser = document.querySelector('#fx-huser');
        let hrating = document.querySelector('#fx-hrating');
        let hprobsolved = document.querySelector('#fx-hprobsolved');
        let htop = document.querySelector('#fx-htop');

        huser.innerHTML = huser.innerHTML + "&nbsp;" + `(${myfriends.length})`;

        huser.parentElement.addEventListener("click", function () {
            sortTable(huser, '.lx-fname');
        });

        hrating.parentElement.addEventListener("click", function () {
            sortTable(hrating, '.lx-frating');
        });

        hprobsolved.parentElement.addEventListener("click", function () {
            sortTable(hprobsolved, '.lx-ftotal');
        });

    });
}

function addFriendButton() {
    if (!document.title.endsWith("LeetCode Profile")) return;

    let jsTimer = setInterval(addStar, 123);

    function addStar() {
        let name_box = document.querySelector(".text-label-1.break-all.text-base.font-semibold");
        if (name_box) {
            clearInterval(jsTimer);

            // name_box.innerHTML = name_box.innerHTML + "&nbsp;" + "☆⭐";
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
            // star.querySelector('path').style.fill = "#fce58b"; //ccccd7
            toggleFriend(1);
        }
    }
}

function addFriend(username, myfriends) {
    myfriends.push(username);
    browser.storage.local.set({ 'myfriends': myfriends }, function () {
        console.log('ADDED FRIEND ' + myfriends);
    });
}

function removeFriend(username, myfriends) {
    myfriends = myfriends.filter(e => e !== username);
    browser.storage.local.set({ 'myfriends': myfriends }, function () {
        console.log('REMOVED FRIEND ' + myfriends);
    });
}

function clearFriends() {
    browser.storage.local.set({ 'myfriends': [] }, function () {
        console.log('CLEARED FRIENDS');
    });
}

function toggleFriend(loading = 0) {
    let friend_color = 'rgb(255, 226, 96)';         // #ffe260
    let not_friend_color = 'rgb(204, 204, 215)';    // #ccccd7

    let star = document.querySelector("#star-icon");
    let star_path = star.querySelector('path');

    let uname_box = document.querySelector("#uname-box");
    let username = uname_box.innerHTML;
    console.log(username)

    browser.storage.local.get('myfriends', function (result) {
        myfriends = result.myfriends;
        if (myfriends == undefined) {
            myfriends = [];
        }
        if (loading == 1) {
            console.log(myfriends)
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

function lx_friends() {

    // console.log("lx_friends");

    let nextRoot = document.querySelector('#__next');
    let appRoot = document.querySelector('#app');
    let errorRoot = document.querySelector('#navbar-root');

    let observer = new MutationObserver(addFriendsIconOnNavbar);

    if (nextRoot) {
        // console.log("NEXT PAGE");
        observer.observe(document.querySelector('#__next'), { childList: true, subtree: true });
    }
    else if (appRoot) {
        // console.log("REACT PAGE");
        addFriendsIconOnNavbar();
    } else if (errorRoot) {
        // console.log("ERROR PAGE");
        addFriendsIconOnNavbar();
    }

    addFriendButton();

}

handleFriendsPage();

lx_friends();

