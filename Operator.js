class Operator{
    constructor (name, comparer) {
        this.name = String(name)
        if (!name) throw new Error('Operator type must not be null');
        if (typeof comparer !== 'function') throw new Error('Comparer function must present');
        this.compareWith = comparer;
      }

      validate (factValue, stateValue) {
          if(typeof factValue === "undefined" || typeof stateValue === "undefined") return false;
        return this.compareWith(stateValue, factValue);
      }
}
module.exports = Operator;