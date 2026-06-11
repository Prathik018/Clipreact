import { createElement } from "react";
import { StickyNote } from "lucide";

function toReact([tag, attrs, children], key) {
  if (children) return createElement(tag, { ...attrs, key }, children.map(toReact));
  return createElement(tag, { ...attrs, key });
}

function Icon({ icon, size }) {
  return createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size, height: size, viewBox: "0 0 24 24",
      fill: "none", stroke: "currentColor",
      strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round",
    },
    icon.map((node, i) => toReact(node, i))
  );
}

function Header() {
  return (
    <div className="header">
      <div className="header-top">
        <h1 className="title">Kanban Task Manager</h1>
      </div>
      <p className="subtitle">Drag notes between columns</p>
    </div>
  );
}

export default Header;
