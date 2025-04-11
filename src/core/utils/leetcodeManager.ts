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

        try {
            const result = await makeRequest(getUrl(`${Config.App.LCCN_API_URL}?username=${username}&contest_name=${contest_name}`));

            if (!result || !result.length) return null;
            if (result.detail && result.detail.startsWith('contest not found')) throw Result.NO_DATA;

            let user_contest_details = {
                rank: result[0] ? result[0].rank : -1,
                score: result[0] ? result[0].score : -1,
                old_rating: result[0] ? Math.round(result[0].old_rating) : -1,
                delta_rating: result[0] ? Math.round(result[0].delta_rating) : -1,
                new_rating: result[0] ? Math.round(result[0].new_rating) : -1,
            }
            return user_contest_details;

        }
        catch (e: any) {
            Manager.Logger.error(LeetcodeManager.name, e);

            if (e == Result.TIMEOUT){
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