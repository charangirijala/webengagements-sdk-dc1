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
    // user clicks button that grants consent
    //     let optStatus = "";
    document.getElementById("opt-in").addEventListener(
      "click",
      () => {
        //    optStatus = "opt-in";
        //    console.log("opt in called");
        resolve([
          {
            provider: "Test Provider",
            purpose: "Tracking",
            status: SalesforceInteractions.ConsentStatus.OptIn,
          },
        ]);
      },
      { once: true },
    );

    // User clicks button that revokes consent
    document.getElementById("opt-out").addEventListener(
      "click",
      () => {
        //    optStatus = "opt-out";
        resolve([
          {
            provider: "Test Provider",
            purpose: "Tracking",
            status: SalesforceInteractions.ConsentStatus.OptOut,
          },
        ]);
      },
      { once: true },
    );
  }),
  //        .then((optStatus) => {
  //     console.log("Web Interactions SDK Init Success!! status:", optStatus);
  //   }),
});
