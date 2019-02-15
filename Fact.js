const Operator = require('./Operator');

class Fact{
    constructor(config){
        if(typeof config !== "object") throw new Error("Fact should be an object");
        this.name = config.fact;
        if(!config.operator && !(config.matchCriteria && config.matchCriteria.validator)) throw new Error("Fact object must contain either operator or matchCriteria property (a validator function must exist in matchCriteria property)");
        this.operator = config.operator;
        this.matchCriteria = config.matchCriteria;
        this.typeOfValue = typeof config.value;
        this.value = config.value;
        this.operatorMap = Fact.getOperatorMap();
        this.hooks = config.hooks;
        this.operation;
    }

    validate(state){
        let factResult = false;
        let postHookResult;
        if(!typeof state === "object") throw new Error("state should be an object");
        if(!state.hasOwnProperty(this.name)) return false;
        if(this.typeOfValue === "function"){
            this.value = this.value();
            if(typeof this.value === "undefined") throw new Error("Value function should return something");
        }
        if(this.hooks && this.hooks.pre){
            this.value = this.hooks.pre(this.value);
        }
        if(this.operator){
            let operation = this.operation = this.operatorMap.find((operatorInstance)=>{
                return operatorInstance.name === this.operator;
            });
            factResult = operation.validate(this.value, state[this.name]);
        }
        if(this.matchCriteria){
            let filteredObject = {};
            filteredObject.stateValue = state[this.name];
            filteredObject.factValue = this.value;
            filteredObject.matchCriteria = Object.assign({},this.matchCriteria);
            delete filteredObject.matchCriteria.validator;
            factResult = this.matchCriteria.validator.call(this,filteredObject);
        }
        if(this.hooks && this.hooks.post){
            postHookResult = this.hooks.post.call(this, this.value, state[this.name],factResult);
            if(typeof postHookResult !== "boolean" && typeof postHookResult !== "undefined") throw new Error("Post hook function must always return either boolean or undefined");
        }
        if(typeof postHookResult === "undefined") return factResult;
        return postHookResult;
    }

    static getOperatorMap(){
        let operatorList = [];
        operatorList.push(new Operator('=', (a, b) => a === b))
        operatorList.push(new Operator('!=', (a, b) => a !== b))
        operatorList.push(new Operator('includes', (a, b) => {
            if((!Array.isArray(a) || !Array.isArray(b))&&(!typeof a==="string" || !typeof b==="string")) 
                throw new Error("Both fact value and state value should be an array");
            return a.includes(b);
        }));
        operatorList.push(new Operator('excludes', (a, b) => {
            if((!Array.isArray(a) || !Array.isArray(b))&&(!typeof a==="string" || !typeof b==="string")) 
                throw new Error("Both fact value and state value should be an array");
            return !a.includes(b);
        }));
        operatorList.push(new Operator('indexOf', (a, b) => {
            if((!Array.isArray(a) || !Array.isArray(b))&&(!typeof a==="string" || !typeof b==="string")) 
                throw new Error("Both fact value and state value should be an array");
            return (a.indexOf(b) !== -1 || b.indexOf(a) !== -1)
        }));
        operatorList.push(new Operator('<', (a, b) => {
            return a < b
        }));
        operatorList.push(new Operator('<=', (a, b) =>{ 
            if(Number.parseFloat(a).toString() === 'NaN' || Number.parseFloat(b).toString() === 'NaN') throw new Error("Both fact value and state value should be a number")
            return a <= b 
        }));
        operatorList.push(new Operator('>', (a, b) =>{ 
            if(Number.parseFloat(a).toString() === 'NaN' || Number.parseFloat(b).toString() === 'NaN') throw new Error("Both fact value and state value should be a number")            
            return a > b
        }));
        operatorList.push(new Operator('>=', (a, b) =>{ 
            if(Number.parseFloat(a).toString() === 'NaN' || Number.parseFloat(b).toString() === 'NaN') throw new Error("Both fact value and state value should be a number")            
            return a >= b
        }));
        return operatorList;
    }
}

module.exports = Fact;