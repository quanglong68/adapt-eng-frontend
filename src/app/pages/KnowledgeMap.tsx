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
import { AlertTriangle, CheckCircle2, TrendingDown, Clock, Zap, ChevronRight, BarChart2, Loader2 } from "lucide-react";
import { knowledgeMapService } from "../services/knowledge-map.service";
import { KnowledgeMapResponse, SkillRadarData } from "../types/knowledge-map.type";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="px-3 py-2 rounded-xl text-xs font-semibold shadow-lg" style={{ background: "#1E293B", color: "#fff" }}>
        {d.skillName}: <span style={{ color: "#A5B4FC" }}>{d.score}%</span>
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
  const currentLevel = localStorage.getItem('currentLevel') || "B1";

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        const data = await knowledgeMapService.getKnowledgeMap();
        setMapData(data);
      } catch (error) {
        console.error("Lỗi khi tải bản đồ kiến thức:", error);
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
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#F9FAFB" }}>
        <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: "#4F46E5" }} />
        <p className="font-semibold text-gray-500">AI đang phân tích dữ liệu não bộ...</p>
      </div>
    );
  }

  // FALLBACK LỖI
  if (!mapData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#F9FAFB" }}>
        <p className="text-red-500 font-bold mb-4">Không thể kết nối đến hệ thống phân tích.</p>
        <button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Quay về Dashboard</button>
      </div>
    );
  }

  // TÍNH TOÁN CÁC CHỈ SỐ TỔNG QUAN
  const totalScore = mapData.radarData.reduce((sum, item) => sum + item.score, 0);
  const avgScore = mapData.radarData.length > 0 ? Math.round(totalScore / mapData.radarData.length) : 0;
  const criticalCount = mapData.weakPoints.length; // Số lượng điểm yếu
  const stableCount = mapData.radarData.filter(r => r.score >= 50 && r.score < 80).length; // Số lượng trung bình khá

  return (
    <div className="min-h-screen py-10 px-8" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div
              className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 cursor-pointer hover:underline"
              onClick={() => navigate("/dashboard")}
            >
              ← Quay lại Tổng quan
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#1E293B" }}>Bản đồ Kiến thức 🗺️</h1>
            <p className="text-sm mt-1" style={{ color: "#64748B" }}>Trực quan hóa điểm mạnh và lỗ hổng kiến thức của bạn</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
            <BarChart2 className="w-4 h-4" style={{ color: "#4F46E5" }} />
            <span className="text-sm font-semibold" style={{ color: "#4F46E5" }}>Cấp độ: {currentLevel}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-5 gap-6">
          {/* Radar chart - TRUYỀN DATA THẬT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="col-span-3 bg-white rounded-3xl p-6"
            style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5" style={{ color: "#4F46E5" }} />
              <h2 className="font-bold" style={{ color: "#1E293B" }}>Biểu đồ lưới năng lực</h2>
              <div className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "#EEF2FF", color: "#4F46E5" }}>
                Cập nhật: Tự động
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              {mapData.radarData.length > 0 ? (
                <RadarChart data={mapData.radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="skillName" tick={{ fill: "#64748B", fontSize: 11, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }} />
                  <Radar name="Điểm" dataKey="score" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.18} strokeWidth={2} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 italic">
                  Chưa có đủ dữ liệu để vẽ biểu đồ
                </div>
              )}
            </ResponsiveContainer>

            {/* Legend - Tự sinh theo Data */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {mapData.radarData.map((item) => {
                const color = item.score >= 80 ? "#10B981" : item.score >= 50 ? "#F59E0B" : "#EF4444";
                return (
                  <div key={item.skillEnum} className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: "#F8FAFC" }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate" style={{ color: "#1E293B" }} title={item.skillName}>{item.skillName}</div>
                      <div className="text-xs font-bold" style={{ color }}>{item.score}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right col */}
          <div className="col-span-2 space-y-6">
            {/* Overall score - TÍNH TOÁN THẬT */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-5"
              style={{ border: "1px solid #F1F5F9", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
            >
              <h3 className="font-bold mb-4 text-sm" style={{ color: "#1E293B" }}>Tổng quan năng lực</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Điểm TB", value: `${avgScore}%`, icon: "📊", color: "#F97316" },
                  { label: "Đã thông thạo", value: `${mapData.masteredItems.length}`, icon: "🏆", color: "#10B981" },
                  { label: "Cần ôn gấp", value: `${criticalCount}`, icon: "🚨", color: "#EF4444" },
                  { label: "Đang ổn", value: `${stableCount}`, icon: "📈", color: "#F59E0B" },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-2xl text-center" style={{ background: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                    <div className="text-xl mb-1">{stat.icon}</div>
                    <div className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs" style={{ color: "#94A3B8" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Suggestion - SINH ĐỘNG */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="rounded-2xl p-4"
              style={{ background: "linear-gradient(135deg, #EEF2FF, #F5F3FF)", border: "1px solid #C7D2FE" }}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: "#4F46E5" }}>Hệ thống AI Phân tích</div>
                  <p className="text-xs leading-relaxed" style={{ color: "#3730A3" }}>
                    {generateAITip(mapData.radarData)}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/practice")}
                className="w-full mt-3 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                style={{ background: "#4F46E5" }}
              >
                Vào phòng ôn tập ngay
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Weak Points - LỖ HỔNG KIẾN THỨC TỪ API */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5" style={{ color: "#EF4444" }} />
            <h2 className="font-bold" style={{ color: "#1E293B" }}>Lỗ hổng kiến thức cần ôn tập</h2>
          </div>

          <div className="space-y-3">
            {mapData.weakPoints.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-dashed text-center">
                <p className="text-sm text-gray-500 font-medium">Tuyệt vời! Bạn hiện không có lỗ hổng kiến thức nào ở mức báo động.</p>
              </div>
            ) : (
              mapData.weakPoints.map((item, i) => {
                // TỰ ĐỘNG ĐỊNH DẠNG MÀU SẮC THEO MỨC ĐỘ NGUY HIỂM (Dưới 40% là Đỏ, 40-59% là Cam)
                const isCritical = item.score < 40;
                const uiColor = isCritical ? "#EF4444" : "#F97316";
                const uiBg = isCritical ? "#FEF2F2" : "#FFF7ED";
                const uiBorder = isCritical ? "#FECACA" : "#FED7AA";
                const uiLabel = isCritical ? "Cần ôn gấp" : "Đang quên dần";

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.1 }}
                    className="bg-white rounded-2xl p-5 flex items-center gap-5"
                    style={{ border: `1.5px solid ${uiBorder}`, boxShadow: `0 2px 12px ${uiColor}10` }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: uiBg }}>
                      <TrendingDown className="w-5 h-5" style={{ color: uiColor }} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-sm" style={{ color: "#1E293B" }}>{item.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: uiBg, color: uiColor }}>
                          {uiLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                            className="h-full rounded-full" style={{ background: uiColor }}
                          />
                        </div>
                        <span className="text-sm font-bold" style={{ color: uiColor }}>{item.score}%</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs flex items-center gap-1" style={{ color: "#94A3B8" }}>
                        <Clock className="w-3 h-3" /> Sai sót: {item.lastMistake}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }} onClick={() => navigate("/practice")}
                        className="mt-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-white" style={{ background: uiColor }}
                      >
                        Vá lỗ hổng →
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Mastered - THÔNG THẠO TỪ API */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981" }} />
            <h2 className="font-bold" style={{ color: "#1E293B" }}>Đã thông thạo 🎉</h2>
          </div>

          {mapData.masteredItems.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-dashed text-center">
              <p className="text-sm text-gray-500 font-medium">Chưa có chủ điểm nào đạt ngưỡng thông thạo. Hãy tiếp tục cố gắng nhé!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {mapData.masteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.1 }}
                  className="bg-white rounded-2xl p-5 flex items-center gap-4" style={{ border: `1.5px solid #BBF7D0` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#F0FDF4" }}>
                    <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981" }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm mb-1" style={{ color: "#1E293B" }}>{item.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                          className="h-full rounded-full" style={{ background: "#10B981" }}
                        />
                      </div>
                      <span className="text-xs font-bold" style={{ color: "#10B981" }}>{item.score}%</span>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 flex flex-col items-end gap-1">
                    <span className="rounded-full text-[10px] font-semibold px-2 py-0.5" style={{ background: "#F0FDF4", color: "#10B981" }}>
                      ✓ Đã nhớ lâu dài
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: "#94A3B8" }}>
                      Lần cuối: {item.lastReview}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}