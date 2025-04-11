import friend from "./friend";

export default {
    ranking: {
        container: {
            self: ".mx-auto.w-full",
            table_container: {
                self: ".relative.flex.w-full.justify-center",
                original_table: ".relative.flex.w-full.flex-col",
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