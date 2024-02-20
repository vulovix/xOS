import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Icon, ToolBar } from "~/utils/general";

export const Calculator = () => {
  const app = useSelector((state) => state.apps.calculator);
  const [equasion, setEquasion] = useState([]);
  const [displayValue, setDisplayValue] = useState("0");
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const getIdx = (node) => {
    let i = 0;
    while ((node = node.previousSibling) != null) {
      i++;
    }

    return i;
  };

  const action = (event) => {
    const button = event.target.dataset.ch;
    const index = getIdx(event.target);

    var val = displayValue;
    if (index == 2) {
      setDisplayValue("0");
      setEquasion([]);
      setError(null);
    } else if (val == "Infinity" || val == "NaN") {
      setError(val);
    } else if (index == 1) {
      setDisplayValue("0");
    } else if (index == 3) {
      val = val.substring(0, val.length - 1);
      if (val.length == 0 || val == "-") val = "0";
      setDisplayValue(val);
    } else if (index < 7 && index > 3) {
      if (button == "inv") {
        var num = parseFloat(val);

        if (num != 0) {
          var inv = 1 / num;
        } else {
          setError("Cannot divide by zero");
          return;
        }
        setDisplayValue(inv.toString());
      } else if (button == "sq") {
        var num = parseFloat(val),
          sq = num ** 2;
        setDisplayValue(sq.toString());
      } else if (button == "sqrt") {
        var num = parseFloat(val);
        if (val[0] != "-") {
          var sqrt = Math.sqrt(num);
        } else {
          setError("Invalid Input");
          return;
        }
        setDisplayValue(sqrt.toString());
      }
    } else if (index > 7 && (index + 1) % 4 != 0) {
      if (button.length == 1) {
        let temporaryEquasion = [...equasion];

        if (temporaryEquasion[3] != null) {
          if (button == ".") {
            val = "0";
          } else {
            val = "";
          }

          setEquasion([]);
        }

        val += button;
        if (displayValue == "0" && button != ".") {
          val = button;
        }

        if (val.length < 17 && val.match(/^-?[0-9]+([.][0-9]*)?$/) != null) {
          setDisplayValue(val);
        }
      } else if (displayValue != "0") {
        if (displayValue[0] == "-") {
          setDisplayValue(displayValue.substring(1));
        } else {
          setDisplayValue("-" + displayValue);
        }
      }
    } else if (index > 3 && index % 4 == 3) {
      let temporaryEquasion = [...equasion];
      if (button != "=") {
        if (temporaryEquasion[2] == null) {
          if (temporaryEquasion[0] == null) {
            temporaryEquasion[0] = parseFloat(displayValue);
          }
          temporaryEquasion[1] = button;
        } else {
          temporaryEquasion = [displayValue, button];
        }

        setDisplayValue("0");
        setEquasion(temporaryEquasion);
      } else {
        if (temporaryEquasion[1] != null) {
          if (temporaryEquasion[2] == null) {
            temporaryEquasion[2] = parseFloat(displayValue);
          }

          temporaryEquasion[3] = "=";
          if (temporaryEquasion[1] == "/") {
            if (temporaryEquasion[2] != 0) {
              temporaryEquasion[4] =
                temporaryEquasion[0] / temporaryEquasion[2];
            } else {
              setError("Cannot divide by zero");
              return;
            }
          } else if (temporaryEquasion[1] == "x") {
            temporaryEquasion[4] = temporaryEquasion[0] * temporaryEquasion[2];
          } else if (temporaryEquasion[1] == "-") {
            temporaryEquasion[4] = temporaryEquasion[0] - temporaryEquasion[2];
          } else {
            temporaryEquasion[4] = temporaryEquasion[0] + temporaryEquasion[2];
          }

          let temporaryHistory = [...history];
          setEquasion(temporaryEquasion);
          setDisplayValue(temporaryEquasion[4]);
          temporaryHistory.push(temporaryEquasion);
          setHistory(temporaryHistory);
        }
      }
    }
  };

  return (
    <div
      className="calcApp floatTab dpShad"
      data-size={app.size}
      id={app.icon + "App"}
      data-max={app.max}
      style={{
        ...(app.size == "cstm" ? app.dim : null),
        zIndex: app.z,
      }}
      data-hide={app.hide}
    >
      <ToolBar
        app={app.action}
        icon={app.icon}
        size={app.size}
        name="Calculator"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="flex pt-2">
          <div className="flex pl-2 items-center">
            <Icon className="menuBars" fafa="faBars" color="#222" width={14} />
            <div className="mx-4 font-semibold pb-1">Standard</div>
          </div>
        </div>
        <div className="restWindow h-full flex-grow flex">
          <div className="w-full flex-grow flex flex-col relative">
            <div className="valCont w-full">
              <div className="eqCont">
                {equasion[0]} {equasion[1]} {equasion[2]} {equasion[3]}{" "}
                {equasion[4]}
              </div>
              <div className="vlcCont">
                {error == null ? displayValue : error}
              </div>
            </div>
            <div className="msrVal">
              <div>MC</div>
              <div>MR</div>
              <div>M+</div>
              <div>M-</div>
              <div>MS</div>
            </div>
            <div className="opcont" data-err={error != null}>
              <div onClick={action} className="oper" data-ch="%">
                %
              </div>
              <div onClick={action} className="oper" data-ch="CE">
                CE
              </div>
              <div onClick={action} className="oper" data-ch="C">
                C
              </div>
              <div onClick={action} className="oper" data-ch="back">
                <Icon fafa="faBackspace" />
              </div>
              <div onClick={action} className="oper" data-ch="inv">
                1/x
              </div>
              <div onClick={action} className="oper opow" data-ch="sq">
                x<sup className="text-xss">2</sup>
              </div>
              <div onClick={action} className="oper opow" data-ch="sqrt">
                <sup className="text-xss">2</sup>
                √x
              </div>
              <div onClick={action} className="oper" data-ch="/">
                /
              </div>
              <div onClick={action} className="oper" data-ch="7">
                7
              </div>
              <div onClick={action} className="oper" data-ch="8">
                8
              </div>
              <div onClick={action} className="oper" data-ch="9">
                9
              </div>
              <div onClick={action} className="oper" data-ch="x">
                x
              </div>
              <div onClick={action} className="oper" data-ch="4">
                4
              </div>
              <div onClick={action} className="oper" data-ch="5">
                5
              </div>
              <div onClick={action} className="oper" data-ch="6">
                6
              </div>
              <div onClick={action} className="oper" data-ch="-">
                -
              </div>
              <div onClick={action} className="oper" data-ch="1">
                1
              </div>
              <div onClick={action} className="oper" data-ch="2">
                2
              </div>
              <div onClick={action} className="oper" data-ch="3">
                3
              </div>
              <div onClick={action} className="oper" data-ch="+">
                +
              </div>
              <div onClick={action} className="oper" data-ch="+-">
                +/-
              </div>
              <div onClick={action} className="oper" data-ch="0">
                0
              </div>
              <div onClick={action} className="oper" data-ch=".">
                .
              </div>
              <div onClick={action} className="oper" data-ch="=">
                =
              </div>
            </div>
          </div>
          <div className="calcHis flex flex-col">
            <div className="text-sm font-semibold">History</div>
            {history.length != 0 ? null : (
              <div className="text-xs mt-4">There's no history yet</div>
            )}
            <div className="histCont win11Scroll">
              <div className="hct h-max flex-grow">
                {history.map((his) => {
                  return (
                    <div className="flex flex-col items-end mb-6 text-gray-500">
                      {his[0]} {his[1]} {his[2]} {his[3]}
                      <div className="text-2xl text-gray-600">{his[4]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
