require('lodash')

class AComponent {
    
    static directive( Configuration ){

        return () => ({
            
            scope    : _.get( Configuration, 'bindings') || _.get( new this(), 'configuration.bindings') || {},
            controller : ( $scope, $element , $attrs, $transclude, $injector, $compile ) => {
                
                // Create new AComponent instance
                let self = new this();
                
                // Merge self configuration with configuration provided
                if( Configuration = _.cloneDeep(Configuration) )
                    _.forOwn( Configuration, ( ConfProp, ConfKey ) => { self.configuration[ConfKey] = ConfProp; });
                    
                // Assign directive attributes to this
                _.each( $attrs.$attr , key => $scope.$watch(key, (val) => {
    
                        self[key] = ( n => {
        
                            if ( $scope[key] !== undefined ) return $scope[key]
                            if ( _.get(Configuration, key) !== undefined) return _.get(Configuration, key)
                            return _.get( self, 'configuration.' + key )
        
                        })()
                        
                    })
                );
                
                // Assign self to scope via alias
                $scope.ctrl = self;
                
                
                self.injectDependencies( self, $injector, { $scope, $compile, $element } )
                // Add dependecy injection to object methods
                // self.injectDependenciesDeep( self, $injector, { $scope, $compile, $element } )
                self.injectDependenciesDeep( self, $injector, { $scope, $compile, $element } )
   
                // Render template
                self.render( $scope, $compile, $element , _.get( Configuration, 'template') || _.get( self, 'configuration.template') )
                
                // Execute controller
                self.controller()
                
            }
                
        })
        
    }

    
    render( $scope, $compile, $element, template) {
        
        // Set template
        template = template || $element.html()
        // Clear element
        $element.html("");
        // Append rendered html
        $element.append( $compile( template )( $scope ) );
        
    }
    
    // Apply dependency injection only to top level object
    injectDependencies( obj, $injector, $extra) {
        
        _( this.getObjectMethods(obj) ).each ( e => {
            
            let thisMethod = obj[e]
            let InjectedServices = obj.getMethodDependecies.apply( obj, [ $injector, $extra , thisMethod ] )
            
            obj[e] = ( ...args ) => {
                args = _.concat(args, InjectedServices)
                return thisMethod.apply( obj, args )
            }
            
        });
        
    }
    
    // Apply dependency injection to all the prototype chain
    injectDependenciesDeep( obj, $injector, $extra ){

        var iter = Object.getPrototypeOf(obj)
        
        // Cicle trough prototype chain
        do
        {
            let properties = _.filter( Object.getOwnPropertyNames( iter ),  e => typeof _.get( iter, e ) === 'function' )
            
            _(properties).each ( e => {

                let thisObject = iter
                let thisMethod = iter[e]
                let InjectedServices = this.getMethodDependecies.apply( iter, [ $injector, $extra , thisMethod ] )

                iter[e] = ( ...args ) => {
                    args = _.concat(args, InjectedServices)
                    return thisMethod.apply( thisObject, args )
                }

            });
            
        }
        while ( (iter instanceof AComponent) && ( Object.getPrototypeOf(iter) instanceof AComponent) && ( iter = Object.getPrototypeOf(iter) ) )

    }
    
    getObjectMethods(obj) {
        
        var props = [];
        var iter = obj
        
        // Cicle trough prototype chain
        while ( (iter instanceof AComponent) && ( Object.getPrototypeOf(iter) instanceof AComponent) && ( iter = Object.getPrototypeOf(iter) ) )
            props = props.concat(Object.getOwnPropertyNames(iter));
        
        // return props
        return _.filter( props, ( e , i) => { return  typeof _.get(obj, e) === 'function'} )
        
    }
    
    getMethodDependecies( $injector, $extra , $sourceMethod ){
        
        // Get Controller Paramenter
        let ArgumentsList = this.getMethodParams( $sourceMethod )
        
        // Inject Dependencies
        let InjectedServices = []
    
        _(ArgumentsList).each(param => {
    
            try {
                if (param && $extra.hasOwnProperty(param)) {
                    InjectedServices.push($extra[param])
                    // if( ! _.get(this, param)  ) _.set( this , param , $extra[param] )
                }
                else if (param) {
                    var Service = $injector.get(param);
                    // if( ! _.get(this, param)  ) _.set( this , param , Service )
                    if (!_.get(InjectedServices, Service)) InjectedServices.push(Service)
                }
        
            }
            catch( e ){
                // console.log( e );
            }
        
        });
        
        return InjectedServices
        
    }
    
    getMethodParams( method ){ return method.toString().match(/\((?:.+(?=\s*\))|)/)[0].slice(1).split(/\s*,\s*/g); }
    
}

export { AComponent }


