import friend from "./friend";

export default {
    ranking: {
        container: {
            self: ".mx-auto.w-full",
            table_container: {
                self: ".relative.flex.w-full.justify-center",
                original_table: {
                    self: ".relative.flex.w-full.flex-col",
                    row: "div.even\\:bg-fill-quaternary.flex.h-\\[50px\\]",
                    rank_div: "div.flex.w-\\[94px\\].flex-none.flex-col > div",
                    username_div: "a div.truncate",
                    anchor_with_username: "a[href^='/u/']",
                    username_href_regex: "\/u\/([^\/]+)\/",
                },
                friend_table: {
                    self: "#lx-contest-friend-table",
                    body: {
                        self: "#lx-contest-friend-table-body",
                        row: {
                            self: "#lx-contest-friend-table-row",
                            COLUMN: "#lx-contest-friend-table-row-column",
                            rank: "#lx-contest-friend-table-row-rank",
                            name: "#lx-contest-friend-table-row-name",
                            score: "#lx-contest-friend-table-row-score",
                            old_rating: "#lx-contest-friend-table-row-old-rating",
                            delta_rating: "#lx-contest-friend-table-row-delta-rating",
                            new_rating: "#lx-contest-friend-table-row-new-rating",
                        }
                    }
                }
            },
            pagination_nav: "nav[role='navigation']",
            people_icon: {
                mode: "#lx-people-mode",
                dark: "#lx-people-dark",
                light: "#lx-people-light",
            },
        },
    }
}