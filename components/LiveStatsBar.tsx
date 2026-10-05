"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { createClient } from "@/lib/supabase/browser";

export function LiveStatsBar() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    threatsBlocked: 0,
    activeStreams: 0,
  });
  const [loaded, setLoaded] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data, error } = await supabase
        .from("sessions")
        .select("status, risk_summary")
        .gte("started_at", today.toISOString());
      
      if (data) {
        setLoaded(true);
        setStats({
          totalSessions: data.length,
          threatsBlocked: data.filter((s: any) => s.status === "flagged" || s.risk_summary?.decision === "blocked").length,
          activeStreams: data.filter((s: any) => s.status === "active").length,
        });
      }
    };
    
    fetchStats();

    const channel = supabase
      .channel("live-stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sessions",
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4" role="group" aria-label="Today's session statistics">
      <MetricCard label="Total Sessions Today" value={loaded ? stats.totalSessions : null} unavailableText="Unavailable" />
      <MetricCard label="Threats Blocked" value={loaded ? stats.threatsBlocked : null} tone="critical" />
      <MetricCard
        label="Active Streams"
        value={loaded ? stats.activeStreams : null}
        tone="processing"
        note={loaded && stats.activeStreams > 0 ? "Streams currently active" : undefined}
      />
    </div>
  );
}
