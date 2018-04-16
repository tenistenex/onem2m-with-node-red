module.exports = function(RED){
	
	function oneM2MSubscriptionNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
        this.notificationURI = config.notificationURI || '';
		this.obixApp = config.obixApp;
		this.obixRn = config.obixRn;
		this.obixData = config.obixData;

		this.on('input', function(msg) {
            this.xSCL = RED.nodes.getNode(config.xSCL);
            this.xA = RED.nodes.getNode(config.xA);
			msg.headers = {};

                if (typeof this.xSCL !== 'undefined') {
					
					if (this.xSCL.port == "8080"){
						cse_name = "/in-name/"
					}
					else {
						cse_name = "/mn-name/"
					}
					
                    msg.method = "POST";
					msg.headers['X-M2M-Origin'] = 'admin:admin';
					msg.headers['Content-Type'] = 'application/xml;ty=23';
				    msg.url = "http://" + this.xSCL.host + ":" + this.xSCL.port + "/~/" + this.xSCL.sclId + cse_name + this.obixApp +"/" +  this.obixData;
                    msg.payload =  "<m2m:sub xmlns:m2m='http://www.onem2m.org/xml/protocols' rn=" +"\"" + this.obixRn + "\""+ ">";
                    msg.payload += "<nu>" + this.notificationURI + "</nu>"
					msg.payload += "<nct>2</nct>"
					msg.payload += "</m2m:sub>"
                
                    this.send(msg);
                } else {
                    node.error("No xSCL configured", msg);
                }
		});   
	}

	RED.nodes.registerType("oneM2M-Subscription",oneM2MSubscriptionNode);
}
