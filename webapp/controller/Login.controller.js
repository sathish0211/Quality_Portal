sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/UIComponent"
], function (Controller, MessageBox, UIComponent) {
    "use strict";

    return Controller.extend("qualityportal.controller.Login", {

        onInit: function () {
            // keep session logic if needed
        },

        onLoginPress: function () {
            var sUsername = this.getView().byId("userInput").getValue();
            var sPassword = this.getView().byId("passInput").getValue();

            if (!sUsername || !sPassword) {
                MessageBox.error("Please enter both username and password.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel("loginModel");
            var sPath = "/ZSG_LOGIN_CDS_890";
            var that = this;

            // Reading specifically for the username to validate credentials as per requirement
            // Requirement says: ZSG_LOGIN_CDS_890(username='{USERNAME}')

            var sObjectPath = oModel.createKey("/ZSG_LOGIN_CDS_890", {
                username: sUsername
            });

            oModel.read(sObjectPath, {
                success: function (oData) {
                    if (oData.password === sPassword && oData.login_status === "Success") {
                        // MessageBox.success("Login Successful");
                        that.getOwnerComponent().getRouter().navTo("Dashboard");
                    } else {
                        MessageBox.warning("Invalid Credentials");
                    }
                },
                error: function (oError) {
                    MessageBox.error("Login service failed or User not found.");
                }
            });
        }
    });
});
