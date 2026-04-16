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

//         const response = await fetch("http://localhost:8010/get/leads/all", {
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

//       fetch(`http://localhost:8010/leads/${lead.id}/status`, {
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
//       const response = await fetch("http://localhost:8010/add/leads", {
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
//           const response = await fetch("http://localhost:8010/get/all/brands", {
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

function Dashboard() {
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
  const [requirement, setRequirement] = useState("");
  const [status, setStatus] = useState("");
  const [enquiryButton, setEnquiryButton] = useState("Add Lead");
  const [brandnames, setBrandnames] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [brandsError, setBrandsError] = useState("");

  useEffect(() => {
    if (!user) {
      setLeads([]);
      setLoadingLeads(false);
      return;
    }

    const loadData = async () => {
      setLoadError("");
      setLoadingLeads(true);

      try {
        const payload = {
          brandName: user.brandName,
          secretKey: user.secretKey,
        };

        const response = await fetch("http://localhost:8010/get/leads/all", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Failed to load leads (${response.status})`);
        }

        const leadsData = await response.json();
        setLeads(Array.isArray(leadsData) ? leadsData : []);
      } catch (error) {
        console.error("Error loading data:", error);
        setLeads([]);
        setLoadError("Unable to load lead entries right now.");
      } finally {
        setLoadingLeads(false);
      }
    };

    loadData();
  }, [user]);

  const updateStatus = async (leadId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8010/leads/${leadId}/status`,
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
    };

    try {
      const response = await fetch("http://localhost:8010/add/leads", {
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
          const response = await fetch("http://localhost:8010/get/all/brands", {
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

        <form
          className="SignInForm"
          style={{ maxWidth: "760px" }}
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

              {brandsError ? <p className="MutedText">{brandsError}</p> : null}
            </div>
          )}

          <button type="submit" className="PrimaryBtn">
            {enquiryButton}
          </button>

          {clientName && <p className="MutedText">{clientName}</p>}
          {status && <p className="MutedText">{status}</p>}
        </form>
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
                  {user.accountType === "Agency Staff" && <th>Brand Name</th>}
                  <th>Added By</th>
                  <th>Entry Time</th>
                  <th>Lead Status</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.phoneNumber}</td>
                    <td>{lead.requirements}</td>
                    {user.accountType === "Agency Staff" && (
                      <td>{lead.clientName}</td>
                    )}
                    <td>{lead.addedBy}</td>
                    <td>{lead.enquiryEntry}</td>
                    <td>
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "10px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "#ffffff",
                          color: "#111827",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          outline: "none",
                          minWidth: "150px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        }}
                      >
                        <option value="NEW">New</option>
                        <option value="NO_RESPONSE">No Response</option>
                        <option value="CALL_BACK">Call Back</option>
                        <option value="INTERESTED">Interested</option>
                        <option value="NOT_INTERESTED">Not Interested</option>
                        <option value="FOLLOW_UP">Follow Up</option>
                        <option value="WON">Won</option>
                        <option value="LOST">Lost</option>
                      </select>
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
