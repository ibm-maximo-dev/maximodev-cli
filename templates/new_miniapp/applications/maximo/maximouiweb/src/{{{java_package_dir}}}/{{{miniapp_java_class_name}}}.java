/*
 *
 * IBM Confidential
 *
 * OCO Source Materials
 *
 * 5724-U18
 *
 * (C) COPYRIGHT IBM CORP. 2014
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.
 *
 */

package {{{java_package}}};

import com.ibm.json.java.JSONObject;
import com.ibm.tivoli.maximo.miniapps.control.CssFilterable;
import com.ibm.tivoli.maximo.miniapps.control.HasOptions;
import com.ibm.tivoli.maximo.miniapps.control.MiniAppControl;
import com.ibm.tivoli.maximo.miniapps.control.ResetListener;
import com.ibm.tivoli.maximo.miniapps.control.annotations.MXEvent;
import com.ibm.tivoli.maximo.miniapps.control.annotations.MXEventParam;
import psdi.webclient.system.beans.DataBean;
import psdi.webclient.system.session.WebClientSession;

import java.util.HashMap;
import java.util.Map;

/**
 * Provides the base class for integrating a TreeGrid mini app.
 * NOTE: HasOptions, CssFilterable, and ResetListener are optional, but useful.
 */
public class {{{miniapp_java_class_name}}} extends DataBean
        implements HasOptions, CssFilterable, ResetListener {
    public {{{miniapp_java_class_name}}}() {
        super();
    }

    /**
     * OnReset is called whenever we need to clear the state of our bean. And
     * reinitialize it for a new state. ie, when Maximo changes a record, etc,
     * we need to clear the bean data, the load the state for that record
     */
    public void onReset() {
        System.out.println("Resetting/Initializing: {{miniappid}}");
    }

    /**
     * This is a sample "handler" showing how you would push a message from the
     * sever to the browser ui. The JavaScript in the browser would need to
     * "subscribe()" to the message id that is used, which in this case, is
     * 'miniapp.{{{miniappid}}}.pushevent'. This ID can be any ID that you want to
     * use, provided the JavaScript is subscribed to it. <br>
     * In JavaScript it would look like this..
     *
     * <pre>
     * topic.subscribe("miniapp.{{{miniappid}}}.pushevent", function(data) {
     *    alert("GOT A PUSHED MESSAGE: " + data);
     * });
     * </pre>
     */
    public void async_push_client_message() {
        sendEventToClient("miniapp.{{{miniappid}}}.pushevent", "test message");
    }

    /**
     * Will push a Dojo topic with the given eventId as the topic and eventArg
     * as the event message
     *
     * @param eventId
     * @param eventArg
     */
    public void sendEventToClient(String eventId, String eventArg) {
        MiniAppControl.pushClientEvent(clientSession, creator.getId(), eventId, eventArg);
    }

    /**
     * Returns the "options" attribute, parsed as JSON from the
     * <minapp options=""> presentation element.
     *
     * @return
     */
    public JSONObject getPresentationOptions() {
        return ((MiniAppControl) getCreator()).getPresentationOptions();
    }

    /**
     * any options defined here, are passed to the constructor of the your JavaScript MiniApp.  You an do things here
     * like read system properties and pass them to your JavaScript MiniApp, or read messages and pass them to your MiniApp, etc.
     */
    @Override
    public Map<String, ?> getOptions() {
        Map<String, Object> options = new HashMap<>();
        try {
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return options;
    }

    /**
     * You can add dynamic CSS here... just return the original css along with any changes in the return.  Note, you
     * have a miniapp.css file in your miniapp project area, and that is read and passed here so that you can extend
     * the css file dynamically.  A use case here might be that you have have some "variables" in your css file that
     * you want to replace dynamically.   In mot cases, users do not need to do anything here.
     *
     * @param css
     * @param control
     * @return
     */
    @Override
    public String filterCss(String css, MiniAppControl control) {
        if (css == null)
            css = "";
        return css;
    }

    /**
     * Called when the bean is setup with the session
     *
     * @param wcs
     */
    @Override
    public void setupBean(WebClientSession wcs) {
        super.setupBean(wcs);
    }


    /**
     * Used to load a file in the "miniapp/{{{miniappid}}}/" directory.  'path' should be relative to your {{{miniappid}}} directory.
     *
     * @param path
     * @return
     */
    public String getApplicationResource(String path) {
        return getMiniApp().loadMiniAppResource(path);
    }

    /**
     * Return an instance of the MiniApp control
     *
     * @return
     */
    MiniAppControl getMiniApp() {
        return (MiniAppControl) creator;
    }

    /**
     * Return the current user's clientSession
     *
     * @return
     */
    public WebClientSession getClientSession() {
        return clientSession;
    }

    /**
     * Simple event handler to return some data.   You Bean class can have many differenct @MXEvent handlers that are
     * easily accessibly from your JavaScript MiniApp.   You can have as many MXEventParam args as needed.  While your
     * event handler will return a Java Object, it will be serialized as JSON back to the JavaScript MiniApp.  This
     * serialization happens transparently for you.  If you return a String, then that string contents will not be
     * serialized but it will be returned as is.  If you return Maps, they will be serialized as JSONObject and if you
     * return an Array or List it will be returned as JSONArray.  If you return actual JSONObject or JSONArray from the
     * com.ibm.json4j packages, then those will be sent back to the JavaScript MiniApp correctly.
     * <p>
     * In your MiniApp you can invoke your Bean's event handlers using the fetch() api.
     *
     * <pre>
     * this.fetch("async_get_data", {cmd: 'simple command parameter'}).then(function(data) {
     *    // do something with the data
     * }, function(err) {
     *    console.log(err);
     * });
     * </pre>
     *
     * @param command
     * @return
     */
    @MXEvent("async_get_data")
    public Map<String, String> getMyData(@MXEventParam("cmd") String command) {
        Map<String, String> data = new HashMap<>();
        data.put("name", "Bill");
        data.put("age", "33");
        data.put("command", command);
        return data;
    }
}
