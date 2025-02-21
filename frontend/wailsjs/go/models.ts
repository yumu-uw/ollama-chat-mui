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
	export class LLMModel {
	    ModelName: string;
	    Default: boolean;
	
	    static createFrom(source: any = {}) {
	        return new LLMModel(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ModelName = source["ModelName"];
	        this.Default = source["Default"];
	    }
	}
	export class OllamaEndpoint {
	    Name: string;
	    Endpoint: string;
	    LLMModels: LLMModel[];
	    Default: boolean;
	
	    static createFrom(source: any = {}) {
	        return new OllamaEndpoint(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.Endpoint = source["Endpoint"];
	        this.LLMModels = this.convertValues(source["LLMModels"], LLMModel);
	        this.Default = source["Default"];
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
	export class ConfigJson {
	    AppTheme: string;
	    OllamaEndpoints: OllamaEndpoint[];
	
	    static createFrom(source: any = {}) {
	        return new ConfigJson(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.AppTheme = source["AppTheme"];
	        this.OllamaEndpoints = this.convertValues(source["OllamaEndpoints"], OllamaEndpoint);
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

