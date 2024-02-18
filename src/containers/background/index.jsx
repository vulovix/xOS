import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Battery from "../../components/shared/Battery";
import { Icon, Image } from "../../utils/general";
import "./back.scss";
import CommunicationProviderContext from "~/providers/Communication/context";
import SynchronizationProviderContext from "~/providers/Synchronization/context";
import useTaskCompletion from "~/hooks/useTaskStatusCompletion";
import { getAuth } from "firebase/auth";
import synchronizationApps from "~/utils/sync";

export const Background = () => {
  const wall = useSelector((state) => state.wallpaper);
  const dispatch = useDispatch();

  return (
    <div
      className="background"
      style={{
        backgroundImage: `url(img/wallpaper/${wall.src})`,
      }}
    ></div>
  );
};

export const BootScreen = (props) => {
  const dispatch = useDispatch();
  const wall = useSelector((state) => state.wallpaper);
  const [blackout, setBlackOut] = useState(false);

  useEffect(() => {
    if (props.dir < 0) {
      setTimeout(() => {
        setBlackOut(true);
      }, 4000);
    }
  }, [props.dir]);

  useEffect(() => {
    if (props.dir < 0) {
      if (blackout) {
        if (wall.act == "restart") {
          setTimeout(() => {
            setBlackOut(false);
            setTimeout(() => {
              dispatch({ type: "WALLBOOTED" });
            }, 4000);
          }, 2000);
        }
      }
    }
  }, [blackout]);

  return (
    <div className="bootscreen">
      <div className={blackout ? "hidden" : ""}>
        <Image src="asset/logo" w={180} />
        <div className="mt-48" id="loader">
          <Loader />
        </div>
      </div>
    </div>
  );
};

export const LockScreen = (props) => {
  const user = getAuth().currentUser;
  const wall = useSelector((state) => state.wallpaper);
  const [lock, setLock] = useState(false);
  const [unlocked, setUnLock] = useState(false);
  const [password, setPass] = useState("");
  const [passType, setType] = useState(1);
  const [forgot, setForget] = useState(false);
  const dispatch = useDispatch();

  const userName = useSelector((state) => state.setting.person.name);

  const action = (e) => {
    var act = e.target.dataset.action,
      payload = e.target.dataset.payload;

    if (act == "splash") setLock(true);
    else if (act == "inpass") {
      var val = e.target.value;
      if (!passType) {
        val = val.substring(0, 4);
        val = !Number(val) ? "" : val;
      }

      setPass(val);
    } else if (act == "forgot") setForget(true);
    else if (act == "pinlock") setType(0);
    else if (act == "passkey") setType(1);

    if (act == "pinlock" || act == "passkey") setPass("");
  };

  const proceed = () => {
    setUnLock(true);
    setTimeout(() => {
      dispatch({ type: "WALLUNLOCK" });
    }, 1000);
  };

  const action2 = (e) => {
    if (e.key == "Enter") proceed();
  };

  return (
    <div
      className={"lockscreen " + (props.dir == -1 ? "slowfadein" : "")}
      data-unlock={unlocked}
      style={{
        backgroundPosition: "center",
        backgroundImage: `url(${`img/wallpaper/lock.jpg`})`,
      }}
      onClick={action}
      data-action="splash"
      data-blur={lock}
    >
      <div className="splashScreen mt-40" data-faded={lock}>
        <div className="text-6xl font-semibold text-gray-100">
          {new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          })}
        </div>
        <div className="text-lg font-medium text-gray-200">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      <div className="fadeinScreen" data-faded={!lock} data-unlock={unlocked}>
        <img
          className="rounded-full overflow-hidden"
          src={user ? user.photoURL : "img/asset/prof.png"}
          alt="Profile"
          referrerPolicy="no-referrer"
          // width={140}
        />
        <div className="mt-6 text-3xl font-bold text-gray-100">
          {user ? user.displayName : userName}
        </div>
        <div className="flex items-center mt-6 signInBtn" onClick={proceed}>
          Sign in
        </div>
        {/*   <input type={passType?"text":"password"} value={password} onChange={action}
              data-action="inpass" onKeyDown={action2} placeholder={passType?"Password":"PIN"}/>
          <Icon className="-ml-6 handcr" fafa="faArrowRight" width={14}
            color="rgba(170, 170, 170, 0.6)" onClick={proceed}/>
        </div>
        <div className="text-xs text-gray-400 mt-4 handcr"
          onClick={proceed}>
          {!forgot?`I forgot my ${passType?"password":"pin"}`:"Not my problem"}
        </div>
        <div className="text-xs text-gray-400 mt-6">
          Sign-in options
        </div>
        <div className="lockOpt flex">
          <Icon src="pinlock" onClick={action} ui width={36}
            click="pinlock" payload={passType==0}/>
          <Icon src="passkey" onClick={action} ui width={36}
            click="passkey" payload={passType==1}/>
        </div> */}
      </div>
      <div className="bottomInfo flex">
        <Icon className="mx-2" src="wifi" ui width={16} invert />
        <Battery invert />
      </div>
    </div>
  );
};

export const UpdateScreen = (props) => {
  const dispatch = useDispatch();
  let percentage = 0;
  let currentTime;
  let time = 500000; // 6000;
  let refresh = 1000;

  useEffect(() => {
    currentTime = time;
    startLoading();
  }, []);

  const [percent, setPercent] = useState(0);

  const startLoading = () => {
    currentTime = currentTime - refresh;
    percentage = ((time - currentTime) * 100) / time;
    setPercent(parseInt(percentage));
    let t;
    if (currentTime !== 0) {
      t = setTimeout(startLoading, refresh);
    } else {
      clearTimeout(t);
      dispatch({ type: "WALLUPDATED" });
    }
  };

  return (
    <div className={`update-screen ${props.dir === -1 ? "slowfadein" : ""}`}>
      <div class="update">
        <div class="update__content_wrapper">
          <div className="bumper" />
          <div className="update__content">
            <Loader />

            <div class="update__text header">
              <p id="update__percentage">You're {percent}% there.</p>
              <p>Please keep your computer on.</p>
            </div>
          </div>

          <div class="update__text footer">
            <p>Your computer might restart few times.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const waitWindowToLoad = (cb, index) => setTimeout(cb, 1000 * (index + 1));

export const BackupScreen = (props) => {
  const dispatch = useDispatch();

  const communicationContext = useContext(CommunicationProviderContext);
  const synchronizationContext = useContext(SynchronizationProviderContext);

  const desktop = useSelector((state) => state.desktop);

  const totalTasks = Object.keys(synchronizationApps).length;

  const { markAsCompleted, percentage, isComplete } = useTaskCompletion(
    totalTasks,
    totalTasks * 2
  );

  const onMessage = (e) => {
    if (e.origin.endsWith(".xos.dev")) {
      let { key, response, method } = e.data;
      if (method === "RESPONSE") {
        const appForSync = Object.values(synchronizationApps).find(
          (x) => x.storageKey === key
        );
        const desktopApp = desktop.apps.find((x) => x.name === appForSync.key);
        if (response) {
          synchronizationContext
            .write(appForSync.collection, response)
            .then(() => {
              dispatch({
                type: desktopApp.action,
                payload: "close",
              });
              markAsCompleted();
            });
        } else {
          console.log(
            `Nothing written inside ${desktopApp.name}. Response was empty.`
          );
          dispatch({
            type: desktopApp.action,
            payload: "close",
          });
          markAsCompleted();
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("message", onMessage, false);

    const desktopApps = desktop.apps.filter(
      (app) => synchronizationApps[app.name]
    );

    const externalDesktopApps = desktopApps.filter((x) => x.pwa);

    externalDesktopApps.forEach((desktopApp, i) => {
      waitWindowToLoad(() => {
        dispatch({
          type: desktopApp.action,
          payload: "full",
        });
        const synchronizationApp = synchronizationApps[desktopApp.name];
        waitWindowToLoad(() => {
          communicationContext.retrieve(
            synchronizationApp.collection,
            synchronizationApp.storageKey
          );
        }, i);
      }, i);
    });

    const localDesktopApps = desktopApps.filter((x) => !x.pwa);

    localDesktopApps.forEach((desktopApp, i) =>
      waitWindowToLoad(() => {
        const synchronizationApp = synchronizationApps[desktopApp.name];
        const response = communicationContext.retrieveLocally(
          synchronizationApp.storageKey
        );
        waitWindowToLoad(() => {
          synchronizationContext
            .write(synchronizationApp.collection, response)
            .then(() => {
              dispatch({
                type: desktopApp.action,
                payload: "close",
              });
              markAsCompleted();
            });
        }, i);
      }, i)
    );

    return () => {
      window.removeEventListener("message", onMessage, false);
    };
  }, []);

  useEffect(() => {
    if (isComplete) {
      dispatch({ type: "WALLBACKUPED" });
    }
  }, [isComplete]);

  return (
    <div className={`update-screen ${props.dir === -1 ? "slowfadein" : ""}`}>
      <div class="update">
        <div class="update__content_wrapper">
          <div className="bumper" />
          <div className="update__content">
            <Loader />

            <div class="update__text header">
              <p id="update__percentage">You're {percentage}% cloud-ready.</p>
              <p>Please keep your computer on.</p>
            </div>
          </div>

          <div class="update__text footer">
            <p>We are creating a backup of your data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SyncScreen = (props) => {
  const dispatch = useDispatch();

  const communicationContext = useContext(CommunicationProviderContext);
  const synchronizationContext = useContext(SynchronizationProviderContext);

  const desktop = useSelector((state) => state.desktop);

  const totalTasks = Object.keys(synchronizationApps).length;

  const { markAsCompleted, percentage, isComplete } = useTaskCompletion(
    totalTasks,
    totalTasks * 2
  );

  useEffect(() => {
    const desktopApps = desktop.apps.filter(
      (app) => synchronizationApps[app.name]
    );

    const externalDesktopApps = desktopApps.filter((x) => x.pwa);

    externalDesktopApps.forEach((desktopApp, i) => {
      waitWindowToLoad(() => {
        dispatch({
          type: desktopApp.action,
          payload: "full",
        });
        waitWindowToLoad(
          () =>
            synchronizationContext
              .read(synchronizationApps[desktopApp.name].collection)
              .then((data) => {
                const synchronizationApp = synchronizationApps[desktopApp.name];
                communicationContext.store(
                  synchronizationApp.collection,
                  synchronizationApp.storageKey,
                  data.data
                );
                waitWindowToLoad(() => {
                  dispatch({
                    type: desktopApp.action,
                    payload: "close",
                  });
                  markAsCompleted();
                }, i);
              }),
          i
        );
      }, i);
    });

    const localDesktopApps = desktopApps.filter((x) => !x.pwa);

    localDesktopApps.forEach((desktopApp, i) =>
      waitWindowToLoad(
        () =>
          synchronizationContext
            .read(synchronizationApps[desktopApp.name].collection)
            .then((data) => {
              const synchronizationApp = synchronizationApps[desktopApp.name];
              communicationContext.storeLocally(
                synchronizationApp.storageKey,
                data.data
              );
              waitWindowToLoad(() => {
                dispatch({
                  type: desktopApp.action,
                  payload: "close",
                });
                markAsCompleted();
              }, i);
            }),
        i
      )
    );
  }, []);

  useEffect(() => {
    if (isComplete) {
      dispatch({ type: "WALLSYNCED" });
    }
  }, [isComplete]);

  return (
    <div className={`update-screen ${props.dir === -1 ? "slowfadein" : ""}`}>
      <div class="update">
        <div class="update__content_wrapper">
          <div className="bumper" />
          <div className="update__content">
            <Loader />

            <div class="update__text header">
              <p id="update__percentage">You data is {percentage}% loaded.</p>
              <p>Please keep your computer on.</p>
            </div>
          </div>

          <div class="update__text footer">
            <p>We are synching your data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Loader = () => (
  <div class="update__loader">
    <div class="update__spinner">
      <div class="spinner__point"></div>
    </div>
    <div class="update__spinner update__spinner--second">
      <div class="spinner__point"></div>
    </div>
    <div class="update__spinner update__spinner--third">
      <div class="spinner__point"></div>
    </div>
    <div class="update__spinner update__spinner--four">
      <div class="spinner__point"></div>
    </div>
    <div class="update__spinner update__spinner--five">
      <div class="spinner__point"></div>
    </div>
  </div>
);
