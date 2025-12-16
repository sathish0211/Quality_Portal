sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("qualityportal.controller.Dashboard", {

        onInspectionListPress: function () {
            this.getOwnerComponent().getRouter().navTo("InspectionList");
        },

        onNavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Login", {}, true);
        }
    });
});
