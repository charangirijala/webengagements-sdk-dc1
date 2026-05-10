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

// Function to send catalog event
function sendCatalogEvent() {
  const statusDiv = document.getElementById("catalog-status");
  const payloadPre = document.getElementById("catalog-payload");
  statusDiv.textContent = `Sending Catalog event...`;
  statusDiv.className = "mt-2 text-warning";

  try {
    if (typeof SalesforceInteractions === "undefined") {
      throw new Error("SalesforceInteractions SDK not loaded");
    }
    // Note: deviceId__c sent automatically
    // eventType__c sent automatically as "catalog"
    // catalog_type__c need to be set
    // eventId__c sent automatically
    // Source channel sent automatically as web or mobile based on the device

    const payload = {
      interaction: {
        name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
        catalogObject: {
          type: "Product",
          id: "65e4e737",
          attributes: {
            category: "Shoes",
            description: "Classic black running shoes",
            pageView: 1,
            personalizationContentId: "promo-xyz-123",
            personalizationId: "p13n-algo-99",
            sourceLocale: navigator.language || "en-US",
            sourcePageType: "ProductDetail",
            sourceUrl: window.location.href,
            sourceUrlReferrer: document.referrer
          },
        },
      },
    };

    SalesforceInteractions.sendEvent(payload);

    statusDiv.textContent = `Catalog event sent successfully!`;
    statusDiv.className = "mt-2 text-success fw-bold";

    payloadPre.textContent = JSON.stringify(payload, null, 2);
    payloadPre.style.display = "block";
  } catch (error) {
    statusDiv.textContent = `Failed to send catalog event: ${error.message}`;
    statusDiv.className = "mt-2 text-danger fw-bold";
  }
}

// Event listener for catalog button
document.getElementById("catalog-event").addEventListener("click", () => {
  sendCatalogEvent();
});

// Function to send cart event
function sendCartEvent() {
  const statusDiv = document.getElementById("cart-status");
  const payloadPre = document.getElementById("cart-payload");
  statusDiv.textContent = `Sending Add to Cart event...`;
  statusDiv.className = "mt-2 text-warning";

  try {
    if (typeof SalesforceInteractions === "undefined") {
      throw new Error("SalesforceInteractions SDK not loaded");
    }

    const payload = {
      interaction: {
        name: SalesforceInteractions.CartInteractionName.AddToCart,
        lineItem: {
          catalogObjectType: "Product",
          catalogObjectId: "65e4e737",
          price: 59.99,
          quantity: 1,
          attributes: {
            category: "Shoes",
            currency: "USD"
          }
        }
      }
    };

    SalesforceInteractions.sendEvent(payload);

    statusDiv.textContent = `Add to Cart event sent successfully!`;
    statusDiv.className = "mt-2 text-success fw-bold";

    payloadPre.textContent = JSON.stringify(payload, null, 2);
    payloadPre.style.display = "block";
  } catch (error) {
    statusDiv.textContent = `Failed to send cart event: ${error.message}`;
    statusDiv.className = "mt-2 text-danger fw-bold";
  }
}

// Event listener for cart button
document.getElementById("cart-event").addEventListener("click", () => {
  sendCartEvent();
});

// Function to send order event
function sendOrderEvent() {
  const statusDiv = document.getElementById("order-status");
  const payloadPre = document.getElementById("order-payload");
  statusDiv.textContent = `Sending Purchase event...`;
  statusDiv.className = "mt-2 text-warning";

  try {
    if (typeof SalesforceInteractions === "undefined") {
      throw new Error("SalesforceInteractions SDK not loaded");
    }

    const payload = {
      interaction: {
        name: SalesforceInteractions.OrderInteractionName.Purchase,
        order: {
          id: "ORDER-" + Math.floor(Math.random() * 100000),
          totalValue: 59.99,
          currency: "USD",
          lineItems: [
            {
              catalogObjectType: "Product",
              catalogObjectId: "65e4e737",
              quantity: 1,
              price: 59.99
            }
          ]
        }
      }
    };

    SalesforceInteractions.sendEvent(payload);

    statusDiv.textContent = `Purchase event sent successfully!`;
    statusDiv.className = "mt-2 text-success fw-bold";

    payloadPre.textContent = JSON.stringify(payload, null, 2);
    payloadPre.style.display = "block";
  } catch (error) {
    statusDiv.textContent = `Failed to send purchase event: ${error.message}`;
    statusDiv.className = "mt-2 text-danger fw-bold";
  }
}

// Event listener for order button
document.getElementById("order-event").addEventListener("click", () => {
  sendOrderEvent();
});

// Initialize with consent provided by a user interaction
SalesforceInteractions.init({
  cookieDomain: "github.io",
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

        const catalogBtn = document.getElementById("catalog-event");
        const cartBtn = document.getElementById("cart-event");
        const orderBtn = document.getElementById("order-event");
        catalogBtn.disabled = false;
        cartBtn.disabled = false;
        orderBtn.disabled = false;
        document.getElementById("catalog-status").textContent = "";
        document.getElementById("catalog-status").className = "mt-2";
        document.getElementById("cart-status").textContent = "";
        document.getElementById("cart-status").className = "mt-2";
        document.getElementById("order-status").textContent = "";
        document.getElementById("order-status").className = "mt-2";

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

        const catalogBtn = document.getElementById("catalog-event");
        const cartBtn = document.getElementById("cart-event");
        const orderBtn = document.getElementById("order-event");
        catalogBtn.disabled = true;
        cartBtn.disabled = true;
        orderBtn.disabled = true;
        const msg = "Cannot send events to Data Cloud as consent is opted out";
        const msgClass = "mt-2 text-danger fw-bold";
        document.getElementById("catalog-status").textContent = msg;
        document.getElementById("catalog-status").className = msgClass;
        document.getElementById("cart-status").textContent = msg;
        document.getElementById("cart-status").className = msgClass;
        document.getElementById("order-status").textContent = msg;
        document.getElementById("order-status").className = msgClass;

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
