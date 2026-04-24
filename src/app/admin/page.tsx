"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "motion/react";
import { Plus, Layout, FileText, Loader2, Trash2 } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<"list" | "create">("list");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    systemIntegrity: "---",
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "Tech",
    coverImage: "",
  });

  useEffect(() => {
    if (
      !user &&
      !loadingStats /* using loadingStats as a proxy for initial load */
    ) {
      router.push("/login");
    }
  }, [user, loadingStats, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (res.ok) {
          setStats(data.stats);
          setRecentActivity(data.recentActivity);
        }
      } catch (err) {
        console.error("Failed to fetch stats");
      } finally {
        setLoadingStats(false);
      }
    };

    if (user && user.role === "admin") {
      fetchStats();
    } else {
      setLoadingStats(false);
    }
  }, [user, view]);

  if (!user || user.role !== "admin")
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        Unauthorised access detected. Admin credentials required.
      </div>
    );

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setFormData({
          title: "",
          slug: "",
          content: "",
          excerpt: "",
          category: "Tech",
          coverImage: "",
        });
        setView("list");
      } else {
        setError(data.details || data.error || "Failed to sync transmission");
      }
    } catch (err) {
      setError("Connection failure. Terminal could not reach the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (
      !confirm("Are you sure you want to delete this transmission permanently?")
    )
      return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRecentActivity(
          recentActivity.filter((activity) => activity.id !== id),
        );
        setStats((prev) => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
      } else {
        alert("Failed to delete the transmission.");
      }
    } catch (err) {
      alert("Connection failure. Terminal could not reach the server.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-24">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
            Control Center
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter font-outfit uppercase leading-none">
            Admin <br /> <span className="text-indigo-600">Station</span>
          </h1>
        </div>
        <div className="flex bg-white p-2 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50 gap-2">
          <button
            onClick={() => setView("list")}
            className={`px-8 py-4 rounded-3xl text-xs font-bold uppercase tracking-widest transition-all ${view === "list" ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900"}`}
          >
            All Post
          </button>
          <button
            onClick={() => setView("create")}
            className={`px-8 py-4 rounded-3xl text-xs font-bold uppercase tracking-widest transition-all ${view === "create" ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900"}`}
          >
            Post create
          </button>
        </div>
      </header>

      {view === "list" ? (
        <div className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Total Transmissions
              </span>
              <p className="text-4xl font-black text-slate-900 font-outfit">
                {loadingStats ? "---" : `${stats.totalPosts} Post`}
              </p>
            </div>
            <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Identity Nodes
              </span>
              <p className="text-4xl font-black text-slate-900 font-outfit">
                {loadingStats ? "---" : `${stats.totalUsers} ID`}
              </p>
            </div>
            <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                System Integrity
              </span>
              <p className="text-4xl font-black text-indigo-600 font-outfit">
                {loadingStats ? "---" : stats.systemIntegrity}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-indigo-100/50 overflow-hidden">
            <header className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 font-outfit uppercase tracking-tight">
                Recent Activity Log
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                LIVE // REAL-TIME
              </span>
            </header>
            <div className="divide-y divide-slate-50">
              {!loadingStats && recentActivity.length > 0 ? (
                recentActivity.map((activity, i) => (
                  <div
                    key={activity.id}
                    className="p-10 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-200 group-hover:text-indigo-600 transition-colors shadow-sm">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-black uppercase text-slate-900 font-outfit truncate max-w-md">
                          {activity.title}
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">
                          {activity.type === "TRANS_SYNC"
                            ? "Applied // Sync Complete"
                            : "Manual Intervention"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        {new Date(activity.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" },
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeletePost(activity.id)}
                          disabled={deletingId === activity.id}
                          className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                          title="Delete Transmission"
                        >
                          {deletingId === activity.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                  {loadingStats
                    ? "Scanning Registry..."
                    : "No activity nodes detected in current sequence."}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-indigo-50 rounded-[4rem] p-12 md:p-20 shadow-2xl shadow-indigo-100/50"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-500 text-xs font-bold py-4 px-6 rounded-2xl mb-12 border border-red-100 flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleCreatePost} className="space-y-16">
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-16">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">
                    Entry Label (Title)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="The Future of Architecture"
                    className="w-full text-4xl md:text-6xl font-black placeholder:text-slate-100 outline-none border-b-4 border-slate-50 focus:border-indigo-600 pb-8 transition-all text-slate-900 uppercase tracking-tighter font-outfit"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">
                    Classification
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option>Tech</option>
                    <option>Design</option>
                    <option>Life</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">
                  Visual Core (Image URL)
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 text-sm font-medium focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300"
                  placeholder="https://source.unsplash.com/..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">
                  Fragment Preview (Excerpt)
                </label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-4xl p-8 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-50 transition-all min-h-30 resize-none placeholder:text-slate-300"
                  placeholder="Summary of the thesis..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">
                  Master Manuscript (Content)
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-100 rounded-[3rem] p-12 text-lg font-medium outline-none focus:ring-4 focus:ring-indigo-50 transition-all min-h-125 leading-relaxed placeholder:text-slate-300"
                  placeholder="Record your observations here..."
                />
              </div>
            </div>

            <div className="flex justify-center pt-12">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative bg-slate-900 text-white text-sm font-black uppercase tracking-[0.3em] px-16 py-6 md:px-24 rounded-full overflow-hidden transition-all active:scale-95 shadow-2xl shadow-slate-300 disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Syncing...
                    </>
                  ) : (
                    "Sync Data node"
                  )}
                </span>
                <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
