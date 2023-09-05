const frequency_col_html = `<div class="flex items-center justify-between hover:text-text-primary dark:hover:text-dark-text-primary cursor-pointer">
<span class="flex items-center focus:outline-none" id="fx-freq-button">Frequency
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"
        class="ml-1 h-[14px] w-[14px]">
        <path fill-rule="evenodd"
            d="M4.929 7.913l7.078 7.057 7.064-7.057a1 1 0 111.414 1.414l-7.77 7.764a1 1 0 01-1.415 0L3.515 9.328a1 1 0 011.414-1.414z"
            clip-rule="evenodd"></path>
    </svg></span>
<ul id="fx-freq-menu" class="hidden flex flex-col absolute top-[296px] z-dropdown rounded-lg p-2 overflow-auto focus:outline-none text-sm shadow-level2 dark:shadow-dark-level2 bg-overlay-3 dark:bg-dark-overlay-3 transform opacity-100 scale-100"
    aria-labelledby="headlessui-menu-button-:R1mald5t6:" id="headlessui-menu-items-:rbm:" role="menu" tabindex="0"
    data-headlessui-state="open">
    <li id="fx-freq-6m" class="fx-freq-li" role="menuitem" tabindex="0" data-headlessui-state="" style="border-radius: 5px">
        <div
            class="cursor-pointer select-none relative h-8 py-1.5 px-2 whitespace-nowrap hover:bg-fill-4 dark:hover:bg-dark-fill-4 rounded text-label-2 dark:text-dark-label-2 hover:text-label-2 dark:hover:text-dark-label-2 flex items-center">
            <span class="">6
                Months</span></a>
    </li>
    <li id="fx-freq-1y" class="fx-freq-li" role="menuitem" tabindex="1" data-headlessui-state="" style="border-radius: 5px">
        <div
            class="cursor-pointer select-none relative h-8 py-1.5 px-2 whitespace-nowrap hover:bg-fill-4 dark:hover:bg-dark-fill-4 rounded text-label-2 dark:text-dark-label-2 hover:text-label-2 dark:hover:text-dark-label-2 flex items-center">
            <span class="">1
                Years</span></a>
    </li>
    <li id="fx-freq-2y" class="fx-freq-li" role="menuitem" tabindex="2" data-headlessui-state="" style="border-radius: 5px">
        <div
            class="cursor-pointer select-none relative h-8 py-1.5 px-2 whitespace-nowrap hover:bg-fill-4 dark:hover:bg-dark-fill-4 rounded text-label-2 dark:text-dark-label-2 hover:text-label-2 dark:hover:text-dark-label-2 flex items-center">
            <span class="">2
                Years</span></a>
    </li>
    <li id="fx-freq-all" class="fx-freq-li" role="menuitem" tabindex="3" data-headlessui-state="" style="border-radius: 5px">
        <div
            class="cursor-pointer select-none relative h-8 py-1.5 px-2 whitespace-nowrap hover:bg-fill-4 dark:hover:bg-dark-fill-4 rounded text-label-2 dark:text-dark-label-2 hover:text-label-2 dark:hover:text-dark-label-2 flex items-center">
            <span class="">All
                Time</span></a>
    </li>
</ul>
</div>`


/*******   EDITORIAL PREMIUM    *******/

async function getQno(qslug) {
    try {
        const url = "https://leetcode.com/graphql";
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

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let responseData = await response.json();
        if (responseData.errors) return 2;
        let qno = responseData.data.question.questionId;
        return qno;
    } catch (error) {
        console.error("Error fetching data:", qslug, error);
        return null;
    }
}

async function setSolution() {
    let editorial_lock_svg = document.querySelector('svg.h-16.text-brand-orange');
    if (!editorial_lock_svg) return;

    let editorial_area = editorial_lock_svg.parentElement.parentElement;

    // let editorial_area = document.querySelector('.backdrop-blur-sm.bg-blocker');
    if (editorial_area == null) return;
    editorial_area.innerHTML = "";

    let qno = await getQno(window.location.pathname.split("/")[2]);
    qno = parseInt(qno) + 1;

    let link = `https://sheets.googleapis.com/v4/spreadsheets/1ilv8yYAIcggzTkehjuB_dsRI4LUxjkTPZz4hsBKJvwo/values/Problem!L${qno}?key=AIzaSyDDAE3rf1fjLGKM0FUHQeTcsmS6fCQjtDs`

    fetch(link)
        .then(response => response.json())
        .then(data => {
            if (!data.values || !data.values[0]) return;
            editorial_area.innerHTML = data.values[0][0];
        }).catch(error => {
            console.error("Error fetching data:", error);
            editorial_area.innerHTML = "Something went wrong!";
        });
}

function editorial_premium() {
    if (!window.location.pathname.startsWith("/problems/")) return;

    let observer = new MutationObserver(setSolution);
    observer.observe(document.querySelector("#__next"), { childList: true, subtree: true });

    setSolution();
}

/**********   PROBLEMSET COMPANIES PREMIUM   **********/

function problemset_companies_premium() {
    if (!window.location.pathname.startsWith("/problemset/all")) return;

    let frequency_col = document.querySelector('[role="columnheader"]:nth-of-type(6)');
    frequency_col.innerHTML = frequency_col_html
    let freq_button = document.querySelector("#fx-freq-button");
    let freq_menu = document.querySelector("#fx-freq-menu");
    let selected_color = "#dedede";

    function clickHandler(e) {
        if (e.target !== freq_button) {
            freq_menu.classList.add("hidden");
            const path = e.composedPath();
            const fxFreqLiElement = path.find((element) => element.classList && element.classList.contains("fx-freq-li"));
            if (fxFreqLiElement) {
                if (fxFreqLiElement.style.background == selected_color) {
                    alert(fxFreqLiElement.style.background)
                    fxFreqLiElement.style.background = "";
                } else {
                    freq_menu.querySelectorAll(".fx-freq-li").forEach((element) => {
                        element.style.background = "";
                    });
                    fxFreqLiElement.style.background = selected_color;
                }
            }
            document.removeEventListener("click", clickHandler);
        }
    }

    freq_button.addEventListener("click", function () {
        freq_menu.classList.toggle("hidden");
        document.addEventListener("click", clickHandler);
    });

}

function lx_premium() {
    console.log("lx_premium");
    editorial_premium();
    problemset_companies_premium();
}

lx_premium();