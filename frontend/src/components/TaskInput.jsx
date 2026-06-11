import { createElement } from "react";
import { Plus } from "lucide";

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

function TaskInput({ title, onChange, onAdd }) {
  function handleKeyDown(e) {
    if (e.key === "Enter") onAdd();
  }

  return (
    <div className="add-task">
      <input
        value={title}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a new note..."
      />
      <button onClick={onAdd}>
        <Icon icon={Plus} size={18} />
        Add
      </button>
    </div>
  );
}

export default TaskInput;
