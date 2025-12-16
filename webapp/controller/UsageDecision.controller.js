sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/ValueState"
], function (Controller, MessageBox, ValueState) {
    "use strict";

    return Controller.extend("qualityportal.controller.UsageDecision", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("UsageDecision").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sInspectionLot = oEvent.getParameter("arguments").InspectionLot;
            var oModel = this.getOwnerComponent().getModel("inspectionModel");

            var sObjectPath = oModel.createKey("/ZSG_INSPECTION_CDS_890", {
                InspectionLot: sInspectionLot
            });

            this.getView().bindElement({
                path: sObjectPath,
                model: "inspectionModel",
                events: {
                    change: this._onBindingChange.bind(this)
                }
            });
        },

        _onBindingChange: function () {
            var oContext = this.getView().getBindingContext("inspectionModel");
            if (!oContext) {
                return;
            }

            var fLotQty = parseFloat(oContext.getProperty("LotQuantity"));
            var fUnrestricted = parseFloat(oContext.getProperty("UnrestrictedStock")) || 0;
            var fBlocked = parseFloat(oContext.getProperty("BlockedStock")) || 0;
            var fProduction = parseFloat(oContext.getProperty("ProductionStock")) || 0;
            var sCurrentStatus = oContext.getProperty("UsageDecisionCode");

            var fTotalRecorded = fUnrestricted + fBlocked + fProduction;
            var bValid = Math.abs(fLotQty - fTotalRecorded) < 0.001; // Float comparison

            var oStatus = this.getView().byId("validationStatus");
            var oBtnApprove = this.getView().byId("btnApprove");
            var oBtnReject = this.getView().byId("btnReject");

            if (sCurrentStatus !== 'PENDING') {
                oStatus.setText("Decision Already Taken: " + sCurrentStatus);
                oStatus.setState(ValueState.None);
                oBtnApprove.setEnabled(false);
                oBtnReject.setEnabled(false);
                return;
            }

            if (bValid) {
                oStatus.setText("Stock Matches Lot Quantity");
                oStatus.setState(ValueState.Success);
                oBtnApprove.setEnabled(true);
                oBtnReject.setEnabled(true);
            } else {
                oStatus.setText("Mismatch: Recorded " + fTotalRecorded + " / Lot " + fLotQty);
                oStatus.setState(ValueState.Error);
                oBtnApprove.setEnabled(false);
                oBtnReject.setEnabled(false);
            }
        },

        _saveDecision: function (sDecision) {
            var oModel = this.getView().getModel("inspectionModel");
            var sPath = this.getView().getBindingContext("inspectionModel").getPath();

            oModel.setProperty(sPath + "/UsageDecisionCode", sDecision);

            if (oModel.hasPendingChanges()) {
                oModel.submitChanges({
                    success: function () {
                        MessageBox.success("Usage Decision Saved: " + (sDecision === 'A' ? "Approved" : "Rejected"), {
                            onClose: function () {
                                this.getOwnerComponent().getRouter().navTo("Dashboard");
                            }.bind(this)
                        });
                    }.bind(this),
                    error: function () {
                        MessageBox.error("Failed to save Usage Decision");
                    }
                });
            }
        },

        onApprove: function () {
            this._saveDecision("A");
        },

        onReject: function () {
            this._saveDecision("R");
        },

        onNavBack: function () {
            var sInspectionLot = this.getView().getBindingContext("inspectionModel").getProperty("InspectionLot");
            this.getOwnerComponent().getRouter().navTo("ResultRecording", {
                InspectionLot: sInspectionLot
            });
        }
    });
});
