sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MenuItem",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
  "../model/formatter",
    "sap/f/library",
  "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (Controller, Fragment,  MenuItem, History, UIComponent, JSONModel, formatter, fioriLibrary, Sorter, Filter, FilterOperator ){
    return Controller.extend("com.storeapp.storeapp.controller.Product", {
      formatter: formatter,
      _iLowFilterPreviousValue: 0,
      _iHighFilterPreviousValue: 4000,
      onInit: function () {
        this._mViewSettingsDialogs = {};
        this.oView = this.getView();
        let oProducts = new JSONModel("../localService/metadata/Product.json");
        this.getView().setModel(oProducts, "Products");
        // this._oRouter = UIComponent.getRouterFor(this);
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("Category").attachPatternMatched(this._onRouteCategoryMatched, this);
        // oRouter.getRoute("detail").attachPatternMatched(this._onRoutePatternMatched, this);
        // let oData = {
        //   RS1: [0, 7999],
        // };
        // let oModel =  new JSONModel(oData);
        // this.getView().setModel(oModel);

      },
      _onRouteCategoryMatched: function (oEvent){
        var oContainer = this.byId("table");
        let oBinding= oContainer.getBinding("items");
        let oArguments = oEvent.getParameter("arguments");
        let sCategory = oArguments.category;
        let oFilter = new sap.ui.model.Filter("MainCategory", sap.ui.model.FilterOperator.EQ, sCategory);
        if (sCategory === "All") {
          let oAllProduct = this.getView().getModel("myProductModel");
          return oBinding.filter([oAllProduct]);
        } else {
          return  oBinding.filter([oFilter]);
        }
        // oBinding.filter([oFilter])
      },
      // _onRoutePatternMatched: function (oEvent) {
      //   var oContainer = this.byId("comparisonContainer");
      //   var oParameters = oEvent.getParameter("arguments");
      //   var oPlaceholder = this.byId("placeholder");
      //
      //   // save category and current products
      //   this.getModel("comparison").setProperty("/category", oParameters.id);
      //   this.getModel("comparison").setProperty("/item1", oParameters.item1Id);
      //   this.getModel("comparison").setProperty("/item2", oParameters.item2Id);
      //
      //   // update the comparison panels
      //   oPlaceholder.setVisible(false);
      //   updatePanel(0, oParameters.item1Id);
      //   updatePanel(1, oParameters.item2Id);
      //
      //   // helper function to update the panel binding
      //   function updatePanel (iWhich, sId) {
      //     var oPanel = oContainer.getItems()[iWhich];
      //     if (sId){
      //       var sPath = "/Products('" + sId + "')";
      //       oPanel.bindElement({
      //         path: sPath
      //       });
      //       oPanel.setVisible(true);
      //     } else {
      //       oPanel.unbindElement();
      //       oPanel.setVisible(false);
      //       oPlaceholder.setVisible(true);
      //     }
      //   }
      // },
      // getRouter : function () {
      //   return UIComponent.getRouterFor(this);
      // },

      /**
       * function return history page
       * */
      onNavBack: function () {
        let oHistory = History.getInstance();
        let sPreviousHash = oHistory.getPreviousHash();
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("Home", {}, true);
        }
    },
      /**
       * function move page  route detail with param
       * */
      onShowDetail: function (oEvent) {
        let oItem = oEvent.getSource();
        let oRouter = this.getOwnerComponent().getRouter();
        // var oBindContext = oEvent.getSource().getBindingContext();
        // oRouter.navTo("detail")
        oRouter.navTo("detail", {
           // detailId: window.encodeURIComponent(oItem.getBindingContext("Products").getPath().substr(1))
          detailId: oItem.getBindingContext("myProductModel").getProperty("id" )
          });
      },

      onToggleCart: function (oEvent) {
        var bPressed = oEvent.getParameter("pressed");
        let oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Cart");
        var oFCL = this.oView.getParent().getParent();
        // console.log(this.getView().getParent().getParent().getParent())
        oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);



        // var sItem1Id = this.getView().getModel("comparison").getProperty("/item1");
        // var sItem2Id = this.getView().getModel("comparison").getProperty("/item2");
        // var sCategory = this.getView().getModel("comparison").getProperty("/category");

      //   this._setLayout(bPressed ? "Two" : "One");
      //   this.getRouter().navTo(bPressed ? "detail": "Products" );
      // },
      // _setLayout: function (sColumns) {
      //   console.log("вызов в base")
      //   if (sColumns) {
      //     this.getView().getModel("Products").setProperty("/layout", sColumns + "Column" + (sColumns === "One" ? "" : "sMidExpanded"));
      //     console.log(this.getView().getModel("Products"))
      //   }
      },
      /**
       * function open SortDialog.fragment
       * */
      handleSortButtonPressed: function () {
        this.getViewSettingsDialog("com.storeapp.storeapp.view.SortDialog")
          .then(function (oViewSettingsDialog) {
            oViewSettingsDialog.open();
          });
      },
      /**
       * function open FilterDialog.fragment
       * */
      handleFilterButtonPressed: function () {
        this.getViewSettingsDialog("com.storeapp.storeapp.view.FilterDialog")
          .then(function (oViewSettingsDialog) {
            oViewSettingsDialog.open();
          });
      },

      getViewSettingsDialog: function (sDialogFragmentName) {
        var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];
        let oPriceProduct = this.getView().getModel("myProductModel").getData().map(item => Number(item.Price));
        // let maxPrice = Math.max.apply(null, oAllProduct.map( item => Number(item.Price)))
        // let minPrice = Math.min.apply(null, oAllProduct.map( item => Number(item.Price)))
       let [minPrice, maxPrice] = [Math.min.apply(null, oPriceProduct), Math.max.apply(null, oPriceProduct)]
        if (!pDialog) {
          pDialog = Fragment.load({
            id: this.getView().getId(),
            name: sDialogFragmentName,
            controller: this
          }).then(function (oDialog) {
            let oData = {
              rangeSlider: [minPrice + 1000, maxPrice - 1000],
              Min: minPrice,
              Max: maxPrice,
              // Range: [minPrice, maxPrice]
            };
            let oModel =  new JSONModel(oData);
            oDialog.setModel(oModel);
            return oDialog;
          });
          this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
        }
        return pDialog;
      },
      handleSortDialogConfirm: function (oEvent) {
        let oSortItem = oEvent.getParameter("sortItem");
        let sColumnPath = "Product Name";
        let bSortDescending =  oEvent.getParameter("sortDescending");
        let aSortes = [];
        if (oSortItem) {
            sColumnPath = oSortItem.getKey()
        }
        aSortes.push(new Sorter(sColumnPath, bSortDescending));
        let oTable = this.byId("table");
        let oBinding= oTable.getBinding("items")
        oBinding.sort(aSortes)
      },

      handleFilterDialogConfirm: function (oEvent) {
        let oCustomFilter = this.byId("categoryFilterDialog").getFilterItems()[0];
        let oSlider = oCustomFilter.getCustomControl().getAggregation("content")[0];
        this._iLowFilterPreviousValue = oSlider.getValue();
        this._iHighFilterPreviousValue = oSlider.getValue2();
        this._applyFilter(oEvent);
      },
      _applyFilter : function (oEvent) {
        let oTableContainet = this.byId("table"),
          oBinding = oTableContainet.getBinding("items")
        let aSelectedFilterItems = oEvent.getParameter("filterItems"),
          oCustomFilter =  this.byId("categoryFilterDialog").getFilterItems()[0];
        let [oFilter, oCustomKeys, aFilters, aPriceFilters, aSupplierFilters] = [ null, {}, [], [], [] ];
        // Add the slider custom filter if the user selects some values
        if (oCustomFilter.getCustomControl().getAggregation("content")[0].getValue() !== oCustomFilter.getCustomControl().getAggregation("content")[0].getMin() ||
          oCustomFilter.getCustomControl().getAggregation("content")[0].getValue2() !== oCustomFilter.getCustomControl().getAggregation("content")[0].getMax()) {
          aSelectedFilterItems.push(oCustomFilter);
        }
        aSelectedFilterItems.forEach(function (oItem) {
          let sFilterKey = oItem.getProperty("key"),
            iValueLow,
            iValueHigh;
          switch (sFilterKey) {
            case "Price":
              iValueLow = oItem.getCustomControl().getAggregation("content")[0].getValue();
              iValueHigh = oItem.getCustomControl().getAggregation("content")[0].getValue2();
              oFilter = new Filter("Price", FilterOperator.BT, iValueLow, iValueHigh);
              aPriceFilters.push(oFilter);
              oCustomKeys["priceKey"] = {Price: true};
              console.log(oCustomKeys["priceKey"])
              break;
            default:
              oFilter = new Filter("SupplierName", FilterOperator.EQ, sFilterKey);
              aSupplierFilters.push(oFilter);

          }
        });

        if (aPriceFilters.length > 0) {
          aFilters.push(new Filter({filters: aPriceFilters}));
        }
        oFilter = new Filter({filters: aFilters, and: true});

        if (aFilters.length > 0) {
          oBinding.filter(oFilter);
          // this.byId("categoryInfoToolbar").setVisible(true);
          // var sText = this.getResourceBundle().getText("filterByText") + " ";
          // var sSeparator = "";
          // var oFilterKey = oEvent.getParameter("filterCompoundKeys");
          // var oKeys = Object.assign(oFilterKey, oCustomKeys);
          // for (var key in oKeys) {
          //   if (oKeys.hasOwnProperty(key)) {
          //     sText = sText + sSeparator  + this.getResourceBundle().getText(key, [this._iLowFilterPreviousValue, this._iHighFilterPreviousValue]);
          //     sSeparator = ", ";
          //   }
          // }
          // this.byId("categoryInfoToolbarTitle").setText(sText);
        } else {
          oBinding.filter(null);
          // this.byId("categoryInfoToolbar").setVisible(false);
          // this.byId("categoryInfoToolbarTitle").setText("");
        }
      },
    });
  });