const contestRankingPageFriendsHighlighterSelectors = {
    contest_ranking: {
        row: "div.even\\:bg-fill-quaternary.flex.h-\\[50px\\]",
        rank_div: "div.flex.w-\\[94px\\].flex-none.flex-col > div",
        username_div: "a div.truncate",
        anchor_with_username: "a[href^='/u/']",
        username_href_regex: "\/u\/([^\/]+)\/",
    },
};

export default contestRankingPageFriendsHighlighterSelectors;
