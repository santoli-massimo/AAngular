require('lodash')

class AComponent {
    
    directive(){
    
        let thiscontroller = this.controller
        let injectDependency = this.injectDependecy.bind(this)
        
        return () => {
            
            var scope = {
                source  :   '=',
                title   :   '=',
                limit   :   '=',
                showControls : '='
            }
            var template = this.configuration.template || require('./SortableList.html')
            var controller = ( $scope, $injector ) => {
                
                // Assign directive attributes to this
                _.each( _.keys(scope) , key => {
                    $scope.$watch(key, (val) => this[key] = $scope[key] )
                });
                
                // Assign this to scope
                $scope.ctrl = this;
                
                // Get Injected dependecies
                let InjectedServices = injectDependency($injector, { $scope })
                
                // Call controller and inject dependencies
                thiscontroller.apply( this, InjectedServices )
        
            }
            
            return { scope , template, controller }
            
        }
        
    }
    
    controller(){}
    
    constructor( Configuration ){
    
        this.configuration = {
            template: '',
                model: {},
            title: '',
                table: [],
                defaultOrder: null,
                selected: null,
                limit: 10,
                showControls: true
        };
        
        if( Configuration )
            _.forOwn( Configuration, ( ConfProp, ConfKey ) => { this.configuration[ConfKey] = ConfProp; });
        
    }
    
    injectDependecy( $injector, $extra ){
    
        // Get angular resources
        this.injector = $injector
    
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
                var Service = this.injector.get(param);
                _.set( this , param , Service )
                InjectedServices.push(Service)
            }

        });
        
        return InjectedServices
        
    }
    
    
}

export { AComponent }


