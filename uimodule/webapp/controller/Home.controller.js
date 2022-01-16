sap.ui.define([
  "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment',
    "sap/m/MenuItem",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/core/Component",
    'sap/m/ObjectIdentifier',
    "../model/cart",
    "sap/ui/core/BusyIndicator",
    "../model/formatter",
  "../controller/Helper"
  ],
  function (Controller, Fragment, MenuItem, JSONModel, MessageToast, Filter, Component, ObjectIdentifier, cart,BusyIndicator, formatter, Helper){
    return Controller.extend("com.storeapp.storeapp.controller.Home", {
      formatter: formatter,
      onInit: function () {

        this.oModel = new JSONModel("../localService/metadata/Product.json");
        //
          this.hideBusyIndicator()
        this.showBusyIndicator(4000, 0)
      this.productModule = this.getOwnerComponent().getModel("myProductModel")
        console.dir(this.productModule)
        var oView = this.getView().setModel(this.oModel);
        this.oSF = oView.byId("searchField");
        this.Helper = new Helper(this)

      },
      hideBusyIndicator: function() {
        BusyIndicator.hide();
      },
      showBusyIndicator : function (iDuration, iDelay) {
        BusyIndicator.show(iDelay);
        if (iDuration && iDuration > 0) {
          if (this._sTimeoutId) {
            clearTimeout(this._sTimeoutId);
            this._sTimeoutId = null;
          }
          this._sTimeoutId = setTimeout(function() {
            this.hideBusyIndicator();
          }.bind(this), iDuration);
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
      onPress: function() {
        let oView = this.getView(),
            oButton = this.byId("button");
        if (!this._oMenuFragment) {
          console.log(this._oMenuFragment)
          this._oMenuFragment = Fragment.load({
            name: "com.storeapp.storeapp.view.Category",
            controller: this
          }).then(function(oMenu) {
            oMenu.getMetadata(oButton);
            this._oMenuFragment = oMenu;
            return this._oMenuFragment;
          }.bind(this));
          console.log( this._oMenuFragment)
        } else {
          this._oMenuFragment.getMetadata(oButton);
        }
      },
      _onProductDetails: function (oEvent) {
        var oBindContext;
          oBindContext = oEvent.getSource().getSelectedItem().getBindingContext();
        var oModel = oBindContext.getModel();
        var sCategoryId = oModel.getData(oBindContext.getPath()).Category;
        var sProductId = oModel.getData(oBindContext.getPath()).ProductId;

        // keep the cart context when showing a product
        var bCartVisible = this.getModel("appView").getProperty("/layout").startsWith("Three");
        this._setLayout("Two");
        this._oRouter.navTo(bCartVisible ? "productCart" : "product", {
          id: sCategoryId,
          productId: sProductId
        });
      },

      onPageProduct: function (oEvent){
        var oItem = oEvent.getSource();
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Products" );
      },

      onCollapseExpandPress: function () {
        var oNavigationList = this.byId("navigationList");
        // var bExpanded = oNavigationList.getExpanded();
        oNavigationList.setVisible(!oNavigationList.getVisible());
        // oNavigationList.setExpanded(!bExpanded);
      },


      /**
       * select item  category
       * @param oEvent
       */
      onSelectItem: function (oEvent) {
        let item = oEvent.getParameter("item")
        let categoryData = item.getBindingContext("category").getObject()
        let sCategory = categoryData.CategoryName
        var oRouter = this.getOwnerComponent().getRouter();
        if (sCategory) {
          oRouter.navTo("Category", {category: sCategory});
        } else {
          sap.m.MessageToast.show("категория не обнаружена")
        }
      },
      onShowDetail: function (oEvent) {
        let oItem = oEvent.getSource().getBindingContext("myProductModel").getObject(); //  получение item
        let oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("detail", {
          detailId: oItem.id
        });
      },

      /**
       * add  itemProduct in cart
       * @param oEvent
       */
      onAddToCart: function (oEvent) {
        let oProduct = oEvent.getSource().getBindingContext("myProductModel").getObject();  //  получение item
        let oCart = oEvent.getSource().getModel("cartProducts") //  получение модели json
        cart.addToCart(oProduct, oCart)
        this.Helper.check()
      },

      /**
       * navigation   PurchaseStatistics
       * @param oEvent
       */
      onShowStatistic: function () {
        let oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("purchaseStatistics");
      }

    })
  });