import { AComponent } from '../Classes/AComponent'

/**
 *
 *  This is an example that shows how to use 'AComponent' to write pure class-based Angularjs code
 *  Every method has dependecy injection enabled
 *
 */

class ExampleComponent extends AComponent {
    
    constructor(){
        super()
        
        this.configuration = {
            
            // Arbitrary config options
            MyconfigOption : 'MyconfigOption',
            MyconfigOption2 : 'MyconfigOption2',
            
            // Directive config options
            template: 'String conaining an angular html template',
            bindings : {
                abinding: '=',
                anotherBinding: '&',
                anotherbinding: '<',
            }
        }
    }
    
    /**
     *  Has angular dependecy injection enabled
     */
    controller( MyAngularService, $scope ){
        console.log('MyAngularService', MyAngularService)
        this.anothermethod( 'imastring' , { 'im' : 'object' } )
    }
    
    /**
     *  You can pass Your parameterd and Every Angular injectable service via dependency injection
     */
    anothermethod( myAttribute, anotherAttribute, MyAngularService, $scope){
        console.log(myAttribute, anotherAttribute, MyAngularService)
    }
    
}


/**
 *
 *  This is an example that shows how to Extend A Class
 *  Every method has dependecy injection enabled
 *  You can extend the constructor (Optional)
 *
 */

class ExampleComponentExender extends ExampleComponent {
    
    
    controller( MyAngularService, $scope ){
        console.log('Im a subclass' , 'MyAngularService', MyAngularService)
        this.anothermethod( 'imastring from subclass' , { 'im' : 'object from subclass' } )
    }
    
    
}

