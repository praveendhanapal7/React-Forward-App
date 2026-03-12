import "./ClientsSection.css";
import bestBuyITWorld from "./assets/BestBuy IT World.jpg";
import bestBuyRefurb from "./assets/BestBuy Refurb.jpg";
import binaryRefurb from "./assets/Binary Refurb.jpg";
import dksSystem from "./assets/DKS System.jpg";
import jpComputers from "./assets/JP Computers.jpg";
import laptopStore from "./assets/LaptopStore.jpg";
import masterComputer from "./assets/Master Computer.jpg";
import need4It from "./assets/Need 4 It.jpg";
import s2s from "./assets/S2s.jpg";
import BinaryComputer from "./assets/Binary Computer.jpg";
import InfocomSystem from "./assets/Infocom System.png";
import ammachisMasala from "./assets/Ammachis Masala.avif";
import cloud9 from "./assets/Cloud 9.jpg";
import kiddingMart from "./assets/Kidding Mart.jpg";
import sjChicken from "./assets/SJ Chicken.jpg";

const clientSlots = [
  { id: 4, name: "Binary Computer", logo: BinaryComputer },
  { id: 2, name: "BestBuy IT World", logo: bestBuyITWorld },
  { id: 1, name: "Laptop Store", logo: laptopStore },
  { id: 3, name: "BestBuy Refurb", logo: bestBuyRefurb },
  { id: 5, name: "DKS System", logo: dksSystem },
  { id: 6, name: "JP Computers", logo: jpComputers },
  { id: 7, name: "Master Computer", logo: masterComputer },
  { id: 8, name: "Need 4 It", logo: need4It },
  { id: 9, name: "System to System", logo: s2s },
  { id: 10, name: "Infocom System", logo: InfocomSystem },
  { id: 11, name: "Binary Refurb", logo: binaryRefurb },
  { id: 12, name: "Ammachis Masala", logo: ammachisMasala },
  { id: 13, name: "Cloud 9", logo: cloud9 },
  { id: 14, name: "Kidding Mart", logo: kiddingMart },
  { id: 15, name: "SJ Chicken", logo: sjChicken },
];

function ClientsSection() {
  return (
    <section className="ClientsSection">
      <div className="ClientsTop">
        <p className="ClientsTag">Our Clients</p>
        <h2 className="ClientsTitle">Trusted by Growing Brands</h2>
        <p className="ClientsSubtitle">
          Our current clients are highly satisfied with our service quality and
          response speed. Add your logos below as they are finalized.
        </p>
      </div>

      <div className="ClientLogoGrid">
        {clientSlots.map((client, index) => (
          <article
            key={client.id}
            className="ClientLogoCard"
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            {client.logo ? (
              <img
                src={client.logo}
                alt={client.name}
                className="ClientLogoImage"
                style={{ borderRadius: "20px" }}
              />
            ) : (
              <div className="ClientLogoPlaceholder" aria-hidden="true">
                <span>Logo</span>
              </div>
            )}
            <p>{client.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ClientsSection;
