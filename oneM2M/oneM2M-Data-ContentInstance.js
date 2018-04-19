module.exports = function(RED){

    function oneM2MContentInstanceNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.obixCategory = config.obixCategory || 'demo';
		this.obixContainerName = config.obixContainerName || "DATA";
		this.obixData = config.obixData || " ";
		this.obixUnit = config.obixUnit || 'Unit';
		
		
        this.on('input', function(msg) {
            this.xSCL = RED.nodes.getNode(config.xSCL);
            this.xA = RED.nodes.getNode(config.xA);
			msg.headers = {};

            if(this.xA) {
                this.appId = this.xA.appId;
				this.obixRn =this.xA.Rn;
				
				
				
                if (this.xSCL) {
					
					if (this.xSCL.port == "8080"){
						cse_name = "/in-name/"
					}
					else {
						cse_name = "/mn-name/"
					}
				if (this.obixData != "")
				{
					this.obixData = msg.payload;
				}
					
                    msg.method = "POST";
					msg.headers['X-M2M-Origin'] = 'admin:admin';
					msg.headers['Content-Type'] = 'application/xml;ty=4';
					
                    msg.url = "http://" + this.xSCL.host + ":" + this.xSCL.port + "/~/" + this.xSCL.sclId + cse_name + this.obixRn + "/" + this.obixContainerName;
					
				    msg.payload = "<m2m:cin xmlns:m2m='http://www.onem2m.org/xml/protocols'>";
					msg.payload += "<cnf>message</cnf>";
					msg.payload += "<con>";
                    msg.payload += "&lt;obj&gt;";
					msg.payload += "&lt;str name=&quot;appId&quot; val=&quot;" + this.appId + "&quot;/&gt;";
					msg.payload += "&lt;str name=&quot;category&quot; val=&quot;" + this.obixCategory + "&quot;/&gt;";
					msg.payload += "&lt;int name=&quot;data&quot; val=&quot;" + this.obixData + "&quot;/&gt;";
					msg.payload += "&lt;int name=&quot;unit&quot; val=&quot;" + this.obixUnit + "&quot;/&gt;";
					msg.payload += "&lt;/obj&gt;";
					msg.payload += "</con>";
					msg.payload += "</m2m:cin>";
					
                    this.send(msg);
                } else {
                    node.error("No xSCL node configured", msg);
                }
            } else {
                node.error("No xA configured", msg);
            }
        });
    }

    RED.nodes.registerType("oneM2M-Data-ContentInstance",oneM2MContentInstanceNode);
}
