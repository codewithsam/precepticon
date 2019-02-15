const Case = require('./Case');
class RuleSet{
    constructor(config){
        this.caseInstanceList = [];
        if(!config.expressions) throw new Error("Config must contain expressions property");
        let caseConfig = config.expressions;
        if(!caseConfig.hasOwnProperty("all") && !caseConfig.hasOwnProperty("any"))
            throw new Error('Atleast 1 boolean property (any,all) must exist');
        let op = this.conditionalOp = Case.getConditionalOperatorValue(caseConfig);
        this.iterMethod = this.isSomeOrEvery(op);
        if(!Array.isArray(caseConfig[op])) throw new Error("[Any] or [All] property should be an array");
        this.caseList = caseConfig[op];

        this.caseList = this.caseList.sort((a,b)=>{
            if(a.priority > b.priority) return -1;
            if(a.priority < b.priority) return 1;
            if(a.priority === b.priority) return 0;
        });
        this.caseList.map((caseBlock)=>{
            this.caseInstanceList.push(new Case(caseBlock));
        });
    }
    validate(state){
        this.iterMethod.call(this.caseInstanceList, (caseInstance)=>{
            return caseInstance.validate(state);
        });
    }
    static getConditionalOperatorValue(config){
        if(config.hasOwnProperty("any")) return "any";
        if(config.hasOwnProperty("all")) return "all";
    }
    isSomeOrEvery(op){
        if(op === "any") return Array.prototype.some;
        if(op === "all") return Array.prototype.every;
    }
}
module.exports = RuleSet;