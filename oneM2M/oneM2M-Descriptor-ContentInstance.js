module.exports = function(RED){

    function oneM2MDescriptorMetaNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.obixType = config.obixType;
        this.obixLocation = config.obixLocation;
        this.on('input', function(msg) {
            this.xSCL = RED.nodes.getNode(config.xSCL);
            this.xA = RED.nodes.getNode(config.xA);
			msg.headers = {};

            if(this.xA) {
                this.appId = this.xA.appId;
				this.obixRn = this.xA.Rn;
                if (this.xSCL) {
                    msg.method = "POST";
					msg.headers['X-M2M-Origin'] = 'admin:admin';
					msg.headers['Content-Type'] = 'application/xml;ty=4';
					
                    msg.url = "http://" + this.xSCL.host + ":" + this.xSCL.port + "/~/" + this.xSCL.sclId + "/in-name/" + this.obixRn + "/DESCRIPTOR";
					/*
                    msg.payload =  "<m2m:cin xmlns:m2m=" + "\"" + "http://www.onem2m.org/xml/protocols" + "\"" + ">";
                    msg.payload += "<cnf>application/xml</cnf>";
                    msg.payload += "<con>";
                    msg.payload += "&lt;obj&gt;";
                    msg.payload += "&lt;str name=&quot;type&quot; val=&quot;" + this.obixType + "&quot;/&gt;";
					msg.payload += "&lt;str name=&quot;location&quot; val=&quot;" + this.obixLocation + "&quot;/&gt;";
                    msg.payload += "&lt;str name=&quot;appId&quot; val=&quot;" + this.appId + "&quot;/&gt;";
					msg.payload += "&lt;op name=&quot;getValue&quot; href=&quot;/in-cse/in-name/" + this.obixRn + "/DATA/la&quot;";
					msg.payload += "in=&quot;obix:Nil&quot; out=&quot;obix:Nil&quot; is=&quot;retrieve&quot;/&gt;";
					msg.payload += "&lt;/obj&gt;";
					msg.payload += "</con>";
					msg.payload += "</m2m:cin>";*/
					msg.payload = "<m2m:cin xmlns:m2m='http://www.onem2m.org/xml/protocols'><cnf>application/xml</cnf><con>&lt;obj&gt;&lt;str name=&quot;type&quot; val=&quot;" + this.obixType + "&quot;/&gt;&lt;str name=&quot;location&quot; val=&quot;" + this.obixLocation + "&quot;/&gt;&lt;str name=&quot;appId&quot; val=&quot;" + this.appId + "&quot;/&gt;&lt;op name=&quot;getValue&quot; href=&quot;/in-cse/in-name/" + this.obixRn + "/DATA/la&quot; in=&quot;obix:Nil&quot; out=&quot;obix:Nil&quot; is=&quot;retrieve&quot;/&gt;&lt;/obj&gt;</con></m2m:cin>"
					
                    this.send(msg);
                } else {
                    node.error("No xSCL node configured", msg);
                }
            } else {
                node.error("No xA configured", msg);
            }
        });
    }

    RED.nodes.registerType("oneM2M-Descriptor-ContentInstance",oneM2MDescriptorMetaNode);
}
