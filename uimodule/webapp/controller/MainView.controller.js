sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param MessageToast
     * @param Filter
     * @param JSONModel
     */
    function (Controller, MessageToast, Filter, JSONModel, formatter ) {
        "use strict";

        return Controller.extend("com.storeapp.storeapp.controller.MainView", {
          formatter: formatter,
            onInit: function () {
              this.oModel = new JSONModel("../localService/metadata/Product.json");
              // this.hideBusyIndicator()
              // this.showBusyIndicator(4000, 0)
              //
              // this.showBusyIndicator(4000, 0)
              var oView = this.getView().setModel(this.oModel);
              this.oSF = oView.byId("searchFields");
            },
          onRouter: function (pathRoute) {
              return this.getOwnerComponent().getRouter().navTo(pathRoute)
          },
          onToggleCart: function (oEvent) {
            console.log(oEvent.getParameter("pressed"))
            var bPressed = oEvent.getParameter("pressed");
            // this.onRouter.navTo("Cart")
            this.onRouter("Cart")
          },
          onShowStatistic: function () {
            // let oRouter = this.getOwnerComponent().getRouter();
            // this.onRouter.navTo("purchaseStatistics");
            this.onRouter("purchaseStatistics")
          },
          onHome: function () {
              this.onRouter("Home")
          },
          onSideNavButtonPress: function () {
            var oToolPage = this.byId("toolPage");
            var bSideExpanded = oToolPage.getSideExpanded();
            console.log(bSideExpanded)
            // this._setToggleButtonTooltip(bSideExpanded);
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
          },
          onItemSelect: function (oEvent) {
            let oItem = oEvent.getParameter("item");
            let categoryData = oItem.getBindingContext("category").getObject()
            console.log(oItem)
            let sCategory = categoryData.CategoryName;
            let oRouter = this.getOwnerComponent().getRouter();
            if (sCategory) {
              oRouter.navTo("Category", {category: sCategory});
            } else {
              sap.m.MessageToast.show("категория не обнаружена")
            }
          },
          showSearch: function (oEvent){
              let searchContainer = this.byId("searchFields")
            let pressContainer = this.byId("searchField")
            let visible = searchContainer.getVisible()
            if (!visible) {
              searchContainer.setVisible(true)
            } else {
              searchContainer.setVisible(false)
            }

          },
          onSearch: function (event) {
            let oItem = event.getParameter("suggestionItem");
            let oRouter = this.getOwnerComponent().getRouter();
            if (oItem && oItem !== "") {
              let itemData = oItem.getBindingContext("myProductModel").getObject().id
              MessageToast.show("Search for: " + oItem.getText());
              oRouter.navTo("detail", {
                // detailId: window.encodeURIComponent(oItem.getBindingContext("Products").getPath().substr(1))
                detailId: itemData
              });
            } else {
              MessageToast.show("Search is fired!");
            }
          },

          onSuggest: function (event) {
            var sValue = event.getParameter("suggestValue"),
              aFilters = [];
            if (sValue) {
              aFilters = [
                new Filter([
                  // new Filter("id", function (sText) {
                  //   console.log(sText)
                  //   return (sText || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
                  // }),
                  new Filter("Name", function (sDes) {
                    return (sDes || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
                  })
                ], false)
              ];
            }
            this.oSF.getBinding("suggestionItems").filter(aFilters);
            this.oSF.suggest();
          },
          // _setToggleButtonTooltip: function (bLarge) {
          //   var oToggleButton = this.byId('sideNavigationToggleButton');
          //   if (bLarge) {
          //     oToggleButton.setTooltip('Large Size Navigation');
          //   } else {
          //     oToggleButton.setTooltip('Small Size Navigation');
          //   }
          // }
        });
    });
