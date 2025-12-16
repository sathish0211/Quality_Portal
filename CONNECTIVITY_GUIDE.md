# Connectivity Troubleshooting Guide

You are encountering **502 Bad Gateway** errors. This means the Business Application Studio (BAS) proxy cannot reach your backend OData service at `172.17.19.24:8000`.

Since you are running in SAP BAS (Cloud), you **cannot** connect to a private IP (`172...`) directly. You must use the SAP Cloud Connector.

## Solution 1: Configure BTP Destination (Recommended)

1.  **SAP Cloud Connector**:
    - Ensure your Cloud Connector is running and connected to your BTP Subaccount.
    - Add a mapping to the **internal host** `172.17.19.24:8000` and expose it as a virtual host (e.g., `s4hana:8000`).
    - Allow access to path `/sap/opu/odata`.

2.  **BTP Cockpit -> Destinations**:
    - Create a new HTTP Destination.
    - **Name**: `S4HANA` (must match what is in `ui5.yaml`).
    - **URL**: `http://s4hana:8000` (the virtual host from Cloud Connector).
    - **Proxy Type**: `OnPremise`.
    - **Authentication**: `BasicAuthentication` (or matching your backend).
    - Check "Use default JDK truststore".
    - Add Property: `WebIDEUsage` = `odata_gen`.
    - Add Property: `HTML5.DynamicDestination` = `true`.

3.  **Update Project**:
    - I have already updated `ui5.yaml` and `ui5-local.yaml` to use:
      ```yaml
      destination: S4HANA
      ```
    - Ensure the Destination name in BTP matches exactly (`S4HANA`).

## Solution 2: Running Locally (VS Code)

If you cannot configure Cloud Connector, you must run this project **locally** on your PC (VS Code) where you have VPN access to `172.17.19.24`.

1.  Clone this project to your local machine.
2.  In `ui5.yaml`, comment out `destination` and uncomment `url`:
    ```yaml
    backend:
      - path: /sap
        url: http://172.17.19.24:8000
        # destination: S4HANA
    ```
3.  Run `npm install` and `npm start`.

## Summary
The code is correct and crash-free. The error is solely due to the network path between SAP BAS and your private backend server.
