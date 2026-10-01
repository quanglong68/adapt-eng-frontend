import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom"; // SỬ DỤNG REACT ROUTER DOM
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AlertTriangle, CheckCircle2, TrendingDown, Clock, Zap, ChevronRight, BarChart2, Loader2, ArrowLeft, ArrowRight, Map, Sparkles, Trophy, Target, Flame, TrendingUp, Check } from "lucide-react";
import { knowledgeMapService } from "../../../entities/knowledge/knowledge-map.service";
import { handleApiError } from "../../../shared/api/handleApiError";
import { STORAGE_KEYS } from "../../../shared/lib/storageKeys";
import { KnowledgeMapResponse, SkillRadarData } from "../../../entities/knowledge/knowledge-map.type";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="px-3 py-2 rounded-xl text-xs font-semibold shadow-lg bg-slate-950 text-white">
        {d.skillName}: <span className="text-indigo-300">{d.score}%</span>
      </div>
    );
  }
  return null;
};

export function KnowledgeMap() {
  const navigate = useNavigate();

  // STATE LƯU DỮ LIỆU TỪ API
  const [mapData, setMapData] = useState<KnowledgeMapResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Lấy level từ LocalStorage (hoặc có thể lấy từ API tùy bạn)
  const currentLevel = localStorage.getItem(STORAGE_KEYS.currentLevel) || "B1";

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        const data = await knowledgeMapService.getKnowledgeMap();
        setMapData(data);
      } catch (error) {
        handleApiError(error, "Lỗi khi tải bản đồ kiến thức!");
      } finally {
        setLoading(false);
      }
    };
    fetchMapData();
  }, []);

  // HÀM: Tự động sinh lời khuyên AI dựa trên điểm yếu nhất
  const generateAITip = (radarData: SkillRadarData[]) => {
    if (!radarData || radarData.length === 0) return "Hãy làm bài tập đầu vào để AI thu thập dữ liệu năng lực nhé!";
    const weakest = [...radarData].sort((a, b) => a.score - b.score)[0];

    if (weakest.score < 50) {
      return `Tập trung ôn luyện phần mảng "${weakest.skillName}" trong 3-5 ngày tới. Đây là kỹ năng có điểm thấp nhất và ảnh hưởng lớn đến điểm tổng của bạn.`;
    }
    return `Phong độ đang rất tốt! Kỹ năng "${weakest.skillName}" tuy thấp nhất nhưng vẫn đạt mức khá (${weakest.score}%). Hãy tiếp tục duy trì luyện tập.`;
  };

  // MÀN HÌNH LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
        <p className="font-semibold text-slate-500">AI đang phân tích dữ liệu não bộ...</p>
      </div>
    );
  }

  // FALLBACK LỖI
  if (!mapData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <p className="text-rose-600 font-bold mb-4">Không thể kết nối đến hệ thống phân tích.</p>
        <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1 transition-all duration-300">Quay về Dashboard</button>
      </div>
    );
  }

  // TÍNH TOÁN CÁC CHỈ SỐ TỔNG QUAN
  const totalScore = mapData.radarData.reduce((sum, item) => sum + item.score, 0);
  const avgScore = mapData.radarData.length > 0 ? Math.round(totalScore / mapData.radarData.length) : 0;
  const criticalCount = mapData.weakPoints.length; // Số lượng điểm yếu
  const stableCount = mapData.radarData.filter(r => r.score >= 50 && r.score < 80).length; // Số lượng trung bình khá

  return (
    <div className="min-h-screen bg-white">
      {/* HERO strip full-width */}
      <section className="w-full bg-slate-50 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[100px] bg-indigo-400/30" />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[100px] bg-purple-400/30" />
        <div className="absolute -bottom-24 right-10 w-96 h-96 rounded-full blur-[100px] bg-cyan-400/30" />
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <button
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 hover:text-indigo-500 transition-colors"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Quay lại Tổng quan
              </button>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-white border border-indigo-100 flex items-center justify-center shrink-0">
                  <Map className="w-5 h-5 text-indigo-600" />
                </span>
                Bản đồ Kiến thức
              </h1>
              <p className="text-slate-500 mt-2">Trực quan hóa điểm mạnh và lỗ hổng kiến thức của bạn</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-indigo-100 w-fit">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-600">Cấp độ: {currentLevel}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview + radar strip */}
      <section className="w-full bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Radar chart - TRUYỀN DATA THẬT */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
              className="lg:col-span-3 bg-white border border-slate-200/60 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-indigo-600" />
                </span>
                <h2 className="font-bold text-slate-900">Biểu đồ lưới năng lực</h2>
                <div className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold bg-indigo-50 text-indigo-600">
                  Cập nhật: Tự động
                </div>
              </div>

              <ResponsiveContainer width="100%" height={320}>
                {mapData.radarData.length > 0 ? (
                  <RadarChart data={mapData.radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="skillName" tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }} />
                    <Radar name="Điểm" dataKey="score" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.18} strokeWidth={2} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-slate-500 italic">
                    Chưa có đủ dữ liệu để vẽ biểu đồ
                  </div>
                )}
              </ResponsiveContainer>

              {/* Legend - Tự sinh theo Data */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 border-t border-slate-200/60 pt-4">
                {mapData.radarData.map((item) => {
                  const tone = item.score >= 80 ? "emerald" : item.score >= 50 ? "amber" : "rose";
                  const dotClass = tone === "emerald" ? "bg-emerald-500" : tone === "amber" ? "bg-amber-500" : "bg-rose-500";
                  const textClass = tone === "emerald" ? "text-emerald-600" : tone === "amber" ? "text-amber-600" : "text-rose-600";
                  return (
                    <div key={item.skillEnum} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate text-slate-900" title={item.skillName}>{item.skillName}</div>
                        <div className={`text-xs font-bold ${textClass}`}>{item.score}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right col */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overall score - TÍNH TOÁN THẬT */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
                className="bg-white border border-slate-200/60 rounded-2xl p-5"
              >
                <h3 className="font-bold mb-4 text-sm text-slate-900">Tổng quan năng lực</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Điểm TB", value: `${avgScore}%`, icon: Target, tile: "bg-orange-50", iconColor: "text-orange-600", valueColor: "text-orange-600" },
                    { label: "Đã thông thạo", value: `${mapData.masteredItems.length}`, icon: Trophy, tile: "bg-emerald-50", iconColor: "text-emerald-600", valueColor: "text-emerald-600" },
                    { label: "Cần ôn gấp", value: `${criticalCount}`, icon: Flame, tile: "bg-rose-50", iconColor: "text-rose-600", valueColor: "text-rose-600" },
                    { label: "Đang ổn", value: `${stableCount}`, icon: TrendingUp, tile: "bg-amber-50", iconColor: "text-amber-600", valueColor: "text-amber-600" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-xl text-center bg-slate-50 border border-slate-200/60">
                      <div className={`w-8 h-8 rounded-xl ${stat.tile} flex items-center justify-center mx-auto mb-1.5`}>
                        <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                      </div>
                      <div className={`text-sm font-bold ${stat.valueColor}`}>{stat.value}</div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* AI Suggestion - SINH ĐỘNG */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}
                className="rounded-2xl p-4 bg-indigo-50/50 border border-indigo-100"
              >
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                    <Sparkles className="w-4 h-4 text-white" />
                  </span>
                  <div>
                    <div className="text-xs font-bold mb-1 text-indigo-600">Hệ thống AI Phân tích</div>
                    <p className="text-xs leading-relaxed text-indigo-950">
                      {generateAITip(mapData.radarData)}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate("/practice")}
                  className="w-full mt-3 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1 transition-all duration-300"
                >
                  Vào phòng ôn tập ngay
                  <ChevronRight className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Weak Points strip - list phẳng */}
      <section className="w-full bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </span>
              <h2 className="font-bold text-slate-900">Lỗ hổng kiến thức cần ôn tập</h2>
            </div>

            <div className="border-y border-slate-200/60 divide-y divide-slate-100">
              {mapData.weakPoints.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-500 font-medium">Tuyệt vời! Bạn hiện không có lỗ hổng kiến thức nào ở mức báo động.</p>
                </div>
              ) : (
                mapData.weakPoints.map((item, i) => {
                  // TỰ ĐỘNG ĐỊNH DẠNG MÀU SẮC THEO MỨC ĐỘ NGUY HIỂM (Dưới 40% là Đỏ, 40-59% là Cam)
                  const isCritical = item.score < 40;
                  const tileClass = isCritical ? "bg-rose-50" : "bg-orange-50";
                  const iconClass = isCritical ? "text-rose-600" : "text-orange-600";
                  const badgeClass = isCritical ? "bg-rose-50 text-rose-600" : "bg-orange-50 text-orange-600";
                  const barClass = isCritical ? "bg-rose-500" : "bg-orange-500";
                  const scoreClass = isCritical ? "text-rose-600" : "text-orange-600";
                  const btnClass = isCritical
                    ? "bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/25"
                    : "bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-600/25";
                  const uiLabel = isCritical ? "Cần ôn gấp" : "Đang quên dần";

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.4 }}
                      className="p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:bg-slate-100/50 rounded-xl transition-all duration-300"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tileClass}`}>
                        <TrendingDown className={`w-5 h-5 ${iconClass}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-sm text-slate-900">{item.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badgeClass}`}>
                            {uiLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-slate-100">
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                              className={`h-full rounded-full ${barClass}`}
                            />
                          </div>
                          <span className={`text-sm font-bold ${scoreClass}`}>{item.score}%</span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right flex-shrink-0">
                        <div className="text-xs flex items-center gap-1 text-slate-400 sm:justify-end">
                          <Clock className="w-3 h-3" /> Sai sót: {item.lastMistake}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.03 }} onClick={() => navigate("/practice")}
                          className={`mt-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1 transition-all duration-300 ${btnClass}`}
                        >
                          Vá lỗ hổng
                          <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mastered strip - list phẳng */}
      <section className="w-full bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </span>
              <h2 className="font-bold text-slate-900">Đã thông thạo</h2>
            </div>

            {mapData.masteredItems.length === 0 ? (
              <div className="p-6 border-y border-slate-200/60 text-center">
                <p className="text-sm text-slate-500 font-medium">Chưa có chủ điểm nào đạt ngưỡng thông thạo. Hãy tiếp tục cố gắng nhé!</p>
              </div>
            ) : (
              <div className="border-y border-slate-200/60 divide-y divide-slate-100">
                {mapData.masteredItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.05, duration: 0.4 }}
                    className="p-5 flex items-center gap-4 hover:bg-slate-100/50 rounded-xl transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-50">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm mb-1 text-slate-900">{item.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full overflow-hidden bg-slate-100">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                            className="h-full rounded-full bg-emerald-500"
                          />
                        </div>
                        <span className="text-xs font-bold text-emerald-600">{item.score}%</span>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 flex flex-col items-end gap-1 shrink-0">
                      <span className="rounded-full text-[10px] font-semibold px-2 py-0.5 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700">
                        <Check className="w-3 h-3" />
                        Đã nhớ lâu dài
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        Lần cuối: {item.lastReview}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
