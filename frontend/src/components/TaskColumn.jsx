import { useState } from "react";
import StickyNote from "./StickyNote";
import { createElement } from "react";
import { ListTodo, CheckCircle2 } from "lucide";

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

function TaskColumn({ title, tasks, onUpdateStatus, onDelete, onDrop, onDragOver, onDragStart, status }) {
  const [over, setOver] = useState(false);

  function handleDragOver(e) {
    onDragOver(e);
    setOver(true);
  }

  function handleDragLeave() {
    setOver(false);
  }

  function handleDrop(e) {
    setOver(false);
    onDrop(e, status);
  }

  return (
    <div
      className={`column${over ? " over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <Icon icon={status === "todo" ? ListTodo : CheckCircle2} size={18} />
        <h2>{title}</h2>
        <span className="column-count">{tasks.length}</span>
      </div>
      {tasks.length === 0 && <p className="empty">No notes yet</p>}
      {tasks.map((task) => (
        <StickyNote
          key={task.id}
          task={task}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
}

export default TaskColumn;
