import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { supabase } from "./supabaseClient";
import { AlertCircle, ExternalLink } from "lucide-react";

export default function Dashboard() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetsUrl, setSheetsUrl] = useState("");

  useEffect(() => {
    loadGoogleSheetsUrl();
  }, []);

  useEffect(() => {
    if (sheetsUrl) {
      fetchTenderData();
    }
  }, [sheetsUrl]);

  async function loadGoogleSheetsUrl() {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "google_sheets_url")
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        setSheetsUrl(data.value);
      } else {
        setError("Google Sheets URL not configured");
        setLoading(false);
      }
    } catch (err: any) {
      // Fallback to hardcoded URL if Supabase fails (e.g., on Netlify without env vars)
      console.warn("Supabase not available, using fallback URL:", err.message);
      setSheetsUrl("https://docs.google.com/spreadsheets/d/e/2PACX-1vSKLmBtPdvgmuTBTkCE8AjE3acbGJJu_gG3tkN3L_SBsYzB6sNAUCcYRdBxaxEAubGX2CnRJnWyK1wJ/pub?gid=835041077&single=true&output=csv");
    }
  }

  async function fetchTenderData() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(sheetsUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const csvText = await response.text();
      const workbook = XLSX.read(csvText, { type: "string" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      setTenders(jsonData);
      setLoading(false);
    } catch (err: any) {
      setError(`Failed to load tender data: ${err.message}`);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading tender data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-400 mb-2 text-center">
            Error Loading Data
          </h2>
          <p className="text-slate-300 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-8 mb-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-2">
            AllState Kerbing — Tender Dashboard
          </h1>
          <p className="text-slate-300">
            Live tender data · {tenders.length} opportunities
          </p>
        </header>

        <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Tender Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Builder
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Closes
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-200">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {tenders.map((tender, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-100">
                      {tender.name || tender.Name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {tender.location || tender.Location || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {tender.builder || tender.Builder || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {tender.budget || tender.Budget || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {tender.closes || tender.Closes || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full">
                        {tender.category || tender.Category || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {tenders.length === 0 && (
          <div className="text-center mt-8 text-slate-400">
            No tender data available
          </div>
        )}
      </div>
    </div>
  );
}
