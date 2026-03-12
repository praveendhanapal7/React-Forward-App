import { useState, useEffect } from "react";
import "./Pages.css";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const user = location.state;
  let selectedClient;
  const [leads, setLeads] = useState([]);
  const [clientName, setClientName] = useState("");
  const [loadingLeads, setLoadingLeads] = useState(true);

  const [brandName, setBrandName] = useState("");
  const [leadNumber, setLeadNumber] = useState("");
  const [requirement, setRequirement] = useState("");
  const [status, setStatus] = useState("");
  const [enquiryButton, setEnquiryButton] = useState("Add Lead");
  const [brandnames, setBrandnames] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      const payload = {
        secretKey: user.secretKey,
      };

      const leadsURL =
        user.accountType === "Agency Staff"
          ? "http://localhost:8090/get/leads/all"
          : "http://localhost:8090/get/leads/brandname";

      // start

      // setInterval(async () => {
      //       try {
      //         const leadsPromise = fetch(leadsURL, {
      //           method: "POST",
      //           headers: {
      //             "Content-Type": "application/json",
      //           },
      //           body: JSON.stringify(payload),
      //         });

      //         const brandPromise = fetch("http://localhost:8090/get/brandname", {
      //           method: "POST",
      //           headers: {
      //             "Content-Type": "application/json",
      //           },
      //           body: JSON.stringify(payload),
      //         });

      //         const leadsResponse = await leadsPromise;
      //         const brandResponse = await brandPromise;

      //         const leadsData = await leadsResponse.json();
      //         const brandName = await brandResponse.text();

      //         setLeads(leadsData);
      //         setClientName(brandName);
      //       } catch (error) {
      //         console.error("Error loading data:", error);
      //       }

      // },5000)

      try {
        const leadsPromise = fetch(leadsURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const brandPromise = fetch("http://localhost:8090/get/brandname", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const leadsResponse = await leadsPromise;
        const brandResponse = await brandPromise;

        const leadsData = await leadsResponse.json();
      setBrandName(await brandResponse.text());

        setLeads(leadsData);
        // setClientName(brandName);
      } catch (error) {
        console.error("Error loading data:", error);
      }

      //end

      setLoadingLeads(false);
    };

    loadData();
  }, [user]);

  // Add Lead
  const handleAddLead = async (event) => {
    event.preventDefault();
    setEnquiryButton("Loading...");

    console.log("brans name ", brandnames[0])

    if (clientName === "") 
  selectedClient = brandnames[0];
    else
      selectedClient = clientName;
    if (!leadNumber.trim() || !requirement.trim()) return;


    console.log("Hello yaar",selectedClient);

    const newLead = {
      phoneNumber: leadNumber,
      requirements: requirement,
      clientName: selectedClient,
      enquiryEntry: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      addedBy: user.secretKey!=="forward@2025" ? user.name : `${user.name} (Agency Member)`
    };

console.log("this is client : "+clientName);

    //POSTING leads from backend
    try {
      await fetch("http://localhost:8090/add/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLead),
      });

      setLeads([newLead, ...leads]);

      setLeadNumber("");
      setRequirement("");

      setStatus("Lead entry added successfully.");
    } catch (error) {
      console.error("Failed to add lead");
    }

    setEnquiryButton("Add Lead");
  };



  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("http://localhost:8090/get/all/brands", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ secretKey: user.secretKey }),
        });

        const brands = await response.json();
        setBrandnames(brands);

        // console.log("Brand names:", brands);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    loadData();
  }, [user.secretKey]);

  return (
    <section className="PageShell">
      <div className="PageHero">
        <p className="PageTag">Dashboard</p>

        <h2
          style={{ fontWeight: "400", marginTop: "10px", marginBottom: "10px" }}
        >
          Hii {user.name}
          <span style={{ fontSize: "15px", opacity: "70%" }}>
            {brandName.length > 1 ? ` (Team of ${brandName})` : "Loading..."}
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
                setClientName(e.target.value)
                }}
                value={clientName}
              >

                {user.accountType === "Agency Staff" &&
                  brandnames.map((brands, index) => (
                    <option key={index} value={brands}>
                      {brands}
                    </option>
                  ))}
              </select>
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
            <p>No leads added yet.</p>
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
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.phoneNumber}>
                    <td>{lead.phoneNumber}</td>
                    <td>{lead.requirements}</td>
                    {user.accountType === "Agency Staff" && (
                      <td>{lead.clientName}</td>
                    )}
                    <td>{lead.addedBy}</td>
                    <td>{lead.enquiryEntry}</td>
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
