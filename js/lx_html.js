// lx_friends

const people_icon_svg = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 12.8168 3.1088 13.6081 3.31269 14.3603C3.72385 14.0549 4.18033 13.7872 4.67874 13.5718C4.25207 12.9917 3.99999 12.2753 3.99999 11.5C3.99999 9.567 5.56699 8 7.49999 8C9.43298 8 11 9.567 11 11.5C11 12.2753 10.7479 12.9918 10.3212 13.5718C10.7765 13.7685 11.1973 14.009 11.5808 14.2826C11.5933 14.2916 11.6057 14.3008 11.6177 14.3103C12.021 13.878 12.4936 13.4824 13.0284 13.1452C12.0977 12.4128 11.5 11.2762 11.5 10C11.5 7.79086 13.2908 6 15.5 6C17.7091 6 19.5 7.79086 19.5 10C19.5 10.8095 19.2595 11.5629 18.8461 12.1925C19.6192 12.3672 20.3212 12.6528 20.9432 13.0164C20.9807 12.6828 21 12.3436 21 12C21 7.02944 16.9706 3 12 3ZM10.4907 15.9573C10.4664 15.9429 10.4426 15.9274 10.4192 15.9107C9.65816 15.3678 8.67891 15 7.49999 15C6.06158 15 4.91073 15.5491 4.09526 16.3065C5.622 19.1029 8.58946 21 12 21C15.8853 21 19.1956 18.538 20.4559 15.089C20.4386 15.0778 20.4216 15.066 20.4048 15.0536C19.5686 14.4343 18.4544 14 17.0906 14C13.7836 14 12 16.529 12 18C12 18.5523 11.5523 19 11 19C10.4477 19 9.99999 18.5523 9.99999 18C9.99999 17.3385 10.1699 16.6377 10.4907 15.9573ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM15.5 8C14.3954 8 13.5 8.89543 13.5 10C13.5 11.1046 14.3954 12 15.5 12C16.6046 12 17.5 11.1046 17.5 10C17.5 8.89543 16.6046 8 15.5 8ZM5.99999 11.5C5.99999 10.6716 6.67156 10 7.49999 10C8.32841 10 8.99999 10.6716 8.99999 11.5C8.99999 12.3284 8.32841 13 7.49999 13C6.67156 13 5.99999 12.3284 5.99999 11.5Z"/></svg>';

const star_icon_svg = '<svg height="1em" width="1em" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.94 47.94" xml:space="preserve"><path style="fill:#ccccd7;" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"/></svg>';

const friends_table = '<div><div class="-mx-4 transition-opacity md:mx-0"><div role="table" style="min-width:0" class="border-spacing-0 overflow-auto"><div class="inline-block min-w-full"><div class="border-divider-border-2 dark:border-dark-divider-border-2 border-b"><div role="row" style="display:flex;flex:1 0 auto;min-width:0"><div colspan="1" role="columnheader" style="box-sizing:border-box;flex:22 0 auto;min-width:0;width:22px" class="mx-2 py-[11px] font-normal text-label-3 dark:text-dark-label-3"><div class="flex items-center justify-between"><div class="overflow-hidden text-ellipsis"></div></div></div><div colspan="1" role="columnheader" style="box-sizing:border-box;flex:180 0 auto;min-width:0;width:180px;cursor:pointer" class="mx-2 py-[11px] font-normal text-label-3 dark:text-dark-label-3 hover:text-gray-7 dark:hover:text-dark-gray-7 group"><div class="flex items-center justify-between"><div class="overflow-hidden text-ellipsis" id="fx-huser">Users</div><span class="text-gray-5 dark:text-dark-gray-5 ml-2 h-3.5 w-3.5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span></div></div><div colspan="1" role="columnheader" style="box-sizing:border-box;flex:84 0 auto;min-width:0;width:84px;cursor:pointer" class="mx-2 py-[11px] font-normal text-label-3 dark:text-dark-label-3 hover:text-gray-7 dark:hover:text-dark-gray-7 group"><div class="flex items-center justify-between"><div class="overflow-hidden text-ellipsis" id="fx-hrating">Rating</div><span class="text-gray-5 dark:text-dark-gray-5 ml-2 h-3.5 w-3.5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span></div></div><div colspan="1" role="columnheader" style="box-sizing:border-box;flex:144 0 auto;min-width:0;width:144px;cursor:pointer" class="mx-2 py-[11px] font-normal text-label-3 dark:text-dark-label-3 hover:text-gray-7 dark:hover:text-dark-gray-7 group"><div class="flex items-center justify-between"><div class="overflow-hidden text-ellipsis" id="fx-hprobsolved">Problems Solved</div><span class="text-gray-5 dark:text-dark-gray-5 ml-2 h-3.5 w-3.5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span></div></div><div colspan="1" role="columnheader" style="box-sizing:border-box;flex:54 0 auto;min-width:0;width:54px" class="mx-2 py-[11px] font-normal text-label-3 dark:text-dark-label-3"><div class="flex items-center justify-between"><div class="overflow-hidden text-ellipsis" id="fx-htop">Top</div></div></div></div></div><div role="rowgroup" id="friends-rowgroup"></div></div></div></div></div>';

const friends_row = '<div role="row" style="display:flex;flex:1 0 auto;min-width:0" class="odd:bg-layer-1 even:bg-overlay-1 dark:odd:bg-dark-layer-bg dark:even:bg-dark-fill-4 lx-frow"><div role="cell" style="box-sizing:border-box;flex:22 0 auto;min-width:0;width:22px" class="mx-2 flex items-center py-[11px]"><img src="https://assets.leetcode.com/users/neal_wu/avatar_1574529913.png" class="min-w-[20px] max-w-[20px] rounded-full object-cover lx-favatar" alt="neal_wu"></div><div role="cell" style="box-sizing:border-box;flex:180 0 auto;min-width:0;width:180px" class="mx-2 flex items-center py-[11px]"><div class="max-w-[302px] flex items-center overflow-hidden"><div class="overflow-hidden"><div class="flex items-center"><div class="truncate"><a href="/neal_wu" class="h-5 hover:text-blue-s dark:hover:text-dark-blue-s lx-fname">neal_wu (Neal Wu)</a></div></div></div></div></div><div role="cell" style="box-sizing:border-box;flex:84 0 auto;min-width:0;width:84px" class="mx-2 flex items-center py-[11px]"><span class="lx-frating">3686</span><span>&nbsp;</span><span class="text-gray-5 lx-fnumcontest">(51)</span></div><div role="cell" style="box-sizing:border-box;flex:144 0 auto;min-width:0;width:144px" class="mx-2 flex items-center py-[11px]"><span class="lx-ftotal">253</span><span>&nbsp;(</span><span class="text-olive dark:text-dark-olive lx-feasy">60</span>+<span class="text-yellow dark:text-dark-yellow lx-fmedium">141</span>+<span class="text-pink dark:text-dark-pink lx-fhard">52</span>)</div><div role="cell" style="box-sizing:border-box;flex:54 0 auto;min-width:0;width:54px" class="mx-2 flex items-center py-[11px] lx-ftop"><span>0.01%</span></div></div>';

const down_arrow = '<path d="M7.44926 11.8332C7.46161 11.8229 7.47354 11.8123 7.48504 11.8013L10.9052 8.52958C11.0376 8.4029 11.0305 8.20389 10.8893 8.08509C10.8243 8.03043 10.7385 8.00001 10.6495 8.00001H3.35053C3.15694 8.00001 3 8.1408 3 8.31447C3 8.39354 3.0332 8.46971 3.09299 8.5278L6.45859 11.7977C6.72125 12.0529 7.16479 12.0688 7.44926 11.8332Z"></path>';
const up_arrow = '<path d="M10.9052 5.47044L7.48504 2.19872C7.47354 2.18772 7.46161 2.1771 7.44926 2.16687C7.16479 1.93123 6.72125 1.94709 6.45859 2.20229L3.09299 5.47222C3.0332 5.53031 3 5.60648 3 5.68555C3 5.85922 3.15694 6.00001 3.35053 6.00001H10.6495C10.7385 6.00001 10.8243 5.96959 10.8893 5.91493C11.0305 5.79613 11.0376 5.59712 10.9052 5.47044Z"></path>';
const updown_arrow = '<path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path>';



// lx_premium

const frequency_col_html = '<div class="flex items-center justify-between hover:text-text-primary dark:hover:text-dark-text-primary cursor-pointer"><span class="flex items-center focus:outline-none" id="fx-freq-button">Frequency<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="ml-1 h-[14px] w-[14px]"><path fill-rule="evenodd" d="M4.929 7.913l7.078 7.057 7.064-7.057a1 1 0 111.414 1.414l-7.77 7.764a1 1 0 01-1.415 0L3.515 9.328a1 1 0 011.414-1.414z" clip-rule="evenodd"></path></svg></span><ul id="fx-freq-menu" class="hidden flex flex-col absolute top-[296px] z-dropdown rounded-lg p-2 overflow-auto focus:outline-none text-sm shadow-level2 dark:shadow-dark-level2 bg-overlay-3 dark:bg-dark-overlay-3 transform opacity-100 scale-100" aria-labelledby="headlessui-menu-button-:R1mald5t6:" id="headlessui-menu-items-:rbm:" role="menu" tabindex="0" data-headlessui-state="open"><li id="fx-sort-li" class="sort_by_id" role="menuitem" tabindex="0" data-headlessui-state="" style="border-radius:5px"><div class="cursor-pointer select-none relative h-8 py-1.5 px-2 whitespace-nowrap hover:bg-fill-4 dark:hover:bg-dark-fill-4 rounded text-label-2 dark:text-dark-label-2 hover:text-label-2 dark:hover:text-dark-label-2 flex items-center"><span class="">🡙 SORT 🡙</span></li><li name="6 months" class="fx-freq-li" role="menuitem" tabindex="1" data-headlessui-state="" style="border-radius:5px"><div class="cursor-pointer select-none relative h-8 py-1.5 px-2 whitespace-nowrap hover:bg-fill-4 dark:hover:bg-dark-fill-4 rounded text-label-2 dark:text-dark-label-2 hover:text-label-2 dark:hover:text-dark-label-2 flex items-center"><span class="">6 Months</span></li><li name="1 year" class="fx-freq-li" role="menuitem" tabindex="2" data-headlessui-state="" style="border-radius:5px"><div class="cursor-pointer select-none relative h-8 py-1.5 px-2 whitespace-nowrap hover:bg-fill-4 dark:hover:bg-dark-fill-4 rounded text-label-2 dark:text-dark-label-2 hover:text-label-2 dark:hover:text-dark-label-2 flex items-center"><span class="">1 Year</span></li><li name="2 years" class="fx-freq-li" role="menuitem" tabindex="3" data-headlessui-state="" style="border-radius:5px"><div class="cursor-pointer select-none relative h-8 py-1.5 px-2 whitespace-nowrap hover:bg-fill-4 dark:hover:bg-dark-fill-4 rounded text-label-2 dark:text-dark-label-2 hover:text-label-2 dark:hover:text-dark-label-2 flex items-center"><span class="">2 Years</span></li><li name="All time" class="fx-freq-li" role="menuitem" tabindex="4" data-headlessui-state="" style="border-radius:5px"><div class="cursor-pointer select-none relative h-8 py-1.5 px-2 whitespace-nowrap hover:bg-fill-4 dark:hover:bg-dark-fill-4 rounded text-label-2 dark:text-dark-label-2 hover:text-label-2 dark:hover:text-dark-label-2 flex items-center"><span class="">All time</span></li></ul></div>';

const prob_row_html = '<div role="row" style="display:flex;flex:1 0 auto;min-width:0" class="odd:bg-layer-1 even:bg-overlay-1 dark:odd:bg-dark-layer-bg dark:even:bg-dark-fill-4" problem-id="4" is-premium="false"><div role="cell" style="box-sizing:border-box;flex:52 0 auto;min-width:0;width:52px" class="mx-2 flex items-center py-[11px]"><span class="fx-prob-solved-status"><svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-1hwpjif"><path d="M21.6004 12C21.6004 17.302 17.3023 21.6 12.0004 21.6C6.69846 21.6 2.40039 17.302 2.40039 12C2.40039 6.69809 6.69846 2.40002 12.0004 2.40002C13.5066 2.40002 14.9318 2.74689 16.2004 3.3651M19.8004 6.00002L11.4004 14.4L9.00039 12" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></div><div role="cell" style="box-sizing:border-box;flex:260 0 auto;min-width:0;width:260px" class="mx-2 flex items-center py-[11px]"><div class="max-w-[302px] flex items-center overflow-hidden"><div class="overflow-hidden"><div class="flex items-center"><div class="truncate"><a href="/problems/median-of-two-sorted-arrays" class="h-5 hover:text-blue-s dark:hover:text-dark-blue-s fx-prob-ques">4. Median of Two Sorted Arrays</a></div></div></div></div></div><div role="cell" style="box-sizing:border-box;flex:54 0 auto;min-width:0;width:54px" class="mx-2 flex items-center py-[11px]"><a aria-label="solution" href="/problems/median-of-two-sorted-arrays/solution" class="truncate fx-prob-solution"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="text-blue dark:text-dark-blue h-5 w-5"><path d="M15.207 11.293a1 1 0 010 1.414l-3.5 3.5a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L11 14.086l2.793-2.793a1 1 0 011.414 0z"></path><path d="M4 5a3 3 0 013-3h7.039a3 3 0 012.342 1.126l2.962 3.701A3 3 0 0120 8.702V19a3 3 0 01-3 3H7a3 3 0 01-3-3V5zm3-1a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V9h-3a2 2 0 01-2-2V4H7zm8 .6V7h1.92L15 4.6z"></path></svg></a></div><div role="cell" style="box-sizing:border-box;flex:100 0 auto;min-width:0;width:100px" class="mx-2 flex items-center py-[11px]"><span class="fx-prob-acceptance">37.3%</span></div><div role="cell" style="box-sizing:border-box;flex:84 0 auto;min-width:0;width:84px" class="mx-2 flex items-center py-[11px]"><span class="text-pink dark:text-dark-pink fx-prob-difficulty">Hard</span></div><div role="cell" style="box-sizing:border-box;flex:84 0 auto;min-width:0;width:84px" class="mx-2 flex items-center py-[11px]"><div class="flex h-full w-full flex-row items-center"><span class="h-2 flex-1 rounded-l-lg bg-fill-3 dark:bg-dark-fill-3" title="94%" style="border-bottom-right-radius:.5rem;overflow:hidden;border-top-right-radius:.5rem"><div class="inner-progressbar fx-prob-frequency" style="background-color:#62c555;width:94.4146%;height:.5rem;border-radius:.5rem"></div></span></div></div></div>';

const svg_notac_html = '<svg viewBox="0 0 24 24" focusable="false" class="chakra-icon css-atp543"><path d="M18.0004 12C18.0004 14.9745 15.836 17.4434 12.9962 17.9178C12.4515 18.0088 12.0004 17.5523 12.0004 17V7.00002C12.0004 6.44774 12.4515 5.99129 12.9962 6.08228C15.836 6.55663 18.0004 9.02557 18.0004 12Z" stroke="currentColor" stroke-width="2.3"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M21.6004 12C21.6004 17.302 17.3023 21.6 12.0004 21.6C6.69846 21.6 2.40039 17.302 2.40039 12C2.40039 6.69809 6.69846 2.40002 12.0004 2.40002C17.3023 2.40002 21.6004 6.69809 21.6004 12Z" stroke="currentColor" stroke-width="2.3"></path></svg>';

const svg_video_sol_html = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="text-purple dark:text-dark-purple h-5 w-5"><path d="M10 15.464v-3.927a.8.8 0 011.259-.656l2.805 1.964a.8.8 0 010 1.31l-2.805 1.964A.8.8 0 0110 15.464z"></path><path d="M7 4a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V9h-3a2 2 0 01-2-2V4H7zm8 .6V7h1.92L15 4.6zM4 5a3 3 0 013-3h7.039a3 3 0 012.342 1.126l2.962 3.701A3 3 0 0120 8.702V19a3 3 0 01-3 3H7a3 3 0 01-3-3V5z"></path></svg>';

const company_tag_html = '<span data-tag="tagslug" class="inline-flex items-center px-2 whitespace-nowrap text-xs leading-6 rounded-full text-label-3 dark:text-dark-label-3 bg-fill-3 dark:bg-dark-fill-3"><span class="max-w-[200px] overflow-hidden overflow-ellipsis font-medium text-label-2 dark:text-dark-label-2 lx-tagname">Google</span><span class="ml-1 rounded-full px-1.5 text-xs font-normal bg-brand-orange dark:bg-dark-brand-orange text-label-r dark:text-dark-label-r lx-tag-num">1208</span></span>';



// lx_contest

const people_dark_svg = '<svg id="lx-people-dark" width="0.8em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.25 4C9.25 2.48122 10.4812 1.25 12 1.25C13.5188 1.25 14.75 2.48122 14.75 4C14.75 5.51878 13.5188 6.75 12 6.75C10.4812 6.75 9.25 5.51878 9.25 4Z" fill="#1C274C"/><path d="M8.22309 11.5741L6.04779 10.849C5.42206 10.6404 5 10.0548 5 9.39526C5 8.41969 5.89953 7.69249 6.85345 7.89691L8.75102 8.30353C8.85654 8.32614 8.9093 8.33744 8.96161 8.34826C10.966 8.76286 13.034 8.76286 15.0384 8.34826C15.0907 8.33744 15.1435 8.32614 15.249 8.30353L17.1465 7.8969C18.1005 7.69249 19 8.41969 19 9.39526C19 10.0548 18.5779 10.6404 17.9522 10.849L15.7769 11.5741C15.514 11.6617 15.3826 11.7055 15.2837 11.7666C14.9471 11.9743 14.7646 12.361 14.8182 12.753C14.834 12.8681 14.8837 12.9974 14.9832 13.256L16.23 16.4977C16.6011 17.4626 15.8888 18.4997 14.8549 18.4997C14.3263 18.4997 13.8381 18.2165 13.5758 17.7574L12 14.9997L10.4242 17.7574C10.1619 18.2165 9.67373 18.4997 9.14506 18.4997C8.11118 18.4997 7.39889 17.4626 7.77003 16.4977L9.01682 13.256C9.11629 12.9974 9.16603 12.8681 9.18177 12.753C9.23536 12.361 9.05287 11.9743 8.71625 11.7666C8.61741 11.7055 8.48597 11.6617 8.22309 11.5741Z" fill="#1C274C"/><path d="M12 21.9998C17.5228 21.9998 22 19.9851 22 17.4998C22 15.778 19.8509 14.282 16.694 13.5254L17.63 15.959C18.379 17.9065 16.9415 19.9996 14.8549 19.9996C13.788 19.9996 12.8028 19.4279 12.2735 18.5015L12 18.0229L11.7265 18.5015C11.1972 19.4279 10.212 19.9996 9.14506 19.9996C7.05851 19.9996 5.62099 17.9065 6.37001 15.959L7.30603 13.5254C4.14907 14.282 2 15.778 2 17.4998C2 19.9851 6.47715 21.9998 12 21.9998Z" fill="#1C274C"/></svg>';
const people_light_svg = '<svg id="lx-people-light" width="0.8em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.75C11.3096 2.75 10.75 3.30964 10.75 4C10.75 4.69036 11.3096 5.25 12 5.25C12.6904 5.25 13.25 4.69036 13.25 4C13.25 3.30964 12.6904 2.75 12 2.75ZM9.25 4C9.25 2.48122 10.4812 1.25 12 1.25C13.5188 1.25 14.75 2.48122 14.75 4C14.75 5.51878 13.5188 6.75 12 6.75C10.4812 6.75 9.25 5.51878 9.25 4ZM16.9894 7.16382C18.4102 6.85936 19.75 7.94247 19.75 9.39553C19.75 10.3779 19.1214 11.2501 18.1894 11.5608L16.0141 12.2859C15.877 12.3316 15.795 12.3591 15.7342 12.3821C15.6957 12.3966 15.6795 12.4044 15.6756 12.4063C15.5935 12.4582 15.5488 12.5528 15.561 12.6491C15.562 12.6534 15.5663 12.6709 15.5795 12.7098C15.6004 12.7714 15.6313 12.8522 15.6832 12.987L16.93 16.2287C17.4901 17.6849 16.4152 19.25 14.8549 19.25C14.0571 19.25 13.3205 18.8225 12.9246 18.1298L12 16.5117L11.0754 18.1298C10.6795 18.8225 9.94287 19.25 9.14506 19.25C7.58484 19.25 6.50994 17.6849 7.07002 16.2287L8.31681 12.987C8.36869 12.8522 8.3996 12.7714 8.42051 12.7098C8.43373 12.6709 8.43803 12.6534 8.43901 12.6491C8.4512 12.5528 8.40652 12.4582 8.32443 12.4063C8.32052 12.4044 8.30434 12.3966 8.26583 12.3821C8.20501 12.3591 8.12301 12.3316 7.98592 12.2859L5.81062 11.5608C4.87863 11.2501 4.25 10.3779 4.25 9.39553C4.25 7.94247 5.58979 6.85936 7.0106 7.16382L8.90817 7.57044C9.01467 7.59326 9.06443 7.60392 9.11353 7.61407C11.0177 8.00795 12.9823 8.00795 14.8865 7.61407C14.9356 7.60392 14.9853 7.59326 15.0918 7.57044L16.9894 7.16382ZM18.25 9.39553C18.25 8.89743 17.7907 8.52615 17.3037 8.63052L15.4034 9.03773C15.3006 9.05975 15.2453 9.0716 15.1903 9.08298C13.0857 9.51831 10.9143 9.51831 8.80969 9.08298C8.7547 9.0716 8.69947 9.05977 8.59688 9.03779L6.69631 8.63052C6.20927 8.52615 5.75 8.89743 5.75 9.39553C5.75 9.73228 5.96549 10.0313 6.28497 10.1378L8.46026 10.8629C8.47839 10.8689 8.49661 10.8749 8.5149 10.881C8.72048 10.9491 8.93409 11.0199 9.1102 11.1286C9.69929 11.4922 10.0186 12.169 9.92485 12.8548C9.89681 13.0599 9.81566 13.2698 9.73756 13.4718C9.73061 13.4898 9.72369 13.5077 9.71683 13.5255L8.47004 16.7672C8.28784 17.2409 8.63751 17.75 9.14506 17.75C9.40459 17.75 9.64422 17.6109 9.77299 17.3856L11.3488 14.6279C11.4823 14.3942 11.7309 14.25 12 14.25C12.2691 14.25 12.5177 14.3942 12.6512 14.6279L14.227 17.3856C14.3558 17.6109 14.5954 17.75 14.8549 17.75C15.3625 17.75 15.7122 17.2409 15.53 16.7672L14.2832 13.5255C14.2763 13.5077 14.2694 13.4898 14.2624 13.4718C14.1843 13.2698 14.1032 13.0599 14.0751 12.8548C13.9814 12.169 14.3007 11.4922 14.8898 11.1286C15.0659 11.0199 15.2795 10.9491 15.4851 10.881C15.5034 10.8749 15.5216 10.8689 15.5397 10.8629L17.715 10.1378C18.0345 10.0313 18.25 9.73228 18.25 9.39553ZM5.21639 14.1631C5.40245 14.5332 5.25328 14.984 4.88321 15.1701C3.36229 15.9348 2.75 16.7949 2.75 17.5C2.75 18.2637 3.47401 19.2048 5.23671 19.998C6.929 20.7596 9.31951 21.25 12 21.25C14.6805 21.25 17.071 20.7596 18.7633 19.998C20.526 19.2048 21.25 18.2637 21.25 17.5C21.25 16.7949 20.6377 15.9348 19.1168 15.1701C18.7467 14.984 18.5975 14.5332 18.7836 14.1631C18.9697 13.793 19.4205 13.6439 19.7906 13.8299C21.4366 14.6575 22.75 15.9 22.75 17.5C22.75 19.2216 21.2354 20.5305 19.3788 21.3659C17.4518 22.2331 14.8424 22.75 12 22.75C9.15764 22.75 6.54815 22.2331 4.62116 21.3659C2.76457 20.5305 1.25 19.2216 1.25 17.5C1.25 15.9 2.5634 14.6575 4.20941 13.8299C4.57948 13.6439 5.03032 13.793 5.21639 14.1631Z" fill="#1C274C"/></svg>';

const friend_table_html = '<table id="fx-friend-table" class="table table-hover table-striped"><thead><tr><th>Rank</th><th>Name</th><th>Score</th><th>Old Rating</th><th>Δ</th><th>New Rating</th></tr></thead><tbody><tr><td>1</td><td>Neal Wu</td><td>18</td><td>3559</td><td>32</td><td>3575</td></tr><tr><td>2</td><td>JOHN KRAM</td><td>18</td><td>3459</td><td>12</td><td>3475</td></tr></tbody></table>';