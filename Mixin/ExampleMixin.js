import { Mixin } from '../Classes/Mixin'

/**
 *
 *  This is an example that shows how to create a simple mixin class
 *  It use the 'Mixin' Class to convert any existing Class to a functional mixin
 *  You can mix the class with target via es7 Decorator
 *
 *  class TargetClass {
 *      @ExampleMixable
 *      ...
 *  }
 *
 */

class ExampleMixin {
    
    checkIfImWorking( attribute ){
        console.log('mixin', attribute);
    }
    
    anotherCheck( attribute ){
        console.log('another mixin', attribute);
    }
    
}

let ExampleMixable = Mixin.hardmixin( ExampleMixin )

export { ExampleMixable }
