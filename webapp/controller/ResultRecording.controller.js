sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("qualityportal.controller.ResultRecording", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("ResultRecording").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sInspectionLot = oEvent.getParameter("arguments").InspectionLot;

            // Assuming the keys for ZSG_INSPECTION_CDS_890 entity are InspectionLot
            // Correct key construction based on OData standard
            // Manual path construction to avoid crash if metadata is not loaded
            var sObjectPath = "/ZSG_INSPECTION_CDS_890(InspectionLot='" + encodeURIComponent(sInspectionLot) + "')";

            this.getView().bindElement({
                path: sObjectPath,
                model: "inspectionModel",
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        this.getView().setBusy(true);
                    }.bind(this),
                    dataReceived: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                }
            });
        },

        _onBindingChange: function () {
            var oView = this.getView(),
                oElementBinding = oView.getElementBinding("inspectionModel");

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getOwnerComponent().getRouter().getTargets().display("InspectionList"); // Fallback
            }
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("InspectionList");
        },

        onSave: function () {
            var oModel = this.getView().getModel("inspectionModel");
            var that = this;

            if (oModel.hasPendingChanges()) {
                oModel.submitChanges({
                    success: function () {
                        MessageBox.success("Results saved successfully.");
                    },
                    error: function () {
                        MessageBox.error("Error saving results.");
                    }
                });
            } else {
                MessageBox.information("No changes to save.");
            }
        },

        onUsageDecisionPress: function () {
            // Navigate to UsageDecision view passing the same context
            var sInspectionLot = this.getView().getBindingContext("inspectionModel").getProperty("InspectionLot");
            this.getOwnerComponent().getRouter().navTo("UsageDecision", {
                InspectionLot: sInspectionLot // Assuming UsageDecision route also takes InspectionLot or share the model context
            });
        }
    });
});
