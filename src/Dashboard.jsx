// import { useEffect, useMemo, useState } from "react";
// import "./Pages.css";
// import { Navigate, useLocation } from "react-router";

// function Dashboard() {
//   const location = useLocation();
//   const user = useMemo(() => {
//     if (location.state) {
//       localStorage.setItem("forward_auth_user", JSON.stringify(location.state));
//       return location.state;
//     }

//     const storedUser = localStorage.getItem("forward_auth_user");
//     if (!storedUser) return null;

//     try {
//       return JSON.parse(storedUser);
//     } catch {
//       localStorage.removeItem("forward_auth_user");
//       return null;
//     }
//   }, [location.state]);

//   let selectedClient;
//   const [leads, setLeads] = useState([]);
//   const [clientName, setClientName] = useState("");
//   const [loadingLeads, setLoadingLeads] = useState(true);
//   const [leadNumber, setLeadNumber] = useState("");
//   const [requirement, setRequirement] = useState("");
//   const [status, setStatus] = useState("");
//   const [leadStatus, setLeadStatus] = useState("NEW");
//   const [enquiryButton, setEnquiryButton] = useState("Add Lead");
//   const [brandnames, setBrandnames] = useState([]);
//   const [loadError, setLoadError] = useState("");
//   const [brandsError, setBrandsError] = useState("");

//   //Loading Datas
//   useEffect(() => {
//     if (!user) {
//       setLeads([]);
//       setLoadingLeads(false);
//       return;
//     }

//     const loadData = async () => {
//       setLoadError("");
//       setLoadingLeads(true);

//       try {
//         const payload = {
//           brandName: user.brandName,
//           secretKey: user.secretKey,
//         };

//         const response = await fetch("https://forwardbackendserver-production.up.railway.app/leads/all", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to load leads (${response.status})`);
//         }

//         const leadsData = await response.json();
//         setLeads(Array.isArray(leadsData) ? leadsData : []);
//       } catch (error) {
//         console.error("Error loading data:", error);
//         setLeads([]);
//         setLoadError("Unable to load lead entries right now.");
//       } finally {
//         setLoadingLeads(false);
//       }
//     };

//     loadData();
//   }, [user]);

// //Update Status
// const UpdateStatus = async (lead) => {

// const updatedData = {
//   id:lead.id,
//       phoneNumber: lead.phoneNumber,
//       requirements: lead.requirements,
//        clientName: lead.clientName,
//       enquiryEntry: lead.enquiryEntry,
//       addedBy:lead.addedBy,
//       status:lead.status
//     };

//       fetch(`https://forwardbackendserver-production.up.railway.app/leads/${lead.id}/status`, {
//   method: "PUT",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     status: lead.status
//   })
// })

//     }
//   // Add Lead
//   const handleAddLead = async (event) => {
//     event.preventDefault();
//     setStatus("");
//     setEnquiryButton("Loading...");

//     if (user.secretKey === "forward@2025") {
//       if (clientName === "") selectedClient = brandnames[0];
//       else selectedClient = clientName;
//     } else {
//       selectedClient = user.brandName;
//     }

//     if (!leadNumber.trim() || !requirement.trim()) {
//       setStatus("Lead number and requirement are required.");
//       setEnquiryButton("Add Lead");
//       return;
//     }

//     if (user.accountType === "Agency Staff" && !selectedClient) {
//       setStatus("Select a client before adding a lead.");
//       setEnquiryButton("Add Lead");
//       return;
//     }

//     const newLead = {
//       phoneNumber: leadNumber,
//       requirements: requirement,
//       clientName: selectedClient,
//       enquiryEntry: new Date().toLocaleString("en-IN", {
//         timeZone: "Asia/Kolkata",
//       }),
//       addedBy:
//         user.secretKey !== "forward@2025"
//           ? user.name
//           : `${user.name} (Agency Member)`,
//           status:"NEW"
//     };

//     //POSTING leads from backend
//     try {
//       const response = await fetch("https://forwardbackendserver-production.up.railway.app/add/leads", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newLead),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to add lead (${response.status})`);
//       }

//       setLeads((currentLeads) => [newLead, ...currentLeads]);

//       setLeadNumber("");
//       setRequirement("");

//       setStatus("Lead entry added successfully.");
//     } catch (error) {
//       console.error("Failed to add lead:", error);
//       setStatus("Unable to add the lead right now. Please try again.");
//     } finally {
//       setEnquiryButton("Add Lead");
//     }
//   };

//   //loading Brands Names data...
//   useEffect(() => {
//     if (!user) {
//       setBrandnames([]);
//       return;
//     }

//     if (user.secretKey === "forward@2025") {
//       async function loadData() {
//         setBrandsError("");

//         try {
//           const response = await fetch("https://forwardbackendserver-production.up.railway.app/all/brands", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ secretKey: user.secretKey }),
//           });

//           if (!response.ok) {
//             throw new Error(`Failed to load brands (${response.status})`);
//           }

//           const brands = await response.json();
//           setBrandnames(Array.isArray(brands) ? brands : []);
//         } catch (error) {
//           console.error("Error loading data:", error);
//           setBrandnames([]);
//           setBrandsError("Unable to load client names right now.");
//         }
//       }

//       loadData();
//     }
//   }, [user]);

//   if (!user) {
//     return <Navigate to="/signin" replace />;
//   }

//   return (
//     <section className="PageShell">
//       <div className="PageHero">
//         <p className="PageTag">Dashboard</p>

//         <h2
//           style={{ fontWeight: "400", marginTop: "10px", marginBottom: "10px" }}
//         >
//           Hii {user.name}
//           <span style={{ fontSize: "15px", opacity: "70%" }}>
//             {` (Team of ${user.brandName})`}
//           </span>
//         </h2>

//         <h1 className="PageTitle">Lead Management Portal</h1>

//         <p className="PageLead">
//           {user.name} you can add lead entries and requirements.
//         </p>
//       </div>

//       <div className="PageSection">
//         <h2 className="PageSectionTitle">Add Lead Requirement</h2>

//         <form
//           className="SignInForm"
//           style={{ maxWidth: "760px" }}
//           onSubmit={handleAddLead}
//         >
//           <div className="Field">
//             <label>Lead Number / Contact</label>

//             <input
//               type="text"
//               placeholder="+91 9XXXXXXXXX"
//               value={leadNumber}
//               onChange={(e) => setLeadNumber(e.target.value)}
//               required
//             />
//           </div>

//           <div className="Field">
//             <label>Lead Requirement</label>

//             <input
//               type="text"
//               placeholder="General Enquiry, Lenovo Loq, etc..."
//               value={requirement}
//               onChange={(e) => setRequirement(e.target.value)}
//               required
//             />
//           </div>

//           {user.accountType === "Agency Staff" && (
//             <div className="Field" style={{ width: "300px" }}>
//               <label>Client Name</label>

//               <select
//                 onChange={(e) => {
//                   setClientName(e.target.value);
//                 }}
//                 value={clientName}
//               >
//                 {brandnames.length == 0 && <option>Loading...</option>}
//                 {user.accountType === "Agency Staff" &&
//                   brandnames.map((brands, index) => (
//                     <option key={index} value={brands}>
//                       {brands}
//                     </option>
//                   ))}
//               </select>
//               {brandsError ? <p className="MutedText">{brandsError}</p> : null}
//             </div>
//           )}

//           <button type="submit" className="PrimaryBtn">
//             {enquiryButton}
//           </button>

//           {clientName && <p className="MutedText">{clientName}</p>}

//           {status && <p className="MutedText">{status}</p>}
//         </form>
//       </div>

//       <div className="PageSection">
//         <h2 className="PageSectionTitle">Lead Entries</h2>

//         {loadingLeads && (
//           <article
//             className="InfoCard"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <h3>Loading...</h3>
//           </article>
//         )}

//         {!loadingLeads && leads.length === 0 && (
//           <article className="InfoCard">
//             <p>{loadError || "No leads added yet."}</p>
//           </article>
//         )}

//         {!loadingLeads && leads.length > 0 && (
//           <div className="LeadTableWrap InfoCard">
//             <table className="LeadTable">
//               <thead>
//                 <tr>
//                   <th>Lead Number</th>
//                   <th>Requirement</th>
//                   {user.accountType === "Agency Staff" && <th>Brand Name</th>}
//                   <th>Added By</th>
//                   <th>Entry Time</th>
//                   <th>Leaad Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {leads.map((lead) => (
//                   <tr key={lead.phoneNumber}>
//                     <td>{lead.phoneNumber}</td>
//                     <td>{lead.requirements}</td>
//                     {user.accountType === "Agency Staff" && (
//                       <td>{lead.clientName}</td>
//                     )}
//                     <td>{lead.addedBy}</td>
//                     <td>{lead.enquiryEntry}</td>
//                     <td>
//                       {
//                   <select
//   value={lead.status}
//   onChange={(e) => {
//     lead.status=e.target.value
//      UpdateStatus(lead);
//   }
//   }
// >
//   <option value="NEW">New</option>
//   <option value="NO_RESPONSE">No Response</option>
//   <option value="CALL_BACK">Call Back</option>
//   <option value="INTERESTED">Interested</option>
//   <option value="NOT_INTERESTED">Not Interested</option>
//   <option value="FOLLOW_UP">Follow Up</option>
//   <option value="WON">Won</option>
//   <option value="LOST">Lost</option>
// </select>

//                       }
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// export default Dashboard;

import { useEffect, useMemo, useState } from "react";
import "./Pages.css";
import { Navigate, useLocation } from "react-router";
import { HiOutlinePhone } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";

function Dashboard() {
  const formatPhoneLink = (phoneNumber) =>
    (phoneNumber || "").replace(/[^\d+]/g, "");

  const formatWhatsAppLink = (phoneNumber) =>
    (phoneNumber || "").replace(/\D/g, "");

  const getStatusMeta = (leadStatus) => {
    switch (leadStatus) {
      case "NEW":
        return { label: "New", color: "#0ea5e9" };
      case "NO_RESPONSE":
        return { label: "No Response", color: "#ef4444" };
      case "CALL_BACK":
        return { label: "Call Back", color: "#eab308" };
      case "INTERESTED":
        return { label: "Interested", color: "#22c55e" };
      case "FOLLOW_UP":
        return { label: "Follow Up", color: "#8b5cf6" };
      case "WON":
        return { label: "Won", color: "#14b8a6" };
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
          backgroundColor: "#ccfbf1",
          color: "#115e59",
          border: "1px solid #5eead4",
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

  const location = useLocation();

  const user = useMemo(() => {
    if (location.state) {
      localStorage.setItem("forward_auth_user", JSON.stringify(location.state));
      return location.state;
    }

    const storedUser = localStorage.getItem("forward_auth_user");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("forward_auth_user");
      return null;
    }
  }, [location.state]);

  const [leads, setLeads] = useState([]);
  const [clientName, setClientName] = useState("");
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [leadNumber, setLeadNumber] = useState("");
  const [link, setLink] = useState("");
  const [requirement, setRequirement] = useState("");
  const [status, setStatus] = useState("");
  const [enquiryButton, setEnquiryButton] = useState("Add Lead");
  const [updatingLeadId, setUpdatingLeadId] = useState(null);
  const [brandnames, setBrandnames] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [brandsError, setBrandsError] = useState("");

  const statusSummary = useMemo(() => {
    const orderedStatuses = [
      "NEW",
      "NO_RESPONSE",
      "CALL_BACK",
      "INTERESTED",
      "FOLLOW_UP",
      "WON",
      "LOST",
    ];

    const counts = orderedStatuses.map((leadStatus) => {
      const count = leads.filter((lead) => lead.status === leadStatus).length;
      return {
        status: leadStatus,
        count,
        ...getStatusMeta(leadStatus),
      };
    });

    const maxCount = Math.max(...counts.map((item) => item.count), 1);

    return {
      total: leads.length,
      maxCount,
      counts,
    };
  }, [leads]);

  useEffect(() => {
    if (!user) {
      setLeads([]);
      setLoadingLeads(false);
      return;
    }

    const fetchLeads = async () => {
      try {
        const payload = {
          brandName: user.brandName,
          secretKey: user.secretKey,
        };

        const res = await fetch("https://forwardbackendserver-production.up.railway.app/get/leads/all", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        setLeads(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLeads(false);
      }
    };

    // first load
    fetchLeads();

  
  }, [user]);

  const updateStatus = async (leadId, newStatus) => {
    try {
      setStatus("");
      setUpdatingLeadId(leadId);

      const response = await fetch(
        `https://forwardbackendserver-production.up.railway.app/leads/${leadId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update status (${response.status})`);
      }

      const updatedLead = await response.json();

      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.id === updatedLead.id ? updatedLead : lead,
        ),
      );
    } catch (error) {
      console.error("Failed to update lead status:", error);
      setStatus("Unable to update lead status right now.");
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleAddLead = async (event) => {
    event.preventDefault();
    setStatus("");
    setEnquiryButton("Loading...");

    let selectedClient = "";

    if (user.secretKey === "forward@2025") {
      selectedClient = clientName || brandnames[0];
    } else {
      selectedClient = user.brandName;
    }

    if (!leadNumber.trim() || !requirement.trim()) {
      setStatus("Lead number and requirement are required.");
      setEnquiryButton("Add Lead");
      return;
    }

    if (user.accountType === "Agency Staff" && !selectedClient) {
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
      addedBy:
        user.secretKey !== "forward@2025"
          ? user.name
          : `${user.name} (Agency Member)`,
      status: "NEW",
      Link:link
    };

    try {
      const response = await fetch("https://forwardbackendserver-production.up.railway.app/add/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLead),
      });

      if (!response.ok) {
        throw new Error(`Failed to add lead (${response.status})`);
      }

      const savedLead = await response.json();

      setLeads((currentLeads) => [savedLead, ...currentLeads]);
      setLeadNumber("");
      setLink("");
      setRequirement("");
      setClientName("");
      setStatus("Lead entry added successfully.");
    } catch (error) {
      console.error("Failed to add lead:", error);
      setStatus("Unable to add the lead right now. Please try again.");
    } finally {
      setEnquiryButton("Add Lead");
    }
  };

  useEffect(() => {
    if (!user) {
      setBrandnames([]);
      return;
    }

    if (user.secretKey === "forward@2025") {
      async function loadData() {
        setBrandsError("");

        try {
          const response = await fetch("https://forwardbackendserver-production.up.railway.app/get/all/brands", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ secretKey: user.secretKey }),
          });

          if (!response.ok) {
            throw new Error(`Failed to load brands (${response.status})`);
          }

          const brands = await response.json();
          setBrandnames(Array.isArray(brands) ? brands : []);
        } catch (error) {
          console.error("Error loading data:", error);
          setBrandnames([]);
          setBrandsError("Unable to load client names right now.");
        }
      }

      loadData();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/signin" replace />;
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
            {` (Team of ${user.brandName})`}
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

            {user.accountType === "Agency Staff" && (
              <div className="Field" style={{ width: "300px" }}>
                <label>Client Name</label>

                <select
                  onChange={(e) => {
                    setClientName(e.target.value);
                  }}
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
                  <p className="MutedText">{brandsError}</p>
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
                <p className="PageTag">Lead Snapshot</p>
                <h3>Status Overview</h3>
              </div>
              <div className="StatusGraphTotal">
                <span>{statusSummary.total}</span>
                <small>Total Leads</small>
              </div>
            </div>

            <div className="StatusGraphList">
              {statusSummary.counts.map((item) => (
                <div className="StatusGraphRow" key={item.status}>
                  <div className="StatusGraphLabelRow">
                    <div className="StatusGraphLabelWrap">
                      <span
                        className="StatusGraphDot"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="StatusGraphLabel">{item.label}</span>
                    </div>
                    <span className="StatusGraphCount">{item.count}</span>
                  </div>
                  <div className="StatusGraphTrack">
                    <div
                      className="StatusGraphFill"
                      style={{
                        width: `${(item.count / statusSummary.maxCount) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>

      <div className="PageSection">
        <h2 className="PageSectionTitle">Lead Entries</h2>

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

        {!loadingLeads && leads.length > 0 && (
          <div className="LeadTableWrap InfoCard">
            <table className="LeadTable">
              <thead>
                <tr>
                  <th>Lead Number</th>
                  <th>Requirement</th>
                  <th>Link</th>
                  {user.accountType === "Agency Staff" && <th>Brand Name</th>}
                  <th>Added By</th>
                  <th>Entry Time</th>
                  <th>Lead Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.phoneNumber}</td>
                    <td>{lead.requirements}</td>
                    <td>
                          {lead.Link ? 
                      <a
                        href={lead.Link}
                        style={{ textDecoration: "none", color: "#055cce" }}
                         target="_blank"
                      >
                     Client Link 
                      </a>: <p>Link not provided.</p>}
                    </td>
                    {user.accountType === "Agency Staff" && (
                      <td>{lead.clientName}</td>
                    )}
                    <td>{lead.addedBy}</td>
                    <td>{lead.enquiryEntry}</td>
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
                                <option value="NO_RESPONSE">No Response</option>
                                <option value="CALL_BACK">Call Back</option>
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
