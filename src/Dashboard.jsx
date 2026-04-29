import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Pages.css";
import { HiAdjustments, HiCalendar, HiOutlinePhone } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "./auth/useAuth";
import { apiFetch, ApiError } from "./lib/api";

const LEAD_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const STATUS_ORDER = [
  "NEW",
  "ATTENDED",
  "NO_RESPONSE",
  "CALL_BACK",
  "INTERESTED",
  "FOLLOW_UP",
  "WON",
  "LOST",
];

const DATE_FILTER_OPTIONS = [
  { value: "DEFAULT", label: "Recent First" },
  { value: "TODAY", label: "Today" },
  { value: "YESTERDAY", label: "Yesterday" },
  { value: "LAST_7_DAYS", label: "Last 7 days" },
  { value: "CUSTOM", label: "Custom date range" },
];

const DONUT_CHART_CONFIG = {
  width: 680,
  height: 420,
  centerX: 350,
  centerY: 230,
  outerRadius: 124,
  innerRadius: 72,
  labelOffset: 56,
  labelReach: 84,
  labelTail: 72,
  labelTop: 46,
  labelBottom: 360,
  labelGap: 30,
};

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeDonutSegment = (
  centerX,
  centerY,
  outerRadius,
  innerRadius,
  startAngle,
  endAngle,
) => {
  const safeEndAngle =
    endAngle - startAngle >= 360 ? startAngle + 359.999 : endAngle;
  const largeArcFlag = safeEndAngle - startAngle > 180 ? 1 : 0;

  const outerStart = polarToCartesian(centerX, centerY, outerRadius, startAngle);
  const outerEnd = polarToCartesian(centerX, centerY, outerRadius, safeEndAngle);
  const innerEnd = polarToCartesian(centerX, centerY, innerRadius, safeEndAngle);
  const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
};

function Dashboard() {
  const { user, isAgency } = useAuth();

  const formatPhoneLink = (phoneNumber) =>
    (phoneNumber || "").replace(/[^\d+]/g, "");

  const formatWhatsAppLink = (phoneNumber) =>
    (phoneNumber || "").replace(/\D/g, "");

  const parseLeadDate = (lead) => {
    const rawValue = lead?.createdAt || lead?.enquiryEntry;
    if (!rawValue) return null;

    if (typeof rawValue === "string") {
      const isoCandidate = new Date(rawValue);
      if (!Number.isNaN(isoCandidate.getTime())) {
        return isoCandidate;
      }

      const match = rawValue.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)$/i,
      );

      if (match) {
        const [, day, month, year, hourValue, minute, second = "0", meridiem] =
          match;
        let hour = Number(hourValue);

        if (meridiem.toLowerCase() === "pm" && hour !== 12) {
          hour += 12;
        }

        if (meridiem.toLowerCase() === "am" && hour === 12) {
          hour = 0;
        }

        return new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
          hour,
          Number(minute),
          Number(second),
        );
      }
    }

    return null;
  };

  const getStatusMeta = (leadStatus) => {
    switch (leadStatus) {
      case "NEW":
        return { label: "New", color: "#0ea5e9" };
      case "ATTENDED":
        return { label: "Attended", color: "#14b8a6" };
      case "NO_RESPONSE":
        return { label: "No Response", color: "#ef4444" };
      case "CALL_BACK":
        return { label: "Call Back", color: "#eab308" };
      case "INTERESTED":
        return { label: "Interested", color: "#22c55e" };
      case "FOLLOW_UP":
        return { label: "Follow Up", color: "#8b5cf6" };
      case "WON":
        return { label: "Won", color: "#06b6d4" };
      case "LOST":
        return { label: "Lost", color: "#64748b" };
      default:
        return { label: "New", color: "#0ea5e9" };
    }
  };

  const getStatusStyle = (leadStatus, isUpdating) => {
    if (isUpdating) {
      return {
        backgroundColor: "#f3f4f6",
        color: "#111827",
        border: "1px solid #d1d5db",
      };
    }

    switch (leadStatus) {
      case "NEW":
        return {
          backgroundColor: "#e0f2fe",
          color: "#075985",
          border: "1px solid #7dd3fc",
        };
      case "NO_RESPONSE":
        return {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fca5a5",
        };
      case "ATTENDED":
        return {
          backgroundColor: "#ccfbf1",
          color: "#0f766e",
          border: "1px solid #5eead4",
        };
      case "CALL_BACK":
        return {
          backgroundColor: "#fef9c3",
          color: "#854d0e",
          border: "1px solid #fde047",
        };
      case "INTERESTED":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534",
          border: "1px solid #86efac",
        };
      case "FOLLOW_UP":
        return {
          backgroundColor: "#ede9fe",
          color: "#6d28d9",
          border: "1px solid #c4b5fd",
        };
      case "WON":
        return {
          backgroundColor: "#cffafe",
          color: "#155e75",
          border: "1px solid #67e8f9",
        };
      case "LOST":
        return {
          backgroundColor: "#e2e8f0",
          color: "#334155",
          border: "1px solid #94a3b8",
        };
      default:
        return {
          backgroundColor: "#ffffff",
          color: "#111827",
          border: "1px solid #d1d5db",
        };
    }
  };

  const [leads, setLeads] = useState([]);
  const [clientName, setClientName] = useState("");
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [leadNumber, setLeadNumber] = useState("");
  const [link, setLink] = useState("");
  const [requirement, setRequirement] = useState("");
  const [status, setStatus] = useState("");
  const [enquiryButton, setEnquiryButton] = useState("Add Lead");
  const [updatingLeadId, setUpdatingLeadId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("DEFAULT");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [brandnames, setBrandnames] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [brandsError, setBrandsError] = useState("");

  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => {
      const firstDate = parseLeadDate(a);
      const secondDate = parseLeadDate(b);

      if (!firstDate && !secondDate) return 0;
      if (!firstDate) return 1;
      if (!secondDate) return -1;
      return secondDate.getTime() - firstDate.getTime();
    });
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const now = new Date();
    const daysAgo = (days) =>
      new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0,
    );
    const startOfYesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
      0,
      0,
      0,
      0,
    );

    let dateScopedLeads = sortedLeads;

    switch (dateFilter) {
      case "TODAY":
        dateScopedLeads = sortedLeads.filter((lead) => {
          const leadDate = parseLeadDate(lead);
          return (
            leadDate &&
            leadDate >= startOfToday &&
            leadDate < startOfTomorrow
          );
        });
        break;

      case "YESTERDAY":
        dateScopedLeads = sortedLeads.filter((lead) => {
          const leadDate = parseLeadDate(lead);
          return (
            leadDate &&
            leadDate >= startOfYesterday &&
            leadDate < startOfToday
          );
        });
        break;

      case "LAST_7_DAYS":
        dateScopedLeads = sortedLeads.filter((lead) => {
          const leadDate = parseLeadDate(lead);
          return leadDate && leadDate >= daysAgo(7);
        });
        break;

      case "CUSTOM": {
        const startDate = customStartDate
          ? new Date(`${customStartDate}T00:00:00`)
          : null;
        const endDate = customEndDate
          ? new Date(`${customEndDate}T23:59:59`)
          : null;

        dateScopedLeads = sortedLeads.filter((lead) => {
          const leadDate = parseLeadDate(lead);
          if (!leadDate) return false;
          if (startDate && leadDate < startDate) return false;
          if (endDate && leadDate > endDate) return false;
          return true;
        });
        break;
      }

      case "DEFAULT":
      default: {
        const todaysLeads = sortedLeads.filter((lead) => {
          const leadDate = parseLeadDate(lead);
          return (
            leadDate &&
            leadDate >= startOfToday &&
            leadDate < startOfTomorrow
          );
        });

        if (todaysLeads.length > 0) {
          dateScopedLeads = todaysLeads;
          break;
        }

        const recentLeads = sortedLeads.filter((lead) => {
          const leadDate = parseLeadDate(lead);
          return leadDate && leadDate >= daysAgo(2);
        });

        if (recentLeads.length > 0) {
          dateScopedLeads = recentLeads;
          break;
        }

        const fallbackLeads = sortedLeads.filter((lead) => {
          const leadDate = parseLeadDate(lead);
          return leadDate && leadDate >= daysAgo(15);
        });

        dateScopedLeads =
          fallbackLeads.length > 0 ? fallbackLeads : sortedLeads;
        break;
      }
    }

    if (statusFilter === "ALL") {
      return dateScopedLeads;
    }

    return dateScopedLeads.filter((lead) => lead.status === statusFilter);
  }, [sortedLeads, statusFilter, dateFilter, customStartDate, customEndDate]);

  const statusSummary = useMemo(() => {
    const counts = STATUS_ORDER.map((leadStatus) => {
      const count = filteredLeads.filter(
        (lead) => lead.status === leadStatus,
      ).length;

      return {
        status: leadStatus,
        count,
        ...getStatusMeta(leadStatus),
      };
    }).filter((item) => item.count > 0);

    return {
      total: filteredLeads.length,
      counts,
    };
  }, [filteredLeads]);

  const donutChartSegments = useMemo(() => {
    if (statusSummary.total === 0) {
      return [];
    }

    let runningTotal = 0;

    const baseSegments = statusSummary.counts.map((item) => {
      const startAngle = (runningTotal / statusSummary.total) * 360;
      runningTotal += item.count;
      const endAngle = (runningTotal / statusSummary.total) * 360;
      const midAngle = startAngle + (endAngle - startAngle) / 2;

      const connectorStart = polarToCartesian(
        DONUT_CHART_CONFIG.centerX,
        DONUT_CHART_CONFIG.centerY,
        DONUT_CHART_CONFIG.outerRadius + 10,
        midAngle,
      );

      const connectorBend = polarToCartesian(
        DONUT_CHART_CONFIG.centerX,
        DONUT_CHART_CONFIG.centerY,
        DONUT_CHART_CONFIG.outerRadius + DONUT_CHART_CONFIG.labelOffset,
        midAngle,
      );

      const isRightSide = connectorBend.x >= DONUT_CHART_CONFIG.centerX;

      return {
        ...item,
        countLabel: `${item.count} ${item.count === 1 ? "lead" : "leads"}`,
        path: describeDonutSegment(
          DONUT_CHART_CONFIG.centerX,
          DONUT_CHART_CONFIG.centerY,
          DONUT_CHART_CONFIG.outerRadius,
          DONUT_CHART_CONFIG.innerRadius,
          startAngle,
          endAngle,
        ),
        connectorStart,
        connectorBend,
        isRightSide,
      };
    });

    const distributeLabels = (segments) => {
      if (segments.length === 0) {
        return [];
      }

      const sorted = [...segments].sort((first, second) => first.connectorBend.y - second.connectorBend.y);
      let previousY = DONUT_CHART_CONFIG.labelTop - DONUT_CHART_CONFIG.labelGap;

      const adjusted = sorted.map((segment) => {
        const minY = previousY + DONUT_CHART_CONFIG.labelGap;
        const nextY = Math.max(segment.connectorBend.y, minY);
        previousY = nextY;
        return { ...segment, adjustedY: nextY };
      });

      let overflow = adjusted[adjusted.length - 1].adjustedY - DONUT_CHART_CONFIG.labelBottom;
      if (overflow > 0) {
        for (let index = adjusted.length - 1; index >= 0; index -= 1) {
          adjusted[index].adjustedY -= overflow;
          const previousAllowedY = index === 0
            ? DONUT_CHART_CONFIG.labelTop
            : adjusted[index - 1].adjustedY + DONUT_CHART_CONFIG.labelGap;

          if (adjusted[index].adjustedY < previousAllowedY) {
            overflow = previousAllowedY - adjusted[index].adjustedY;
            adjusted[index].adjustedY = previousAllowedY;
          } else {
            overflow = 0;
          }
        }
      }

      return adjusted.map((segment) => {
        const connectorEndX = segment.connectorBend.x + (
          segment.isRightSide ? DONUT_CHART_CONFIG.labelTail : -DONUT_CHART_CONFIG.labelTail
        );

        return {
          ...segment,
          connectorEnd: {
            x: connectorEndX,
            y: segment.adjustedY,
          },
          textAnchor: segment.isRightSide ? "start" : "end",
          labelX: connectorEndX + (segment.isRightSide ? 12 : -12),
          labelY: segment.adjustedY,
        };
      });
    };

    const leftSegments = distributeLabels(baseSegments.filter((segment) => !segment.isRightSide));
    const rightSegments = distributeLabels(baseSegments.filter((segment) => segment.isRightSide));

    const mergedSegments = [...leftSegments, ...rightSegments];

    return baseSegments.map((segment) => {
      const matchedSegment = mergedSegments.find((candidate) => candidate.status === segment.status);
      return matchedSegment || segment;
    });
  }, [statusSummary]);

  const hasInitializedDateFilter = useRef(false);

  const persistLeadNotes = useCallback(async (leadId, notes) => {
    try {
      const updatedLead = await apiFetch("/add/notes", {
        method: "POST",
        body: { id: leadId, notes },
      });

      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.id === updatedLead.id ? updatedLead : lead,
        ),
      );
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
  }, []);

  const saveNotesOnBlur = useCallback(
    (leadId, notes) => {
      persistLeadNotes(leadId, notes);
    },
    [persistLeadNotes],
  );

  useEffect(() => {
    if (!user) {
      setLeads([]);
      setLoadingLeads(false);
      return undefined;
    }

    let cancelled = false;

    const fetchLeads = async () => {
      try {
        const data = await apiFetch("/get/leads/all", { method: "GET" });
        if (cancelled) return;
        setLeads(Array.isArray(data) ? data : []);
        setLoadError("");
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load leads:", err);
        setLoadError(
          err instanceof ApiError
            ? err.message
            : "Unable to load leads right now.",
        );
      } finally {
        if (!cancelled) setLoadingLeads(false);
      }
    };

    fetchLeads();
    const timer = setInterval(fetchLeads, LEAD_REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [user]);

  useEffect(() => {
    if (hasInitializedDateFilter.current || leads.length === 0) {
      return;
    }

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0,
    );

    const hasTodayLeads = leads.some((lead) => {
      const leadDate = parseLeadDate(lead);
      return (
        leadDate &&
        leadDate >= startOfToday &&
        leadDate < startOfTomorrow
      );
    });

    if (hasTodayLeads) {
      setDateFilter("TODAY");
    } else {
      setDateFilter("DEFAULT");
    }

    hasInitializedDateFilter.current = true;
  }, [leads]);

  const updateStatus = async (leadId, newStatus) => {
    try {
      setStatus("");
      setUpdatingLeadId(leadId);

      const updatedLead = await apiFetch(`/leads/${leadId}/status`, {
        method: "PUT",
        body: { status: newStatus },
      });

      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.id === updatedLead.id ? updatedLead : lead,
        ),
      );
    } catch (error) {
      console.error("Failed to update lead status:", error);
      setStatus(
        error instanceof ApiError
          ? error.message
          : "Unable to update lead status right now.",
      );
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleAddLead = async (event) => {
    event.preventDefault();
    setStatus("");
    setEnquiryButton("Loading...");

    const selectedClient = isAgency
      ? clientName || brandnames[0]
      : user.brandName;

    if (!leadNumber.trim() || !requirement.trim()) {
      setStatus("Lead number and requirement are required.");
      setEnquiryButton("Add Lead");
      return;
    }

    if (isAgency && !selectedClient) {
      setStatus("Select a client before adding a lead.");
      setEnquiryButton("Add Lead");
      return;
    }

    const newLead = {
      phoneNumber: leadNumber,
      requirements: requirement,
      clientName: selectedClient,
      enquiryEntry: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      status: "NEW",
      Link: link,
    };

    try {
      const savedLead = await apiFetch("/add/leads", {
        method: "POST",
        body: newLead,
      });

      setLeads((currentLeads) => [savedLead, ...currentLeads]);
      setLeadNumber("");
      setLink("");
      setRequirement("");
      setClientName("");
      setStatus("Lead entry added successfully.");
    } catch (error) {
      console.error("Failed to add lead:", error);
      setStatus(
        error instanceof ApiError
          ? error.message
          : "Unable to add the lead right now. Please try again.",
      );
    } finally {
      setEnquiryButton("Add Lead");
    }
  };

  useEffect(() => {
    if (!user) {
      setBrandnames([]);
      return;
    }

    if (!isAgency) return;

    let cancelled = false;

    async function loadData() {
      setBrandsError("");
      try {
        const brands = await apiFetch("/get/all/brands", { method: "GET" });
        if (cancelled) return;
        setBrandnames(Array.isArray(brands) ? brands : []);
      } catch (error) {
        if (cancelled) return;
        console.error("Error loading brand list:", error);
        setBrandnames([]);
        setBrandsError(
          error instanceof ApiError
            ? error.message
            : "Unable to load client names right now.",
        );
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [user, isAgency]);

  if (!user) {
    return null;
  }

  return (
    <section className="PageShell">
      <div className="PageHero">
        <p className="PageTag">Dashboard</p>

        <h2
          style={{ fontWeight: "400", marginTop: "10px", marginBottom: "10px" }}
        >
          Hii {user.name}
          <span style={{ fontSize: "15px", opacity: "70%" }}>
            {user.brandName ? ` (Team of ${user.brandName})` : ""}
          </span>
        </h2>

        <h1 className="PageTitle">Lead Management Portal</h1>

        <p className="PageLead">
          {user.name} you can add lead entries and requirements.
        </p>
      </div>

      <div className="PageSection">
        <h2 className="PageSectionTitle">Add Lead Requirement</h2>

        <div className="DashboardTopGrid">
          <form
            className="SignInForm DashboardFormCard"
            onSubmit={handleAddLead}
          >
            <div className="Field">
              <label>Lead Number / Contact</label>
              <input
                type="text"
                placeholder="+91 9XXXXXXXXX"
                value={leadNumber}
                onChange={(e) => setLeadNumber(e.target.value)}
                required
              />
            </div>

            <div className="Field">
              <label>Lead Requirement</label>
              <input
                type="text"
                placeholder="General Enquiry, Lenovo Loq, etc..."
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                required
              />
            </div>

            <div className="Field">
              <label>Link</label>
              <input
                type="text"
                value={link}
                placeholder="http://hello.com"
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            {isAgency && (
              <div className="Field" style={{ width: "300px" }}>
                <label>Client Name</label>

                <select
                  onChange={(e) => setClientName(e.target.value)}
                  value={clientName}
                >
                  {brandnames.length === 0 && <option>Loading...</option>}
                  {brandnames.map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>

                {brandsError ? (
                  <p className="FieldError">{brandsError}</p>
                ) : null}
              </div>
            )}

            <button type="submit" className="PrimaryBtn">
              {enquiryButton}
            </button>

            {clientName && <p className="MutedText">{clientName}</p>}
            {status && <p className="MutedText">{status}</p>}
          </form>

          <article className="InfoCard StatusGraphCard">
            <div className="StatusGraphHead">
              <div>
                <p className="PageTag">Filtered Snapshot</p>
                <h3>Status Overview</h3>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    color: "#6b7280",
                  }}
                >
                  Built only from the currently displayed leads.
                </p>
              </div>

              <div className="StatusGraphTotal">
                <span>{statusSummary.total}</span>
                <small>Filtered Leads</small>
              </div>
            </div>

            <div className="StatusDonutWrap">
              {statusSummary.total > 0 ? (
                <svg
                  className="StatusDonutSvg"
                  viewBox={`0 0 ${DONUT_CHART_CONFIG.width} ${DONUT_CHART_CONFIG.height}`}
                  role="img"
                  aria-label="Lead status donut chart"
                >
                  {donutChartSegments.map((segment) => (
                    <g key={segment.status}>
                      <path
                        d={segment.path}
                        fill={segment.color}
                        stroke="#ffffff"
                        strokeWidth="3"
                      />
                      <polyline
                        className="StatusDonutConnector"
                        points={`${segment.connectorStart.x},${segment.connectorStart.y} ${segment.connectorBend.x},${segment.connectorBend.y} ${segment.connectorEnd.x},${segment.connectorEnd.y}`}
                        stroke={segment.color}
                      />
                      <circle
                        cx={segment.connectorEnd.x}
                        cy={segment.connectorEnd.y}
                        r="3"
                        fill={segment.color}
                      />
                      <text
                        x={segment.labelX}
                        y={segment.labelY - 3}
                        textAnchor={segment.textAnchor}
                        className="StatusDonutLabel"
                      >
                        {segment.label}
                      </text>
                      <text
                        x={segment.labelX}
                        y={segment.labelY + 14}
                        textAnchor={segment.textAnchor}
                        className="StatusDonutMeta"
                      >
                        {segment.countLabel}
                      </text>
                    </g>
                  ))}

                  <circle
                    cx={DONUT_CHART_CONFIG.centerX}
                    cy={DONUT_CHART_CONFIG.centerY}
                    r={DONUT_CHART_CONFIG.innerRadius - 2}
                    fill="#ffffff"
                  />
                  <text
                    x={DONUT_CHART_CONFIG.centerX}
                    y={DONUT_CHART_CONFIG.centerY - 6}
                    textAnchor="middle"
                    className="StatusDonutCenterValue"
                  >
                    {statusSummary.total}
                  </text>
                  <text
                    x={DONUT_CHART_CONFIG.centerX}
                    y={DONUT_CHART_CONFIG.centerY + 12}
                    textAnchor="middle"
                    className="StatusDonutCenterLabel"
                  >
                    FILTERED LEADS
                  </text>
                </svg>
              ) : (
                <div className="StatusGraphEmpty">
                  No leads match the current filter selection.
                </div>
              )}
            </div>
          </article>
        </div>
      </div>

      <div className="PageSection">
        <div className="LeadEntriesHeader">
          <h2 className="PageSectionTitle">Lead Entries</h2>

          <div className="LeadFiltersRow" style={{ marginBottom: "10px" }}>
            <div className="LeadFilterWrap">
              <label htmlFor="status-filter">
                <span className="LeadFilterLabel">
                  <HiAdjustments />
                  Filter by Status
                </span>
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="ATTENDED">Attended</option>
                <option value="CALL_BACK">Call Back</option>
                <option value="NO_RESPONSE">No Response</option>
                <option value="INTERESTED">Interested</option>
                <option value="FOLLOW_UP">Follow Up</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            <div className="LeadFilterWrap">
              <label htmlFor="date-filter">
                <span className="LeadFilterLabel">
                  <HiCalendar />
                  Filter by Date
                </span>
              </label>
              <select
                id="date-filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                {DATE_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {dateFilter === "CUSTOM" ? (
              <div className="LeadFilterWrap LeadDateRangeWrap">
                <label>
                  <span className="LeadFilterLabel">Custom Range</span>
                </label>
                <div className="LeadDateRangeInputs">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {loadingLeads && (
          <article
            className="InfoCard"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3>Loading...</h3>
          </article>
        )}

        {!loadingLeads && leads.length === 0 && (
          <article className="InfoCard">
            <p>{loadError || "No leads added yet."}</p>
          </article>
        )}

        {!loadingLeads && leads.length > 0 && filteredLeads.length === 0 && (
          <article className="InfoCard">
            <p>No leads found for the selected status.</p>
          </article>
        )}

        {!loadingLeads && filteredLeads.length > 0 && (
          <div className="LeadTableWrap InfoCard">
            <table className="LeadTable">
              <thead>
                <tr>
                  <th>Lead Number</th>
                  <th>Requirement</th>
                  <th>Link</th>
                  {isAgency && <th>Brand Name</th>}
                  <th>Added By</th>
                  <th>Entry Time</th>
                  <th>Notes</th>
                   <th>Actions</th>
                  <th>Lead Status</th>
                  <th>Log</th>
                 
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.phoneNumber}</td>
                    <td>{lead.requirements}</td>
                    <td>
                      {lead.Link ? (
                        <a
                          href={lead.Link}
                          style={{ textDecoration: "none", color: "#055cce" }}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Client Link
                        </a>
                      ) : (
                        <p>Link not provided.</p>
                      )}
                    </td>
                    {isAgency && <td>{lead.clientName}</td>}
                    <td>{lead.addedBy}</td>
                    <td>{lead.enquiryEntry}</td>
                    <td>
                      <div className="Field">
                        <textarea
                          placeholder="eg : call on Monday...."
                          value={lead.notes || ""}
                          onChange={(e) => {
                            const newValue = e.target.value;

                            setLeads((prev) =>
                              prev.map((l) =>
                                l.id === lead.id
                                  ? { ...l, notes: newValue }
                                  : l,
                              ),
                            );
                          }}
                          onBlur={(e) =>
                            saveNotesOnBlur(lead.id, e.target.value)
                          }
                          style={{
                            width: "200px",
                            minHeight: "60px",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            resize: "vertical",
                          }}
                        />
                      </div>
                    </td>

 <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <a
                          href={`tel:${formatPhoneLink(lead.phoneNumber)}`}
                          aria-label={`Call ${lead.phoneNumber}`}
                          title="Call"
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "12px",
                            background: "#111827",
                            color: "#ffffff",
                            textDecoration: "none",
                            fontSize: "18px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <HiOutlinePhone />
                        </a>
                        <a
                          href={`http://wa.me/${formatWhatsAppLink(lead.phoneNumber)}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`WhatsApp ${lead.phoneNumber}`}
                          title="WhatsApp"
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "12px",
                            background: "#25D366",
                            color: "#ffffff",
                            textDecoration: "none",
                            fontSize: "18px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaWhatsapp />
                        </a>
                      </div>
                    </td>

                    <td>
                      {(() => {
                        const statusStyle = getStatusStyle(
                          lead.status,
                          updatingLeadId === lead.id,
                        );

                        return (
                          <select
                            value={
                              updatingLeadId === lead.id ? "" : lead.status
                            }
                            disabled={updatingLeadId === lead.id}
                            onChange={(e) =>
                              updateStatus(lead.id, e.target.value)
                            }
                            style={{
                              padding: "8px 12px",
                              borderRadius: "10px",
                              border: statusStyle.border,
                              backgroundColor: statusStyle.backgroundColor,
                              color: statusStyle.color,
                              fontSize: "14px",
                              fontWeight: "600",
                              cursor:
                                updatingLeadId === lead.id
                                  ? "not-allowed"
                                  : "pointer",
                              outline: "none",
                              minWidth: "150px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                              opacity: updatingLeadId === lead.id ? 0.8 : 1,
                            }}
                          >
                            {updatingLeadId === lead.id ? (
                              <option value="">Updating...</option>
                            ) : (
                              <>
                                <option value="NEW">New</option>
                                <option value="ATTENDED">Attended</option>
                                <option value="CALL_BACK">Call Back</option>
                                <option value="NO_RESPONSE">No Response</option>
                                <option value="INTERESTED">Interested</option>
                                <option value="FOLLOW_UP">Follow Up</option>
                                <option value="WON">Won</option>
                                <option value="LOST">Lost</option>
                              </>
                            )}
                          </select>
                        );
                      })()}
                    </td>
                    <td>
                      <div
                        style={{
                          minWidth: "220px",
                          maxWidth: "260px",
                          whiteSpace: "pre-wrap",
                          lineHeight: "1.45",
                          fontSize: "13px",
                          color: "#4b5563",
                        }}
                      >
                        {lead.log || "No status updates yet."}
                      </div>
                    </td>
                   
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
