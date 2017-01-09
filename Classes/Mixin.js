import 'lodash'
import { ClassHelper } from '../Helpers/ClassHelper'

class Mixin {
    
    /**
     *
     * @param Source
     * @returns {function(*=)}
     */
    static hardmixin( Source ){
        
        return target => {
            
            // @TODO: trow also a transpiler error
            if( ! ClassHelper.isClass( Source ) ) new Error([ 'Parameter Source Must be a Class definition' ])
            
            let methodNames = _.pull( ClassHelper.getOwnMethodsNames( Source ), 'constructor' )
            
            methodNames.forEach( e => { _.set( target, e, _.get( Source.prototype, e) ) } )
            
        }
        
    }
    
    /**
     *
     * @param Source
     * @returns {function(*=)}
     */
    static softmixin( Source ){
         
        return target => {
            
            let methodNames = ClassHelper.getOwnMethodsNames( Source )
            methodNames.forEach( e =>  {
                if( !target.hasOwnProperty(e) ) _.set( target, e, _.get( Source.prototype, e) )
            })
            
        }
        
    }
    
}

export { Mixin }
