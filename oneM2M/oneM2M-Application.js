module.exports = function(RED){
	
	function oneM2MApplicationNode(config) {
		RED.nodes.createNode(this,config);
        var req
		var node = this;
        this.obixType = config.obixType || 'demo';
		this.obixCategory = config.obixCategory || 'demo';
		this.obixLocation = config.obixLocation || 'demo';
		this.obixRr = config.obixRr || false;
        this.obixAnnounce = config.obixAnnounce || false;
		this.obixPoA = config.obixPoA;
		
		
		

		this.on('input', function(msg) {
            this.xSCL = RED.nodes.getNode(config.xSCL);
            this.xA = RED.nodes.getNode(config.xA);
			msg.headers = {};
			
            if(typeof this.xA !== 'undefined') {
                this.appId = this.xA.appId;
				this.obixRn = this.xA.Rn;

                if (typeof this.xSCL !== 'undefined') {
                    msg.method = "POST";
					msg.headers['X-M2M-Origin'] = 'admin:admin';
					msg.headers['Content-Type'] = 'application/xml;ty=2';
                    msg.url = "http://" + this.xSCL.host + ":" + this.xSCL.port + "/~/" + this.xSCL.sclId;
                    msg.payload =  "<m2m:ae xmlns:m2m=" + "\"" + "http://www.onem2m.org/xml/protocols" + "\"" + " rn="+ "\""+ this.obixRn + "\""+ ">";
				    msg.payload += "<api>" + this.appId + "</api>";
                    msg.payload += "<lbl>Type/" + this.obixType + " Category/" + this.obixCategory + " Location/" + this.obixLocation + "</lbl>";
					msg.payload += "<poa>" + this.obixPoA + "</poa>"
					
					if (this.obixRr == true) {
                        msg.payload+="<rr>true</rr>";
                    }
					else {
						 msg.payload+="<rr>false</rr>";
					}
                   
                    msg.payload += "</m2m:ae>";

                    

                    this.send(msg);
                } else {
                    node.error("No xSCL configured", msg);
                }
            } else {
                node.error("No xA configured", msg);
            }
		});   
	}

	RED.nodes.registerType("oneM2M-Application",oneM2MApplicationNode);
}
