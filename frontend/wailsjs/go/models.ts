export namespace model {
	
	export class Chat {
	    role: string;
	    content: string;
	
	    static createFrom(source: any = {}) {
	        return new Chat(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.role = source["role"];
	        this.content = source["content"];
	    }
	}
	export class OllamaEndpoint {
	    EndpointName: string;
	    EndpointUrl: string;
	    LLMModels: string[];
	    DefaultLLMModel: string;
	
	    static createFrom(source: any = {}) {
	        return new OllamaEndpoint(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.EndpointName = source["EndpointName"];
	        this.EndpointUrl = source["EndpointUrl"];
	        this.LLMModels = source["LLMModels"];
	        this.DefaultLLMModel = source["DefaultLLMModel"];
	    }
	}
	export class ConfigJson {
	    AppTheme: string;
	    OllamaEndpoints: OllamaEndpoint[];
	    DefaultOllamaEndPointName: string;
	
	    static createFrom(source: any = {}) {
	        return new ConfigJson(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.AppTheme = source["AppTheme"];
	        this.OllamaEndpoints = this.convertValues(source["OllamaEndpoints"], OllamaEndpoint);
	        this.DefaultOllamaEndPointName = source["DefaultOllamaEndPointName"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

