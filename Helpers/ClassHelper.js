class ClassHelper {
    
    /**
     *
     * @returns {Array<String>}
     * @param Target :Class
     */
    static getOwnMethodsNames( Target ) {

        // Distinguish between Class and Instance
        Target = ClassHelper.isClass(Target) ? Target.prototype : Object.getPrototypeOf(Target)
    
        // Get Property names
        let propertyNames = Object.getOwnPropertyNames( Target )
        
        // Return methods
        return _.filter( propertyNames, ( e , i) => { return  typeof _.get(Target, e) == 'function'} )
        
    }
    
    /**
     *
     * @param topClass : Class|Instance
     * @param bottomClass : Class
     * @returns {Array<String>}
     */
    static getOwnMethodsNamesDeep ( topClass, bottomClass ){
        
        var methods = [];
    
        // Cicle trough prototype chain
        while ( (topClass instanceof bottomClass) && ( Object.getPrototypeOf(topClass) instanceof bottomClass) && ( topClass = Object.getPrototypeOf(topClass) ) )
            methods = methods.concat( ClassHelper.getOwnMethodsNames(topClass) );
    
        // return methods
        return methods
        
    }
    
    /**
     *
     * @param Target
     * @returns {boolean}
     */
    static isClass( Target ) {

        // @TODO : tested only with babel, need to check if works on pure es6 environment
        return typeof Target === 'function' &&
            ( /^(?:class|function (?:[A-Z]|_class))/.test(Target) || Object.getOwnPropertyDescriptor(Target, 'prototype').writable == false )
 
    }
    
    
}
export { ClassHelper}
