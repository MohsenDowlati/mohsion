'use client';

import { TaskPriority } from "@/types/task";
import { useState } from "react";

type Props = {
  onSelect: (val: TaskPriority) => void;
};

export default function Dropdown({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("Select Priority ▾");

  const select = (val: TaskPriority) => {
    onSelect(val);
    setText(val);
    setOpen(false);
  };

  return (
    <div className="relative w-full inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-cyan-400/40
        hover:bg-slate-700 hover:border-cyan-400
        shadow-[0_0_10px_rgba(34,211,238,0.4)]
        transition-all duration-200"
      >
        {text}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-full rounded-lg bg-slate-900 border border-cyan-400/30
          shadow-xl backdrop-blur-md overflow-hidden"
        >
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-green-400 hover:text-black transition"
            onClick={() => {select("low")}}
          >
            Low
          </button>

          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-yellow-400 hover:text-black transition"
            onClick={() => select("medium")}
          >
            Medium
          </button>

          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-red-500 hover:text-black transition"
            onClick={() => select("high")}
          >
            High
          </button>
        </div>
      )}
    </div>
  );
}
