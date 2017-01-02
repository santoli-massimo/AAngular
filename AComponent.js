require('lodash')

class AComponent {
    
    static directive( Configuration ){
        
        let self = new this()
        
        return () => {
            
            var directiveConfig = {
                scope    : _.get( Configuration, 'bindings') || _.get( self, 'configuration.bindings') || {},
                template : _.get( Configuration, 'template') || _.get( self, 'configuration.template') || '',
                controller : ( $scope, $injector ) => {
                    
                    // Create new AComponent instance
                    let self = new this();
    
                    // Merge self configuration with configuration provided
                    if( Configuration )
                        _.forOwn( Configuration, ( ConfProp, ConfKey ) => { self.configuration[ConfKey] = ConfProp; });
    
                    // Assign directive attributes to this
                    _.each( _.keys(directiveConfig.scope) , key => $scope.$watch(key, (val) => self[key] = $scope[key] ));
                    
                    // Assign this to scope
                    $scope.ctrl = self;
                    
                    // Get Injected dependecies
                    let InjectedServices = self.injectDependecy.apply(self, [ $injector, { $scope } ])
                    
                    // Call controller and inject dependencies
                    self.controller.apply( self, InjectedServices )
                    
                }
            };
            
            return directiveConfig
            
        }
        
    }
    
    
    injectDependecy( $injector, $extra ){
        
        // Get Controller Paramenter
        let ArgumentsList = this.controller.toString().match(/\((?:.+(?=\s*\))|)/)[0].slice(1).split(/\s*,\s*/g);
        
        // Inject Dependencies
        let InjectedServices = []
        
        _(ArgumentsList).each( param => {
            
            if( $extra.hasOwnProperty(param) )
            {
                InjectedServices.push( $extra[param] )
                _.set( this , param , $extra[param] )
            }
            else{
                var Service = $injector.get(param);
                _.set( this , param , Service )
                InjectedServices.push(Service)
            }

        });
        
        return InjectedServices
        
    }
    
    
}

export { AComponent }


