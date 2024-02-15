import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "~/utils/general";
import * as actions from "~/actions";
import "./style.scss";

export const ActionMenu = () => {
  const menu = useSelector((state) => state.menus);

  const menuOptions = menu.data[menu.opts];

  const { position, isLeft } = useSelector((state) => {
    const numberOfOptions = state.menus.menus[state.menus.opts].length;
    const position = {
      top: state.menus.top,
      left: state.menus.left,
    };
    let isLeft = false;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const width = 312;
    const height = numberOfOptions * 28;

    isLeft = windowWidth - position.left > 504;
    if (windowWidth - position.left < width) {
      position.left = windowWidth - width;
    }

    if (windowHeight - position.top < height) {
      position.bottom = windowHeight - position.top;
      position.top = null;
    }

    return {
      position,
      isLeft,
    };
  });

  const dispatch = useDispatch();

  const onOptionSelect = (event) => {
    event.stopPropagation();
    const action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload,
    };

    if (action.type) {
      if (action.type !== action.type.toUpperCase()) {
        actions[action.type](action.payload, menu);
      } else {
        dispatch(action);
      }
      dispatch({ type: "MENUHIDE" });
    }
  };

  const renderMenu = (data) => {
    var nodes = [];
    data.forEach((opt, i) => {
      if (opt.type === "hr") {
        nodes.push(<div key={i} className="menuhr"></div>);
      } else {
        nodes.push(
          <div
            key={i}
            data-dsb={opt.dsb}
            className="menu-option"
            onClick={onOptionSelect}
            data-action={opt.action}
            data-payload={opt.payload}
          >
            {menuOptions.ispace !== false ? (
              <div className="option-icon">
                {opt.icon && opt.type === "svg" ? (
                  <Icon icon={opt.icon} width={16} />
                ) : null}
                {opt.icon && opt.type === "fa" ? (
                  <Icon fafa={opt.icon} width={16} />
                ) : null}
                {opt.icon && opt.type === null ? (
                  <Icon src={opt.icon} width={16} />
                ) : null}
              </div>
            ) : null}
            <div className="no-option">{opt.name}</div>
            {opt.opts ? (
              <Icon
                className="marker-icon rightIcon"
                fafa="faChevronRight"
                width={10}
                color="#999"
              />
            ) : null}
            {opt.dot ? (
              <Icon
                className="marker-icon dotIcon"
                fafa="faCircle"
                width={4}
                height={4}
              />
            ) : null}
            {opt.check ? (
              <Icon
                className="marker-icon checkIcon"
                fafa="faCheck"
                width={8}
                height={8}
              />
            ) : null}
            {opt.opts ? (
              <div
                className="mini-menu"
                style={{
                  minWidth: menuOptions.secwid,
                }}
              >
                {renderMenu(opt.opts)}
              </div>
            ) : null}
          </div>
        );
      }
    });

    return nodes;
  };

  return (
    <div
      id="action-menu"
      className="action-menu"
      style={{
        ...position,
        "--prefix": "MENU",
        width: menuOptions.width,
      }}
      data-left={isLeft}
      data-hide={menu.hide}
    >
      {renderMenu(menu.menus[menu.opts])}
    </div>
  );
};

export default ActionMenu;
