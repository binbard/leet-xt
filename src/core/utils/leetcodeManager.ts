import { makeRequest, getUrl } from './helpers';
import { Result } from '../defines/result';
import Config from '@/values/config'
import Manager from '../manager';

export type IUserDetails = {
    username: string;
    avatar: string;
    name: string;
    rating: number;
    contests: string;
    problems_solved: number;
    easy: number;
    medium: number;
    hard: number;
    top: string;
}
function slugifyContestTitle(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
}

export interface IFriendData extends IUserDetails {
    displayName: string;
    rowElement?: HTMLElement;
}

export type IUserContestDetails = {
    username?: string
    rank: number;
    score: number;
    old_rating: number;
    delta_rating: number;
    new_rating: number;
};

class LeetcodeManager {

    static API_URL = "https://leetcode.com/graphql";

    static async getUserDetails(username: string): Promise<IUserDetails | null> {
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

        try {
            const result = await makeRequest(Config.App.LEETCODE_API_URL, data);
            if (!!result?.data?.matchedUser === false) return null;

            const details: IUserDetails = {
                username: username,
                avatar: result.data.matchedUser.profile.userAvatar,
                name: result.data.matchedUser.profile.realName,
                rating: result.data.userContestRanking ? result.data.userContestRanking.rating : "-",
                contests: result.data.userContestRanking ? result.data.userContestRanking.attendedContestsCount : "-",
                problems_solved: result.data.matchedUser.submitStatsGlobal.acSubmissionNum[0].count,
                easy: result.data.matchedUser.submitStatsGlobal.acSubmissionNum[1].count,
                medium: result.data.matchedUser.submitStatsGlobal.acSubmissionNum[2].count,
                hard: result.data.matchedUser.submitStatsGlobal.acSubmissionNum[3].count,
                top: result.data.userContestRanking ? result.data.userContestRanking.topPercentage : "-"
            };

            return details;
        }
        catch (e: any) {
            Manager.Logger.error(LeetcodeManager.name, e);
            throw e;
        }
    }

    static async isUserExist(username: string): Promise<boolean> {
        const data = `{
            "query": "query userPublicProfile($username: String!) { matchedUser(username: $username) { username } } ",
            "variables": {
                "username": "${username}"
            },
            "operationName": "userPublicProfile"
        } `;

        try {
            const response = await fetch(Config.App.LEETCODE_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data,
            });

            const result = await response.json();
            return !!result?.data?.matchedUser;
        }
        catch (e: any) {
            Manager.Logger.error(LeetcodeManager.name, e);
            throw e;
        }
    }

    static async getUserContestDetails(username: string): Promise<IUserContestDetails | null> {
        const contest_name = window.location.pathname.split("/")[2];

        /**
         * SAMPLE RESULT DATA
         * Example response structure:
         *
         * data: {
         *   userContestRankingHistory: [
         *     {
         *       attended: true,
         *       contest: {
         *         title: "Weekly Contest 132"
         *       },
         *       problemsSolved: 3,
         *       ranking: 1024,
         *       rating: 1620,
         *       trendDirection: "UP"
         *     },
         *     {
         *       attended: false,
         *       contest: {
         *         title: "Weekly Contest 2"
         *       },
         *       problemsSolved: 0,
         *       ranking: 0,
         *       rating: 1500,
         *       trendDirection: "NONE"
         *     },
         *     ...
         *   ]
         * }
         */
        const data = {
            "query": "query userContestRankingInfo($username: String!) { userContestRankingHistory(username: $username) { attended trendDirection problemsSolved rating ranking contest { title } } }",
            "variables": {
                "username": username
            },
            "operationName": "userContestRankingInfo"
        }

        try {
            const abc = await makeRequest(Config.App.LEETCODE_API_URL, data);
            console.log(abc);
            let prev = null;
            let curr = null;
            let found = false;
            for (let i = 0; i < abc.data.userContestRankingHistory.length; i++) {
                if (abc.data.userContestRankingHistory[i].attended) {
                    prev = curr;
                    curr = abc.data.userContestRankingHistory[i];
                    if (slugifyContestTitle(abc.data.userContestRankingHistory[i].contest.title.toLowerCase()) === contest_name) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found || !curr) return null;

            let user_contest_details = {
                rank: curr.ranking !== undefined ? curr.ranking : -1,
                score: curr.problemsSolved !== undefined ? curr.problemsSolved : -1,
                old_rating: prev && prev.rating !== undefined ? Math.round(prev.rating) : -1,
                delta_rating: prev && prev.rating !== undefined && curr.rating !== undefined ? Math.round(curr.rating - prev.rating) : -1,
                new_rating: curr.rating !== undefined ? Math.round(curr.rating) : -1,
            }
            return user_contest_details;
        }
        catch (e: any) {
            Manager.Logger.error(LeetcodeManager.name, e);

            if (e == Result.TIMEOUT) {
                let user_contest_details: IUserContestDetails = {
                    rank: -1,
                    score: -1,
                    old_rating: -1,
                    delta_rating: -1,
                    new_rating: -1,
                }
                return user_contest_details;
            }

            throw Result.ERROR;
        }
    }

    static isDarkTheme(): boolean {
        return document.documentElement.style.colorScheme !== 'light';
    }
}

export { LeetcodeManager };
