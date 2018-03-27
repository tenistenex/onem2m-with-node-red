module.exports = function(RED){
	
	function oneM2MDataContainerNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		this.maxNrOfInstances = config.maxNrOfInstances || '10';
        this.obixAnnounce = config.obixAnnounce || false;
		this.obixContainerName = config.obixContainerName || "DATA";

		this.on('input', function(msg) {
            this.xSCL = RED.nodes.getNode(config.xSCL);
            this.xA = RED.nodes.getNode(config.xA);
			msg.headers = {};

            if(this.xA) {
                this.appId = this.xA.appId;
				this.obixRn =this.xA.Rn;

                if (this.xSCL) {
                    msg.method = "POST";
					msg.headers['X-M2M-Origin'] = 'admin:admin';
					msg.headers['Content-Type'] = 'application/xml;ty=3';
                    msg.url = "http://" + this.xSCL.host + ":" + this.xSCL.port + "/~/" + this.xSCL.sclId + "/in-name/" + this.obixRn;
                    msg.payload =  "<m2m:cnt xmlns:m2m=" + "\"" + "http://www.onem2m.org/xml/protocols" + "\"" + " rn=" + "\"" + this.obixContainerName +"\""+ ">" + "</m2m:cnt>";
                    this.send(msg);
                } else {
                    node.error("No xSCL node configured", msg);
                }
            } else {
                node.error("No xA configured", msg);
            }
		});   
	}

	RED.nodes.registerType("oneM2M-Data-Container",oneM2MDataContainerNode);
}
