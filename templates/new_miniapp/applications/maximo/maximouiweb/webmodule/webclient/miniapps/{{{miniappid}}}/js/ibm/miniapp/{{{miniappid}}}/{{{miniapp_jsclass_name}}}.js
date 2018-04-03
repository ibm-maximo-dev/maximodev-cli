define([
  "dojo/_base/lang",
  "dojo/_base/declare",
  "dojo/dom-geometry",
  "dojo/dom",
  "dojo/dom-style",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/_base/window",
  "dojo/topic",
  "com/ibm/tivoli/maximo/miniapps/_MiniApp", /* MiniApp base class - required */
  "com/ibm/tivoli/maximo/miniapps/_MaximoLog", /* Logging Framework - optional */
  "com/ibm/tivoli/maximo/miniapps/Handlers" /* publish / subscribe handlers - optional  */

], function (lang, declare, geom, dom, domStyle, domAttr, domClass, bwin, topic, _MiniApp, log, Handlers) {
  return declare([_MiniApp, Handlers], {
    // static variables - shared by all instances
    TAG: "{{miniappid}}",

    /**
     * Options are passed from the {{miniapp_java_class_name}}.getOptions() method
     *
     * @param options
     */
    constructor: function (options) {
      // object level variables only visible to this instance
      this.options = options || {};

      log.debug("{} options", this.TAG, options);
    },

    /**
     * startup is called when you component needs to be rendered.  In here you can initialize and draw the UI.
     */
    startup: function () {
      this.inherited(arguments);

      // this.domNode is the main UI node for your widget, just set it to loading for now.
      this.domNode.innerHTML = '<div>Loading....</div>';

      var me = this;
      // load google charting apis dynamically
      this.loadLibrary(function() {
        try {
          if (google.charts.load != null) {
            log.debug("Google Chart APIs are loaded.");
            return true;
          }
        } catch(e) {
          log.debug("Waiting for Google Charts API to load...");
        }
        return false;
      }, "https://www.gstatic.com/charts/loader.js", function() {me.startupAfterScriptsAreLoaded()});
    },


    startupAfterScriptsAreLoaded: function() {
      var me = this;
      // note: cmd will get passed as an arg to the async_get_data MXEvent defined in MyMiniAppBean class
      this.fetch("async_get_data", {cmd: 'hello world'}).then(function (data) {
        me.updateUI(data);
      }, function (err) {
        console.log(err);
      });
    },

    updateUI: function (chartData) {
      chartData = chartData || {error: 'No Data From Server'};
      log.debug("Our Data From the Server", chartData);

      // this.domNode is the main UI node for your widget, build on it.
      // you can use whatever approach you need/want to build out the html for your miniapp
      // eg, you can simply use innerHTML to add elements, such as
      //this.domNode.innerHTML = '<div class="hello">Hello World</div>';
      // or you an do something more complex, like add a charting widget, etc.


      if (chartData.error) {
        this.domNode.innerHTML = '<div class="error">'+chartData.error+'</div>';
        return;
      }

      // Load the Visualization API and the corechart package.
      google.charts.load('current', {'packages':['corechart']});

      // keep a reference to ourself...
      var me = this;

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Cost Type');
        data.addColumn('number', 'Amount');

        log.debug("dataSet", chartData.dataSet);

        data.addRows(chartData.dataSet);

        // Set chart options
        var options = {'title': chartData.title,
          'width': 500,
          'height':400};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(me.domNode);
        chart.draw(data, options);
      }

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);


      // hide our progress indicator
      topic.publish('miniapp.hideprogress', this.domid);
    },

    /**
     * destroy is called when your widget is disposed.  Add any clean up here, like unregistering handlers, etc
     */
    destroy: function () {
      this.inherited(arguments);
    },

    /**
     * this is called when the server moves to a new record, or, if the server needs you to refresh your current
     * UI state.
     */
    onRefreshRequested: function (data) {
      this.inherited(arguments);
      // you can call startup again, or uodateUI if you have enough data, etc
      this.startup();
    },

    /**
     * Either returns an object with w,h or width,height.
     * The latter being a css measurement vs a pixel box measurement.  If you remove this method, or do nothing
     * then the default height/widget from the presentation xml will be used.  But here is where you can
     * measure your widget to setup it's size dynamically
     */
    onMeasure: function () {
      return {w: 504, h: 404};
    }
  });
});