require('lodash')

class AComponent {
    
    static directive( Configuration ){
        
        let self = new this()
        
        return () => ({
            
            scope    : _.get( Configuration, 'bindings') || _.get( self, 'configuration.bindings') || {},
            template : _.get( Configuration, 'template') || _.get( self, 'configuration.template') || '',
            
            controller : ( $scope, $element , $attrs, $transclude, $injector, $compile ) => {
                
                // Create new AComponent instance
                let self = new this();
                self.compile = $compile;
                
                // Merge self configuration with configuration provided
                if( Configuration = _.cloneDeep(Configuration) )
                    _.forOwn( Configuration, ( ConfProp, ConfKey ) => { self.configuration[ConfKey] = ConfProp; });
                    
                // Assign directive attributes to this
                _.each( $attrs.$attr , key => $scope.$watch(key, (val) => {
    
                        self[key] = ( n => {
        
                            if ( $scope[key] != undefined ) return $scope[key]
                            if ( _.get(Configuration, key) != undefined) return _.get(Configuration, key)
                            return _.get( self, 'configuration.' + key )
        
                        })()
                        
                    })
                );
                
                // Assign self to scope via alias
                $scope.ctrl = self;
                
                // Inject dependencies
                _.each( self.getAllMethods(self), ( e, i ) => {
                        
                    let InjectedServices = self.injectDependecy.apply( self, [ $injector, { $scope } , self[e] ] )
                    let thisMethod = self[e];

                    self[e] = ( ...args ) => {
                        args = _.concat(args, InjectedServices)
                        return thisMethod.apply( self, args )
                    }

                });
   
                self.controller()
                
            }
                
        })
        
    }
    
    getAllMethods(obj) {
        
        var props = [];
        var iter = obj
        
        // do {
        //     props = props.concat(Object.getOwnPropertyNames(iter));
        // } while ( (iter instanceof AComponent) && ( iter = Object.getPrototypeOf(iter) ) );
        while ( (iter instanceof AComponent) && ( Object.getPrototypeOf(iter) instanceof AComponent) && ( iter = Object.getPrototypeOf(iter) ) )
            props = props.concat(Object.getOwnPropertyNames(iter));
        
        // return props
        return _.filter( props, ( e , i) => { return  typeof _.get(obj, e) == 'function'} )

        
    }
    
    getAllMethodParams( method ){
    
        return method.toString().match(/\((?:.+(?=\s*\))|)/)[0].slice(1).split(/\s*,\s*/g);
        
    }
    
    injectDependecy( $injector, $extra , $sourceMethod ){
        
        // Get Controller Paramenter
        let ArgumentsList = this.getAllMethodParams( $sourceMethod )
        
        // Inject Dependencies
        let InjectedServices = []
        
        try {
    
            _(ArgumentsList).each(param => {
        
                if (param && $extra.hasOwnProperty(param)) {
                    InjectedServices.push($extra[param])
                    // if( ! _.get(this, param)  ) _.set( this , param , $extra[param] )
                }
                else if (param) {
                    var Service = $injector.get(param);
                    // if( ! _.get(this, param)  ) _.set( this , param , Service )
                    if (!_.get(InjectedServices, Service)) InjectedServices.push(Service)
                }
        
            });
        }
        catch( e ){
            // console.log( e );
        }
        
        return InjectedServices
        
    }
    
}

export { AComponent }


