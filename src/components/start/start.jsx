import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "../../utils/general";
import { getAuth } from "firebase/auth";

export const StartMenu = () => {
  const user = getAuth().currentUser;
  const { align } = useSelector((state) => state.taskbar);
  const start = useSelector((state) => {
    var arr = state.startmenu,
      ln = (6 - (arr.pnApps.length % 6)) % 6;

    for (var i = 0; i < ln; i++) {
      arr.pnApps.push({
        empty: true,
      });
    }

    for (i = 0; i < arr.rcApps.length; i++) {
      if (arr.rcApps[i].lastUsed < 0) {
        arr.rcApps[i].lastUsed = "Recently Added";
      } else if (arr.rcApps[i].lastUsed < 10) {
        arr.rcApps[i].lastUsed = "Just Now";
      } else if (arr.rcApps[i].lastUsed < 60) {
        arr.rcApps[i].lastUsed += "m ago";
      } else if (arr.rcApps[i].lastUsed < 360) {
        arr.rcApps[i].lastUsed =
          Math.floor(arr.rcApps[i].lastUsed / 60) + "h ago";
      }
    }

    var allApps = [],
      tmpApps = Object.keys(state.apps)
        .filter((x) => x != "hz")
        .map((key) => {
          return state.apps[key];
        });

    tmpApps.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

    for (i = 0; i < 27; i++) {
      allApps[i] = [];
    }

    for (i = 0; i < tmpApps.length; i++) {
      var t1 = tmpApps[i].name.trim().toUpperCase().charCodeAt(0);
      if (t1 > 64 && t1 < 91) {
        allApps[t1 - 64].push(tmpApps[i]);
      } else {
        allApps[0].push(tmpApps[i]);
      }
    }

    arr.contApps = allApps;
    arr.allApps = tmpApps;
    return arr;
  });

  const [query, setQuery] = useState("");
  const [match, setMatch] = useState({});
  const [atab, setTab] = useState("All");
  // const [pwctrl, setPowCtrl] = useState

  const dispatch = useDispatch();
  const tabSw = (e) => {
    setTab(e.target.innerText.trim());
  };

  const clickDispatch = (event) => {
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload,
    };

    if (action.type) {
      dispatch(action);
    }

    if (
      action.type &&
      (action.payload == "full" || action.type == "EDGELINK")
    ) {
      dispatch({
        type: "STARTHID",
      });
    }

    if (action.type == "STARTALPHA") {
      var target = document.getElementById("char" + action.payload);
      if (target) {
        target.parentNode.scrollTop = target.offsetTop;
      } else {
        var target = document.getElementById("charA");
        target.parentNode.scrollTop = 0;
      }
    }
  };

  useEffect(() => {
    if (query.length) {
      for (var i = 0; i < start.allApps.length; i++) {
        if (start.allApps[i].name.toLowerCase().includes(query.toLowerCase())) {
          setMatch(start.allApps[i]);
          break;
        }
      }
    }
  }, [query]);

  const userName = useSelector((state) => state.setting.person.name);
  return (
    <div
      className="startMenu dpShad"
      data-hide={start.hide}
      style={{ "--prefix": "START" }}
      data-align={align}
    >
      {start.menu ? (
        <>
          <div className="stmenu" data-allapps={start.showAll}>
            <div className="menuUp">
              <div className="pinnedApps">
                <div className="stAcbar">
                  <div className="gpname">Pinned</div>
                  <div
                    className="gpbtn prtclk"
                    onClick={clickDispatch}
                    data-action="STARTALL"
                  >
                    <div>All apps</div>
                    <Icon fafa="faChevronRight" width={8} />
                  </div>
                </div>
                <div className="pnApps">
                  {start.pnApps.map((app, i) => {
                    return app.empty ? (
                      <div key={i} className="pnApp pnEmpty"></div>
                    ) : (
                      <div
                        key={i}
                        className="prtclk pnApp"
                        value={app.action != null}
                        onClick={clickDispatch}
                        data-action={app.action}
                        data-payload={app.payload || "full"}
                      >
                        <Icon className="pnIcon" src={app.icon} width={32} />
                        <div className="appName">{app.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="recApps win11Scroll">
                <div className="stAcbar">
                  <div className="gpname">Recommended</div>
                  <div className="gpbtn none">
                    <div>More</div>
                    <Icon fafa="faChevronRight" width={8} />
                  </div>
                </div>
                <div className="reApps">
                  {start.rcApps.slice(0, 6).map((app, i) => {
                    return app.name ? (
                      <div
                        key={i}
                        className="rnApp"
                        value={app.action != null}
                        onClick={clickDispatch}
                        data-action={app.action}
                        data-payload={app.payload || "full"}
                      >
                        <Icon className="pnIcon" src={app.icon} width={32} />
                        <div className="acInfo">
                          <div className="appName">{app.name}</div>
                          <div className="timeUsed">{app.lastUsed}</div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="allCont" data-allapps={start.showAll}>
            <div className="appCont">
              <div className="stAcbar">
                <div className="gpname">All apps</div>
                <div
                  className="gpbtn prtclk"
                  onClick={clickDispatch}
                  data-action="STARTALL"
                >
                  <Icon className="chevLeft" fafa="faChevronLeft" width={8} />
                  <div>Back</div>
                </div>
              </div>
              <div className="allApps win11Scroll" data-alpha={start.alpha}>
                {start.contApps.map((ldx, i) => {
                  if (ldx.length == 0) return null;

                  var tpApps = [];
                  tpApps.push(
                    <div
                      key={i}
                      className="allApp prtclk"
                      data-action="STARTALPHA"
                      onClick={clickDispatch}
                      id={`char${i == 0 ? "#" : String.fromCharCode(i + 64)}`}
                    >
                      <div className="ltName">
                        {i == 0 ? "#" : String.fromCharCode(i + 64)}
                      </div>
                    </div>
                  );

                  ldx.forEach((app, j) => {
                    tpApps.push(
                      <div
                        key={app.name}
                        className="allApp prtclk"
                        onClick={clickDispatch}
                        data-action={app.action}
                        data-payload={app.payload || "full"}
                      >
                        <Icon className="pnIcon" src={app.icon} width={24} />
                        <div className="appName">{app.name}</div>
                      </div>
                    );
                  });

                  return tpApps;
                })}
              </div>
              <div className="alphaBox" data-alpha={start.alpha}>
                <div className="alphaCont">
                  <div className="dullApp allApp">
                    <div className="ltName">&</div>
                  </div>
                  {start.contApps.map((ldx, i) => {
                    return (
                      <div
                        key={i}
                        className={
                          ldx.length == 0 ? "dullApp allApp" : "allApp prtclk"
                        }
                        data-action="STARTALPHA"
                        onClick={ldx.length == 0 ? null : clickDispatch}
                        data-payload={
                          i == 0 ? "#" : String.fromCharCode(i + 64)
                        }
                      >
                        <div className="ltName">
                          {i == 0 ? "#" : String.fromCharCode(i + 64)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="menuBar">
            <div className="profile handcr">
              <Icon
                src={user ? user.photoURL : "img/asset/prof.png"}
                ext={Boolean(user)}
                ui
                rounded
                width={26}
                click="EXTERNAL"
                payload="https://xos.dev"
              />
              <div className="usName">{user ? user.displayName : userName}</div>
            </div>
            <div className="relative powerMenu">
              <div
                className={`powerCont ${user ? "logged-in" : ""}`}
                data-vis={start.pwctrl}
              >
                <div
                  className="flex prtclk items-center gap-2"
                  onClick={clickDispatch}
                  data-action="WALLALOCK"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6z" />
                    <path d="M11 16a1 1 0 1 0 2 0 1 1 0 0 0-2 0M8 11V7a4 4 0 1 1 8 0v4" />
                  </svg>
                  <span>Lock</span>
                </div>

                {user ? (
                  <>
                    <div
                      className="flex prtclk items-center gap-2"
                      onClick={clickDispatch}
                      data-action="WALLSYNC"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M19 18a3.5 3.5 0 0 0 0-7h-1A5 4.5 0 0 0 7 9a4.6 4.4 0 0 0-2.1 8.4M12 13v9M9 19l3 3 3-3" />
                      </svg>
                      <span>Sync</span>
                    </div>
                    <div
                      className="flex prtclk items-center gap-2"
                      onClick={clickDispatch}
                      data-action="WALLBACKUP"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M7 18a4.6 4.4 0 0 1 0-9 5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
                        <path d="m9 15 3-3 3 3M12 12v9" />
                      </svg>
                      <span>Backup</span>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div
                  className="flex prtclk items-center gap-2"
                  onClick={clickDispatch}
                  data-action="WALLUPDATE"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                  >
                    <path fill="none" stroke="none" d="M0 0h24v24H0z" />
                    <path
                      stroke="none"
                      d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58s9.14-3.47 12.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"
                    />
                  </svg>
                  <span>Update</span>
                </div>
                <div
                  className="flex prtclk items-center gap-2"
                  onClick={clickDispatch}
                  data-action="WALLRESTART"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <path d="M9 4.55a8 8 0 0 1 6 14.9M15 15v5h5M5.63 7.16v.01M4.06 11v.01M4.63 15.1v.01M7.16 18.37v.01M11 19.94v.01" />
                  </svg>
                  <span>Restart</span>
                </div>
                <div
                  className="flex prtclk items-center gap-2"
                  onClick={clickDispatch}
                  data-action="WALLSHUTDN"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <path d="M7 6a7.75 7.75 0 1 0 10 0M12 4v8" />
                  </svg>
                  <span>Shut down</span>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                onClick={clickDispatch}
                data-action="STARTPWC"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M7 6a7.75 7.75 0 1 0 10 0M12 4v8" />
              </svg>
            </div>
          </div>
        </>
      ) : (
        <div className="searchMenu">
          <div className="searchBar">
            <Icon className="searchIcon" src="search" width={16} />
            <input
              type="text"
              onChange={(event) => {
                setQuery(event.target.value.trim());
              }}
              defaultValue={query}
              placeholder="Type here to search"
              autoFocus
            />
          </div>
          <div className="flex py-4 px-1 text-xs">
            <div className="opts w-1/2 flex justify-between">
              <div value={atab == "All"} onClick={tabSw}>
                All
              </div>
              <div value={atab == "Apps"} onClick={tabSw}>
                Apps
              </div>
              <div value={atab == "Documents"} onClick={tabSw}>
                Documents
              </div>
              <div value={atab == "Web"} onClick={tabSw}>
                Web
              </div>
              <div value={atab == "More"} onClick={tabSw}>
                More
              </div>
            </div>
          </div>
          <div className="shResult w-full flex justify-between">
            <div
              className="leftSide flex-col px-1"
              data-width={query.length != 0}
            >
              <div className="text-sm font-semibold mb-4">
                {query.length ? "Best match" : "Top apps"}
              </div>
              {query.length ? (
                <div className="textResult h-16">
                  <div className="smatch flex my-2 p-3 rounded">
                    <Icon src={match.icon} width={24} />
                    <div className="matchInfo flex-col px-2">
                      <div className="font-semibold text-xs">{match.name}</div>
                      <div className="text-xss">App</div>
                    </div>
                  </div>
                  <div
                    className="smatch flex my-2 p-3 rounded handcr prtclk"
                    onClick={clickDispatch}
                    data-action="EDGELINK"
                    data-payload={query}
                  >
                    <Icon className="blueicon" src="search" ui width={20} />
                    <div className="matchInfo flex-col px-2">
                      <div className="font-semibold text-xs">Search online</div>
                      <div className="text-xss">Web</div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="topApps flex w-full justify-between">
                    {start.rcApps.slice(1, 7).map((app, i) => {
                      return (
                        <div
                          key={i}
                          className="topApp pt-6 py-4 ltShad prtclk"
                          onClick={clickDispatch}
                          data-action={app.action}
                          data-payload={app.payload || "full"}
                        >
                          <Icon src={app.icon} width={30} />
                          <div className="text-xs mt-2">{app.name}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-sm font-semibold mt-8">
                    Quick Searches
                  </div>
                  <div className="quickSearches mt-2">
                    {start.qksrch.map((srch, i) => {
                      return (
                        <div
                          key={i}
                          className="qksrch flex items-center p-3 my-1 handcr prtclk"
                          onClick={clickDispatch}
                          data-action="EDGELINK"
                          data-payload={srch[2]}
                        >
                          <Icon fafa={srch[0]} reg={srch[1]} />
                          <div className="ml-4 text-sm">{srch[2]}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            {query.length ? (
              <div className="w-2/3 rightSide rounded">
                <Icon className="mt-6" src={match.icon} width={64} />
                <div className="">{match.name}</div>
                <div className="text-xss mt-2">App</div>
                <div className="hline mt-8"></div>
                <div
                  className="openlink w-4/5 flex prtclk handcr pt-3"
                  onClick={clickDispatch}
                  data-action={match.action}
                  data-payload={match.payload ? match.payload : "full"}
                >
                  <Icon className="blueicon" src="link" ui width={16} />
                  <div className="text-xss ml-3">Open</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
