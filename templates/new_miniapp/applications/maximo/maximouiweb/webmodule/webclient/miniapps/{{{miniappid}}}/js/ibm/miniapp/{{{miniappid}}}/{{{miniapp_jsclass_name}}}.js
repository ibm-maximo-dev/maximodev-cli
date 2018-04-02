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
      // note: cmd will get passed as an arg to the async_get_data MXEvent defined in {{miniapp_java_class_name}} class
      this.fetch("async_get_data", {cmd: 'hello world'}).then(function (data) {
        me.updateUI(data);
      }, function (err) {
        console.log(err);
      });
    },

    updateUI: function (data) {
      data = data || {name: 'Unknown'};
      log.debug("Our Data From the Server", data);
      // this.domNode is the main UI node for your widget, build on it.
      // you can use whatever approach you need/want to build out the html for your miniapp
      this.domNode.innerHTML = '<div class="hello">Hello ' + data.name + '</div>';

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
      return {w: 500, h: 500};
    }
  });
});