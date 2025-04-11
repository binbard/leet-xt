// Note: This module is temporary and may be removed in the future;

import PS_FREQUENCY_COLUMN_HTML from "@/values/html/ps_frequency_column.html?raw"
import PS_PROBLEM_ROW_HTML from "@/values/html/ps_problem_row.html?raw"
import PS_VIDEO_SOLUTION_SVG from "@/values/svg/ps_video_solution.svg?raw"
import PS_NOTAC_SVG from "@/values/svg/ps_notac.svg?raw"

import { IModule } from "@/core/interfaces/module";
import { PageType } from "@/core/defines/pageType";
import { mutObserve, docFind, checkDone, makeRequest } from "@/core/utils/helpers";
import Selectors from "@/values/selectors";
import Config from "@/values/config";
import Manager from "../manager";

interface ProblemData {
  problem_id: string;
  problem_name: string;
  problem_slug: string;
  problem_accepted: string;
  has_video_solution: boolean;
  problem_acceptance: string;
  problem_difficulty: string;
  problem_frequency: string;
}

interface LeetCodeProblemData {
  status: string;
  hasVideoSolution: boolean;
  acRate: string;
}

interface CompanyProblemsData {
  [duration: string]: ProblemData[];
}

export class ProblemsetCompaniesPremium implements IModule {
  private companyProblemRanges: Map<string, string[]> = new Map();
  private companyProblems: Record<string, CompanyProblemsData> = {};
  private lcProblems: Record<string, LeetCodeProblemData> = {};
  private currentCompany: string | null = null;
  private currentFrequency = 'All time';
  private currentPage = 1;
  private originalTableBody: string | null = null;

  /**
   * Fetches company problem ranges from Google Sheets
   */
  async fetchCompanyProblemRanges(): Promise<void> {
    try {
      const data = await makeRequest(Config.App.GSHEETS_COMPANIES_PROBLEM_MAP_URL);
      if (!data.values || !data.values[0]) return;

      // First row contains headers, skip it
      data.values.shift();

      this.companyProblemRanges = new Map();

      data.values.forEach((row: string[]) => {
        this.companyProblemRanges.set(row[0], [row[1], row[2]]);
      });
    } catch (error: any) {
      Manager.Logger.error("Error fetching company problem ranges:", error);
    }
  }

  /**
   * Fetches problems for a specific company
   */
  async fetchCompanyProblems(companyName: string): Promise<void> {
    if (!this.companyProblemRanges) return;

    const range = this.companyProblemRanges.get(companyName);
    if (!range) return;

    try {
      const data = await makeRequest(`${Config.App.GSHEETS_COMPANIES_PROBLEM_URL}!${range[0]}:${range[1]}?key=${Config.App.GSHEETS_COMPANY_DATA_KEY}`);
      if (!data.values || !data.values[0]) return;

      // Skip header row
      data.values.shift();

      this.companyProblems[companyName] = data.values;
    } catch (error: any) {
      Manager.Logger.error(`Error fetching problems for ${companyName}:`, error);
    }
  }

  /**
   * Fetches problem data from LeetCode API
   */
  async setLcProblemData(problemSlug: string): Promise<void> {
    if (this.lcProblems[problemSlug]) return;

    const data = {
      query: `query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          status
          solution {
            hasVideoSolution
          }
          stats
        }
      }`,
      variables: {
        "titleSlug": problemSlug
      }
    };

    try {
      const res = await makeRequest(Config.App.LEETCODE_API_URL, data);
      if (res.errors) return;

      const status = res.data.question.status;
      let hasVideoSolution = res.data.question.solution?.hasVideoSolution || false;
      const acRate = JSON.parse(res.data.question.stats).acRate;

      this.lcProblems[problemSlug] = { status, hasVideoSolution, acRate };
    } catch (error: any) {
      Manager.Logger.error(`Error fetching LeetCode problem data for ${problemSlug}:`, error);
    }
  }

  /**
   * Gets problem data for a specific problem
   */
  async getLcProblemData(problemSlug: string): Promise<LeetCodeProblemData | null> {
    if (!this.lcProblems[problemSlug]) {
      await this.setLcProblemData(problemSlug);
    }
    return this.lcProblems[problemSlug] || null;
  }

  /**
   * Processes and formats company problem data
   */
  async setCompanyProblemsData(companyName: string): Promise<void> {
    if (this.companyProblems[companyName] && typeof this.companyProblems[companyName] === 'object') return;

    if (!this.companyProblems[companyName]) {
      await this.fetchCompanyProblems(companyName);
      if (!this.companyProblems[companyName]) return;
    }

    const compProblems: CompanyProblemsData = {
      '6 months': [],
      '1 year': [],
      '2 years': [],
      'All time': [],
    };

    (this.companyProblems[companyName] as string[][]).forEach((row: string[]) => {
      const duration = row[3];
      const problem: ProblemData = {
        problem_id: row[1],
        problem_name: row[4],
        problem_slug: row[6].split("/")[4],
        problem_accepted: "x",                    // "x" means not fetched
        has_video_solution: false,
        problem_acceptance: "x",
        problem_difficulty: row[7],
        problem_frequency: row[2]
      };

      if (compProblems[duration]) {
        compProblems[duration].push(problem);
      }
    });

    this.companyProblems[companyName] = compProblems;
  }

  /**
   * Returns the appropriate sort function based on the column
   */
  getSortFunction(sortBy: string): (a: ProblemData, b: ProblemData) => number {
    switch (sortBy) {
      case 'problem_id':
        return (a, b) => parseInt(a[sortBy]) - parseInt(b[sortBy]);

      case 'problem_acceptance':
        return (a, b) => {
          const valA = parseFloat(a[sortBy].split("%")[0]);
          const valB = parseFloat(b[sortBy].split("%")[0]);
          return valA - valB;
        };

      case 'problem_difficulty':
        return (a, b) => {
          const diff = ['Easy', 'Medium', 'Hard'];
          return diff.indexOf(a[sortBy]) - diff.indexOf(b[sortBy]);
        };

      case 'problem_frequency':
        return (a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy]);

      default:
        return (a, b) => a[sortBy as keyof ProblemData].toString().localeCompare(b[sortBy as keyof ProblemData].toString());
    }
  }

  /**
   * Retrieves company problems with pagination and sorting
   */
  async getCompanyProblems(companyName: string, duration: string, sortBy = 'problem_id'): Promise<ProblemData[] | null> {
    if (!this.companyProblemRanges) {
      return null;
    }

    await this.setCompanyProblemsData(companyName);

    const companyData = this.companyProblems[companyName];
    if (!companyData || !companyData[duration]) {
      return null;
    }

    const perPage = 50;
    const start = (this.currentPage - 1) * perPage;
    const end = Math.min(this.currentPage * perPage, companyData[duration].length);

    // Clone the array to avoid modifying the original
    let problems = [...companyData[duration]];

    // Sort problems
    problems.sort(this.getSortFunction(sortBy));

    // Apply pagination
    problems = problems.slice(start, end);

    // Fetch additional problem data
    const fetchPromises = problems.map(async (problem) => {
      if (problem.problem_accepted === "x") {
        const lcRes = await this.getLcProblemData(problem.problem_slug);
        if (lcRes) {
          problem.problem_accepted = lcRes.status;
          problem.has_video_solution = lcRes.hasVideoSolution;
          problem.problem_acceptance = lcRes.acRate;
        }
      }
    });

    await Promise.all(fetchPromises);
    return problems;
  }

  /**
   * Creates and populates the problems table
   */
  async createProblemsTable(companyName: string | null, duration: string, sortBy = 'problem_id', order = 0): Promise<void> {
    if (!companyName) return;

    const tableBody = document.querySelector('[role="table"].border-spacing-0 [role="rowgroup"]');
    if (!tableBody) return;

    // Normalize duration
    duration = duration.toLowerCase() === 'all time' ? 'All time' : duration;

    // Update URL
    history.replaceState(null, "", `?company=${this.currentCompany}&page=${this.currentPage}`);

    const problems = await this.getCompanyProblems(companyName, duration);
    if (!problems) return;

    tableBody.innerHTML = "";

    // Apply sorting
    if (order !== 0) {
      problems.sort((a, b) => {
        const sortResult = this.getSortFunction(sortBy)(a, b);
        return order === -1 ? -sortResult : sortResult;
      });
    }

    // Handle empty results
    if (problems.length === 0) {
      const navpage = document.querySelector('nav[role="navigation"]');
      if (navpage) navpage.innerHTML = "";
      return;
    }

    // Render problems
    problems.forEach((problem) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = PS_PROBLEM_ROW_HTML;
      const probRow = tempDiv.firstChild as HTMLElement;

      const problemLink = probRow.querySelector('.fx-prob-ques') as HTMLAnchorElement;
      problemLink.innerHTML = `${problem.problem_id}. ${problem.problem_name}`;
      problemLink.setAttribute('href', `/problems/${problem.problem_slug}`);

      const solutionLink = probRow.querySelector('.fx-prob-solution') as HTMLAnchorElement;
      solutionLink.setAttribute('href', `/problems/${problem.problem_slug}/solution`);

      if (problem.has_video_solution) {
        solutionLink.innerHTML = PS_VIDEO_SOLUTION_SVG;
      }

      const acceptanceEl = probRow.querySelector('.fx-prob-acceptance') as HTMLElement;
      acceptanceEl.innerHTML = problem.problem_acceptance;

      const difficultyEl = probRow.querySelector('.fx-prob-difficulty') as HTMLElement;
      difficultyEl.innerHTML = problem.problem_difficulty;

      // Set color based on difficulty
      if (problem.problem_difficulty === 'Easy') {
        difficultyEl.style.color = "#00b8a3";
      } else if (problem.problem_difficulty === 'Medium') {
        difficultyEl.style.color = "#ffc01e";
      } // Hard is default color

      const frequencyEl = probRow.querySelector('.fx-prob-frequency') as HTMLElement;
      frequencyEl.style.width = `${parseFloat(problem.problem_frequency) * 100}%`;

      const statusEl = probRow.querySelector('.fx-prob-solved-status') as HTMLElement;
      if (problem.problem_accepted === 'x' || problem.problem_accepted === null) {
        statusEl.innerHTML = "";
      } else if (problem.problem_accepted === 'notac') {
        statusEl.innerHTML = PS_NOTAC_SVG;
      } // Solved icon is default

      tableBody.appendChild(probRow);
    });

    // Update pagination
    this.managePagination();
  }

  /**
   * Manages pagination for the problems table
   */
  managePagination(): void {
    const paginationParent = document.querySelector('nav[role="navigation"]')?.parentElement;
    if (!paginationParent) return;

    const currentCompany = this.currentCompany;
    if (!currentCompany) return;

    const companyData = this.companyProblems[currentCompany];
    if (!companyData || !companyData[this.currentFrequency]) return;

    if (companyData[this.currentFrequency].length === 0) return;

    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('class', 'mb-6 md:mb-0 flex flex-wrap items-center space-x-2');
    nav.style.maxWidth = "100%";

    const selectedBtnClass = 'flex items-center justify-center px-3 h-8 rounded select-none focus:outline-none pointer-events-none bg-paper dark:bg-dark-gray-5 text-label-1 dark:text-dark-label-1 shadow-level1 dark:shadow-dark-level1';
    const btnClass = 'flex items-center justify-center px-3 h-8 rounded select-none focus:outline-none bg-fill-3 dark:bg-dark-fill-3 text-label-2 dark:text-dark-label-2 hover:bg-fill-2 dark:hover:bg-dark-fill-2';

    const changePage = (e: Event) => {
      const target = e.target as HTMLElement;
      document.querySelector(`#lx-pagenav-btn-${this.currentPage}`)?.setAttribute('class', btnClass);

      const totalPages = Math.ceil(companyData[this.currentFrequency].length / 50);

      if (target.innerHTML === '&lt;') {
        this.currentPage = Math.max(this.currentPage - 1, 1);
      } else if (target.innerHTML === '&gt;') {
        this.currentPage = Math.min(this.currentPage + 1, totalPages);
      } else {
        this.currentPage = parseInt(target.innerHTML, 10);
      }

      this.createProblemsTable(this.currentCompany, this.currentFrequency, 'problem_id', 0);
      document.querySelector(`#lx-pagenav-btn-${this.currentPage}`)?.setAttribute('class', selectedBtnClass);

      window.scrollTo({
        top: 680,
        behavior: "smooth"
      });
    };

    const totalPages = Math.ceil(companyData[this.currentFrequency].length / 50);

    // Create pagination buttons
    for (let i = 0; i <= totalPages + 1; i++) {
      const btn = document.createElement('button');
      btn.addEventListener('click', changePage);
      btn.id = `lx-pagenav-btn-${i}`;
      btn.setAttribute('class', btnClass);
      btn.innerHTML = i.toString();
      nav.appendChild(btn);
    }

    paginationParent.innerHTML = "";
    paginationParent.appendChild(nav);

    // Mark current page as selected
    document.querySelector(`#lx-pagenav-btn-${this.currentPage}`)?.setAttribute('class', selectedBtnClass);

    // Set previous and next buttons
    const prevBtn = document.querySelector('#lx-pagenav-btn-0');
    const nextBtn = document.querySelector(`#lx-pagenav-btn-${totalPages + 1}`);

    if (prevBtn) prevBtn.innerHTML = '&lt;';
    if (nextBtn) nextBtn.innerHTML = '&gt;';
  }

  /**
   * Adds event listeners for sorting columns
   */
  addSortingListeners(): void {
    const sortLi = document.querySelector("#fx-sort-li");
    const titleLi = document.querySelector('div.mx-2[role="columnheader"]:nth-of-type(2)')?.firstChild;
    const acceptanceLi = document.querySelector('div.mx-2[role="columnheader"]:nth-of-type(4)')?.firstChild;
    const difficultyLi = document.querySelector('div.mx-2[role="columnheader"]:nth-of-type(5)')?.firstChild;

    if (sortLi) {
      sortLi.addEventListener("click", async () => {
        await this.createProblemsTable(this.currentCompany, this.currentFrequency, 'problem_frequency', -1);
      });
    }

    if (titleLi) {
      titleLi.addEventListener("click", async () => {
        await this.createProblemsTable(this.currentCompany, this.currentFrequency, 'problem_name', 0);
      });
    }

    if (acceptanceLi) {
      acceptanceLi.addEventListener("click", async () => {
        await this.createProblemsTable(this.currentCompany, this.currentFrequency, 'problem_acceptance', -1);
      });
    }

    if (difficultyLi) {
      difficultyLi.addEventListener("click", async () => {
        await this.createProblemsTable(this.currentCompany, this.currentFrequency, 'problem_difficulty', 0);
      });
    }
  }

  /**
   * Adds click handlers to company items in the sidebar
   */
  setupSidebarCompanies(): void {
    const selectedColor = "#fcbf62";
    const companyElements = document.querySelectorAll('.swiper-slide a.mb-4.mr-3');
    const tableBody = document.querySelector('[role="table"].border-spacing-0 [role="rowgroup"]');

    if (!tableBody) return;

    companyElements.forEach((element) => {
      const href = element.getAttribute('href');
      if (!href) return;

      const companyName = href.split("/")[2];
      element.setAttribute('company-name', companyName);

      element.addEventListener('click', () => {
        if (this.currentCompany) {
          const currentCompanyEl = document.querySelector(`a[company-name="${this.currentCompany}"] span`) as HTMLElement;
          if (currentCompanyEl) currentCompanyEl.style.background = "";
        } else {
          this.originalTableBody = tableBody.innerHTML;
        }

        const freqElement = document.querySelector('.fx-freq-li[name="All time"]') as HTMLElement;
        if (freqElement) freqElement.style.background = "";

        if (this.currentCompany === companyName) {
          // Deselect current company
          this.currentCompany = null;
          tableBody.innerHTML = this.originalTableBody || "";

          const navElement = document.querySelector('nav[role="navigation"]');
          if (navElement) navElement.innerHTML = "";

          history.replaceState(null, "", window.location.pathname);
        } else {
          // Select new company
          this.currentCompany = companyName;
          const spanElement = element.querySelector('span');
          if (spanElement) spanElement.style.background = selectedColor;

          this.currentPage = 1;
          this.createProblemsTable(companyName, 'All time');
        }
      });

      // Remove default link behavior
      element.removeAttribute('href');
    });
  }

  /**
   * Sets up the company tags premium functionality for the problemset page
   */
  async setupProblemsetCompaniesPremium(): Promise<void> {
    const sidebarComp = document.querySelector('.swiper-slide a.mb-4.mr-3');
    if (!sidebarComp || document.querySelector("div.fx-sidebar-comp-done")) return;

    // Mark as done to prevent duplicate setup
    sidebarComp.parentElement?.classList.add("fx-sidebar-comp-done");

    // Fetch company problem data
    await this.fetchCompanyProblemRanges();

    // Set up frequency column
    const frequencyCol = document.querySelector('[role="columnheader"]:nth-of-type(6)');
    if (frequencyCol) {
      frequencyCol.innerHTML = PS_FREQUENCY_COLUMN_HTML;

      const freqButton = document.querySelector("#fx-freq-button");
      const freqMenu = document.querySelector("#fx-freq-menu");
      const selectedColor = "#dedede";

      if (freqButton && freqMenu) {
        const clickHandler = (e: MouseEvent) => {
          if (e.target !== freqButton) {
            freqMenu.classList.add("hidden");

            // Find if a frequency item was clicked
            const path = e.composedPath();
            const freqElement = path.find((element) => {
              if (element instanceof HTMLElement) {
                return element.classList && element.classList.contains("fx-freq-li");
              }
              return false;
            }) as HTMLElement | undefined;

            if (freqElement) {
              // Update current frequency
              if (this.currentFrequency) {
                const currentFreqEl = document.querySelector(`li.fx-freq-li[name="${this.currentFrequency}"]`) as HTMLElement;
                if (currentFreqEl) currentFreqEl.style.background = "";
              }

              this.currentFrequency = freqElement.getAttribute('name') || 'All time';
              freqElement.style.background = selectedColor;

              this.currentPage = 1;
              this.createProblemsTable(this.currentCompany, this.currentFrequency);
            }

            document.removeEventListener("click", clickHandler);
          }
        };

        freqButton.addEventListener("click", () => {
          freqMenu.classList.toggle("hidden");
          document.addEventListener("click", clickHandler);
        });
      }
    }

    this.setupSidebarCompanies();

    this.addSortingListeners();
  }

  async action(_?: MutationRecord[], observer?: MutationObserver): Promise<void> {
    try {
      this.setupProblemsetCompaniesPremium();

    } catch (e: any) {
      Manager.Logger.warn(ProblemsetCompaniesPremium.name, e);
    }
  }

  apply(): void {
    // this.action();
    const action = this.action.bind(this);
    mutObserve(Selectors.lc.static_dom.next, action);
  }

  pages = [PageType.ALL];

}