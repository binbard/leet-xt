async function handleNextPage() {
    await addFriendsIconOnNavbar();
    const nextPage = nextPageType();
    if (nextPage === 'friends') await handleFriendsPage();
    else if (nextPage === 'profile') addFriendButton();
    else if (nextPage === 'problem') problem_premium();
    else if (nextPage === 'problemset') problemset_companies_premium();
    else if (nextPage === 'contest_ranking') addContestFriendIcon();
}

var ui_type = 'old';

async function lx() {

    if (!await isActivated()) return;

    let x = document.querySelector('#leetcode-navbar');
    x = x || document.querySelector('#navbar-root');
    if (x) mutObserve(x, addFriendsIconOnNavbar)

    if (document.querySelector('#__next')) {
        ui_type = 'new';
        await handleNextPage();
        mutObserve(document.querySelector('title'), handleNextPage);
    }
    // else if (x = document.querySelector('#contest-app')) mutObserve(x, addContestFriendIcon);
    if (x = document.querySelector('#app')) mutObserve(x, addFriendsIconOnNavbar)

}


lx();