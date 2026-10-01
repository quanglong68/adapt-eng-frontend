import { motion } from "motion/react";
import { BookOpen, Edit3 } from "lucide-react";

export type SkillType = "READING_LISTENING" | "WRITING";

interface SkillToggleProps {
    currentSkill: SkillType;
    onChange: (skill: SkillType) => void;
}

export function SkillToggle({ currentSkill, onChange }: SkillToggleProps) {
    return (
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <motion.button
                type="button"
                onClick={() => onChange("READING_LISTENING")}
                className={`relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition-colors w-40 ${currentSkill === "READING_LISTENING" ? "text-indigo-600" : "text-slate-500"}`}
            >
                {currentSkill === "READING_LISTENING" && (
                    <motion.div layoutId="skill-toggle-bg" className="absolute inset-0 bg-white rounded-lg shadow-sm" />
                )}
                <BookOpen className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Đọc & Nghe</span>
            </motion.button>

            <motion.button
                type="button"
                onClick={() => onChange("WRITING")}
                className={`relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition-colors w-40 ${currentSkill === "WRITING" ? "text-indigo-600" : "text-slate-500"}`}
            >
                {currentSkill === "WRITING" && (
                    <motion.div layoutId="skill-toggle-bg" className="absolute inset-0 bg-white rounded-lg shadow-sm" />
                )}
                <Edit3 className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Viết (Writing)</span>
            </motion.button>
        </div>
    );
}