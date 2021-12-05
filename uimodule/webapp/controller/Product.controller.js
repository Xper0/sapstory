sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment',
    "sap/m/MenuItem",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
  ],
  function (Controller, Fragment,  MenuItem, History, UIComponent, JSONModel){
    return Controller.extend("com.storeapp.storeapp.controller.Product", {
      onInit: function () {

        //this._oRouter = UIComponent.getRouterFor(this);
        var oRouter = this.getOwnerComponent().getRouter();
        // this._oRouter.getRoute("Product").attachPatternMatched(this._onRoutePatternMatched, this);
        oRouter.getRoute("detail").attachPatternMatched(this._onRoutePatternMatched, this);

        let oProducts = new JSONModel("../localService/metadata/Product.json")
        this.getView().setModel(oProducts, "Products");

      },

      _onRoutePatternMatched: function (oEvent) {
        var oContainer = this.byId("comparisonContainer");
        var oParameters = oEvent.getParameter("arguments");
        var oPlaceholder = this.byId("placeholder");

        // save category and current products
        this.getModel("comparison").setProperty("/category", oParameters.id);
        this.getModel("comparison").setProperty("/item1", oParameters.item1Id);
        this.getModel("comparison").setProperty("/item2", oParameters.item2Id);

        // update the comparison panels
        oPlaceholder.setVisible(false);
        updatePanel(0, oParameters.item1Id);
        updatePanel(1, oParameters.item2Id);

        // helper function to update the panel binding
        function updatePanel (iWhich, sId) {
          var oPanel = oContainer.getItems()[iWhich];
          if (sId){
            var sPath = "/Products('" + sId + "')";
            oPanel.bindElement({
              path: sPath
            });
            oPanel.setVisible(true);
          } else {
            oPanel.unbindElement();
            oPanel.setVisible(false);
            oPlaceholder.setVisible(true);
          }
        }
      },
      getRouter : function () {
        return UIComponent.getRouterFor(this);
      },
      onNavBack: function () {
        let oHistory = History.getInstance()
        let sPreviousHash = oHistory.getPreviousHash();
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("Home", {}, true);
        }
    },
      onShowDetail: function (oEvent) {
        var oItem = oEvent.getSource();
        let oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("detail", {
           // detailId: window.encodeURIComponent(oItem.getBindingContext("Products").getPath().substr(1))
          detailId: oItem.getBindingContext("Products").getProperty("id" )
          });
      },
      onToggleCart: function (oEvent) {
        console.log(oEvent.getParameter("pressed"))
        var bPressed = oEvent.getParameter("pressed");
        // var sItem1Id = this.getView().getModel("comparison").getProperty("/item1");
        // var sItem2Id = this.getView().getModel("comparison").getProperty("/item2");
        // var sCategory = this.getView().getModel("comparison").getProperty("/category");

        this._setLayout(bPressed ? "Two" : "One");
        this.getRouter().navTo(bPressed ? "detail": "Products" );
      },
      _setLayout: function (sColumns) {
        console.log("вызов в base")
        if (sColumns) {
          this.getView().getModel("Products").setProperty("/layout", sColumns + "Column" + (sColumns === "One" ? "" : "sMidExpanded"));
          console.log(this.getView().getModel("Products"))
        }
      }


    })
  });