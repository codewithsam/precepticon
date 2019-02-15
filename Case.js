const Fact = require('./Fact');
class Case{
    constructor(config){
        this.priority = parseInt(config.priority, 10) || 1;
        this.key = config.key;
        if(!config.hasOwnProperty("all") && !config.hasOwnProperty("any")) 
            throw new Error('Atleast 1 boolean property (any,all) must exist');
        let op = this.conditionalOp = Case.getConditionalOperatorValue(config);
        this.iterMethod = this.isSomeOrEvery(op);
        if(!Array.isArray(config[op])) throw new Error("[Any] or [All] property should be an array");
        this.factsList = config[op].map((factBlock)=>{
            return new Fact(factBlock);
        });
        this.matched = false;
        this.onSuccess = config.onSuccess;
        this.onFailure = config.onFailure;
    }
    
    static getConditionalOperatorValue(config){
        if(config.hasOwnProperty("any")) return "any";
        if(config.hasOwnProperty("all")) return "all";
    }
    validate(state){
        this.matched = this.iterMethod.call(this.factsList, (fact)=>{
            return fact.validate(state);
        });
        if(this.matched){
            if(this.onSuccess && typeof this.onSuccess !== "function") throw new Error("onSucess should be a function");
            if(this.onSuccess) this.thence = this.onSuccess.call(this);
        }else{
            if(this.onFailure && typeof this.onFailure !== "function") throw new Error("onFailure should be a function");
            if(this.onFailure) this.onFailure.call(this);
        }
        return this.matched;
    }
    isSomeOrEvery(op){
        if(op === "any") return Array.prototype.some;
        if(op === "all") return Array.prototype.every;
    }
    getKey(){
        return this.key;
    }
    getThence(){
        return this.thence;
    }
}

module.exports = Case;