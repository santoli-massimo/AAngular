class ClassHelper {
    
    static restricted = [ 'caller' , 'arguments' ]
    
    /**
     *
     * @returns {Array<String>}
     * @param Target :Class
     */
    static getOwnMethodsNames( Target ) {
    
        // Distinguish between Class and Instance
        Target = ClassHelper.isClass(Target) ? Object.getPrototypeOf( new Target() ) : Object.getPrototypeOf(Target)
        
        // Get Object property names removing function restricted property
        let propertyNames = _.filter( Object.getOwnPropertyNames( Target ), name => _.indexOf(ClassHelper.restricted, name) === -1 )
        
        // Return list containing object method names
        return _.filter( propertyNames, ( e , i) => { return typeof _.get(Target, e) === 'function'} )
        
    }
    
    /**
     *
     * @param topClass : Object
     * @param bottomClass : Object
     * @returns {Array}
     */
    static getOwnMethodsNamesDeep ( topClass, bottomClass ){
        
        let methods = [];
    
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
        return typeof Target === 'function'
            && ( /_classCallCheck/.test(Target.toString()) || Object.getOwnPropertyDescriptor(Target, 'prototype').writable === false )
 
    }
    
    /**
     *
     * @param Target
     * @returns {Array|{index: number, input: string}}
     */
    static getClassName ( Target ) {
        
        // Instance
        if( typeof Target !== 'function' ) return Target.constructor.name
        
        // Class Definition
        return Target.name || /^function\s+([\w\$]+)\s*\(/.exec( Target.toString() ) || /^function\s+([\w\$]+)\s*\(/.exec( Target.toString() )
        
    }
    
    
}
export { ClassHelper}
