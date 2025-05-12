export enum PageType {
    Explore = "/explore/",
    Problems = "/problemset/",
    Contest = "/contest/",
    Discuss = "/discuss/",
    Friends = "/friends/",

    PROFILE = "/u/[\\w-]+/",
    PROBLEM = "/problems/.*",
    CONTEST = "/contest/(weekly|biweekly)-contest-\\d+/(?:ranking/)?",
    FRIENDS = "/(u/)?friends/",
    
    ALL = ".*"
}