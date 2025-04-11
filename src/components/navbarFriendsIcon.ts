import PEOPLE_ICON_SVG from "@/values/svg/people_icon.svg?raw";

function getNavbarFriendsIcon(url: string): HTMLAnchorElement {
    let a = document.createElement('a');
    a.href = url;
    a.setAttribute("class", "group relative flex h-8 p-1 items-center justify-center rounded hover:bg-fill-3 dark:hover:bg-dark-fill-3");

    let parser = new DOMParser();
    let doc = parser.parseFromString(PEOPLE_ICON_SVG, 'image/svg+xml');
    let svg = doc.querySelector('svg');
    svg?.setAttribute('fill', 'currentColor');
    if (svg) a.appendChild(svg);

    return a;
}

export { getNavbarFriendsIcon }