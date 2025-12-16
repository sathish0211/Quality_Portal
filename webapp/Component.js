sap.ui.define([
    "sap/ui/core/UIComponent",
    "qualityportal/model/models",
    "sap/m/MessageBox"
], (UIComponent, models, MessageBox) => {
    "use strict";

    return UIComponent.extend("qualityportal.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            // Error Handling for OData Models
            this._attachErrorHandler("loginModel");
            this._attachErrorHandler("inspectionModel");
        },

        _attachErrorHandler: function (sModelName) {
            var oModel = this.getModel(sModelName);
            if (oModel) {
                oModel.attachMetadataFailed(function (oEvent) {
                    var oParams = oEvent.getParameters();
                    sap.m.MessageBox.error("Metadata loading failed for " + sModelName + ".\nStatus: " + oParams.statusCode + " " + oParams.statusText + ".\n\nPlease check your Backend Connectivity (Cloud Connector / Destination).");
                });

                oModel.attachRequestFailed(function (oEvent) {
                    var oParams = oEvent.getParameters();
                    // Ignore 404s if they are just data missing, but catch 502s
                    if (oParams.response && oParams.response.statusCode === 502) {
                        sap.m.MessageBox.error("Backend Unreachable (502 Bad Gateway) for " + sModelName + ".\nEnsure the Cloud Connector is running and the Destination is correct.");
                    }
                });
            }
        }
    });
});