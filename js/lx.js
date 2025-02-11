async function handleNextPage() {
    await addFriendsIconOnNavbar();
    const nextPage = nextPageType();
    // console.log(nextPage);
    if (nextPage === 'friends') await handleFriendsPage();
    else if (nextPage === 'profile') addFriendButton();
    else if (nextPage === 'problem') problem_premium();
    else if (nextPage === 'problemset') problemset_companies_premium();
    else if (nextPage === 'contest_ranking') addContestFriendIcon();
}

async function lx() {

    if (!await isActivated()) return;

    let x = document.querySelector('#leetcode-navbar');
    x = x || document.querySelector('#navbar-root');
    if (x) mutObserve(x, addFriendsIconOnNavbar);

    if (document.querySelector('#__next')) {
        // new ui
        await handleNextPage();
        await addFriendsIconOnNavbar();
        mutObserve(document.querySelector('title'), handleNextPage);
        if (!x) mutObserve(document.querySelector('#__next'), addFriendsIconOnNavbar);
    }
    if (x = document.querySelector('#app')) mutObserve(x, addFriendsIconOnNavbar);
}


lx();