import { useMemo, createElement } from "react";
import { Check, Undo2, Trash2, X, GripVertical } from "lucide";

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

function StickyNote({ task, onUpdateStatus, onDelete, onDragStart }) {
  const isDone = task.status === "done";

  const rotation = useMemo(() => (Math.random() - 0.5) * 3, []);

  const noteColors = [
    "#fef9c3", "#fce7f3", "#dbeafe",
    "#dcfce7", "#f3e8ff", "#ffedd5",
    "#fef3c7", "#e0f2fe", "#ecfdf5",
    "#fdf2f8", "#f5f3ff", "#fff7ed",
  ];
  const bgColor = useMemo(
    () => noteColors[Math.floor(Math.random() * noteColors.length)],
    []
  );

  return (
    <div
      className={`sticky-note${isDone ? " done-note" : ""}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        backgroundColor: bgColor,
      }}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
    >
      <div className="sticky-note-grip">
        <Icon icon={GripVertical} size={14} />
      </div>
      <span className={`sticky-note-text${isDone ? " done" : ""}`}>
        {task.title}
      </span>
      <div className="sticky-note-actions">
        {isDone ? (
          <>
            <button
              className="sticky-btn undo-btn"
              title="Move to Todo"
              onClick={() => onUpdateStatus(task.id, "todo")}
            >
              <Icon icon={Undo2} size={16} />
            </button>
            <button
              className="sticky-btn remove-btn"
              title="Remove"
              onClick={() => onDelete(task.id)}
            >
              <Icon icon={X} size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              className="sticky-btn done-btn"
              title="Mark Done"
              onClick={() => onUpdateStatus(task.id, "done")}
            >
              <Icon icon={Check} size={16} />
            </button>
            <button
              className="sticky-btn delete-btn"
              title="Delete"
              onClick={() => onDelete(task.id)}
            >
              <Icon icon={Trash2} size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default StickyNote;
