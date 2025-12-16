sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/ValueState"
], function (Controller, Filter, FilterOperator, ValueState) {
    "use strict";

    return Controller.extend("qualityportal.controller.InspectionList", {

        onInit: function () {

        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("Dashboard");
        },

        formatStatusState: function (sStatus) {
            if (sStatus === "A") {
                return ValueState.Success;
            } else if (sStatus === "R") {
                return ValueState.Error;
            } else if (sStatus === "PENDING") {
                return ValueState.Warning;
            }
            return ValueState.None;
        },

        onSearch: function (oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filter = new Filter("InspectionLot", FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }

            var oTable = this.byId("inspectionTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },

        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("inspectionModel");
            var sInspectionLot = oBindingContext.getProperty("InspectionLot");

            this.getOwnerComponent().getRouter().navTo("ResultRecording", {
                InspectionLot: sInspectionLot
            });
        }
    });
});
