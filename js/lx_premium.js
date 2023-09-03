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
    editorial_area.style.padding = "10px";
    editorial_area.innerHTML = "";
    
    // let editorial_area = document.querySelector('.backdrop-blur-sm.bg-blocker');
    if (editorial_area == null) return;

    let qno = await getQno(window.location.pathname.split("/")[2]);
    qno = parseInt(qno) + 1;

    let link = `https://sheets.googleapis.com/v4/spreadsheets/1ilv8yYAIcggzTkehjuB_dsRI4LUxjkTPZz4hsBKJvwo/values/Problem!L${qno}?key=AIzaSyDDAE3rf1fjLGKM0FUHQeTcsmS6fCQjtDs`

    fetch(link)
        .then(response => response.json())
        .then(data => {
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

function lx_premium() {
    console.log("lx_premium");
    editorial_premium();
}

lx_premium();