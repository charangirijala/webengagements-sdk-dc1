const schemaContainer = document.getElementById("schema-container");
const schemaUrl = "./assets/web-connector-schema.json";

let schemaData = null;

async function loadSchema() {
  schemaContainer.textContent = "Loading schema...";

  try {
    const response = await fetch(schemaUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to load schema: ${response.status} ${response.statusText}`,
      );
    }

    schemaData = await response.json();
    schemaContainer.textContent = JSON.stringify(schemaData, null, 2);
  } catch (error) {
    schemaContainer.textContent = `Unable to load schema: ${error.message}`;
  }
}

loadSchema();

// Function to send catalog event with different sourceChannel values
function sendCatalogEvent(sourceChannel) {
  const statusDiv = document.getElementById("catalog-status");
  statusDiv.textContent = `Sending Catalog event with sourceChannel: ${sourceChannel}...`;

  try {
    if (typeof SalesforceInteractions === "undefined") {
      throw new Error("SalesforceInteractions SDK not loaded");
    }

    SalesforceInteractions.sendEvent({
      interaction: {
        name: "View Catalog Object",
        catalogObject: {
          type: "Product",
          id: "65e4e737",
          attributes: {
            description: "Classic black running shoes",
          },
        },
      },
      sourceChannel: sourceChannel,
    });

    statusDiv.textContent = `Catalog event sent successfully with sourceChannel: ${sourceChannel}!`;
    statusDiv.className = "mt-2 text-success";
  } catch (error) {
    statusDiv.textContent = `Failed to send catalog event: ${error.message}`;
    statusDiv.className = "mt-2 text-danger";
  }
}

// Event listeners for catalog buttons
document.getElementById("catalog-web").addEventListener("click", () => {
  sendCatalogEvent("web");
});

document.getElementById("catalog-mobile").addEventListener("click", () => {
  sendCatalogEvent("mobile");
});

// Initialize with consent provided by a user interaction
SalesforceInteractions.init({
  cookieDomain: "domain.com",
  consents: new Promise((resolve) => {
    const optInBtn = document.getElementById("opt-in");
    const optOutBtn = document.getElementById("opt-out");
    const consentStatusDiv = document.getElementById("consent-status");
    const consentPayloadPre = document.getElementById("consent-payload");

    // user clicks button that grants consent
    optInBtn.addEventListener(
      "click",
      () => {
        optInBtn.style.display = "none";
        optOutBtn.style.display = "none";
        consentStatusDiv.textContent = "Consent Status: Opt In";
        consentStatusDiv.className = "mt-2 text-success fw-bold";

        const payload = [
          {
            provider: "Test Provider",
            purpose: "Tracking",
            status: SalesforceInteractions.ConsentStatus.OptIn,
          },
        ];

        consentPayloadPre.textContent = JSON.stringify(payload, null, 2);
        consentPayloadPre.style.display = "block";

        resolve(payload);
      },
      { once: true },
    );

    // User clicks button that revokes consent
    optOutBtn.addEventListener(
      "click",
      () => {
        optInBtn.style.display = "none";
        optOutBtn.style.display = "none";
        consentStatusDiv.textContent = "Consent Status: Opt Out";
        consentStatusDiv.className = "mt-2 text-danger fw-bold";

        const payload = [
          {
            provider: "Test Provider",
            purpose: "Tracking",
            status: SalesforceInteractions.ConsentStatus.OptOut,
          },
        ];

        consentPayloadPre.textContent = JSON.stringify(payload, null, 2);
        consentPayloadPre.style.display = "block";

        resolve(payload);
      },
      { once: true },
    );
  }),
  //        .then((optStatus) => {
  //     console.log("Web Interactions SDK Init Success!! status:", optStatus);
  //   }),
});
