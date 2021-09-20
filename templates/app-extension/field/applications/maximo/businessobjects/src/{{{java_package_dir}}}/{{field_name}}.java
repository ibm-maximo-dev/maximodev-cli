package {{java_package}};

import psdi.mbo.MboValue;
import psdi.mbo.MboValueAdapter;
/**
 * Field class to extend the original one
 * @author masmanagedev-cli
 *
 */
public class {{field_name}} extends MboValueAdapter {
	/**
	 * Construct and attach to the mbo value.
	 */
	public {{field_name}}(MboValue mbv) {
		super(mbv);
	} // constructor

	/*
	 * Do not forget to override the validate method.
	 * Call super when necessary.
	 *
	 * */
}