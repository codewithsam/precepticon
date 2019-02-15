const ruleSet = require('./Ruleset');

let instance = null;
class Preceptor{
    constructor(){
        if(instance) return instance;
        instance = this;
        this.operatorList = [];
    }
    addRules(ruleSet){
        this.ruleSettings = ruleSet;
    }
    validate(state){
        if(typeof state !== "object" && Object.keys(state).length<1) throw new Error("state should be an object with atleast one property");
        this.ruleSettings.validate(state);
        return this;
    }
    then(cb){
        let validcase = this.ruleSettings.caseInstanceList.filter((caseInstance)=>caseInstance.matched);
        return cb(validcase);
    }

    isSomeOrEvery(op){
        if(op === "any") return Array.prototype.some;
        if(op === "all") return Array.prototype.every;
    }

};

module.exports = Preceptor;