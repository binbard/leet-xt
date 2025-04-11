import FRIEND_ROW_HTML from "@/values/html/friend_row.html?raw"

import { IFriendData } from "@/core/utils/leetcodeManager";
import { docFind } from "@/core/utils/helpers";
import Selectors from "@/values/selectors";
import Manager from "@/core/manager";
import Config from "@/values/config";

function getFriendsTableRow(friendData: IFriendData): HTMLDivElement {
    const div = document.createElement('div');
    div.innerHTML = FRIEND_ROW_HTML;
    const row = docFind('div', div) as HTMLDivElement;

    const favatar = docFind(Selectors.lc.friend.table.row_group.row.avatar, row) as HTMLImageElement;
    const fname = docFind(Selectors.lc.friend.table.row_group.row.name, row) as HTMLAnchorElement;

    favatar.src = friendData.avatar;
    fname.innerHTML = friendData.displayName;
    fname.href = `/u/${friendData.username}`;

    const hoverCard = document.createElement('iframe');
    hoverCard.setAttribute('class', 'absolute hidden p-0 m-0 rounded-xl w-[300px] h-[120px]');

    fname.appendChild(hoverCard);
    fname.addEventListener('mouseenter', function () {
        hoverCard.classList.remove('hidden');
        hoverCard.style.opacity = "0";
        let theme;

        if (Manager.Leetcode.isDarkTheme()) {
            theme = 'nord';
            hoverCard.style.border = "none";
        } else {
            theme = 'light';
            hoverCard.style.border = "1px solid #E5E7EB";
        }
        hoverCard.src = `${Config.App.LEETCARD_BASE_URL}/${friendData.username}?theme=${theme}&border=0&radius=10&sheets=https://bit.ly/M3NpQr7`;
    });

    fname.addEventListener('mouseleave', function () {
        hoverCard.classList.add('hidden');
    });

    hoverCard.addEventListener('load', function () {
        hoverCard.style.opacity = "1";
    });

    const rowSelector = Selectors.lc.friend.table.row_group.row;

    docFind(rowSelector.rating, row).innerHTML = friendData.rating.toString() === "-" ? friendData.rating.toString() : Math.round(friendData.rating).toString();
    docFind(rowSelector.numcontest, row).innerHTML = friendData.contests == "-" ? "" : "(" + friendData.contests + ")";
    docFind(rowSelector.problems_solved, row).innerHTML = friendData.problems_solved.toString();
    docFind(rowSelector.easy, row).innerHTML = friendData.easy.toString();
    docFind(rowSelector.medium, row).innerHTML = friendData.medium.toString();
    docFind(rowSelector.hard, row).innerHTML = friendData.hard.toString();
    docFind(rowSelector.top, row).innerHTML = friendData.top == "-" ? friendData.top : friendData.top + "%";

    return row;
}

export { getFriendsTableRow }