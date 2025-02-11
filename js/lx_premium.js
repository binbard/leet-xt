/*******   EDITORIAL PREMIUM    *******/

let qno = null;
async function getQno(qslug) {
    const data = {
        query: `query questionTitle($titleSlug: String!) {
                question(titleSlug: $titleSlug) {
                  questionId
                }
              }
            `,
        variables: {
            "titleSlug": qslug
        }
    };

    const res = await makeRequest('https://leetcode.com/graphql', data);

    if (res.errors) return 2;
    let qno = res.data.question.questionId;
    return qno;
}

async function setEditorialSolution() {
    let editorial_lock_svg = document.querySelector('svg.h-16.text-brand-orange');
    if (!editorial_lock_svg) return;

    let editorial_area = editorial_lock_svg.parentElement.parentElement;

    // let editorial_area = document.querySelector('.backdrop-blur-sm.bg-blocker');
    if (editorial_area == null) return;
    editorial_area.innerHTML = "";
    editorial_area.id = "lx-editorial";

    let qno = await getQno(window.location.pathname.split("/")[2]);
    qno = parseInt(qno) + 1;

    let link = `https://sheets.googleapis.com/v4/spreadsheets/1ilv8yYAIcggzTkehjuB_dsRI4LUxjkTPZz4hsBKJvwo/values/Problem!L${qno}?key=AIzaSyDDAE3rf1fjLGKM0FUHQeTcsmS6fCQjtDs`

    let data = await makeRequest(link);
    if (!data.values || !data.values[0]) return;
    let solution = data.values[0][0];
    if (!solution) return;
    editorial_area.innerHTML = solution;
    editorial_area.style.padding = "1rem";
    editorial_area.style.width = "90vw";
}

let company_tags_data = null;
let problem_info_data = null;

async function setFeatures() {
    addFriendsIconOnNavbar();
    addCompaniesBtnListener();
    await showCompanyTags();        // Only for non dynamic layout
    await setEditorialSolution();
}

function addCompaniesBtnListener() {
    btnCompanies = document.querySelector('div.flex.gap-1 .relative.inline-flex');
    if (!btnCompanies || btnCompanies.classList.contains('done')) return;
    btnCompanies.classList.add('done');
    btnCompanies = btnCompanies.parentElement;
    if(btnCompanies.childElementCount == 4) btnCompanies = btnCompanies.lastChild.previousSibling;
    else btnCompanies = btnCompanies.lastChild;

    btnCompanies.addEventListener('click', async function () {
        const interval = setInterval(showCompanyTags, 50);      // Only for dynamic layout
        setTimeout(() => clearInterval(interval), 200);
    });
}

async function problem_premium() {
    if (!window.location.pathname.startsWith("/problems/")) return;

    await getCompanyTags();
    await getProblemInfo();

    let timer = setInterval(setFeatures, 100);
    setTimeout(() => clearInterval(timer), 10000);

    // let observer = new MutationObserver(setFeatures);
    // observer.observe(document.querySelector("#__next"), { childList: true, subtree: true });

}

/***********  PROBLEM COMPANY TAGS PREMIUM ************/

async function getProblemInfo() {
    let qslug = window.location.pathname.split("/")[2];
    if (problem_info_data) return problem_info_data;
    let proxy = "https://wandb-berm-1c80.public-antagonist-58.workers.dev/?";
    let url = 'https://zerotrac.github.io/leetcode_problem_rating/data.json';
    url = proxy + url;

    let data = await makeRequest(url);
    /* Sample data:
    [
        {
            "Rating": 3018.4940165727,
            "ID": 1719,
            "Title": "Number Of Ways To Reconstruct A Tree",
            "TitleZH": "重构一棵树的方案数",
            "TitleSlug": "number-of-ways-to-reconstruct-a-tree",
            "ContestSlug": "biweekly-contest-43",
            "ProblemIndex": "Q4",
            "ContestID_en": "Biweekly Contest 43",
            "ContestID_zh": "第 43 场双周赛"
        }
    ] */
    if (!data) return null;
    let problem_info = data.find((problem) => {
        return problem.TitleSlug == qslug;
    });
    return problem_info;
}

async function getCompanyTagsMap() {
    let url = 'https://sheets.googleapis.com/v4/spreadsheets/1ilv8yYAIcggzTkehjuB_dsRI4LUxjkTPZz4hsBKJvwo/values/ProblemCompaniesTags_Map!A:C?key=AIzaSyDDAE3rf1fjLGKM0FUHQeTcsmS6fCQjtDs';
    let data = await makeRequest(url);
    if (!data.values || !data.values[0]) return null;
    data.values.shift();
    let company_tags_map = {};
    let promises = data.values.map(async (row) => {
        company_tags_map[row[0]] = [row[1], row[2]];
    });
    await Promise.all(promises);
    return company_tags_map;
}

async function getCompanyTagsMapRange(qslug) {
    let company_tags_map = await getCompanyTagsMap();
    if (!company_tags_map) {
        console.log("Error fetching company tags map")
        return null;
    }
    return company_tags_map[qslug];
}

async function getCompanyTags() {
    if (company_tags_data) return company_tags_data;
    let qslug = window.location.pathname.split("/")[2];
    let range = await getCompanyTagsMapRange(qslug);
    if (!range) {
        company_tags_data = {};
        return company_tags_data
    }
    // console.log(range)
    let url = `https://sheets.googleapis.com/v4/spreadsheets/1ilv8yYAIcggzTkehjuB_dsRI4LUxjkTPZz4hsBKJvwo/values/ProblemCompaniesTags!${range[0]}:${range[1]}?key=AIzaSyDDAE3rf1fjLGKM0FUHQeTcsmS6fCQjtDs`;
    let data = await makeRequest(url);
    if (!data.values || !data.values[0]) return null;
    let company_tags = { '0 - 6 months': [], '6 months - 1 year': [], '1 year - 2 years': [] };
    data.values.forEach((row) => {
        company_tags[row[1]].push(row[2].replace('\n', ' '));
    });
    company_tags_data = company_tags;
    return company_tags;
}

async function showCompanyTags() {
    let company_tags_modal_title = document.querySelector('div.my-8 div.flex.py-4');
    if (!company_tags_modal_title) return;
    if (company_tags_modal_title.name == "done" || !company_tags_modal_title.textContent.includes('Company Tags')) return;
    company_tags_modal_title.name = "done";
    let company_tags_modal_body = company_tags_modal_title.parentElement.querySelector('div.pb-6');
    company_tags_modal_body.innerHTML = "";
    company_tags_modal_body.style.minHeight = "30vh";
    let problem_info = await getProblemInfo();
    if (problem_info && problem_info.Rating) {
        let problem_rating = Math.round(problem_info.Rating);
        let problem_contest = problem_info.ContestID_en;
        let problem_contest_slug = problem_info.ContestSlug;
        company_tags_modal_body.innerHTML += `<div class="flex items-center justify-between px-2"><span class="text-label-2 dark:text-dark-label-2">Difficulty Rating: ${problem_rating}</span><a href="/contest/${problem_contest_slug}" class="text-blue dark:text-dark-blue">${problem_contest}</a></div><br>`;
    } else {
        company_tags_modal_body.innerHTML += `<div class="flex items-center justify-between px-2"><span class="text-label-2 dark:text-dark-label-2">Unrated</span></div><br>`;
    }

    let company_tags = await getCompanyTags();
    // console.log(company_tags);
    let keys = Object.keys(company_tags);
    if (keys.length == 0) {
        company_tags_modal_body.innerHTML += `<div class="flex items-center justify-between px-2"><span class="text-label-2 dark:text-dark-label-2">No company tags</span></div><br>`;
        return;
    }
    keys.forEach((key) => {
        let mkey = key.split(" ").map((word) => {
            return word[0].toUpperCase() + word.slice(1);
        }).join(" ");
        company_tags_modal_body.innerHTML += `<span class="px-2">${mkey}</span><br>`;
        if (company_tags[key].length == 0) {
            company_tags_modal_body.innerHTML += `<div class="flex items-center justify-between px-2"><span class="text-label-2 dark:text-dark-label-2">N/A</span></div><br>`;
            return;
        }
        company_tags[key].forEach((tag) => {
            let company = tag.split(" ");
            if (company.length == 1) return;
            let numtimes = company.pop();
            company = company.join(" ");
            company_tag = document.createElement('div');
            company_tag.innerHTML = company_tag_html;
            company_tag = company_tag.firstChild;
            company_tag.querySelector('.lx-tag-num').style.background = "#ffa116";
            company_tag.querySelector('.lx-tagname').innerHTML = company;
            company_tag.querySelector('.lx-tag-num').innerHTML = numtimes;
            // company_tags_modal_body.innerHTML += `<b>${company}</b>&nbsp;<span>${numtimes}</span>;&nbsp;&nbsp;`;
            company_tags_modal_body.appendChild(company_tag);
        });
        company_tags_modal_body.innerHTML += '<br><br>';
    });
}



/**********   PROBLEMSET COMPANIES PREMIUM   **********/

let companyProblemRanges = null;
let companyProblems = {};
let lcProblems = {};
let curr_company = null;
let curr_freq = 'All time';
let curr_page = 1;
let original_table_body = null;

async function fetchCompanyProblemRanges() {
    let link = "https://sheets.googleapis.com/v4/spreadsheets/1ilv8yYAIcggzTkehjuB_dsRI4LUxjkTPZz4hsBKJvwo/values/CompaniesProblem_Map!A:C?key=AIzaSyDDAE3rf1fjLGKM0FUHQeTcsmS6fCQjtDs";

    const data = await makeRequest(link);
    if (!data.values || !data.values[0]) return;
    data.values.shift();
    companyProblemRanges = new Map();
    data.values.forEach((row) => {
        companyProblemRanges.set(row[0], [row[1], row[2]]);
    });
}

async function fetchCompanyProblems(company_name) {
    // console.log("FETCHING COMPANY PROBLEMS")
    if (!companyProblemRanges) return;
    let range = companyProblemRanges.get(company_name);
    if (!range) {
        // console.log("Company not selected");
        return;
    }
    let url = `https://sheets.googleapis.com/v4/spreadsheets/1ilv8yYAIcggzTkehjuB_dsRI4LUxjkTPZz4hsBKJvwo/values/CompaniesProblem!${range[0]}:${range[1]}?key=AIzaSyDDAE3rf1fjLGKM0FUHQeTcsmS6fCQjtDs`;

    const data = await makeRequest(url);
    if (!data.values || !data.values[0]) return;
    data.values.shift();
    companyProblems[company_name] = data.values;

}

async function setLcProblemData(problem_slug) {
    if (!lcProblems[problem_slug]) {
        let link = `https://leetcode.com/graphql`;
        // sample stats
        // "stats": "{\"totalAccepted\": \"10.7M\", \"totalSubmission\": \"21.2M\", \"totalAcceptedRaw\": 10724726, \"totalSubmissionRaw\": 21200234, \"acRate\": \"50.6%\"}",
        let data = {
            query: `query questionData($titleSlug: String!) {
                question(titleSlug: $titleSlug) {
                  status
                  solution {
                    hasVideoSolution
                  }
                  stats
                }
              }
            `,
            variables: {
                "titleSlug": problem_slug
            }
        };

        const res = await makeRequest(link, data);
        if (res.errors) return;
        let status = res.data.question.status;
        let hasVideoSolution = res.data.question.solution;
        let acRate = JSON.parse(res.data.question.stats).acRate;
        if (hasVideoSolution) hasVideoSolution = hasVideoSolution.hasVideoSolution;
        else hasVideoSolution = false;
        lcProblems[problem_slug] = { status, hasVideoSolution, acRate };
    }
}

async function getLcProblemData(problem_slug) {
    if (!lcProblems[problem_slug]) await setLcProblemData(problem_slug);
    return lcProblems[problem_slug];
}

async function setCompanyProblemsData(company_name) {
    if (companyProblems[company_name]) return;
    if (!companyProblems[company_name]) {
        await fetchCompanyProblems(company_name);
        if (!companyProblems[company_name]) return;
    }
    /* SAMPLE DATA
    [
        "goldman-sachs",
        "253",
        "0.380707",
        "6 months",
        "Meeting Rooms II",
        "0.505",
        "https://leetcode.com/problems/meeting-rooms-ii/",
        "Medium",
        "",
        "",
        "11742"
    ]*/

    let compProblems = {};
    compProblems = {
        '6 months': [],
        '1 year': [],
        '2 years': [],
        'All time': [],
    };

    await companyProblems[company_name].forEach(async (row) => {
        let problem = {};
        problem['problem_id'] = row[1];
        problem['problem_name'] = row[4];
        problem['problem_slug'] = row[6].split("/")[4];
        problem['problem_accepted'] = "x";      // x means not fetched
        problem['has_video_solution'] = "x";
        problem['problem_acceptance'] = "x";
        problem['problem_difficulty'] = row[7];
        problem['problem_frequency'] = row[2];
        compProblems[row[3]].push(problem);
    });
    companyProblems[company_name] = compProblems;
}

function getSortFunction(sort_by) {
    if (sort_by == 'problem_id') return (a, b) => {
        a = parseInt(a[sort_by]);
        b = parseInt(b[sort_by]);
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    };
    else if (sort_by == 'problem_acceptance') return (a, b) => {
        a = parseFloat(a[sort_by].split("%")[0]);
        b = parseFloat(b[sort_by].split("%")[0]);
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    };
    else if (sort_by == 'problem_difficulty') return (a, b) => {
        let diff = ['Easy', 'Medium', 'Hard'];
        a = diff.indexOf(a[sort_by]);
        b = diff.indexOf(b[sort_by]);
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    };
    else if (sort_by == 'problem_frequency') return (a, b) => {
        a = parseFloat(a[sort_by]);
        b = parseFloat(b[sort_by]);
        if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
    };
}

async function getCompanyProblems(company_name, duration, sort_by = 'problem_id') {
    if (!companyProblemRanges) {
        // console.log("Error fetching company problem ranges");
        return null;
    }
    await setCompanyProblemsData(company_name);
    if (!companyProblems[company_name]) {
        // console.log("Error fetching company problems X");
        return null;
    }

    let page = curr_page;
    let per_page = 50;
    let start = (page - 1) * per_page;
    let end = Math.min(page * per_page, companyProblems[company_name][duration].length);

    let problems = companyProblems[company_name][duration];
    problems.sort(getSortFunction(sort_by));
    problems = problems.slice(start, end);

    const fetchPromises = problems.map(async (problem) => {
        if (problem['problem_accepted'] == "x") {
            let lc_res = await getLcProblemData(problem['problem_slug']);
            if (!lc_res) {
                // console.log("Error fetching LC Problem Data");
                return null;
            }
            problem['problem_accepted'] = lc_res.status;
            problem['has_video_solution'] = lc_res.hasVideoSolution;
            problem['problem_acceptance'] = lc_res.acRate;
        }
    });
    await Promise.all(fetchPromises);
    // console.log("FETCHED COMPANY PROBLEMS")
    return problems;
}

async function createProblemsTable(company_name, duration, sort_by = 'problem_id', order = 0) {
    if (!company_name) {
        // console.log("No company selected");
        return;
    }
    let table_body = document.querySelector('[role="table"].border-spacing-0 [role="rowgroup"]');
    duration = duration.toLowerCase();
    if (duration == 'all time') duration = 'All time';
    history.replaceState(null, null, `?company=${curr_company}&page=${curr_page}`);

    let problems = await getCompanyProblems(company_name, duration);
    if (!problems) {
        // console.log("Error fetching company problems");
        return;
    }
    table_body.innerHTML = "";
    if (order != 0) problems.sort((a, b) => {           // 0 = no sort, 1 = ascending, -1 = descending
        if (a[sort_by] < b[sort_by]) return -1;
        else if (a[sort_by] > b[sort_by]) return 1;
        else return 0;
    });
    if (order == -1) problems.reverse();

    if (problems.length == 0) {
        let navpage = document.querySelector('nav[role="navigation"]');
        navpage.innerHTML = "";
    }

    problems.forEach((problem) => {
        prob_row = document.createElement('div');
        prob_row.innerHTML = prob_row_html;
        prob_row = prob_row.firstChild;
        prob_row.querySelector('.fx-prob-ques').innerHTML = `${problem['problem_id']}. ${problem['problem_name']}`;
        prob_row.querySelector('.fx-prob-ques').setAttribute('href', `/problems/${problem['problem_slug']}`);
        prob_row.querySelector('.fx-prob-solution').setAttribute('href', `/problems/${problem['problem_slug']}/solution`);
        if (problem['has_video_solution']) prob_row.querySelector('.fx-prob-solution').innerHTML = svg_video_sol_html;
        prob_row.querySelector('.fx-prob-acceptance').innerHTML = problem['problem_acceptance'];
        prob_row.querySelector('.fx-prob-difficulty').innerHTML = problem['problem_difficulty'];
        if (problem['problem_difficulty'] == 'Easy') prob_row.querySelector('.fx-prob-difficulty').style.color = "#00b8a3";
        else if (problem['problem_difficulty'] == 'Medium') prob_row.querySelector('.fx-prob-difficulty').style.color = "#ffc01e";
        // else if(problem['problem_difficulty'] == 'Hard') prob_row.querySelector('.fx-prob-difficulty').style.color = "#f56565";
        prob_row.querySelector('.fx-prob-frequency').style.width = `${problem['problem_frequency'] * 100}%`;
        if (problem['problem_accepted'] == 'x' || problem['problem_accepted'] == null) {
            prob_row.querySelector('.fx-prob-solved-status').innerHTML = "";
        } else if (problem['problem_accepted'] == 'notac') {
            prob_row.querySelector('.fx-prob-solved-status').innerHTML = svg_notac_html;
        }   // solved icon is default
        table_body.appendChild(prob_row);
    });

    managePagination();
}

function managePagination() {
    let pagination_parent = document.querySelector('nav[role="navigation"]').parentElement;
    let nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('class', 'mb-6 md:mb-0 flex flex-wrap items-center space-x-2');
    nav.style.maxWidth = "100%";
    let selected_btn_class = 'flex items-center justify-center px-3 h-8 rounded select-none focus:outline-none pointer-events-none bg-paper dark:bg-dark-gray-5 text-label-1 dark:text-dark-label-1 shadow-level1 dark:shadow-dark-level1';
    let btn_class = 'flex items-center justify-center px-3 h-8 rounded select-none focus:outline-none bg-fill-3 dark:bg-dark-fill-3 text-label-2 dark:text-dark-label-2 hover:bg-fill-2 dark:hover:bg-dark-fill-2';

    function changePage(e) {
        document.querySelector(`#lx-pagenav-btn-${curr_page}`).setAttribute('class', btn_class);
        if (e.target.innerHTML == '&lt;') curr_page = Math.max(curr_page - 1, 1);
        else if (e.target.innerHTML == '&gt;') curr_page = Math.min(curr_page + 1, Math.ceil(companyProblems[curr_company][curr_freq].length / 50));
        else curr_page = parseInt(e.target.innerHTML);
        createProblemsTable(curr_company, curr_freq, sort_by = 'problem_id', order = 0);
        document.querySelector(`#lx-pagenav-btn-${curr_page}`).setAttribute('class', selected_btn_class);

        window.scrollTo({
            top: 680,
            behavior: "smooth"
        });
    }

    if (!companyProblems[curr_company]) {
        // console.log("Error fetching problems")
        return;
    }
    if (companyProblems[curr_company][curr_freq].length == 0) return;
    let till = Math.ceil(companyProblems[curr_company][curr_freq].length / 50);

    for (let i = 0; i <= till + 1; i++) {
        let btn = document.createElement('button');
        btn.addEventListener('click', changePage);
        btn.id = 'lx-pagenav-btn-' + i;
        btn.setAttribute('class', btn_class);
        btn.innerHTML = i;
        nav.appendChild(btn);
    }
    pagination_parent.innerHTML = "";
    pagination_parent.appendChild(nav);
    document.querySelector(`#lx-pagenav-btn-${curr_page}`).setAttribute('class', selected_btn_class);
    document.querySelector('#lx-pagenav-btn-0').innerHTML = '<';
    document.querySelector(`#lx-pagenav-btn-${till + 1}`).innerHTML = '>';
}

function addSortingListeners() {
    let sort_li = document.querySelector("#fx-sort-li");
    let title_li = document.querySelector('div.mx-2[role="columnheader"]:nth-of-type(2)').firstChild;
    let acceptance_li = document.querySelector('div.mx-2[role="columnheader"]:nth-of-type(4)').firstChild;
    let difficulty_li = document.querySelector('div.mx-2[role="columnheader"]:nth-of-type(5)').firstChild;

    sort_li.addEventListener("click", async function () {
        await createProblemsTable(curr_company, curr_freq, sort_by = 'problem_frequency', order = -1);
    });
    title_li.addEventListener("click", async function () {
        await createProblemsTable(curr_company, curr_freq, sort_by = 'problem_name', order = 0);
    });
    acceptance_li.addEventListener("click", async function () {
        await createProblemsTable(curr_company, curr_freq, sort_by = 'problem_acceptance', order = -1);
    });
    difficulty_li.addEventListener("click", async function () {
        await createProblemsTable(curr_company, curr_freq, sort_by = 'problem_difficulty', order = 0);
    });
}


function sidebar_companies() {
    let selected_color = "#fcbf62";

    document.querySelectorAll('.swiper-slide a.mb-4.mr-3').forEach((element) => {
        let company_name = element.getAttribute('href').split("/")[2];
        element.setAttribute('company-name', company_name);
        let table_body = document.querySelector('[role="table"].border-spacing-0 [role="rowgroup"]');
        element.addEventListener('click', function () {
            if (curr_company) document.querySelector(`a[company-name="${curr_company}"] span`).style.background = "";
            else original_table_body = table_body.innerHTML;
            document.querySelector('.fx-freq-li[name="All time"]').style.background = "";
            if (curr_company == company_name) {
                curr_company = null;
                table_body.innerHTML = original_table_body;
                document.querySelector('nav[role="navigation"]').innerHTML = "";
                history.replaceState(null, null, window.location.pathname);

            } else {
                curr_company = company_name;
                element.querySelector('span').style.background = selected_color;
                // getCompanyProblems(company_name, 'All time');
                curr_page = 1;
                createProblemsTable(company_name, 'All time');
            }
        });
        element.removeAttribute('href');
    });
}

async function problemset_companies_premium() {
    // if (!window.location.pathname.startsWith("/problemset/all")) return;

    let sidebar_comp = document.querySelector('.swiper-slide a.mb-4.mr-3');
    if (!sidebar_comp) return;
    if (document.querySelector("div.fx-sidebar-comp-done")) return;
    sidebar_comp.parentElement.classList.add("fx-sidebar-comp-done");

    await fetchCompanyProblemRanges();

    let frequency_col = document.querySelector('[role="columnheader"]:nth-of-type(6)');
    frequency_col.innerHTML = frequency_col_html
    let freq_button = document.querySelector("#fx-freq-button");
    let freq_menu = document.querySelector("#fx-freq-menu");
    let selected_color = "#dedede";

    async function clickHandler(e) {
        if (e.target !== freq_button) {
            freq_menu.classList.add("hidden");
            const path = e.composedPath();
            const fxFreqLiElement = path.find((element) => element.classList && element.classList.contains("fx-freq-li"));
            if (fxFreqLiElement) {
                if (curr_freq) document.querySelector(`li.fx-freq-li[name="${curr_freq}"]`).style.background = "";
                curr_freq = fxFreqLiElement.getAttribute('name');
                fxFreqLiElement.style.background = selected_color;
                curr_page = 1;
                await createProblemsTable(curr_company, curr_freq, sort_by = 'problem_id', order = 0);
            }
            document.removeEventListener("click", clickHandler);
        }
    }

    freq_button.addEventListener("click", function () {
        freq_menu.classList.toggle("hidden");
        document.addEventListener("click", clickHandler);
    });

    sidebar_companies();

    addSortingListeners();

}